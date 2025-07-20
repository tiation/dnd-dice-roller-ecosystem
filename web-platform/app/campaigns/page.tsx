'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Crown, Users, Calendar, MapPin, Sword, Shield, Zap, Book, Plus, Star, Clock, Target } from 'lucide-react'

type CampaignStatus = 'active' | 'completed' | 'on-hold' | 'planning'
type CampaignType = 'homebrew' | 'official' | 'oneshot' | 'campaign'
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

interface Campaign {
  id: string
  name: string
  description: string
  status: CampaignStatus
  type: CampaignType
  difficulty: DifficultyLevel
  playerCount: number
  maxPlayers: number
  level: string
  duration: string
  setting: string
  dmName: string
  nextSession?: string
  image: string
  tags: string[]
  created: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
}

const campaignDatabase: Campaign[] = [
  {
    id: '1',
    name: 'The Lost Mines of Phandelver',
    description: 'A classic adventure for new players. Explore the mysteries of Wave Echo Cave and face the Spider, Glassstaff, and other threats in this iconic starter campaign.',
    status: 'active',
    type: 'official',
    difficulty: 'beginner',
    playerCount: 4,
    maxPlayers: 6,
    level: '1-5',
    duration: '8-12 sessions',
    setting: 'Forgotten Realms',
    dmName: 'Gandalf the Gray',
    nextSession: '2024-01-20 19:00',
    image: '🏰',
    tags: ['starter', 'goblins', 'mystery', 'classic'],
    created: '2024-01-01',
    rarity: 'common'
  },
  {
    id: '2',
    name: 'Curse of Strahd',
    description: 'Enter the gothic horror realm of Barovia, where the vampire lord Strahd von Zarovich rules with an iron fist. Can your party escape the mists and defeat this ancient evil?',
    status: 'active',
    type: 'official',
    difficulty: 'intermediate',
    playerCount: 5,
    maxPlayers: 6,
    level: '1-10',
    duration: '20-30 sessions',
    setting: 'Ravenloft',
    dmName: 'Van Helsing',
    nextSession: '2024-01-18 20:00',
    image: '🧛‍♂️',
    tags: ['horror', 'vampire', 'gothic', 'challenging'],
    created: '2023-10-15',
    rarity: 'epic'
  },
  {
    id: '3',
    name: 'Dragons of the Celestial Empire',
    description: 'An epic homebrew campaign set in an ancient oriental fantasy realm. Face legendary dragons, navigate court intrigue, and master the art of ki manipulation.',
    status: 'planning',
    type: 'homebrew',
    difficulty: 'advanced',
    playerCount: 0,
    maxPlayers: 5,
    level: '1-20',
    duration: '50+ sessions',
    setting: 'Oriental Fantasy',
    dmName: 'Master Chen',
    image: '🐉',
    tags: ['homebrew', 'dragons', 'oriental', 'martial arts'],
    created: '2024-01-10',
    rarity: 'legendary'
  },
  {
    id: '4',
    name: 'The Sunless Citadel',
    description: 'Delve into this classic dungeon crawl beneath a ruined fortress. Face twisted druids, goblin tribes, and discover the secrets of the Gulthias Tree.',
    status: 'completed',
    type: 'official',
    difficulty: 'beginner',
    playerCount: 4,
    maxPlayers: 4,
    level: '1-3',
    duration: '4-6 sessions',
    setting: 'Any',
    dmName: 'Drizzt Do\'Urden',
    image: '🌳',
    tags: ['dungeon', 'goblins', 'underdark', 'tree'],
    created: '2023-08-01',
    rarity: 'uncommon'
  },
  {
    id: '5',
    name: 'Tomb of Annihilation',
    description: 'Journey to the deadly peninsula of Chult to find and destroy the Soulmonger. Navigate hex crawls, deadly traps, and face the legendary lich Acererak.',
    status: 'on-hold',
    type: 'official',
    difficulty: 'expert',
    playerCount: 3,
    maxPlayers: 5,
    level: '1-11',
    duration: '30-40 sessions',
    setting: 'Chult',
    dmName: 'Tomb Keeper',
    image: '🏺',
    tags: ['jungle', 'hex crawl', 'death curse', 'lich'],
    created: '2023-12-01',
    rarity: 'rare'
  },
  {
    id: '6',
    name: 'Heist in Waterdeep',
    description: 'A thrilling oneshot where the party must infiltrate the mansion of a corrupt noble and steal ancient artifacts. Urban intrigue meets high-stakes action.',
    status: 'active',
    type: 'oneshot',
    difficulty: 'intermediate',
    playerCount: 6,
    maxPlayers: 6,
    level: '5-7',
    duration: '1 session',
    setting: 'Waterdeep',
    dmName: 'The Phantom Thief',
    nextSession: '2024-01-15 18:00',
    image: '💎',
    tags: ['heist', 'urban', 'stealth', 'nobles'],
    created: '2024-01-12',
    rarity: 'uncommon'
  }
]

