# 🎲 DnD Dice Roller SaaS Platform

Enterprise-grade dice rolling platform for D&D and tabletop RPGs with subscription management, team collaboration, and comprehensive API access.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

## ✨ Features

### 🎯 **Core Dice Rolling**
- Support for all standard D&D dice (d4, d6, d8, d10, d12, d20, d100)
- Custom dice with any number of sides
- Advanced modifiers and calculations
- Roll history and analytics
- Real-time multiplayer sessions

### 💳 **Subscription Management**
- **Free Tier**: 100 API calls/month
- **Pro Tier**: 10,000 API calls/month ($19.99)
- **Enterprise Tier**: 100,000 API calls/month ($99.99)
- Stripe integration with automatic billing
- Usage-based rate limiting

### 🏢 **Enterprise Features**
- Team and organization management
- SSO integration ready
- Admin dashboard with analytics
- White-label options
- Custom webhook integrations
- GDPR compliance (data export/deletion)

### 🔧 **Developer API**
- RESTful API with comprehensive documentation
- Authentication via API keys or JWT
- Rate limiting based on subscription tier
- Real-time WebSocket support
- SDK examples for popular languages

## 🚀 **Quick Deployment**

### **Prerequisites**
- VPS with SSH access (minimum 2GB RAM, 20GB storage)
- Domain name pointed to your VPS IP
- SSH keys configured for passwordless access

### **One-Command Deployment**
```bash
# Configure your environment
export VPS_HOST="your-vps-ip"
export DOMAIN="your-domain.com"
export VPS_USER="root"

# Run automated deployment
./deploy.sh
```

The deployment script will:
1. ✅ Install Docker and Docker Compose on VPS
2. ✅ Set up PostgreSQL database with migrations
3. ✅ Configure Redis cache
4. ✅ Build and deploy the application
5. ✅ Set up Nginx reverse proxy
6. ✅ Configure SSL certificate with Let's Encrypt
7. ✅ Set up monitoring and health checks
8. ✅ Configure automated backups

### **Manual Configuration Steps**

After deployment, you'll need to:

1. **Configure Stripe Integration**:
   ```bash
   ssh user@your-vps
   cd /opt/dnddiceroller
   nano .env
   ```
   
   Update these variables:
   ```env
   STRIPE_SECRET_KEY=sk_live_your_actual_key
   STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

2. **Set up Stripe Webhook**:
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-domain.com/api/v1/webhooks/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`

3. **Configure Email SMTP**:
   ```env
   SMTP_HOST=your-smtp-host
   SMTP_USER=your-email@domain.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=noreply@your-domain.com
   ```

4. **Restart Services**:
   ```bash
   docker-compose -f docker-compose.prod.yml restart
   ```

## 📊 **Monitoring & Management**

### **System Status Dashboard**
```bash
/opt/dnddiceroller/scripts/status.sh
```

### **Health Checks**
```bash
/opt/dnddiceroller/scripts/health-check.sh
```

### **View Logs**
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### **Database Backup**
```bash
# Manual backup
/opt/dnddiceroller/scripts/backup.sh

# Restore from backup
/opt/dnddiceroller/scripts/restore.sh latest
```

### **Update Application**
```bash
./deploy.sh update
```

## 🏗️ **Architecture**

### **Backend Stack**
- **Runtime**: Node.js 18+ with Express.js
- **Database**: PostgreSQL 15 with Redis cache
- **Authentication**: JWT with refresh tokens
- **Payments**: Stripe subscriptions and webhooks
- **Email**: SMTP with template system
- **Logging**: Winston with structured logging

### **Frontend Stack**
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **State Management**: Zustand + React Query
- **Charts**: Chart.js for analytics
- **Real-time**: Socket.IO for multiplayer

### **Infrastructure**
- **Containerization**: Docker with multi-stage builds
- **Reverse Proxy**: Nginx with SSL termination
- **SSL**: Let's Encrypt automatic certificates
- **Monitoring**: Health checks with alerting
- **Backups**: Automated PostgreSQL dumps

## 🔐 **Security Features**

- **Security Headers**: CSP, HSTS, XSS protection
- **Rate Limiting**: IP-based and user-based limits  
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Parameterized queries
- **HTTPS Enforcement**: Automatic SSL redirects
- **Audit Logging**: All admin actions logged
- **Session Security**: HttpOnly cookies, CSRF protection

## 📋 **API Documentation**

### **Authentication**
```bash
# Register user
curl -X POST https://your-domain.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST https://your-domain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass"}'
```

### **Dice Rolling**
```bash
# Roll dice with API key
curl -X POST https://your-domain.com/api/v1/dice/roll \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"dice":{"d20":2,"d6":3},"modifiers":{"bonus":5}}'

# Quick roll
curl -X POST https://your-domain.com/api/v1/dice/quick-roll/d20 \
  -H "X-API-Key: your-api-key" \
  -d '{"count":1,"modifier":3}'
```

### **Subscription Management**
```bash
# Get current subscription
curl https://your-domain.com/api/v1/subscriptions/current \
  -H "Authorization: Bearer your-jwt-token"

# Create checkout session
curl -X POST https://your-domain.com/api/v1/subscriptions/create-checkout-session \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"planId":"pro","billingCycle":"monthly"}'
```

## 🛠️ **Development Setup**

### **Local Development**
```bash
# Clone repository
git clone https://github.com/your-username/dice-roller-saas.git
cd dice-roller-saas

# Install dependencies
npm install
cd client && npm install && cd ..

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start development servers
docker-compose up -d postgres redis
npm run dev

# In another terminal
cd client && npm run dev
```

### **Database Setup**
```bash
# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

## 📈 **Scaling & Performance**

### **Horizontal Scaling**
- Load balancer compatible
- Stateless application design
- Redis for session sharing
- Database read replicas support

### **Performance Optimizations**
- Connection pooling
- Query optimization
- Redis caching
- CDN-ready static assets
- Gzip compression
- Browser caching headers

### **Monitoring Integration**
- Health check endpoints
- Structured logging
- Performance metrics
- Error tracking ready (Sentry)
- Uptime monitoring hooks

## 🤝 **Support & Contributing**

### **Getting Help**
- 📧 Email: admin@dnddiceroller.site
- 🐛 Issues: GitHub Issues
- 📖 Documentation: `/docs` endpoint
- 💬 Community: Discord (link in app)

### **Contributing**
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎲 **About**

Built with ❤️ for the D&D and tabletop RPG community. This enterprise-grade platform provides reliable, scalable dice rolling services for campaigns, tournaments, and applications.

**Part of the Tiation GitHub ecosystem** - Professional tools for modern gaming.

---

⚡ **Ready to roll?** Deploy your own instance and start rolling dice at enterprise scale!