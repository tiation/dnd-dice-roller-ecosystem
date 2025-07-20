package com.tiation.dnddiceroller.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import com.tiation.dnddiceroller.data.*
import javax.inject.Inject
import kotlin.random.Random

data class DiceRollerUiState(
    val lastRoll: RollResult? = null,
    val rollHistory: List<RollHistoryEntry> = emptyList(),
    val isRolling: Boolean = false,
    val soundEnabled: Boolean = true,
    val showHistory: Boolean = false,
    val sessionSummary: SessionSummary? = null,
    val campaignStats: CampaignStats = CampaignStats()
)

@HiltViewModel
class DiceRollerViewModel @Inject constructor(
    private val diceEngine: AdvancedDiceEngine,
    private val rollHistoryManager: RollHistoryManager
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(DiceRollerUiState())
    val uiState: StateFlow<DiceRollerUiState> = combine(
        _uiState,
        rollHistoryManager.rollHistory,
        rollHistoryManager.campaignStats
    ) { state, history, stats ->
        state.copy(
            rollHistory = history,
            campaignStats = stats,
            sessionSummary = rollHistoryManager.getSessionSummary()
        )
    }.stateIn(
        viewModelScope,
        kotlinx.coroutines.flow.SharingStarted.WhileSubscribed(5000),
        DiceRollerUiState()
    )
    
    fun rollDice(diceType: DiceType, rollType: RollType = RollType.NORMAL) {
        if (_uiState.value.isRolling) return
        
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isRolling = true)
            
            // Add rolling animation delay
            delay(1000)
            
            val rolls = when (rollType) {
                RollType.ADVANTAGE -> diceEngine.rollWithAdvantage(diceType.sides)
                RollType.DISADVANTAGE -> diceEngine.rollWithDisadvantage(diceType.sides)
                RollType.EXPLODING -> DiceRoll(
                    rolls = diceEngine.rollSingle(diceType.sides, exploding = true),
                    total = 0,
                    exploding = true
                ).let { it.copy(total = it.rolls.sum()) }
                else -> {
                    val rollList = diceEngine.rollSingle(diceType.sides)
                    DiceRoll(rolls = rollList, total = rollList.sum())
                }
            }
            
            val result = RollResult(
                diceType = diceType,
                result = rolls.total,
                breakdown = buildRollBreakdown(rolls, rollType)
            )
            
            // Add to history
            rollHistoryManager.addRollToHistory(
                label = "${diceType.name} Roll",
                diceConfiguration = buildDiceConfiguration(diceType, rollType),
                roll = rolls,
                rollType = rollType
            )
            
            _uiState.value = _uiState.value.copy(
                isRolling = false,
                lastRoll = result
            )
        }
    }
    
    fun rollAdvantage(diceType: DiceType) = rollDice(diceType, RollType.ADVANTAGE)
    fun rollDisadvantage(diceType: DiceType) = rollDice(diceType, RollType.DISADVANTAGE)
    fun rollExploding(diceType: DiceType) = rollDice(diceType, RollType.EXPLODING)
    
    fun rollExpression(expression: String) {
        if (_uiState.value.isRolling) return
        
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isRolling = true)
            delay(1000)
            
            val diceLines = diceEngine.parseExpression(expression)
            var totalResult = 0
            val allRolls = mutableListOf<String>()
            
            diceLines.forEach { diceLine ->
                val roll = diceEngine.rollDiceLine(diceLine)
                diceLine.result = roll
                rollHistoryManager.addDiceLineToHistory(diceLine)
                
                when (diceLine.operation) {
                    "add" -> totalResult += roll.total
                    "subtract" -> totalResult -= roll.total
                }
                
                allRolls.add("${diceLine.diceCount}d${diceLine.diceType.sides}: ${roll.rolls.joinToString(",")}")
            }
            
            val result = RollResult(
                diceType = DiceType.D20,
                result = totalResult,
                breakdown = "Expression: $expression\n${allRolls.joinToString("\n")}"
            )
            
            _uiState.value = _uiState.value.copy(
                isRolling = false,
                lastRoll = result
            )
        }
    }
    
    fun toggleSound() {
        _uiState.value = _uiState.value.copy(
            soundEnabled = !_uiState.value.soundEnabled
        )
    }
    
    fun showHistory() {
        _uiState.value = _uiState.value.copy(showHistory = true)
    }
    
    fun hideHistory() {
        _uiState.value = _uiState.value.copy(showHistory = false)
    }
    
    fun clearHistory() {
        rollHistoryManager.clearHistory()
    }
    
    fun exportHistory(): String {
        return rollHistoryManager.exportHistoryAsText()
    }
    
    private fun buildRollBreakdown(roll: DiceRoll, rollType: RollType): String {
        return buildString {
            if (roll.rolls.size > 1) {
                append("Rolls: ${roll.rolls.joinToString(", ")}")
            }
            
            when (rollType) {
                RollType.ADVANTAGE -> append(" (Advantage)")
                RollType.DISADVANTAGE -> append(" (Disadvantage)")  
                RollType.EXPLODING -> append(" (Exploding)")
                else -> {}
            }
            
            if (roll.modifier != 0) {
                append(" ${if (roll.modifier > 0) "+" else ""}${roll.modifier}")
            }
        }
    }
    
    private fun buildDiceConfiguration(diceType: DiceType, rollType: RollType): String {
        return buildString {
            append("1d${diceType.sides}")
            when (rollType) {
                RollType.ADVANTAGE -> append(" (Advantage)")
                RollType.DISADVANTAGE -> append(" (Disadvantage)")
                RollType.EXPLODING -> append(" (Exploding)")
                else -> {}
            }
        }
    }
}