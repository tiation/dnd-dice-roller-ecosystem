'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import CharacterSheet from '@/components/CharacterSheet'
import { Character } from '@/types/character'
import { ArrowLeft, Edit, FileText, Share2 } from 'lucide-react'

// Mock character data - in real app, this would come from API
const getMockCharacter = (id: string): Character | null => {
  const characters = [
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
      backstory: 'A forest ranger who protects the ancient woods from those who would harm it. Aria has spent over a century learning the secrets of the wilderness.',
      personalityTraits: 'I am always calm and collected, even in the face of danger.',
      ideals: 'Nature must be protected at all costs from civilization\'s encroachment.',
      bonds: 'The forest is my home and family. I will defend it with my life.',
      flaws: 'I have trouble trusting city folk and their "civilized" ways.',
      featuresAndTraits: `**Darkvision.** You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.

**Keen Senses.** You have proficiency in the Perception skill.

**Favored Enemy (Orcs).** You have advantage on Wisdom (Survival) checks to track orcs, as well as on Intelligence checks to recall information about them.

**Natural Explorer (Forest).** You are particularly familiar with forest environments and are adept at traveling and surviving in such regions.

**Fighting Style (Archery).** You gain a +2 bonus to attack rolls you make with ranged weapons.

**Spellcasting.** You can cast ranger spells. Your spellcasting ability is Wisdom.`,
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
      backstory: 'A veteran soldier seeking redemption for past mistakes made in war.',
      personalityTraits: 'I face problems head-on. A simple, direct solution is the best path to success.',
      ideals: 'Honor and duty above all. My word is my bond.',
      bonds: 'My old unit means everything to me. I would die for them.',
      flaws: 'I have a hard time trusting others after being betrayed in battle.',
      featuresAndTraits: `**Darkvision.** You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.

**Dwarven Resilience.** You have advantage on saving throws against poison, and you have resistance against poison damage.

**Fighting Style (Defense).** While you are wearing armor, you gain a +1 bonus to AC.

**Second Wind.** You can use a bonus action to regain hit points equal to 1d10 + 3.

**Action Surge.** You can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action.`,
    }
  ]

  return characters.find(char => char.id === id) || null
}

interface Props {
  params: {
    id: string
  }
}

export default function CharacterViewPage({ params }: Props) {
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundCharacter = getMockCharacter(params.id)
      if (foundCharacter) {
        setCharacter(foundCharacter)
      } else {
        setError('Character not found')
      }
      setLoading(false)
    }, 500)
  }, [params.id])

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert('PDF export functionality will be implemented soon!')
  }

  const handleShare = () => {
    // TODO: Implement sharing functionality
    alert('Character sharing functionality will be implemented soon!')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-10 w-20 bg-muted rounded animate-pulse"></div>
            <div className="h-10 w-20 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-96 bg-muted rounded animate-pulse"></div>
      </div>
    )
  }

  if (error || !character) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Character Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The character you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild>
          <Link href="/characters">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Characters
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/characters">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{character.characterName}</h1>
            <p className="text-muted-foreground">
              Level {character.level} {character.race} {character.class}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button size="sm" asChild>
            <Link href={`/characters/${character.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Character Sheet */}
      <CharacterSheet character={character} readOnly={true} />
    </div>
  )
}