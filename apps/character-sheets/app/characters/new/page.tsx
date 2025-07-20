'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DND_CLASSES, DND_RACES, DND_ALIGNMENTS } from '@/types/character'

export default function NewCharacter() {
  const [character, setCharacter] = useState({
    characterName: '',
    playerName: '',
    class: '',
    level: 1,
    background: '',
    race: '',
    alignment: '',
    experience: 0,
    
    // Ability Scores
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    
    // Combat Stats
    armorClass: 10,
    initiative: 0,
    speed: 30,
    hitPointMaximum: 1,
    currentHitPoints: 1,
    temporaryHitPoints: 0,
    hitDice: '',
    
    // Death Saves
    deathSaveSuccesses: 0,
    deathSaveFailures: 0,
  })

  const handleInputChange = (field: string, value: string | number) => {
    setCharacter(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement character creation
    console.log('Creating character:', character)
    alert('Character creation will be implemented with database integration')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Create New Character</h1>
        <p className="text-muted-foreground">
          Fill out the form below to create your D&D 5e character
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Core character details and background
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Character Name *</label>
                <Input
                  value={character.characterName}
                  onChange={(e) => handleInputChange('characterName', e.target.value)}
                  placeholder="Enter character name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Player Name</label>
                <Input
                  value={character.playerName}
                  onChange={(e) => handleInputChange('playerName', e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Class *</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={character.class}
                  onChange={(e) => handleInputChange('class', e.target.value)}
                  required
                >
                  <option value="">Select class</option>
                  {DND_CLASSES.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Race *</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={character.race}
                  onChange={(e) => handleInputChange('race', e.target.value)}
                  required
                >
                  <option value="">Select race</option>
                  {DND_RACES.map(race => (
                    <option key={race} value={race}>{race}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Level</label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={character.level}
                  onChange={(e) => handleInputChange('level', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Background</label>
                <Input
                  value={character.background}
                  onChange={(e) => handleInputChange('background', e.target.value)}
                  placeholder="e.g., Acolyte, Criminal, Folk Hero"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Alignment</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={character.alignment}
                  onChange={(e) => handleInputChange('alignment', e.target.value)}
                >
                  <option value="">Select alignment</option>
                  {DND_ALIGNMENTS.map(alignment => (
                    <option key={alignment} value={alignment}>{alignment}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Experience Points</label>
              <Input
                type="number"
                min="0"
                value={character.experience}
                onChange={(e) => handleInputChange('experience', parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ability Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Ability Scores</CardTitle>
            <CardDescription>
              Set your character's six ability scores (8-20)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: 'strength', label: 'Strength' },
                { key: 'dexterity', label: 'Dexterity' },
                { key: 'constitution', label: 'Constitution' },
                { key: 'intelligence', label: 'Intelligence' },
                { key: 'wisdom', label: 'Wisdom' },
                { key: 'charisma', label: 'Charisma' }
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-2">{label}</label>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={character[key as keyof typeof character] as number}
                    onChange={(e) => handleInputChange(key, parseInt(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Combat Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Combat Stats</CardTitle>
            <CardDescription>
              Combat-related statistics and hit points
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Armor Class</label>
                <Input
                  type="number"
                  min="1"
                  value={character.armorClass}
                  onChange={(e) => handleInputChange('armorClass', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Initiative</label>
                <Input
                  type="number"
                  value={character.initiative}
                  onChange={(e) => handleInputChange('initiative', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Speed</label>
                <Input
                  type="number"
                  min="0"
                  value={character.speed}
                  onChange={(e) => handleInputChange('speed', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hit Dice</label>
                <Input
                  value={character.hitDice}
                  onChange={(e) => handleInputChange('hitDice', e.target.value)}
                  placeholder="e.g., 1d8"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hit Point Maximum</label>
                <Input
                  type="number"
                  min="1"
                  value={character.hitPointMaximum}
                  onChange={(e) => handleInputChange('hitPointMaximum', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Current Hit Points</label>
                <Input
                  type="number"
                  min="0"
                  value={character.currentHitPoints}
                  onChange={(e) => handleInputChange('currentHitPoints', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Temporary Hit Points</label>
                <Input
                  type="number"
                  min="0"
                  value={character.temporaryHitPoints}
                  onChange={(e) => handleInputChange('temporaryHitPoints', parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">
            Create Character
          </Button>
        </div>
      </form>
    </div>
  )
}