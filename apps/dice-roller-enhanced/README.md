# 🎲 Enhanced D&D Dice Roller

A comprehensive command-line dice roller for D&D 5e with modifier support, spell casting, and advanced rolling mechanics.

![D&D Dice Roller](https://img.shields.io/badge/D%26D-5e-red?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.7+-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

- **Standard Dice Notation**: Roll any combination like `3d6+2`, `1d20-1`, `2d4+1`
- **Spell Support**: Pre-configured spells with automatic scaling
- **Advantage/Disadvantage**: D&D 5e advantage and disadvantage mechanics
- **Interactive Mode**: Real-time dice rolling with a user-friendly interface
- **Modifier Support**: Add or subtract modifiers to any roll
- **Individual Roll Display**: See each die result plus the total

## 🚀 Quick Start

### Basic Usage

```bash
# Roll basic dice
python dice_roller.py 1d20

# Roll with modifiers
python dice_roller.py 3d6+2
python dice_roller.py 1d4+1

# Roll Magic Missile (1d4+1 per missile)
python dice_roller.py --spell magic_missile --level 3
```

### Interactive Mode

```bash
python dice_roller.py --interactive
```

## 📖 Usage Examples

### Standard Dice Rolls

```bash
# Ability score generation
python dice_roller.py 4d6+0

# Attack rolls
python dice_roller.py 1d20+5

# Damage rolls
python dice_roller.py 1d8+3
python dice_roller.py 2d6+2

# Saving throws
python dice_roller.py 1d20+2
```

### Spell Casting

```bash
# Magic Missile at different levels
python dice_roller.py --spell magic_missile --level 1  # 1 missile
python dice_roller.py --spell magic_missile --level 3  # 3 missiles
python dice_roller.py --spell magic_missile --level 5  # 5 missiles

# Fireball
python dice_roller.py --spell fireball

# Healing spells with modifier
python dice_roller.py --spell cure_wounds --modifier 3
```

### Advantage and Disadvantage

```bash
# Roll with advantage
python dice_roller.py 1d20+5 --advantage

# Roll with disadvantage
python dice_roller.py 1d20+5 --disadvantage
```

### Command Line Options

```bash
# List all available spells
python dice_roller.py --list-spells

# Interactive mode
python dice_roller.py --interactive

# Help
python dice_roller.py --help
```

## 🎮 Interactive Mode Commands

Once in interactive mode, you can use these commands:

```
🎲 > 1d20+5                    # Roll dice
🎲 > spell magic_missile       # Cast spell
🎲 > adv 1d20+3               # Roll with advantage
🎲 > dis 1d20+3               # Roll with disadvantage
🎲 > spells                   # List available spells
🎲 > quit                     # Exit
```

## 🔮 Supported Spells

| Spell | Dice | Description |
|-------|------|-------------|
| Magic Missile | 1d4+1 | 1d4+1 force damage per missile |
| Cure Wounds | 1d8 | 1d8 + spellcasting modifier |
| Fireball | 8d6 | 8d6 fire damage |
| Healing Word | 1d4 | 1d4 + spellcasting modifier |

## 📋 Example Output

### Basic Roll
```
🎲 3d6+2: [4, 2, 6] +2 = 14
```

### Magic Missile
```
🔮 Magic Missile (Level 3): 3 missile(s)
  Missile 1: 1d4+1: [3] +1 = 4
  Missile 2: 1d4+1: [1] +1 = 2
  Missile 3: 1d4+1: [4] +1 = 5
  Total Damage: 11
```

### Advantage Roll
```
🎲 Rolling with Advantage: 1d20+5
  Roll 1: 1d20+5: [12] +5 = 17
  Roll 2: 1d20+5: [8] +5 = 13
  ⬆️  Taking higher: 17
```

## 🛠️ Technical Details

### Dice Notation Format

The roller supports standard D&D dice notation:
- `XdY` - Roll X dice with Y sides
- `XdY+Z` - Roll X dice with Y sides, add Z
- `XdY-Z` - Roll X dice with Y sides, subtract Z

### Supported Dice Types

- d4, d6, d8, d10, d12, d20, d100
- Any custom die size (e.g., d3, d7, d13)

### Requirements

- Python 3.7 or higher
- No external dependencies (uses only standard library)

## 🎯 Advanced Features

### Custom Spell Integration

You can easily add more spells by extending the `spells` dictionary in the `DiceRoller` class:

```python
"your_spell": {
    "name": "Your Spell",
    "description": "2d8 + modifier",
    "dice": "2d8",
    "scalable": True
}
```

### Programmatic Usage

```python
from dice_roller import DiceRoller

roller = DiceRoller()

# Roll basic dice
result = roller.roll_from_notation("3d6+2")
print(f"Total: {result.total}")

# Roll spell
results = roller.roll_spell("magic_missile", spell_level=3)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your enhancements
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎲 Happy Rolling!

Whether you're a DM running a campaign or a player making attack rolls, this dice roller has you covered. May your rolls be high and your adventures epic!

---

*Made with ❤️ for the D&D community*

## 🎲 DND Dice Roller Ecosystem

### Multi-Platform Versions
- 🌐 [**Enhanced Web App**](https://github.com/tiation/dnddiceroller-enhanced) - You are here! Advanced web-based dice roller
- 📱 [**iOS App**](https://github.com/tiation/tiation-dice-roller-ios) - Native iOS dice rolling app  
- 🤖 [**Android App**](https://github.com/tiation/dnddiceroller-android) - Native Android dice rolling app
- 🐧 [**Linux/Chrome Version**](https://github.com/tiation/tiation-dice-roller-linux-chrome) - Linux & Chrome OS optimized version

### Marketing & Resources
- 🏪 [**Marketing Site**](https://github.com/tiation/tiation-dice-roller-marketing-site) - Official landing page & feature showcase
- 📊 [**Feature Comparison**](https://tiation.github.io/tiation-dice-roller-marketing-site/) - Compare all versions

### Quick Links
- 🎮 [**Try Web Demo**](https://tiation.github.io/dnddiceroller-enhanced/) - Play directly in browser
- 📱 [**Get Mobile Apps**](https://tiation.github.io/tiation-dice-roller-marketing-site/#downloads) - iOS & Android downloads
- 🛠️ [**Developer Resources**](https://github.com/tiation/dnddiceroller-enhanced/wiki) - API docs & development guides

---

