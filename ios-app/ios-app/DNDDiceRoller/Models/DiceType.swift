import Foundation

enum DiceType: CaseIterable {
    case d4, d6, d8, d10, d12, d20, d100
    
    var sides: Int {
        switch self {
        case .d4: return 4
        case .d6: return 6
        case .d8: return 8
        case .d10: return 10
        case .d12: return 12
        case .d20: return 20
        case .d100: return 100
        }
    }
    
    var emoji: String {
        switch self {
        case .d4: return "🔸"
        case .d6: return "⚀"
        case .d8: return "🔶"
        case .d10: return "🔟"
        case .d12: return "🔷"
        case .d20: return "🎲"
        case .d100: return "💯"
        }
    }
    
    var displayName: String {
        return "d\(sides)"
    }
}

struct RollResult {
    let diceType: DiceType
    let result: Int
    let breakdown: String
    let timestamp: Date
    
    init(diceType: DiceType, result: Int, breakdown: String = "") {
        self.diceType = diceType
        self.result = result
        self.breakdown = breakdown
        self.timestamp = Date()
    }
}