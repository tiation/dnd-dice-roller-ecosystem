import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        
        let window = UIWindow(windowScene: windowScene)
        let diceRollerVC = DiceRollerViewController()
        let navigationController = UINavigationController(rootViewController: diceRollerVC)
        
        // Apply dark neon theme to navigation bar
        let appearance = UINavigationBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = ThemeColor.background
        appearance.titleTextAttributes = [.foregroundColor: ThemeColor.text]
        appearance.largeTitleTextAttributes = [.foregroundColor: ThemeColor.text]
        
        navigationController.navigationBar.standardAppearance = appearance
        navigationController.navigationBar.scrollEdgeAppearance = appearance
        navigationController.navigationBar.tintColor = ThemeColor.primary
        
        window.rootViewController = navigationController
        window.makeKeyAndVisible()
        self.window = window
    }
}
