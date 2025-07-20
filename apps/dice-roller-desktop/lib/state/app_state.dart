import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/material.dart';
import '../models/dice_roll.dart';

part 'app_state.freezed.dart';
part 'app_state.g.dart';

@freezed
class AppState with _$AppState {
  const factory AppState({
    @Default([]) List<DiceRoll> quickRolls,
    @Default([]) List<String> rollHistory,
    @Default('all') String selectedCategory,
    @Default(20) int selectedDice,
    @Default(1) int diceCount,
    @Default(0) int modifier,
    @Default(false) bool isRolling,
  }) = _AppState;

  factory AppState.fromJson(Map<String, dynamic> json) => _$AppStateFromJson(json);
}

@freezed
class RollResult with _$RollResult {
  const factory RollResult({
    required List<int> rolls,
    required int total,
    required String description,
    required bool isCritical,
    required bool isFumble,
  }) = _RollResult;

  factory RollResult.fromJson(Map<String, dynamic> json) => _$RollResultFromJson(json);
}
