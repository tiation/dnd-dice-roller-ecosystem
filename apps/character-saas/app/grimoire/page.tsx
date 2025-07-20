'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, BookOpen, Sparkles, Zap, Shield, Heart, Eye, Wind, Flame, Snowflake, Leaf } from 'lucide-react'

type SpellSchool = 'Abjuration' | 'Conjuration' | 'Divination' | 'Enchantment' | 'Evocation' | 'Illusion' | 'Necromancy' | 'Transmutation'
type SpellLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type SpellClass = 'Bard' | 'Cleric' | 'Druid' | 'Paladin' | 'Ranger' | 'Sorcerer' | 'Warlock' | 'Wizard' | 'Artificer'

interface Spell {
  name: string
  level: SpellLevel
  school: SpellSchool
  castingTime: string
  range: string
  components: string
  duration: string
  classes: SpellClass[]
  description: string
  higherLevel?: string
  ritual?: boolean
  concentration?: boolean
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
}

const spellDatabase: Spell[] = [
  {
    name: "Eldritch Blast",
    level: 0,
    school: "Evocation",
    castingTime: "1 action",
    range: "120 feet",
    components: "V, S",
    duration: "Instantaneous",
    classes: ["Warlock"],
    description: "A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage.",
    higherLevel: "This spell creates more than one beam when you reach higher levels: two beams at 5th level, three beams at 11th level, and four beams at 17th level.",
    rarity: "epic"
  },
  {
    name: "Fireball",
    level: 3,
    school: "Evocation", 
    castingTime: "1 action",
    range: "150 feet",
    components: "V, S, M (a tiny ball of bat guano and sulfur)",
    duration: "Instantaneous",
    classes: ["Sorcerer", "Wizard"],
    description: "A bright flash of light streaks toward a point within range and explodes in a roar of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.",
    higherLevel: "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.",
    rarity: "legendary"
  },
  {
    name: "Healing Word",
    level: 1,
    school: "Evocation",
    castingTime: "1 bonus action", 
    range: "60 feet",
    components: "V",
    duration: "Instantaneous",
    classes: ["Bard", "Cleric", "Druid"],
    description: "A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier.",
    higherLevel: "When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d4 for each slot level above 1st.",
    rarity: "common"
  },
  {
    name: "Shield",
    level: 1,
    school: "Abjuration",
    castingTime: "1 reaction",
    range: "Self",
    components: "V, S",
    duration: "1 round",
    classes: ["Sorcerer", "Wizard"],
    description: "An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile.",
    rarity: "uncommon"
  },
  {
    name: "Counterspell",
    level: 3,
    school: "Abjuration",
    castingTime: "1 reaction",
    range: "60 feet", 
    components: "S",
    duration: "Instantaneous",
    classes: ["Sorcerer", "Warlock", "Wizard"],
    description: "You attempt to interrupt a creature in the process of casting a spell. Make an ability check using your spellcasting ability. The DC equals 10 + the spell's level.",
    higherLevel: "When you cast this spell using a spell slot of 4th level or higher, the interrupted spell has no effect if its level is less than or equal to the level of the spell slot you used.",
    rarity: "rare"
  },
  {
    name: "Prestidigitation",
    level: 0,
    school: "Transmutation",
    castingTime: "1 action",
    range: "10 feet",
    components: "V, S",
    duration: "Up to 1 hour",
    classes: ["Bard", "Sorcerer", "Warlock", "Wizard"],
    description: "This spell is a minor magical trick that novice spellcasters use for practice. You create one of several magical effects within range.",
    rarity: "common"
  },
  {
    name: "Dimension Door",
    level: 4,
    school: "Conjuration",
    castingTime: "1 action", 
    range: "500 feet",
    components: "V",
    duration: "Instantaneous",
    classes: ["Bard", "Sorcerer", "Warlock", "Wizard"],
    description: "You teleport yourself from your current location to any other spot within range. You arrive at exactly the spot desired.",
    rarity: "rare"
  },
  {
    name: "Time Stop",
    level: 9,
    school: "Transmutation",
    castingTime: "1 action",
    range: "Self",
    components: "V",
    duration: "Instantaneous",
    classes: ["Sorcerer", "Wizard"],
    description: "You briefly stop the flow of time for everyone but yourself. No time passes for other creatures, while you take 1d4 + 1 turns in a row.",
    rarity: "legendary"
  }
]

