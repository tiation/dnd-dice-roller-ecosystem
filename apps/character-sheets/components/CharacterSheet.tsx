'use client'

import { Character } from '@/types/character'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  getAbilityModifierString, 
  getSkillModifierString,
  getSavingThrowModifierString 
} from '@/lib/utils'
import { cn } from '@/lib/utils'

interface CharacterSheetProps {
  character: Character
  onUpdate?: (field: string, value: any) => void
  readOnly?: boolean
}

export default function CharacterSheet({ character, onUpdate, readOnly = false }: CharacterSheetProps) {
  const handleFieldChange = (field: string, value: any) => {
    if (!readOnly && onUpdate) {
      onUpdate(field, value)
    }
  }

  const abilityScoreInput = (ability: keyof typeof character, label: string) => {
    const score = character[ability] as number
    const modifier = getAbilityModifierString(score)
    
    return (
      <div className="ability-score animate-fade-in">
        <label className="block text-xs font-medium mb-2 text-amber-200 text-center font-serif">
          {label}
        </label>
        <div className="text-center">
          <div className="text-3xl font-bold mb-2 text-epic animate-glow">
            {modifier}
          </div>
          <Input
            type="number"
            min="1"
            max="30"
            value={score}
            onChange={(e) => handleFieldChange(ability, parseInt(e.target.value))}
            readOnly={readOnly}
            className="input-epic text-center text-lg font-bold h-12 border-2"
          />
        </div>
      </div>
    )
  }

  const skillRow = (skill: keyof Character, label: string, ability: keyof typeof character) => {
    const isProficient = character[skill] as boolean
    const abilityScore = character[ability] as number
    const modifier = getSkillModifierString(abilityScore, isProficient, character.level)
    
    return (
      <div className={cn(
        "skill-row animate-fade-in",
        isProficient && "skill-proficient"
      )}>
        <input
          type="checkbox"
          checked={isProficient}
          onChange={(e) => handleFieldChange(skill as string, e.target.checked)}
          disabled={readOnly}
          className="rounded border-yellow-500/50 text-yellow-500 focus:ring-yellow-500/20 w-4 h-4"
        />
        <span className="w-12 text-right font-mono text-lg font-bold text-epic">{modifier}</span>
        <span className="flex-1 font-serif text-amber-100">{label}</span>
        {isProficient && (
          <span className="text-yellow-400 animate-pulse-slow">⭐</span>
        )}
      </div>
    )
  }

  const savingThrowRow = (save: keyof Character, label: string, ability: keyof typeof character) => {
    const isProficient = character[save] as boolean
    const abilityScore = character[ability] as number
    const modifier = getSavingThrowModifierString(abilityScore, isProficient, character.level)
    
    return (
      <div className={cn(
        "skill-row animate-fade-in",
        isProficient && "skill-proficient"
      )}>
        <input
          type="checkbox"
          checked={isProficient}
          onChange={(e) => handleFieldChange(save as string, e.target.checked)}
          disabled={readOnly}
          className="rounded border-yellow-500/50 text-yellow-500 focus:ring-yellow-500/20 w-4 h-4"
        />
        <span className="w-12 text-right font-mono text-lg font-bold text-epic">{modifier}</span>
        <span className="flex-1 font-serif text-amber-100">{label}</span>
        {isProficient && (
          <span className="text-yellow-400 animate-pulse-slow">🛡️</span>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Epic Character Header */}
      <Card className="card-legendary overflow-hidden">
        <CardHeader className="relative">
          {/* Background decorative elements */}
          <div className="absolute top-4 left-4 text-6xl opacity-10 animate-float">⚔️</div>
          <div className="absolute top-4 right-4 text-6xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>🛡️</div>
          
          <div className="relative z-10">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2 animate-float">👑</div>
              <h2 className="text-3xl font-bold text-legendary title-ancient mb-2">
                Hero's Chronicle
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-amber-200 font-serif">CHARACTER NAME</label>
                <Input
                  value={character.characterName}
                  onChange={(e) => handleFieldChange('characterName', e.target.value)}
                  readOnly={readOnly}
                  className="input-epic font-bold text-lg h-12 text-center border-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-amber-200 font-serif">CLASS & LEVEL</label>
                <div className="flex space-x-2">
                  <Input
                    value={character.class}
                    onChange={(e) => handleFieldChange('class', e.target.value)}
                    readOnly={readOnly}
                    placeholder="Class"
                    className="input-epic font-semibold border-2"
                  />
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={character.level}
                    onChange={(e) => handleFieldChange('level', parseInt(e.target.value))}
                    readOnly={readOnly}
                    className="input-epic w-20 text-center font-bold text-xl border-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-amber-200 font-serif">BACKGROUND</label>
                <Input
                  value={character.background || ''}
                  onChange={(e) => handleFieldChange('background', e.target.value)}
                  readOnly={readOnly}
                  className="input-epic font-semibold border-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-amber-200 font-serif">PLAYER NAME</label>
                <Input
                  value={character.playerName || ''}
                  onChange={(e) => handleFieldChange('playerName', e.target.value)}
                  readOnly={readOnly}
                  className="input-epic font-semibold border-2"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-amber-200 font-serif">RACE</label>
                <Input
                  value={character.race}
                  onChange={(e) => handleFieldChange('race', e.target.value)}
                  readOnly={readOnly}
                  className="input-epic font-semibold border-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-amber-200 font-serif">ALIGNMENT</label>
                <Input
                  value={character.alignment || ''}
                  onChange={(e) => handleFieldChange('alignment', e.target.value)}
                  readOnly={readOnly}
                  className="input-epic font-semibold border-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-amber-200 font-serif">EXPERIENCE POINTS</label>
                <Input
                  type="number"
                  min="0"
                  value={character.experience}
                  onChange={(e) => handleFieldChange('experience', parseInt(e.target.value))}
                  readOnly={readOnly}
                  className="input-epic font-bold text-lg text-center border-2"
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1: Ability Scores & Skills */}
        <div className="space-y-8">
          {/* Ability Scores */}
          <Card className="card-epic">
            <CardHeader>
              <CardTitle className="text-xl text-epic font-serif flex items-center justify-center">
                <span className="mr-2 text-2xl animate-pulse-slow">💪</span>
                Heroic Attributes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {abilityScoreInput('strength', 'STR')}
                {abilityScoreInput('dexterity', 'DEX')}
                {abilityScoreInput('constitution', 'CON')}
                {abilityScoreInput('intelligence', 'INT')}
                {abilityScoreInput('wisdom', 'WIS')}
                {abilityScoreInput('charisma', 'CHA')}
              </div>
            </CardContent>
          </Card>

          {/* Saving Throws */}
          <Card className="card-epic">
            <CardHeader>
              <CardTitle className="text-lg text-epic font-serif flex items-center">
                <span className="mr-2 text-xl animate-pulse-slow">🛡️</span>
                Divine Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {savingThrowRow('strengthSave', 'Strength', 'strength')}
              {savingThrowRow('dexteritySave', 'Dexterity', 'dexterity')}
              {savingThrowRow('constitutionSave', 'Constitution', 'constitution')}
              {savingThrowRow('intelligenceSave', 'Intelligence', 'intelligence')}
              {savingThrowRow('wisdomSave', 'Wisdom', 'wisdom')}
              {savingThrowRow('charismaSave', 'Charisma', 'charisma')}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="card-legendary">
            <CardHeader>
              <CardTitle className="text-lg text-legendary font-serif flex items-center">
                <span className="mr-2 text-xl animate-pulse-slow">⭐</span>
                Legendary Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {skillRow('acrobatics', 'Acrobatics (Dex)', 'dexterity')}
              {skillRow('animalHandling', 'Animal Handling (Wis)', 'wisdom')}
              {skillRow('arcana', 'Arcana (Int)', 'intelligence')}
              {skillRow('athletics', 'Athletics (Str)', 'strength')}
              {skillRow('deception', 'Deception (Cha)', 'charisma')}
              {skillRow('history', 'History (Int)', 'intelligence')}
              {skillRow('insight', 'Insight (Wis)', 'wisdom')}
              {skillRow('intimidation', 'Intimidation (Cha)', 'charisma')}
              {skillRow('investigation', 'Investigation (Int)', 'intelligence')}
              {skillRow('medicine', 'Medicine (Wis)', 'wisdom')}
              {skillRow('nature', 'Nature (Int)', 'intelligence')}
              {skillRow('perception', 'Perception (Wis)', 'wisdom')}
              {skillRow('performance', 'Performance (Cha)', 'charisma')}
              {skillRow('persuasion', 'Persuasion (Cha)', 'charisma')}
              {skillRow('religion', 'Religion (Int)', 'intelligence')}
              {skillRow('sleightOfHand', 'Sleight of Hand (Dex)', 'dexterity')}
              {skillRow('stealth', 'Stealth (Dex)', 'dexterity')}
              {skillRow('survival', 'Survival (Wis)', 'wisdom')}
            </CardContent>
          </Card>
        </div>

        {/* Column 2: Combat Stats */}
        <div className="space-y-8">
          <Card className="card-epic">
            <CardHeader>
              <CardTitle className="text-lg text-epic font-serif flex items-center justify-center">
                <span className="mr-2 text-2xl animate-pulse-slow">⚔️</span>
                Battle Statistics
                <span className="ml-2 text-2xl animate-pulse-slow">🛡️</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <label className="block text-xs font-medium mb-2 text-amber-200 font-serif">ARMOR CLASS</label>
                  <div className="combat-stat ac relative">
                    <div className="absolute top-2 right-2 text-2xl opacity-30 animate-float">🛡️</div>
                    <Input
                      type="number"
                      min="1"
                      value={character.armorClass}
                      onChange={(e) => handleFieldChange('armorClass', parseInt(e.target.value))}
                      readOnly={readOnly}
                      className="input-epic text-center text-2xl font-bold h-16 bg-transparent border-0"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <label className="block text-xs font-medium mb-2 text-amber-200 font-serif">INITIATIVE</label>
                  <div className="combat-stat relative">
                    <div className="absolute top-2 right-2 text-2xl opacity-30 animate-float">⚡</div>
                    <Input
                      type="number"
                      value={character.initiative}
                      onChange={(e) => handleFieldChange('initiative', parseInt(e.target.value))}
                      readOnly={readOnly}
                      className="input-epic text-center text-2xl font-bold h-16 bg-transparent border-0"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <label className="block text-xs font-medium mb-2 text-amber-200 font-serif">SPEED</label>
                  <div className="combat-stat relative">
                    <div className="absolute top-2 right-2 text-2xl opacity-30 animate-float">💨</div>
                    <Input
                      type="number"
                      min="0"
                      value={character.speed}
                      onChange={(e) => handleFieldChange('speed', parseInt(e.target.value))}
                      readOnly={readOnly}
                      className="input-epic text-center text-2xl font-bold h-16 bg-transparent border-0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-2 text-amber-200 font-serif text-center">HIT POINT MAXIMUM</label>
                <div className="combat-stat hp relative">
                  <div className="absolute top-2 right-2 text-3xl opacity-30 animate-pulse-slow">❤️</div>
                  <Input
                    type="number"
                    min="1"
                    value={character.hitPointMaximum}
                    onChange={(e) => handleFieldChange('hitPointMaximum', parseInt(e.target.value))}
                    readOnly={readOnly}
                    className="input-epic text-center text-3xl font-bold h-20 bg-transparent border-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-2 text-amber-200 font-serif text-center">CURRENT HIT POINTS</label>
                <div className="relative">
                  <div className="border-4 border-red-500/50 rounded-lg p-6 bg-gradient-to-br from-red-900/30 to-red-800/30 shadow-inner">
                    <div className="absolute top-2 right-2 text-3xl opacity-30 animate-pulse">💖</div>
                    <Input
                      type="number"
                      min="0"
                      value={character.currentHitPoints}
                      onChange={(e) => handleFieldChange('currentHitPoints', parseInt(e.target.value))}
                      readOnly={readOnly}
                      className="text-center text-4xl font-bold bg-transparent border-0 text-red-100 p-0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-2 text-amber-200 font-serif text-center">TEMPORARY HIT POINTS</label>
                <div className="relative">
                  <div className="border-4 border-blue-500/50 rounded-lg p-4 bg-gradient-to-br from-blue-900/30 to-blue-800/30">
                    <div className="absolute top-2 right-2 text-2xl opacity-30 animate-float">✨</div>
                    <Input
                      type="number"
                      min="0"
                      value={character.temporaryHitPoints}
                      onChange={(e) => handleFieldChange('temporaryHitPoints', parseInt(e.target.value))}
                      readOnly={readOnly}
                      className="text-center text-2xl font-bold bg-transparent border-0 text-blue-100 p-0"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1 text-amber-200 font-serif">HIT DICE</label>
                  <Input
                    value={character.hitDice || ''}
                    onChange={(e) => handleFieldChange('hitDice', e.target.value)}
                    readOnly={readOnly}
                    placeholder="1d8"
                    className="input-epic font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-amber-200 font-serif">TOTAL</label>
                  <div className="border-2 border-yellow-500/50 rounded-lg p-2 text-center bg-gradient-to-br from-yellow-900/30 to-yellow-800/30">
                    <span className="text-xl font-bold text-yellow-100">{character.level}</span>
                  </div>
                </div>
              </div>

              {/* Death Saves */}
              <div className="p-4 border-2 border-gray-500/50 rounded-lg bg-gradient-to-br from-gray-900/50 to-black/50">
                <label className="block text-sm font-medium mb-3 text-amber-200 font-serif text-center">DEATH SAVES</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-4">
                    <span className="text-sm w-20 text-green-300 font-serif">Successes</span>
                    {[1, 2, 3].map(i => (
                      <label key={`success-${i}`} className="cursor-pointer">
                        <input
                          type="radio"
                          name="deathSaveSuccesses"
                          checked={character.deathSaveSuccesses >= i}
                          onChange={() => handleFieldChange('deathSaveSuccesses', i)}
                          disabled={readOnly}
                          className="sr-only"
                        />
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                          character.deathSaveSuccesses >= i 
                            ? "bg-green-500 border-green-400 shadow-lg shadow-green-500/50" 
                            : "border-green-500/50 hover:border-green-400"
                        )}>
                          {character.deathSaveSuccesses >= i && <span className="text-white text-sm">✓</span>}
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <span className="text-sm w-20 text-red-300 font-serif">Failures</span>
                    {[1, 2, 3].map(i => (
                      <label key={`failure-${i}`} className="cursor-pointer">
                        <input
                          type="radio"
                          name="deathSaveFailures"
                          checked={character.deathSaveFailures >= i}
                          onChange={() => handleFieldChange('deathSaveFailures', i)}
                          disabled={readOnly}
                          className="sr-only"
                        />
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                          character.deathSaveFailures >= i 
                            ? "bg-red-500 border-red-400 shadow-lg shadow-red-500/50" 
                            : "border-red-500/50 hover:border-red-400"
                        )}>
                          {character.deathSaveFailures >= i && <span className="text-white text-sm">✗</span>}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 3: Features & Equipment */}
        <div className="space-y-8">
          <Card className="card-legendary">
            <CardHeader>
              <CardTitle className="text-lg text-legendary font-serif flex items-center">
                <span className="mr-2 text-xl animate-pulse-slow">📜</span>
                Epic Features & Traits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={character.featuresAndTraits || ''}
                onChange={(e) => handleFieldChange('featuresAndTraits', e.target.value)}
                readOnly={readOnly}
                className="w-full h-40 p-4 bg-slate-800/50 border-2 border-purple-500/30 rounded-lg resize-none text-amber-100 font-serif focus:border-purple-400/70 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm transition-all duration-300"
                placeholder="Describe your character's legendary features, racial traits, and class abilities..."
              />
            </CardContent>
          </Card>

          <Card className="card-epic">
            <CardHeader>
              <CardTitle className="text-lg text-epic font-serif flex items-center">
                <span className="mr-2 text-xl animate-pulse-slow">⚔️</span>
                Combat Arsenal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-amber-200/60">
                <div className="text-4xl mb-3 animate-float">⚔️</div>
                <p className="font-serif italic">
                  Epic attack and spellcasting system
                  <br />
                  <span className="text-sm">Coming in next update!</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-epic">
            <CardHeader>
              <CardTitle className="text-lg text-epic font-serif flex items-center">
                <span className="mr-2 text-xl animate-pulse-slow">🎒</span>
                Legendary Equipment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-amber-200/60">
                <div className="text-4xl mb-3 animate-float">💰</div>
                <p className="font-serif italic">
                  Epic equipment management
                  <br />
                  <span className="text-sm">Coming in next update!</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}