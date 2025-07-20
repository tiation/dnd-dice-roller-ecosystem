package com.tiation.dnddiceroller.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.tiation.dnddiceroller.data.DiceType
import com.tiation.dnddiceroller.data.RollResult
import com.tiation.dnddiceroller.ui.theme.*
import com.tiation.dnddiceroller.viewmodels.DiceRollerViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DiceRollerScreen(
    viewModel: DiceRollerViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFF1a0033),
                        Color(0xFF330066)
                    )
                )
            )
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Title
        Text(
            text = "⚔️ D&D Dice Roller ⚔️",
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            color = EpicGold,
            modifier = Modifier.padding(vertical = 16.dp)
        )
        
        // Current Roll Result
        if (uiState.lastRoll != null) {
            RollResultDisplay(uiState.lastRoll!!, uiState.isRolling)
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // Dice Grid
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.weight(1f)
        ) {
            items(DiceType.values()) { diceType ->
                DiceButton(
                    diceType = diceType,
                    isRolling = uiState.isRolling,
                    onRoll = { viewModel.rollDice(diceType) }
                )
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Expression Input
        var expressionText by remember { mutableStateOf("") }
        
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = Color(0xFF2d1b69)
            )
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "🎲 Dice Expression",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = EpicGold,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = expressionText,
                        onValueChange = { expressionText = it },
                        placeholder = { 
                            Text(
                                "e.g., 3d6+2d4-1d8+5",
                                color = Color.Gray,
                                fontSize = 14.sp
                            ) 
                        },
                        modifier = Modifier.weight(1f),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = EpicGold,
                            unfocusedBorderColor = Color.Gray,
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        )
                    )
                    
                    Spacer(modifier = Modifier.width(8.dp))
                    
                    Button(
                        onClick = { 
                            if (expressionText.isNotBlank()) {
                                viewModel.rollExpression(expressionText)
                            }
                        },
                        enabled = !uiState.isRolling && expressionText.isNotBlank(),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = DragonRed
                        ),
                        modifier = Modifier.height(56.dp)
                    ) {
                        Text("ROLL", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
                
                // Quick Expression Buttons
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.padding(top = 8.dp)
                ) {
                    val quickExpressions = listOf(
                        "2d6+3" to "Sword Attack",
                        "3d6" to "Fireball", 
                        "1d8+2d4" to "Mixed Damage",
                        "4d6k3" to "Ability Score",
                        "2d20k1" to "Advantage"
                    )
                    
                    items(quickExpressions) { (expr, label) ->
                        OutlinedButton(
                            onClick = { expressionText = expr },
                            colors = ButtonDefaults.outlinedButtonColors(
                                contentColor = EpicGold
                            ),
                            border = BorderStroke(1.dp, EpicGold),
                            modifier = Modifier.height(32.dp)
                        ) {
                            Text(
                                text = label,
                                fontSize = 12.sp
                            )
                        }
                    }
                }
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Settings Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            // Sound Toggle
            IconButton(
                onClick = { viewModel.toggleSound() },
                modifier = Modifier
                    .background(
                        if (uiState.soundEnabled) EpicGold else Color.Gray,
                        RoundedCornerShape(8.dp)
                    )
            ) {
                Text(
                    text = if (uiState.soundEnabled) "🔊" else "🔇",
                    fontSize = 24.sp
                )
            }
            
            // Roll History
            Button(
                onClick = { viewModel.showHistory() },
                colors = ButtonDefaults.buttonColors(
                    containerColor = LegendaryPurple
                )
            ) {
                Text("History", color = Color.White)
            }
        }
    }
}

@Composable
fun DiceButton(
    diceType: DiceType,
    isRolling: Boolean,
    onRoll: () -> Unit
) {
    val rotationAnimation by animateFloatAsState(
        targetValue = if (isRolling) 360f else 0f,
        animationSpec = tween(1000, easing = LinearEasing),
        label = "dice_rotation"
    )
    
    val scaleAnimation by animateFloatAsState(
        targetValue = if (isRolling) 1.1f else 1f,
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy),
        label = "dice_scale"
    )
    
    Card(
        modifier = Modifier
            .aspectRatio(1f)
            .scale(scaleAnimation)
            .rotate(rotationAnimation)
            .clickable(enabled = !isRolling) { onRoll() },
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFF2d1b69)
        ),
        elevation = CardDefaults.cardElevation(
            defaultElevation = 8.dp
        )
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = diceType.emoji,
                fontSize = 48.sp,
                modifier = Modifier.padding(8.dp)
            )
            Text(
                text = diceType.name,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = EpicGold,
                textAlign = TextAlign.Center
            )
        }
    }
}

@Composable
fun RollResultDisplay(
    rollResult: RollResult,
    isRolling: Boolean
) {
    val scaleAnimation by animateFloatAsState(
        targetValue = if (isRolling) 1.2f else 1f,
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy),
        label = "result_scale"
    )
    
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .scale(scaleAnimation),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFF4c1d95)
        ),
        elevation = CardDefaults.cardElevation(
            defaultElevation = 12.dp
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = rollResult.diceType.name,
                fontSize = 18.sp,
                color = EpicGold,
                fontWeight = FontWeight.Bold
            )
            
            Text(
                text = if (isRolling) "🎲" else rollResult.result.toString(),
                fontSize = 48.sp,
                color = Color.White,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(vertical = 8.dp)
            )
            
            if (!isRolling && rollResult.breakdown.isNotEmpty()) {
                Text(
                    text = rollResult.breakdown,
                    fontSize = 14.sp,
                    color = Color(0xFFa1a1aa)
                )
            }
        }
    }
}