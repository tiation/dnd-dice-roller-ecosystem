import Foundation

public enum DiceType: Int, CaseIterable, Codable {
    case d4 = 4
    case d6 = 6
    case d8 = 8
    case d10 = 10
    case d12 = 12
    case d20 = 20
    case d100 = 100
    
    public var displayName: String {
        "d\(rawValue)"
    }
    
    public var icon: String {
        switch self {
        case .d4: return "4.circle.fill"
        case .d6: return "6.circle.fill"
        case .d8: return "8.circle.fill"
        case .d10: return "10.circle.fill"
        case .d12: return "12.circle.fill"
        case .d20: return "20.circle.fill"
        case .d100: return "100.circle.fill"
        }
    }
}

public struct DiceSet: Codable, Identifiable {
    public let id: UUID
    public let name: String
    public var combinations: [DiceCombination]
    
    public init(name: String, combinations: [DiceCombination]) {
        self.id = UUID()
        self.name = name
        self.combinations = combinations
    }
}

public struct DiceCombination: Codable {
    public let diceType: DiceType
    public let count: Int
    public let modifier: Int
    
    public init(diceType: DiceType, count: Int, modifier: Int) {
        self.diceType = diceType
        self.count = count
        self.modifier = modifier
    }
    
    public var description: String {
        let modifierStr = modifier != 0 ? (modifier > 0 ? "+\(modifier)" : "\(modifier)") : ""
        return "\(count)\(diceType.displayName)\(modifierStr)"
    }
}

public struct RollResult: Codable, Identifiable {
    public let id: UUID
    public let results: [Int]
    public let total: Int
    public let combination: DiceCombination
    public let timestamp: Date
    
    public init(results: [Int], combination: DiceCombination) {
        self.id = UUID()
        self.results = results
        self.total = results.reduce(0, +) + combination.modifier
        self.combination = combination
        self.timestamp = Date()
    }
    
    public var description: String {
        let rollsString = results.map(String.init).joined(separator: ", ")
        let modifierString = combination.modifier != 0 ? (combination.modifier > 0 ? "+\(combination.modifier)" : "\(combination.modifier)") : ""
        return "\(combination.count)\(combination.diceType.displayName) [\(rollsString)] \(modifierString) = \(total)"
    }
}

public final class DiceRoller {
    public static func roll(_ combination: DiceCombination) -> RollResult {
        let results = (0..<combination.count).map { _ in
            Int.random(in: 1...combination.diceType.rawValue)
        }
        return RollResult(results: results, combination: combination)
    }
    
    public static func rollSet(_ set: DiceSet) -> [RollResult] {
        set.combinations.map { roll($0) }
    }
    
    public static func rollSingle(_ type: DiceType) -> Int {
        Int.random(in: 1...type.rawValue)
    }
    
    public static func rollWithAdvantage(_ type: DiceType) -> (Int, Int) {
        let roll1 = rollSingle(type)
        let roll2 = rollSingle(type)
        return (roll1, roll2)
    }
    
    public static func rollWithDisadvantage(_ type: DiceType) -> (Int, Int) {
        rollWithAdvantage(type)
    }
}

public final class DiceService {
    public static let shared = DiceService()
    
    public private(set) var predefinedSets: [DiceSet] = [
        DiceSet(name: "Attack Roll", combinations: [
            DiceCombination(diceType: .d20, count: 1, modifier: 0)
        ]),
        DiceSet(name: "Sneak Attack", combinations: [
            DiceCombination(diceType: .d20, count: 1, modifier: 0),
            DiceCombination(diceType: .d6, count: 2, modifier: 0)
        ]),
        DiceSet(name: "Fireball", combinations: [
            DiceCombination(diceType: .d6, count: 8, modifier: 0)
        ])
    ]
    
    private init() {}
    
    public func roll(_ combination: DiceCombination, withAdvantage: Bool = false, withDisadvantage: Bool = false) -> RollResult {
        if withAdvantage && !withDisadvantage {
            let (roll1, roll2) = DiceRoller.rollWithAdvantage(combination.diceType)
            let results = [max(roll1, roll2)]
            return RollResult(results: results, combination: combination)
        } else if withDisadvantage && !withAdvantage {
            let (roll1, roll2) = DiceRoller.rollWithDisadvantage(combination.diceType)
            let results = [min(roll1, roll2)]
            return RollResult(results: results, combination: combination)
        } else {
            return DiceRoller.roll(combination)
        }
    }
    
    public func rollSet(_ set: DiceSet) -> [RollResult] {
        DiceRoller.rollSet(set)
    }
    
    public func addPredefinedSet(_ set: DiceSet) {
        predefinedSets.append(set)
    }
    
    public func removePredefinedSet(at index: Int) {
        predefinedSets.remove(at: index)
    }
}
