'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles, Download, RefreshCw, Palette, User, Wand2 } from 'lucide-react'

interface PortraitStyle {
  name: string
  description: string
  example: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
}

const portraitStyles: PortraitStyle[] = [
  {
    name: 'Classic Fantasy',
    description: 'Traditional D&D art style with rich colors and detailed backgrounds',
    example: '🎨',
    rarity: 'common'
  },
  {
    name: 'Anime Style',
    description: 'Japanese anime/manga inspired artwork with expressive features',
    example: '🌸',
    rarity: 'uncommon'
  },
  {
    name: 'Dark Gothic',
    description: 'Moody, atmospheric portraits perfect for dark campaigns',
    example: '🖤',
    rarity: 'rare'
  },
  {
    name: 'Watercolor Dream',
    description: 'Soft, flowing watercolor style with ethereal qualities',
    example: '🌊',
    rarity: 'epic'
  },
  {
    name: 'Divine Radiance',
    description: 'Glowing, celestial artwork fit for legendary heroes',
    example: '✨',
    rarity: 'legendary'
  }
]

const samplePrompts = [
  "A fierce half-orc barbarian with braided hair, tribal tattoos, and a massive two-handed axe, standing in a snowy mountain pass",
  "An elegant elven wizard with silver hair, wearing star-covered robes, holding a crystal staff that glows with arcane energy",
  "A cheerful halfling rogue with curly brown hair, leather armor, and multiple daggers, sneaking through a medieval tavern",
  "A noble human paladin in gleaming plate armor, with a holy symbol glowing on their chest, wielding a blessed sword",
  "A mysterious tiefling warlock with purple skin, glowing eyes, and dark robes, channeling eldritch magic"
]

const rarityColors = {
  common: 'border-gray-400/30 bg-gray-800/30',
  uncommon: 'border-green-400/40 bg-green-900/20',
  rare: 'border-blue-400/50 bg-blue-900/30',
  epic: 'border-purple-400/60 bg-purple-900/40',
  legendary: 'border-yellow-400/70 bg-yellow-900/50'
}

export default function CharacterPortraitGenerator() {
  const [description, setDescription] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<PortraitStyle | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPortrait, setGeneratedPortrait] = useState<string | null>(null)
  const [generationHistory, setGenerationHistory] = useState<Array<{id: string, prompt: string, style: string, timestamp: string}>>([])

  const handleGenerate = async () => {
    if (!description.trim() || !selectedStyle) return
    
    setIsGenerating(true)
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate a placeholder portrait (in a real app, this would call an AI service)
    const portraits = [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face'
    ]
    
    const randomPortrait = portraits[Math.floor(Math.random() * portraits.length)]
    setGeneratedPortrait(randomPortrait)
    
    // Add to history
    const newEntry = {
      id: Date.now().toString(),
      prompt: description,
      style: selectedStyle.name,
      timestamp: new Date().toLocaleString()
    }
    setGenerationHistory(prev => [newEntry, ...prev.slice(0, 9)])
    
    setIsGenerating(false)
  }

  const handleRandomPrompt = () => {
    const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)]
    setDescription(randomPrompt)
  }

  const handleDownload = () => {
    if (generatedPortrait) {
      const link = document.createElement('a')
      link.href = generatedPortrait
      link.download = `character-portrait-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-legendary mb-2 title-ancient animate-glow">
          🎨 Portrait Magic 🎨
        </h2>
        <p className="text-lg text-amber-200/80 font-serif">
          Transform your character descriptions into stunning visual masterpieces
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Description Input */}
          <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-epic font-serif flex items-center">
                <User className="h-5 w-5 mr-2" />
                Character Description
              </CardTitle>
              <CardDescription className="text-amber-200/70">
                Describe your character in detail for the best results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe your character's appearance, clothing, weapons, and setting..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-32 bg-slate-700/50 border-amber-400/30 text-amber-100 placeholder-amber-300/50"
              />
              <Button 
                variant="outline" 
                onClick={handleRandomPrompt}
                className="w-full border-amber-400/50 text-amber-300 hover:bg-amber-500/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Random Character Idea
              </Button>
            </CardContent>
          </Card>

          {/* Style Selection */}
          <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-epic font-serif flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Art Style
              </CardTitle>
              <CardDescription className="text-amber-200/70">
                Choose your preferred artistic style
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {portraitStyles.map((style) => (
                  <div
                    key={style.name}
                    onClick={() => setSelectedStyle(style)}
                    className={`
                      cursor-pointer p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105
                      ${selectedStyle?.name === style.name ? 
                        'border-yellow-400 bg-yellow-500/20' : 
                        `${rarityColors[style.rarity]} hover:border-amber-400/50`
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{style.example}</div>
                        <div>
                          <div className="text-amber-100 font-semibold">{style.name}</div>
                          <div className="text-amber-200/60 text-sm">{style.description}</div>
                        </div>
                      </div>
                      <Badge className={`
                        ${style.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400' :
                          style.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300 border-purple-400' :
                          style.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300 border-blue-400' :
                          style.rarity === 'uncommon' ? 'bg-green-500/20 text-green-300 border-green-400' :
                          'bg-gray-500/20 text-gray-300 border-gray-400'
                        }
                      `}>
                        {style.rarity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate}
            disabled={!description.trim() || !selectedStyle || isGenerating}
            className="w-full btn-legendary text-lg py-6"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Channeling Artistic Magic...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5 mr-2" />
                🎨 Generate Epic Portrait
              </>
            )}
          </Button>
        </div>

        {/* Result Section */}
        <div className="space-y-6">
          {/* Generated Portrait */}
          <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-epic font-serif flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Your Epic Portrait
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedPortrait ? (
                <div className="space-y-4">
                  <div className="relative group">
                    <img 
                      src={generatedPortrait} 
                      alt="Generated character portrait"
                      className="w-full aspect-square object-cover rounded-lg border-2 border-amber-400/50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="flex space-x-3">
                    <Button onClick={handleDownload} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={handleGenerate} variant="outline" className="flex-1 border-amber-400/50 text-amber-300">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center border-2 border-dashed border-amber-400/30 rounded-lg">
                  <div className="text-center space-y-3">
                    <User className="h-16 w-16 text-amber-400/50 mx-auto" />
                    <p className="text-amber-200/70 font-serif">
                      Your epic portrait will appear here
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generation History */}
          {generationHistory.length > 0 && (
            <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-epic font-serif">Recent Creations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {generationHistory.map((entry) => (
                    <div key={entry.id} className="p-3 bg-slate-700/30 rounded-lg border border-amber-400/20">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs">{entry.style}</Badge>
                        <span className="text-xs text-amber-200/50">{entry.timestamp}</span>
                      </div>
                      <p className="text-sm text-amber-100/80 line-clamp-2">{entry.prompt}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}