const schoolIcons: Record<SpellSchool, React.ReactNode> = {
  'Abjuration': <Shield className="h-4 w-4" />,
  'Conjuration': <Sparkles className="h-4 w-4" />,
  'Divination': <Eye className="h-4 w-4" />,
  'Enchantment': <Heart className="h-4 w-4" />,
  'Evocation': <Zap className="h-4 w-4" />,
  'Illusion': <Wind className="h-4 w-4" />,
  'Necromancy': <BookOpen className="h-4 w-4" />,
  'Transmutation': <Leaf className="h-4 w-4" />
}

const schoolColors: Record<SpellSchool, string> = {
  'Abjuration': 'border-blue-400/50 bg-blue-900/20',
  'Conjuration': 'border-purple-400/50 bg-purple-900/20',
  'Divination': 'border-cyan-400/50 bg-cyan-900/20', 
  'Enchantment': 'border-pink-400/50 bg-pink-900/20',
  'Evocation': 'border-red-400/50 bg-red-900/20',
  'Illusion': 'border-indigo-400/50 bg-indigo-900/20',
  'Necromancy': 'border-gray-400/50 bg-gray-900/20',
  'Transmutation': 'border-green-400/50 bg-green-900/20'
}

const rarityColors: Record<string, string> = {
  common: 'border-gray-400/30 bg-gray-800/30',
  uncommon: 'border-green-400/40 bg-green-900/20',
  rare: 'border-blue-400/50 bg-blue-900/30', 
  epic: 'border-purple-400/60 bg-purple-900/40',
  legendary: 'border-yellow-400/70 bg-yellow-900/50'
}

