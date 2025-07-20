import Foundation
import Combine
import AVFoundation

class DiceRollerViewModel: ObservableObject {
    @Published var lastRoll: RollResult?
    @Published var rollHistory: [RollResult] = []
    @Published var isRolling: Bool = false
    @Published var soundEnabled: Bool = true
    
    private var audioPlayer: AVAudioPlayer?
    private let maxHistoryCount = 50
    
    init() {
        setupSound()
    }
    
    func rollDice(_ diceType: DiceType) {
        guard !isRolling else { return }
        
        isRolling = true
        
        // Play sound if enabled
        if soundEnabled {
            playRollSound()
        }
        
        // Simulate rolling animation delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            let result = Int.random(in: 1...diceType.sides)
            let rollResult = RollResult(
                diceType: diceType,
                result: result,
                breakdown: "Rolled \(diceType.displayName): \(result)"
            )
            
            self.lastRoll = rollResult
            self.addToHistory(rollResult)
            self.isRolling = false
        }
    }
    
    func rollMultiple(_ diceType: DiceType, count: Int, modifier: Int = 0) {
        guard !isRolling else { return }
        
        isRolling = true
        
        if soundEnabled {
            playRollSound()
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            var rolls: [Int] = []
            for _ in 0..<count {
                rolls.append(Int.random(in: 1...diceType.sides))
            }
            
            let total = rolls.reduce(0, +) + modifier
            var breakdown = "\(count)\(diceType.displayName): "
            breakdown += rolls.map { "\($0)" }.joined(separator: " + ")
            if modifier != 0 {
                breakdown += " + \(modifier)"
            }
            breakdown += " = \(total)"
            
            let rollResult = RollResult(
                diceType: diceType,
                result: total,
                breakdown: breakdown
            )
            
            self.lastRoll = rollResult
            self.addToHistory(rollResult)
            self.isRolling = false
        }
    }
    
    func toggleSound() {
        soundEnabled.toggle()
        UserDefaults.standard.set(soundEnabled, forKey: "soundEnabled")
    }
    
    func showHistory() {
        // TODO: Implement history view navigation
        print("History: \(rollHistory.count) rolls")
    }
    
    func clearHistory() {
        rollHistory.removeAll()
    }
    
    private func addToHistory(_ rollResult: RollResult) {
        rollHistory.insert(rollResult, at: 0)
        if rollHistory.count > maxHistoryCount {
            rollHistory.removeLast()
        }
    }
    
    private func setupSound() {
        soundEnabled = UserDefaults.standard.bool(forKey: "soundEnabled")
        
        // Create a simple beep sound programmatically
        // In a real app, you'd load an actual dice rolling sound file
    }
    
    private func playRollSound() {
        // Generate a simple beep sound
        // In a production app, you'd want to use actual dice rolling sound effects
        AudioServicesPlaySystemSound(1016) // Simple system sound
    }
}

import AudioToolbox

// Extension for system sounds
extension DiceRollerViewModel {
    private func playSystemSound() {
        AudioServicesPlaySystemSound(1016)
    }
}