# Contributing to DnD Dice Roller

Thank you for your interest in contributing to the DnD Dice Roller project! This document provides guidelines and information for contributors.

## 🌟 Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read and follow these guidelines to ensure a positive experience for everyone.

### Our Pledge

We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- Expo CLI
- Android Studio (for Android development)
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/dnddiceroller-android.git
   cd dnddiceroller-android/DnDDiceRoller
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## 📝 How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Include detailed reproduction steps
4. Add screenshots if applicable
5. Specify device and OS information

### Suggesting Features

1. Check existing feature requests
2. Use the feature request template
3. Explain the use case and benefits
4. Consider D&D gameplay context
5. Provide mockups or examples if possible

### Code Contributions

1. **Create a branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Commit your changes** with a clear message:
   ```bash
   git commit -m "feat: add dice roll sound effects"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a pull request** using our PR template

## 🎯 Development Guidelines

### Code Style

- Use ES6+ JavaScript features
- Follow React Native best practices
- Use meaningful variable and function names
- Comment complex logic
- Keep functions small and focused

### File Structure

```
DnDDiceRoller/
├── App.js                 # Main app component
├── screens/               # Screen components
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   └── DiceRollerScreen.js
├── components/            # Reusable components
├── utils/                 # Utility functions
├── assets/               # Images and icons
└── docs/                 # Documentation
```

### Naming Conventions

- **Components**: PascalCase (e.g., `DiceRollerScreen`)
- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase (e.g., `diceCount`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_DICE_COUNT`)

### Testing

- Write unit tests for utility functions
- Test components with React Native Testing Library
- Include integration tests for critical paths
- Test on multiple devices and screen sizes

### Performance

- Use FlatList for large lists
- Implement proper state management
- Optimize image assets
- Profile app performance regularly

## 🎨 Design Guidelines

### Theme

The app uses a dark neon theme with:
- **Primary**: #00ffff (Cyan)
- **Secondary**: #ff00ff (Magenta)
- **Background**: Linear gradient from #0a0a0a to #16213e
- **Text**: #ffffff (White)
- **Accents**: Various neon colors

### UI/UX Principles

- **Accessibility**: Support screen readers and high contrast
- **Responsive**: Work on all screen sizes
- **Intuitive**: Clear navigation and user flows
- **Feedback**: Provide visual feedback for actions
- **Consistency**: Use design system components

## 🎲 D&D Context

### Game Mechanics

When contributing features related to D&D:
- Understand the dice rolling mechanics
- Consider different game editions (5e, Pathfinder, etc.)
- Think about common use cases (combat, skill checks, etc.)
- Validate calculations against official rules

### User Experience

- Prioritize speed and accuracy
- Make complex operations simple
- Support common D&D scenarios
- Consider accessibility for players with disabilities

## 📋 Pull Request Process

1. **Before submitting**:
   - Ensure all tests pass
   - Update documentation if needed
   - Check that your changes work on multiple devices
   - Follow the coding standards

2. **Pull Request Requirements**:
   - Use the PR template
   - Include a clear description
   - Reference related issues
   - Add screenshots for UI changes
   - Ensure CI passes

3. **Review Process**:
   - Maintainers will review your PR
   - Address any feedback promptly
   - Be open to suggestions and changes
   - Collaborate constructively

## 🔄 Release Process

### Version Numbering

We use Semantic Versioning (semver):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

### Release Cycle

- **Patch releases**: As needed for critical bugs
- **Minor releases**: Monthly with new features
- **Major releases**: Quarterly with significant changes

## 🏆 Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Special mentions for significant contributions
- Opportunity to become a maintainer

## 📞 Getting Help

- **Questions**: Open a discussion on GitHub
- **Issues**: Use the issue templates
- **Real-time chat**: Join our Discord community
- **Email**: contact@tiation.com

## 🔒 Security

For security vulnerabilities:
- Do not open public issues
- Email security@tiation.com
- Include detailed reproduction steps
- Allow time for investigation and fixes

## 📚 Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [D&D 5e SRD](https://dnd.wizards.com/resources/systems-reference-document)
- [Accessibility Guidelines](https://reactnative.dev/docs/accessibility)

## 🎉 Thank You

Your contributions help make D&D more accessible and enjoyable for players worldwide. Every contribution, no matter how small, makes a difference!

---

**Happy coding and may your rolls be natural 20s! 🎲**
