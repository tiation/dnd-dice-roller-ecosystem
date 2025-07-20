# 🎲 DnD Dice Roller - Wiki Home

Welcome to the comprehensive documentation for the DnD Dice Roller Android application! This wiki contains all the information you need to understand, use, contribute to, and deploy the application.

## 📚 Documentation Sections

### 👥 For Users
- **[User Guide](User-Guide)** - Complete guide to using the app
- **[Getting Started](Getting-Started)** - Quick start guide for new users
- **[FAQ](FAQ)** - Frequently asked questions
- **[Troubleshooting](Troubleshooting)** - Common issues and solutions

### 🛠️ For Developers
- **[Development Setup](Development-Setup)** - How to set up your development environment
- **[API Reference](API-Reference)** - Complete API documentation
- **[Architecture](Architecture)** - Technical architecture and design decisions
- **[Contributing](Contributing)** - How to contribute to the project

### 🚀 For Deployers
- **[Deployment Guide](Deployment-Guide)** - How to deploy the application
- **[Configuration](Configuration)** - Application configuration options
- **[Security](Security)** - Security considerations and best practices
- **[Monitoring](Monitoring)** - Application monitoring and logging

## 🎯 Quick Links

| Resource | Description |
|----------|-------------|
| [GitHub Repository](https://github.com/tiation/dnddiceroller-android) | Main repository |
| [GitHub Pages](https://tiation.github.io/dnddiceroller-android) | Project website |
| [Issues](https://github.com/tiation/dnddiceroller-android/issues) | Bug reports and feature requests |
| [Releases](https://github.com/tiation/dnddiceroller-android/releases) | Download latest version |

## 🎲 What is DnD Dice Roller?

DnD Dice Roller is a comprehensive, enterprise-grade Android application designed for Dungeons & Dragons players and other tabletop RPG enthusiasts. It provides a digital solution for rolling dice with advanced features like:

- **Multi-die Rolling**: Support for D4, D6, D8, D10, D12, D20, and D100
- **Custom Modifiers**: Add or subtract values from rolls
- **Roll History**: Track your last 20 rolls with timestamps
- **User Authentication**: Secure login and registration system
- **Dark Neon Theme**: Professional, gaming-focused UI design
- **Offline Capability**: Works without internet connection

## 📱 Key Features

### 🎯 Core Functionality
- Roll single or multiple dice of various types
- Apply modifiers to rolls (positive or negative)
- Create multiple dice line configurations
- View detailed roll results with individual dice values
- Track roll history with timestamps

### 🔐 Security Features
- Secure user authentication with password validation
- Session management with AsyncStorage
- Input validation and sanitization
- Password strength indicators

### 🎨 User Experience
- Dark neon theme with cyan/magenta gradient accents
- Responsive design for all Android screen sizes
- Touch-friendly controls with haptic feedback
- Smooth animations and transitions
- Keyboard-aware layouts

### 📊 Data Management
- Local storage for user preferences
- Roll history persistence
- Offline-first architecture
- Secure data encryption

## 🏛️ Architecture Overview

The application is built using modern React Native architecture:

```
┌─────────────────────────────────────────┐
│                Frontend                 │
│            (React Native)               │
├─────────────────────────────────────────┤
│               Navigation                │
│           (React Navigation)            │
├─────────────────────────────────────────┤
│              State Management           │
│            (React Hooks)                │
├─────────────────────────────────────────┤
│               Local Storage             │
│            (AsyncStorage)               │
├─────────────────────────────────────────┤
│              Platform Layer             │
│               (Expo SDK)                │
└─────────────────────────────────────────┘
```

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Framework** | React Native with Expo |
| **Navigation** | React Navigation 6.x |
| **UI Components** | Custom components with Linear Gradient |
| **State Management** | React Hooks (useState, useEffect) |
| **Storage** | AsyncStorage |
| **Authentication** | Custom JWT-based system |
| **Styling** | StyleSheet with theme system |
| **Testing** | Jest + React Native Testing Library |
| **CI/CD** | GitHub Actions |

## 📈 Project Stats

- **Lines of Code**: 1,500+
- **Components**: 15+
- **Screens**: 3 main screens
- **Supported Dice**: 7 types (D4-D100)
- **Dependencies**: 25+ packages
- **Minimum Android Version**: API 21 (Android 5.0)

## 🎯 Target Audience

### Primary Users
- **D&D Players**: Individuals who play Dungeons & Dragons
- **RPG Enthusiasts**: Players of various tabletop role-playing games
- **Digital Natives**: Users who prefer digital tools over physical dice

### Secondary Users
- **Game Masters**: DMs who need quick dice rolling tools
- **Content Creators**: Streamers and content creators who need reliable dice rolling
- **Developers**: Contributors to the open-source project

## 🔄 Development Status

| Component | Status |
|-----------|--------|
| **Core Features** | ✅ Complete |
| **Authentication** | ✅ Complete |
| **UI/UX** | ✅ Complete |
| **Testing** | 🔄 In Progress |
| **Documentation** | 🔄 In Progress |
| **Deployment** | 🔄 In Progress |

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Report Bugs**: Use our [issue templates](https://github.com/tiation/dnddiceroller-android/issues/new/choose)
2. **Suggest Features**: Submit feature requests with detailed descriptions
3. **Code Contributions**: Follow our [contributing guidelines](Contributing)
4. **Documentation**: Help improve our documentation
5. **Testing**: Test the app and report issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/tiation/dnddiceroller-android/blob/main/LICENSE) file for details.

## 📞 Support

Need help? Here are your options:

- **Documentation**: Check this wiki for detailed guides
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Email**: Contact us at support@tiation.com
- **Security**: For security issues, email security@tiation.com

## 🎉 Acknowledgments

- **React Native Community**: For the excellent framework
- **Expo Team**: For the development tools and platform
- **D&D Community**: For inspiration and feedback
- **Contributors**: Everyone who has helped make this project better

---

**Ready to get started?** Check out our [Getting Started](Getting-Started) guide!

*Last updated: January 2025*
