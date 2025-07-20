'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Volume2, VolumeX, Play, Pause, SkipForward, Shuffle, Music } from 'lucide-react'

interface SoundTrack {
  id: string
  name: string
  category: 'ambient' | 'combat' | 'social' | 'exploration' | 'tavern' | 'dungeon'
  mood: 'epic' | 'mysterious' | 'peaceful' | 'tense' | 'heroic' | 'dark'
  description: string
  duration: string
  url: string // In a real app, these would be actual audio files
  icon: string
}

interface SoundEffect {
  id: string
  name: string
  category: 'dice' | 'spell' | 'combat' | 'ambient' | 'ui'
  description: string
  icon: string
  trigger?: string
}

const musicTracks: SoundTrack[] = [
  {
    id: 'tavern-night',
    name: 'Cozy Tavern Evening',
    category: 'tavern',
    mood: 'peaceful',
    description: 'Warm fireplace crackling with soft lute melodies in the background',
    duration: '12:45',
    url: '/audio/tavern-night.mp3',
    icon: '🍺'
  },
  {
    id: 'epic-battle',
    name: 'Legendary Battle',
    category: 'combat',
    mood: 'epic',
    description: 'Intense orchestral combat music for epic boss fights',
    duration: '8:32',
    url: '/audio/epic-battle.mp3',
    icon: '⚔️'
  },
  {
    id: 'mystical-forest',
    name: 'Enchanted Woodland',
    category: 'exploration',
    mood: 'mysterious',
    description: 'Magical forest ambiance with ethereal melodies',
    duration: '15:20',
    url: '/audio/mystical-forest.mp3',
    icon: '🌲'
  },
  {
    id: 'dark-dungeon',
    name: 'Depths of Darkness',
    category: 'dungeon',
    mood: 'dark',
    description: 'Ominous dungeon ambiance with distant echoes',
    duration: '18:15',
    url: '/audio/dark-dungeon.mp3',
    icon: '🏰'
  },
  {
    id: 'heroic-theme',
    name: 'Champions Rise',
    category: 'social',
    mood: 'heroic',
    description: 'Triumphant theme for moments of victory and celebration',
    duration: '6:45',
    url: '/audio/heroic-theme.mp3',
    icon: '👑'
  },
  {
    id: 'mysterious-magic',
    name: 'Arcane Mysteries',
    category: 'ambient',
    mood: 'mysterious',
    description: 'Magical ambiance for spellcasting and mystical moments',
    duration: '22:10',
    url: '/audio/mysterious-magic.mp3',
    icon: '🔮'
  }
]

const soundEffects: SoundEffect[] = [
  {
    id: 'dice-roll',
    name: 'Dice Roll',
    category: 'dice',
    description: 'Classic dice rolling sound',
    icon: '🎲',
    trigger: 'dice-roll'
  },
  {
    id: 'critical-hit',
    name: 'Critical Hit!',
    category: 'dice',
    description: 'Epic sound for natural 20s',
    icon: '💥',
    trigger: 'critical-hit'
  },
  {
    id: 'spell-cast',
    name: 'Spell Casting',
    category: 'spell',
    description: 'Magical spell casting sound',
    icon: '✨',
    trigger: 'spell-cast'
  },
  {
    id: 'sword-clash',
    name: 'Sword Clash',
    category: 'combat',
    description: 'Metal on metal combat sound',
    icon: '⚔️',
    trigger: 'combat-hit'
  },
  {
    id: 'level-up',
    name: 'Level Up!',
    category: 'ui',
    description: 'Character advancement celebration',
    icon: '🌟',
    trigger: 'level-up'
  },
  {
    id: 'page-turn',
    name: 'Page Turn',
    category: 'ui',
    description: 'Ancient tome page flip',
    icon: '📜',
    trigger: 'page-turn'
  }
]

const categoryColors = {
  ambient: 'bg-purple-500/20 text-purple-300',
  combat: 'bg-red-500/20 text-red-300',
  social: 'bg-blue-500/20 text-blue-300',
  exploration: 'bg-green-500/20 text-green-300',
  tavern: 'bg-orange-500/20 text-orange-300',
  dungeon: 'bg-gray-500/20 text-gray-300'
}

