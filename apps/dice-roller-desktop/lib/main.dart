import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'views/dice_roller_home.dart';
void main() {
  runApp(const ProviderScope(child: DnDDiceRollerApp()));
}

class DnDDiceRollerApp extends StatelessWidget {
  const DnDDiceRollerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'D&D 5E Dice Roller',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF8B0000), // Dark red theme
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFF1A1A1A), // Dark background
        cardColor: const Color(0xFF2D2D2D), // Dark card color
        textTheme: const TextTheme(
          bodyLarge: TextStyle(
            fontFamily: 'Roboto',
            fontSize: 16,
            color: Colors.white,
            fontWeight: FontWeight.w400,
          ),
          bodyMedium: TextStyle(
            fontFamily: 'Roboto',
            fontSize: 14,
            color: Colors.white70,
            fontWeight: FontWeight.w400,
          ),
          headlineMedium: TextStyle(
            fontFamily: 'Roboto',
            fontSize: 18,
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
          titleMedium: TextStyle(
            fontFamily: 'Roboto',
            fontSize: 16,
            color: Colors.white,
            fontWeight: FontWeight.w500,
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF8B0000),
            foregroundColor: Colors.white,
            textStyle: const TextStyle(
              fontFamily: 'Roboto',
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF2D2D2D),
          foregroundColor: Colors.white,
          titleTextStyle: TextStyle(
            fontFamily: 'Roboto',
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
      home: const DiceRollerHome(),
    );
  }
}

