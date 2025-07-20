package com.tiation.dnddiceroller.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// D&D Theme Colors
val EpicGold = Color(0xFFfbbf24)
val LegendaryPurple = Color(0xFFa855f7)
val DragonRed = Color(0xFFdc2626)
val ForestGreen = Color(0xFF16a34a)
val AncientSilver = Color(0xFFcbd5e1)

private val DarkColorScheme = darkColorScheme(
    primary = EpicGold,
    secondary = LegendaryPurple,
    tertiary = ForestGreen,
    background = Color(0xFF1a0033),
    surface = Color(0xFF2d1b69),
    error = DragonRed,
    onPrimary = Color.Black,
    onSecondary = Color.White,
    onTertiary = Color.White,
    onBackground = Color.White,
    onSurface = Color.White,
    onError = Color.White
)

private val LightColorScheme = lightColorScheme(
    primary = LegendaryPurple,
    secondary = EpicGold,
    tertiary = ForestGreen,
    background = Color(0xFFFFFBFE),
    surface = Color(0xFFFFFBFE),
    error = DragonRed,
    onPrimary = Color.White,
    onSecondary = Color.Black,
    onTertiary = Color.White,
    onBackground = Color(0xFF1C1B1F),
    onSurface = Color(0xFF1C1B1F),
    onError = Color.White
)

@Composable
fun DNDDiceRollerTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}