const moodColors = {
  epic: 'border-yellow-400/60 bg-yellow-900/40',
  mysterious: 'border-purple-400/60 bg-purple-900/40',
  peaceful: 'border-green-400/60 bg-green-900/40',
  tense: 'border-red-400/60 bg-red-900/40',
  heroic: 'border-blue-400/60 bg-blue-900/40',
  dark: 'border-gray-400/60 bg-gray-900/40'
}

export default function SoundSystem() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<SoundTrack | null>(null)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [shuffle, setShuffle] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Simulated audio since we don't have actual audio files
  const playTrack = (track: SoundTrack) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    // In a real implementation, you'd load and play the actual audio file
    console.log(`Playing: ${track.name}`)
  }

  const pauseTrack = () => {
    setIsPlaying(false)
    console.log('Paused')
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseTrack()
    } else if (currentTrack) {
      setIsPlaying(true)
    }
  }

  const playNextTrack = () => {
    if (!currentTrack) return
    
    const currentIndex = musicTracks.findIndex(t => t.id === currentTrack.id)
    let nextIndex
    
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * musicTracks.length)
    } else {
      nextIndex = (currentIndex + 1) % musicTracks.length
    }
    
    playTrack(musicTracks[nextIndex])
  }

  const playSoundEffect = (effect: SoundEffect) => {
    if (!soundEnabled) return
    console.log(`Playing sound effect: ${effect.name}`)
    // In a real implementation, you'd play the actual sound effect
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const TrackCard = ({ track }: { track: SoundTrack }) => (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${moodColors[track.mood]} border-2 backdrop-blur-sm`}
      onClick={() => playTrack(track)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{track.icon}</div>
            <div>
              <CardTitle className="text-lg text-amber-100 font-serif">{track.name}</CardTitle>
              <CardDescription className="text-amber-200/70">
                {track.duration}
              </CardDescription>
            </div>
          </div>
          {currentTrack?.id === track.id && isPlaying && (
            <div className="flex items-center space-x-1 text-green-400">
              <Music className="h-4 w-4 animate-pulse" />
              <span className="text-xs">Playing</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-amber-100/80">
          {track.description}
        </p>
        
        <div className="flex space-x-2">
          <Badge className={categoryColors[track.category]}>
            {track.category}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize">
            {track.mood}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )

  const SoundEffectButton = ({ effect }: { effect: SoundEffect }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => playSoundEffect(effect)}
      disabled={!soundEnabled}
      className="flex items-center space-x-2 border-amber-400/30 text-amber-200 hover:bg-amber-500/10"
    >
      <span>{effect.icon}</span>
      <span>{effect.name}</span>
    </Button>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-legendary mb-2 title-ancient animate-glow">
          🎵 Epic Sound System 🎵
        </h2>
        <p className="text-lg text-amber-200/80 font-serif">
          Immerse yourself in the sounds of adventure
        </p>
      </div>

      {/* Audio Controls */}
      <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-epic font-serif flex items-center">
            <Music className="h-5 w-5 mr-2" />
            Now Playing
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentTrack ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{currentTrack.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-100">{currentTrack.name}</h3>
                  <p className="text-amber-200/70">{currentTrack.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShuffle(!shuffle)}
                  className={shuffle ? 'text-yellow-400' : ''}
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  onClick={togglePlayPause}
                  size="lg"
                  className="rounded-full"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={playNextTrack}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={soundEnabled ? 'text-green-400' : 'text-red-400'}
                >
                  {soundEnabled ? 'SFX ON' : 'SFX OFF'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Music className="h-16 w-16 text-amber-400/50 mx-auto mb-4" />
              <p className="text-amber-200/70 font-serif">
                Select a track to begin your audio journey
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Music Library */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-epic font-serif">🎼 Music Library</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {musicTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </div>

      {/* Sound Effects */}
      <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-epic font-serif">🔊 Sound Effects</CardTitle>
          <CardDescription className="text-amber-200/70">
            Quick access to immersive sound effects for your game
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {soundEffects.map((effect) => (
              <SoundEffectButton key={effect.id} effect={effect} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audio Settings */}
      <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-epic font-serif">🔧 Audio Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-amber-200">Master Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-32 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-amber-200">Auto-play on Actions</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={soundEnabled ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'}
            >
              {soundEnabled ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-amber-200">Shuffle Mode</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShuffle(!shuffle)}
              className={shuffle ? 'text-yellow-400 border-yellow-400' : ''}
            >
              {shuffle ? 'On' : 'Off'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fbbf24;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fbbf24;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}