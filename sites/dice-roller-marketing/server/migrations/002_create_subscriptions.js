/**
 * Create subscriptions table for tracking subscription history and billing
 */
exports.up = function(knex) {
  return knex.schema.createTable('subscriptions', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    
    // Stripe integration
    table.string('stripe_subscription_id').unique();
    table.string('stripe_customer_id').notNullable();
    table.string('stripe_price_id').notNullable();
    
    // Subscription details
    table.enum('plan', ['free', 'pro', 'enterprise']).notNullable();
    table.enum('status', ['incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid']).notNullable();
    table.enum('billing_cycle', ['monthly', 'yearly']).defaultTo('monthly');
    
    // Pricing
    table.integer('amount').notNullable(); // In cents
    table.string('currency').defaultTo('usd');
    
    // Billing dates
    table.timestamp('current_period_start').notNullable();
    table.timestamp('current_period_end').notNullable();
    table.timestamp('trial_start').nullable();
    table.timestamp('trial_end').nullable();
    table.timestamp('canceled_at').nullable();
    table.timestamp('ended_at').nullable();
    
    // Usage limits based on plan
    table.json('limits').defaultTo('{}'); // e.g., {"api_requests": 1000, "storage": "10GB"}
    
    // Metadata
    table.json('metadata').defaultTo('{}');
    
    // Audit
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('user_id');
    table.index('stripe_subscription_id');
    table.index('stripe_customer_id');
    table.index(['plan', 'status']);
    table.index('current_period_end');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('subscriptions');
};