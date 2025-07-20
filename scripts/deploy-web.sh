#!/bin/bash

# Web Platform Deployment Script
echo "🌐 Deploying D&D Dice Roller Web Platform..."

cd web-platform

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests
echo "🧪 Running tests..."
npm run test

# Build application  
echo "🏗️ Building application..."
npm run build

# Deploy to Vercel (or your preferred platform)
echo "🚀 Deploying to production..."
if command -v vercel &> /dev/null; then
    vercel --prod
else
    echo "⚠️ Vercel CLI not found. Please deploy manually or install: npm i -g vercel"
fi

echo "✅ Web platform deployment complete!"