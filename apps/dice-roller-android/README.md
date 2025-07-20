# 🎲 DnD Dice Roller - Android App

<div align="center">

![Tiation Ecosystem](https://img.shields.io/badge/🔮_TIATION_ECOSYSTEM-DnDDiceRoller-00FFFF?style=for-the-badge&labelColor=0A0A0A&color=00FFFF)

**Enterprise-grade solution in the Tiation ecosystem**

*Professional • Scalable • Mission-Driven*

[![🌐_Live_Demo](https://img.shields.io/badge/🌐_Live_Demo-View_Project-00FFFF?style=flat-square&labelColor=0A0A0A)](https://github.com/tiation/DnDDiceRoller)
[![📚_Documentation](https://img.shields.io/badge/📚_Documentation-Complete-007FFF?style=flat-square&labelColor=0A0A0A)](https://github.com/tiation/DnDDiceRoller)
[![⚡_Status](https://img.shields.io/badge/⚡_Status-Active_Development-FF00FF?style=flat-square&labelColor=0A0A0A)](https://github.com/tiation/DnDDiceRoller)
[![📄_License](https://img.shields.io/badge/📄_License-MIT-00FFFF?style=flat-square&labelColor=0A0A0A)](https://github.com/tiation/DnDDiceRoller)

</div>

---
A comprehensive, enterprise-grade D6D dice rolling application for Android with dark neon theme and user authentication.

![DnD Dice Roller](https://img.shields.io/badge/React%20Native-0.72-blue.svg)
![Expo SDK](https://img.shields.io/badge/Expo-49.0-000020.svg)
![Status](https://img.shields.io/badge/Status-Active-green.svg)

## 🚀 Features

### 🎯 Core Functionality
- **Multi-Die Rolling**: Roll any combination of D4, D6, D8, D10, D12, D20, D100
- **Custom Modifiers**: Add positive or negative modifiers to rolls
- **Multiple Dice Lines**: Create and manage multiple dice configurations
- **Roll History**: Track last 20 rolls with timestamps
- **Real-time Results**: Instant roll calculations with detailed breakdowns

### 🔐 Authentication System
- **User Registration**: Secure account creation with password validation
- **Login System**: Session management with AsyncStorage
- **Password Strength**: Real-time password strength indicator
- **Secure Logout**: Clean session termination

### 🎨 UI/UX Design
- **Dark Neon Theme**: Professional dark gradient with cyan/magenta accents
- **Responsive Layout**: Optimized for all Android screen sizes
- **Smooth Animations**: Fade-in effects and touch feedback
- **Intuitive Controls**: Easy-to-use dice selection and configuration

### 📱 Mobile Optimizations
- **Keyboard Avoidance**: Smart layout adjustments for input fields
- **Touch-Friendly**: Large buttons and intuitive gestures
- **Safe Area Support**: Proper handling of device notches and navigation bars
- **Offline Capable**: Local storage for user preferences and history

## 📋 Requirements

- **Node.js**: 16.x or higher
- **npm**: 7.x or higher
- **Expo CLI**: Latest version
- **Android Studio**: For Android development
- **Android SDK**: API level 21 or higher

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tiation/dnddiceroller-android.git
   cd dnddiceroller-android/DnDDiceRoller
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Expo CLI (if not already installed)**
   ```bash
   npm install -g @expo/cli
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the development server**
   ```bash
   npm start
   ```

2. **Run on Android**
   ```bash
   npm run android
   ```

3. **Run on iOS (for testing)**
   ```bash
   npm run ios
   ```

4. **Run on Web (for testing)**
   ```bash
   npm run web
   ```

### Production Build

1. **Build for Android**
   ```bash
   expo build:android
   ```

2. **Build APK**
   ```bash
   eas build --platform android
   ```

## 📱 App Structure

```
DnDDiceRoller/
├── App.js                 # Main app component with navigation
├── screens/
│   ├── LoginScreen.js     # User authentication
│   ├── RegisterScreen.js  # User registration
│   └── DiceRollerScreen.js # Main dice rolling interface
├── components/            # Reusable UI components
├── utils/                 # Utility functions
├── assets/               # Images and icons
└── README.md             # This file
```

## 🎮 How to Use

### 1. Authentication
- **First Time**: Register with username and password
- **Returning User**: Login with your credentials
- **Security**: Passwords are validated for strength

### 2. Rolling Dice
- **Add Dice Lines**: Use the "+" button to add new dice configurations
- **Configure Dice**: 
  - Set dice count (1-99)
  - Select dice type (d4, d6, d8, d10, d12, d20, d100)
  - Add modifiers (+/- values)
- **Roll**: Individual rolls or "Roll All" for all dice lines
- **View Results**: See individual dice rolls and totals

### 3. History Tracking
- **Automatic Logging**: All rolls are automatically saved
- **Timestamp**: Each roll includes time information
- **Clear History**: Remove all previous rolls

### 4. Account Management
- **Profile**: View your username in the header
- **Logout**: Secure logout with confirmation

## 🔧 Configuration

### Theme Customization
The app uses a dark neon theme with these primary colors:
- **Primary**: #00ffff (Cyan)
- **Secondary**: #ff00ff (Magenta)
- **Background**: Linear gradient from #0a0a0a to #16213e
- **Accents**: Various neon colors for highlights

### Storage
- **AsyncStorage**: Local storage for user preferences
- **Session Management**: Secure token-based authentication
- **Data Persistence**: Dice configurations and history

## 🛡️ Security Features

- **Password Validation**: Minimum 6 characters with strength checking
- **Input Sanitization**: Protection against malicious input
- **Session Security**: Secure logout and token management
- **Data Encryption**: Local storage encryption for sensitive data

## 🚀 Deployment

### Android Play Store
1. Build production APK
2. Sign with release keystore
3. Upload to Google Play Console
4. Follow Play Store guidelines

### Direct APK Distribution
1. Build signed APK
2. Enable "Unknown Sources" on target devices
3. Install directly from APK file

## 📝 Development Notes

### Code Structure
- **React Native**: Cross-platform mobile development
- **Expo**: Managed workflow for easier development
- **Navigation**: Stack-based navigation between screens
- **State Management**: React hooks for local state
- **Storage**: AsyncStorage for persistence

### Performance Optimizations
- **FlatList**: Efficient rendering for dice lines and history
- **Memoization**: Optimized re-renders for better performance
- **Image Optimization**: Compressed assets for faster loading
- **Bundle Splitting**: Lazy loading of non-critical components

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Native Community**: For the excellent framework
- **Expo Team**: For the development tools
- **D6D Community**: For inspiring this project
- **Contributors**: All who have helped improve this app

## 📞 Support

For support, email [support@tiation.com](mailto:support@tiation.com) or create an issue on GitHub.

---

**Built with ❤️ by Tiation | Making D6D more accessible through technology**

---

## 🔮 Tiation Ecosystem

This repository is part of the Tiation ecosystem. Explore related projects:

- [🌟 TiaAstor](https://github.com/TiaAstor/TiaAstor) - Personal brand and story
- [🐰 ChaseWhiteRabbit NGO](https://github.com/tiation/tiation-chase-white-rabbit-ngo) - Social impact initiatives
- [🏗️ Infrastructure](https://github.com/tiation/tiation-rigger-infrastructure) - Enterprise infrastructure
- [🤖 AI Agents](https://github.com/tiation/tiation-ai-agents) - Intelligent automation
- [📝 CMS](https://github.com/tiation/tiation-cms) - Content management system
- [⚡ Terminal Workflows](https://github.com/tiation/tiation-terminal-workflows) - Developer tools

---
*Built with 💜 by the Tiation team*