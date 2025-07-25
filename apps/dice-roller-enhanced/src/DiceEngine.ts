import { DiceType, RollType, RollResult, DiceSet, DiceCombination } from './types';

export class DiceEngine {
    private static instance: DiceEngine;
    private animationCallbacks: ((result: RollResult) => void)[] = [];

    private constructor() {}

    public static getInstance(): DiceEngine {
        if (!DiceEngine.instance) {
            DiceEngine.instance = new DiceEngine();
        }
        return DiceEngine.instance;
    }

    public addAnimationCallback(callback: (result: RollResult) => void): void {
        this.animationCallbacks.push(callback);
    }

    private triggerAnimations(result: RollResult): void {
        this.animationCallbacks.forEach(callback => callback(result));
    }

    public roll(combination: DiceCombination, rollType: RollType = RollType.NORMAL): RollResult {
        const rolls: number[] = [];
        
        if (rollType === RollType.ADVANTAGE || rollType === RollType.DISADVANTAGE) {
            // Roll twice for advantage/disadvantage
            const roll1 = this.generateRoll(combination.diceType);
            const roll2 = this.generateRoll(combination.diceType);
            rolls.push(roll1, roll2);
            
            const selectedRoll = rollType === RollType.ADVANTAGE ? 
                Math.max(roll1, roll2) : Math.min(roll1, roll2);
            
            const result = {
                combination,
                individualRolls: rolls,
                total: selectedRoll + combination.modifier,
                timestamp: new Date(),
                rollType,
                criticalSuccess: selectedRoll === combination.diceType.sides,
                criticalFailure: selectedRoll === 1
            };

            this.triggerAnimations(result);
            return result;
        }

        // Normal rolls or custom dice
        for (let i = 0; i < combination.count; i++) {
            rolls.push(this.generateRoll(combination.diceType));
        }

        const total = rolls.reduce((sum, roll) => sum + roll, 0) + combination.modifier;
        const result = {
            combination,
            individualRolls: rolls,
            total,
            timestamp: new Date(),
            rollType,
            criticalSuccess: combination.diceType === DiceType.D20 && rolls.includes(20),
            criticalFailure: combination.diceType === DiceType.D20 && rolls.includes(1)
        };

        this.triggerAnimations(result);
        return result;
    }

    public rollSet(diceSet: DiceSet): RollResult[] {
        return diceSet.combinations.map(combo => this.roll(combo));
    }

    private generateRoll(diceType: DiceType): number {
        return Math.floor(Math.random() * diceType.sides) + 1;
    }

    // Predefined common D&D dice sets
    public static readonly PREDEFINED_SETS: DiceSet[] = [
        {
            name: "Attack Roll",
            combinations: [{
                diceType: DiceType.D20,
                count: 1,
                modifier: 0
            }],
            isCustom: false
        },
        {
            name: "Damage (Longsword)",
            combinations: [{
                diceType: DiceType.D8,
                count: 1,
                modifier: 0
            }],
            isCustom: false
        },
        {
            name: "Sneak Attack (Level 1)",
            combinations: [{
                diceType: DiceType.D6,
                count: 2,
                modifier: 0
            }],
            isCustom: false
        },
        {
            name: "Fireball",
            combinations: [{
                diceType: DiceType.D6,
                count: 8,
                modifier: 0
            }],
            isCustom: false
        },
        {
            name: "Healing Word",
            combinations: [{
                diceType: DiceType.D4,
                count: 1,
                modifier: 0
            }],
            isCustom: false
        }
    ];
}
