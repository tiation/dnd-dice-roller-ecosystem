/**
 * Create organizations table for enterprise team management
 */
exports.up = function(knex) {
  return knex.schema.createTable('organizations', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('slug').unique().notNullable(); // URL-friendly name
    table.text('description').nullable();
    
    // Billing
    table.string('stripe_customer_id').nullable();
    table.enum('plan', ['team', 'enterprise']).defaultTo('team');
    table.integer('seat_limit').defaultTo(10);
    table.integer('seat_count').defaultTo(0);
    
    // Settings
    table.json('settings').defaultTo('{}'); // SSO config, branding, etc.
    table.string('logo_url').nullable();
    table.string('website').nullable();
    
    // Enterprise features
    table.boolean('sso_enabled').defaultTo(false);
    table.json('sso_config').defaultTo('{}'); // SAML/OAuth config
    table.boolean('custom_branding').defaultTo(false);
    table.json('branding_config').defaultTo('{}');
    
    // API limits (organization-wide)
    table.integer('api_limit_per_user').nullable();
    table.json('feature_flags').defaultTo('{}');
    
    // Audit
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
    
    // Indexes
    table.index('slug');
    table.index('stripe_customer_id');
    table.index(['created_at', 'deleted_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('organizations');
};