# Pre-Approval Setup Guide
## Get Ready to Deploy Instantly Once Apple Approves Your Developer Account

### 📋 **What to Do While Waiting for Apple Approval**

## Step 1: Install Required Tools
```bash
# Install EAS CLI globally
npm install -g @expo/eas-cli

# Install Expo CLI (backup)
npm install -g @expo/cli

# Verify installation
eas --version
expo --version
```

## Step 2: Create Expo Account
```bash
# Create account at https://expo.dev
# Then login locally
eas login
```

## Step 3: Prepare App Assets

### ✅ App Icon (Required)
- **Size**: 1024x1024px
- **Format**: PNG (no transparency)
- **Design**: Professional gaming theme matching your app
- **Location**: `./assets/images/icon.png` ✅ (already exists)

### ✅ Screenshots Needed
Create these screenshots using iOS Simulator:

#### iPhone Screenshots (Required)
- **iPhone 14 Pro Max**: 1290 x 2796px
- **iPhone 14 Pro**: 1179 x 2556px
- **Count**: 3-5 screenshots minimum

#### iPad Screenshots (Recommended)
- **iPad Pro 12.9"**: 2048 x 2732px
- **Count**: 3-5 screenshots

### Screenshot Content Strategy:
1. **Screenshot 1**: Main dice interface with results
2. **Screenshot 2**: Advantage/Disadvantage feature
3. **Screenshot 3**: Expression parsing (3d6+2d4-1d8)
4. **Screenshot 4**: Roll history and combined totals
5. **Screenshot 5**: Multiple dice lines with operations

## Step 4: Test Your App Thoroughly

### Local Testing
```bash
# Start development server
npm start

# Test on iOS Simulator
npm run ios

# Test all features:
# ✅ Dice rolling works
# ✅ Advantage/Disadvantage works
# ✅ Exploding dice works
# ✅ Expression parsing works
# ✅ Roll history saves
# ✅ Combined totals calculate correctly
# ✅ UI looks good on different screen sizes
```

### Preview Build Testing
```bash
# Create preview build (when ready)
npm run preview:ios

# This creates a build you can install on physical device via TestFlight
```

## Step 5: Prepare Your Information

### Information You'll Need (Fill These Out):

#### Apple Developer Details
- **Apple ID Email**: ________________
- **Team ID**: ________________ (Available after approval)
- **Organization Name**: ________________

#### App Store Connect Details  
- **App Name**: DnD Dice Roller
- **Bundle ID**: com.tiation.dnddiceroller ✅ (already configured)
- **Primary Language**: English
- **Category**: Games > Role Playing
- **Age Rating**: 4+ (No Objectionable Content)

#### Pricing & Availability
- **Price**: Free ✅
- **Availability**: All Countries ✅
- **Release**: Manual Release After Approval ✅

## Step 6: Content Preparation

### ✅ App Store Description (Ready!)
Located in: `./store-assets/app-store-description.md`

### ✅ Keywords (Ready!)
```
dnd,dice,dungeons,dragons,rpg,tabletop,gaming,roller,advantage,d20
```

### ✅ App Subtitle (Ready!)
"Advanced RPG dice with combos"

## Step 7: EAS Configuration Template

Once you get your Apple Developer info, update `eas.json`:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "YOUR_APPLE_ID@email.com",
        "ascAppId": "YOUR_APP_STORE_CONNECT_ID", 
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

## 🚀 **Instant Deployment Commands (After Approval)**

### Day 1: Apple Membership Approved
```bash
# 1. Update eas.json with your credentials
# 2. Configure EAS
eas build:configure

# 3. Build iOS app (takes ~15-20 minutes)
npm run build:ios
```

### Day 1: Create App Store Connect Listing
1. Visit https://appstoreconnect.apple.com
2. Create new app with prepared information
3. Note the App Store Connect ID
4. Update eas.json with the ID

### Day 1: Submit to App Store
```bash
# Submit automatically
npm run submit:ios

# OR submit manually via App Store Connect
```

### Day 1-2: Complete App Store Connect
1. Upload your screenshots
2. Add app description (copy from prepared file)
3. Set pricing (Free)
4. Submit for review

### Day 2-4: Apple Review
- Apple reviews your app (usually 24-48 hours)
- Monitor status in App Store Connect
- Respond to any feedback if needed

### Day 3-5: App Goes Live! 🎉

## 📱 **What to Expect**

### Timeline After Apple Approval:
- **Day 1**: Configure and submit app
- **Day 2-3**: Apple review process  
- **Day 3-4**: App approved and live on App Store

### Build Process:
- **EAS Build Time**: 15-20 minutes
- **Upload Time**: 2-3 minutes
- **Total Setup**: ~30 minutes of your time

## 🛠️ **Troubleshooting Prep**

### Common Issues & Solutions:
1. **Build fails**: Usually credential issues - run `eas credentials`
2. **Upload fails**: Check bundle ID matches App Store Connect
3. **Review rejection**: Usually metadata issues - ensure screenshots match app

### Support Resources:
- **EAS Documentation**: https://docs.expo.dev/eas/
- **Apple Developer Support**: https://developer.apple.com/support/
- **Expo Discord**: https://discord.gg/expo

## ✅ **Ready Checklist**

Before Apple approval:
- [ ] EAS CLI installed
- [ ] Expo account created
- [ ] App thoroughly tested
- [ ] Screenshots planned
- [ ] App information prepared
- [ ] This guide reviewed

After Apple approval (Day 1):
- [ ] Update eas.json with credentials
- [ ] Run build command
- [ ] Create App Store Connect listing
- [ ] Submit app for review
- [ ] Upload screenshots and metadata

## 🎯 **Success Metrics to Track**

Once live, monitor:
- **Downloads**: Track in App Store Connect
- **Ratings**: Aim for 4.5+ stars
- **Reviews**: Respond to user feedback
- **Crashes**: Monitor via App Store Connect
- **Usage**: Plan updates based on user behavior

You're all set! Once Apple approves your membership, you can deploy in under an hour. 🚀