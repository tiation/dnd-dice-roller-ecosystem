#!/bin/bash

echo "⚔️ Epic D&D Character Forge - Simple GCP Deployment"
echo "===================================================="
echo ""

PROJECT_ID="tiation-enterprise"
SERVICE_NAME="epic-dnd-forge"
REGION="us-central1"

echo "📋 Project: $PROJECT_ID"
echo "🌍 Region: $REGION"
echo ""

# Generate random secret for NEXTAUTH
NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || date +%s | md5sum | head -c32)

echo "🔧 Enabling required APIs..."
gcloud services enable run.googleapis.com --quiet
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable artifactregistry.googleapis.com --quiet

echo "✅ APIs enabled"
echo ""

# Create Artifact Registry repository
echo "🗃️ Setting up container registry..."
if ! gcloud artifacts repositories describe $SERVICE_NAME --location=$REGION --format="value(name)" &>/dev/null; then
    gcloud artifacts repositories create $SERVICE_NAME \
        --repository-format=docker \
        --location=$REGION \
        --description="Epic D&D Character Forge container registry" \
        --quiet
    echo "✅ Container registry created"
else
    echo "✅ Container registry already exists"
fi

# Configure Docker authentication
gcloud auth configure-docker $REGION-docker.pkg.dev --quiet

# Build image locally and push
echo ""
echo "🏗️ Building Docker image locally..."
IMAGE_NAME="$REGION-docker.pkg.dev/$PROJECT_ID/$SERVICE_NAME/$SERVICE_NAME:latest"

if docker build -t $IMAGE_NAME . --platform linux/amd64; then
    echo "✅ Docker image built successfully"
else
    echo "❌ Docker build failed"
    exit 1
fi

echo ""
echo "📤 Pushing image to Artifact Registry..."
if docker push $IMAGE_NAME; then
    echo "✅ Image pushed successfully"
else
    echo "❌ Image push failed"
    exit 1
fi

echo ""
echo "🚀 Deploying to Cloud Run..."

# Deploy to Cloud Run
if gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
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
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')
    
    echo "🌟 Your Epic D&D Character Forge is now live at:"
    echo "🔗 $SERVICE_URL"
    echo ""
    
    # Update with the correct NEXTAUTH_URL
    echo "🔧 Updating NEXTAUTH_URL..."
    gcloud run services update $SERVICE_NAME \
        --region $REGION \
        --set-env-vars DATABASE_URL="file:./dev.db",NEXTAUTH_SECRET="$NEXTAUTH_SECRET",NEXTAUTH_URL="$SERVICE_URL" \
        --quiet
    
    echo "✅ Environment variables updated"
    echo ""
    echo "📊 Deployment Details:"
    echo "   Project: $PROJECT_ID"
    echo "   Service: $SERVICE_NAME"
    echo "   Region: $REGION"
    echo "   URL: $SERVICE_URL"
    echo ""
    echo "💰 Estimated monthly cost: $0-5 (pay per use)"
    echo ""
    echo "🛠️ Management commands:"
    echo "   View logs: gcloud run services logs read $SERVICE_NAME --region $REGION --follow"
    echo "   Update: gcloud run services update $SERVICE_NAME --region $REGION"
    echo "   Delete: gcloud run services delete $SERVICE_NAME --region $REGION"
    echo ""
    echo "⚔️ Your legendary D&D application is ready for heroes worldwide!"
    
    # Open the URL
    echo ""
    read -p "🌐 Open your app in browser now? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "$SERVICE_URL" || echo "Visit: $SERVICE_URL"
    fi
    
else
    echo "❌ Cloud Run deployment failed"
    exit 1
fi