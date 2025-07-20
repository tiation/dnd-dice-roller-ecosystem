// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'app_state.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

AppState _$AppStateFromJson(Map<String, dynamic> json) {
  return _AppState.fromJson(json);
}

/// @nodoc
mixin _$AppState {
  List<DiceRoll> get quickRolls => throw _privateConstructorUsedError;
  List<String> get rollHistory => throw _privateConstructorUsedError;
  String get selectedCategory => throw _privateConstructorUsedError;
  int get selectedDice => throw _privateConstructorUsedError;
  int get diceCount => throw _privateConstructorUsedError;
  int get modifier => throw _privateConstructorUsedError;
  bool get isRolling => throw _privateConstructorUsedError;

  /// Serializes this AppState to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AppState
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AppStateCopyWith<AppState> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AppStateCopyWith<$Res> {
  factory $AppStateCopyWith(AppState value, $Res Function(AppState) then) =
      _$AppStateCopyWithImpl<$Res, AppState>;
  @useResult
  $Res call({
    List<DiceRoll> quickRolls,
    List<String> rollHistory,
    String selectedCategory,
    int selectedDice,
    int diceCount,
    int modifier,
    bool isRolling,
  });
}

/// @nodoc
class _$AppStateCopyWithImpl<$Res, $Val extends AppState>
    implements $AppStateCopyWith<$Res> {
  _$AppStateCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AppState
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? quickRolls = null,
    Object? rollHistory = null,
    Object? selectedCategory = null,
    Object? selectedDice = null,
    Object? diceCount = null,
    Object? modifier = null,
    Object? isRolling = null,
  }) {
    return _then(
      _value.copyWith(
            quickRolls: null == quickRolls
                ? _value.quickRolls
                : quickRolls // ignore: cast_nullable_to_non_nullable
                      as List<DiceRoll>,
            rollHistory: null == rollHistory
                ? _value.rollHistory
                : rollHistory // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            selectedCategory: null == selectedCategory
                ? _value.selectedCategory
                : selectedCategory // ignore: cast_nullable_to_non_nullable
                      as String,
            selectedDice: null == selectedDice
                ? _value.selectedDice
                : selectedDice // ignore: cast_nullable_to_non_nullable
                      as int,
            diceCount: null == diceCount
                ? _value.diceCount
                : diceCount // ignore: cast_nullable_to_non_nullable
                      as int,
            modifier: null == modifier
                ? _value.modifier
                : modifier // ignore: cast_nullable_to_non_nullable
                      as int,
            isRolling: null == isRolling
                ? _value.isRolling
                : isRolling // ignore: cast_nullable_to_non_nullable
                      as bool,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$AppStateImplCopyWith<$Res>
    implements $AppStateCopyWith<$Res> {
  factory _$$AppStateImplCopyWith(
    _$AppStateImpl value,
    $Res Function(_$AppStateImpl) then,
  ) = __$$AppStateImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    List<DiceRoll> quickRolls,
    List<String> rollHistory,
    String selectedCategory,
    int selectedDice,
    int diceCount,
    int modifier,
    bool isRolling,
  });
}

/// @nodoc
class __$$AppStateImplCopyWithImpl<$Res>
    extends _$AppStateCopyWithImpl<$Res, _$AppStateImpl>
    implements _$$AppStateImplCopyWith<$Res> {
  __$$AppStateImplCopyWithImpl(
    _$AppStateImpl _value,
    $Res Function(_$AppStateImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of AppState
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? quickRolls = null,
    Object? rollHistory = null,
    Object? selectedCategory = null,
    Object? selectedDice = null,
    Object? diceCount = null,
    Object? modifier = null,
    Object? isRolling = null,
  }) {
    return _then(
      _$AppStateImpl(
        quickRolls: null == quickRolls
            ? _value._quickRolls
            : quickRolls // ignore: cast_nullable_to_non_nullable
                  as List<DiceRoll>,
        rollHistory: null == rollHistory
            ? _value._rollHistory
            : rollHistory // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        selectedCategory: null == selectedCategory
            ? _value.selectedCategory
            : selectedCategory // ignore: cast_nullable_to_non_nullable
                  as String,
        selectedDice: null == selectedDice
            ? _value.selectedDice
            : selectedDice // ignore: cast_nullable_to_non_nullable
                  as int,
        diceCount: null == diceCount
            ? _value.diceCount
            : diceCount // ignore: cast_nullable_to_non_nullable
                  as int,
        modifier: null == modifier
            ? _value.modifier
            : modifier // ignore: cast_nullable_to_non_nullable
                  as int,
        isRolling: null == isRolling
            ? _value.isRolling
            : isRolling // ignore: cast_nullable_to_non_nullable
                  as bool,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$AppStateImpl implements _AppState {
  const _$AppStateImpl({
    final List<DiceRoll> quickRolls = const [],
    final List<String> rollHistory = const [],
    this.selectedCategory = 'all',
    this.selectedDice = 20,
    this.diceCount = 1,
    this.modifier = 0,
    this.isRolling = false,
  }) : _quickRolls = quickRolls,
       _rollHistory = rollHistory;

  factory _$AppStateImpl.fromJson(Map<String, dynamic> json) =>
      _$$AppStateImplFromJson(json);

  final List<DiceRoll> _quickRolls;
  @override
  @JsonKey()
  List<DiceRoll> get quickRolls {
    if (_quickRolls is EqualUnmodifiableListView) return _quickRolls;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_quickRolls);
  }

  final List<String> _rollHistory;
  @override
  @JsonKey()
  List<String> get rollHistory {
    if (_rollHistory is EqualUnmodifiableListView) return _rollHistory;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_rollHistory);
  }

  @override
  @JsonKey()
  final String selectedCategory;
  @override
  @JsonKey()
  final int selectedDice;
  @override
  @JsonKey()
  final int diceCount;
  @override
  @JsonKey()
  final int modifier;
  @override
  @JsonKey()
  final bool isRolling;

  @override
  String toString() {
    return 'AppState(quickRolls: $quickRolls, rollHistory: $rollHistory, selectedCategory: $selectedCategory, selectedDice: $selectedDice, diceCount: $diceCount, modifier: $modifier, isRolling: $isRolling)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AppStateImpl &&
            const DeepCollectionEquality().equals(
              other._quickRolls,
              _quickRolls,
            ) &&
            const DeepCollectionEquality().equals(
              other._rollHistory,
              _rollHistory,
            ) &&
            (identical(other.selectedCategory, selectedCategory) ||
                other.selectedCategory == selectedCategory) &&
            (identical(other.selectedDice, selectedDice) ||
                other.selectedDice == selectedDice) &&
            (identical(other.diceCount, diceCount) ||
                other.diceCount == diceCount) &&
            (identical(other.modifier, modifier) ||
                other.modifier == modifier) &&
            (identical(other.isRolling, isRolling) ||
                other.isRolling == isRolling));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    const DeepCollectionEquality().hash(_quickRolls),
    const DeepCollectionEquality().hash(_rollHistory),
    selectedCategory,
    selectedDice,
    diceCount,
    modifier,
    isRolling,
  );

  /// Create a copy of AppState
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AppStateImplCopyWith<_$AppStateImpl> get copyWith =>
      __$$AppStateImplCopyWithImpl<_$AppStateImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$AppStateImplToJson(this);
  }
}

abstract class _AppState implements AppState {
  const factory _AppState({
    final List<DiceRoll> quickRolls,
    final List<String> rollHistory,
    final String selectedCategory,
    final int selectedDice,
    final int diceCount,
    final int modifier,
    final bool isRolling,
  }) = _$AppStateImpl;

  factory _AppState.fromJson(Map<String, dynamic> json) =
      _$AppStateImpl.fromJson;

  @override
  List<DiceRoll> get quickRolls;
  @override
  List<String> get rollHistory;
  @override
  String get selectedCategory;
  @override
  int get selectedDice;
  @override
  int get diceCount;
  @override
  int get modifier;
  @override
  bool get isRolling;

  /// Create a copy of AppState
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AppStateImplCopyWith<_$AppStateImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

RollResult _$RollResultFromJson(Map<String, dynamic> json) {
  return _RollResult.fromJson(json);
}

/// @nodoc
mixin _$RollResult {
  List<int> get rolls => throw _privateConstructorUsedError;
  int get total => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  bool get isCritical => throw _privateConstructorUsedError;
  bool get isFumble => throw _privateConstructorUsedError;

  /// Serializes this RollResult to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of RollResult
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $RollResultCopyWith<RollResult> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RollResultCopyWith<$Res> {
  factory $RollResultCopyWith(
    RollResult value,
    $Res Function(RollResult) then,
  ) = _$RollResultCopyWithImpl<$Res, RollResult>;
  @useResult
  $Res call({
    List<int> rolls,
    int total,
    String description,
    bool isCritical,
    bool isFumble,
  });
}

/// @nodoc
class _$RollResultCopyWithImpl<$Res, $Val extends RollResult>
    implements $RollResultCopyWith<$Res> {
  _$RollResultCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of RollResult
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? rolls = null,
    Object? total = null,
    Object? description = null,
    Object? isCritical = null,
    Object? isFumble = null,
  }) {
    return _then(
      _value.copyWith(
            rolls: null == rolls
                ? _value.rolls
                : rolls // ignore: cast_nullable_to_non_nullable
                      as List<int>,
            total: null == total
                ? _value.total
                : total // ignore: cast_nullable_to_non_nullable
                      as int,
            description: null == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String,
            isCritical: null == isCritical
                ? _value.isCritical
                : isCritical // ignore: cast_nullable_to_non_nullable
                      as bool,
            isFumble: null == isFumble
                ? _value.isFumble
                : isFumble // ignore: cast_nullable_to_non_nullable
                      as bool,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$RollResultImplCopyWith<$Res>
    implements $RollResultCopyWith<$Res> {
  factory _$$RollResultImplCopyWith(
    _$RollResultImpl value,
    $Res Function(_$RollResultImpl) then,
  ) = __$$RollResultImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    List<int> rolls,
    int total,
    String description,
    bool isCritical,
    bool isFumble,
  });
}

/// @nodoc
class __$$RollResultImplCopyWithImpl<$Res>
    extends _$RollResultCopyWithImpl<$Res, _$RollResultImpl>
    implements _$$RollResultImplCopyWith<$Res> {
  __$$RollResultImplCopyWithImpl(
    _$RollResultImpl _value,
    $Res Function(_$RollResultImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of RollResult
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? rolls = null,
    Object? total = null,
    Object? description = null,
    Object? isCritical = null,
    Object? isFumble = null,
  }) {
    return _then(
      _$RollResultImpl(
        rolls: null == rolls
            ? _value._rolls
            : rolls // ignore: cast_nullable_to_non_nullable
                  as List<int>,
        total: null == total
            ? _value.total
            : total // ignore: cast_nullable_to_non_nullable
                  as int,
        description: null == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String,
        isCritical: null == isCritical
            ? _value.isCritical
            : isCritical // ignore: cast_nullable_to_non_nullable
                  as bool,
        isFumble: null == isFumble
            ? _value.isFumble
            : isFumble // ignore: cast_nullable_to_non_nullable
                  as bool,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$RollResultImpl implements _RollResult {
  const _$RollResultImpl({
    required final List<int> rolls,
    required this.total,
    required this.description,
    required this.isCritical,
    required this.isFumble,
  }) : _rolls = rolls;

  factory _$RollResultImpl.fromJson(Map<String, dynamic> json) =>
      _$$RollResultImplFromJson(json);

  final List<int> _rolls;
  @override
  List<int> get rolls {
    if (_rolls is EqualUnmodifiableListView) return _rolls;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_rolls);
  }

  @override
  final int total;
  @override
  final String description;
  @override
  final bool isCritical;
  @override
  final bool isFumble;

  @override
  String toString() {
    return 'RollResult(rolls: $rolls, total: $total, description: $description, isCritical: $isCritical, isFumble: $isFumble)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RollResultImpl &&
            const DeepCollectionEquality().equals(other._rolls, _rolls) &&
            (identical(other.total, total) || other.total == total) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.isCritical, isCritical) ||
                other.isCritical == isCritical) &&
            (identical(other.isFumble, isFumble) ||
                other.isFumble == isFumble));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    const DeepCollectionEquality().hash(_rolls),
    total,
    description,
    isCritical,
    isFumble,
  );

  /// Create a copy of RollResult
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$RollResultImplCopyWith<_$RollResultImpl> get copyWith =>
      __$$RollResultImplCopyWithImpl<_$RollResultImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$RollResultImplToJson(this);
  }
}

abstract class _RollResult implements RollResult {
  const factory _RollResult({
    required final List<int> rolls,
    required final int total,
    required final String description,
    required final bool isCritical,
    required final bool isFumble,
  }) = _$RollResultImpl;

  factory _RollResult.fromJson(Map<String, dynamic> json) =
      _$RollResultImpl.fromJson;

  @override
  List<int> get rolls;
  @override
  int get total;
  @override
  String get description;
  @override
  bool get isCritical;
  @override
  bool get isFumble;

  /// Create a copy of RollResult
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$RollResultImplCopyWith<_$RollResultImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
