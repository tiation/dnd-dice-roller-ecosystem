import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/dice_roll.dart';
import '../providers/dice_providers.dart';

class DiceRollerHome extends ConsumerStatefulWidget {
  const DiceRollerHome({super.key});

  @override
  ConsumerState<DiceRollerHome> createState() => _DiceRollerHomeState();
}

class _DiceRollerHomeState extends ConsumerState<DiceRollerHome>
    with TickerProviderStateMixin {
  late AnimationController _rollAnimationController;
  late Animation<double> _rollAnimation;

  @override
  void initState() {
    super.initState();
    _rollAnimationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _rollAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _rollAnimationController, curve: Curves.bounceOut),
    );
    
    // Storage initialization will be handled by the provider
  }

  @override
  void dispose() {
    _rollAnimationController.dispose();
    super.dispose();
  }

  void _performRoll(int sides, int count, int modifier, String description) {
    _rollAnimationController.forward().then((_) {
      _rollAnimationController.reset();
    });
    
    final diceRoller = ref.read(diceRollerProvider.notifier);
    final result = diceRoller.performRoll(sides, count, modifier, description);
    
    final formattedResult = diceRoller.formatRollResult(result, sides, count, modifier, description);
    
    ref.read(appStateNotifierProvider.notifier).addToHistory(formattedResult);
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isSmallScreen = screenWidth < 600;
    final isMediumScreen = screenWidth >= 600 && screenWidth < 1200;
    
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0A),
      appBar: AppBar(
        title: const Text('D&D 5E Dice Roller'),
        backgroundColor: const Color(0xFF2D2D2D),
        elevation: 4,
        actions: [
          IconButton(
            icon: const Icon(Icons.clear_all, color: Color(0xFFFFD700)),
            onPressed: () => ref.read(appStateNotifierProvider.notifier).clearHistory(),
            tooltip: 'Clear History',
          ),
        ],
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          if (isSmallScreen) {
            return SingleChildScrollView(
              child: Column(
                children: [
                  _buildQuickRollSection(),
                  const Divider(),
                  _buildCustomRollSection(),
                  const Divider(),
                  SizedBox(
                    height: 400,
                    child: _buildHistorySection(),
                  ),
                ],
              ),
            );
          } else if (isMediumScreen) {
            return Row(
              children: [
                Expanded(
                  flex: 1,
                  child: SingleChildScrollView(
                    child: Column(
                      children: [
                        _buildQuickRollSection(),
                        const Divider(),
                        _buildCustomRollSection(),
                      ],
                    ),
                  ),
                ),
                const VerticalDivider(),
                Expanded(
                  flex: 1,
                  child: _buildHistorySection(),
                ),
              ],
            );
          } else {
            return Row(
              children: [
                Expanded(
                  flex: 1,
                  child: _buildQuickRollSection(),
                ),
                const VerticalDivider(),
                Expanded(
                  flex: 1,
                  child: _buildCustomRollSection(),
                ),
                const VerticalDivider(),
                Expanded(
                  flex: 1,
                  child: _buildHistorySection(),
                ),
              ],
            );
          }
        },
      ),
    );
  }

  Widget _buildQuickRollSection() {
    final quickRolls = ref.watch(filteredQuickRollsProvider);
    final categories = ref.watch(categoriesProvider);
    final selectedCategory = ref.watch(appStateNotifierProvider.select((state) => state.selectedCategory));
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF2D2D2D),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF8B0000), width: 1),
      ),
      margin: const EdgeInsets.all(8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Quick Rolls',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  fontFamily: 'Roboto',
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add),
                onPressed: () => _showEditPresetDialog(null),
                tooltip: 'Add Quick Roll',
              ),
            ],
          ),
          const SizedBox(height: 8),
          _buildCategoryFilter(categories, selectedCategory),
          const SizedBox(height: 8),
          _buildCategoryChips(categories, selectedCategory),
          const SizedBox(height: 8),
          SizedBox(
            height: 400,
            child: ReorderableListView(
              onReorder: (oldIndex, newIndex) {
                ref.read(appStateNotifierProvider.notifier)
                    .reorderQuickRolls(oldIndex, newIndex);
              },
              children: quickRolls.asMap().entries.map((entry) {
                final index = entry.key;
                final roll = entry.value;
                return Card(
                  key: Key('quick_roll_${roll.id}_$index'),
                  margin: const EdgeInsets.symmetric(vertical: 4),
                  color: const Color(0xFF3A3A3A),
                  elevation: 2,
                  child: ListTile(
                    leading: Text(
                      roll.icon,
                      style: const TextStyle(fontSize: 20),
                    ),
                    title: Text(
                      roll.description,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w500,
                        fontFamily: 'Roboto',
                      ),
                    ),
                    subtitle: Text(
                      '${roll.count}d${roll.sides}${roll.modifier != 0 ? (roll.modifier > 0 ? '+${roll.modifier}' : '${roll.modifier}') : ''} (${roll.category})',
                      style: const TextStyle(
                        color: Colors.white70,
                        fontFamily: 'Roboto',
                      ),
                    ),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.edit),
                          onPressed: () => _showEditPresetDialog(roll),
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete),
                          onPressed: () {
                            ref.read(appStateNotifierProvider.notifier)
                                .removeQuickRoll(roll.id);
                          },
                        ),
                      ],
                    ),
                    onTap: () => _performRoll(roll.sides, roll.count, roll.modifier, roll.description),
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCustomRollSection() {
    final appState = ref.watch(appStateNotifierProvider);
    final diceTypes = ref.watch(diceTypesProvider);
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF2D2D2D),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF8B0000), width: 1),
      ),
      margin: const EdgeInsets.all(8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Custom Roll',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              fontFamily: 'Roboto',
            ),
          ),
          const SizedBox(height: 16),
          
          LayoutBuilder(
            builder: (context, constraints) {
              final screenWidth = MediaQuery.of(context).size.width;
              final isSmallScreen = screenWidth < 600;
              
              if (isSmallScreen) {
                return Column(
                  children: [
                    _buildDiceSelector(diceTypes, appState.selectedDice),
                    const SizedBox(height: 16),
                    _buildCountSelector(appState.diceCount),
                    const SizedBox(height: 16),
                    _buildModifierSelector(appState.modifier),
                  ],
                );
              } else {
                return Wrap(
                  spacing: 16,
                  runSpacing: 16,
                  children: [
                    _buildDiceSelector(diceTypes, appState.selectedDice),
                    _buildCountSelector(appState.diceCount),
                    _buildModifierSelector(appState.modifier),
                  ],
                );
              }
            },
          ),
          
          const SizedBox(height: 16),
          
          Center(
            child: AnimatedBuilder(
              animation: _rollAnimation,
              builder: (context, child) {
                return Transform.scale(
                  scale: 1.0 + (_rollAnimation.value * 0.2),
                  child: ElevatedButton(
                    onPressed: () => _performRoll(
                      appState.selectedDice, 
                      appState.diceCount, 
                      appState.modifier, 
                      ''
                    ),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                      textStyle: const TextStyle(fontSize: 18),
                    ),
                    child: FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Text(
                        'Roll ${appState.diceCount}d${appState.selectedDice}${appState.modifier != 0 ? (appState.modifier > 0 ? '+${appState.modifier}' : '${appState.modifier}') : ''}'
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDiceSelector(List<int> diceTypes, int selectedDice) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Text(
          'Dice: ',
          style: TextStyle(
            color: Colors.white,
            fontFamily: 'Roboto',
            fontWeight: FontWeight.w500,
          ),
        ),
        DropdownButton<int>(
          value: selectedDice,
          dropdownColor: const Color(0xFF3A3A3A),
          items: diceTypes.map((dice) => 
            DropdownMenuItem(
              value: dice,
              child: Text(
                'd$dice',
                style: const TextStyle(
                  color: Colors.white,
                  fontFamily: 'Roboto',
                ),
              ),
            )
          ).toList(),
          onChanged: (value) {
            if (value != null) {
              ref.read(appStateNotifierProvider.notifier).setSelectedDice(value);
            }
          },
        ),
      ],
    );
  }

  Widget _buildCountSelector(int diceCount) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Text(
          'Count: ',
          style: TextStyle(
            color: Colors.white,
            fontFamily: 'Roboto',
            fontWeight: FontWeight.w500,
          ),
        ),
        SizedBox(
          width: 60,
          child: TextField(
            keyboardType: TextInputType.number,
            style: const TextStyle(
              color: Colors.white,
              fontFamily: 'Roboto',
            ),
            onChanged: (value) {
              final count = int.tryParse(value) ?? 1;
              ref.read(appStateNotifierProvider.notifier).setDiceCount(count);
            },
            decoration: InputDecoration(
              hintText: diceCount.toString(),
              hintStyle: const TextStyle(color: Colors.white54),
              border: const OutlineInputBorder(
                borderSide: BorderSide(color: Colors.white54),
              ),
              enabledBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: Colors.white54),
              ),
              focusedBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: Color(0xFF8B0000)),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
              filled: true,
              fillColor: const Color(0xFF3A3A3A),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildModifierSelector(int modifier) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Text(
          'Modifier: ',
          style: TextStyle(
            color: Colors.white,
            fontFamily: 'Roboto',
            fontWeight: FontWeight.w500,
          ),
        ),
        SizedBox(
          width: 60,
          child: TextField(
            keyboardType: TextInputType.number,
            style: const TextStyle(
              color: Colors.white,
              fontFamily: 'Roboto',
            ),
            onChanged: (value) {
              final mod = int.tryParse(value) ?? 0;
              ref.read(appStateNotifierProvider.notifier).setModifier(mod);
            },
            decoration: InputDecoration(
              hintText: modifier.toString(),
              hintStyle: const TextStyle(color: Colors.white54),
              border: const OutlineInputBorder(
                borderSide: BorderSide(color: Colors.white54),
              ),
              enabledBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: Colors.white54),
              ),
              focusedBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: Color(0xFF8B0000)),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
              filled: true,
              fillColor: const Color(0xFF3A3A3A),
            ),
          ),
        ),
      ],
    );
  }

