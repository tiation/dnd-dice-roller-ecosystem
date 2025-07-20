const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

exports.seed = async function(knex) {
  // Deletes ALL existing entries (in development only)
  if (process.env.NODE_ENV === 'development') {
    await knex('users').del();
  }

  // Create admin user
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await knex('users').insert([
    {
      id: uuidv4(),
      email: 'admin@dnddiceroller.site',
      password_hash: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      subscription_tier: 'enterprise',
      api_key: uuidv4(),
      email_verified: true,
      is_admin: true,
      roles: JSON.stringify(['admin', 'super_admin']),
      preferences: JSON.stringify({
        theme: 'dark',
        notifications: true,
        timezone: 'UTC'
      }),
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  console.log('Admin user created:');
  console.log('Email: admin@dnddiceroller.site');
  console.log('Password:', adminPassword);
  console.log('Please change the password after first login!');
};