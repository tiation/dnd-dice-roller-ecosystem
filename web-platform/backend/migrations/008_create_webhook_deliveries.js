/**
 * Create webhook_deliveries table for tracking webhook delivery attempts
 */
exports.up = function(knex) {
  return knex.schema.createTable('webhook_deliveries', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('webhook_id').notNullable().references('id').inTable('webhooks').onDelete('CASCADE');
    
    // Delivery details
    table.string('event_type').notNullable();
    table.uuid('event_id').notNullable(); // ID of the triggering event
    table.json('payload').notNullable();
    
    // Request details
    table.string('url').notNullable();
    table.json('headers').defaultTo('{}');
    table.string('http_method').defaultTo('POST');
    
    // Response details
    table.integer('status_code').nullable();
    table.text('response_body').nullable();
    table.json('response_headers').defaultTo('{}');
    table.integer('response_time_ms').nullable();
    
    // Delivery status
    table.enum('status', ['pending', 'delivered', 'failed', 'retrying']).defaultTo('pending');
    table.integer('attempt_count').defaultTo(0);
    table.timestamp('next_retry_at').nullable();
    table.text('error_message').nullable();
    
    // Audit
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('delivered_at').nullable();
    table.timestamp('failed_at').nullable();
    
    // Indexes
    table.index('webhook_id');
    table.index('event_type');
    table.index('event_id');
    table.index('status');
    table.index('next_retry_at');
    table.index(['webhook_id', 'created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('webhook_deliveries');
};