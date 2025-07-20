import SwiftUI

struct ContentView: View {
    @StateObject private var diceRoller = DiceRollerViewModel()
    
    var body: some View {
        NavigationView {
            ZStack {
                // Epic background gradient
                LinearGradient(
                    colors: [
                        Color(red: 0.1, green: 0.0, blue: 0.2),
                        Color(red: 0.2, green: 0.0, blue: 0.4),
                        Color(red: 0.3, green: 0.0, blue: 0.6)
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                VStack(spacing: 20) {
                    // Title
                    Text("⚔️ D&D Dice Roller ⚔️")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(.epicGold)
                        .shadow(color: .epicGold, radius: 2, x: 0, y: 0)
                        .padding(.top)
                    
                    // Current Roll Result
                    if let lastRoll = diceRoller.lastRoll {
                        RollResultView(rollResult: lastRoll, isRolling: diceRoller.isRolling)
                    }
                    
                    Spacer()
                    
                    // Dice Grid
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 12), count: 2), spacing: 12) {
                        ForEach(DiceType.allCases, id: \.self) { diceType in
                            DiceButtonView(
                                diceType: diceType,
                                isRolling: diceRoller.isRolling
                            ) {
                                diceRoller.rollDice(diceType)
                            }
                        }
                    }
                    .padding(.horizontal)
                    
                    Spacer()
                    
                    // Settings Row
                    HStack(spacing: 40) {
                        // Sound Toggle
                        Button(action: { diceRoller.toggleSound() }) {
                            Text(diceRoller.soundEnabled ? "🔊" : "🔇")
                                .font(.title2)
                                .padding(12)
                                .background(
                                    diceRoller.soundEnabled ? Color.epicGold : Color.gray,
                                    in: RoundedRectangle(cornerRadius: 8)
                                )
                        }
                        
                        // History Button
                        Button(action: { diceRoller.showHistory() }) {
                            Text("History")
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                                .padding(.horizontal, 20)
                                .padding(.vertical, 12)
                                .background(Color.legendaryPurple, in: RoundedRectangle(cornerRadius: 8))
                        }
                    }
                    .padding(.bottom)
                }
                .padding()
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
}

struct DiceButtonView: View {
    let diceType: DiceType
    let isRolling: Bool
    let action: () -> Void
    
    @State private var rotationAngle: Double = 0
    @State private var scale: CGFloat = 1.0
    
    var body: some View {
        Button(action: {
            if !isRolling {
                withAnimation(.easeInOut(duration: 1.0)) {
                    rotationAngle += 360
                }
                withAnimation(.spring(response: 0.5, dampingFraction: 0.6)) {
                    scale = 1.1
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                    withAnimation(.spring(response: 0.5, dampingFraction: 0.6)) {
                        scale = 1.0
                    }
                }
                action()
            }
        }) {
            VStack {
                Text(diceType.emoji)
                    .font(.system(size: 48))
                    .padding(8)
                
                Text(diceType.displayName)
                    .font(.headline)
                    .fontWeight(.bold)
                    .foregroundColor(.epicGold)
                    .multilineTextAlignment(.center)
            }
            .frame(maxWidth: .infinity)
            .aspectRatio(1, contentMode: .fit)
            .background(
                RoundedRectangle(cornerRadius: 15)
                    .fill(Color.diceBackground)
                    .shadow(color: .legendaryPurple.opacity(0.5), radius: 8, x: 0, y: 4)
            )
        }
        .scaleEffect(scale)
        .rotationEffect(.degrees(rotationAngle))
        .disabled(isRolling)
    }
}

struct RollResultView: View {
    let rollResult: RollResult
    let isRolling: Bool
    
    @State private var resultScale: CGFloat = 1.0
    
    var body: some View {
        VStack {
            Text(rollResult.diceType.displayName)
                .font(.headline)
                .foregroundColor(.epicGold)
                .fontWeight(.bold)
            
            Text(isRolling ? "🎲" : "\(rollResult.result)")
                .font(.system(size: 48, weight: .bold))
                .foregroundColor(.white)
                .padding(.vertical, 8)
                .scaleEffect(resultScale)
                .onAppear {
                    if !isRolling {
                        withAnimation(.spring(response: 0.5, dampingFraction: 0.6)) {
                            resultScale = 1.2
                        }
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                            withAnimation(.spring(response: 0.5, dampingFraction: 0.6)) {
                                resultScale = 1.0
                            }
                        }
                    }
                }
            
            if !isRolling && !rollResult.breakdown.isEmpty {
                Text(rollResult.breakdown)
                    .font(.caption)
                    .foregroundColor(.gray)
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 15)
                .fill(Color.resultBackground)
                .shadow(color: .legendaryPurple.opacity(0.3), radius: 12, x: 0, y: 6)
        )
        .padding(.horizontal)
    }
}

// Color Extensions
extension Color {
    static let epicGold = Color(red: 0.984, green: 0.749, blue: 0.141)
    static let legendaryPurple = Color(red: 0.659, green: 0.333, blue: 0.969)
    static let dragonRed = Color(red: 0.863, green: 0.149, blue: 0.149)
    static let forestGreen = Color(red: 0.086, green: 0.639, blue: 0.290)
    static let diceBackground = Color(red: 0.176, green: 0.106, blue: 0.412)
    static let resultBackground = Color(red: 0.298, green: 0.114, blue: 0.584)
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}