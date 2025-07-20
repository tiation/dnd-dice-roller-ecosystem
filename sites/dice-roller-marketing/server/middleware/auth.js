const jwt = require('jsonwebtoken');
const db = require('../config/database');
const redis = require('../config/redis');
const logger = require('../utils/logger');

// JWT Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    let token = null;

    // Check Authorization header
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Check API Key header for API access
    const apiKey = req.header('X-API-Key');
    if (apiKey && !token) {
      return await handleAPIKeyAuth(req, res, next, apiKey);
    }

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await db('users').where({ id: decoded.id }).first();
    if (!user) {
      return res.status(401).json({ error: 'Invalid token - user not found' });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      subscriptionTier: user.subscription_tier,
      apiKey: user.api_key
    };

    req.authMethod = 'jwt';
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    logger.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// API Key Authentication Handler
const handleAPIKeyAuth = async (req, res, next, apiKey) => {
  try {
    // Check Redis cache first
    let userCache = await redis.getAPIKeyCache(apiKey);
    
    if (!userCache) {
      // Cache miss - check database
      const user = await db('users').where({ api_key: apiKey }).first();
      if (!user) {
        return res.status(401).json({ error: 'Invalid API key' });
      }

      // Cache the user data
      await redis.cacheAPIKey(apiKey, user.id);
      userCache = { userId: user.id };
    }

    // Get full user data
    const user = await db('users').where({ id: userCache.userId }).first();
    if (!user) {
      // Clean up invalid cache
      await redis.deleteCache(`apikey:${apiKey}`);
      return res.status(401).json({ error: 'Invalid API key' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      subscriptionTier: user.subscription_tier,
      apiKey: user.api_key
    };

    req.authMethod = 'api_key';
    next();
  } catch (error) {
    logger.error('API Key auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const apiKey = req.header('X-API-Key');
    
    if (!authHeader && !apiKey) {
      return next();
    }

    // Try to authenticate but don't fail if invalid
    auth(req, res, (err) => {
      if (err) {
        // Clear any partial user data and continue
        req.user = null;
        req.authMethod = null;
      }
      next();
    });
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Role-based access control
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRoles = req.user.roles || [];
    const hasRole = roles.some(role => userRoles.includes(role));

    if (!hasRole) {
      logger.security('UNAUTHORIZED_ACCESS_ATTEMPT', {
        userId: req.user.id,
        requiredRoles: roles,
        userRoles,
        endpoint: req.path
      });
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Subscription tier check
const requireTier = (minTier) => {
  const tierHierarchy = {
    'free': 0,
    'pro': 1,
    'enterprise': 2
  };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userTierLevel = tierHierarchy[req.user.subscriptionTier] || -1;
    const requiredTierLevel = tierHierarchy[minTier] || 999;

    if (userTierLevel < requiredTierLevel) {
      return res.status(403).json({
        error: 'Subscription upgrade required',
        currentTier: req.user.subscriptionTier,
        requiredTier: minTier
      });
    }

    next();
  };
};

// Rate limiting based on subscription tier
const tierRateLimit = () => {
  const tierLimits = {
    'free': { requests: 100, window: 60 * 60 }, // 100 req/hour
    'pro': { requests: 1000, window: 60 * 60 }, // 1000 req/hour
    'enterprise': { requests: 10000, window: 60 * 60 } // 10000 req/hour
  };

  return async (req, res, next) => {
    if (!req.user) {
      return next(); // No rate limiting for unauthenticated requests
    }

    const tier = req.user.subscriptionTier;
    const limits = tierLimits[tier] || tierLimits.free;
    
    const key = `rate_limit:${req.user.id}`;
    const rateCheck = await redis.checkRateLimit(key, limits.requests, limits.window);

    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        limit: limits.requests,
        window: limits.window,
        current: rateCheck.count,
        resetTime: Date.now() + (limits.window * 1000)
      });
    }

    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': limits.requests,
      'X-RateLimit-Remaining': Math.max(0, limits.requests - rateCheck.count),
      'X-RateLimit-Reset': Math.floor(Date.now() / 1000) + limits.window
    });

    next();
  };
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!req.user.isAdmin) {
    logger.security('ADMIN_ACCESS_DENIED', {
      userId: req.user.id,
      email: req.user.email,
      endpoint: req.path,
      ip: req.ip
    });
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

module.exports = {
  auth,
  optionalAuth,
  requireRole,
  requireTier,
  tierRateLimit,
  requireAdmin
};