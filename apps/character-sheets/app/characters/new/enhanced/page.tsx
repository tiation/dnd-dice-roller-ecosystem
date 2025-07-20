'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CharacterPortraitGenerator from '@/components/CharacterPortraitGenerator'
import { Character } from '@/types/character'
import { User, Sparkles, FileText, Image, Wand2 } from 'lucide-react'

export default function EnhancedCharacterCreationPage() {
  const [character, setCharacter] = useState<Partial<Character>>({
    characterName: '',
    class: '',
    race: '',
    background: '',
    level: 1,
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10
  })

  const [currentTab, setCurrentTab] = useState('basics')

  const handleCharacterUpdate = (field: string, value: any) => {
    setCharacter(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">⚔️</div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>🎨</div>
        <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: '2s' }}>✨</div>
        <div className="absolute bottom-40 right-10 animate-float" style={{ animationDelay: '0.5s' }}>📜</div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-legendary mb-4 title-ancient animate-glow">
            ✨ Enhanced Character Forge ✨
          </h1>
          <p className="text-xl text-amber-200/80 font-serif max-w-3xl mx-auto">
            Create your legendary hero with advanced tools including AI-powered portrait generation, 
            spell management, and immersive character building features.
          </p>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-8 bg-slate-800/50 border border-amber-400/30">
            <TabsTrigger 
              value="basics" 
              className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300"
            >
              <User className="h-4 w-4 mr-2" />
              Basics
            </TabsTrigger>
            <TabsTrigger 
              value="portrait" 
              className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300"
            >
              <Image className="h-4 w-4 mr-2" />
              Portrait
            </TabsTrigger>
            <TabsTrigger 
              value="spells" 
              className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Spells
            </TabsTrigger>
            <TabsTrigger 
              value="details" 
              className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300"
            >
              <FileText className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
          </TabsList>

          {/* Basic Character Info */}
          <TabsContent value="basics">
            <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-epic font-serif flex items-center">
                  <User className="h-6 w-6 mr-2" />
                  Character Fundamentals
                </CardTitle>
                <CardDescription className="text-amber-200/70">
                  Define your hero's core identity and abilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Character Name and Class */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-200 font-serif">
                      Character Name
                    </label>
                    <Input
                      value={character.characterName || ''}
                      onChange={(e) => handleCharacterUpdate('characterName', e.target.value)}
                      placeholder="Enter your hero's name..."
                      className="input-epic h-12 text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-200 font-serif">
                      Class
                    </label>
                    <select
                      value={character.class || ''}
                      onChange={(e) => handleCharacterUpdate('class', e.target.value)}
                      className="w-full h-12 px-3 bg-slate-700/50 border-2 border-amber-400/30 rounded-md text-amber-100"
                    >
                      <option value="">Select a class...</option>
                      <option value="Artificer">Artificer</option>
                      <option value="Barbarian">Barbarian</option>
                      <option value="Bard">Bard</option>
                      <option value="Cleric">Cleric</option>
                      <option value="Druid">Druid</option>
                      <option value="Fighter">Fighter</option>
                      <option value="Monk">Monk</option>
                      <option value="Paladin">Paladin</option>
                      <option value="Ranger">Ranger</option>
                      <option value="Rogue">Rogue</option>
                      <option value="Sorcerer">Sorcerer</option>
                      <option value="Warlock">Warlock</option>
                      <option value="Wizard">Wizard</option>
                    </select>
                  </div>
                </div>

                {/* Race and Background */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-200 font-serif">
                      Race
                    </label>
                    <select
                      value={character.race || ''}
                      onChange={(e) => handleCharacterUpdate('race', e.target.value)}
                      className="w-full h-12 px-3 bg-slate-700/50 border-2 border-amber-400/30 rounded-md text-amber-100"
                    >
                      <option value="">Select a race...</option>
                      <option value="Human">Human</option>
                      <option value="Elf">Elf</option>
                      <option value="Dwarf">Dwarf</option>
                      <option value="Halfling">Halfling</option>
                      <option value="Dragonborn">Dragonborn</option>
                      <option value="Gnome">Gnome</option>
                      <option value="Half-Elf">Half-Elf</option>
                      <option value="Half-Orc">Half-Orc</option>
                      <option value="Tiefling">Tiefling</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-200 font-serif">
                      Background
                    </label>
                    <select
                      value={character.background || ''}
                      onChange={(e) => handleCharacterUpdate('background', e.target.value)}
                      className="w-full h-12 px-3 bg-slate-700/50 border-2 border-amber-400/30 rounded-md text-amber-100"
                    >
                      <option value="">Select a background...</option>
                      <option value="Acolyte">Acolyte</option>
                      <option value="Criminal">Criminal</option>
                      <option value="Folk Hero">Folk Hero</option>
                      <option value="Noble">Noble</option>
                      <option value="Sage">Sage</option>
                      <option value="Soldier">Soldier</option>
                    </select>
                  </div>
                </div>

                {/* Ability Scores */}
                <div>
                  <h3 className="text-lg font-semibold text-amber-200 mb-4 font-serif">Ability Scores</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      { key: 'strength', label: 'STR' },
                      { key: 'dexterity', label: 'DEX' },
                      { key: 'constitution', label: 'CON' },
                      { key: 'intelligence', label: 'INT' },
                      { key: 'wisdom', label: 'WIS' },
                      { key: 'charisma', label: 'CHA' }
                    ].map((ability) => (
                      <div key={ability.key} className="text-center">
                        <label className="block text-xs font-medium mb-2 text-amber-200 font-serif">
                          {ability.label}
                        </label>
                        <Input
                          type="number"
                          min="3"
                          max="20"
                          value={character[ability.key as keyof Character] as number || 10}
                          onChange={(e) => handleCharacterUpdate(ability.key, parseInt(e.target.value))}
                          className="input-epic text-center font-bold text-lg h-12"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button variant="outline" className="border-amber-400/50 text-amber-300">
                    🎲 Roll Random Stats
                  </Button>
                  <Button 
                    onClick={() => setCurrentTab('portrait')}
                    className="btn-legendary"
                  >
                    Continue to Portrait
                    <Wand2 className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portrait Generation */}
          <TabsContent value="portrait">
            <CharacterPortraitGenerator />
          </TabsContent>

          {/* Spell Management */}
          <TabsContent value="spells">
            <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-epic font-serif flex items-center">
                  <Sparkles className="h-6 w-6 mr-2" />
                  Spell Management
                </CardTitle>
                <CardDescription className="text-amber-200/70">
                  Select and manage your character's spells and magical abilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Sparkles className="h-16 w-16 text-amber-400/50 mx-auto mb-4" />
                  <h3 className="text-xl text-amber-200 font-serif mb-2">Spell Management System</h3>
                  <p className="text-amber-200/60 mb-6">
                    Advanced spell management tools coming soon! This will include spell preparation, 
                    slot tracking, and integrated spell effects from our Grimoire.
                  </p>
                  <Button 
                    onClick={() => window.open('/grimoire', '_blank')}
                    className="btn-legendary"
                  >
                    🔮 Explore Grimoire
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional Details */}
          <TabsContent value="details">
            <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-epic font-serif flex items-center">
                  <FileText className="h-6 w-6 mr-2" />
                  Character Details
                </CardTitle>
                <CardDescription className="text-amber-200/70">
                  Add backstory, personality, and additional character information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-amber-400/50 mx-auto mb-4" />
                  <h3 className="text-xl text-amber-200 font-serif mb-2">Advanced Character Details</h3>
                  <p className="text-amber-200/60 mb-6">
                    Enhanced character details including backstory generator, personality traits, 
                    bonds, ideals, and flaws will be available here.
                  </p>
                  <div className="space-x-4">
                    <Button 
                      onClick={() => setCurrentTab('basics')}
                      variant="outline"
                      className="border-amber-400/50 text-amber-300"
                    >
                      ← Back to Basics
                    </Button>
                    <Button className="btn-legendary">
                      🎭 Complete Character Creation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}