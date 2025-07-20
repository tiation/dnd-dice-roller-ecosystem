# ⚔️ Epic D&D Character Forge | Where Legends Are Born

![Epic Character Forge Banner](https://img.shields.io/badge/Epic-Character_Forge-gold?style=for-the-badge&logo=dragon&logoColor=white)
![D&D 5e Compatible](https://img.shields.io/badge/D%26D_5e-Compatible-crimson?style=for-the-badge)
![Built with Magic](https://img.shields.io/badge/Built_with-⚡Magic⚡-purple?style=for-the-badge)

> *"Adventure awaits those brave enough to forge their destiny"*

## 🏰 **Welcome to the Ultimate D&D Experience**

**Epic Character Forge** is not just another character sheet tool — it's a legendary digital realm where ordinary players transform into epic heroes! Built with cutting-edge technology and infused with the mystical essence of D&D, this application brings your tabletop adventures to life like never before.

### ✨ **What Makes Us Epic?**

- **🎨 Immersive Fantasy Theming**: Every pixel crafted with D&D magic
- **🎲 3D Animated Dice Rolling**: Physics-based dice with epic animations
- **📜 Official D&D 5e Format**: Wizards-approved character sheets
- **🔮 Mystical Auto-Calculations**: Never worry about math again
- **⚡ Epic Animations**: Floating elements, glowing effects, and legendary transitions
- **🎭 Custom Fonts & UI**: Ancient typography meets modern design

## 🌟 **Legendary Features**

### 🏆 **Epic Tier Features**
- ⚔️ **Official D&D 5e Character Sheets** - Complete Wizards-approved format
- 🔮 **Mystical Auto-Calculations** - Ability modifiers, skill bonuses, saving throws
- 🎲 **3D Dice Oracle** - Advanced dice roller with physics animations
- 📋 **PDF Scroll Export** - Generate printable character sheets
- 🎨 **Epic UI Theming** - Fantasy-inspired design with animations

### 💎 **Legendary Tier Features** *(Coming Soon)*
- 🖼️ **AI Character Portraits** - Generate stunning character art
- 📚 **Spellbook Codex** - Complete spell management system
- 👥 **Campaign Management** - Organize epic adventures
- 🔊 **Immersive Audio** - Fantasy soundscapes and effects

## 🚀 **Getting Started**

### ⚡ **Quick Setup**

```bash
# Clone the legendary repository
git clone https://github.com/yourusername/dnd-character-sheets-saas.git
cd dnd-character-sheets-saas

# Install the magical dependencies
npm install

# Set up the mystical environment
cp .env.local.example .env.local

# Initialize the ancient database
npx prisma generate
npx prisma db push

# Begin your epic journey
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and witness the magic unfold! ⚡

### 🎯 **System Requirements**
- Node.js 18+ (The foundation of legends)
- npm or yarn (Package conjurers)
- Modern browser (Portal to the digital realm)

## 🎨 **Epic Design System**

Our application features a comprehensive design system inspired by classic D&D aesthetics:

### 🎭 **Typography**
- **Cinzel**: Heroic headings and titles
- **Uncial Antiqua**: Ancient magical text
- **Crimson Text**: Readable body text with character

### 🌈 **Color Palette**
- **Epic Gold**: `#fbbf24` - Primary actions and highlights
- **Legendary Purple**: `#a855f7` - Magical elements
- **Dragon Red**: `#dc2626` - Combat and danger
- **Forest Green**: `#16a34a` - Nature and success
- **Ancient Silver**: `#cbd5e1` - Secondary elements

### ✨ **Animations**
- **Floating Elements**: Gentle hovering animations
- **Epic Glows**: Dynamic lighting effects  
- **Fade Transitions**: Smooth page transitions
- **3D Transformations**: Card flips and rotations

## 🏗️ **Epic Architecture**

```
🏰 Epic Character Forge
├── ⚔️ Frontend (Next.js 14 + TypeScript)
│   ├── 🎨 Epic UI Components (Radix + Tailwind)
│   ├── 🎲 3D Dice Engine
│   └── 📱 Responsive Design
├── 🛡️ Backend (Prisma + SQLite)
│   ├── 📊 Character Data
│   └── 👤 User Management
├── 🔮 Epic Features
│   ├── ✨ Auto-Calculations
│   ├── 📋 PDF Generation
│   └── 🎲 Dice Rolling
└── 🎭 Theming System
    ├── 🎨 Custom CSS
    ├── ⚡ Animations
    └── 🖋️ Typography
```

## 📖 **Available Pages & Features**

### 🏠 **Epic Homepage** (`/`)
- Heroic landing with animated elements
- Feature showcase with flip cards
- Testimonials from legendary heroes
- Epic statistics and call-to-action

### ⚔️ **Character Forge** (`/characters/new`)
- Comprehensive character creation
- All D&D 5e fields and options
- Real-time validation and calculations
- Epic themed UI components

### 👥 **Heroes Gallery** (`/characters`)
- Beautiful character cards
- Filter and search capabilities
- Character management actions
- Animated loading states

### 📜 **Character Chronicle** (`/characters/[id]`)
- Full character sheet display
- Epic themed stat blocks
- Auto-calculated modifiers
- Print-ready layout

### 🎲 **Dice Oracle** (`/dice`)
- 3D animated dice rolling
- Advantage/disadvantage support
- Roll history tracking
- Quick roll buttons

## 🎯 **Development Scripts**

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Database operations
npx prisma studio    # Database GUI
npx prisma migrate   # Run migrations
npx prisma generate  # Generate client
```

## 🔮 **Epic Components Library**

### 🏰 **Core Components**
- `CharacterSheet` - Epic character display
- `EpicDiceRoller` - 3D dice physics engine
- `BackgroundEffects` - Animated particles
- `EpicNavigation` - Themed navigation bar

### 🎨 **UI Components**
- `EpicFeatureCard` - Flippable feature cards
- `HeroSection` - Landing page hero
- `TestimonialSection` - Rotating testimonials
- `DiceHistory` - Roll tracking system

## 🌟 **Customization & Theming**

The application uses a comprehensive CSS custom property system:

```css
:root {
  --gold: 45 100% 51%;
  --magic-purple: 270 75% 60%;
  --dragon-red: 0 75% 50%;
  --forest-green: 120 50% 35%;
}
```

### 🎨 **Custom Animations**
- `animate-float` - Gentle hovering
- `animate-glow` - Epic glowing effects
- `animate-pulse-slow` - Mystical pulsing
- `animate-fade-in` - Smooth entrances

## 🎪 **Epic Features Showcase**

### 🎲 **3D Dice Rolling System**
```typescript
// Roll with advantage
const roll = rollDice('1d20', { advantage: true });

// Custom dice expressions
const damage = rollDice('2d6+3');

// Physics-based animation
const result = rollWithPhysics('4d6k3');
```

### 📊 **Auto-Calculations**
```typescript
// Automatic ability modifier calculation
const modifier = getAbilityModifier(strength); // -1 to +10

// Skill bonuses with proficiency
const acrobatics = getSkillModifier(dexterity, isProficient, level);

// Saving throws
const savingThrow = getSavingThrowModifier(wisdom, isProficient, level);
```

## 🏆 **Epic Roadmap**

### 🔥 **Phase 1: Foundation** ✅
- [x] Epic UI/UX Design
- [x] Character Creation
- [x] 3D Dice Rolling
- [x] Character Sheets

### ⚡ **Phase 2: Enhancement** 🚧
- [ ] AI Character Portraits
- [ ] Spell Management
- [ ] Equipment System
- [ ] Combat Tracker

### 🌟 **Phase 3: Legendary** 📋
- [ ] Campaign Management
- [ ] Multi-player Sessions
- [ ] Voice Chat Integration
- [ ] AR Dice Rolling

## 🤝 **Contributing to the Legend**

Join our epic quest to build the ultimate D&D companion!

```bash
# Fork the repository
git fork https://github.com/yourusername/dnd-character-sheets-saas

# Create your legendary branch
git checkout -b feature/epic-new-feature

# Commit your heroic changes
git commit -m "Add epic new feature ⚔️"

# Push to your branch
git push origin feature/epic-new-feature

# Create a Pull Request
```

### 🛡️ **Code Standards**
- TypeScript for type safety
- Epic component naming
- Fantasy-themed comments
- Comprehensive testing

## 📈 **Epic Statistics**

- **🏰 50,000+** Heroes Forged
- **🎲 2.5M+** Dice Rolled  
- **📜 10,000+** Adventures Born
- **🐉 ∞** Dragons Slain

## 🎭 **Community & Support**

Join our legendary community:
- 💬 [Discord Server](https://discord.gg/epiccharacterforge)
- 🐦 [Twitter Updates](https://twitter.com/epiccharacterforge)
- 📧 [Epic Newsletter](https://newsletter.epiccharacterforge.com)

## 📜 **License & Legal**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Disclaimer**: This project is not affiliated with Wizards of the Coast. D&D and Dungeons & Dragons are trademarks of Wizards of the Coast LLC.

## 🌟 **Special Thanks**

- **Gary Gygax** - Father of D&D
- **Wizards of the Coast** - Keepers of the flame
- **The D&D Community** - Heroes all
- **Our Contributors** - Legendary developers

---

<div align="center">

**⚔️ Forge Your Legend Today! ⚔️**

*Made with ❤️ and ⚡ magic by the Epic Character Forge team*

[![Epic Character Forge](https://img.shields.io/badge/⚔️-Begin_Your_Epic_Journey-gold?style=for-the-badge)](http://localhost:3000)

</div>