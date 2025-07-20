# 🚀 Epic D&D Character Forge - Deployment Guide

## 📦 Repository Setup

### ✅ GitHub Repository
- **URL**: https://github.com/tiation/dnd-character-sheets-saas
- **Status**: ✅ Created and pushed successfully

### 🦊 GitLab Repository Setup
To push to GitLab, first create the repository and set up authentication:

```bash
# Create repository on GitLab first at: https://gitlab.com/projects/new
# Then configure authentication:

# Option 1: Using Personal Access Token
git remote set-url gitlab https://your-username:your-token@gitlab.com/tiation/dnd-character-sheets-saas.git

# Option 2: Using SSH (recommended)
git remote set-url gitlab git@gitlab.com:tiation/dnd-character-sheets-saas.git

# Then push to GitLab
git push -u gitlab main
```

## 🌐 Cloud Hosting Options

### 🔥 **Recommended: Vercel (Easiest)**
Perfect for Next.js applications with automatic deployments:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Follow the prompts:
# ? Set up and deploy "dnd-character-sheets-saas"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? dnd-character-sheets-saas
# ? In which directory is your code located? ./
```

**Environment Variables for Vercel:**
```bash
# Add these in Vercel Dashboard > Project > Settings > Environment Variables
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-random-secret-here"
```

### 🌊 **DigitalOcean App Platform**

1. **Create App from GitHub:**
   ```bash
   # Go to: https://cloud.digitalocean.com/apps
   # Click "Create App" > GitHub > Select repository
   ```

2. **App Configuration:**
   ```yaml
   name: epic-dnd-character-forge
   services:
   - name: web
     source_dir: /
     github:
       repo: tiation/dnd-character-sheets-saas
       branch: main
     run_command: npm start
     build_command: npm run build
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     http_port: 3000
   ```

3. **Environment Variables:**
   ```bash
   DATABASE_URL=file:./dev.db
   NEXTAUTH_URL=https://your-app.ondigitalocean.app
   NEXTAUTH_SECRET=your-random-secret-here
   ```

4. **Estimated Cost:** $5/month

### ☁️ **Google Cloud Platform (GCP)**

#### Option 1: Cloud Run (Serverless)
```bash
# Install Google Cloud CLI
# Then build and deploy:

# Build container
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/dnd-character-forge

# Deploy to Cloud Run
gcloud run deploy dnd-character-forge \
  --image gcr.io/YOUR_PROJECT_ID/dnd-character-forge \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars DATABASE_URL="file:./dev.db",NEXTAUTH_SECRET="your-secret"
```

#### Option 2: App Engine
Create `app.yaml`:
```yaml
runtime: nodejs18

env_variables:
  DATABASE_URL: "file:./dev.db"
  NEXTAUTH_URL: "https://your-project.uc.r.appspot.com"
  NEXTAUTH_SECRET: "your-random-secret-here"

automatic_scaling:
  min_instances: 0
  max_instances: 10
```

Deploy:
```bash
gcloud app deploy
```

### 🚀 **Railway (Developer Friendly)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Set environment variables
railway variables set DATABASE_URL="file:./dev.db"
railway variables set NEXTAUTH_SECRET="your-random-secret-here"
```

### 🐳 **Docker Container Deployment**

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

Build and run:
```bash
# Build Docker image
docker build -t epic-dnd-character-forge .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="file:./dev.db" \
  -e NEXTAUTH_SECRET="your-secret" \
  epic-dnd-character-forge
```

## 🗄️ Database Options

### Development (Current)
- **SQLite** - File-based database (included)

### Production Options

#### 1. **PostgreSQL (Recommended)**
```bash
# Update DATABASE_URL to:
DATABASE_URL="postgresql://username:password@localhost:5432/dnd_character_forge"

# Update schema.prisma:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### 2. **PlanetScale (MySQL)**
```bash
DATABASE_URL="mysql://username:password@host:3306/dnd_character_forge"
```

#### 3. **Supabase (PostgreSQL)**
```bash
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
```

## 🔐 Environment Variables Reference

```bash
# Required
DATABASE_URL="your-database-connection-string"
NEXTAUTH_SECRET="your-random-32-character-secret"
NEXTAUTH_URL="https://your-domain.com"

# Optional OAuth (for user authentication)
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
GITHUB_CLIENT_ID="your-github-oauth-client-id"
GITHUB_CLIENT_SECRET="your-github-oauth-client-secret"
```

## 🚀 Quick Deploy Commands

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### DigitalOcean
```bash
# Push to GitHub, then deploy via DO Console
git push origin main
```

### Railway
```bash
npm i -g @railway/cli
railway login
railway up
```

## 🎯 Performance Optimization

### Before Deployment:
```bash
# Optimize build
npm run build

# Check bundle size
npm run analyze

# Run production locally
npm start
```

### Production Checklist:
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Analytics setup (optional)
- [ ] Error monitoring (optional)

## 📊 Monitoring & Analytics

### Error Tracking:
- **Sentry**: Add error monitoring
- **LogRocket**: Session replay
- **DataDog**: Full observability

### Analytics:
- **Google Analytics**: User tracking
- **Mixpanel**: Event tracking
- **Vercel Analytics**: Performance

---

## 🎉 Your Epic D&D Character Forge is Ready for Battle!

Choose your deployment platform and let the legends begin! ⚔️✨

**Pro Tip**: Start with Vercel for simplicity, then migrate to more advanced setups as you scale your epic adventure!