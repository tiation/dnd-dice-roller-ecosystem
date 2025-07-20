const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const db = require('../config/database');
const redis = require('../config/redis');
const logger = require('../utils/logger');
const { auth, optionalAuth, tierRateLimit } = require('../middleware/auth');

const router = express.Router();

// Apply rate limiting based on subscription tier
router.use(tierRateLimit());

// Dice rolling validation
const rollValidation = [
  body('dice').isObject().withMessage('Dice configuration must be an object'),
  body('dice.*.count').optional().isInt({ min: 1, max: 100 }).withMessage('Dice count must be between 1-100'),
  body('dice.*.sides').optional().isInt({ min: 2, max: 1000 }).withMessage('Dice sides must be between 2-1000'),
  body('modifiers').optional().isObject().withMessage('Modifiers must be an object'),
  body('modifiers.bonus').optional().isInt({ min: -1000, max: 1000 }).withMessage('Bonus must be between -1000 and 1000'),
  body('rollType').optional().isString().isLength({ max: 50 }).withMessage('Roll type max 50 characters'),
  body('notes').optional().isString().isLength({ max: 500 }).withMessage('Notes max 500 characters'),
  body('campaignId').optional().isString().isLength({ max: 100 }).withMessage('Campaign ID max 100 characters'),
  body('characterName').optional().isString().isLength({ max: 100 }).withMessage('Character name max 100 characters')
];

// POST /api/v1/dice/roll - Main dice rolling endpoint
router.post('/roll', optionalAuth, rollValidation, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      dice,
      modifiers = {},
      rollType = 'standard',
      notes = '',
      campaignId = null,
      characterName = null,
      roomId = null
    } = req.body;

    // Validate dice configuration
    const validatedDice = validateDiceConfig(dice);
    if (!validatedDice.valid) {
      return res.status(400).json({ error: validatedDice.error });
    }

    // Check subscription limits
    const userId = req.user?.id || null;
    if (userId) {
      const canRoll = await checkRollLimits(userId, req.user.subscriptionTier);
      if (!canRoll.allowed) {
        return res.status(429).json({
          error: 'Roll limit exceeded',
          limit: canRoll.limit,
          current: canRoll.current,
          resetTime: canRoll.resetTime
        });
      }
    }

    // Perform the dice roll
    const rollResult = performDiceRoll(validatedDice.config, modifiers);
    
    // Save roll to database
    const rollRecord = await saveRollToDatabase({
      userId,
      sessionId: req.sessionID || req.ip,
      diceConfig: validatedDice.config,
      results: rollResult.results,
      total: rollResult.total,
      modifiers,
      rollType,
      notes,
      campaignId,
      characterName,
      roomId,
      apiKey: req.user?.apiKey || null,
      clientIp: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Track API usage
    if (userId) {
      await trackAPIUsage({
        userId,
        endpoint: '/api/v1/dice/roll',
        method: 'POST',
        statusCode: 200,
        responseTime: Date.now() - startTime,
        apiKey: req.user.apiKey
      });
    }

    // Real-time broadcast if in a room
    if (roomId && req.io) {
      req.io.to(roomId).emit('dice-roll', {
        rollId: rollRecord.id,
        user: userId ? {
          id: userId,
          name: characterName || `${req.user.firstName} ${req.user.lastName}`
        } : { name: 'Anonymous' },
        result: rollResult,
        rollType,
        notes,
        timestamp: new Date()
      });
    }

    logger.business('DICE_ROLL', userId, {
      rollId: rollRecord.id,
      diceConfig: validatedDice.config,
      total: rollResult.total,
      rollType
    });

    res.json({
      rollId: rollRecord.id,
      dice: validatedDice.config,
      results: rollResult.results,
      individual: rollResult.individual,
      total: rollResult.total,
      modifiers: rollResult.modifiers,
      breakdown: rollResult.breakdown,
      rollType,
      notes,
      timestamp: new Date()
    });

  } catch (error) {
    logger.error('Dice roll error:', error);
    res.status(500).json({ error: 'Dice roll failed' });
  }
});

// GET /api/v1/dice/history - Get user's roll history
router.get('/history', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('campaign').optional().isString(),
  query('rollType').optional().isString(),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      campaign,
      rollType,
      startDate,
      endDate
    } = req.query;

    let query = db('dice_rolls')
      .where({ user_id: req.user.id })
      .orderBy('created_at', 'desc');

    // Apply filters
    if (campaign) query = query.where({ campaign_id: campaign });
    if (rollType) query = query.where({ roll_type: rollType });
    if (startDate) query = query.where('created_at', '>=', new Date(startDate));
    if (endDate) query = query.where('created_at', '<=', new Date(endDate));

    // Get total count
    const totalQuery = query.clone();
    const total = await totalQuery.count('id as count').first();

    // Get paginated results
    const offset = (page - 1) * limit;
    const rolls = await query.limit(limit).offset(offset);

    res.json({
      rolls: rolls.map(formatRollRecord),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total.count),
        pages: Math.ceil(total.count / limit)
      }
    });

  } catch (error) {
    logger.error('Get roll history error:', error);
    res.status(500).json({ error: 'Failed to get roll history' });
  }
});

