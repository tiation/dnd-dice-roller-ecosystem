const express = require('express');
const { body, query, validationResult } = require('express-validator');
const db = require('../config/database');
const redis = require('../config/redis');
const logger = require('../utils/logger');
const { auth, requireAdmin } = require('../middleware/auth');
const { sendEmail, sendBulkEmail } = require('../utils/email');

const router = express.Router();

// Apply admin authentication to all routes
router.use(auth);
router.use(requireAdmin);

// GET /api/v1/admin/dashboard - Admin dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const [
      userStats,
      subscriptionStats,
      revenueStats,
      apiStats,
      rollStats
    ] = await Promise.all([
      getUserStats(),
      getSubscriptionStats(),
      getRevenueStats(),
      getAPIStats(),
      getRollStats()
    ]);

    res.json({
      users: userStats,
      subscriptions: subscriptionStats,
      revenue: revenueStats,
      api: apiStats,
      rolls: rollStats,
      lastUpdated: new Date()
    });
  } catch (error) {
    logger.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
});

// GET /api/v1/admin/users - Get all users with pagination
router.get('/users', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('tier').optional().isIn(['free', 'pro', 'enterprise']),
  query('status').optional().isIn(['active', 'inactive', 'deleted'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      search,
      tier,
      status
    } = req.query;

    let query = db('users')
      .select([
        'id', 'email', 'first_name', 'last_name', 'subscription_tier',
        'subscription_active', 'email_verified', 'is_admin', 'created_at',
        'last_login_at', 'deleted_at'
      ]);

    // Apply filters
    if (search) {
      query = query.where(function() {
        this.where('email', 'ilike', `%${search}%`)
          .orWhere('first_name', 'ilike', `%${search}%`)
          .orWhere('last_name', 'ilike', `%${search}%`);
      });
    }

    if (tier) {
      query = query.where('subscription_tier', tier);
    }

    if (status === 'deleted') {
      query = query.whereNotNull('deleted_at');
    } else if (status === 'inactive') {
      query = query.whereNull('deleted_at').where('subscription_active', false);
    } else {
      query = query.whereNull('deleted_at');
      if (status === 'active') {
        query = query.where('subscription_active', true);
      }
    }

    // Get total count
    const totalQuery = query.clone();
    const total = await totalQuery.count('id as count').first();

    // Get paginated results
    const offset = (page - 1) * limit;
    const users = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total.count),
        pages: Math.ceil(total.count / limit)
      }
    });
  } catch (error) {
    logger.error('Admin get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// GET /api/v1/admin/users/:userId - Get specific user details
router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await db('users')
      .where({ id: userId })
      .first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's subscriptions
    const subscriptions = await db('subscriptions')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');

    // Get recent activity
    const recentRolls = await db('dice_rolls')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(10);

    const recentAPIUsage = await db('api_usage')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(10);

    // Get user stats
    const stats = await getUserDetailStats(userId);

    res.json({
      user,
      subscriptions,
      recentActivity: {
        rolls: recentRolls,
        apiUsage: recentAPIUsage
      },
      stats
    });
  } catch (error) {
    logger.error('Admin get user details error:', error);
    res.status(500).json({ error: 'Failed to get user details' });
  }
});