Widget _buildHistorySection() {
    final rollHistory = ref.watch(appStateNotifierProvider.select((state) => state.rollHistory));
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF2D2D2D),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF8B0000), width: 1),
      ),
      margin: const EdgeInsets.all(8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Roll History',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              fontFamily: 'Roboto',
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: rollHistory.isEmpty
                ? const Center(
                    child: Text(
                      'No rolls yet. Roll some dice!',
                      style: TextStyle(fontSize: 16, color: Colors.grey),
                    ),
                  )
                : ListView.builder(
                    itemCount: rollHistory.length,
                    itemBuilder: (context, index) {
                      return Card(
                        key: Key('history_$index'),
                        color: const Color(0xFF3A3A3A),
                        elevation: 2,
                        child: ListTile(
                          title: Text(
                            rollHistory[index],
                            style: TextStyle(
                              fontSize: MediaQuery.of(context).size.width < 600 ? 14 : 16,
                              color: Colors.white,
                              fontFamily: 'Roboto',
                            ),
                          ),
                          leading: CircleAvatar(
                            backgroundColor: const Color(0xFF8B0000),
                            child: Text(
                              '${index + 1}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontFamily: 'Roboto',
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  void _showEditPresetDialog(DiceRoll? roll) {
    final TextEditingController nameController = TextEditingController(text: roll?.description ?? '');
    final TextEditingController diceController = TextEditingController(text: roll != null ? roll.count.toString() : '1');
    final TextEditingController sidesController = TextEditingController(text: roll != null ? roll.sides.toString() : '20');
    final TextEditingController modifierController = TextEditingController(text: roll != null ? roll.modifier.toString() : '0');
    final TextEditingController iconController = TextEditingController(text: roll?.icon ?? '');
    final TextEditingController categoryController = TextEditingController(text: roll?.category ?? '');
    
    Color selectedColor = roll?.color ?? Colors.grey;
    
    final List<Color> availableColors = [
      Colors.red, Colors.blue, Colors.green, Colors.orange,
      Colors.purple, Colors.deepPurple, Colors.brown, Colors.teal,
      Colors.pink, Colors.indigo, Colors.grey, Colors.amber,
    ];

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: Text(roll == null ? 'Add Quick Roll' : 'Edit Quick Roll'),
          content: SingleChildScrollView(
            child: Column(
              children: [
                TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Name')),
                TextField(controller: diceController, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Dice Count')),
                TextField(controller: sidesController, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Dice Sides')),
                TextField(controller: modifierController, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Modifier')),
                TextField(controller: iconController, decoration: const InputDecoration(labelText: 'Icon/Emoji')),
                TextField(controller: categoryController, decoration: const InputDecoration(labelText: 'Category')),
                const SizedBox(height: 16),
                const Text('Color:', style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: availableColors.map((color) => GestureDetector(
                    onTap: () => setDialogState(() => selectedColor = color),
                    child: Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: color,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: selectedColor == color ? Colors.white : Colors.transparent,
                          width: 3,
                        ),
                      ),
                    ),
                  )).toList(),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                final newRoll = DiceRoll.create(
                  sides: int.tryParse(sidesController.text) ?? 20,
                  count: int.tryParse(diceController.text) ?? 1,
                  modifier: int.tryParse(modifierController.text) ?? 0,
                  description: nameController.text,
                  color: selectedColor,
                  icon: iconController.text,
                  category: categoryController.text,
                );
                
                if (roll == null) {
                  ref.read(appStateNotifierProvider.notifier).addQuickRoll(newRoll);
                } else {
                  ref.read(appStateNotifierProvider.notifier).updateQuickRoll(roll.id, newRoll);
                }
                
                Navigator.of(context).pop();
              },
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryFilter(List<String> categories, String selectedCategory) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF3A3A3A),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: const Color(0xFF00FFFF), // Cyan neon border
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF00FFFF).withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(
            Icons.filter_list,
            color: Color(0xFF00FFFF),
            size: 20,
          ),
          const SizedBox(width: 8),
          const Text(
            'Category: ',
            style: TextStyle(
              color: Colors.white,
              fontFamily: 'Roboto',
              fontWeight: FontWeight.w500,
            ),
          ),
          DropdownButton<String>(
            value: selectedCategory,
            dropdownColor: const Color(0xFF2D2D2D),
            underline: Container(), // Remove default underline
            icon: const Icon(
              Icons.arrow_drop_down,
              color: Color(0xFF00FFFF),
            ),
            items: categories.map((category) => 
              DropdownMenuItem(
                value: category,
                child: Text(
                  category == 'all' ? 'All Categories' : category.toUpperCase(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontFamily: 'Roboto',
                  ),
                ),
              )).toList(),
            onChanged: (value) {
              if (value != null) {
                ref.read(appStateNotifierProvider.notifier).setSelectedCategory(value);
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChips(List<String> categories, String selectedCategory) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: categories.map((category) {
          final isSelected = category == selectedCategory;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: GestureDetector(
              onTap: () {
                ref.read(appStateNotifierProvider.notifier).setSelectedCategory(category);
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: isSelected ? const Color(0xFF00FFFF) : const Color(0xFF3A3A3A),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isSelected ? const Color(0xFF00FFFF) : Colors.transparent,
                    width: 2,
                  ),
                  boxShadow: isSelected ? [
                    BoxShadow(
                      color: const Color(0xFF00FFFF).withOpacity(0.5),
                      blurRadius: 12,
                      offset: const Offset(0, 2),
                    ),
                  ] : null,
                ),
                child: Text(
                  category == 'all' ? 'All' : category.toUpperCase(),
                  style: TextStyle(
                    color: isSelected ? Colors.black : Colors.white,
                    fontFamily: 'Roboto',
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    fontSize: 12,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
