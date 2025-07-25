import { RollResult, DiceSet } from './types';

export class DiceHistory {
    private static instance: DiceHistory;
    private readonly maxHistorySize = 100;
    private history: RollResult[] = [];
    private favoriteRolls: Set<string> = new Set();

    private constructor() {
        this.loadFromLocalStorage();
    }

    public static getInstance(): DiceHistory {
        if (!DiceHistory.instance) {
            DiceHistory.instance = new DiceHistory();
        }
        return DiceHistory.instance;
    }

    public addRoll(result: RollResult): void {
        this.history.unshift(result);
        
        // Maintain history size limit
        if (this.history.length > this.maxHistorySize) {
            this.history.pop();
        }

        this.saveToLocalStorage();
    }

    public addRolls(results: RollResult[]): void {
        results.forEach(result => this.addRoll(result));
    }

    public getHistory(): RollResult[] {
        return [...this.history];
    }

    public clearHistory(): void {
        this.history = [];
        this.saveToLocalStorage();
    }

    public getFavorites(): string[] {
        return Array.from(this.favoriteRolls);
    }

    public toggleFavorite(rollSetName: string): boolean {
        if (this.favoriteRolls.has(rollSetName)) {
            this.favoriteRolls.delete(rollSetName);
        } else {
            this.favoriteRolls.add(rollSetName);
        }
        this.saveToLocalStorage();
        return this.favoriteRolls.has(rollSetName);
    }

    public isFavorite(rollSetName: string): boolean {
        return this.favoriteRolls.has(rollSetName);
    }

    public getStats(): RollStats {
        const stats: RollStats = {
            totalRolls: this.history.length,
            criticalSuccesses: 0,
            criticalFailures: 0,
            averageTotal: 0,
            diceTypeCounts: {},
            mostUsedDiceType: null,
            highestRoll: null,
            lowestRoll: null
        };

        if (this.history.length === 0) {
            return stats;
        }

        let sum = 0;
        this.history.forEach(result => {
            // Update basic stats
            sum += result.total;
            if (result.criticalSuccess) stats.criticalSuccesses++;
            if (result.criticalFailure) stats.criticalFailures++;

            // Track dice type usage
            const diceType = result.combination.diceType.name;
            stats.diceTypeCounts[diceType] = (stats.diceTypeCounts[diceType] || 0) + 1;

            // Track highest and lowest rolls
            if (!stats.highestRoll || result.total > stats.highestRoll.total) {
                stats.highestRoll = result;
            }
            if (!stats.lowestRoll || result.total < stats.lowestRoll.total) {
                stats.lowestRoll = result;
            }
        });

        // Calculate average
        stats.averageTotal = sum / this.history.length;

        // Find most used dice type
        let maxCount = 0;
        Object.entries(stats.diceTypeCounts).forEach(([diceType, count]) => {
            if (count > maxCount) {
                maxCount = count;
                stats.mostUsedDiceType = diceType;
            }
        });

        return stats;
    }

    private saveToLocalStorage(): void {
        try {
            localStorage.setItem('diceHistory', JSON.stringify(this.history));
            localStorage.setItem('favoriteRolls', JSON.stringify(Array.from(this.favoriteRolls)));
        } catch (e) {
            console.error('Failed to save dice history to localStorage:', e);
        }
    }

    private loadFromLocalStorage(): void {
        try {
            const historyStr = localStorage.getItem('diceHistory');
            const favoritesStr = localStorage.getItem('favoriteRolls');
            
            if (historyStr) {
                this.history = JSON.parse(historyStr);
            }
            
            if (favoritesStr) {
                this.favoriteRolls = new Set(JSON.parse(favoritesStr));
            }
        } catch (e) {
            console.error('Failed to load dice history from localStorage:', e);
        }
    }
}

interface RollStats {
    totalRolls: number;
    criticalSuccesses: number;
    criticalFailures: number;
    averageTotal: number;
    diceTypeCounts: { [key: string]: number };
    mostUsedDiceType: string | null;
    highestRoll: RollResult | null;
    lowestRoll: RollResult | null;
}
