/**
 * Create api_usage table for tracking API consumption and rate limiting
 */
exports.up = function(knex) {
  return knex.schema.createTable('api_usage', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    
    // Request details
    table.string('endpoint').notNullable();
    table.string('method').notNullable(); // GET, POST, etc.
    table.integer('status_code').notNullable();
    table.integer('response_time_ms').nullable();
    
    // Usage tracking
    table.string('api_key').notNullable();
    table.string('request_id').nullable(); // For tracing
    table.json('request_params').defaultTo('{}');
    table.integer('response_size_bytes').nullable();
    
    // Client information
    table.string('client_ip').nullable();
    table.string('user_agent').nullable();
    table.string('referer').nullable();
    
    // Rate limiting
    table.string('rate_limit_key').nullable(); // For grouping related requests
    table.boolean('rate_limited').defaultTo(false);
    
    // Billing
    table.decimal('cost_cents', 10, 2).defaultTo(0); // Cost of this request in cents
    table.string('billing_period').nullable(); // YYYY-MM for monthly tracking
    
    // Audit
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('user_id');
    table.index('api_key');
    table.index('endpoint');
    table.index('created_at');
    table.index('billing_period');
    table.index(['user_id', 'created_at']);
    table.index(['user_id', 'billing_period']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('api_usage');
};