import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter/material.dart';
import 'dart:math';
import '../models/dice_roll.dart';
import '../state/app_state.dart';
import '../services/preset_service.dart';

part 'dice_providers.g.dart';

// App State Provider
@riverpod
class AppStateNotifier extends _$AppStateNotifier {
  @override
  AppState build() {
    return AppState(
      quickRolls: _getDefaultQuickRolls(),
    );
  }

  List<DiceRoll> _getDefaultQuickRolls() {
    return [
      DiceRoll.create(
        sides: 20,
        count: 1,
        modifier: 0,
        description: 'Attack Roll',
        color: Colors.red,
        icon: '⚔️',
        category: 'combat',
        sortOrder: 1,
      ),
      DiceRoll.create(
        sides: 20,
        count: 1,
        modifier: 0,
        description: 'Skill Check',
        color: Colors.blue,
        icon: '🎯',
        category: 'skill',
        sortOrder: 2,
      ),
      DiceRoll.create(
        sides: 20,
        count: 1,
        modifier: 0,
        description: 'Saving Throw',
        color: Colors.green,
        icon: '🛡️',
        category: 'defense',
        sortOrder: 3,
      ),
      DiceRoll.create(
        sides: 6,
        count: 1,
        modifier: 0,
        description: 'Damage',
        color: Colors.orange,
        icon: '💥',
        category: 'damage',
        sortOrder: 4,
      ),
      DiceRoll.create(
        sides: 8,
        count: 1,
        modifier: 0,
        description: 'Longsword',
        color: Colors.purple,
        icon: '🗡️',
        category: 'weapon',
        sortOrder: 5,
      ),
      DiceRoll.create(
        sides: 6,
        count: 2,
        modifier: 0,
        description: 'Greatsword',
        color: Colors.deepPurple,
        icon: '⚔️',
        category: 'weapon',
        sortOrder: 6,
      ),
      DiceRoll.create(
        sides: 10,
        count: 1,
        modifier: 0,
        description: 'Heavy Crossbow',
        color: Colors.brown,
        icon: '🏹',
        category: 'weapon',
        sortOrder: 7,
      ),
      DiceRoll.create(
        sides: 8,
        count: 1,
        modifier: 0,
        description: 'Rapier',
        color: Colors.teal,
        icon: '🤺',
        category: 'weapon',
        sortOrder: 8,
      ),
    ];
  }

  // Quick Roll Management
  void addQuickRoll(DiceRoll roll) {
    final newRolls = [...state.quickRolls, roll];
    state = state.copyWith(quickRolls: newRolls);
  }

  void updateQuickRoll(String id, DiceRoll updatedRoll) {
    final newRolls = state.quickRolls.map((roll) {
      return roll.id == id ? updatedRoll : roll;
    }).toList();
    state = state.copyWith(quickRolls: newRolls);
  }

  void removeQuickRoll(String id) {
    final newRolls = state.quickRolls.where((roll) => roll.id != id).toList();
    state = state.copyWith(quickRolls: newRolls);
  }

  void reorderQuickRolls(int oldIndex, int newIndex) {
    final newRolls = [...state.quickRolls];
    if (newIndex > oldIndex) {
      newIndex -= 1;
    }
    final item = newRolls.removeAt(oldIndex);
    newRolls.insert(newIndex, item);
    
    // Update sort order
    for (int i = 0; i < newRolls.length; i++) {
      newRolls[i] = newRolls[i].copyWith(sortOrder: i);
    }
    
    state = state.copyWith(quickRolls: newRolls);
  }

  // Custom Roll Settings
  void setSelectedDice(int sides) {
    state = state.copyWith(selectedDice: sides);
  }

  void setDiceCount(int count) {
    state = state.copyWith(diceCount: count);
  }

  void setModifier(int modifier) {
    state = state.copyWith(modifier: modifier);
  }

  // Category Management
  void setSelectedCategory(String category) {
    state = state.copyWith(selectedCategory: category);
  }

