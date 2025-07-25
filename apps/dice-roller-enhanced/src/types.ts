export enum DiceType {
    D4 = { sides: 4, name: 'd4' },
    D6 = { sides: 6, name: 'd6' },
    D8 = { sides: 8, name: 'd8' },
    D10 = { sides: 10, name: 'd10' },
    D12 = { sides: 12, name: 'd12' },
    D20 = { sides: 20, name: 'd20' },
    D100 = { sides: 100, name: 'd100' }
}

export enum RollType {
    NORMAL = 'normal',
    ADVANTAGE = 'advantage',
    DISADVANTAGE = 'disadvantage'
}

export interface DiceCombination {
    diceType: DiceType;
    count: number;
    modifier: number;
}

export interface DiceSet {
    name: string;
    combinations: DiceCombination[];
    isCustom: boolean;
}

export interface RollResult {
    combination: DiceCombination;
    individualRolls: number[];
    total: number;
    timestamp: Date;
    rollType: RollType;
    criticalSuccess: boolean;
    criticalFailure: boolean;
}

export interface CustomDice {
    sides: number;
    name: string;
}
