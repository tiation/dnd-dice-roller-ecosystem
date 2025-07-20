'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, BookOpen, Star, Zap, Plus, Trash2, Eye } from 'lucide-react'

interface PreparedSpell {
  name: string
  level: number
  school: string
  prepared: boolean
  castingTime: string
  range: string
  components: string
  duration: string
  description: string
}

interface SpellSlot {
  level: number
  total: number
  used: number
}

const sampleSpells: PreparedSpell[] = [
  {
    name: "Magic Missile",
    level: 1,
    school: "Evocation",
    prepared: true,
    castingTime: "1 action",
    range: "120 feet",
    components: "V, S",
    duration: "Instantaneous",
    description: "You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range."
  },
  {
    name: "Fireball",
    level: 3,
    school: "Evocation", 
    prepared: true,
    castingTime: "1 action",
    range: "150 feet",
    components: "V, S, M",
    duration: "Instantaneous",
    description: "A bright flash of light streaks toward a point within range and explodes in a roar of flame."
  },
  {
    name: "Shield",
    level: 1,
    school: "Abjuration",
    prepared: true,
    castingTime: "1 reaction",
    range: "Self",
    components: "V, S",
    duration: "1 round",
    description: "An invisible barrier of magical force appears and protects you."
  },
  {
    name: "Counterspell",
    level: 3,
    school: "Abjuration",
    prepared: false,
    castingTime: "1 reaction",
    range: "60 feet",
    components: "S",
    duration: "Instantaneous", 
    description: "You attempt to interrupt a creature in the process of casting a spell."
  }
]

