#!/bin/bash

echo "⚔️ Epic D&D Character Forge - Quick Deploy Script"
echo ""

# Check if logged in
if ! vercel whoami >/dev/null 2>&1; then
    echo "🔑 You need to login to Vercel first."
    echo ""
    echo "Please choose your preferred login method:"
    echo ""
    echo "1. GitHub Account (recommended)"
    echo "2. Email Account"
    echo "3. Google Account"
    echo ""
    
    read -p "Enter your choice (1-3): " choice
    
    echo ""
    echo "🌐 Opening Vercel login..."
    
    case $choice in
        1)
            echo "Select 'Continue with GitHub' when the browser opens"
            ;;
        2)
            echo "Select 'Continue with Email' when the browser opens"
            ;;
        3)
            echo "Select 'Continue with Google' when the browser opens"
            ;;
        *)
            echo "Select your preferred option when the browser opens"
            ;;
    esac
    
    echo ""
    echo "Running: vercel login"
    echo "(This will open your browser for authentication)"
    
    vercel login
    
    if ! vercel whoami >/dev/null 2>&1; then
        echo "❌ Login failed. Please try again."
        exit 1
    fi
    
    echo "✅ Successfully logged in!"
    echo ""
else
    echo "✅ Already logged in to Vercel as: $(vercel whoami)"
    echo ""
fi

echo "🚀 Starting deployment to Vercel..."
echo ""

# Deploy the application
echo "📦 Deploying Epic D&D Character Forge..."
DEPLOY_OUTPUT=$(vercel --prod --yes 2>&1)

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    
    # Extract the URL from the output
    URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[^[:space:]]*\.vercel\.app' | head -1)
    
    if [ ! -z "$URL" ]; then
        echo "🌟 Your Epic D&D Character Forge is now live at:"
        echo "🔗 $URL"
        echo ""
        echo "📋 Next Steps:"
        echo "1. Visit: https://vercel.com/dashboard"
        echo "2. Go to your project > Settings > Environment Variables"
        echo "3. Add these variables:"
        echo "   DATABASE_URL = file:./dev.db"
        echo "   NEXTAUTH_SECRET = [generate a random 32+ character string]"
        echo "   NEXTAUTH_URL = $URL"
        echo ""
        echo "4. The app will automatically redeploy with the new settings"
        echo ""
        echo "⚔️ Your legendary D&D application is ready for heroes!"
    else
        echo "Deployment completed, but couldn't extract URL."
        echo "Check your Vercel dashboard: https://vercel.com/dashboard"
    fi
else
    echo "❌ Deployment failed. Error output:"
    echo "$DEPLOY_OUTPUT"
    echo ""
    echo "🛠️ Troubleshooting:"
    echo "1. Check if you're in the correct directory"
    echo "2. Make sure package.json exists"
    echo "3. Try running: vercel --debug"
fi