const redis = require('redis');
const logger = require('../utils/logger');

// Redis client configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: 0,
  retryDelayOnFailover: 100,
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000
};

const client = redis.createClient({
  url: process.env.REDIS_URL,
  ...redisConfig
});

// Redis event handlers
client.on('connect', () => {
  logger.info('✅ Redis client connected');
});

client.on('ready', () => {
  logger.info('✅ Redis client ready');
});

client.on('error', (err) => {
  logger.error('❌ Redis client error:', err.message);
});

client.on('end', () => {
  logger.info('🔌 Redis client connection ended');
});

client.on('reconnecting', () => {
  logger.info('🔄 Redis client reconnecting...');
});

// Connect to Redis
client.connect().catch((err) => {
  logger.error('❌ Failed to connect to Redis:', err.message);
});

// Redis utility functions
const redisUtils = {
  // Cache with TTL
  async setCache(key, value, ttl = 3600) {
    try {
      await client.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Redis setCache error:', error.message);
      return false;
    }
  },

  // Get cached data
  async getCache(key) {
    try {
      const result = await client.get(key);
      return result ? JSON.parse(result) : null;
    } catch (error) {
      logger.error('Redis getCache error:', error.message);
      return null;
    }
  },

  // Delete cache
  async deleteCache(key) {
    try {
      await client.del(key);
      return true;
    } catch (error) {
      logger.error('Redis deleteCache error:', error.message);
      return false;
    }
  },

  // Check if key exists
  async exists(key) {
    try {
      return await client.exists(key);
    } catch (error) {
      logger.error('Redis exists error:', error.message);
      return false;
    }
  },

  // Set with expiration
  async setWithExpiry(key, value, seconds) {
    try {
      await client.setEx(key, seconds, value);
      return true;
    } catch (error) {
      logger.error('Redis setWithExpiry error:', error.message);
      return false;
    }
  },

  // Increment counter
  async increment(key, amount = 1) {
    try {
      return await client.incrBy(key, amount);
    } catch (error) {
      logger.error('Redis increment error:', error.message);
      return null;
    }
  },

  // Rate limiting check
  async checkRateLimit(key, limit, windowSeconds) {
    try {
      const current = await client.incr(key);
      if (current === 1) {
        await client.expire(key, windowSeconds);
      }
      return { count: current, allowed: current <= limit };
    } catch (error) {
      logger.error('Redis rate limit error:', error.message);
      return { count: 0, allowed: true };
    }
  },

  // Session management
  async setSession(sessionId, userData, ttl = 86400) {
    return await this.setCache(`session:${sessionId}`, userData, ttl);
  },

  async getSession(sessionId) {
    return await this.getCache(`session:${sessionId}`);
  },

  async deleteSession(sessionId) {
    return await this.deleteCache(`session:${sessionId}`);
  },

  // API key caching
  async cacheAPIKey(apiKey, userId, ttl = 3600) {
    return await this.setCache(`apikey:${apiKey}`, { userId, cached: Date.now() }, ttl);
  },

  async getAPIKeyCache(apiKey) {
    return await this.getCache(`apikey:${apiKey}`);
  }
};

module.exports = { client, ...redisUtils };