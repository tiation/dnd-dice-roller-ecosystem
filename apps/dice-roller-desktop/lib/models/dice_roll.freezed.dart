// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'dice_roll.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

DiceRoll _$DiceRollFromJson(Map<String, dynamic> json) {
  return _DiceRoll.fromJson(json);
}

/// @nodoc
mixin _$DiceRoll {
  String get id => throw _privateConstructorUsedError;
  int get sides => throw _privateConstructorUsedError;
  int get count => throw _privateConstructorUsedError;
  int get modifier => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  @JsonKey(fromJson: _colorFromJson, toJson: _colorToJson)
  Color get color => throw _privateConstructorUsedError;
  String get icon => throw _privateConstructorUsedError;
  String get category => throw _privateConstructorUsedError;
  int get sortOrder => throw _privateConstructorUsedError;

  /// Serializes this DiceRoll to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of DiceRoll
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $DiceRollCopyWith<DiceRoll> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DiceRollCopyWith<$Res> {
  factory $DiceRollCopyWith(DiceRoll value, $Res Function(DiceRoll) then) =
      _$DiceRollCopyWithImpl<$Res, DiceRoll>;
  @useResult
  $Res call({
    String id,
    int sides,
    int count,
    int modifier,
    String description,
    @JsonKey(fromJson: _colorFromJson, toJson: _colorToJson) Color color,
    String icon,
    String category,
    int sortOrder,
  });
}

/// @nodoc
class _$DiceRollCopyWithImpl<$Res, $Val extends DiceRoll>
    implements $DiceRollCopyWith<$Res> {
  _$DiceRollCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of DiceRoll
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? sides = null,
    Object? count = null,
    Object? modifier = null,
    Object? description = null,
    Object? color = null,
    Object? icon = null,
    Object? category = null,
    Object? sortOrder = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            sides: null == sides
                ? _value.sides
                : sides // ignore: cast_nullable_to_non_nullable
                      as int,
            count: null == count
                ? _value.count
                : count // ignore: cast_nullable_to_non_nullable
                      as int,
            modifier: null == modifier
                ? _value.modifier
                : modifier // ignore: cast_nullable_to_non_nullable
                      as int,
            description: null == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String,
            color: null == color
                ? _value.color
                : color // ignore: cast_nullable_to_non_nullable
                      as Color,
            icon: null == icon
                ? _value.icon
                : icon // ignore: cast_nullable_to_non_nullable
                      as String,
            category: null == category
                ? _value.category
                : category // ignore: cast_nullable_to_non_nullable
                      as String,
            sortOrder: null == sortOrder
                ? _value.sortOrder
                : sortOrder // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$DiceRollImplCopyWith<$Res>
    implements $DiceRollCopyWith<$Res> {
  factory _$$DiceRollImplCopyWith(
    _$DiceRollImpl value,
    $Res Function(_$DiceRollImpl) then,
  ) = __$$DiceRollImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    int sides,
    int count,
    int modifier,
    String description,
    @JsonKey(fromJson: _colorFromJson, toJson: _colorToJson) Color color,
    String icon,
    String category,
    int sortOrder,
  });
}

/// @nodoc
class __$$DiceRollImplCopyWithImpl<$Res>
    extends _$DiceRollCopyWithImpl<$Res, _$DiceRollImpl>
    implements _$$DiceRollImplCopyWith<$Res> {
  __$$DiceRollImplCopyWithImpl(
    _$DiceRollImpl _value,
    $Res Function(_$DiceRollImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of DiceRoll
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? sides = null,
    Object? count = null,
    Object? modifier = null,
    Object? description = null,
    Object? color = null,
    Object? icon = null,
    Object? category = null,
    Object? sortOrder = null,
  }) {
    return _then(
      _$DiceRollImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        sides: null == sides
            ? _value.sides
            : sides // ignore: cast_nullable_to_non_nullable
                  as int,
        count: null == count
            ? _value.count
            : count // ignore: cast_nullable_to_non_nullable
                  as int,
        modifier: null == modifier
            ? _value.modifier
            : modifier // ignore: cast_nullable_to_non_nullable
                  as int,
        description: null == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String,
        color: null == color
            ? _value.color
            : color // ignore: cast_nullable_to_non_nullable
                  as Color,
        icon: null == icon
            ? _value.icon
            : icon // ignore: cast_nullable_to_non_nullable
                  as String,
        category: null == category
            ? _value.category
            : category // ignore: cast_nullable_to_non_nullable
                  as String,
        sortOrder: null == sortOrder
            ? _value.sortOrder
            : sortOrder // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$DiceRollImpl implements _DiceRoll {
  const _$DiceRollImpl({
    required this.id,
    required this.sides,
    required this.count,
    required this.modifier,
    required this.description,
    @JsonKey(fromJson: _colorFromJson, toJson: _colorToJson)
    required this.color,
    required this.icon,
    required this.category,
    this.sortOrder = 0,
  });

  factory _$DiceRollImpl.fromJson(Map<String, dynamic> json) =>
      _$$DiceRollImplFromJson(json);

  @override
  final String id;
  @override
  final int sides;
  @override
  final int count;
  @override
  final int modifier;
  @override
  final String description;
  @override
  @JsonKey(fromJson: _colorFromJson, toJson: _colorToJson)
  final Color color;
  @override
  final String icon;
  @override
  final String category;
  @override
  @JsonKey()
  final int sortOrder;

  @override
  String toString() {
    return 'DiceRoll(id: $id, sides: $sides, count: $count, modifier: $modifier, description: $description, color: $color, icon: $icon, category: $category, sortOrder: $sortOrder)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DiceRollImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.sides, sides) || other.sides == sides) &&
            (identical(other.count, count) || other.count == count) &&
            (identical(other.modifier, modifier) ||
                other.modifier == modifier) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.color, color) || other.color == color) &&
            (identical(other.icon, icon) || other.icon == icon) &&
            (identical(other.category, category) ||
                other.category == category) &&
            (identical(other.sortOrder, sortOrder) ||
                other.sortOrder == sortOrder));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    sides,
    count,
    modifier,
    description,
    color,
    icon,
    category,
    sortOrder,
  );

  /// Create a copy of DiceRoll
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$DiceRollImplCopyWith<_$DiceRollImpl> get copyWith =>
      __$$DiceRollImplCopyWithImpl<_$DiceRollImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DiceRollImplToJson(this);
  }
}

abstract class _DiceRoll implements DiceRoll {
  const factory _DiceRoll({
    required final String id,
    required final int sides,
    required final int count,
    required final int modifier,
    required final String description,
    @JsonKey(fromJson: _colorFromJson, toJson: _colorToJson)
    required final Color color,
    required final String icon,
    required final String category,
    final int sortOrder,
  }) = _$DiceRollImpl;

  factory _DiceRoll.fromJson(Map<String, dynamic> json) =
      _$DiceRollImpl.fromJson;

  @override
  String get id;
  @override
  int get sides;
  @override
  int get count;
  @override
  int get modifier;
  @override
  String get description;
  @override
  @JsonKey(fromJson: _colorFromJson, toJson: _colorToJson)
  Color get color;
  @override
  String get icon;
  @override
  String get category;
  @override
  int get sortOrder;

  /// Create a copy of DiceRoll
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$DiceRollImplCopyWith<_$DiceRollImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
