'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Character } from '@/types/character'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'

// Mock data for demonstration
const mockCharacters: Character[] = [
  {
    id: '1',
    userId: 'user1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    characterName: 'Aria Silverleaf',
    playerName: 'Player One',
    class: 'Ranger',
    level: 5,
    background: 'Outlander',
    race: 'Elf',
    alignment: 'Chaotic Good',
    experience: 6500,
    strength: 14,
    dexterity: 18,
    constitution: 13,
    intelligence: 12,
    wisdom: 16,
    charisma: 10,
    armorClass: 16,
    initiative: 4,
    speed: 30,
    hitPointMaximum: 45,
    currentHitPoints: 45,
    temporaryHitPoints: 0,
    hitDice: '5d10',
    deathSaveSuccesses: 0,
    deathSaveFailures: 0,
    acrobatics: true,
    animalHandling: true,
    arcana: false,
    athletics: false,
    deception: false,
    history: false,
    insight: true,
    intimidation: false,
    investigation: false,
    medicine: false,
    nature: true,
    perception: true,
    performance: false,
    persuasion: false,
    religion: false,
    sleightOfHand: false,
    stealth: true,
    survival: true,
    strengthSave: false,
    dexteritySave: true,
    constitutionSave: false,
    intelligenceSave: false,
    wisdomSave: false,
    charismaSave: false,
    age: '127',
    height: '5\'6"',
    weight: '130 lbs',
    eyes: 'Green',
    skin: 'Fair',
    hair: 'Silver',
    backstory: 'A forest ranger who protects the ancient woods.',
    personalityTraits: 'I am always calm and collected.',
    ideals: 'Nature must be protected at all costs.',
    bonds: 'The forest is my home and family.',
    flaws: 'I have trouble trusting city folk.',
    featuresAndTraits: 'Darkvision, Keen Senses, Favored Enemy: Orcs',
  },
  {
    id: '2',
    userId: 'user1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    characterName: 'Thorin Ironbeard',
    playerName: 'Player One',
    class: 'Fighter',
    level: 3,
    background: 'Soldier',
    race: 'Dwarf',
    alignment: 'Lawful Good',
    experience: 900,
    strength: 16,
    dexterity: 12,
    constitution: 15,
    intelligence: 10,
    wisdom: 13,
    charisma: 8,
    armorClass: 18,
    initiative: 1,
    speed: 25,
    hitPointMaximum: 32,
    currentHitPoints: 28,
    temporaryHitPoints: 0,
    hitDice: '3d10',
    deathSaveSuccesses: 0,
    deathSaveFailures: 0,
    acrobatics: false,
    animalHandling: false,
    arcana: false,
    athletics: true,
    deception: false,
    history: false,
    insight: false,
    intimidation: true,
    investigation: false,
    medicine: false,
    nature: false,
    perception: true,
    performance: false,
    persuasion: false,
    religion: false,
    sleightOfHand: false,
    stealth: false,
    survival: true,
    strengthSave: true,
    dexteritySave: false,
    constitutionSave: true,
    intelligenceSave: false,
    wisdomSave: false,
    charismaSave: false,
    age: '45',
    height: '4\'8"',
    weight: '165 lbs',
    eyes: 'Brown',
    skin: 'Ruddy',
    hair: 'Black',
    backstory: 'A veteran soldier seeking redemption.',
    personalityTraits: 'I face problems head-on.',
    ideals: 'Honor and duty above all.',
    bonds: 'My old unit means everything to me.',
    flaws: 'I have a hard time trusting others.',
    featuresAndTraits: 'Darkvision, Dwarven Resilience, Fighting Style: Defense',
  }
]

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCharacters(mockCharacters)
      setLoading(false)
    }, 1000)
  }, [])

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this character?')) {
      setCharacters(characters.filter(char => char.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Characters</h1>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Create New Character
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Characters</h1>
          <p className="text-muted-foreground">
            Manage your D&D 5e characters
          </p>
        </div>
        <Button asChild>
          <Link href="/characters/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Character
          </Link>
        </Button>
      </div>

      {characters.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">No Characters Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first D&D character to get started!
            </p>
            <Button asChild>
              <Link href="/characters/new">
                <Plus className="h-4 w-4 mr-2" />
                Create New Character
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <Card key={character.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{character.characterName}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Lvl {character.level}
                  </span>
                </CardTitle>
                <CardDescription>
                  {character.race} {character.class}
                  {character.background && ` • ${character.background}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>HP:</span>
                    <span>{character.currentHitPoints}/{character.hitPointMaximum}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AC:</span>
                    <span>{character.armorClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <span>{character.experience} XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{character.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <Link href={`/characters/${character.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <Link href={`/characters/${character.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(character.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}