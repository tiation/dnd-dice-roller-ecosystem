# 🚀 Google Cloud Platform Deployment Guide

## 🎯 **Best Options for Your Epic D&D Character Forge**

### Option 1: Cloud Run (Recommended - Serverless)
- **Cost**: Pay-per-use, very cheap for low traffic
- **Scaling**: Automatic, from 0 to millions
- **Ease**: Moderate setup, container-based

### Option 2: App Engine (Easiest)
- **Cost**: ~$20-50/month for basic usage
- **Scaling**: Automatic
- **Ease**: Simplest setup, just push code

### Option 3: Compute Engine (Most Control)
- **Cost**: ~$20-100/month
- **Scaling**: Manual
- **Ease**: Most complex, full VM control

---

## 🌟 **Option 1: Cloud Run (Recommended)**

### Step 1: Install Google Cloud CLI
```bash
# For macOS
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Or via Homebrew
brew install --cask google-cloud-sdk
```

### Step 2: Initialize and Login
```bash
gcloud init
# Follow prompts to:
# 1. Login to your Google account
# 2. Select or create a project
# 3. Choose a default region (us-central1 recommended)
```

### Step 3: Enable Required Services
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### Step 4: Build and Deploy
```bash
# Set your project ID
export PROJECT_ID=$(gcloud config get-value project)

# Build the container
gcloud builds submit --tag gcr.io/$PROJECT_ID/epic-dnd-forge

# Deploy to Cloud Run
gcloud run deploy epic-dnd-forge \
  --image gcr.io/$PROJECT_ID/epic-dnd-forge \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --set-env-vars DATABASE_URL="file:./dev.db",NEXTAUTH_SECRET="your-random-secret-here"
```

---

## 🎨 **Option 2: App Engine (Easiest)**

### Step 1: Create app.yaml
```yaml
runtime: nodejs18

env_variables:
  DATABASE_URL: "file:./dev.db"
  NEXTAUTH_SECRET: "your-random-32-char-secret"
  NEXTAUTH_URL: "https://YOUR_PROJECT_ID.uc.r.appspot.com"

automatic_scaling:
  min_instances: 0
  max_instances: 10
  target_cpu_utilization: 0.6
```

### Step 2: Deploy
```bash
gcloud app deploy
```

### Step 3: Open Your App
```bash
gcloud app browse
```

---

## 🔧 **Option 3: Compute Engine VM**

### Step 1: Create VM Instance
```bash
gcloud compute instances create epic-dnd-forge-vm \
  --zone=us-central1-a \
  --machine-type=e2-small \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=20GB \
  --tags=http-server,https-server
```

### Step 2: SSH into VM
```bash
gcloud compute ssh epic-dnd-forge-vm --zone=us-central1-a
```

### Step 3: Install Dependencies on VM
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone your repository
git clone https://github.com/tiation/dnd-character-sheets-saas.git
cd dnd-character-sheets-saas

# Install dependencies
npm install

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "epic-dnd-forge" -- start
pm2 startup
pm2 save
```

### Step 4: Configure Firewall
```bash
# Exit SSH first (Ctrl+D or type exit)

# Allow HTTP traffic
gcloud compute firewall-rules create allow-epic-dnd-forge \
  --allow tcp:3000 \
  --source-ranges 0.0.0.0/0 \
  --target-tags http-server
```

---

## 🗄️ **Database Options for Production**

### Option A: Cloud SQL (PostgreSQL)
```bash
# Create Cloud SQL instance
gcloud sql instances create epic-dnd-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database
gcloud sql databases create dnd_character_forge --instance=epic-dnd-db

# Get connection string
gcloud sql instances describe epic-dnd-db
```

### Option B: Firestore (NoSQL)
```bash
# Enable Firestore
gcloud services enable firestore.googleapis.com

# Initialize Firestore
gcloud firestore databases create --region=us-central
```

---

## 💰 **Cost Estimates**

### Cloud Run (Recommended)
- **Free tier**: 2 million requests/month
- **Beyond free**: ~$0.40 per million requests
- **Your app**: Likely $0-5/month

### App Engine
- **Free tier**: 28 instance hours/day
- **Beyond free**: ~$0.05/hour per instance
- **Your app**: Likely $10-30/month

### Compute Engine
- **e2-small**: ~$13/month (always on)
- **e2-micro**: ~$6/month (burstable)
- **Your app**: $6-20/month

---

## 🚀 **Quick Start Script**

Let me create a deployment script for you...