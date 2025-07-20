import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// D&D Utility Functions
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

export function getAbilityModifierString(score: number): string {
  const modifier = getAbilityModifier(score)
  return modifier >= 0 ? `+${modifier}` : `${modifier}`
}

export function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1
}

export function getSkillModifier(
  abilityScore: number,
  isProficient: boolean,
  level: number
): number {
  const abilityModifier = getAbilityModifier(abilityScore)
  const proficiencyBonus = isProficient ? getProficiencyBonus(level) : 0
  return abilityModifier + proficiencyBonus
}

export function getSkillModifierString(
  abilityScore: number,
  isProficient: boolean,
  level: number
): string {
  const modifier = getSkillModifier(abilityScore, isProficient, level)
  return modifier >= 0 ? `+${modifier}` : `${modifier}`
}

export function getSavingThrowModifier(
  abilityScore: number,
  isProficient: boolean,
  level: number
): number {
  const abilityModifier = getAbilityModifier(abilityScore)
  const proficiencyBonus = isProficient ? getProficiencyBonus(level) : 0
  return abilityModifier + proficiencyBonus
}

export function getSavingThrowModifierString(
  abilityScore: number,
  isProficient: boolean,
  level: number
): string {
  const modifier = getSavingThrowModifier(abilityScore, isProficient, level)
  return modifier >= 0 ? `+${modifier}` : `${modifier}`
}