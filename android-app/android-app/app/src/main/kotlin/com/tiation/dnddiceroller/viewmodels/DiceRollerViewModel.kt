package com.tiation.dnddiceroller.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import com.tiation.dnddiceroller.data.DiceType
import com.tiation.dnddiceroller.data.RollResult
import javax.inject.Inject
import kotlin.random.Random

data class DiceRollerUiState(
    val lastRoll: RollResult? = null,
    val rollHistory: List<RollResult> = emptyList(),
    val isRolling: Boolean = false,
    val soundEnabled: Boolean = true
)

@HiltViewModel
class DiceRollerViewModel @Inject constructor() : ViewModel() {
    
    private val _uiState = MutableStateFlow(DiceRollerUiState())
    val uiState: StateFlow<DiceRollerUiState> = _uiState.asStateFlow()
    
    fun rollDice(diceType: DiceType) {
        if (_uiState.value.isRolling) return
        
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isRolling = true)
            
            // Animate rolling for 1 second
            delay(1000)
            
            val result = Random.nextInt(1, diceType.sides + 1)
            val rollResult = RollResult(
                diceType = diceType,
                result = result,
                breakdown = "Rolled ${diceType.name}: $result"
            )
            
            val currentHistory = _uiState.value.rollHistory.toMutableList()
            currentHistory.add(0, rollResult) // Add to beginning
            if (currentHistory.size > 50) { // Keep last 50 rolls
                currentHistory.removeAt(currentHistory.size - 1)
            }
            
            _uiState.value = _uiState.value.copy(
                lastRoll = rollResult,
                rollHistory = currentHistory,
                isRolling = false
            )
        }
    }
    
    fun rollMultiple(diceType: DiceType, count: Int, modifier: Int = 0) {
        if (_uiState.value.isRolling) return
        
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isRolling = true)
            delay(1000)
            
            val rolls = mutableListOf<Int>()
            repeat(count) {
                rolls.add(Random.nextInt(1, diceType.sides + 1))
            }
            
            val total = rolls.sum() + modifier
            val breakdown = buildString {
                append("${count}${diceType.name}: ")
                append(rolls.joinToString(" + "))
                if (modifier != 0) {
                    append(" + $modifier")
                }
                append(" = $total")
            }
            
            val rollResult = RollResult(
                diceType = diceType,
                result = total,
                breakdown = breakdown
            )
            
            val currentHistory = _uiState.value.rollHistory.toMutableList()
            currentHistory.add(0, rollResult)
            if (currentHistory.size > 50) {
                currentHistory.removeAt(currentHistory.size - 1)
            }
            
            _uiState.value = _uiState.value.copy(
                lastRoll = rollResult,
                rollHistory = currentHistory,
                isRolling = false
            )
        }
    }
    
    fun toggleSound() {
        _uiState.value = _uiState.value.copy(
            soundEnabled = !_uiState.value.soundEnabled
        )
    }
    
    fun showHistory() {
        // TODO: Navigate to history screen
    }
    
    fun clearHistory() {
        _uiState.value = _uiState.value.copy(rollHistory = emptyList())
    }
}