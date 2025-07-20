# App Store Deployment Guide

## Prerequisites

### Required Accounts
1. **Apple Developer Account** ($99/year)
   - Sign up at https://developer.apple.com
   - Complete enrollment process (can take 24-48 hours)

2. **Google Play Developer Account** ($25 one-time fee)
   - Sign up at https://play.google.com/console
   - Complete registration process

3. **Expo Account** (Free)
   - Sign up at https://expo.dev
   - Install EAS CLI: `npm install -g @expo/eas-cli`

## Step 1: Apple App Store Setup

### 1.1 Apple Developer Account Configuration
```bash
# Login to EAS with Apple credentials
eas login
eas build:configure
```

### 1.2 Create App Store Connect App
1. Visit https://appstoreconnect.apple.com
2. Click "+" to create new app
3. Fill in app information:
   - **Name**: DnD Dice Roller
   - **Bundle ID**: com.tiation.dnddiceroller
   - **Language**: English
   - **SKU**: dnddiceroller

### 1.3 Update EAS configuration
Edit `eas.json` and update the iOS submission settings:
```json
"ios": {
  "appleId": "your-apple-id@email.com",
  "ascAppId": "YOUR_APP_STORE_CONNECT_ID",
  "appleTeamId": "YOUR_TEAM_ID"
}
```

### 1.4 Build for iOS
```bash
# Build production iOS app
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --profile production
```

## Step 2: Google Play Store Setup

### 2.1 Google Play Console Setup
1. Visit https://play.google.com/console
2. Create new application
3. Fill in app details:
   - **App name**: DnD Dice Roller
   - **Default language**: English
   - **App or game**: Game

### 2.2 Generate Service Account Key
1. Go to Google Cloud Console
2. Create service account for Play Store publishing
3. Download JSON key file
4. Save as `google-service-account.json` in project root

### 2.3 Build for Android
```bash
# Build production Android app (AAB format)
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android --profile production
```

## Step 3: Store Assets Required

### App Icons
- **iOS**: 1024x1024px PNG (no alpha channel)
- **Android**: 512x512px PNG

### Screenshots
- **iOS**: 
  - iPhone: 1290x2796px, 1179x2556px (PNG/JPEG)
  - iPad: 2048x2732px, 1668x2388px
- **Android**: 
  - Phone: 1080x1920px minimum
  - 7" Tablet: 1200x1920px
  - 10" Tablet: 1920x1200px

### Marketing Assets
- **iOS**: Optional promotional graphics
- **Android**: Feature graphic 1024x500px, Promo video (optional)

## Step 4: App Store Optimization

### Keywords Strategy
- Primary: "dnd dice roller"
- Secondary: "dungeons dragons", "rpg dice", "tabletop gaming"
- Long-tail: "advantage disadvantage dice", "d20 dice roller"

### Conversion Optimization
1. Use first screenshot to show main dice interface
2. Highlight unique features (advantage/disadvantage)
3. Show expression parsing capability
4. Include professional design elements

## Step 5: Testing & Quality Assurance

### Pre-Submission Checklist
- [ ] App builds and runs without crashes
- [ ] All features work as expected
- [ ] UI looks good on different screen sizes
- [ ] Performance is smooth (60fps)
- [ ] App follows platform design guidelines
- [ ] Privacy policy is accessible
- [ ] App description is accurate

### Testing Builds
```bash
# Create preview builds for testing
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

## Step 6: Submission Process

### iOS App Store Review
1. Upload build via EAS Submit or App Store Connect
2. Fill in app information and metadata
3. Upload screenshots and app preview
4. Submit for review (typically 24-48 hours)

### Google Play Store Review
1. Upload AAB via EAS Submit or Play Console
2. Complete store listing with descriptions
3. Upload screenshots and assets
4. Submit for review (typically 1-3 hours)

## Step 7: Post-Launch

### Monitoring
- Track downloads and ratings
- Monitor crash reports
- Respond to user reviews
- Plan updates based on feedback

### Updates
```bash
# Increment version in app.json
# Build and submit new version
eas build --platform all --profile production
eas submit --platform all --profile production
```

## Troubleshooting

### Common iOS Issues
- **Build fails**: Check bundle identifier matches Apple Developer account
- **Upload fails**: Ensure app version is higher than previous submission
- **Rejection**: Review App Store Guidelines carefully

### Common Android Issues
- **AAB upload fails**: Check package name matches Play Console
- **Version conflicts**: Increment versionCode in app.json
- **API level**: Ensure target API level meets Google requirements

## Costs Summary
- **Apple Developer Program**: $99/year
- **Google Play Developer**: $25 one-time
- **EAS Build**: Free tier available, paid plans for more builds
- **Total first year**: ~$124 + optional EAS subscription

## Support Resources
- **Expo Documentation**: https://docs.expo.dev
- **Apple Developer**: https://developer.apple.com/support
- **Google Play Console Help**: https://support.google.com/googleplay/android-developer