// GET /api/v1/dice/stats - Get user's rolling statistics
router.get('/stats', auth, [
  query('period').optional().isIn(['day', 'week', 'month', 'year', 'all']).withMessage('Invalid period')
], async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const stats = await getUserRollStats(req.user.id, period);
    
    res.json({ stats });
  } catch (error) {
    logger.error('Get roll stats error:', error);
    res.status(500).json({ error: 'Failed to get roll statistics' });
  }
});

// GET /api/v1/dice/roll/:rollId - Get specific roll details
router.get('/roll/:rollId', auth, async (req, res) => {
  try {
    const { rollId } = req.params;
    
    const roll = await db('dice_rolls')
      .where({ id: rollId, user_id: req.user.id })
      .first();

    if (!roll) {
      return res.status(404).json({ error: 'Roll not found' });
    }

    res.json({ roll: formatRollRecord(roll) });
  } catch (error) {
    logger.error('Get roll details error:', error);
    res.status(500).json({ error: 'Failed to get roll details' });
  }
});

// POST /api/v1/dice/quick-roll/:diceType - Quick roll for common dice
router.post('/quick-roll/:diceType', optionalAuth, async (req, res) => {
  try {
    const { diceType } = req.params;
    const { count = 1, modifier = 0 } = req.body;

    // Validate dice type
    const validDice = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
    if (!validDice.includes(diceType)) {
      return res.status(400).json({ error: 'Invalid dice type' });
    }

    if (count < 1 || count > 20) {
      return res.status(400).json({ error: 'Count must be between 1-20' });
    }

    const sides = parseInt(diceType.substring(1));
    const dice = { [diceType]: { count: parseInt(count), sides } };
    const modifiers = modifier ? { bonus: parseInt(modifier) } : {};

    const rollResult = performDiceRoll(dice, modifiers);

    // Save to database if user is authenticated
    let rollRecord = null;
    if (req.user) {
      rollRecord = await saveRollToDatabase({
        userId: req.user.id,
        sessionId: req.sessionID || req.ip,
        diceConfig: dice,
        results: rollResult.results,
        total: rollResult.total,
        modifiers,
        rollType: 'quick',
        notes: `Quick ${diceType} roll`,
        apiKey: req.user.apiKey,
        clientIp: req.ip,
        userAgent: req.get('User-Agent')
      });
    }

    res.json({
      rollId: rollRecord?.id || null,
      dice: diceType,
      count: parseInt(count),
      modifier: parseInt(modifier),
      results: rollResult.individual[diceType] || [],
      total: rollResult.total,
      breakdown: rollResult.breakdown
    });

  } catch (error) {
    logger.error('Quick roll error:', error);
    res.status(500).json({ error: 'Quick roll failed' });
  }
});

// Helper Functions

function validateDiceConfig(dice) {
  if (!dice || typeof dice !== 'object') {
    return { valid: false, error: 'Dice configuration must be an object' };
  }

  const validatedConfig = {};
  let totalDice = 0;

  for (const [key, value] of Object.entries(dice)) {
    // Handle standard dice (d4, d6, d8, etc.)
    if (key.match(/^d\d+$/)) {
      const sides = parseInt(key.substring(1));
      const count = typeof value === 'number' ? value : (value.count || 1);
      
      if (sides < 2 || sides > 1000) {
        return { valid: false, error: `Invalid dice: ${key} - sides must be 2-1000` };
      }
      
      if (count < 1 || count > 100) {
        return { valid: false, error: `Invalid count for ${key}: must be 1-100` };
      }

      validatedConfig[key] = { count, sides };
      totalDice += count;
    }
    // Handle custom dice
    else if (key === 'custom' && Array.isArray(value)) {
      validatedConfig.custom = [];
      for (const customDie of value) {
        if (!customDie.sides || !customDie.count) {
          return { valid: false, error: 'Custom dice must have sides and count' };
        }
        
        if (customDie.sides < 2 || customDie.sides > 1000) {
          return { valid: false, error: 'Custom dice sides must be 2-1000' };
        }
        
        if (customDie.count < 1 || customDie.count > 100) {
          return { valid: false, error: 'Custom dice count must be 1-100' };
        }

        validatedConfig.custom.push({
          sides: customDie.sides,
          count: customDie.count,
          label: customDie.label || `d${customDie.sides}`
        });
        
        totalDice += customDie.count;
      }
    } else {
      return { valid: false, error: `Invalid dice configuration key: ${key}` };
    }
  }

  if (totalDice === 0) {
    return { valid: false, error: 'At least one die must be specified' };
  }

  if (totalDice > 200) {
    return { valid: false, error: 'Maximum 200 dice per roll' };
  }

  return { valid: true, config: validatedConfig };
}

