const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../config/database');
const logger = require('../utils/logger');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// Stripe webhook endpoint - must be raw body
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
        
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
        
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
        
      default:
        logger.info('Unhandled Stripe event type:', event.type);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Stripe webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Handle successful checkout session
async function handleCheckoutSessionCompleted(session) {
  logger.info('Checkout session completed:', session.id);
  
  const userId = session.metadata?.userId;
  if (!userId) {
    logger.error('No userId found in checkout session metadata');
    return;
  }

  // Update user with Stripe customer ID
  await db('users')
    .where({ id: userId })
    .update({
      stripe_customer_id: session.customer,
      updated_at: new Date()
    });

  logger.business('CHECKOUT_COMPLETED', userId, {
    sessionId: session.id,
    customerId: session.customer
  });
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription) {
  logger.info('Subscription created:', subscription.id);

  // Find user by Stripe customer ID
  const user = await db('users')
    .where({ stripe_customer_id: subscription.customer })
    .first();

  if (!user) {
    logger.error('User not found for Stripe customer:', subscription.customer);
    return;
  }

  // Determine plan from price ID
  const plan = getPlanFromPriceId(subscription.items.data[0].price.id);
  const billingCycle = subscription.items.data[0].price.recurring.interval === 'year' ? 'yearly' : 'monthly';

  // Create subscription record
  await db('subscriptions').insert({
    id: require('uuid').v4(),
    user_id: user.id,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer,
    stripe_price_id: subscription.items.data[0].price.id,
    plan,
    status: subscription.status,
    billing_cycle: billingCycle,
    amount: subscription.items.data[0].price.unit_amount,
    currency: subscription.items.data[0].price.currency,
    current_period_start: new Date(subscription.current_period_start * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
    trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    limits: JSON.stringify(getPlainLimits(plan)),
    created_at: new Date(),
    updated_at: new Date()
  });

  // Update user subscription tier
  await db('users')
    .where({ id: user.id })
    .update({
      subscription_tier: plan,
      subscription_expires_at: new Date(subscription.current_period_end * 1000),
      subscription_active: true,
      stripe_subscription_id: subscription.id,
      updated_at: new Date()
    });

  // Send welcome email
  const planFeatures = getPlainFeatures(plan);
  await sendEmail({
    to: user.email,
    template: 'subscription-created',
    data: {
      firstName: user.first_name,
      plan: plan.charAt(0).toUpperCase() + plan.slice(1),
      features: planFeatures
    }
  }).catch(err => logger.error('Subscription welcome email failed:', err));

  logger.business('SUBSCRIPTION_CREATED', user.id, {
    plan,
    subscriptionId: subscription.id,
    amount: subscription.items.data[0].price.unit_amount
  });
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription) {
  logger.info('Subscription updated:', subscription.id);

  // Find existing subscription
  const existingSubscription = await db('subscriptions')
    .where({ stripe_subscription_id: subscription.id })
    .first();

  if (!existingSubscription) {
    logger.error('Subscription not found for update:', subscription.id);
    return;
  }

  const plan = getPlanFromPriceId(subscription.items.data[0].price.id);

  // Update subscription record
  await db('subscriptions')
    .where({ stripe_subscription_id: subscription.id })
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
      updated_at: new Date()
    });

  // Update user subscription tier
  await db('users')
    .where({ id: existingSubscription.user_id })
    .update({
      subscription_tier: subscription.status === 'active' ? plan : 'free',
      subscription_expires_at: new Date(subscription.current_period_end * 1000),
      subscription_active: subscription.status === 'active',
      updated_at: new Date()
    });

  logger.business('SUBSCRIPTION_UPDATED', existingSubscription.user_id, {
    subscriptionId: subscription.id,
    status: subscription.status,
    plan
  });
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription) {
  logger.info('Subscription deleted:', subscription.id);

  // Find existing subscription
  const existingSubscription = await db('subscriptions')
    .where({ stripe_subscription_id: subscription.id })
    .first();

  if (!existingSubscription) {
    logger.error('Subscription not found for deletion:', subscription.id);
    return;
  }

  // Update subscription status
  await db('subscriptions')
    .where({ stripe_subscription_id: subscription.id })
    .update({
      status: 'canceled',
      canceled_at: new Date(subscription.canceled_at * 1000),
      ended_at: new Date(),
      updated_at: new Date()
    });

  // Downgrade user to free tier
  await db('users')
    .where({ id: existingSubscription.user_id })
    .update({
      subscription_tier: 'free',
      subscription_active: false,
      subscription_expires_at: null,
      stripe_subscription_id: null,
      updated_at: new Date()
    });

  logger.business('SUBSCRIPTION_DELETED', existingSubscription.user_id, {
    subscriptionId: subscription.id,
    plan: existingSubscription.plan
  });
}

// Handle successful payment
async function handleInvoicePaymentSucceeded(invoice) {
  logger.info('Invoice payment succeeded:', invoice.id);

  if (invoice.subscription) {
    const subscription = await db('subscriptions')
      .where({ stripe_subscription_id: invoice.subscription })
      .first();

    if (subscription) {
      // Reset API usage counter for the new billing period
      const user = await db('users').where({ id: subscription.user_id }).first();
      
      await db('users')
        .where({ id: subscription.user_id })
        .update({
          api_requests_count: 0,
          api_requests_reset_at: new Date(),
          updated_at: new Date()
        });

      logger.business('INVOICE_PAYMENT_SUCCEEDED', subscription.user_id, {
        invoiceId: invoice.id,
        amount: invoice.amount_paid,
        subscriptionId: invoice.subscription
      });
    }
  }
}

// Handle failed payment
async function handleInvoicePaymentFailed(invoice) {
  logger.info('Invoice payment failed:', invoice.id);

  if (invoice.subscription) {
    const subscription = await db('subscriptions')
      .where({ stripe_subscription_id: invoice.subscription })
      .first();

    if (subscription) {
      const user = await db('users').where({ id: subscription.user_id }).first();

      // Send payment failure notification
      await sendEmail({
        to: user.email,
        subject: 'Payment Failed - Action Required',
        template: 'payment-failed',
        data: {
          firstName: user.first_name,
          invoiceUrl: invoice.hosted_invoice_url,
          amount: (invoice.amount_due / 100).toFixed(2),
          currency: invoice.currency.toUpperCase()
        }
      }).catch(err => logger.error('Payment failed email error:', err));

      logger.business('INVOICE_PAYMENT_FAILED', subscription.user_id, {
        invoiceId: invoice.id,
        amount: invoice.amount_due,
        subscriptionId: invoice.subscription
      });
    }
  }
}

// Helper functions
function getPlanFromPriceId(priceId) {
  if (priceId.includes('pro')) return 'pro';
  if (priceId.includes('enterprise')) return 'enterprise';
  return 'free';
}

function getPlainLimits(plan) {
  const limits = {
    free: { api_requests: 100, storage: '10MB' },
    pro: { api_requests: 10000, storage: '1GB' },
    enterprise: { api_requests: 100000, storage: '100GB' }
  };
  return limits[plan] || limits.free;
}

function getPlainFeatures(plan) {
  const features = {
    free: ['100 API calls/month', 'Basic dice rolling', 'Roll history'],
    pro: ['10,000 API calls/month', 'Advanced analytics', 'Export data', 'Priority support'],
    enterprise: ['100,000 API calls/month', 'Team management', 'SSO', 'White-label', 'Custom integrations']
  };
  return features[plan] || features.free;
}

module.exports = router;