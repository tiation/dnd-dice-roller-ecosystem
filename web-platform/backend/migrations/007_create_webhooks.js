/**
 * Create webhooks table for user-defined webhook integrations
 */
exports.up = function(knex) {
  return knex.schema.createTable('webhooks', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').nullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('organization_id').nullable().references('id').inTable('organizations').onDelete('CASCADE');
    
    // Webhook configuration
    table.string('name').notNullable();
    table.string('url').notNullable();
    table.string('secret').notNullable(); // For HMAC signature verification
    table.json('events').notNullable(); // Array of event types to listen for
    table.boolean('active').defaultTo(true);
    
    // Retry configuration
    table.integer('max_retries').defaultTo(3);
    table.integer('retry_delay_seconds').defaultTo(60);
    
    // Statistics
    table.integer('total_deliveries').defaultTo(0);
    table.integer('successful_deliveries').defaultTo(0);
    table.timestamp('last_delivery_at').nullable();
    table.timestamp('last_success_at').nullable();
    table.timestamp('last_failure_at').nullable();
    
    // Metadata
    table.json('headers').defaultTo('{}'); // Custom headers to send
    table.text('description').nullable();
    table.json('metadata').defaultTo('{}');
    
    // Audit
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('user_id');
    table.index('organization_id');
    table.index('active');
    table.index('last_delivery_at');
    
    // Check constraint - must belong to either user or organization
    table.check('(user_id IS NOT NULL) != (organization_id IS NOT NULL)');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('webhooks');
};