const statusColors: Record<CampaignStatus, string> = {
  active: 'bg-green-500/20 text-green-300 border-green-400',
  completed: 'bg-blue-500/20 text-blue-300 border-blue-400',
  'on-hold': 'bg-yellow-500/20 text-yellow-300 border-yellow-400',
  planning: 'bg-purple-500/20 text-purple-300 border-purple-400'
}

const difficultyColors: Record<DifficultyLevel, string> = {
  beginner: 'bg-green-500/20 text-green-300',
  intermediate: 'bg-yellow-500/20 text-yellow-300',
  advanced: 'bg-orange-500/20 text-orange-300',
  expert: 'bg-red-500/20 text-red-300'
}

const rarityColors: Record<string, string> = {
  common: 'border-gray-400/30 bg-gray-800/30',
  uncommon: 'border-green-400/40 bg-green-900/20',
  rare: 'border-blue-400/50 bg-blue-900/30',
  epic: 'border-purple-400/60 bg-purple-900/40',
  legendary: 'border-yellow-400/70 bg-yellow-900/50'
}

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<CampaignStatus | 'all'>('all')
  const [selectedType, setSelectedType] = useState<CampaignType | 'all'>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all')
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  const filteredCampaigns = useMemo(() => {
    return campaignDatabase.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          campaign.setting.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          campaign.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus
      const matchesType = selectedType === 'all' || campaign.type === selectedType
      const matchesDifficulty = selectedDifficulty === 'all' || campaign.difficulty === selectedDifficulty
      
      return matchesSearch && matchesStatus && matchesType && matchesDifficulty
    })
  }, [searchTerm, selectedStatus, selectedType, selectedDifficulty])

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${rarityColors[campaign.rarity]} border-2 backdrop-blur-sm`}
      onClick={() => setSelectedCampaign(campaign)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{campaign.image}</div>
            <div>
              <CardTitle className="text-lg text-amber-100 font-serif">{campaign.name}</CardTitle>
              <CardDescription className="text-amber-200/70">
                by {campaign.dmName} • {campaign.setting}
              </CardDescription>
            </div>
          </div>
          <Badge className={statusColors[campaign.status]}>
            {campaign.status.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-amber-100/80 line-clamp-2">
          {campaign.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {campaign.type}
          </Badge>
          <Badge className={`text-xs ${difficultyColors[campaign.difficulty]}`}>
            {campaign.difficulty}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Level {campaign.level}
          </Badge>
        </div>

        <div className="flex justify-between items-center text-sm text-amber-200/60">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{campaign.playerCount}/{campaign.maxPlayers}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{campaign.duration}</span>
          </div>
        </div>

        {campaign.nextSession && (
          <div className="flex items-center space-x-1 text-sm text-green-300">
            <Calendar className="h-4 w-4" />
            <span>Next: {new Date(campaign.nextSession).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const CampaignDetail = ({ campaign }: { campaign: Campaign }) => (
    <Card className={`${rarityColors[campaign.rarity]} border-2 backdrop-blur-sm`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="text-5xl">{campaign.image}</div>
            <div>
              <CardTitle className="text-2xl text-legendary font-serif mb-2">{campaign.name}</CardTitle>
              <CardDescription className="text-lg text-amber-200">
                {campaign.setting} • Level {campaign.level}
              </CardDescription>
            </div>
          </div>
          <Badge className={`${statusColors[campaign.status]} text-lg px-3 py-1`}>
            {campaign.status.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold text-amber-300 mb-2">Campaign Description</h4>
          <p className="text-amber-100/90 leading-relaxed">{campaign.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">Dungeon Master</h4>
            <p className="text-amber-100">{campaign.dmName}</p>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">Campaign Type</h4>
            <Badge variant="outline" className="capitalize">{campaign.type}</Badge>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">Difficulty</h4>
            <Badge className={`capitalize ${difficultyColors[campaign.difficulty]}`}>
              {campaign.difficulty}
            </Badge>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">Duration</h4>
            <p className="text-amber-100">{campaign.duration}</p>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">Players</h4>
            <p className="text-amber-100">{campaign.playerCount}/{campaign.maxPlayers} players</p>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">Character Level</h4>
            <p className="text-amber-100">Level {campaign.level}</p>
          </div>
        </div>

        {campaign.nextSession && (
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">Next Session</h4>
            <div className="flex items-center space-x-2 text-green-300">
              <Calendar className="h-5 w-5" />
              <span>{new Date(campaign.nextSession).toLocaleString()}</span>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-amber-300 mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {campaign.tags.map(tag => (
              <Badge key={tag} variant="outline" className="border-amber-400/30 text-amber-200">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button className="btn-legendary flex-1">
            <Sword className="h-4 w-4 mr-2" />
            Join Campaign
          </Button>
          <Button variant="outline" className="border-amber-400/50 text-amber-300 hover:bg-amber-500/10">
            <Book className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const statsData = [
    { label: 'Active Campaigns', value: campaignDatabase.filter(c => c.status === 'active').length, icon: '⚔️' },
    { label: 'Total Players', value: campaignDatabase.reduce((sum, c) => sum + c.playerCount, 0), icon: '👥' },
    { label: 'Completed Adventures', value: campaignDatabase.filter(c => c.status === 'completed').length, icon: '🏆' },
    { label: 'Epic Legends', value: campaignDatabase.filter(c => c.rarity === 'legendary').length, icon: '🌟' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">👑</div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>🏰</div>
        <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: '2s' }}>🗺️</div>
        <div className="absolute bottom-40 right-10 animate-float" style={{ animationDelay: '0.5s' }}>⚔️</div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-legendary mb-4 title-ancient animate-glow">
            👑 Epic Campaigns 👑
          </h1>
          <p className="text-xl text-amber-200/80 font-serif max-w-3xl mx-auto">
            Embark on legendary adventures across mystical realms. Join ongoing campaigns, 
            discover new worlds, and write your name in the annals of heroic legend!
          </p>
        </div>

        {/* Epic Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {statsData.map((stat, index) => (
            <Card key={stat.label} className="text-center border-amber-400/30 bg-slate-800/50 backdrop-blur-sm animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
              <CardContent className="p-6">
                <div className="text-4xl mb-2 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-epic mb-1">{stat.value}</div>
                <div className="text-amber-200/80 font-serif text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-4 w-4" />
            <Input
              placeholder="Search campaigns, settings, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-amber-400/30 text-amber-100 placeholder-amber-300/50"
            />
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as CampaignStatus | 'all')}
              className="px-3 py-2 bg-slate-800/50 border border-amber-400/30 rounded-md text-amber-100"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as CampaignType | 'all')}
              className="px-3 py-2 bg-slate-800/50 border border-amber-400/30 rounded-md text-amber-100"
            >
              <option value="all">All Types</option>
              <option value="official">Official</option>
              <option value="homebrew">Homebrew</option>
              <option value="oneshot">One Shot</option>
              <option value="campaign">Campaign</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel | 'all')}
              className="px-3 py-2 bg-slate-800/50 border border-amber-400/30 rounded-md text-amber-100"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        {/* Create Campaign Button */}
        <div className="text-center mb-8">
          <Button className="btn-legendary text-lg px-8 py-4">
            <Plus className="h-5 w-5 mr-2" />
            🎭 Create Epic Campaign
          </Button>
        </div>

        {/* Results */}
        <div className="mb-6 text-center">
          <p className="text-amber-200/70">
            Found {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''} ready for heroes
          </p>
        </div>

        {/* Campaign Grid and Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Campaign List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-epic mb-4 font-serif">Available Adventures</h2>
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
              {filteredCampaigns.map((campaign, index) => (
                <CampaignCard key={`${campaign.id}-${index}`} campaign={campaign} />
              ))}
            </div>
          </div>

          {/* Campaign Detail */}
          <div className="sticky top-8">
            <h2 className="text-2xl font-bold text-epic mb-4 font-serif">Campaign Details</h2>
            {selectedCampaign ? (
              <CampaignDetail campaign={selectedCampaign} />
            ) : (
              <Card className="border-2 border-amber-400/30 bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Crown className="h-16 w-16 text-amber-400/50 mx-auto mb-4" />
                  <p className="text-amber-200/70 text-lg font-serif">
                    Select a campaign to view its epic details and join the adventure
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