// PUT /api/v1/admin/users/:userId - Update user (admin actions)
router.put('/users/:userId', [
  body('subscriptionTier').optional().isIn(['free', 'pro', 'enterprise']),
  body('isAdmin').optional().isBoolean(),
  body('emailVerified').optional().isBoolean(),
  body('subscriptionActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { userId } = req.params;
    const {
      subscriptionTier,
      isAdmin,
      emailVerified,
      subscriptionActive
    } = req.body;

    const updateData = { updated_at: new Date() };

    if (subscriptionTier !== undefined) updateData.subscription_tier = subscriptionTier;
    if (isAdmin !== undefined) updateData.is_admin = isAdmin;
    if (emailVerified !== undefined) updateData.email_verified = emailVerified;
    if (subscriptionActive !== undefined) updateData.subscription_active = subscriptionActive;

    await db('users')
      .where({ id: userId })
      .update(updateData);

    logger.security('ADMIN_USER_UPDATE', {
      adminId: req.user.id,
      targetUserId: userId,
      changes: updateData
    });

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    logger.error('Admin update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/v1/admin/users/:userId - Delete user account (admin action)
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Soft delete user
    await db('users')
      .where({ id: userId })
      .update({
        deleted_at: new Date(),
        updated_at: new Date()
      });

    logger.security('ADMIN_USER_DELETE', {
      adminId: req.user.id,
      targetUserId: userId
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Admin delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// GET /api/v1/admin/subscriptions - Get all subscriptions
router.get('/subscriptions', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['active', 'canceled', 'past_due', 'incomplete'])
], async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status
    } = req.query;

    let query = db('subscriptions')
      .join('users', 'subscriptions.user_id', 'users.id')
      .select([
        'subscriptions.*',
        'users.email',
        'users.first_name',
        'users.last_name'
      ]);

    if (status) {
      query = query.where('subscriptions.status', status);
    }

    const total = await query.clone().count('subscriptions.id as count').first();
    
    const offset = (page - 1) * limit;
    const subscriptions = await query
      .orderBy('subscriptions.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    res.json({
      subscriptions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total.count),
        pages: Math.ceil(total.count / limit)
      }
    });
  } catch (error) {
    logger.error('Admin get subscriptions error:', error);
    res.status(500).json({ error: 'Failed to get subscriptions' });
  }
});

