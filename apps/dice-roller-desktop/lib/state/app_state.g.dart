// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_state.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$AppStateImpl _$$AppStateImplFromJson(Map<String, dynamic> json) =>
    _$AppStateImpl(
      quickRolls:
          (json['quickRolls'] as List<dynamic>?)
              ?.map((e) => DiceRoll.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      rollHistory:
          (json['rollHistory'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      selectedCategory: json['selectedCategory'] as String? ?? 'all',
      selectedDice: (json['selectedDice'] as num?)?.toInt() ?? 20,
      diceCount: (json['diceCount'] as num?)?.toInt() ?? 1,
      modifier: (json['modifier'] as num?)?.toInt() ?? 0,
      isRolling: json['isRolling'] as bool? ?? false,
    );

Map<String, dynamic> _$$AppStateImplToJson(_$AppStateImpl instance) =>
    <String, dynamic>{
      'quickRolls': instance.quickRolls,
      'rollHistory': instance.rollHistory,
      'selectedCategory': instance.selectedCategory,
      'selectedDice': instance.selectedDice,
      'diceCount': instance.diceCount,
      'modifier': instance.modifier,
      'isRolling': instance.isRolling,
    };

_$RollResultImpl _$$RollResultImplFromJson(Map<String, dynamic> json) =>
    _$RollResultImpl(
      rolls: (json['rolls'] as List<dynamic>)
          .map((e) => (e as num).toInt())
          .toList(),
      total: (json['total'] as num).toInt(),
      description: json['description'] as String,
      isCritical: json['isCritical'] as bool,
      isFumble: json['isFumble'] as bool,
    );

Map<String, dynamic> _$$RollResultImplToJson(_$RollResultImpl instance) =>
    <String, dynamic>{
      'rolls': instance.rolls,
      'total': instance.total,
      'description': instance.description,
      'isCritical': instance.isCritical,
      'isFumble': instance.isFumble,
    };
