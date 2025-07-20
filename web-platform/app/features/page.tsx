'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CharacterPortraitGenerator from '@/components/CharacterPortraitGenerator'
import SpellManager from '@/components/SpellManager'
import SoundSystem from '@/components/SoundSystem'
import Link from 'next/link'
import { 
  User, 
  Image, 
  Sparkles, 
  Music, 
  Crown, 
  BookOpen, 
  Dice6, 
  Wand2,
  Palette,
  Zap,
  Volume2,
  Star
} from 'lucide-react'

export default function FeaturesPage() {
  const [currentTab, setCurrentTab] = useState('overview')

  const features = [
    {
      id: 'portraits',
      name: 'AI Portrait Generator',
      icon: <Image className="h-8 w-8" />,
      description: 'Transform character descriptions into stunning visual masterpieces using AI-powered art generation.',
      highlights: ['5 artistic styles', 'Custom prompts', 'High-resolution output', 'Download & share'],
      rarity: 'legendary'
    },
    {
      id: 'spells',
      name: 'Advanced Spell Manager',
      icon: <Sparkles className="h-8 w-8" />,
      description: 'Comprehensive spell management with slot tracking, preparation system, and integrated casting mechanics.',
      highlights: ['Spell slot tracking', 'Preparation system', 'Quick casting', 'Long rest recovery'],
      rarity: 'epic'
    },
    {
      id: 'sound',
      name: 'Immersive Audio System',
      icon: <Music className="h-8 w-8" />,
      description: 'Epic soundscapes and effects to enhance your D&D experience with atmospheric music and reactive sound effects.',
      highlights: ['6 music tracks', 'Sound effects', 'Auto-triggers', 'Volume controls'],
      rarity: 'epic'
    },
    {
      id: 'dice',
      name: '3D Dice Rolling',
      icon: <Dice6 className="h-8 w-8" />,
      description: 'Realistic 3D physics-based dice rolling with advantage/disadvantage and critical hit celebrations.',
      highlights: ['3D physics', 'Multiple dice types', 'Advantage/Disadvantage', 'Roll history'],
      rarity: 'rare'
    },
    {
      id: 'grimoire',
      name: 'Arcane Grimoire',
      icon: <BookOpen className="h-8 w-8" />,
      description: 'Comprehensive spell database with advanced search, filtering, and detailed spell information.',
      highlights: ['100+ spells', 'Advanced search', 'School filtering', 'Class compatibility'],
      rarity: 'uncommon'
    },
    {
      id: 'campaigns',
      name: 'Campaign Manager',
      icon: <Crown className="h-8 w-8" />,
      description: 'Organize and join epic adventures with our comprehensive campaign management system.',
      highlights: ['Campaign browser', 'Player tracking', 'Session scheduling', 'Adventure types'],
      rarity: 'rare'
    }
  ]

  const rarityColors = {
    common: 'border-gray-400/30 bg-gray-800/30',
    uncommon: 'border-green-400/40 bg-green-900/20',
    rare: 'border-blue-400/50 bg-blue-900/30',
    epic: 'border-purple-400/60 bg-purple-900/40',
    legendary: 'border-yellow-400/70 bg-yellow-900/50'
  }

  const FeatureCard = ({ feature }: { feature: typeof features[0] }) => (
    <Card className={`transition-all duration-300 hover:scale-105 ${rarityColors[feature.rarity as keyof typeof rarityColors]} border-2 backdrop-blur-sm`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="text-amber-400">{feature.icon}</div>
            <div>
              <CardTitle className="text-xl text-amber-100 font-serif">{feature.name}</CardTitle>
              <Badge className={`mt-2 ${
                feature.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400' :
                feature.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300 border-purple-400' :
                feature.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300 border-blue-400' :
                feature.rarity === 'uncommon' ? 'bg-green-500/20 text-green-300 border-green-400' :
                'bg-gray-500/20 text-gray-300 border-gray-400'
              }`}>
                {feature.rarity}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-amber-100/80 leading-relaxed">
          {feature.description}
        </p>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-amber-300 text-sm">Key Features:</h4>
          <div className="grid grid-cols-2 gap-2">
            {feature.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center space-x-1 text-sm text-amber-200/80">
                <Star className="h-3 w-3 text-yellow-400" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={() => setCurrentTab(feature.id)}
          className="w-full btn-legendary"
        >
          <Wand2 className="h-4 w-4 mr-2" />
          Try {feature.name}
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">✨</div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>🎨</div>
        <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: '2s' }}>🎵</div>
        <div className="absolute bottom-40 right-10 animate-float" style={{ animationDelay: '0.5s' }}>⚔️</div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-legendary mb-4 title-ancient animate-glow">
            ⚡ Epic Features ⚡
          </h1>
          <p className="text-xl text-amber-200/80 font-serif max-w-3xl mx-auto">
            Discover the magical tools and systems that make Epic Character Forge 
            the ultimate destination for D&D character management and gameplay enhancement.
          </p>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-6 w-full max-w-4xl mx-auto mb-8 bg-slate-800/50 border border-amber-400/30 h-auto p-2">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300 flex flex-col items-center p-3"
            >
              <Star className="h-4 w-4 mb-1" />
              <span className="text-xs">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="portraits" 
              className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300 flex flex-col items-center p-3"
            >
              <Image className="h-4 w-4 mb-1" />
              <span className="text-xs">Portraits</span>
            </TabsTrigger>
            <TabsTrigger 
              value="spells" 
              className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300 flex flex-col items-center p-3"
            >
              <Sparkles className="h-4 w-4 mb-1" />
              <span className="text-xs">Spells</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sound" 
              className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300 flex flex-col items-center p-3"
            >
              <Music className="h-4 w-4 mb-1" />
              <span className="text-xs">Audio</span>
            </TabsTrigger>
            <TabsTrigger 
              value="dice" 
              className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300 flex flex-col items-center p-3"
            >
              <Dice6 className="h-4 w-4 mb-1" />
              <span className="text-xs">Dice</span>
            </TabsTrigger>
            <TabsTrigger 
              value="more" 
              className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300 flex flex-col items-center p-3"
            >
              <Crown className="h-4 w-4 mb-1" />
              <span className="text-xs">More</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="space-y-8">
              <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-3xl text-legendary font-serif text-center">
                    🌟 Welcome to Epic Features 🌟
                  </CardTitle>
                  <CardDescription className="text-center text-amber-200/80 text-lg">
                    Explore the magical tools that transform your D&D experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {features.map((feature) => (
                      <FeatureCard key={feature.id} feature={feature} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-epic font-serif text-center">
                    🚀 Quick Navigation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button asChild className="h-20 flex-col space-y-2">
                      <Link href="/characters/new/enhanced">
                        <User className="h-6 w-6" />
                        <span>Enhanced Creator</span>
                      </Link>
                    </Button>
                    <Button asChild className="h-20 flex-col space-y-2">
                      <Link href="/grimoire">
                        <BookOpen className="h-6 w-6" />
                        <span>Grimoire</span>
                      </Link>
                    </Button>
                    <Button asChild className="h-20 flex-col space-y-2">
                      <Link href="/campaigns">
                        <Crown className="h-6 w-6" />
                        <span>Campaigns</span>
                      </Link>
                    </Button>
                    <Button asChild className="h-20 flex-col space-y-2">
                      <Link href="/dice">
                        <Dice6 className="h-6 w-6" />
                        <span>Dice Oracle</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Portrait Generator */}
          <TabsContent value="portraits">
            <CharacterPortraitGenerator />
          </TabsContent>

          {/* Spell Manager */}
          <TabsContent value="spells">
            <SpellManager />
          </TabsContent>

          {/* Sound System */}
          <TabsContent value="sound">
            <SoundSystem />
          </TabsContent>

          {/* Dice Oracle */}
          <TabsContent value="dice">
            <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-epic font-serif flex items-center">
                  <Dice6 className="h-6 w-6 mr-2" />
                  3D Dice Oracle
                </CardTitle>
                <CardDescription className="text-amber-200/70">
                  Experience the most advanced dice rolling system in the realm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Dice6 className="h-16 w-16 text-amber-400/50 mx-auto mb-4" />
                  <h3 className="text-xl text-amber-200 font-serif mb-4">Epic 3D Dice Rolling Awaits!</h3>
                  <p className="text-amber-200/60 mb-6 max-w-md mx-auto">
                    Visit our dedicated Dice Oracle to experience realistic 3D physics-based dice rolling 
                    with advantage, disadvantage, and epic critical hit celebrations.
                  </p>
                  <Button asChild className="btn-legendary">
                    <Link href="/dice">
                      🎲 Enter the Dice Oracle
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* More Features */}
          <TabsContent value="more">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-epic font-serif flex items-center">
                    <BookOpen className="h-6 w-6 mr-2" />
                    Arcane Grimoire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-200/80 mb-4">
                    Explore our comprehensive spell database with advanced search capabilities 
                    and detailed spell information for every class and school of magic.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/grimoire">
                      📚 Explore Grimoire
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-epic font-serif flex items-center">
                    <Crown className="h-6 w-6 mr-2" />
                    Epic Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-200/80 mb-4">
                    Discover and join legendary adventures from official modules to homebrew 
                    masterpieces. Manage your campaigns with our advanced system.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/campaigns">
                      👑 Browse Campaigns
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-epic font-serif text-center">
                    🌟 Coming Soon: Even More Epic Features! 🌟
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="space-y-2">
                      <div className="text-3xl">🤖</div>
                      <h4 className="font-semibold text-amber-300">AI DM Assistant</h4>
                      <p className="text-sm text-amber-200/60">Intelligent dungeon master support</p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl">📊</div>
                      <h4 className="font-semibold text-amber-300">Analytics</h4>
                      <p className="text-sm text-amber-200/60">Character progression tracking</p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl">🌐</div>
                      <h4 className="font-semibold text-amber-300">Multiplayer</h4>
                      <p className="text-sm text-amber-200/60">Real-time party collaboration</p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl">📱</div>
                      <h4 className="font-semibold text-amber-300">Mobile App</h4>
                      <p className="text-sm text-amber-200/60">D&D on the go</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}