import UIKit
import Foundation

@_exported import DiceModels

class DiceRollerViewController: UIViewController {
    private let scrollView: UIScrollView = {
        let scrollView = UIScrollView()
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        return scrollView
    }()
    
    private let contentView: UIView = {
        let view = UIView()
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }()
    
    private let quickDiceStackView: UIStackView = {
        let stackView = UIStackView()
        stackView.axis = .horizontal
        stackView.distribution = .fillEqually
        stackView.spacing = 10
        stackView.translatesAutoresizingMaskIntoConstraints = false
        return stackView
    }()
    
    private let predefinedSetsCollectionView: UICollectionView = {
        let layout = UICollectionViewFlowLayout()
        layout.scrollDirection = .horizontal
        layout.itemSize = CGSize(width: 150, height: 80)
        layout.minimumInteritemSpacing = 10
        
        let collectionView = UICollectionView(frame: .zero, collectionViewLayout: layout)
        collectionView.backgroundColor = .clear
        collectionView.translatesAutoresizingMaskIntoConstraints = false
        return collectionView
    }()
    
    private let customDiceStackView: UIStackView = {
        let stackView = UIStackView()
        stackView.axis = .horizontal
        stackView.spacing = 10
        stackView.translatesAutoresizingMaskIntoConstraints = false
        return stackView
    }()
    
    private let resultLabel: UILabel = {
        let label = UILabel()
        label.textColor = ThemeColor.text
        label.font = .systemFont(ofSize: 36, weight: .bold)
        label.textAlignment = .center
        label.numberOfLines = 0
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    private let rollLogTextView: UITextView = {
        let textView = UITextView()
        textView.backgroundColor = ThemeColor.background.withAlphaComponent(0.8)
        textView.textColor = ThemeColor.text
        textView.font = .systemFont(ofSize: 16)
        textView.isEditable = false
        textView.layer.cornerRadius = 8
        textView.layer.borderWidth = 1
        textView.layer.borderColor = ThemeColor.primary.cgColor
        textView.translatesAutoresizingMaskIntoConstraints = false
        return textView
    }()
    
    private let diceCountTextField: UITextField = {
        let textField = UITextField()
        textField.backgroundColor = ThemeColor.background
        textField.textColor = ThemeColor.text
        textField.borderStyle = .roundedRect
        textField.placeholder = "Count"
        textField.keyboardType = .numberPad
        textField.translatesAutoresizingMaskIntoConstraints = false
        return textField
    }()
    
    private let modifierTextField: UITextField = {
        let textField = UITextField()
        textField.backgroundColor = ThemeColor.background
        textField.textColor = ThemeColor.text
        textField.borderStyle = .roundedRect
        textField.placeholder = "Modifier"
        textField.keyboardType = .numberPad
        textField.translatesAutoresizingMaskIntoConstraints = false
        return textField
    }()
    
    private let advantageSwitch: UISwitch = {
        let switch_ = UISwitch()
        switch_.onTintColor = ThemeColor.primary
        switch_.translatesAutoresizingMaskIntoConstraints = false
        return switch_
    }()
    
    private let disadvantageSwitch: UISwitch = {
        let switch_ = UISwitch()
        switch_.onTintColor = ThemeColor.secondary
        switch_.translatesAutoresizingMaskIntoConstraints = false
        return switch_
    }()
    
    private let rollButton: UIButton = {
        let button = UIButton(type: .system)
        button.setTitle("Roll", for: .normal)
        button.titleLabel?.font = .systemFont(ofSize: 24, weight: .bold)
        button.translatesAutoresizingMaskIntoConstraints = false
        return button
    }()
    
    private let clearLogButton: UIButton = {
        let button = UIButton(type: .system)
        button.setTitle("Clear Log", for: .normal)
        button.titleLabel?.font = .systemFont(ofSize: 16)
        button.translatesAutoresizingMaskIntoConstraints = false
        return button
    }()
    
    private var selectedDiceType: DiceType = .d20
    private var rollLog: [RollResult] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupConstraints()
        setupCollectionView()
        setupQuickDiceButtons()
        ThemeService.shared.applyTheme(to: view)
    }
    
