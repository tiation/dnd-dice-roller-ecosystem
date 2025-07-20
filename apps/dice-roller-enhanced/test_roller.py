#!/usr/bin/env python3
"""
Test script to demonstrate the Enhanced D&D Dice Roller functionality
"""

from dice_roller import DiceRoller

def main():
    print("🎲 Enhanced D&D Dice Roller - Demo")
    print("=" * 50)
    
    roller = DiceRoller()
    
    # Test basic dice rolls
    print("\n📊 Basic Dice Rolls:")
    test_rolls = ["1d20", "3d6+2", "1d4+1", "2d8-1", "1d12+3"]
    
    for roll in test_rolls:
        result = roller.roll_from_notation(roll)
        print(f"  {result}")
    
    # Test spell casting
    print("\n🔮 Spell Casting:")
    
    # Magic Missile at different levels
    print("\n  Magic Missile Examples:")
    for level in [1, 3, 5]:
        print(f"    Level {level}:")
        roller.roll_spell("magic_missile", spell_level=level)
    
    # Other spells
    print("\n  Other Spells:")
    roller.roll_spell("fireball")
    roller.roll_spell("cure_wounds", modifier=3)
    
    # Test advantage/disadvantage
    print("\n⚔️ Advantage/Disadvantage:")
    
    print("  Advantage Example:")
    roll1, roll2 = roller.roll_advantage("1d20+5")
    print(f"    Roll 1: {roll1}")
    print(f"    Roll 2: {roll2}")
    higher = roll1 if roll1.total >= roll2.total else roll2
    print(f"    Taking higher: {higher.total}")
    
    print("\n  Disadvantage Example:")
    roll1, roll2 = roller.roll_disadvantage("1d20+5")
    print(f"    Roll 1: {roll1}")
    print(f"    Roll 2: {roll2}")
    lower = roll1 if roll1.total <= roll2.total else roll2
    print(f"    Taking lower: {lower.total}")
    
    # List available spells
    roller.list_spells()
    
    print("\n" + "=" * 50)
    print("Demo complete! Try running:")
    print("  python dice_roller.py --interactive")
    print("  python dice_roller.py 1d20+5 --advantage")
    print("  python dice_roller.py --spell magic_missile --level 5")

if __name__ == "__main__":
    main()
