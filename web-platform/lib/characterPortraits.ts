export const characterPortraits = {
  warrior: {
    base: 'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/warrior.gif',
    variations: [
      'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/warrior-battle.gif',
      'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/warrior-defense.gif'
    ]
  },
  mage: {
    base: 'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/mage.gif',
    variations: [
      'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/mage-casting.gif',
      'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/mage-study.gif'
    ]
  },
  rogue: {
    base: 'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/rogue.gif',
    variations: [
      'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/rogue-stealth.gif',
      'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/rogue-attack.gif'
    ]
  },
  cleric: {
    base: 'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/cleric.gif',
    variations: [
      'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/cleric-healing.gif',
      'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/cleric-prayer.gif'
    ]
  },
  ranger: {
    base: 'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/ranger.gif',
    variations: [
      'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/ranger-bow.gif',
      'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/ranger-tracking.gif'
    ]
  },
  paladin: {
    base: 'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/paladin.gif',
    variations: [
      'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/paladin-smite.gif',
      'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/paladin-oath.gif'
    ]
  },
  bard: {
    base: 'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/bard.gif',
    variations: [
      'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/bard-performance.gif',
      'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/bard-inspiration.gif'
    ]
  },
  druid: {
    base: 'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/druid.gif',
    variations: [
      'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/druid-wildshape.gif',
      'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/druid-nature.gif'
    ]
  }
}

// Fallback portraits for when specific class/race portraits are not available
export const fallbackPortraits = {
  common: 'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/adventurer.gif',
  rare: 'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/hero.gif',
  epic: 'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/champion.gif',
  legendary: 'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/legend.gif'
}

// Default portrait for placeholder
export const defaultPortrait = 'https://raw.githubusercontent.com/tiation/dnd-assets/main/portraits/mystery.gif'
