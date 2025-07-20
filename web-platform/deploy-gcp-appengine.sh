#!/bin/bash

echo "⚔️ Epic D&D Character Forge - GCP App Engine Deployment"
echo "======================================================="
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI not found!"
    echo ""
    echo "Please install it first:"
    echo "🍎 macOS: brew install --cask google-cloud-sdk"
    echo "🐧 Linux: curl https://sdk.cloud.google.com | bash"
    echo "🪟 Windows: Download from https://cloud.google.com/sdk/docs/install"
    echo ""
    exit 1
fi

# Check if logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔑 Please login to Google Cloud first:"
    echo "gcloud auth login"
    echo ""
    exit 1
fi

# Get current project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ No GCP project selected!"
    echo "Please run: gcloud init"
    echo ""
    exit 1
fi

echo "📋 Current project: $PROJECT_ID"
echo ""

# Generate random secret for NEXTAUTH
NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || date | md5sum | head -c32)

# Determine the App Engine URL
APP_URL="https://$PROJECT_ID.uc.r.appspot.com"

echo "🔧 Creating app.yaml configuration..."

# Create app.yaml
cat > app.yaml << EOF
runtime: nodejs18

env_variables:
  DATABASE_URL: "file:./dev.db"
  NEXTAUTH_SECRET: "$NEXTAUTH_SECRET"
  NEXTAUTH_URL: "$APP_URL"

automatic_scaling:
  min_instances: 0
  max_instances: 10
  target_cpu_utilization: 0.6
  target_throughput_utilization: 0.6

resources:
  cpu: 1
  memory_gb: 1
EOF

echo "✅ app.yaml created"
echo ""

echo "🔧 Enabling App Engine API..."
gcloud services enable appengine.googleapis.com --quiet

echo "✅ App Engine API enabled"
echo ""

# Check if App Engine app exists
if ! gcloud app describe &>/dev/null; then
    echo "🏗️ Creating App Engine application..."
    gcloud app create --region=us-central --quiet
    echo "✅ App Engine application created"
    echo ""
fi

echo "🚀 Deploying to App Engine..."
echo "This may take 10-15 minutes for the first deployment..."
echo ""

# Deploy to App Engine
if gcloud app deploy --quiet; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "🌟 Your Epic D&D Character Forge is now live at:"
    echo "🔗 $APP_URL"
    echo ""
    echo "📊 Deployment Details:"
    echo "   Project: $PROJECT_ID"
    echo "   Service: default"
    echo "   Runtime: Node.js 18"
    echo "   URL: $APP_URL"
    echo ""
    echo "💰 Estimated monthly cost: $10-30 (based on usage)"
    echo ""
    echo "🛠️ Management commands:"
    echo "   View app: gcloud app browse"
    echo "   View logs: gcloud app logs tail -s default"
    echo "   View versions: gcloud app versions list"
    echo "   Scale down: gcloud app versions stop [VERSION_ID]"
    echo ""
    echo "📈 Monitor your app:"
    echo "   Console: https://console.cloud.google.com/appengine"
    echo "   Logs: https://console.cloud.google.com/logs"
    echo ""
    echo "⚔️ Your legendary D&D application is serving heroes worldwide!"
    
    # Open the app
    echo ""
    read -p "🌐 Open your app in browser now? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        gcloud app browse
    fi
    
else
    echo "❌ Deployment failed"
    echo "Check the logs for more details:"
    echo "gcloud app logs tail -s default"
    exit 1
fi