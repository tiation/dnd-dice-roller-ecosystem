// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dice_roll.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$DiceRollImpl _$$DiceRollImplFromJson(Map<String, dynamic> json) =>
    _$DiceRollImpl(
      id: json['id'] as String,
      sides: (json['sides'] as num).toInt(),
      count: (json['count'] as num).toInt(),
      modifier: (json['modifier'] as num).toInt(),
      description: json['description'] as String,
      color: _colorFromJson((json['color'] as num).toInt()),
      icon: json['icon'] as String,
      category: json['category'] as String,
      sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$$DiceRollImplToJson(_$DiceRollImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'sides': instance.sides,
      'count': instance.count,
      'modifier': instance.modifier,
      'description': instance.description,
      'color': _colorToJson(instance.color),
      'icon': instance.icon,
      'category': instance.category,
      'sortOrder': instance.sortOrder,
    };
