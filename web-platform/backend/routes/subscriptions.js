const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body, validationResult } = require('express-validator');

const db = require('../config/database');
const logger = require('../utils/logger');
const { auth, requireTier } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// Subscription plans configuration
const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'usd',
    interval: 'month',
    features: ['100 API calls/month', 'Basic dice rolling', 'Roll history'],
    limits: { api_requests: 100, storage: '10MB' }
  },
  pro: {
    name: 'Pro',
    price: 1999, // $19.99
    currency: 'usd',
    interval: 'month',
    stripe_price_id: process.env.STRIPE_PRO_PRICE_ID,
    features: ['10,000 API calls/month', 'Advanced analytics', 'Export data', 'Priority support'],
    limits: { api_requests: 10000, storage: '1GB' }
  },
  enterprise: {
    name: 'Enterprise',
    price: 9999, // $99.99
    currency: 'usd',
    interval: 'month',
    stripe_price_id: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: ['100,000 API calls/month', 'Team management', 'SSO', 'White-label', 'Custom integrations'],
    limits: { api_requests: 100000, storage: '100GB' }
  }
};

// GET /api/v1/subscriptions/plans
router.get('/plans', async (req, res) => {
  try {
    res.json({
      plans: Object.entries(PLANS).map(([key, plan]) => ({
        id: key,
        ...plan,
        stripe_price_id: plan.stripe_price_id || null
      }))
    });
  } catch (error) {
    logger.error('Get plans error:', error);
    res.status(500).json({ error: 'Failed to get plans' });
  }
});

// GET /api/v1/subscriptions/current
router.get('/current', auth, async (req, res) => {
  try {
    // Get user's current subscription
    const subscription = await db('subscriptions')
      .where({ user_id: req.user.id })
      .where('status', 'active')
      .orderBy('created_at', 'desc')
      .first();

    if (!subscription) {
      return res.json({
        subscription: null,
        plan: PLANS.free,
        usage: await getUserUsage(req.user.id)
      });
    }

    // Get usage stats
    const usage = await getUserUsage(req.user.id);

    res.json({
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        canceledAt: subscription.canceled_at
      },
      plan: PLANS[subscription.plan],
      usage
    });
  } catch (error) {
    logger.error('Get current subscription error:', error);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

// POST /api/v1/subscriptions/create-checkout-session
router.post('/create-checkout-session', auth, [
  body('planId').isIn(['pro', 'enterprise']).withMessage('Invalid plan ID'),
  body('billingCycle').optional().isIn(['monthly', 'yearly']).withMessage('Invalid billing cycle')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { planId, billingCycle = 'monthly' } = req.body;
    const plan = PLANS[planId];

    if (!plan || !plan.stripe_price_id) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Check if user already has an active subscription
    const existingSubscription = await db('subscriptions')
      .where({ user_id: req.user.id, status: 'active' })
      .first();

    if (existingSubscription && existingSubscription.plan !== 'free') {
      return res.status(400).json({ error: 'User already has an active subscription' });
    }

    // Get or create Stripe customer
    let stripeCustomerId = await db('users')
      .where({ id: req.user.id })
      .first()
      .then(user => user.stripe_customer_id);

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: `${req.user.firstName} ${req.user.lastName}`,
        metadata: {
          userId: req.user.id
        }
      });
      
      stripeCustomerId = customer.id;
      
      // Update user with Stripe customer ID
      await db('users')
        .where({ id: req.user.id })
        .update({ stripe_customer_id: stripeCustomerId });
    }

    // Create checkout session
    const priceId = billingCycle === 'yearly' 
      ? plan.stripe_price_id.replace('monthly', 'yearly')
      : plan.stripe_price_id;

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/billing`,
      metadata: {
        userId: req.user.id,
        planId
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true
      }
    });

    logger.business('CHECKOUT_SESSION_CREATED', req.user.id, {
      planId,
      billingCycle,
      sessionId: session.id
    });

    res.json({
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    logger.error('Create checkout session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// POST /api/v1/subscriptions/create-portal-session
router.post('/create-portal-session', auth, async (req, res) => {
  try {
    const user = await db('users').where({ id: req.user.id }).first();
    
    if (!user.stripe_customer_id) {
      return res.status(400).json({ error: 'No Stripe customer found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.CLIENT_URL}/billing`
    });

    res.json({ url: session.url });
  } catch (error) {
    logger.error('Create portal session error:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

// POST /api/v1/subscriptions/cancel
router.post('/cancel', auth, async (req, res) => {
  try {
    const subscription = await db('subscriptions')
      .where({ user_id: req.user.id, status: 'active' })
      .first();

    if (!subscription || !subscription.stripe_subscription_id) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    // Cancel at period end in Stripe
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true
    });

    // Update in database
    await db('subscriptions')
      .where({ id: subscription.id })
      .update({
        canceled_at: new Date(),
        updated_at: new Date()
      });

    logger.business('SUBSCRIPTION_CANCELED', req.user.id, {
      subscriptionId: subscription.id,
      plan: subscription.plan
    });

    res.json({ message: 'Subscription will be canceled at the end of the current period' });
  } catch (error) {
    logger.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// POST /api/v1/subscriptions/reactivate
router.post('/reactivate', auth, async (req, res) => {
  try {
    const subscription = await db('subscriptions')
      .where({ user_id: req.user.id, status: 'active' })
      .whereNotNull('canceled_at')
      .first();

    if (!subscription || !subscription.stripe_subscription_id) {
      return res.status(404).json({ error: 'No canceled subscription found' });
    }

    // Reactivate in Stripe
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: false
    });

    // Update in database
    await db('subscriptions')
      .where({ id: subscription.id })
      .update({
        canceled_at: null,
        updated_at: new Date()
      });

    logger.business('SUBSCRIPTION_REACTIVATED', req.user.id, {
      subscriptionId: subscription.id
    });

    res.json({ message: 'Subscription reactivated successfully' });
  } catch (error) {
    logger.error('Reactivate subscription error:', error);
    res.status(500).json({ error: 'Failed to reactivate subscription' });
  }
});

// GET /api/v1/subscriptions/usage
router.get('/usage', auth, async (req, res) => {
  try {
    const usage = await getUserUsage(req.user.id);
    res.json({ usage });
  } catch (error) {
    logger.error('Get usage error:', error);
    res.status(500).json({ error: 'Failed to get usage' });
  }
});

// Helper function to get user usage
async function getUserUsage(userId) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Get API usage for current month
  const apiUsage = await db('api_usage')
    .where({ user_id: userId })
    .where('created_at', '>=', startOfMonth)
    .count('id as total')
    .first();

  // Get dice rolls for current month
  const diceRolls = await db('dice_rolls')
    .where({ user_id: userId })
    .where('created_at', '>=', startOfMonth)
    .count('id as total')
    .first();

  // Get storage usage (simplified - just count of rolls)
  const storageUsage = await db('dice_rolls')
    .where({ user_id: userId })
    .count('id as total')
    .first();

  return {
    apiRequests: {
      current: parseInt(apiUsage.total) || 0,
      period: 'month',
      resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1)
    },
    diceRolls: {
      current: parseInt(diceRolls.total) || 0,
      period: 'month'
    },
    storage: {
      current: parseInt(storageUsage.total) || 0,
      unit: 'rolls'
    }
  };
}

module.exports = router;