export default function GrimoirePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSchool, setSelectedSchool] = useState<SpellSchool | 'all'>('all')
  const [selectedLevel, setSelectedLevel] = useState<SpellLevel | 'all'>('all')
  const [selectedClass, setSelectedClass] = useState<SpellClass | 'all'>('all')
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null)

  const filteredSpells = useMemo(() => {
    return spellDatabase.filter(spell => {
      const matchesSearch = spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          spell.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSchool = selectedSchool === 'all' || spell.school === selectedSchool
      const matchesLevel = selectedLevel === 'all' || spell.level === selectedLevel
      const matchesClass = selectedClass === 'all' || spell.classes.includes(selectedClass)
      
      return matchesSearch && matchesSchool && matchesLevel && matchesClass
    })
  }, [searchTerm, selectedSchool, selectedLevel, selectedClass])

  const SpellCard = ({ spell }: { spell: Spell }) => (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${rarityColors[spell.rarity]} ${schoolColors[spell.school]} border-2 backdrop-blur-sm`}
      onClick={() => setSelectedSpell(spell)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-amber-100 font-serif">{spell.name}</CardTitle>
          <div className="flex items-center space-x-1">
            {schoolIcons[spell.school]}
            <Badge variant="outline" className="text-xs">
              {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-amber-200/70">
          {spell.school} • {spell.castingTime}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-amber-100/80 line-clamp-3">
          {spell.description}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {spell.classes.slice(0, 3).map(cls => (
            <Badge key={cls} variant="secondary" className="text-xs">
              {cls}
            </Badge>
          ))}
          {spell.classes.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{spell.classes.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const SpellDetail = ({ spell }: { spell: Spell }) => (
    <Card className={`${rarityColors[spell.rarity]} ${schoolColors[spell.school]} border-2 backdrop-blur-sm`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-legendary font-serif mb-2">{spell.name}</CardTitle>
            <CardDescription className="text-lg text-amber-200">
              {spell.level === 0 ? 'Cantrip' : `${spell.level}${spell.level === 1 ? 'st' : spell.level === 2 ? 'nd' : spell.level === 3 ? 'rd' : 'th'}-level`} {spell.school.toLowerCase()}
            </CardDescription>
          </div>
          <div className="text-right">
            {schoolIcons[spell.school]}
            <Badge className={`mt-1 ${spell.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400' : ''}`}>
              {spell.rarity}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-amber-300 mb-1">Casting Time</h4>
            <p className="text-amber-100">{spell.castingTime}</p>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300 mb-1">Range</h4>
            <p className="text-amber-100">{spell.range}</p>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300 mb-1">Components</h4>
            <p className="text-amber-100">{spell.components}</p>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300 mb-1">Duration</h4>
            <p className="text-amber-100">{spell.duration}</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-amber-300 mb-2">Description</h4>
          <p className="text-amber-100/90 leading-relaxed">{spell.description}</p>
        </div>

        {spell.higherLevel && (
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">At Higher Levels</h4>
            <p className="text-amber-100/90">{spell.higherLevel}</p>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-amber-300 mb-2">Classes</h4>
          <div className="flex flex-wrap gap-2">
            {spell.classes.map(cls => (
              <Badge key={cls} variant="outline" className="border-amber-400/30 text-amber-200">
                {cls}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">📜</div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: '2s' }}>🔮</div>
        <div className="absolute bottom-40 right-10 animate-float" style={{ animationDelay: '0.5s' }}>📚</div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-legendary mb-4 title-ancient animate-glow">
            ⚡ Arcane Grimoire ⚡
          </h1>
          <p className="text-xl text-amber-200/80 font-serif max-w-3xl mx-auto">
            Discover the ancient secrets of magic within these mystical pages. Search through countless spells, 
            from simple cantrips to legendary incantations that can reshape reality itself.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-4 w-4" />
            <Input
              placeholder="Search spells by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-amber-400/30 text-amber-100 placeholder-amber-300/50"
            />
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value as SpellSchool | 'all')}
              className="px-3 py-2 bg-slate-800/50 border border-amber-400/30 rounded-md text-amber-100"
            >
              <option value="all">All Schools</option>
              {Object.keys(schoolIcons).map(school => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value === 'all' ? 'all' : parseInt(e.target.value) as SpellLevel)}
              className="px-3 py-2 bg-slate-800/50 border border-amber-400/30 rounded-md text-amber-100"
            >
              <option value="all">All Levels</option>
              <option value={0}>Cantrip</option>
              {[1,2,3,4,5,6,7,8,9].map(level => (
                <option key={level} value={level}>Level {level}</option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as SpellClass | 'all')}
              className="px-3 py-2 bg-slate-800/50 border border-amber-400/30 rounded-md text-amber-100"
            >
              <option value="all">All Classes</option>
              {['Artificer', 'Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'].map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 text-center">
          <p className="text-amber-200/70">
            Found {filteredSpells.length} spell{filteredSpells.length !== 1 ? 's' : ''} in the ancient tomes
          </p>
        </div>

        {/* Spell Grid and Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Spell List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-epic mb-4 font-serif">Spell Compendium</h2>
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
              {filteredSpells.map((spell, index) => (
                <SpellCard key={`${spell.name}-${index}`} spell={spell} />
              ))}
            </div>
          </div>

          {/* Spell Detail */}
          <div className="sticky top-8">
            <h2 className="text-2xl font-bold text-epic mb-4 font-serif">Spell Details</h2>
            {selectedSpell ? (
              <SpellDetail spell={selectedSpell} />
            ) : (
              <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-amber-400/50 mx-auto mb-4" />
                  <p className="text-amber-200/70 text-lg font-serif">
                    Select a spell from the grimoire to view its mystical details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}