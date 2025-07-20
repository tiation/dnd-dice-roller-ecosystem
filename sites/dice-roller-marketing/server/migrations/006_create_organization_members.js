/**
 * Create organization_members table for team membership management
 */
exports.up = function(knex) {
  return knex.schema.createTable('organization_members', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    
    // Role and permissions
    table.enum('role', ['owner', 'admin', 'member', 'viewer']).defaultTo('member');
    table.json('permissions').defaultTo('[]'); // Custom permissions
    
    // Invitation
    table.string('invitation_token').nullable();
    table.timestamp('invitation_sent_at').nullable();
    table.timestamp('invitation_accepted_at').nullable();
    table.enum('status', ['invited', 'active', 'suspended']).defaultTo('invited');
    
    // Billing seat assignment
    table.boolean('billable_seat').defaultTo(true);
    
    // Metadata
    table.json('metadata').defaultTo('{}');
    
    // Audit
    table.uuid('invited_by').nullable().references('id').inTable('users');
    table.timestamp('joined_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Unique constraint
    table.unique(['organization_id', 'user_id']);
    
    // Indexes
    table.index('organization_id');
    table.index('user_id');
    table.index('invitation_token');
    table.index(['organization_id', 'role']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('organization_members');
};