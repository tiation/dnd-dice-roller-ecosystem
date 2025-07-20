#!/bin/bash
# 🚀 Epic D&D Character Forge Deployment Script

echo "⚔️ Starting Epic D&D Character Forge deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "🔧 Installing dependencies..."
npm install

echo "🗄️ Setting up database..."
npx prisma generate
npx prisma db push

echo "🏗️ Building the application..."
npm run build

echo "🧪 Running type check..."
npm run type-check

echo "✅ Build completed successfully!"

# Deployment options
echo ""
echo "🚀 Choose your deployment platform:"
echo "1. Vercel (Recommended for Next.js)"
echo "2. DigitalOcean App Platform"  
echo "3. Railway"
echo "4. Manual setup"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🌟 Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo "📦 Installing Vercel CLI..."
            npm i -g vercel
            vercel --prod
        fi
        ;;
    2)
        echo "🌊 Setting up for DigitalOcean..."
        echo "Please go to: https://cloud.digitalocean.com/apps"
        echo "Connect your GitHub repository: https://github.com/tiation/dnd-character-sheets-saas"
        ;;
    3)
        echo "🚂 Deploying to Railway..."
        if command -v railway &> /dev/null; then
            railway up
        else
            echo "📦 Installing Railway CLI..."
            npm i -g @railway/cli
            railway login
            railway up
        fi
        ;;
    4)
        echo "📋 Manual setup instructions:"
        echo "1. Set environment variables"
        echo "2. Run: npm start"
        echo "3. Access at: http://localhost:3000"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Epic D&D Character Forge deployment complete!"
echo "⚔️ Your legendary application is ready for heroes!"