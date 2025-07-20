#!/usr/bin/env python3
"""
Enhanced D&D Dice Roller with Modifiers
Supports complex dice notation like 3d6+2, 1d4+1, etc.
"""

import random
import re
import argparse
from typing import List, Tuple, Dict
from dataclasses import dataclass

@dataclass
class DiceRoll:
    """Represents a single dice roll result"""
    dice_count: int
    dice_sides: int
    modifier: int
    individual_rolls: List[int]
    total: int
    
    def __str__(self):
        rolls_str = ", ".join(map(str, self.individual_rolls))
        if self.modifier != 0:
            modifier_str = f"{self.modifier:+d}"
            return f"{self.dice_count}d{self.dice_sides}{modifier_str}: [{rolls_str}] {modifier_str} = {self.total}"
        else:
            return f"{self.dice_count}d{self.dice_sides}: [{rolls_str}] = {self.total}"

class DiceRoller:
    """Enhanced D&D dice roller with modifier support"""
    
    def __init__(self):
        self.spells = {
            "magic_missile": {
                "name": "Magic Missile",
                "description": "1d4+1 force damage per missile",
                "dice": "1d4+1",
                "missiles": [1, 2, 3, 4, 5, 6, 7, 8, 9]  # by spell level
            },
            "cure_wounds": {
                "name": "Cure Wounds",
                "description": "1d8 + spellcasting modifier",
                "dice": "1d8",
                "scalable": True
            },
            "fireball": {
                "name": "Fireball",
                "description": "8d6 fire damage",
                "dice": "8d6",
                "scalable": True
            },
            "healing_word": {
                "name": "Healing Word",
                "description": "1d4 + spellcasting modifier",
                "dice": "1d4",
                "scalable": True
            }
        }
    
    def parse_dice_notation(self, notation: str) -> Tuple[int, int, int]:
        """
        Parse dice notation like 3d6+2, 1d20-1, 2d4+1
        Returns (dice_count, dice_sides, modifier)
        """
        # Remove spaces and convert to lowercase
        notation = notation.replace(" ", "").lower()
        
        # Pattern to match dice notation: XdY+Z or XdY-Z
        pattern = r'^(\d+)d(\d+)([+-]\d+)?$'
        match = re.match(pattern, notation)
        
        if not match:
            raise ValueError(f"Invalid dice notation: {notation}")
        
        dice_count = int(match.group(1))
        dice_sides = int(match.group(2))
        modifier = int(match.group(3)) if match.group(3) else 0
        
        return dice_count, dice_sides, modifier
    
    def roll_dice(self, dice_count: int, dice_sides: int, modifier: int = 0) -> DiceRoll:
        """Roll dice with modifiers"""
        if dice_count <= 0 or dice_sides <= 0:
            raise ValueError("Dice count and sides must be positive")
        
        # Roll individual dice
        individual_rolls = [random.randint(1, dice_sides) for _ in range(dice_count)]
        
        # Calculate total with modifier
        total = sum(individual_rolls) + modifier
        
        return DiceRoll(
            dice_count=dice_count,
            dice_sides=dice_sides,
            modifier=modifier,
            individual_rolls=individual_rolls,
            total=total
        )
    
    def roll_from_notation(self, notation: str) -> DiceRoll:
        """Roll dice from notation like 3d6+2"""
        dice_count, dice_sides, modifier = self.parse_dice_notation(notation)
        return self.roll_dice(dice_count, dice_sides, modifier)
    
    def roll_spell(self, spell_name: str, spell_level: int = 1, modifier: int = 0) -> List[DiceRoll]:
        """Roll damage/healing for a specific spell"""
        spell_name = spell_name.lower().replace(" ", "_")
        
        if spell_name not in self.spells:
            raise ValueError(f"Unknown spell: {spell_name}")
        
        spell = self.spells[spell_name]
        results = []
        
        if spell_name == "magic_missile":
            # Magic Missile scales by number of missiles
            missiles = spell["missiles"][min(spell_level - 1, len(spell["missiles"]) - 1)]
            print(f"\n🔮 {spell['name']} (Level {spell_level}): {missiles} missile(s)")
            
            for i in range(missiles):
                result = self.roll_from_notation(spell["dice"])
                print(f"  Missile {i+1}: {result}")
                results.append(result)
            
            total_damage = sum(roll.total for roll in results)
            print(f"  Total Damage: {total_damage}")
            
        else:
            # Regular spell with potential scaling
            dice_notation = spell["dice"]
            if modifier > 0:
                dice_notation += f"+{modifier}"
            elif modifier < 0:
                dice_notation += f"{modifier}"
            
            result = self.roll_from_notation(dice_notation)
            print(f"\n🔮 {spell['name']}: {result}")
            results.append(result)
        
        return results
    
    def roll_advantage(self, notation: str) -> Tuple[DiceRoll, DiceRoll]:
        """Roll with advantage (take higher)"""
        roll1 = self.roll_from_notation(notation)
        roll2 = self.roll_from_notation(notation)
        return roll1, roll2
    
    def roll_disadvantage(self, notation: str) -> Tuple[DiceRoll, DiceRoll]:
        """Roll with disadvantage (take lower)"""
        return self.roll_advantage(notation)  # Same mechanic, different interpretation
    
    def list_spells(self):
        """List available spells"""
        print("\n🎲 Available Spells:")
        for spell_key, spell_data in self.spells.items():
            print(f"  {spell_data['name']}: {spell_data['description']}")

