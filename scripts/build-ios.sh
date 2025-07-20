#!/bin/bash

# iOS App Build Script  
echo "🍎 Building D&D Dice Roller iOS App..."

cd ios-app/ios-app

# Check if Xcode command line tools are available
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Xcode command line tools not found."
    echo "Please install Xcode and run: xcode-select --install"
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
xcodebuild clean -project DNDDiceRoller.xcodeproj -scheme DNDDiceRoller

# Build for simulator (development)
echo "🔨 Building for iOS Simulator..."
xcodebuild build -project DNDDiceRoller.xcodeproj -scheme DNDDiceRoller -destination 'platform=iOS Simulator,name=iPhone 15,OS=latest'

if [ $? -eq 0 ]; then
    echo "✅ iOS Simulator build successful!"
else
    echo "❌ iOS Simulator build failed!"
    exit 1
fi

# Archive for App Store (if certificates configured)
echo "🏗️ Attempting to archive for App Store..."
if xcodebuild archive -project DNDDiceRoller.xcodeproj -scheme DNDDiceRoller -archivePath ./build/DNDDiceRoller.xcarchive 2>/dev/null; then
    echo "✅ Archive created successfully!"
    echo "📱 Archive location: ios-app/ios-app/build/DNDDiceRoller.xcarchive"
    echo "ℹ️ Use Xcode Organizer to upload to App Store Connect"
else
    echo "⚠️ Archive failed - likely due to missing certificates/provisioning profiles"
    echo "ℹ️ Configure signing certificates in Xcode for App Store submission"
fi

echo "✅ iOS build process complete!"