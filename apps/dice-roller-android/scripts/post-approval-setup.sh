#!/bin/bash

# Post-Apple-Approval Setup Script
# Run this script after your Apple Developer membership is approved

echo "🎉 Congratulations! Setting up your approved Apple Developer account..."

# Check if required tools are installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g @expo/eas-cli
else
    echo "✅ EAS CLI found"
fi

echo ""
echo "📋 We need to collect your Apple Developer information:"
echo ""

# Get Apple ID
read -p "Enter your Apple ID (email): " APPLE_ID

# Get Team ID
echo ""
echo "📖 To find your Team ID:"
echo "1. Visit https://developer.apple.com/account/#/membership/"
echo "2. Look for 'Team ID' in the membership details"
echo ""
read -p "Enter your Apple Team ID: " TEAM_ID

# Create App Store Connect app first
echo ""
echo "📱 Next, create your app in App Store Connect:"
echo "1. Visit https://appstoreconnect.apple.com"
echo "2. Click '+' to create new app"
echo "3. Use these details:"
echo "   - Name: DnD Dice Roller"
echo "   - Bundle ID: com.tiation.dnddiceroller"
echo "   - SKU: dnddiceroller"
echo "4. Note the App ID (numeric ID in the URL)"
echo ""
read -p "Press Enter after creating the app, then enter the App ID: " APP_ID

# Update eas.json with the collected information
echo ""
echo "⚙️ Updating EAS configuration..."

# Create the updated eas.json
cat > eas.json << EOF
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true,
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      },
      "ios": {
        "appleId": "$APPLE_ID",
        "ascAppId": "$APP_ID",
        "appleTeamId": "$TEAM_ID"
      }
    }
  }
}
EOF

echo "✅ EAS configuration updated!"

# Configure EAS
echo ""
echo "🔧 Configuring EAS build..."
eas build:configure

echo ""
echo "🚀 Ready to deploy! Next steps:"
echo ""
echo "1. Build your iOS app:"
echo "   npm run build:ios"
echo ""
echo "2. While build is running (~15-20 mins), prepare your App Store listing:"
echo "   - Screenshots (see store-assets/screenshot-requirements.md)"
echo "   - App description (ready in store-assets/app-store-description.md)"
echo ""
echo "3. Submit to App Store:"
echo "   npm run submit:ios"
echo ""
echo "4. Complete your App Store Connect listing with screenshots and metadata"
echo ""
echo "📖 Full instructions: ./PRE-APPROVAL-SETUP.md"
echo ""
echo "🎯 Your app will be live in 2-4 days after submission!"