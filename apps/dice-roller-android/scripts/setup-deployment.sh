#!/bin/bash

# DnD Dice Roller - Deployment Setup Script
echo "🎲 Setting up DnD Dice Roller for App Store deployment..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g @expo/eas-cli
else
    echo "✅ EAS CLI already installed"
fi

# Login to Expo
echo "🔐 Please login to your Expo account:"
eas login

# Configure EAS Build
echo "⚙️ Configuring EAS Build..."
eas build:configure

echo ""
echo "🚀 Setup complete! Next steps:"
echo ""
echo "1. Set up your Apple Developer Account ($99/year):"
echo "   - Visit: https://developer.apple.com"
echo "   - Complete enrollment process"
echo ""
echo "2. Set up your Google Play Developer Account ($25 one-time):"
echo "   - Visit: https://play.google.com/console"
echo "   - Complete registration"
echo ""
echo "3. Update eas.json with your credentials:"
echo "   - Apple Team ID and Apple ID"
echo "   - Google service account key"
echo ""
echo "4. Build your apps:"
echo "   npm run build:all"
echo ""
echo "5. Submit to stores:"
echo "   npm run submit:all"
echo ""
echo "📖 Read the full guide: ./DEPLOYMENT_GUIDE.md"