package com.tiation.dnddiceroller.data

import kotlin.random.Random
import kotlin.math.max

data class DiceRoll(
    val rolls: List<Int>,
    val total: Int,
    val modifier: Int = 0,
    val advantage: Boolean = false,
    val disadvantage: Boolean = false,
    val exploding: Boolean = false
)

data class DiceLine(
    val id: Long = System.currentTimeMillis(),
    val label: String,
    val diceCount: Int,
    val diceType: DiceType,
    val modifier: Int = 0,
    val advantage: Boolean = false,
    val disadvantage: Boolean = false,
    val exploding: Boolean = false,
    val operation: String = "add", // "add", "subtract"
    var result: DiceRoll? = null
)

class AdvancedDiceEngine {
    
    fun rollSingle(sides: Int, exploding: Boolean = false): List<Int> {
        val roll = Random.nextInt(1, sides + 1)
        val rolls = mutableListOf(roll)
        
        // Handle exploding dice (keep rolling on max value)
        if (exploding && roll == sides) {
            val nextRolls = rollSingle(sides, exploding)
            rolls.addAll(nextRolls)
        }
        
        return rolls
    }
    
    fun rollWithAdvantage(sides: Int): DiceRoll {
        val roll1 = rollSingle(sides)
        val roll2 = rollSingle(sides)
        val total1 = roll1.sum()
        val total2 = roll2.sum()
        
        return if (total1 >= total2) {
            DiceRoll(roll1, total1, advantage = true)
        } else {
            DiceRoll(roll2, total2, advantage = true)
        }
    }
    
    fun rollWithDisadvantage(sides: Int): DiceRoll {
        val roll1 = rollSingle(sides)
        val roll2 = rollSingle(sides)
        val total1 = roll1.sum()
        val total2 = roll2.sum()
        
        return if (total1 <= total2) {
            DiceRoll(roll1, total1, disadvantage = true)
        } else {
            DiceRoll(roll2, total2, disadvantage = true)
        }
    }
    
    fun rollDiceLine(diceLine: DiceLine): DiceRoll {
        val allRolls = mutableListOf<Int>()
        
        // Roll each die
        repeat(diceLine.diceCount) {
            val rolls = rollSingle(diceLine.diceType.sides, diceLine.exploding)
            allRolls.addAll(rolls)
        }
        
        var baseTotal = allRolls.sum()
        
        // Apply advantage/disadvantage if specified
        val finalRoll = when {
            diceLine.advantage -> {
                val advantageRoll = rollWithAdvantage(diceLine.diceType.sides)
                DiceRoll(
                    rolls = advantageRoll.rolls,
                    total = advantageRoll.total + diceLine.modifier,
                    modifier = diceLine.modifier,
                    advantage = true,
                    exploding = diceLine.exploding
                )
            }
            diceLine.disadvantage -> {
                val disadvantageRoll = rollWithDisadvantage(diceLine.diceType.sides)
                DiceRoll(
                    rolls = disadvantageRoll.rolls,
                    total = disadvantageRoll.total + diceLine.modifier,
                    modifier = diceLine.modifier,
                    disadvantage = true,
                    exploding = diceLine.exploding
                )
            }
            else -> {
                DiceRoll(
                    rolls = allRolls,
                    total = baseTotal + diceLine.modifier,
                    modifier = diceLine.modifier,
                    exploding = diceLine.exploding
                )
            }
        }
        
        return finalRoll
    }
    
    fun calculateCombinedTotal(diceLines: List<DiceLine>): Int {
        var total = 0
        
        diceLines.forEach { line ->
            line.result?.let { result ->
                when (line.operation) {
                    "add" -> total += result.total
                    "subtract" -> total -= result.total
                }
            }
        }
        
        return max(0, total) // Ensure non-negative result
    }
    
    fun parseExpression(expression: String): List<DiceLine> {
        // Simple expression parser for notation like "3d6+2d4-1d8+5"
        val diceLines = mutableListOf<DiceLine>()
        var currentExpression = expression.replace(" ", "")
        var lineNumber = 1
        
        // Split by + and - while preserving operators
        val parts = currentExpression.split(Regex("(?=[+-])")).filter { it.isNotEmpty() }
        
        parts.forEach { part ->
            val operation = if (part.startsWith("-")) "subtract" else "add"
            val cleanPart = part.removePrefix("+").removePrefix("-")
            
            if (cleanPart.contains("d")) {
                // Dice notation (e.g., "3d6")
                val diceParts = cleanPart.split("d")
                if (diceParts.size == 2) {
                    val count = diceParts[0].toIntOrNull() ?: 1
                    val sides = diceParts[1].toIntOrNull() ?: 20
                    
                    val diceType = when (sides) {
                        4 -> DiceType.D4
                        6 -> DiceType.D6
                        8 -> DiceType.D8
                        10 -> DiceType.D10
                        12 -> DiceType.D12
                        20 -> DiceType.D20
                        100 -> DiceType.D100
                        else -> DiceType.D20
                    }
                    
                    diceLines.add(
                        DiceLine(
                            label = "Roll $lineNumber",
                            diceCount = count,
                            diceType = diceType,
                            operation = operation
                        )
                    )
                    lineNumber++
                }
            } else {
                // Modifier (e.g., "+5")
                val modifier = cleanPart.toIntOrNull() ?: 0
                if (diceLines.isNotEmpty()) {
                    val lastLine = diceLines.last()
                    diceLines[diceLines.lastIndex] = lastLine.copy(
                        modifier = if (operation == "add") modifier else -modifier
                    )
                }
            }
        }
        
        return diceLines
    }
}

// Predefined spell configurations
object SpellConfigurations {
    val magicMissile = { level: Int ->
        DiceLine(
            label = "Magic Missile (Level $level)",
            diceCount = level + 2, // Base 3 + spell level - 1
            diceType = DiceType.D4,
            modifier = level + 2 // One missile per die
        )
    }
    
    val fireball = { level: Int ->
        DiceLine(
            label = "Fireball (Level $level)",
            diceCount = 8,
            diceType = DiceType.D6,
            modifier = 0
        )
    }
    
    val healingWord = { level: Int ->
        DiceLine(
            label = "Healing Word (Level $level)",
            diceCount = level,
            diceType = DiceType.D4,
            modifier = 0 // Plus spellcasting modifier
        )
    }
}