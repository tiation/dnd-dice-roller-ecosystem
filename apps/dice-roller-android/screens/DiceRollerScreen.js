import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  FlatList,
  SafeAreaView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DiceRollerScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [diceLines, setDiceLines] = useState([]);
  const [rollHistory, setRollHistory] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [customExpression, setCustomExpression] = useState('');

  useEffect(() => {
    loadUserData();
    addInitialDiceLine();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const addInitialDiceLine = () => {
    const newLine = {
      id: Date.now(),
      label: 'Roll 1',
      diceCount: 1,
      diceType: 20,
      modifier: 0,
      advantage: false,
      disadvantage: false,
      exploding: false,
      operation: 'add', // 'add', 'subtract'
      result: null,
    };
    setDiceLines([newLine]);
  };

  const addDiceLine = () => {
    const newLine = {
      id: Date.now(),
      label: `Roll ${diceLines.length + 1}`,
      diceCount: 1,
      diceType: 20,
      modifier: 0,
      advantage: false,
      disadvantage: false,
      exploding: false,
      operation: 'add',
      result: null,
    };
    setDiceLines([...diceLines, newLine]);
  };

  const removeDiceLine = (id) => {
    setDiceLines(diceLines.filter(line => line.id !== id));
  };

  const updateDiceLine = (id, field, value) => {
    setDiceLines(diceLines.map(line => 
      line.id === id ? { ...line, [field]: value } : line
    ));
  };

  const rollDice = (sides, exploding = false) => {
    let roll = Math.floor(Math.random() * sides) + 1;
    let rolls = [roll];
    
    // Handle exploding dice (keep rolling on max value)
    if (exploding && roll === sides) {
      let nextRoll = rollDice(sides, exploding);
      if (Array.isArray(nextRoll)) {
        rolls = rolls.concat(nextRoll);
      } else {
        rolls.push(nextRoll);
      }
    }
    
    return exploding ? rolls.flat() : roll;
  };

  const rollWithAdvantage = (sides, count) => {
    const rolls = [];
    for (let i = 0; i < count; i++) {
      const roll1 = rollDice(sides);
      const roll2 = rollDice(sides);
      rolls.push({ roll1, roll2, result: Math.max(roll1, roll2), type: 'advantage' });
    }
    return rolls;
  };

  const rollWithDisadvantage = (sides, count) => {
    const rolls = [];
    for (let i = 0; i < count; i++) {
      const roll1 = rollDice(sides);
      const roll2 = rollDice(sides);
      rolls.push({ roll1, roll2, result: Math.min(roll1, roll2), type: 'disadvantage' });
    }
    return rolls;
  };

  const rollDiceLine = (line) => {
    let rolls = [];
    let rollDetails = [];

    if (line.advantage) {
      rollDetails = rollWithAdvantage(line.diceType, line.diceCount);
      rolls = rollDetails.map(r => r.result);
    } else if (line.disadvantage) {
      rollDetails = rollWithDisadvantage(line.diceType, line.diceCount);
      rolls = rollDetails.map(r => r.result);
    } else {
      for (let i = 0; i < line.diceCount; i++) {
        const roll = rollDice(line.diceType, line.exploding);
        if (line.exploding && Array.isArray(roll)) {
          rolls.push(roll.reduce((sum, r) => sum + r, 0));
          rollDetails.push({ exploding: roll, result: roll.reduce((sum, r) => sum + r, 0) });
        } else {
          rolls.push(roll);
          rollDetails.push({ normal: roll, result: roll });
        }
      }
    }
    
    let total = rolls.reduce((sum, roll) => sum + roll, 0) + line.modifier;
    
    // Apply operation (add/subtract) - this affects the total when combining with other dice lines
    if (line.operation === 'subtract') {
      total = -total + (line.modifier * 2); // Correct for modifier being applied twice
    }
    
    const result = {
      rolls,
      rollDetails,
      total,
      rawTotal: rolls.reduce((sum, roll) => sum + roll, 0) + line.modifier,
      modifier: line.modifier,
      advantage: line.advantage,
      disadvantage: line.disadvantage,
      exploding: line.exploding,
      operation: line.operation,
      timestamp: new Date().toLocaleTimeString(),
    };

    updateDiceLine(line.id, 'result', result);
    
    // Add to history
    let diceNotation = `${line.operation === 'subtract' ? '-' : ''}${line.diceCount}d${line.diceType}`;
    if (line.advantage) diceNotation += ' (ADV)';
    if (line.disadvantage) diceNotation += ' (DIS)';
    if (line.exploding) diceNotation += '!';
    if (line.modifier !== 0) diceNotation += (line.modifier > 0 ? '+' : '') + line.modifier;
    
    const historyEntry = {
      id: Date.now(),
      label: line.label,
      dice: diceNotation,
      result: result,
    };
    setRollHistory(prev => [historyEntry, ...prev.slice(0, 19)]); // Keep last 20 rolls
  };

  const rollAllDice = () => {
    diceLines.forEach(line => rollDiceLine(line));
  };

  const getCombinedTotal = () => {
    return diceLines
      .filter(line => line.result)
      .reduce((total, line) => total + line.result.total, 0);
  };

  const parseCustomExpression = (expression) => {
    // Parse expressions like "3d6+2d4-1d8+5"
    const parts = expression.match(/([+-]?)(\d+)d(\d+)([+-]\d+)?/g);
    if (!parts) return null;

    const parsedDice = parts.map((part, index) => {
      const match = part.match(/([+-]?)(\d+)d(\d+)([+-]\d+)?/);
      if (!match) return null;

      const [, sign, count, sides, modifier] = match;
      return {
        id: Date.now() + index,
        label: `Custom ${index + 1}`,
        diceCount: parseInt(count),
        diceType: parseInt(sides),
        modifier: modifier ? parseInt(modifier) : 0,
        operation: sign === '-' ? 'subtract' : 'add',
        advantage: false,
        disadvantage: false,
        exploding: false,
        result: null,
      };
    }).filter(Boolean);

    return parsedDice;
  };

  const rollCustomExpression = () => {
    const parsedDice = parseCustomExpression(customExpression);
    if (!parsedDice) {
      Alert.alert('Invalid Expression', 'Please enter a valid dice expression (e.g., 3d6+2d4-1d8)');
      return;
    }

    setDiceLines(parsedDice);
    parsedDice.forEach(line => rollDiceLine(line));
  };

  const clearHistory = () => {
    setRollHistory([]);
  };

  const logout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            await AsyncStorage.removeItem('isLoggedIn');
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  const renderDiceLine = ({ item }) => (
    <View style={styles.diceLineContainer}>
      <View style={styles.diceLineHeader}>
        <TextInput
          style={styles.labelInput}
          value={item.label}
          onChangeText={(text) => updateDiceLine(item.id, 'label', text)}
          placeholder="Roll label"
          placeholderTextColor="#666"
        />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeDiceLine(item.id)}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.diceControls}>
        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Count</Text>
          <TextInput
            style={styles.controlInput}
            value={item.diceCount.toString()}
            onChangeText={(text) => updateDiceLine(item.id, 'diceCount', parseInt(text) || 1)}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Type</Text>
          <View style={styles.diceTypeContainer}>
            {[4, 6, 8, 10, 12, 20, 100].map((sides) => (
              <TouchableOpacity
                key={sides}
                style={[
                  styles.diceTypeButton,
                  item.diceType === sides && styles.selectedDiceType
                ]}
                onPress={() => updateDiceLine(item.id, 'diceType', sides)}
              >
                <Text style={[
                  styles.diceTypeText,
                  item.diceType === sides && styles.selectedDiceTypeText
                ]}>
                  d{sides}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Modifier</Text>
          <TextInput
            style={styles.controlInput}
            value={item.modifier.toString()}
            onChangeText={(text) => updateDiceLine(item.id, 'modifier', parseInt(text) || 0)}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Operation</Text>
          <View style={styles.operationContainer}>
            <TouchableOpacity
              style={[
                styles.operationButton,
                item.operation === 'add' && styles.selectedOperation
              ]}
              onPress={() => updateDiceLine(item.id, 'operation', 'add')}
            >
              <Text style={[
                styles.operationText,
                item.operation === 'add' && styles.selectedOperationText
              ]}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.operationButton,
                item.operation === 'subtract' && styles.selectedOperation
              ]}
              onPress={() => updateDiceLine(item.id, 'operation', 'subtract')}
            >
              <Text style={[
                styles.operationText,
                item.operation === 'subtract' && styles.selectedOperationText
              ]}>-</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Special Rolls</Text>
          <View style={styles.specialRollsContainer}>
            <TouchableOpacity
              style={[
                styles.specialButton,
                item.advantage && styles.selectedSpecial
              ]}
              onPress={() => {
                updateDiceLine(item.id, 'advantage', !item.advantage);
                if (!item.advantage) updateDiceLine(item.id, 'disadvantage', false);
              }}
            >
              <Text style={[
                styles.specialText,
                item.advantage && styles.selectedSpecialText
              ]}>ADV</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.specialButton,
                item.disadvantage && styles.selectedSpecial
              ]}
              onPress={() => {
                updateDiceLine(item.id, 'disadvantage', !item.disadvantage);
                if (!item.disadvantage) updateDiceLine(item.id, 'advantage', false);
              }}
            >
              <Text style={[
                styles.specialText,
                item.disadvantage && styles.selectedSpecialText
              ]}>DIS</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.specialButton,
                item.exploding && styles.selectedSpecial
              ]}
              onPress={() => updateDiceLine(item.id, 'exploding', !item.exploding)}
            >
              <Text style={[
                styles.specialText,
                item.exploding && styles.selectedSpecialText
              ]}>EXP!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.rollButton}
        onPress={() => rollDiceLine(item)}
      >
        <LinearGradient
          colors={['#00ffff', '#ff00ff']}
          style={styles.rollButtonGradient}
        >
          <Text style={styles.rollButtonText}>ROLL</Text>
        </LinearGradient>
      </TouchableOpacity>

      {item.result && (
        <View style={styles.resultContainer}>
          {item.result.advantage && (
            <Text style={styles.advantageText}>
              Advantage: {item.result.rollDetails.map((r, i) => `[${r.roll1}, ${r.roll2}] → ${r.result}`).join(', ')}
            </Text>
          )}
          {item.result.disadvantage && (
            <Text style={styles.disadvantageText}>
              Disadvantage: {item.result.rollDetails.map((r, i) => `[${r.roll1}, ${r.roll2}] → ${r.result}`).join(', ')}
            </Text>
          )}
          {item.result.exploding && (
            <Text style={styles.explodingText}>
              Exploding: {item.result.rollDetails.map((r, i) => r.exploding ? `[${r.exploding.join(', ')}] = ${r.result}` : r.result).join(', ')}
            </Text>
          )}
          {!item.result.advantage && !item.result.disadvantage && !item.result.exploding && (
            <Text style={styles.resultText}>
              Rolls: {item.result.rolls.join(', ')}
            </Text>
          )}
          <Text style={[styles.totalText, item.operation === 'subtract' && styles.subtractTotal]}>
            {item.operation === 'subtract' ? 'Subtract: ' : 'Total: '}{Math.abs(item.result.rawTotal)}
          </Text>
        </View>
      )}
    </View>
  );

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyLabel}>{item.label}</Text>
      <Text style={styles.historyDice}>{item.dice}</Text>
      <Text style={styles.historyResult}>→ {item.result.total}</Text>
      <Text style={styles.historyTime}>{item.result.timestamp}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e']}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🎲 DnD Dice Roller</Text>
            <Text style={styles.welcomeText}>Welcome, {username}!</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Custom Expression Section */}
          <View style={styles.customSection}>
            <Text style={styles.sectionTitle}>Quick Expression</Text>
            <View style={styles.customExpressionContainer}>
              <TextInput
                style={styles.customInput}
                value={customExpression}
                onChangeText={setCustomExpression}
                placeholder="e.g., 3d6+2d4-1d8+5"
                placeholderTextColor="#666"
              />
              <TouchableOpacity style={styles.customRollButton} onPress={rollCustomExpression}>
                <Text style={styles.customRollText}>Roll</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Combined Total Display */}
          {diceLines.some(line => line.result) && (
            <View style={styles.combinedTotalContainer}>
              <Text style={styles.combinedTotalText}>
                Combined Total: {getCombinedTotal()}
              </Text>
            </View>
          )}

          {/* Dice Rolling Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Dice Rolls</Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity style={styles.addButton} onPress={addDiceLine}>
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rollAllButton} onPress={rollAllDice}>
                  <Text style={styles.rollAllButtonText}>Roll All</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={diceLines}
              renderItem={renderDiceLine}
              keyExtractor={(item) => item.id.toString()}
              style={styles.diceList}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* History Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Roll History</Text>
              <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={rollHistory}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.historyList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ffff',
    marginBottom: 5,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ff6666',
  },
  logoutText: {
    color: '#ff6666',
    fontSize: 12,
  },
  section: {
    flex: 1,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ffff',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  addButton: {
    backgroundColor: '#00ffff',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rollAllButton: {
    backgroundColor: 'rgba(255, 0, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ff00ff',
  },
  rollAllButtonText: {
    color: '#ff00ff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  diceList: {
    maxHeight: 300,
  },
  diceLineContainer: {
    backgroundColor: 'rgba(20, 20, 40, 0.8)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  diceLineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(10, 10, 30, 0.8)',
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#555',
  },
  removeButton: {
    backgroundColor: '#ff6666',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  diceControls: {
    marginBottom: 10,
  },
  controlGroup: {
    marginBottom: 10,
  },
  controlLabel: {
    color: '#00ffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  controlInput: {
    backgroundColor: 'rgba(10, 10, 30, 0.8)',
    color: '#ffffff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#555',
    fontSize: 16,
  },
  diceTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  diceTypeButton: {
    backgroundColor: 'rgba(10, 10, 30, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#555',
  },
  selectedDiceType: {
    backgroundColor: '#00ffff',
    borderColor: '#00ffff',
  },
  diceTypeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedDiceTypeText: {
    color: '#000',
  },
  rollButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  rollButtonGradient: {
    padding: 12,
    alignItems: 'center',
  },
  rollButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  resultContainer: {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00ffff',
  },
  resultText: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 5,
  },
  totalText: {
    color: '#00ffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: 'rgba(255, 100, 100, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ff6666',
  },
  clearButtonText: {
    color: '#ff6666',
    fontSize: 12,
    fontWeight: 'bold',
  },
  historyList: {
    maxHeight: 200,
  },
  historyItem: {
    backgroundColor: 'rgba(20, 20, 40, 0.6)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#00ffff',
  },
  historyLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyDice: {
    color: '#cccccc',
    fontSize: 12,
  },
  historyResult: {
    color: '#00ffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyTime: {
    color: '#888',
    fontSize: 10,
    textAlign: 'right',
  },
  customSection: {
    marginBottom: 20,
  },
  customExpressionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  customInput: {
    flex: 1,
    backgroundColor: 'rgba(20, 20, 40, 0.8)',
    color: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00ffff',
    fontSize: 16,
  },
  customRollButton: {
    backgroundColor: '#ff00ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  customRollText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  combinedTotalContainer: {
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00ffff',
    alignItems: 'center',
  },
  combinedTotalText: {
    color: '#00ffff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  operationContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  operationButton: {
    backgroundColor: 'rgba(10, 10, 30, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#555',
    minWidth: 50,
    alignItems: 'center',
  },
  selectedOperation: {
    backgroundColor: '#ff00ff',
    borderColor: '#ff00ff',
  },
  operationText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedOperationText: {
    color: '#ffffff',
  },
  specialRollsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  specialButton: {
    backgroundColor: 'rgba(10, 10, 30, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#555',
  },
  selectedSpecial: {
    backgroundColor: '#00ffff',
    borderColor: '#00ffff',
  },
  specialText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedSpecialText: {
    color: '#000000',
  },
  advantageText: {
    color: '#00ff00',
    fontSize: 14,
    marginBottom: 5,
  },
  disadvantageText: {
    color: '#ffaa00',
    fontSize: 14,
    marginBottom: 5,
  },
  explodingText: {
    color: '#ff6600',
    fontSize: 14,
    marginBottom: 5,
  },
  subtractTotal: {
    color: '#ff6666',
  },
});

export default DiceRollerScreen;
