# D&D Monorepo Workspace Guide 🏗️

This guide helps you navigate and work effectively within the D&D monorepo structure.

## 🗂️ Workspace Structure

### Applications (`apps/`)
Each app is a self-contained application with its own dependencies and build process:

```bash
apps/
├── dice-roller-ios/          # Native iOS Swift app
├── dice-roller-android/      # React Native Android app  
├── dice-roller-desktop/      # Flutter cross-platform desktop
├── dice-roller-enhanced/     # Advanced web dice roller
├── character-sheets/         # Main character sheet SaaS
└── character-saas/          # Multi-tenant character platform
```

### Marketing Sites (`sites/`)
Static and dynamic marketing websites:

```bash
sites/
├── dice-roller-marketing/    # Dice roller product marketing
├── character-tools-landing/ # Character tools landing page
└── dnd-docs/                # Documentation site
```

### Shared Packages (`packages/`)
Reusable code shared across applications:

```bash
packages/
├── dice-engine/             # Core dice rolling logic
├── dnd-rules/              # D&D 5e rules implementation  
├── ui-components/          # Shared React components
├── character-data/         # Character data models
└── game-utils/             # Common gaming utilities
```

### Assets (`assets/`)
Shared visual and audio assets:

```bash
assets/
├── character-portraits/     # Character artwork library
├── dice-models/            # 3D dice models and textures
├── ui-elements/            # Shared UI assets and icons
└── sounds/                 # Audio effects and ambience
```

## 🚀 Getting Started

### 1. Initial Setup
```bash
# Clone the monorepo
git clone https://github.com/tiation/tiation-dnd-monorepo.git
cd tiation-dnd-monorepo

# Install all dependencies
npm install

# Build shared packages first
npm run build:packages

# Start all development servers
npm run dev
```

### 2. Working on Specific Apps

#### iOS Dice Roller
```bash
# Navigate to iOS app
cd apps/dice-roller-ios

# Open in Xcode
open DnDDiceRoller.xcodeproj

# Or use Xcode CLI
xcodebuild -scheme DnDDiceRoller build
```

#### Android Dice Roller
```bash
# Navigate to Android app
cd apps/dice-roller-android

# Install React Native dependencies
npm install

# Start Metro bundler
npm start

# Run on Android device/emulator
npm run android
```

#### Web Applications
```bash
# Character Sheets SaaS
cd apps/character-sheets
npm run dev

# Enhanced Dice Roller
cd apps/dice-roller-enhanced
npm run dev

# Marketing Site
cd sites/dice-roller-marketing
npm run dev
```

#### Desktop App (Flutter)
```bash
# Navigate to desktop app
cd apps/dice-roller-desktop

# Get Flutter dependencies
flutter pub get

# Run on desktop
flutter run -d macos
flutter run -d linux  
flutter run -d windows
```

### 3. Working with Shared Packages

#### Dice Engine Package
```bash
# Navigate to dice engine
cd packages/dice-engine

# Run tests
npm test

# Build the package
npm run build

# Use in another app
# In apps/character-sheets/package.json:
# "dice-engine": "workspace:*"
```

#### UI Components
```bash
# Navigate to UI components
cd packages/ui-components

# Start Storybook for development
npm run storybook

# Build component library
npm run build
```

## 🔄 Development Workflows

### Making Changes Across Multiple Apps

1. **Update Shared Package**:
```bash
# Make changes to shared package
cd packages/dice-engine
# Edit source files
npm run build
npm run test
```

2. **Update Consuming Apps**:
```bash
# The changes are automatically available to apps
cd apps/character-sheets
npm run dev # Will use updated dice-engine
```

3. **Test Integration**:
```bash
# Test all apps that use the package
npm run test --workspace=apps/character-sheets
npm run test --workspace=apps/dice-roller-enhanced
```

### Adding New Dependencies

#### App-Specific Dependencies
```bash
# Add dependency to specific app
npm install react-query --workspace=apps/character-sheets

# Or from root directory
npm install react-query -w apps/character-sheets
```

#### Shared Dependencies
```bash
# Add to root for tooling (ESLint, Prettier, etc.)
npm install -D eslint-plugin-react

# Add to shared package
npm install lodash --workspace=packages/dice-engine
```

### Creating New Packages

1. **Create Package Directory**:
```bash
mkdir packages/new-package
cd packages/new-package
```

2. **Initialize Package**:
```bash
npm init -y
# Edit package.json with proper name and scripts
```

3. **Add to Workspace**:
The package is automatically included due to `"workspaces": ["packages/*"]` in root package.json.

## 🧪 Testing Strategy

### Unit Tests
```bash
# Test all packages
npm run test --workspace=packages/*

# Test specific package
npm run test --workspace=packages/dice-engine

# Test with coverage
npm run test:coverage --workspace=packages/dice-engine
```

