const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const db = require('../config/database');
const redis = require('../config/redis');
const logger = require('../utils/logger');
const { auth, requireTier } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// GET /api/v1/users/profile - Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await db('users')
      .select([
        'id', 'email', 'first_name', 'last_name', 'subscription_tier',
        'api_key', 'avatar_url', 'timezone', 'preferences', 'marketing_emails',
        'created_at', 'last_login_at', 'email_verified'
      ])
      .where({ id: req.user.id })
      .first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get subscription details
    const subscription = await db('subscriptions')
      .where({ user_id: req.user.id, status: 'active' })
      .orderBy('created_at', 'desc')
      .first();

    // Get usage statistics
    const stats = await getUserStats(req.user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        subscriptionTier: user.subscription_tier,
        apiKey: user.api_key,
        avatarUrl: user.avatar_url,
        timezone: user.timezone,
        preferences: JSON.parse(user.preferences || '{}'),
        marketingEmails: user.marketing_emails,
        emailVerified: user.email_verified,
        createdAt: user.created_at,
        lastLoginAt: user.last_login_at
      },
      subscription: subscription ? {
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        canceledAt: subscription.canceled_at
      } : null,
      stats
    });
  } catch (error) {
    logger.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// PUT /api/v1/users/profile - Update user profile
router.put('/profile', auth, [
  body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name required'),
  body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name required'),
  body('timezone').optional().isString().withMessage('Invalid timezone'),
  body('preferences').optional().isObject().withMessage('Preferences must be an object'),
  body('marketingEmails').optional().isBoolean().withMessage('Marketing emails must be boolean'),
  body('avatarUrl').optional().isURL().withMessage('Invalid avatar URL')
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
      firstName,
      lastName,
      timezone,
      preferences,
      marketingEmails,
      avatarUrl
    } = req.body;

    const updateData = { updated_at: new Date() };

    if (firstName !== undefined) updateData.first_name = firstName;
    if (lastName !== undefined) updateData.last_name = lastName;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (preferences !== undefined) updateData.preferences = JSON.stringify(preferences);
    if (marketingEmails !== undefined) updateData.marketing_emails = marketingEmails;
    if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;

    await db('users')
      .where({ id: req.user.id })
      .update(updateData);

    logger.business('PROFILE_UPDATED', req.user.id, {
      fields: Object.keys(updateData).filter(k => k !== 'updated_at')
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/v1/users/change-password - Change password
router.post('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user's current password hash
    const user = await db('users')
      .select('password_hash')
      .where({ id: req.user.id })
      .first();

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(newPassword, rounds);

    // Update password
    await db('users')
      .where({ id: req.user.id })
      .update({
        password_hash: hashedPassword,
        updated_at: new Date()
      });

    // Invalidate all refresh tokens
    await redis.deleteCache(`refresh:${req.user.id}`);

    logger.security('PASSWORD_CHANGED', {
      userId: req.user.id,
      email: req.user.email
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// POST /api/v1/users/regenerate-api-key - Regenerate API key
router.post('/regenerate-api-key', auth, async (req, res) => {
  try {
    const newApiKey = uuidv4();

    await db('users')
      .where({ id: req.user.id })
      .update({
        api_key: newApiKey,
        updated_at: new Date()
      });

    // Clear API key cache
    await redis.deleteCache(`apikey:${req.user.apiKey}`);

    logger.security('API_KEY_REGENERATED', {
      userId: req.user.id,
      oldApiKey: req.user.apiKey.substring(0, 8) + '...'
    });

    res.json({
      message: 'API key regenerated successfully',
      apiKey: newApiKey
    });
  } catch (error) {
    logger.error('Regenerate API key error:', error);
    res.status(500).json({ error: 'Failed to regenerate API key' });
  }
});

// GET /api/v1/users/api-usage - Get API usage statistics
router.get('/api-usage', auth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    // Get usage data
    const usageData = await db('api_usage')
      .where({ user_id: req.user.id })
      .where('created_at', '>=', startDate)
      .select(
        db.raw('DATE(created_at) as date'),
        db.raw('COUNT(*) as requests'),
        db.raw('AVG(response_time_ms) as avg_response_time'),
        'endpoint'
      )
      .groupBy(db.raw('DATE(created_at)'), 'endpoint')
      .orderBy('date', 'desc');

    // Get endpoint statistics
    const endpointStats = await db('api_usage')
      .where({ user_id: req.user.id })
      .where('created_at', '>=', startDate)
      .select('endpoint')
      .count('id as requests')
      .avg('response_time_ms as avg_response_time')
      .groupBy('endpoint')
      .orderBy('requests', 'desc');

    // Get current month limits
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const currentMonthUsage = await db('api_usage')
      .where({ user_id: req.user.id })
      .where('created_at', '>=', monthStart)
      .count('id as total')
      .first();

    const limits = {
      free: 100,
      pro: 10000,
      enterprise: 100000
    };

    const limit = limits[req.user.subscriptionTier] || limits.free;
    const current = parseInt(currentMonthUsage.total) || 0;

    res.json({
      usage: {
        current,
        limit,
        percentage: Math.round((current / limit) * 100),
        resetDate: new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1)
      },
      dailyUsage: usageData,
      endpointStats,
      period
    });
  } catch (error) {
    logger.error('Get API usage error:', error);
    res.status(500).json({ error: 'Failed to get API usage' });
  }
});

// POST /api/v1/users/export-data - Export user data (GDPR compliance)
router.post('/export-data', auth, requireTier('pro'), async (req, res) => {
  try {
    // Get all user data
    const userData = await db('users')
      .select([
        'id', 'email', 'first_name', 'last_name', 'subscription_tier',
        'preferences', 'timezone', 'created_at', 'last_login_at'
      ])
      .where({ id: req.user.id })
      .first();

    const subscriptions = await db('subscriptions')
      .where({ user_id: req.user.id })
      .orderBy('created_at', 'desc');

    const diceRolls = await db('dice_rolls')
      .where({ user_id: req.user.id })
      .orderBy('created_at', 'desc')
      .limit(1000); // Limit for performance

    const apiUsage = await db('api_usage')
      .where({ user_id: req.user.id })
      .orderBy('created_at', 'desc')
      .limit(1000);

    const exportData = {
      user: userData,
      subscriptions,
      diceRolls: diceRolls.map(roll => ({
        ...roll,
        dice_config: JSON.parse(roll.dice_config),
        results: JSON.parse(roll.results),
        modifiers: JSON.parse(roll.modifiers || '{}')
      })),
      apiUsage,
      exportedAt: new Date(),
      exportType: 'full'
    };

    logger.business('DATA_EXPORTED', req.user.id, {
      recordCounts: {
        subscriptions: subscriptions.length,
        diceRolls: diceRolls.length,
        apiUsage: apiUsage.length
      }
    });

    res.json({
      message: 'Data export ready',
      data: exportData
    });
  } catch (error) {
    logger.error('Export data error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// DELETE /api/v1/users/account - Delete user account (GDPR compliance)
router.delete('/account', auth, [
  body('password').notEmpty().withMessage('Password confirmation required'),
  body('confirmation').equals('DELETE').withMessage('Must confirm with DELETE')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { password } = req.body;

    // Verify password
    const user = await db('users')
      .select('password_hash', 'stripe_customer_id')
      .where({ id: req.user.id })
      .first();

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Password is incorrect' });
    }

    // Cancel Stripe subscription if exists
    if (user.stripe_customer_id) {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripe_customer_id,
          status: 'active'
        });

        for (const subscription of subscriptions.data) {
          await stripe.subscriptions.del(subscription.id);
        }
      } catch (stripeError) {
        logger.error('Stripe cancellation error during account deletion:', stripeError);
      }
    }

    // Soft delete user (for audit trail)
    await db('users')
      .where({ id: req.user.id })
      .update({
        deleted_at: new Date(),
        email: `deleted_${Date.now()}@deleted.invalid`,
        password_hash: 'deleted',
        api_key: null,
        stripe_customer_id: null,
        stripe_subscription_id: null,
        updated_at: new Date()
      });

    // Clear caches
    await redis.deleteCache(`refresh:${req.user.id}`);
    await redis.deleteCache(`apikey:${req.user.apiKey}`);

    logger.security('ACCOUNT_DELETED', {
      userId: req.user.id,
      email: req.user.email
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    logger.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// POST /api/v1/users/verify-email - Send email verification
router.post('/verify-email', auth, async (req, res) => {
  try {
    const user = await db('users')
      .select(['email_verified', 'email'])
      .where({ id: req.user.id })
      .first();

    if (user.email_verified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    const verificationToken = require('crypto').randomBytes(32).toString('hex');
    
    await db('users')
      .where({ id: req.user.id })
      .update({
        email_verification_token: verificationToken,
        updated_at: new Date()
      });

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email Address',
      html: `
        <h2>Email Verification</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If you didn't request this verification, please ignore this email.</p>
      `
    });

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    logger.error('Send verification email error:', error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
});

// Helper function to get user statistics
async function getUserStats(userId) {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [totalRolls, monthlyRolls, totalAPIRequests, monthlyAPIRequests] = await Promise.all([
    db('dice_rolls').where({ user_id: userId }).count('id as count').first(),
    db('dice_rolls').where({ user_id: userId }).where('created_at', '>=', monthStart).count('id as count').first(),
    db('api_usage').where({ user_id: userId }).count('id as count').first(),
    db('api_usage').where({ user_id: userId }).where('created_at', '>=', monthStart).count('id as count').first()
  ]);

  return {
    totalRolls: parseInt(totalRolls.count) || 0,
    monthlyRolls: parseInt(monthlyRolls.count) || 0,
    totalAPIRequests: parseInt(totalAPIRequests.count) || 0,
    monthlyAPIRequests: parseInt(monthlyAPIRequests.count) || 0
  };
}

module.exports = router;