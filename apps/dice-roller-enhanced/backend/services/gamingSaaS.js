/**
 * Gaming SaaS Monetization Service for D&D Dice Roller
 * Enterprise-grade monetization for tabletop gaming platforms
 * Supports premium features, campaign management, and digital content sales
 */

const Stripe = require('stripe');
const winston = require('winston');

class GamingSaaSService {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'logs/gaming-saas.log' })
            ]
        });
        
        // Gaming subscription plans
        this.plans = {
            adventurer: {
                id: 'dnd_adventurer',
                name: 'Adventurer',
                price: 499, // $4.99/month in cents
                features: [
                    'Unlimited basic dice rolls',
                    '10 saved character sheets',
                    'Basic spell database',
                    'Roll history tracking',
                    'Mobile app access',
                    'Email support'
                ],
                limits: {
                    characters: 10,
                    campaigns: 2,
                    custom_dice: 5,
                    dice_sets: 10,
                    automation: false
                }
            },
            hero: {
                id: 'dnd_hero',
                name: 'Hero',
                price: 999, // $9.99/month in cents
                features: [
                    'Everything in Adventurer',
                    'Unlimited character sheets',
                    'Advanced dice mechanics',
                    'Custom dice creation',
                    'Campaign management tools',
                    '5e SRD content',
                    'Homebrew content support',
                    'Priority support'
                ],
                limits: {
                    characters: -1, // Unlimited
                    campaigns: 5,
                    custom_dice: 25,
                    dice_sets: 50,
                    automation: true
                }
            },
            legendary: {
                id: 'dnd_legendary',
                name: 'Legendary',
                price: 1999, // $19.99/month in cents
                features: [
                    'Everything in Hero',
                    'Unlimited campaigns',
                    'DM tools & screens',
                    'Advanced automation',
                    'Custom content creation',
                    'API access',
                    'White-label options',
                    'Premium support',
                    'Early access features'
                ],
                limits: {
                    characters: -1, // Unlimited
                    campaigns: -1, // Unlimited
                    custom_dice: -1, // Unlimited
                    dice_sets: -1, // Unlimited
                    automation: true,
                    api_access: true
                }
            },
            // Digital content marketplace
            content_pricing: {
                spell_pack: 299, // $2.99
                character_sheet_template: 99, // $0.99
                custom_dice_set: 199, // $1.99
                campaign_module: 799, // $7.99
                premium_automation: 499 // $4.99
            }
        };
    }

    /**
     * Create gaming customer with gaming-specific metadata
     */
    async createGamingCustomer(userData) {
        try {
            const customer = await this.stripe.customers.create({
                email: userData.email,
                name: userData.name,
                metadata: {
                    user_id: userData.id,
                    gaming_handle: userData.gaming_handle || userData.name,
                    favorite_system: userData.favorite_system || 'D&D 5e',
                    platform: 'dnd-dice-roller',
                    character_count: 0,
                    campaigns_joined: 0,
                    total_rolls: 0
                }
            });

            this.logger.info('Gaming customer created', {
                customer_id: customer.id,
                user_id: userData.id,
                gaming_handle: userData.gaming_handle
            });

            return customer;
        } catch (error) {
            this.logger.error('Failed to create gaming customer', {
                error: error.message,
                user_id: userData.id
            });
            throw error;
        }
    }

    /**
     * Track gaming usage for billing and analytics
     */
    async trackGamingUsage(customerId, usageData) {
        try {
            const {
                action_type,
                character_id,
                campaign_id,
                dice_complexity,
                automation_used,
                content_accessed
            } = usageData;

            // Track different gaming actions
            const customer = await this.stripe.customers.retrieve(customerId);
            const currentRolls = parseInt(customer.metadata.total_rolls || 0);

            await this.stripe.customers.update(customerId, {
                metadata: {
                    ...customer.metadata,
                    total_rolls: currentRolls + 1,
                    last_action: action_type,
                    last_active: new Date().toISOString()
                }
            });

            this.logger.info('Gaming usage tracked', {
                customer_id: customerId,
                action_type,
                character_id,
                campaign_id
            });

            return { tracked: true, total_rolls: currentRolls + 1 };
        } catch (error) {
            this.logger.error('Failed to track gaming usage', {
                error: error.message,
                customer_id: customerId
            });
            throw error;
        }
    }

    /**
     * Check gaming feature limits
     */
    async checkGamingLimits(customerId, requestedAction) {
        try {
            const customer = await this.stripe.customers.retrieve(customerId);
            const subscriptions = await this.stripe.subscriptions.list({
                customer: customerId,
                status: 'active'
            });

            if (subscriptions.data.length === 0) {
                return { allowed: false, reason: 'No active gaming subscription' };
            }

            const subscription = subscriptions.data[0];
            const planId = subscription.metadata.plan_id;
            const planLimits = this.plans[planId]?.limits;

            if (!planLimits) {
                return { allowed: false, reason: 'Invalid gaming plan' };
            }

            // Check character limits
            const characterCount = parseInt(customer.metadata.character_count || 0);
            if (requestedAction === 'create_character' && 
                planLimits.characters > 0 && 
                characterCount >= planLimits.characters) {
                return {
                    allowed: false,
                    reason: `Character limit of ${planLimits.characters} reached`,
                    current_characters: characterCount
                };
            }

            // Check campaign limits
            const campaignCount = parseInt(customer.metadata.campaigns_joined || 0);
            if (requestedAction === 'join_campaign' && 
                planLimits.campaigns > 0 && 
                campaignCount >= planLimits.campaigns) {
                return {
                    allowed: false,
                    reason: `Campaign limit of ${planLimits.campaigns} reached`,
                    current_campaigns: campaignCount
                };
            }

            // Check automation access
            if (requestedAction === 'use_automation' && !planLimits.automation) {
                return {
                    allowed: false,
                    reason: 'Automation not available in current plan'
                };
            }

            // Check API access
            if (requestedAction === 'api_access' && !planLimits.api_access) {
                return {
                    allowed: false,
                    reason: 'API access not available in current plan'
                };
            }

            return {
                allowed: true,
                remaining_characters: planLimits.characters > 0 ? 
                    planLimits.characters - characterCount : -1,
                remaining_campaigns: planLimits.campaigns > 0 ? 
                    planLimits.campaigns - campaignCount : -1
            };
        } catch (error) {
            this.logger.error('Failed to check gaming limits', {
                error: error.message,
                customer_id: customerId
            });
            return { allowed: false, reason: 'Error checking limits' };
        }
    }

    /**
     * Process digital content purchase
     */
    async purchaseDigitalContent(customerId, contentType, contentId) {
        try {
            const contentPrice = this.plans.content_pricing[contentType];
            if (!contentPrice) {
                throw new Error('Invalid content type');
            }

            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: contentPrice,
                currency: 'usd',
                customer: customerId,
                description: `Digital Content: ${contentType}`,
                metadata: {
                    content_type: contentType,
                    content_id: contentId,
                    platform: 'dnd-dice-roller',
                    purchase_type: 'digital_content'
                }
            });

            this.logger.info('Digital content purchase created', {
                payment_intent_id: paymentIntent.id,
                content_type: contentType,
                content_id: contentId,
                amount: contentPrice
            });

            return paymentIntent;
        } catch (error) {
            this.logger.error('Failed to process content purchase', {
                error: error.message,
                customer_id: customerId,
                content_type: contentType
            });
            throw error;
        }
    }

    /**
     * Generate gaming analytics for engagement tracking
     */
    async generateGamingAnalytics(customerId, period = 'month') {
        try {
            // This would integrate with your gaming database
            const analytics = {
                period: period,
                customer_id: customerId,
                gameplay_metrics: {
                    total_dice_rolls: 1547,
                    characters_created: 8,
                    campaigns_played: 3,
                    favorite_dice_type: 'd20',
                    average_session_length: 3.5, // hours
                    most_active_day: 'Saturday'
                },
                content_usage: {
                    spells_cast: 234,
                    homebrew_items_created: 12,
                    custom_dice_used: 45,
                    automation_triggers: 67
                },
                social_metrics: {
                    campaigns_hosted: 1,
                    friends_invited: 7,
                    content_shared: 23
                },
                revenue_contribution: {
                    subscription_revenue: this.plans.hero.price / 100,
                    content_purchases: 8.97,
                    total_lifetime_value: 45.23
                }
            };

            this.logger.info('Gaming analytics generated', {
                customer_id: customerId,
                period: period,
                total_rolls: analytics.gameplay_metrics.total_dice_rolls
            });

            return analytics;
        } catch (error) {
            this.logger.error('Failed to generate gaming analytics', {
                error: error.message,
                customer_id: customerId
            });
            throw error;
        }
    }

    /**
     * Handle gaming-specific webhook events
     */
    async processGamingWebhook(rawBody, signature) {
        try {
            const event = this.stripe.webhooks.constructEvent(
                rawBody,
                signature,
                process.env.STRIPE_GAMING_WEBHOOK_SECRET
            );

            this.logger.info('Gaming webhook received', {
                event_type: event.type,
                event_id: event.id
            });

            switch (event.type) {
                case 'customer.subscription.created':
                    return this.handleGamingSubscriptionCreated(event.data.object);
                
                case 'payment_intent.succeeded':
                    return this.handleContentPurchaseSucceeded(event.data.object);
                
                case 'customer.subscription.updated':
                    return this.handleGamingPlanChanged(event.data.object);
                
                default:
                    this.logger.info('Unhandled gaming webhook event', { type: event.type });
                    return { received: true };
            }
        } catch (error) {
            this.logger.error('Gaming webhook processing failed', {
                error: error.message
            });
            throw error;
        }
    }

    // Gaming-specific webhook handlers
    async handleGamingSubscriptionCreated(subscription) {
        // Enable gaming features based on plan
        // Send welcome email with gaming tips
        this.logger.info('Gaming subscription activated', {
            subscription_id: subscription.id,
            customer_id: subscription.customer
        });
    }

    async handleContentPurchaseSucceeded(paymentIntent) {
        if (paymentIntent.metadata.purchase_type === 'digital_content') {
            // Unlock digital content for user
            // Send content delivery email
            this.logger.info('Digital content purchased', {
                payment_intent_id: paymentIntent.id,
                content_type: paymentIntent.metadata.content_type
            });
        }
    }

    async handleGamingPlanChanged(subscription) {
        // Update user features based on new plan
        // Migrate data if needed
        this.logger.info('Gaming plan changed', {
            subscription_id: subscription.id,
            new_plan: subscription.metadata.plan_id
        });
    }

    /**
     * Create campaign-based group subscription
     */
    async createCampaignSubscription(campaignData) {
        try {
            const { dm_customer_id, player_count, campaign_name } = campaignData;
            
            // Group discount: $7.99 per player when purchasing for 4+ players
            const group_discount_price = 799; // $7.99 per player
            const total_amount = player_count * group_discount_price;

            const subscription = await this.stripe.subscriptions.create({
                customer: dm_customer_id,
                items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `D&D Campaign: ${campaign_name}`,
                            description: `Group subscription for ${player_count} players`
                        },
                        unit_amount: total_amount,
                        recurring: {
                            interval: 'month'
                        }
                    }
                }],
                metadata: {
                    subscription_type: 'campaign_group',
                    player_count: player_count,
                    campaign_name: campaign_name,
                    platform: 'dnd-dice-roller'
                }
            });

            this.logger.info('Campaign group subscription created', {
                subscription_id: subscription.id,
                campaign_name: campaign_name,
                player_count: player_count
            });

            return subscription;
        } catch (error) {
            this.logger.error('Failed to create campaign subscription', {
                error: error.message,
                campaign_data: campaignData
            });
            throw error;
        }
    }
}

module.exports = GamingSaaSService;