### Integration Tests
```bash
# Test web applications
npm run test:integration --workspace=apps/character-sheets

# Test cross-package integration
npm run test:integration
```

### End-to-End Tests
```bash
# Run E2E tests for web apps
npm run test:e2e --workspace=apps/character-sheets

# Run mobile E2E tests
npm run test:e2e --workspace=apps/dice-roller-android
```

### Visual Regression Tests
```bash
# Run Storybook visual tests
npm run test:visual --workspace=packages/ui-components

# Update visual baselines
npm run test:visual:update
```

## 🏗️ Build Process

### Development Builds
```bash
# Build all packages first
npm run build:packages

# Build all apps
npm run build:apps

# Build marketing sites
npm run build:sites

# Build everything
npm run build
```

### Production Builds
```bash
# Build for production deployment
NODE_ENV=production npm run build

# Build specific app for production
NODE_ENV=production npm run build -w apps/character-sheets
```

### Platform-Specific Builds

#### iOS App
```bash
cd apps/dice-roller-ios

# Debug build
xcodebuild -scheme DnDDiceRoller -configuration Debug build

# Release build for App Store
xcodebuild -scheme DnDDiceRoller -configuration Release archive
```

#### Android App
```bash
cd apps/dice-roller-android

# Debug APK
npm run build:android:debug

# Release AAB for Play Store
npm run build:android:release
```

#### Flutter Desktop
```bash
cd apps/dice-roller-desktop

# Build for current platform
flutter build macos --release
flutter build windows --release
flutter build linux --release
```

## 🚀 Deployment

### Web Deployments
```bash
# Deploy marketing sites
npm run deploy --workspace=sites/dice-roller-marketing

# Deploy character sheets to Vercel
npm run deploy --workspace=apps/character-sheets

# Deploy all web properties
npm run deploy:web
```

### Mobile App Releases
```bash
# Prepare iOS for App Store
cd apps/dice-roller-ios
npm run release:ios

# Prepare Android for Play Store  
cd apps/dice-roller-android
npm run release:android

# Release both mobile platforms
npm run release:mobile
```

## 📦 Package Management

### Dependency Updates
```bash
# Check for outdated packages across workspace
npm outdated --workspaces

# Update all dependencies
npm update --workspaces

# Update specific package
npm update react --workspace=apps/character-sheets
```

### Adding Workspace Dependencies
```bash
# Use shared package in an app
# In apps/character-sheets/package.json:
{
  "dependencies": {
    "dice-engine": "workspace:*",
    "ui-components": "workspace:*"
  }
}

# Then install
npm install --workspace=apps/character-sheets
```

## 🔍 Debugging

### Development Debugging
```bash
# Debug specific app with source maps
cd apps/character-sheets
npm run dev:debug

# Debug shared package
cd packages/dice-engine
npm run test:debug
```

### Cross-Package Debugging
When debugging issues that span multiple packages:

1. **Use npm link for local development**:
```bash
cd packages/dice-engine
npm link

cd apps/character-sheets
npm link dice-engine
```

2. **Use workspace protocol**:
```bash
# In package.json, use:
"dice-engine": "workspace:*"
# This ensures you're always using the local version
```

## 📊 Monitoring & Analytics

### Build Performance
```bash
# Analyze bundle sizes
npm run analyze --workspace=apps/character-sheets

# Monitor build times
npm run build:stats
```

### Dependency Analysis
```bash
# Check dependency tree
npm list --workspace=apps/character-sheets

# Find duplicate dependencies
npm run deps:duplicates

# Security audit
npm audit --workspaces
```

## 🤝 Contributing

### Branch Strategy
```bash
# Feature branches for specific apps
git checkout -b feature/character-sheets-spells
git checkout -b feature/dice-roller-ios-haptics

# Shared package improvements
git checkout -b improvement/dice-engine-performance

# Cross-cutting features
git checkout -b feature/unified-theming
```

### Commit Conventions
```bash
# App-specific changes
git commit -m "feat(character-sheets): add spell slot tracking"
git commit -m "fix(dice-roller-ios): resolve haptic feedback issue"

# Package changes
git commit -m "feat(dice-engine): add advantage/disadvantage support"

# Multi-app changes
git commit -m "feat: unified dark theme across all apps"
```

### Pull Request Guidelines
1. **Test affected workspaces**: Ensure all related packages/apps pass tests
2. **Update documentation**: Include any API or usage changes
3. **Check bundle sizes**: Monitor impact on app bundle sizes
4. **Cross-platform testing**: Test on multiple platforms when applicable

This workspace structure provides excellent organization while maintaining the flexibility to work on individual components or the entire ecosystem as needed!