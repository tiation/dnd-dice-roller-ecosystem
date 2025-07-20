package com.tiation.dnddiceroller.data

enum class DiceType(val sides: Int, val emoji: String) {
    D4(4, "🔸"),
    D6(6, "⚀"),
    D8(8, "🔶"),
    D10(10, "🔟"),
    D12(12, "🔷"),
    D20(20, "🎲"),
    D100(100, "💯");
    
    override fun toString(): String = "d$sides"
}

data class RollResult(
    val diceType: DiceType,
    val result: Int,
    val breakdown: String = "",
    val timestamp: Long = System.currentTimeMillis()
)