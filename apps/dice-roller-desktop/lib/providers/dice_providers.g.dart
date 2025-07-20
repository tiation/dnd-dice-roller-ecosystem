// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dice_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$filteredQuickRollsHash() =>
    r'3c66bf55427b79a3b67488e0b0535c35ca4eee59';

/// See also [filteredQuickRolls].
@ProviderFor(filteredQuickRolls)
final filteredQuickRollsProvider = AutoDisposeProvider<List<DiceRoll>>.internal(
  filteredQuickRolls,
  name: r'filteredQuickRollsProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$filteredQuickRollsHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef FilteredQuickRollsRef = AutoDisposeProviderRef<List<DiceRoll>>;
String _$categoriesHash() => r'1285f6c965b0111e1e47f4bfbb15372484ddb7e4';

/// See also [categories].
@ProviderFor(categories)
final categoriesProvider = AutoDisposeProvider<List<String>>.internal(
  categories,
  name: r'categoriesProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$categoriesHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef CategoriesRef = AutoDisposeProviderRef<List<String>>;
String _$diceTypesHash() => r'7a848611fba34e630124b57e48fd81db0d122bbf';

/// See also [diceTypes].
@ProviderFor(diceTypes)
final diceTypesProvider = AutoDisposeProvider<List<int>>.internal(
  diceTypes,
  name: r'diceTypesProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$diceTypesHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef DiceTypesRef = AutoDisposeProviderRef<List<int>>;
String _$appStateNotifierHash() => r'692375a85d28028da9a98cf1eba2e9c448baad7a';

/// See also [AppStateNotifier].
@ProviderFor(AppStateNotifier)
final appStateNotifierProvider =
    AutoDisposeNotifierProvider<AppStateNotifier, AppState>.internal(
      AppStateNotifier.new,
      name: r'appStateNotifierProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$appStateNotifierHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

typedef _$AppStateNotifier = AutoDisposeNotifier<AppState>;
String _$diceRollerHash() => r'57a4318c83f038276281085e99023a8a9651bad1';

/// See also [DiceRoller].
@ProviderFor(DiceRoller)
final diceRollerProvider =
    AutoDisposeNotifierProvider<DiceRoller, void>.internal(
      DiceRoller.new,
      name: r'diceRollerProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$diceRollerHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

typedef _$DiceRoller = AutoDisposeNotifier<void>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