    private func setupUI() {
        title = "DnD Dice Roller"
        view.backgroundColor = ThemeColor.background
        
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        
        contentView.addSubview(quickDiceStackView)
        contentView.addSubview(predefinedSetsCollectionView)
        contentView.addSubview(customDiceStackView)
        contentView.addSubview(resultLabel)
        contentView.addSubview(rollLogTextView)
        contentView.addSubview(clearLogButton)
        
        customDiceStackView.addArrangedSubview(diceCountTextField)
        customDiceStackView.addArrangedSubview(modifierTextField)
        
        let advantageStackView = UIStackView(arrangedSubviews: [
            createLabel("Advantage"),
            advantageSwitch
        ])
        advantageStackView.spacing = 8
        
        let disadvantageStackView = UIStackView(arrangedSubviews: [
            createLabel("Disadvantage"),
            disadvantageSwitch
        ])
        disadvantageStackView.spacing = 8
        
        let switchesStackView = UIStackView(arrangedSubviews: [
            advantageStackView,
            disadvantageStackView
        ])
        switchesStackView.axis = .horizontal
        switchesStackView.distribution = .equalSpacing
        switchesStackView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(switchesStackView)
        
        contentView.addSubview(rollButton)
        
        rollButton.addTarget(self, action: #selector(rollDice), for: .touchUpInside)
        clearLogButton.addTarget(self, action: #selector(clearLog), for: .touchUpInside)
        
        // Initial state
        resultLabel.text = "Select dice and roll!"
        updateRollLog()
    }
    
    private func createLabel(_ text: String) -> UILabel {
        let label = UILabel()
        label.text = text
        label.textColor = ThemeColor.text
        label.font = .systemFont(ofSize: 16)
        return label
    }
    
    private func setupQuickDiceButtons() {
        DiceType.allCases.forEach { diceType in
            let button = UIButton(type: .system)
            button.setTitle(diceType.displayName, for: .normal)
            button.titleLabel?.font = .systemFont(ofSize: 20, weight: .bold)
            button.backgroundColor = ThemeColor.background
            button.layer.cornerRadius = 8
            button.layer.borderWidth = 2
            button.layer.borderColor = ThemeColor.primary.cgColor
            button.tag = diceType.rawValue
            button.addTarget(self, action: #selector(quickDiceSelected(_:)), for: .touchUpInside)
            quickDiceStackView.addArrangedSubview(button)
        }
    }
    
    @objc private func quickDiceSelected(_ sender: UIButton) {
        guard let diceType = DiceType.allCases.first(where: { $0.rawValue == sender.tag }) else { return }
        selectedDiceType = diceType
        quickDiceStackView.arrangedSubviews.forEach { view in
            guard let button = view as? UIButton else { return }
            button.layer.borderColor = button.tag == sender.tag ? ThemeColor.secondary.cgColor : ThemeColor.primary.cgColor
        }
    }
    
    private func setupConstraints() {
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor),
            
            quickDiceStackView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 20),
            quickDiceStackView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            quickDiceStackView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            quickDiceStackView.heightAnchor.constraint(equalToConstant: 50),
            
            predefinedSetsCollectionView.topAnchor.constraint(equalTo: quickDiceStackView.bottomAnchor, constant: 20),
            predefinedSetsCollectionView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            predefinedSetsCollectionView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            predefinedSetsCollectionView.heightAnchor.constraint(equalToConstant: 100),
            
            customDiceStackView.topAnchor.constraint(equalTo: predefinedSetsCollectionView.bottomAnchor, constant: 20),
            customDiceStackView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            customDiceStackView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            customDiceStackView.heightAnchor.constraint(equalToConstant: 40),
            
            diceCountTextField.widthAnchor.constraint(equalTo: customDiceStackView.widthAnchor, multiplier: 0.45),
            modifierTextField.widthAnchor.constraint(equalTo: customDiceStackView.widthAnchor, multiplier: 0.45),
            
            resultLabel.topAnchor.constraint(equalTo: customDiceStackView.bottomAnchor, constant: 20),
            resultLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            resultLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            rollLogTextView.topAnchor.constraint(equalTo: resultLabel.bottomAnchor, constant: 20),
            rollLogTextView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            rollLogTextView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            rollLogTextView.heightAnchor.constraint(equalToConstant: 200),
            
            clearLogButton.topAnchor.constraint(equalTo: rollLogTextView.bottomAnchor, constant: 8),
            clearLogButton.trailingAnchor.constraint(equalTo: rollLogTextView.trailingAnchor),
            
            rollButton.topAnchor.constraint(equalTo: clearLogButton.bottomAnchor, constant: 20),
            rollButton.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            rollButton.widthAnchor.constraint(equalToConstant: 200),
            rollButton.heightAnchor.constraint(equalToConstant: 60),
            rollButton.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -20)
        ])
    }
    
    private func setupCollectionView() {
        predefinedSetsCollectionView.delegate = self
        predefinedSetsCollectionView.dataSource = self
        predefinedSetsCollectionView.register(DiceSetCell.self, forCellWithReuseIdentifier: "DiceSetCell")
    }
    
    @objc private func rollDice() {
        let count = Int(diceCountTextField.text ?? "1") ?? 1
        let modifier = Int(modifierTextField.text ?? "0") ?? 0
        
        let combination = DiceCombination(diceType: selectedDiceType, count: count, modifier: modifier)
        let result = DiceService.shared.roll(
            combination,
            withAdvantage: advantageSwitch.isOn,
            withDisadvantage: disadvantageSwitch.isOn
        )
        
        rollLog.insert(result, at: 0)
        updateRollLog()
        
        // Show result with animation
        resultLabel.text = result.description
        UIView.animate(withDuration: 0.2) {
            self.resultLabel.transform = CGAffineTransform(scaleX: 1.2, y: 1.2)
        } completion: { _ in
            UIView.animate(withDuration: 0.1) {
                self.resultLabel.transform = .identity
            }
        }
    }
    
    @objc private func clearLog() {
        rollLog.removeAll()
        updateRollLog()
    }
    
    private func updateRollLog() {
        rollLogTextView.text = rollLog.map { $0.description }.joined(separator: "\n")
    }
}

