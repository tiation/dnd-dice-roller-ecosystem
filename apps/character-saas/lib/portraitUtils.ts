import { characterPortraits, fallbackPortraits, defaultPortrait } from './characterPortraits'

interface CharacterInfo {
  class?: string
  race?: string
  description: string
  style: {
    name: string
    rarity: string
  }
}

export function determinePortrait(info: CharacterInfo): string {
  const classMatch = info.class?.toLowerCase() || 
    extractClassFromDescription(info.description.toLowerCase())
  
  // If we have a matching class portrait, use it
  if (classMatch && characterPortraits[classMatch as keyof typeof characterPortraits]) {
    const portraits = characterPortraits[classMatch as keyof typeof characterPortraits]
    // Randomly select between base and variations
    const allPortraits = [portraits.base, ...portraits.variations]
    return allPortraits[Math.floor(Math.random() * allPortraits.length)]
  }

  // Otherwise, use a fallback based on the style rarity
  return fallbackPortraits[info.style.rarity as keyof typeof fallbackPortraits] || defaultPortrait
}

function extractClassFromDescription(description: string): string | undefined {
  const classKeywords = {
    warrior: ['warrior', 'fighter', 'barbarian', 'battlemaster'],
    mage: ['mage', 'wizard', 'sorcerer', 'warlock'],
    rogue: ['rogue', 'thief', 'assassin'],
    cleric: ['cleric', 'priest', 'healer'],
    ranger: ['ranger', 'hunter', 'archer'],
    paladin: ['paladin', 'holy warrior', 'holy knight'],
    bard: ['bard', 'minstrel', 'performer'],
    druid: ['druid', 'shapeshifter', 'nature']
  }

  for (const [className, keywords] of Object.entries(classKeywords)) {
    if (keywords.some(keyword => description.includes(keyword))) {
      return className
    }
  }

  return undefined
}
