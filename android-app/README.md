# ⚔️ D&D Dice Roller - Android App

Epic dice rolling companion for Android devices with native Kotlin/Jetpack Compose implementation.

## 🚀 Quick Setup

### Android App
```bash
cd android-app
./gradlew assembleDebug
```

### Promotional Site
```bash
cd promotional-site
# Open index.html in browser or serve with:
python3 -m http.server 8000
```

## 📱 Features

- **Native Android**: Built with Kotlin & Jetpack Compose
- **Complete Dice Set**: d4, d6, d8, d10, d12, d20, d100
- **Epic Animations**: Material Design with D&D theming
- **Roll History**: Track all your epic rolls
- **Sound Effects**: Toggle dice sound on/off
- **Dark Theme**: Perfect for late-night campaigns

## 🎲 Core Functionality

Matches dnddiceroller.com features:
- Multi-dice rolling (d4-d100)
- Roll history tracking
- Sound toggle
- Quick roll interface
- Epic D&D theming

## 🏗️ Project Structure

```
dnd-dice-roller-android/
├── android-app/           # Native Android app (Kotlin)
│   ├── app/
│   │   └── src/main/kotlin/com/tiation/dnddiceroller/
│   │       ├── MainActivity.kt
│   │       ├── ui/screens/DiceRollerScreen.kt
│   │       ├── data/DiceType.kt
│   │       ├── viewmodels/DiceRollerViewModel.kt
│   │       └── ui/theme/
│   └── build.gradle
├── promotional-site/      # Marketing website
│   ├── index.html        # Main landing page
│   └── privacy-policy.html
└── assets/               # Screenshots & icons
```

## 🎨 Design System

- **Epic Gold**: Primary actions (#fbbf24)
- **Legendary Purple**: Secondary elements (#a855f7)
- **Dragon Red**: Accent color (#dc2626)
- **D&D Typography**: Fantasy-inspired fonts
- **Animated Dice**: Physics-based rolling animations

## 🔧 Development

### Requirements
- Android Studio Arctic Fox+
- Kotlin 1.8+
- Compose BOM 2023.10.01
- Min SDK 24, Target SDK 34

### Build Commands
```bash
# Debug build
./gradlew assembleDebug

# Release build
./gradlew assembleRelease

# Run tests
./gradlew test

# Install on device
./gradlew installDebug
```

## 📋 TODO

- [ ] Add multiple dice rolling (3d6, etc.)
- [ ] Implement advantage/disadvantage
- [ ] Add custom dice expressions
- [ ] Create app store screenshots
- [ ] Set up Play Store listing
- [ ] Add haptic feedback
- [ ] Implement roll statistics

## 🎯 Deployment

Ready for Google Play Store submission with promotional website for marketing.

---

**⚔️ Roll with Epic Power! ⚔️**