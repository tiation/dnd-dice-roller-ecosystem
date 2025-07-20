package com.tiation.dnddiceroller.data

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import javax.inject.Inject
import javax.inject.Singleton

data class RollHistoryEntry(
    val id: Long = System.currentTimeMillis(),
    val timestamp: LocalDateTime,
    val label: String,
    val diceConfiguration: String, // e.g., "3d6+2" or "1d20 (Advantage)"
    val individualRolls: List<Int>,
    val finalResult: Int,
    val modifier: Int = 0,
    val rollType: RollType,
    val notes: String = ""
)

enum class RollType {
    NORMAL,
    ADVANTAGE,
    DISADVANTAGE,
    EXPLODING,
    SPELL_DAMAGE,
    HEALING,
    ATTACK,
    SKILL_CHECK,
    SAVING_THROW,
    CUSTOM
}

@Singleton
class RollHistoryManager @Inject constructor() {
    
    private val _rollHistory = MutableStateFlow<List<RollHistoryEntry>>(emptyList())
    val rollHistory: StateFlow<List<RollHistoryEntry>> = _rollHistory.asStateFlow()
    
    private val _campaignStats = MutableStateFlow(CampaignStats())
    val campaignStats: StateFlow<CampaignStats> = _campaignStats.asStateFlow()
    
    fun addRollToHistory(
        label: String,
        diceConfiguration: String,
        roll: DiceRoll,
        rollType: RollType = RollType.NORMAL,
        notes: String = ""
    ) {
        val entry = RollHistoryEntry(
            timestamp = LocalDateTime.now(),
            label = label,
            diceConfiguration = diceConfiguration,
            individualRolls = roll.rolls,
            finalResult = roll.total,
            modifier = roll.modifier,
            rollType = rollType,
            notes = notes
        )
        
        val currentHistory = _rollHistory.value.toMutableList()
        currentHistory.add(0, entry) // Add to beginning (most recent first)
        
        // Keep only last 1000 rolls to prevent memory issues
        if (currentHistory.size > 1000) {
            currentHistory.removeAt(currentHistory.lastIndex)
        }
        
        _rollHistory.value = currentHistory
        updateCampaignStats(entry)
    }
    
    fun addDiceLineToHistory(diceLine: DiceLine) {
        diceLine.result?.let { roll ->
            val configString = buildString {
                append("${diceLine.diceCount}d${diceLine.diceType.sides}")
                if (diceLine.modifier != 0) {
                    if (diceLine.modifier > 0) append("+${diceLine.modifier}")
                    else append(diceLine.modifier)
                }
                if (diceLine.advantage) append(" (Advantage)")
                if (diceLine.disadvantage) append(" (Disadvantage)")
                if (diceLine.exploding) append(" (Exploding)")
            }
            
            val rollType = when {
                diceLine.advantage -> RollType.ADVANTAGE
                diceLine.disadvantage -> RollType.DISADVANTAGE
                diceLine.exploding -> RollType.EXPLODING
                else -> RollType.NORMAL
            }
            
            addRollToHistory(
                label = diceLine.label,
                diceConfiguration = configString,
                roll = roll,
                rollType = rollType
            )
        }
    }
    
    fun clearHistory() {
        _rollHistory.value = emptyList()
        _campaignStats.value = CampaignStats()
    }
    
