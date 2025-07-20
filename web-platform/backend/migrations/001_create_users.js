/**
 * Create users table
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    
    // Subscription and billing
    table.enum('subscription_tier', ['free', 'pro', 'enterprise']).defaultTo('free');
    table.string('stripe_customer_id').nullable();
    table.string('stripe_subscription_id').nullable();
    table.timestamp('subscription_expires_at').nullable();
    table.boolean('subscription_active').defaultTo(true);
    
    // API access
    table.uuid('api_key').notNullable().defaultTo(knex.raw('gen_random_uuid()'));
    table.integer('api_requests_count').defaultTo(0);
    table.timestamp('api_requests_reset_at').defaultTo(knex.fn.now());
    
    // Authentication
    table.string('password_reset_token').nullable();
    table.timestamp('password_reset_expires').nullable();
    table.boolean('email_verified').defaultTo(false);
    table.string('email_verification_token').nullable();
    
    // Profile and settings
    table.json('preferences').defaultTo('{}');
    table.string('avatar_url').nullable();
    table.string('timezone').defaultTo('UTC');
    table.boolean('marketing_emails').defaultTo(true);
    
    // OAuth
    table.string('google_id').nullable();
    table.string('github_id').nullable();
    
    // Admin and roles
    table.boolean('is_admin').defaultTo(false);
    table.json('roles').defaultTo('[]');
    
    // Audit fields
    table.timestamp('last_login_at').nullable();
    table.string('last_login_ip').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable(); // Soft delete
    
    // Indexes
    table.index('email');
    table.index('api_key');
    table.index('stripe_customer_id');
    table.index('subscription_tier');
    table.index(['created_at', 'deleted_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};