def main():
    parser = argparse.ArgumentParser(description="Enhanced D&D Dice Roller with Modifiers")
    parser.add_argument("dice", nargs="?", help="Dice notation (e.g., 3d6+2, 1d20-1)")
    parser.add_argument("--spell", "-s", help="Cast a spell (e.g., magic_missile, fireball)")
    parser.add_argument("--level", "-l", type=int, default=1, help="Spell level (default: 1)")
    parser.add_argument("--modifier", "-m", type=int, default=0, help="Additional modifier")
    parser.add_argument("--advantage", "-a", action="store_true", help="Roll with advantage")
    parser.add_argument("--disadvantage", "-d", action="store_true", help="Roll with disadvantage")
    parser.add_argument("--list-spells", action="store_true", help="List available spells")
    parser.add_argument("--interactive", "-i", action="store_true", help="Interactive mode")
    
    args = parser.parse_args()
    
    roller = DiceRoller()
    
    if args.list_spells:
        roller.list_spells()
        return
    
    if args.interactive:
        interactive_mode(roller)
        return
    
    if args.spell:
        try:
            roller.roll_spell(args.spell, args.level, args.modifier)
        except ValueError as e:
            print(f"❌ Error: {e}")
        return
    
    if not args.dice:
        print("🎲 Enhanced D&D Dice Roller")
        print("Usage: python dice_roller.py <dice_notation>")
        print("Examples:")
        print("  python dice_roller.py 3d6+2")
        print("  python dice_roller.py 1d20-1")
        print("  python dice_roller.py --spell magic_missile --level 3")
        print("  python dice_roller.py 1d20 --advantage")
        print("  python dice_roller.py --interactive")
        return
    
    try:
        if args.advantage:
            roll1, roll2 = roller.roll_advantage(args.dice)
            print(f"\n🎲 Rolling with Advantage: {args.dice}")
            print(f"  Roll 1: {roll1}")
            print(f"  Roll 2: {roll2}")
            higher = roll1 if roll1.total >= roll2.total else roll2
            print(f"  ⬆️  Taking higher: {higher.total}")
            
        elif args.disadvantage:
            roll1, roll2 = roller.roll_disadvantage(args.dice)
            print(f"\n🎲 Rolling with Disadvantage: {args.dice}")
            print(f"  Roll 1: {roll1}")
            print(f"  Roll 2: {roll2}")
            lower = roll1 if roll1.total <= roll2.total else roll2
            print(f"  ⬇️  Taking lower: {lower.total}")
            
        else:
            result = roller.roll_from_notation(args.dice)
            print(f"\n🎲 {result}")
            
    except ValueError as e:
        print(f"❌ Error: {e}")

def interactive_mode(roller: DiceRoller):
    """Interactive dice rolling mode"""
    print("\n🎲 Interactive D&D Dice Roller")
    print("Commands:")
    print("  <dice>          - Roll dice (e.g., 3d6+2)")
    print("  spell <name>    - Cast spell (e.g., spell magic_missile)")
    print("  adv <dice>      - Roll with advantage")
    print("  dis <dice>      - Roll with disadvantage")
    print("  spells          - List available spells")
    print("  quit            - Exit")
    print()
    
    while True:
        try:
            command = input("🎲 > ").strip()
            
            if command.lower() in ["quit", "exit", "q"]:
                print("Happy adventuring! 🗡️")
                break
            
            if command.lower() == "spells":
                roller.list_spells()
                continue
            
            if command.lower().startswith("spell "):
                spell_name = command[6:].strip()
                try:
                    roller.roll_spell(spell_name)
                except ValueError as e:
                    print(f"❌ Error: {e}")
                continue
            
            if command.lower().startswith("adv "):
                dice_notation = command[4:].strip()
                try:
                    roll1, roll2 = roller.roll_advantage(dice_notation)
                    print(f"Roll 1: {roll1}")
                    print(f"Roll 2: {roll2}")
                    higher = roll1 if roll1.total >= roll2.total else roll2
                    print(f"⬆️  Taking higher: {higher.total}")
                except ValueError as e:
                    print(f"❌ Error: {e}")
                continue
            
            if command.lower().startswith("dis "):
                dice_notation = command[4:].strip()
                try:
                    roll1, roll2 = roller.roll_disadvantage(dice_notation)
                    print(f"Roll 1: {roll1}")
                    print(f"Roll 2: {roll2}")
                    lower = roll1 if roll1.total <= roll2.total else roll2
                    print(f"⬇️  Taking lower: {lower.total}")
                except ValueError as e:
                    print(f"❌ Error: {e}")
                continue
            
            # Regular dice roll
            try:
                result = roller.roll_from_notation(command)
                print(f"{result}")
            except ValueError as e:
                print(f"❌ Error: {e}")
                
        except KeyboardInterrupt:
            print("\nHappy adventuring! 🗛️")
            break
        except EOFError:
            print("\nHappy adventuring! 🗡️")
            break

if __name__ == "__main__":
    main()
