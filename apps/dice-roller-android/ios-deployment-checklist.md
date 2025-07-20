# iOS Deployment Checklist

## Pre-Deployment Setup

### ✅ Apple Developer Account Information
- [ ] Team ID: ________________
- [ ] Apple ID (email): ________________
- [ ] App Store Connect access confirmed

### ✅ App Store Connect Setup
1. **Create New App**
   - Visit: https://appstoreconnect.apple.com
   - Click "+" to add new app
   - **App Name**: DnD Dice Roller
   - **Primary Language**: English
   - **Bundle ID**: com.tiation.dnddiceroller
   - **SKU**: dnddiceroller-ios

2. **Note the App Store Connect ID** (you'll need this)
   - App ID: ________________

### ✅ EAS Configuration
Update `eas.json` file with your details:
```json
"ios": {
  "appleId": "YOUR_APPLE_ID@email.com",
  "ascAppId": "YOUR_APP_STORE_CONNECT_ID",
  "appleTeamId": "YOUR_TEAM_ID"
}
```

## Build Process

### ✅ Commands to Run
```bash
# 1. Login to EAS
eas login

# 2. Configure build
eas build:configure

# 3. Build iOS app
npm run build:ios

# 4. Submit to App Store
npm run submit:ios
```

## App Store Connect Listing

### ✅ App Information
- [ ] **App Name**: DnD Dice Roller
- [ ] **Subtitle**: Advanced RPG dice with combos
- [ ] **Category**: Games > Role Playing
- [ ] **Content Rating**: 4+ (Made for Everyone)

### ✅ App Description
```
🎲 The Ultimate D&D Dice Rolling Experience

Transform your tabletop RPG sessions with the most advanced dice rolling app available. Whether you're a seasoned Dungeon Master or a new adventurer, DnD Dice Roller provides all the tools you need for complex dice mechanics.

⚔️ ADVANCED DICE MECHANICS
• Advantage & Disadvantage rolls with detailed breakdowns
• Exploding dice that keep rolling on maximum values
• Add and subtract dice combinations for complex calculations
• Support for all standard dice types: d4, d6, d8, d10, d12, d20, d100

🚀 QUICK EXPRESSION ROLLING
• Parse complex expressions like "3d6+2d4-1d8+5"
• Instant setup for multi-dice combinations
• Perfect for damage calculations and spell effects

💎 PROFESSIONAL FEATURES
• Dark neon theme optimized for gaming sessions
• Comprehensive roll history with timestamps
• Combined totals across multiple dice lines
• Detailed roll breakdowns showing individual results
• User authentication with personalized experience

Download now and elevate your tabletop RPG experience!
```

### ✅ Keywords
```
dnd,dice,dungeons,dragons,rpg,tabletop,gaming,roller,advantage,d20
```

### ✅ Screenshots Required
- [ ] iPhone 6.7": 3-10 screenshots (1290 x 2796px)
- [ ] iPhone 6.1": 3-10 screenshots (1179 x 2556px)  
- [ ] iPad Pro: 3-10 screenshots (2048 x 2732px)

### ✅ App Icon
- [ ] 1024x1024px PNG (no transparency)

### ✅ App Preview Video (Optional)
- [ ] 15-30 seconds showcasing main features

## Submission Checklist

### ✅ Before Submission
- [ ] App builds without errors
- [ ] All features tested on device
- [ ] App follows iOS Human Interface Guidelines
- [ ] Privacy policy accessible
- [ ] Age rating appropriate
- [ ] Screenshots show actual app functionality
- [ ] App description is accurate

### ✅ Review Process
- [ ] Build uploaded successfully
- [ ] All metadata completed
- [ ] Screenshots uploaded
- [ ] Submitted for review
- [ ] Review typically takes 24-48 hours

## Post-Submission

### ✅ After Approval
- [ ] App goes live automatically (or on release date you set)
- [ ] Monitor reviews and ratings
- [ ] Track downloads in App Store Connect
- [ ] Plan first update based on user feedback

## Common Issues & Solutions

### Build Failures
- **Certificate issues**: Run `eas credentials` to manage certificates
- **Bundle ID conflicts**: Ensure Bundle ID matches App Store Connect
- **Provisioning profile**: EAS handles this automatically

### Review Rejections
- **Metadata mismatch**: Ensure screenshots match actual app
- **Missing functionality**: All advertised features must work
- **Content rating**: Must match actual app content

### Contact Information
- **EAS Support**: https://docs.expo.dev/eas/
- **Apple Developer Support**: https://developer.apple.com/support/