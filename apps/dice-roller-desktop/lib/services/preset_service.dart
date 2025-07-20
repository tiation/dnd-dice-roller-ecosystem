import 'dart:convert';
import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:flutter/foundation.dart';
import '../models/dice_roll.dart';
import '../state/app_state.dart';

class PresetService {
  /// Configuration data structure for export/import
  static const String _configVersion = '1.0.0';
  static const String _defaultFileName = 'dnd_dice_presets.json';

  /// Export current app state to JSON file
  static Future<bool> exportPresets({
    required AppState appState,
    String? customFileName,
  }) async {
    try {
      // Create export configuration
      final exportConfig = {
        'version': _configVersion,
        'exportDate': DateTime.now().toIso8601String(),
        'appName': 'D&D 5E Dice Roller',
        'presets': appState.quickRolls.map((roll) => roll.toJson()).toList(),
        'settings': {
          'selectedCategory': appState.selectedCategory,
          'selectedDice': appState.selectedDice,
          'diceCount': appState.diceCount,
          'modifier': appState.modifier,
        }
      };

      final jsonString = const JsonEncoder.withIndent('  ').convert(exportConfig);
      
      if (kIsWeb) {
        // For web platform, use file_picker to save
        return await _saveFileWeb(jsonString, customFileName ?? _defaultFileName);
      } else {
        // For mobile/desktop platforms
        return await _saveFileMobile(jsonString, customFileName ?? _defaultFileName);
      }
    } catch (e) {
      debugPrint('Error exporting presets: $e');
      return false;
    }
  }

  /// Import presets from JSON file
  static Future<ImportResult> importPresets() async {
    try {
      String? fileContent;
      
      if (kIsWeb) {
        fileContent = await _loadFileWeb();
      } else {
        fileContent = await _loadFileMobile();
      }
      
      if (fileContent == null) {
        return ImportResult(
          success: false,
          error: 'No file selected or file could not be read',
        );
      }

      return _parseImportData(fileContent);
    } catch (e) {
      debugPrint('Error importing presets: $e');
      return ImportResult(
        success: false,
        error: 'Failed to import presets: ${e.toString()}',
      );
    }
  }

  /// Parse imported JSON data
  static ImportResult _parseImportData(String jsonContent) {
    try {
      final Map<String, dynamic> data = jsonDecode(jsonContent);
      
      // Validate structure
      if (!data.containsKey('version') || !data.containsKey('presets')) {
        return ImportResult(
          success: false,
          error: 'Invalid preset file format',
        );
      }

      // Parse presets
      final List<dynamic> presetsData = data['presets'] ?? [];
      final List<DiceRoll> presets = presetsData
          .map((presetData) {
            try {
              return DiceRoll.fromJson(presetData as Map<String, dynamic>);
            } catch (e) {
              debugPrint('Error parsing preset: $e');
              return null;
            }
          })
          .where((preset) => preset != null)
          .cast<DiceRoll>()
          .toList();

      // Parse settings if available
      final Map<String, dynamic>? settingsData = data['settings'];
      ImportSettings? settings;
      if (settingsData != null) {
        settings = ImportSettings(
          selectedCategory: settingsData['selectedCategory'] as String? ?? 'all',
          selectedDice: settingsData['selectedDice'] as int? ?? 20,
          diceCount: settingsData['diceCount'] as int? ?? 1,
          modifier: settingsData['modifier'] as int? ?? 0,
        );
      }

      return ImportResult(
        success: true,
        presets: presets,
        settings: settings,
        version: data['version'] as String?,
        exportDate: data['exportDate'] as String?,
      );
    } catch (e) {
      return ImportResult(
        success: false,
        error: 'Failed to parse preset file: ${e.toString()}',
      );
    }
  }

  /// Save file for web platform
  static Future<bool> _saveFileWeb(String content, String fileName) async {
    try {
      final result = await FilePicker.platform.saveFile(
        dialogTitle: 'Export Dice Presets',
        fileName: fileName,
        bytes: utf8.encode(content),
        type: FileType.custom,
        allowedExtensions: ['json'],
      );
      return result != null;
    } catch (e) {
      debugPrint('Error saving file on web: $e');
      return false;
    }
  }

  /// Save file for mobile/desktop platforms
  static Future<bool> _saveFileMobile(String content, String fileName) async {
    try {
      // Request storage permission
      if (await Permission.storage.request().isGranted) {
        final directory = await getApplicationDocumentsDirectory();
        final file = File('${directory.path}/$fileName');
        await file.writeAsString(content);
        return true;
      }
      return false;
    } catch (e) {
      debugPrint('Error saving file on mobile: $e');
      return false;
    }
  }

  /// Load file for web platform
  static Future<String?> _loadFileWeb() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['json'],
        withData: true,
      );
      
      if (result != null && result.files.isNotEmpty) {
        final file = result.files.first;
        if (file.bytes != null) {
          return utf8.decode(file.bytes!);
        }
      }
      return null;
    } catch (e) {
      debugPrint('Error loading file on web: $e');
      return null;
    }
  }

  /// Load file for mobile/desktop platforms
  static Future<String?> _loadFileMobile() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['json'],
      );
      
      if (result != null && result.files.isNotEmpty) {
        final file = File(result.files.first.path!);
        return await file.readAsString();
      }
      return null;
    } catch (e) {
      debugPrint('Error loading file on mobile: $e');
      return null;
    }
  }

  /// Generate a sample preset configuration for testing
  static Map<String, dynamic> getSampleConfig() {
    return {
      'version': _configVersion,
      'exportDate': DateTime.now().toIso8601String(),
      'appName': 'D&D 5E Dice Roller',
      'presets': [
        {
          'id': 'sample_1',
          'sides': 20,
          'count': 1,
          'modifier': 5,
          'description': 'Sample Attack Roll',
          'color': 0xFFFF0000,
          'icon': '⚔️',
          'category': 'combat',
          'sortOrder': 1,
        },
        {
          'id': 'sample_2',
          'sides': 6,
          'count': 2,
          'modifier': 3,
          'description': 'Sample Damage Roll',
          'color': 0xFFFFA500,
          'icon': '💥',
          'category': 'damage',
          'sortOrder': 2,
        },
      ],
      'settings': {
        'selectedCategory': 'all',
        'selectedDice': 20,
        'diceCount': 1,
        'modifier': 0,
      }
    };
  }
}

/// Result of import operation
class ImportResult {
  final bool success;
  final String? error;
  final List<DiceRoll>? presets;
  final ImportSettings? settings;
  final String? version;
  final String? exportDate;

  ImportResult({
    required this.success,
    this.error,
    this.presets,
    this.settings,
    this.version,
    this.exportDate,
  });
}

/// Settings that can be imported
class ImportSettings {
  final String selectedCategory;
  final int selectedDice;
  final int diceCount;
  final int modifier;

  ImportSettings({
    required this.selectedCategory,
    required this.selectedDice,
    required this.diceCount,
    required this.modifier,
  });
}
