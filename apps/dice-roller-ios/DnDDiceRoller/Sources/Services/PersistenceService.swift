import CoreData

class PersistenceService {
    static let shared = PersistenceService()
    
    private init() {}
    
    lazy var persistentContainer: NSPersistentContainer = {
        let container = NSPersistentContainer(name: "DiceRoller")
        container.loadPersistentStores { description, error in
            if let error = error {
                fatalError("Unable to load persistent stores: \(error)")
            }
        }
        return container
    }()
    
    var context: NSManagedObjectContext {
        persistentContainer.viewContext
    }
    
    func saveRoll(_ roll: DiceRoll) {
        let rollHistory = RollHistory(context: context)
        rollHistory.id = roll.id
        rollHistory.diceType = Int16(roll.type.rawValue)
        rollHistory.result = Int16(roll.result)
        rollHistory.timestamp = roll.timestamp
        rollHistory.isAdvantage = roll.isAdvantage
        rollHistory.isDisadvantage = roll.isDisadvantage
        
        do {
            try context.save()
        } catch {
            print("Failed to save roll: \(error)")
        }
    }
    
    func fetchRollHistory() -> [DiceRoll] {
        let fetchRequest: NSFetchRequest<RollHistory> = RollHistory.fetchRequest()
        fetchRequest.sortDescriptors = [NSSortDescriptor(key: "timestamp", ascending: false)]
        
        do {
            let results = try context.fetch(fetchRequest)
            return results.compactMap { history in
                guard let diceType = DiceType.allCases.first(where: { $0.rawValue == Int(history.diceType) }),
                      let id = history.id,
                      let timestamp = history.timestamp else {
                    return nil
                }
                
                let roll = DiceRoll(type: diceType, result: Int(history.result), isAdvantage: history.isAdvantage, isDisadvantage: history.isDisadvantage)
                return roll
            }
        } catch {
            print("Failed to fetch roll history: \(error)")
            return []
        }
    }
    
    func clearHistory() {
        let fetchRequest: NSFetchRequest<NSFetchRequestResult> = RollHistory.fetchRequest()
        let deleteRequest = NSBatchDeleteRequest(fetchRequest: fetchRequest)
        
        do {
            try persistentContainer.persistentStoreCoordinator.execute(deleteRequest, with: context)
        } catch {
            print("Failed to clear history: \(error)")
        }
    }
}
