import UIKit

enum ThemeColor {
    static let background = UIColor(red: 0.05, green: 0.05, blue: 0.05, alpha: 1.0)
    static let primary = UIColor(red: 0.0, green: 0.8, blue: 0.8, alpha: 1.0) // Cyan
    static let secondary = UIColor(red: 0.8, green: 0.0, blue: 0.8, alpha: 1.0) // Magenta
    static let text = UIColor.white
    static let textSecondary = UIColor.lightGray
    
    static func gradientColors() -> [CGColor] {
        [primary.cgColor, secondary.cgColor]
    }
}

class ThemeService {
    static let shared = ThemeService()
    
    private init() {}
    
    func applyTheme(to view: UIView) {
        view.backgroundColor = ThemeColor.background
        
        // Apply neon effect to buttons
        view.subviews.forEach { subview in
            if let button = subview as? UIButton {
                button.layer.cornerRadius = 8
                button.layer.borderWidth = 2
                button.layer.borderColor = ThemeColor.primary.cgColor
                button.setTitleColor(ThemeColor.text, for: .normal)
                
                // Add glow effect
                button.layer.shadowColor = ThemeColor.primary.cgColor
                button.layer.shadowOffset = .zero
                button.layer.shadowRadius = 10
                button.layer.shadowOpacity = 0.5
            }
        }
    }
    
    func applyGradientBackground(to view: UIView) {
        let gradientLayer = CAGradientLayer()
        gradientLayer.colors = ThemeColor.gradientColors()
        gradientLayer.locations = [0.0, 1.0]
        gradientLayer.startPoint = CGPoint(x: 0.0, y: 0.0)
        gradientLayer.endPoint = CGPoint(x: 1.0, y: 1.0)
        gradientLayer.frame = view.bounds
        
        view.layer.insertSublayer(gradientLayer, at: 0)
    }
}
