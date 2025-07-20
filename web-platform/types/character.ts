export interface Character {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  // Basic Info
  characterName: string;
  playerName?: string;
  class: string;
  level: number;
  background?: string;
  race: string;
  alignment?: string;
  experience: number;

  // Ability Scores
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  // Combat Stats
  armorClass: number;
  initiative: number;
  speed: number;
  hitPointMaximum: number;
  currentHitPoints: number;
  temporaryHitPoints: number;
  hitDice?: string;

  // Death Saves
  deathSaveSuccesses: number;
  deathSaveFailures: number;

  // Skills (proficiency booleans)
  acrobatics: boolean;
  animalHandling: boolean;
  arcana: boolean;
  athletics: boolean;
  deception: boolean;
  history: boolean;
  insight: boolean;
  intimidation: boolean;
  investigation: boolean;
  medicine: boolean;
  nature: boolean;
  perception: boolean;
  performance: boolean;
  persuasion: boolean;
  religion: boolean;
  sleightOfHand: boolean;
  stealth: boolean;
  survival: boolean;

  // Saving Throws
  strengthSave: boolean;
  dexteritySave: boolean;
  constitutionSave: boolean;
  intelligenceSave: boolean;
  wisdomSave: boolean;
  charismaSave: boolean;

  // Additional character details
  age?: string;
  height?: string;
  weight?: string;
  eyes?: string;
  skin?: string;
  hair?: string;
  backstory?: string;
  personalityTraits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;

  // Features & Traits
  featuresAndTraits?: string;

  // Spellcasting
  spellcastingClass?: string;
  spellcastingAbility?: string;
  spellSaveDC?: number;
  spellAttackBonus?: number;
  cantrips?: string; // JSON string
  preparedSpells?: string; // JSON string
  spellSlots?: string; // JSON string

  // Relations
  equipment?: Equipment[];
  attacks?: Attack[];
}

export interface Equipment {
  id: string;
  characterId: string;
  name: string;
  quantity: number;
  weight?: number;
  description?: string;
}

export interface Attack {
  id: string;
  characterId: string;
  name: string;
  attackBonus?: number;
  damageType?: string;
  damage?: string;
}

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Skills {
  acrobatics: boolean;
  animalHandling: boolean;
  arcana: boolean;
  athletics: boolean;
  deception: boolean;
  history: boolean;
  insight: boolean;
  intimidation: boolean;
  investigation: boolean;
  medicine: boolean;
  nature: boolean;
  perception: boolean;
  performance: boolean;
  persuasion: boolean;
  religion: boolean;
  sleightOfHand: boolean;
  stealth: boolean;
  survival: boolean;
}

export interface SavingThrows {
  strengthSave: boolean;
  dexteritySave: boolean;
  constitutionSave: boolean;
  intelligenceSave: boolean;
  wisdomSave: boolean;
  charismaSave: boolean;
}

export const DND_CLASSES = [
  'Artificer',
  'Barbarian',
  'Bard',
  'Cleric',
  'Druid',
  'Fighter',
  'Monk',
  'Paladin',
  'Ranger',
  'Rogue',
  'Sorcerer',
  'Warlock',
  'Wizard'
] as const;

export const DND_RACES = [
  'Dragonborn',
  'Dwarf',
  'Elf',
  'Gnome',
  'Half-Elf',
  'Halfling',
  'Half-Orc',
  'Human',
  'Tiefling'
] as const;

export const DND_ALIGNMENTS = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'True Neutral',
  'Chaotic Neutral',
  'Lawful Evil',
  'Neutral Evil',
  'Chaotic Evil'
] as const;