  // Roll History
  void addToHistory(String rollText) {
    final newHistory = [rollText, ...state.rollHistory];
    if (newHistory.length > 20) {
      newHistory.removeLast();
    }
    state = state.copyWith(rollHistory: newHistory);
  }

  void clearHistory() {
    state = state.copyWith(rollHistory: []);
  }

  // Rolling state
  void setRolling(bool isRolling) {
    state = state.copyWith(isRolling: isRolling);
  }

  // Import/Export Functionality
  Future<bool> exportPresets({String? fileName}) async {
    try {
      return await PresetService.exportPresets(
        appState: state,
        customFileName: fileName,
      );
    } catch (e) {
      debugPrint('Error exporting presets: $e');
      return false;
    }
  }

  Future<ImportResult> importPresets() async {
    try {
      return await PresetService.importPresets();
    } catch (e) {
      debugPrint('Error importing presets: $e');
      return ImportResult(
        success: false,
        error: 'Failed to import presets: ${e.toString()}',
      );
    }
  }

  void applyImportedPresets(List<DiceRoll> presets, {ImportSettings? settings}) {
    state = state.copyWith(quickRolls: presets);
    
    if (settings != null) {
      state = state.copyWith(
        selectedCategory: settings.selectedCategory,
        selectedDice: settings.selectedDice,
        diceCount: settings.diceCount,
        modifier: settings.modifier,
      );
    }
  }

  void resetToDefaults() {
    state = AppState(
      quickRolls: _getDefaultQuickRolls(),
    );
  }
}

// Dice Rolling Service
@riverpod
class DiceRoller extends _$DiceRoller {
  final Random _random = Random();

  @override
  void build() {
    // No initial state needed for this service
  }

  List<int> rollDice(int sides, int count) {
    return List.generate(count, (index) => _random.nextInt(sides) + 1);
  }

  RollResult performRoll(int sides, int count, int modifier, String description) {
    final rolls = rollDice(sides, count);
    final total = rolls.fold(0, (sum, roll) => sum + roll) + modifier;
    
    final isCritical = sides == 20 && rolls.length == 1 && rolls[0] == 20;
    final isFumble = sides == 20 && rolls.length == 1 && rolls[0] == 1;
    
    return RollResult(
      rolls: rolls,
      total: total,
      description: description,
      isCritical: isCritical,
      isFumble: isFumble,
    );
  }

  String formatRollResult(RollResult result, int sides, int count, int modifier, String description) {
    final rollText = description.isEmpty ? 
      '${count}d$sides${modifier != 0 ? (modifier > 0 ? '+$modifier' : '$modifier') : ''}' : 
      description;
    
    String resultText = '$rollText: ${result.rolls.join(' + ')}${modifier != 0 ? (modifier > 0 ? ' + $modifier' : ' - ${-modifier}') : ''} = ${result.total}';
    
    if (result.isCritical) {
      resultText += ' 🎯 CRITICAL!';
    } else if (result.isFumble) {
      resultText += ' 💥 FUMBLE!';
    }
    
    return resultText;
  }
}

// Filtered Quick Rolls Provider
@riverpod
List<DiceRoll> filteredQuickRolls(FilteredQuickRollsRef ref) {
  final appState = ref.watch(appStateNotifierProvider);
  final selectedCategory = appState.selectedCategory;
  
  if (selectedCategory == 'all') {
    return appState.quickRolls;
  }
  
  return appState.quickRolls.where((roll) => roll.category == selectedCategory).toList();
}

// Categories Provider
@riverpod
List<String> categories(CategoriesRef ref) {
  final appState = ref.watch(appStateNotifierProvider);
  final categories = {'all', ...appState.quickRolls.map((roll) => roll.category)};
  return categories.toList();
}

// Dice Types Provider
@riverpod
List<int> diceTypes(DiceTypesRef ref) {
  return [4, 6, 8, 10, 12, 20, 100];
}
