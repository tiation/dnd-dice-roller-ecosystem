#!/bin/bash

# Android App Build Script
echo "🤖 Building D&D Dice Roller Android App..."

cd android-app

# Clean previous builds
echo "🧹 Cleaning previous builds..."
./gradlew clean

# Run tests
echo "🧪 Running tests..."
./gradlew test

# Build debug version
echo "🔨 Building debug version..."
./gradlew assembleDebug

# Build release version (if keystore configured)
echo "🏗️ Building release version..."
if [ -f "app/keystore.jks" ]; then
    ./gradlew assembleRelease
    echo "✅ Release APK built successfully!"
else
    echo "⚠️ Keystore not found. Skipping release build."
    echo "ℹ️ Configure keystore for Play Store releases."
fi

echo "✅ Android build complete!"
echo "📱 Debug APK: android-app/app/build/outputs/apk/debug/"
[ -f "app/keystore.jks" ] && echo "📱 Release APK: android-app/app/build/outputs/apk/release/"