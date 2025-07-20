import 'package:flutter/material.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:json_annotation/json_annotation.dart';

part 'dice_roll.freezed.dart';
part 'dice_roll.g.dart';

@freezed
class DiceRoll with _$DiceRoll {
  const factory DiceRoll({
    required String id,
    required int sides,
    required int count,
    required int modifier,
    required String description,
    @JsonKey(fromJson: _colorFromJson, toJson: _colorToJson) required Color color,
    required String icon,
    required String category,
    @Default(0) int sortOrder,
  }) = _DiceRoll;

  factory DiceRoll.create({
    required int sides,
    required int count,
    required int modifier,
    required String description,
    required Color color,
    required String icon,
    required String category,
    int sortOrder = 0,
  }) {
    return DiceRoll(
      id: DateTime.now().millisecondsSinceEpoch.toString() + '_' + (sides * 1000 + count * 100 + modifier).toString(),
      sides: sides,
      count: count,
      modifier: modifier,
      description: description,
      color: color,
      icon: icon,
      category: category,
      sortOrder: sortOrder,
    );
  }

  factory DiceRoll.fromJson(Map<String, dynamic> json) => _$DiceRollFromJson(json);
}

// Helper functions for Color serialization
Color _colorFromJson(int value) => Color(value);
int _colorToJson(Color color) => color.value;
