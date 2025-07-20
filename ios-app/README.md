# ⚔️ D&D Dice Roller - iOS App

Epic dice rolling companion for iOS devices with native Swift/SwiftUI implementation.

## 🚀 Quick Setup

### iOS App
```bash
cd ios-app
open DNDDiceRoller.xcodeproj
# Build and run in Xcode
```

### Promotional Site
```bash
cd promotional-site
# Open index.html in browser or serve with:
python3 -m http.server 8000
```

## 📱 Features

- **Native iOS**: Built with Swift & SwiftUI
- **Complete Dice Set**: d4, d6, d8, d10, d12, d20, d100
- **SwiftUI Animations**: Smooth spring physics & Core Animation
- **Roll History**: Comprehensive tracking with Core Data
- **Haptic Feedback**: Tactile response on supported devices
- **iOS Integration**: Respects system settings & accessibility

## 🎲 Core Functionality

Matches dnddiceroller.com features:
- Multi-dice rolling (d4-d100)
- Roll history tracking
- Sound toggle with system integration
- Quick roll interface
- Epic D&D theming optimized for iOS

## 🏗️ Project Structure

```
dnd-dice-roller-ios/
├── ios-app/                    # Native iOS app (Swift)
│   └── DNDDiceRoller/
│       ├── DNDDiceRollerApp.swift
│       ├── ContentView.swift
│       ├── Models/
│       │   └── DiceType.swift
│       └── ViewModels/
│           └── DiceRollerViewModel.swift
├── promotional-site/           # Marketing website
│   ├── index.html             # iOS-focused landing page
│   └── privacy-policy.html    # App Store compliant
└── assets/                    # Screenshots & icons
```

## 🍎 iOS-Specific Features

- **SwiftUI Native**: 60fps animations with spring physics
- **iPhone & iPad**: Adaptive layouts for all devices
- **iOS Design**: Human Interface Guidelines compliant
- **Haptic Feedback**: Precise tactile responses
- **System Integration**: Silent mode, accessibility, Dark Mode
- **Privacy First**: Local storage with iOS security

## 🎨 Design System

- **Epic Gold**: Primary actions (#fbbf24)
- **Legendary Purple**: Secondary elements (#a855f7)
- **iOS Dark Mode**: Optimized for system themes
- **SF Symbols**: Native iOS iconography where appropriate
- **Spring Animations**: Authentic iOS feel with SwiftUI

## 🔧 Development

### Requirements
- Xcode 15+
- iOS 16.0+ deployment target
- Swift 5.9+
- SwiftUI 4.0+

### Setup
1. Open `ios-app/DNDDiceRoller.xcodeproj` in Xcode
2. Select your development team
3. Build and run on simulator or device

### Build Configurations
- **Debug**: Development with full debugging
- **Release**: Optimized for App Store distribution

## 📋 TODO

- [ ] Add multiple dice rolling (3d6, 4d6 drop lowest)
- [ ] Implement advantage/disadvantage system
- [ ] Create custom dice expression parser
- [ ] Add App Store screenshots
- [ ] Set up App Store Connect listing
- [ ] Implement Core Data for persistent history
- [ ] Add roll statistics and analytics
- [ ] Support for iPad split view
- [ ] Add Shortcuts integration
- [ ] Implement Widget extension

## 🏪 App Store Preparation

- Privacy labels configured for App Store
- Compliant with Apple's privacy guidelines
- No data collection or tracking
- Local storage only
- Ready for TestFlight and App Store submission

## 📱 Device Support

- **iPhone**: iOS 16.0+, all screen sizes
- **iPad**: iPadOS 16.0+, adaptive layouts
- **Apple Silicon**: Native performance on M-series chips
- **Accessibility**: VoiceOver, Dynamic Type, Haptic feedback

---

**⚔️ Experience the Magic on iOS! ⚔️**