    fun exportHistoryAsText(): String {
        val history = _rollHistory.value
        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
        
        return buildString {
            appendLine("D&D Dice Roller - Roll History Export")
            appendLine("=" .repeat(50))
            appendLine("Generated: ${LocalDateTime.now().format(formatter)}")
            appendLine()
            
            appendLine("Campaign Statistics:")
            with(_campaignStats.value) {
                appendLine("Total Rolls: $totalRolls")
                appendLine("Natural 20s: $naturalTwenties")
                appendLine("Natural 1s: $naturalOnes")
                appendLine("Average Roll (d20): ${"%.2f".format(averageD20Roll)}")
                appendLine("Highest Roll: $highestRoll")
                appendLine("Total Damage Dealt: $totalDamage")
            }
            appendLine()
            
            appendLine("Roll History:")
            appendLine("-" .repeat(50))
            
            history.forEach { entry ->
                appendLine("${entry.timestamp.format(formatter)} | ${entry.label}")
                appendLine("  Config: ${entry.diceConfiguration}")
                appendLine("  Rolls: ${entry.individualRolls.joinToString(", ")}")
                appendLine("  Result: ${entry.finalResult}")
                if (entry.notes.isNotEmpty()) {
                    appendLine("  Notes: ${entry.notes}")
                }
                appendLine()
            }
        }
    }
    
    private fun updateCampaignStats(entry: RollHistoryEntry) {
        val currentStats = _campaignStats.value
        
        val newStats = currentStats.copy(
            totalRolls = currentStats.totalRolls + 1,
            naturalTwenties = currentStats.naturalTwenties + 
                if (entry.individualRolls.contains(20) && entry.diceConfiguration.contains("d20")) 1 else 0,
            naturalOnes = currentStats.naturalOnes + 
                if (entry.individualRolls.contains(1) && entry.diceConfiguration.contains("d20")) 1 else 0,
            highestRoll = maxOf(currentStats.highestRoll, entry.finalResult),
            totalDamage = currentStats.totalDamage + 
                if (entry.rollType in listOf(RollType.SPELL_DAMAGE, RollType.ATTACK)) entry.finalResult else 0
        )
        
        // Calculate average d20 roll
        val d20Rolls = _rollHistory.value.filter { it.diceConfiguration.contains("d20") }
        val d20Average = if (d20Rolls.isNotEmpty()) {
            d20Rolls.flatMap { it.individualRolls.filter { roll -> roll <= 20 } }.average()
        } else 0.0
        
        _campaignStats.value = newStats.copy(averageD20Roll = d20Average)
    }
    
    fun getSessionSummary(): SessionSummary {
        val history = _rollHistory.value
        val now = LocalDateTime.now()
        val sessionStart = now.minusHours(6) // Consider last 6 hours as current session
        
        val sessionRolls = history.filter { it.timestamp.isAfter(sessionStart) }
        
        return SessionSummary(
            rollCount = sessionRolls.size,
            highestRoll = sessionRolls.maxOfOrNull { it.finalResult } ?: 0,
            lowestRoll = sessionRolls.minOfOrNull { it.finalResult } ?: 0,
            averageRoll = if (sessionRolls.isNotEmpty()) sessionRolls.map { it.finalResult }.average() else 0.0,
            criticalHits = sessionRolls.count { it.individualRolls.contains(20) && it.diceConfiguration.contains("d20") },
            criticalFails = sessionRolls.count { it.individualRolls.contains(1) && it.diceConfiguration.contains("d20") },
            totalDamage = sessionRolls.filter { it.rollType in listOf(RollType.SPELL_DAMAGE, RollType.ATTACK) }
                .sumOf { it.finalResult },
            sessionDuration = if (sessionRolls.isNotEmpty()) {
                java.time.Duration.between(sessionRolls.last().timestamp, sessionRolls.first().timestamp)
            } else java.time.Duration.ZERO
        )
    }
}

data class CampaignStats(
    val totalRolls: Int = 0,
    val naturalTwenties: Int = 0,
    val naturalOnes: Int = 0,
    val averageD20Roll: Double = 0.0,
    val highestRoll: Int = 0,
    val totalDamage: Int = 0
)

data class SessionSummary(
    val rollCount: Int,
    val highestRoll: Int,
    val lowestRoll: Int,
    val averageRoll: Double,
    val criticalHits: Int,
    val criticalFails: Int,
    val totalDamage: Int,
    val sessionDuration: java.time.Duration
)