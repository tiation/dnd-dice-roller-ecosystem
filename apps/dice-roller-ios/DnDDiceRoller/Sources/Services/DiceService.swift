import Foundation

import Foundation

class DiceService {
    static let shared = DiceService()
    
    private init() {}
    
    // Predefined sets for common rolls
    let predefinedSets: [DiceSet] = [
        DiceSet(name: "Attack Roll", combinations: [
            DiceCombination(type: .d20, count: 1, modifier: 0)
        ], isCustom: false),
        DiceSet(name: "Death Save", combinations: [
            DiceCombination(type: .d20, count: 1, modifier: 0)
        ], isCustom: false),
        DiceSet(name: "Sneak Attack (Level 1)", combinations: [
            DiceCombination(type: .d6, count: 2, modifier: 0)
        ], isCustom: false),
        DiceSet(name: "Fireball", combinations: [
            DiceCombination(type: .d6, count: 8, modifier: 0)
        ], isCustom: false)
    ]
    
    func roll(_ combination: DiceCombination, withAdvantage: Bool = false, withDisadvantage: Bool = false) -> RollResult {
        var rolls: [Int] = []
        
        if withAdvantage || withDisadvantage {
            // Roll twice for advantage/disadvantage
            let roll1 = Int.random(in: 1...combination.type.rawValue)
            let roll2 = Int.random(in: 1...combination.type.rawValue)
            rolls = [roll1, roll2]
            
            // Use the higher roll for advantage, lower for disadvantage
            let selectedRoll = withAdvantage ? max(roll1, roll2) : min(roll1, roll2)
            return RollResult(
                combination: combination,
                individualRolls: rolls,
                total: selectedRoll + combination.modifier,
                timestamp: Date()
            )
        }
        
        // Normal roll
        for _ in 0..<combination.count {
            rolls.append(Int.random(in: 1...combination.type.rawValue))
        }
        
        return RollResult(
            combination: combination,
            individualRolls: rolls,
            total: rolls.reduce(0, +) + combination.modifier,
            timestamp: Date()
        )
    }
    
    func rollSet(_ set: DiceSet) -> [RollResult] {
        set.combinations.map { roll($0) }
    }
}
