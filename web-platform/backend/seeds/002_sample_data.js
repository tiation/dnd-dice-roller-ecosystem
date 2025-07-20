const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

exports.seed = async function(knex) {
  // Only run in development
  if (process.env.NODE_ENV !== 'development') {
    console.log('Sample data seeding skipped - not in development environment');
    return;
  }

  // Create sample users
  const users = [];
  const userPassword = await bcrypt.hash('password123', 12);

  // Free tier user
  const freeUserId = uuidv4();
  users.push({
    id: freeUserId,
    email: 'free@example.com',
    password_hash: userPassword,
    first_name: 'Free',
    last_name: 'User',
    subscription_tier: 'free',
    api_key: uuidv4(),
    email_verified: true,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Pro tier user
  const proUserId = uuidv4();
  users.push({
    id: proUserId,
    email: 'pro@example.com',
    password_hash: userPassword,
    first_name: 'Pro',
    last_name: 'User',
    subscription_tier: 'pro',
    api_key: uuidv4(),
    email_verified: true,
    stripe_customer_id: 'cus_sample_pro',
    stripe_subscription_id: 'sub_sample_pro',
    subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    created_at: new Date(),
    updated_at: new Date()
  });

  // Enterprise tier user
  const enterpriseUserId = uuidv4();
  users.push({
    id: enterpriseUserId,
    email: 'enterprise@example.com',
    password_hash: userPassword,
    first_name: 'Enterprise',
    last_name: 'User',
    subscription_tier: 'enterprise',
    api_key: uuidv4(),
    email_verified: true,
    stripe_customer_id: 'cus_sample_enterprise',
    stripe_subscription_id: 'sub_sample_enterprise',
    subscription_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    created_at: new Date(),
    updated_at: new Date()
  });

  await knex('users').insert(users);

  // Create sample organization
  const orgId = uuidv4();
  await knex('organizations').insert([
    {
      id: orgId,
      name: 'Sample Enterprise Corp',
      slug: 'sample-enterprise',
      description: 'A sample enterprise organization for testing',
      plan: 'enterprise',
      seat_limit: 50,
      seat_count: 3,
      stripe_customer_id: 'cus_sample_org',
      sso_enabled: true,
      custom_branding: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  // Add enterprise user as organization owner
  await knex('organization_members').insert([
    {
      id: uuidv4(),
      organization_id: orgId,
      user_id: enterpriseUserId,
      role: 'owner',
      status: 'active',
      invitation_accepted_at: new Date(),
      joined_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  // Create sample subscriptions
  await knex('subscriptions').insert([
    {
      id: uuidv4(),
      user_id: proUserId,
      stripe_subscription_id: 'sub_sample_pro',
      stripe_customer_id: 'cus_sample_pro',
      stripe_price_id: 'price_pro_monthly',
      plan: 'pro',
      status: 'active',
      amount: 1999, // $19.99
      currency: 'usd',
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      limits: JSON.stringify({
        api_requests: 10000,
        storage: '100GB',
        team_members: 5
      }),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      user_id: enterpriseUserId,
      stripe_subscription_id: 'sub_sample_enterprise',
      stripe_customer_id: 'cus_sample_enterprise',
      stripe_price_id: 'price_enterprise_yearly',
      plan: 'enterprise',
      status: 'active',
      amount: 99900, // $999.00
      currency: 'usd',
      billing_cycle: 'yearly',
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      limits: JSON.stringify({
        api_requests: 100000,
        storage: 'unlimited',
        team_members: 'unlimited'
      }),
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  // Create sample dice rolls
  const sampleRolls = [];
  const rollTypes = ['attack', 'damage', 'skill', 'save', 'initiative'];
  const diceConfigs = [
    { d20: 1 },
    { d20: 1, d6: 2 },
    { d4: 4 },
    { d8: 2, d6: 1 },
    { d12: 1, d4: 1 }
  ];

  for (let i = 0; i < 50; i++) {
    const userId = [freeUserId, proUserId, enterpriseUserId][Math.floor(Math.random() * 3)];
    const diceConfig = diceConfigs[Math.floor(Math.random() * diceConfigs.length)];
    const rollType = rollTypes[Math.floor(Math.random() * rollTypes.length)];
    
    // Simulate dice results
    const results = {};
    let total = 0;
    
    Object.entries(diceConfig).forEach(([die, count]) => {
      const sides = parseInt(die.substring(1));
      results[die] = [];
      for (let j = 0; j < count; j++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        results[die].push(roll);
        total += roll;
      }
    });

    sampleRolls.push({
      id: uuidv4(),
      user_id: userId,
      dice_config: JSON.stringify(diceConfig),
      results: JSON.stringify(results),
      total,
      roll_type: rollType,
      notes: `Sample ${rollType} roll`,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random within last 30 days
    });
  }

  await knex('dice_rolls').insert(sampleRolls);

  console.log('Sample data created:');
  console.log('Users: free@example.com, pro@example.com, enterprise@example.com');
  console.log('Password: password123');
  console.log('Organization: Sample Enterprise Corp');
  console.log(`${sampleRolls.length} sample dice rolls created`);
};