// MARK: - UICollectionView DataSource & Delegate
extension DiceRollerViewController: UICollectionViewDataSource, UICollectionViewDelegate {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        DiceService.shared.predefinedSets.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "DiceSetCell", for: indexPath) as! DiceSetCell
        let set = DiceService.shared.predefinedSets[indexPath.item]
        cell.configure(with: set)
        return cell
    }
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let set = DiceService.shared.predefinedSets[indexPath.item]
        let results = DiceService.shared.rollSet(set)
        
        rollLog.insert(contentsOf: results, at: 0)
        updateRollLog()
        
        let resultText = results.map { $0.description }.joined(separator: "\n")
        resultLabel.text = resultText
        
        UIView.animate(withDuration: 0.2) {
            self.resultLabel.transform = CGAffineTransform(scaleX: 1.2, y: 1.2)
        } completion: { _ in
            UIView.animate(withDuration: 0.1) {
                self.resultLabel.transform = .identity
            }
        }
    }
}

// MARK: - DiceSetCell
class DiceSetCell: UICollectionViewCell {
    private let nameLabel: UILabel = {
        let label = UILabel()
        label.textColor = ThemeColor.text
        label.textAlignment = .center
        label.font = .systemFont(ofSize: 16, weight: .bold)
        label.numberOfLines = 0
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    private let descriptionLabel: UILabel = {
        let label = UILabel()
        label.textColor = ThemeColor.textSecondary
        label.textAlignment = .center
        label.font = .systemFont(ofSize: 14)
        label.numberOfLines = 0
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupUI() {
        contentView.backgroundColor = ThemeColor.background
        contentView.layer.cornerRadius = 8
        contentView.layer.borderWidth = 2
        contentView.layer.borderColor = ThemeColor.primary.cgColor
        
        contentView.addSubview(nameLabel)
        contentView.addSubview(descriptionLabel)
        
        NSLayoutConstraint.activate([
            nameLabel.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 8),
            nameLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 8),
            nameLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -8),
            
            descriptionLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            descriptionLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 8),
            descriptionLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -8),
            descriptionLabel.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -8)
        ])
    }
    
    func configure(with set: DiceSet) {
        nameLabel.text = set.name
        descriptionLabel.text = set.combinations.map { $0.description }.joined(separator: " + ")
    }
    
    override var isSelected: Bool {
        didSet {
            contentView.layer.borderColor = isSelected ? ThemeColor.secondary.cgColor : ThemeColor.primary.cgColor
            contentView.layer.shadowColor = isSelected ? ThemeColor.secondary.cgColor : ThemeColor.primary.cgColor
            contentView.layer.shadowOffset = .zero
            contentView.layer.shadowRadius = isSelected ? 10 : 0
            contentView.layer.shadowOpacity = isSelected ? 0.5 : 0
        }
    }
}