export default function SpellManager() {
  const [spells, setSpells] = useState<PreparedSpell[]>(sampleSpells)
  const [spellSlots, setSpellSlots] = useState<SpellSlot[]>([
    { level: 1, total: 4, used: 1 },
    { level: 2, total: 3, used: 0 },
    { level: 3, total: 3, used: 1 },
    { level: 4, total: 1, used: 0 },
    { level: 5, total: 1, used: 0 }
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all')
  const [selectedSpell, setSelectedSpell] = useState<PreparedSpell | null>(null)

  const filteredSpells = useMemo(() => {
    return spells.filter(spell => {
      const matchesSearch = spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          spell.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLevel = selectedLevel === 'all' || spell.level === selectedLevel
      
      return matchesSearch && matchesLevel
    })
  }, [spells, searchTerm, selectedLevel])

  const preparedSpells = spells.filter(spell => spell.prepared)
  const knownSpells = spells.filter(spell => !spell.prepared)

  const toggleSpellPreparation = (spellName: string) => {
    setSpells(prev => prev.map(spell => 
      spell.name === spellName 
        ? { ...spell, prepared: !spell.prepared }
        : spell
    ))
  }

  const useSpellSlot = (level: number) => {
    setSpellSlots(prev => prev.map(slot => 
      slot.level === level && slot.used < slot.total
        ? { ...slot, used: slot.used + 1 }
        : slot
    ))
  }

  const restoreSpellSlot = (level: number) => {
    setSpellSlots(prev => prev.map(slot => 
      slot.level === level && slot.used > 0
        ? { ...slot, used: slot.used - 1 }
        : slot
    ))
  }

  const longRest = () => {
    setSpellSlots(prev => prev.map(slot => ({ ...slot, used: 0 })))
  }

  const SpellCard = ({ spell }: { spell: PreparedSpell }) => (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 backdrop-blur-sm ${
        spell.prepared 
          ? 'border-yellow-400/50 bg-yellow-900/20' 
          : 'border-purple-400/30 bg-purple-900/10'
      }`}
      onClick={() => setSelectedSpell(spell)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-amber-100 font-serif">{spell.name}</CardTitle>
            <CardDescription className="text-amber-200/70">
              {spell.school} • {spell.castingTime}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
            </Badge>
            {spell.prepared && (
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-amber-100/80 line-clamp-2 mb-3">
          {spell.description}
        </p>
        <Button
          size="sm"
          variant={spell.prepared ? "destructive" : "default"}
          onClick={(e) => {
            e.stopPropagation()
            toggleSpellPreparation(spell.name)
          }}
          className="w-full"
        >
          {spell.prepared ? (
            <>
              <Trash2 className="h-3 w-3 mr-1" />
              Unprepare
            </>
          ) : (
            <>
              <Plus className="h-3 w-3 mr-1" />
              Prepare
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )

  const SpellDetail = ({ spell }: { spell: PreparedSpell }) => (
    <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-legendary font-serif mb-2">{spell.name}</CardTitle>
            <CardDescription className="text-lg text-amber-200">
              {spell.level === 0 ? 'Cantrip' : `${spell.level}${spell.level === 1 ? 'st' : spell.level === 2 ? 'nd' : spell.level === 3 ? 'rd' : 'th'}-level`} {spell.school.toLowerCase()}
            </CardDescription>
          </div>
          <div className="text-right">
            {spell.prepared && (
              <Star className="h-6 w-6 text-yellow-400 fill-current mb-2" />
            )}
            <Badge className="bg-purple-500/20 text-purple-300">
              {spell.school}
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

        {spell.level > 0 && (
          <div className="flex space-x-3 pt-4">
            <Button 
              onClick={() => useSpellSlot(spell.level)}
              className="btn-legendary flex-1"
            >
              <Zap className="h-4 w-4 mr-2" />
              Cast Spell
            </Button>
            <Button 
              onClick={() => toggleSpellPreparation(spell.name)}
              variant="outline" 
              className="border-amber-400/50 text-amber-300 hover:bg-amber-500/10"
            >
              {spell.prepared ? 'Unprepare' : 'Prepare'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-legendary mb-2 title-ancient animate-glow">
          ⚡ Spell Manager ⚡
        </h2>
        <p className="text-lg text-amber-200/80 font-serif">
          Manage your magical arsenal with precision and power
        </p>
      </div>

      {/* Spell Slots */}
      <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-epic font-serif flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Spell Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 mb-4">
            {spellSlots.map((slot) => (
              <div key={slot.level} className="text-center">
                <div className="text-amber-200 font-serif mb-2">Level {slot.level}</div>
                <div className="flex flex-col space-y-1">
                  {Array.from({ length: slot.total }, (_, i) => (
                    <div
                      key={i}
                      className={`h-6 w-full rounded border-2 transition-colors ${
                        i < slot.used 
                          ? 'bg-red-500/50 border-red-400' 
                          : 'bg-blue-500/50 border-blue-400'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-amber-200/60 mt-1">
                  {slot.total - slot.used}/{slot.total}
                </div>
                <div className="flex space-x-1 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => restoreSpellSlot(slot.level)}
                    disabled={slot.used === 0}
                    className="flex-1 text-xs"
                  >
                    +
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => useSpellSlot(slot.level)}
                    disabled={slot.used >= slot.total}
                    className="flex-1 text-xs"
                  >
                    -
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={longRest} className="w-full btn-legendary">
            🌙 Long Rest (Restore All Slots)
          </Button>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-4 w-4" />
          <Input
            placeholder="Search spells..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-amber-400/30 text-amber-100 placeholder-amber-300/50"
          />
        </div>

        <div className="flex justify-center">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="px-3 py-2 bg-slate-800/50 border border-amber-400/30 rounded-md text-amber-100"
          >
            <option value="all">All Levels</option>
            <option value={0}>Cantrips</option>
            {[1,2,3,4,5,6,7,8,9].map(level => (
              <option key={level} value={level}>Level {level}</option>
            ))}
          </select>
        </div>
      </div>

      <Tabs defaultValue="prepared" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-slate-800/50 border border-amber-400/30">
          <TabsTrigger 
            value="prepared" 
            className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300"
          >
            Prepared ({preparedSpells.length})
          </TabsTrigger>
          <TabsTrigger 
            value="known" 
            className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300"
          >
            Known ({knownSpells.length})
          </TabsTrigger>
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300"
          >
            All ({filteredSpells.length})
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Spell Lists */}
          <div className="space-y-4">
            <TabsContent value="prepared">
              <div className="space-y-4">
                {preparedSpells.filter(spell => 
                  (selectedLevel === 'all' || spell.level === selectedLevel) &&
                  (spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   spell.description.toLowerCase().includes(searchTerm.toLowerCase()))
                ).map((spell) => (
                  <SpellCard key={`prepared-${spell.name}`} spell={spell} />
                ))}
                {preparedSpells.length === 0 && (
                  <Card className="border-2 border-amber-400/30 bg-slate-800/50">
                    <CardContent className="p-8 text-center">
                      <Star className="h-12 w-12 text-amber-400/50 mx-auto mb-2" />
                      <p className="text-amber-200/70">No spells prepared</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="known">
              <div className="space-y-4">
                {knownSpells.filter(spell => 
                  (selectedLevel === 'all' || spell.level === selectedLevel) &&
                  (spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   spell.description.toLowerCase().includes(searchTerm.toLowerCase()))
                ).map((spell) => (
                  <SpellCard key={`known-${spell.name}`} spell={spell} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="all">
              <div className="space-y-4">
                {filteredSpells.map((spell) => (
                  <SpellCard key={`all-${spell.name}`} spell={spell} />
                ))}
              </div>
            </TabsContent>
          </div>

          {/* Spell Detail */}
          <div className="sticky top-8">
            {selectedSpell ? (
              <SpellDetail spell={selectedSpell} />
            ) : (
              <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-amber-400/50 mx-auto mb-4" />
                  <p className="text-amber-200/70 text-lg font-serif">
                    Select a spell to view its mystical details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  )
}