function performDiceRoll(diceConfig, modifiers = {}) {
  const results = {};
  const individual = {};
  let total = 0;
  const breakdown = [];

  // Roll standard dice
  for (const [dieType, config] of Object.entries(diceConfig)) {
    if (dieType === 'custom') continue;
    
    const rolls = [];
    for (let i = 0; i < config.count; i++) {
      const roll = Math.floor(Math.random() * config.sides) + 1;
      rolls.push(roll);
      total += roll;
    }
    
    results[dieType] = rolls;
    individual[dieType] = rolls;
    breakdown.push({
      type: dieType,
      rolls,
      subtotal: rolls.reduce((a, b) => a + b, 0)
    });
  }

  // Roll custom dice
  if (diceConfig.custom) {
    results.custom = [];
    individual.custom = [];
    
    for (const customDie of diceConfig.custom) {
      const rolls = [];
      for (let i = 0; i < customDie.count; i++) {
        const roll = Math.floor(Math.random() * customDie.sides) + 1;
        rolls.push(roll);
        total += roll;
      }
      
      results.custom.push({ label: customDie.label, rolls });
      individual.custom.push(...rolls);
      breakdown.push({
        type: 'custom',
        label: customDie.label,
        rolls,
        subtotal: rolls.reduce((a, b) => a + b, 0)
      });
    }
  }

  // Apply modifiers
  const finalModifiers = {};
  if (modifiers.bonus) {
    total += modifiers.bonus;
    finalModifiers.bonus = modifiers.bonus;
    breakdown.push({
      type: 'modifier',
      label: 'Bonus',
      value: modifiers.bonus
    });
  }

  if (modifiers.penalty) {
    total -= modifiers.penalty;
    finalModifiers.penalty = modifiers.penalty;
    breakdown.push({
      type: 'modifier',
      label: 'Penalty',
      value: -modifiers.penalty
    });
  }

  return {
    results,
    individual,
    total,
    modifiers: finalModifiers,
    breakdown
  };
}

async function saveRollToDatabase(rollData) {
  const rollId = uuidv4();
  
  const [roll] = await db('dice_rolls').insert({
    id: rollId,
    user_id: rollData.userId,
    session_id: rollData.sessionId,
    dice_config: JSON.stringify(rollData.diceConfig),
    results: JSON.stringify(rollData.results),
    total: rollData.total,
    modifiers: JSON.stringify(rollData.modifiers),
    roll_type: rollData.rollType,
    notes: rollData.notes,
    campaign_id: rollData.campaignId,
    character_name: rollData.characterName,
    room_id: rollData.roomId,
    api_key_used: rollData.apiKey,
    client_ip: rollData.clientIp,
    user_agent: rollData.userAgent,
    created_at: new Date()
  }).returning('*');

  return roll;
}

async function checkRollLimits(userId, subscriptionTier) {
  const limits = {
    free: 100,
    pro: 10000,
    enterprise: 100000
  };
  
  const limit = limits[subscriptionTier] || limits.free;
  
  // Get current month usage
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const current = await db('dice_rolls')
    .where({ user_id: userId })
    .where('created_at', '>=', startOfMonth)
    .count('id as count')
    .first();

  const count = parseInt(current.count) || 0;
  
  return {
    allowed: count < limit,
    limit,
    current: count,
    resetTime: new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 1)
  };
}

async function trackAPIUsage(data) {
  await db('api_usage').insert({
    id: uuidv4(),
    user_id: data.userId,
    endpoint: data.endpoint,
    method: data.method,
    status_code: data.statusCode,
    response_time_ms: data.responseTime,
    api_key: data.apiKey,
    client_ip: data.clientIp,
    billing_period: new Date().toISOString().slice(0, 7), // YYYY-MM
    created_at: new Date()
  });
}

async function getUserRollStats(userId, period) {
  let startDate = new Date();
  
  switch (period) {
    case 'day':
      startDate.setDate(startDate.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case 'all':
      startDate = new Date('1970-01-01');
      break;
  }

  const baseQuery = db('dice_rolls')
    .where({ user_id: userId })
    .where('created_at', '>=', startDate);

  const [totalRolls, avgTotal, maxTotal, rollTypes, diceCounts] = await Promise.all([
    baseQuery.clone().count('id as count').first(),
    baseQuery.clone().avg('total as avg').first(),
    baseQuery.clone().max('total as max').first(),
    baseQuery.clone()
      .select('roll_type')
      .count('id as count')
      .groupBy('roll_type')
      .orderBy('count', 'desc'),
    baseQuery.clone()
      .select(db.raw("json_extract_path_text(dice_config, key) as die_type"))
      .count('id as count')
      .groupBy('die_type')
      .orderBy('count', 'desc')
      .limit(10)
  ]);

  return {
    totalRolls: parseInt(totalRolls.count) || 0,
    averageTotal: parseFloat(avgTotal.avg) || 0,
    maxTotal: parseInt(maxTotal.max) || 0,
    rollTypeDistribution: rollTypes,
    popularDice: diceCounts,
    period
  };
}

function formatRollRecord(roll) {
  return {
    id: roll.id,
    diceConfig: JSON.parse(roll.dice_config),
    results: JSON.parse(roll.results),
    total: roll.total,
    modifiers: JSON.parse(roll.modifiers || '{}'),
    rollType: roll.roll_type,
    notes: roll.notes,
    campaignId: roll.campaign_id,
    characterName: roll.character_name,
    createdAt: roll.created_at
  };
}

module.exports = router;