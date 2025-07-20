#!/bin/bash

echo "⚔️ Epic D&D Character Forge - GCP Cloud Run Deployment"
echo "======================================================"
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
echo "🌍 Using region: us-central1"
echo ""

# Generate random secret for NEXTAUTH
NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || date | md5sum | head -c32)

echo "🔧 Setting up required services..."
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable run.googleapis.com --quiet
gcloud services enable artifactregistry.googleapis.com --quiet

echo "✅ Services enabled"
echo ""

echo "🏗️ Building Docker container..."
echo "This may take 5-10 minutes..."

# Build the container
if gcloud builds submit --tag gcr.io/$PROJECT_ID/epic-dnd-forge --quiet; then
    echo "✅ Container built successfully"
else
    echo "❌ Container build failed"
    exit 1
fi

echo ""
echo "🚀 Deploying to Cloud Run..."

# Deploy to Cloud Run
if gcloud run deploy epic-dnd-forge \
    --image gcr.io/$PROJECT_ID/epic-dnd-forge \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 3000 \
    --memory 1Gi \
    --cpu 1 \
    --max-instances 10 \
    --timeout 300 \
    --set-env-vars DATABASE_URL="file:./dev.db",NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
    --quiet; then
    
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    
    # Get the service URL
    SERVICE_URL=$(gcloud run services describe epic-dnd-forge --region us-central1 --format 'value(status.url)')
    
    echo "🌟 Your Epic D&D Character Forge is now live at:"
    echo "🔗 $SERVICE_URL"
    echo ""
    
    # Update with the correct NEXTAUTH_URL
    echo "🔧 Updating NEXTAUTH_URL..."
    gcloud run services update epic-dnd-forge \
        --region us-central1 \
        --set-env-vars DATABASE_URL="file:./dev.db",NEXTAUTH_SECRET="$NEXTAUTH_SECRET",NEXTAUTH_URL="$SERVICE_URL" \
        --quiet
    
    echo "✅ Environment variables updated"
    echo ""
    echo "📊 Deployment Details:"
    echo "   Project: $PROJECT_ID"
    echo "   Service: epic-dnd-forge"
    echo "   Region: us-central1"
    echo "   URL: $SERVICE_URL"
    echo ""
    echo "💰 Estimated monthly cost: $0-5 (pay per use)"
    echo ""
    echo "🛠️ Management commands:"
    echo "   View logs: gcloud run services logs read epic-dnd-forge --region us-central1"
    echo "   Scale to 0: gcloud run services update epic-dnd-forge --region us-central1 --min-instances 0"
    echo "   Delete: gcloud run services delete epic-dnd-forge --region us-central1"
    echo ""
    echo "⚔️ Your legendary D&D application is ready for heroes worldwide!"
    
else
    echo "❌ Deployment failed"
    echo "Check the logs for more details"
    exit 1
fi