/**
 * Create dice_rolls table for tracking all dice roll history
 */
exports.up = function(knex) {
  return knex.schema.createTable('dice_rolls', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').nullable().references('id').inTable('users').onDelete('CASCADE');
    
    // Roll details
    table.string('session_id').nullable(); // For anonymous users
    table.json('dice_config').notNullable(); // e.g., {"d20": 2, "d6": 3, "custom": {"sides": 12, "count": 1}}
    table.json('results').notNullable(); // Individual dice results
    table.integer('total').notNullable(); // Sum of all dice
    table.json('modifiers').defaultTo('{}'); // Bonuses, penalties, etc.
    
    // Roll context
    table.string('campaign_id').nullable(); // For campaign tracking
    table.string('character_name').nullable();
    table.string('roll_type').nullable(); // attack, damage, skill, save, etc.
    table.text('notes').nullable();
    table.json('metadata').defaultTo('{}'); // Additional context
    
    // API tracking
    table.string('api_key_used').nullable();
    table.string('client_ip').nullable();
    table.string('user_agent').nullable();
    
    // Real-time session
    table.string('room_id').nullable(); // For multiplayer sessions
    table.boolean('shared').defaultTo(false); // Visible to other players
    
    // Audit
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('user_id');
    table.index('session_id');
    table.index('campaign_id');
    table.index('room_id');
    table.index('created_at');
    table.index(['user_id', 'created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('dice_rolls');
};