// GET /api/v1/admin/analytics - Get analytics data
router.get('/analytics', [
  query('period').optional().isIn(['day', 'week', 'month', 'year'])
], async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 30); // 30 days
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 12 * 7); // 12 weeks
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 12); // 12 months
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 5); // 5 years
        break;
    }

    // User growth
    const userGrowth = await db('users')
      .select(
        db.raw(`DATE_TRUNC('${period}', created_at) as period`),
        db.raw('COUNT(*) as new_users')
      )
      .where('created_at', '>=', startDate)
      .whereNull('deleted_at')
      .groupBy(db.raw(`DATE_TRUNC('${period}', created_at)`))
      .orderBy('period', 'asc');

    // Revenue growth
    const revenueGrowth = await db('subscriptions')
      .select(
        db.raw(`DATE_TRUNC('${period}', created_at) as period`),
        db.raw('SUM(amount) as revenue'),
        db.raw('COUNT(*) as new_subscriptions')
      )
      .where('created_at', '>=', startDate)
      .where('status', 'active')
      .groupBy(db.raw(`DATE_TRUNC('${period}', created_at)`))
      .orderBy('period', 'asc');

    // API usage growth
    const apiGrowth = await db('api_usage')
      .select(
        db.raw(`DATE_TRUNC('${period}', created_at) as period`),
        db.raw('COUNT(*) as api_requests'),
        db.raw('COUNT(DISTINCT user_id) as active_users')
      )
      .where('created_at', '>=', startDate)
      .groupBy(db.raw(`DATE_TRUNC('${period}', created_at)`))
      .orderBy('period', 'asc');

    res.json({
      userGrowth,
      revenueGrowth,
      apiGrowth,
      period
    });
  } catch (error) {
    logger.error('Admin analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// POST /api/v1/admin/broadcast-email - Send broadcast email
router.post('/broadcast-email', [
  body('subject').notEmpty().withMessage('Subject required'),
  body('content').notEmpty().withMessage('Content required'),
  body('recipients').isIn(['all', 'free', 'pro', 'enterprise']).withMessage('Invalid recipient group'),
  body('testMode').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { subject, content, recipients, testMode = false } = req.body;

    let query = db('users')
      .select(['email', 'first_name'])
      .where('marketing_emails', true)
      .whereNull('deleted_at');

    if (recipients !== 'all') {
      query = query.where('subscription_tier', recipients);
    }

    if (testMode) {
      query = query.where('is_admin', true); // Only send to admins in test mode
    }

    const users = await query;

    const emails = users.map(user => ({
      to: user.email,
      subject,
      html: content.replace(/\{\{firstName\}\}/g, user.first_name || 'User')
    }));

    if (emails.length === 0) {
      return res.status(400).json({ error: 'No recipients found' });
    }

    // Send emails in batches to avoid overwhelming the email service
    const batchSize = 50;
    const results = [];
    
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const batchResults = await sendBulkEmail(batch);
      results.push(...batchResults);
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    logger.business('BROADCAST_EMAIL_SENT', req.user.id, {
      subject,
      recipients,
      total: emails.length,
      successful,
      failed,
      testMode
    });

    res.json({
      message: 'Broadcast email sent',
      stats: {
        total: emails.length,
        successful,
        failed
      },
      results: testMode ? results : undefined // Only return details in test mode
    });
  } catch (error) {
    logger.error('Broadcast email error:', error);
    res.status(500).json({ error: 'Failed to send broadcast email' });
  }
});

// Helper functions
async function getUserStats() {
  const total = await db('users').whereNull('deleted_at').count('id as count').first();
  const active = await db('users').whereNull('deleted_at').where('subscription_active', true).count('id as count').first();
  const admins = await db('users').whereNull('deleted_at').where('is_admin', true).count('id as count').first();
  
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const newThisMonth = await db('users').where('created_at', '>=', thisMonth).whereNull('deleted_at').count('id as count').first();

  return {
    total: parseInt(total.count),
    active: parseInt(active.count),
    admins: parseInt(admins.count),
    newThisMonth: parseInt(newThisMonth.count)
  };
}

async function getSubscriptionStats() {
  const active = await db('subscriptions').where('status', 'active').count('id as count').first();
  const canceled = await db('subscriptions').where('status', 'canceled').count('id as count').first();
  
  const planBreakdown = await db('subscriptions')
    .select('plan')
    .count('id as count')
    .where('status', 'active')
    .groupBy('plan');

  return {
    active: parseInt(active.count),
    canceled: parseInt(canceled.count),
    planBreakdown
  };
}

async function getRevenueStats() {
  const thisMonth = new Date();
  thisMonth.setDate(1);
  
  const monthlyRevenue = await db('subscriptions')
    .where('status', 'active')
    .where('created_at', '>=', thisMonth)
    .sum('amount as total')
    .first();

  const totalRevenue = await db('subscriptions')
    .where('status', 'active')
    .sum('amount as total')
    .first();

  return {
    thisMonth: parseInt(monthlyRevenue.total) || 0,
    total: parseInt(totalRevenue.total) || 0
  };
}

async function getAPIStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayRequests = await db('api_usage').where('created_at', '>=', today).count('id as count').first();
  const totalRequests = await db('api_usage').count('id as count').first();
  
  const topEndpoints = await db('api_usage')
    .select('endpoint')
    .count('id as requests')
    .groupBy('endpoint')
    .orderBy('requests', 'desc')
    .limit(5);

  return {
    today: parseInt(todayRequests.count),
    total: parseInt(totalRequests.count),
    topEndpoints
  };
}

async function getRollStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayRolls = await db('dice_rolls').where('created_at', '>=', today).count('id as count').first();
  const totalRolls = await db('dice_rolls').count('id as count').first();

  return {
    today: parseInt(todayRolls.count),
    total: parseInt(totalRolls.count)
  };
}

async function getUserDetailStats(userId) {
  const [totalRolls, totalAPI, subscriptionCount] = await Promise.all([
    db('dice_rolls').where({ user_id: userId }).count('id as count').first(),
    db('api_usage').where({ user_id: userId }).count('id as count').first(),
    db('subscriptions').where({ user_id: userId }).count('id as count').first()
  ]);

  return {
    totalRolls: parseInt(totalRolls.count),
    totalAPIRequests: parseInt(totalAPI.count),
    subscriptionCount: parseInt(subscriptionCount.count)
  };
}

module.exports = router;