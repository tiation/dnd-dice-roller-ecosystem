'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EpicFeatureCardProps {
  title: string
  subtitle: string
  description: string
  icon: string
  rarity: 'epic' | 'legendary' | 'rare' | 'common'
  details: string[]
  index: number
}

export default function EpicFeatureCard({ 
  title, 
  subtitle, 
  description, 
  icon, 
  rarity, 
  details, 
  index 
}: EpicFeatureCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const getRarityClasses = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'card-legendary border-purple-400/50 shadow-purple-500/30'
      case 'epic':
        return 'card-epic border-yellow-500/50 shadow-yellow-500/20'
      case 'rare':
        return 'bg-gradient-to-br from-blue-800/90 via-blue-700/90 to-blue-900/90 border-2 border-blue-400/50 shadow-xl shadow-blue-500/20'
      default:
        return 'bg-gradient-to-br from-slate-700/90 via-slate-600/90 to-slate-800/90 border-2 border-slate-400/50 shadow-xl'
    }
  }

  const getRarityBadge = (rarity: string) => {
    const badges = {
      legendary: { text: 'Legendary', color: 'text-purple-300 bg-purple-900/50', gem: '💎' },
      epic: { text: 'Epic', color: 'text-yellow-300 bg-yellow-900/50', gem: '🏆' },
      rare: { text: 'Rare', color: 'text-blue-300 bg-blue-900/50', gem: '💎' },
      common: { text: 'Common', color: 'text-gray-300 bg-gray-900/50', gem: '⚪' }
    }
    return badges[rarity as keyof typeof badges] || badges.common
  }

  const badge = getRarityBadge(rarity)

  return (
    <div 
      className="group perspective-1000 animate-fade-in cursor-pointer"
      style={{ animationDelay: `${index * 200}ms` }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={cn(
        "relative w-full h-96 transition-transform duration-700 transform-style-preserve-3d",
        isFlipped && "rotate-y-180"
      )}>
        {/* Front Side */}
        <Card className={cn(
          "absolute inset-0 backface-hidden overflow-hidden transform-gpu",
          getRarityClasses(rarity),
          "group-hover:scale-[1.02] transition-all duration-500"
        )}>
          <CardHeader className="relative">
            {/* Rarity Badge */}
            <div className="absolute top-4 right-4 flex items-center space-x-1">
              <span className="text-xs">{badge.gem}</span>
              <span className={cn("text-xs px-2 py-1 rounded-full font-semibold", badge.color)}>
                {badge.text}
              </span>
            </div>

            {/* Icon with Animation */}
            <div className="text-6xl mb-4 text-center animate-float group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>

            <CardTitle className="text-2xl font-bold text-center mb-2 font-serif">
              <span className={rarity === 'legendary' ? 'text-legendary' : 'text-epic'}>
                {title}
              </span>
            </CardTitle>
            
            <CardDescription className="text-center text-amber-200/80 font-semibold text-lg">
              {subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-amber-100/90 text-center leading-relaxed mb-6">
              {description}
            </p>
            
            <div className="text-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-amber-300 hover:text-yellow-300 font-serif"
              >
                ✨ Discover More
              </Button>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-4 opacity-20 animate-float text-2xl">✨</div>
            <div className="absolute bottom-20 right-4 opacity-20 animate-float text-xl" style={{ animationDelay: '1s' }}>🌟</div>
          </CardContent>
        </Card>

        {/* Back Side */}
        <Card className={cn(
          "absolute inset-0 backface-hidden rotate-y-180 overflow-hidden transform-gpu",
          getRarityClasses(rarity)
        )}>
          <CardHeader>
            <div className="text-4xl mb-2 text-center animate-pulse-slow">{icon}</div>
            <CardTitle className="text-xl font-bold text-center mb-4 font-serif text-epic">
              {title} Features
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ul className="space-y-3">
              {details.map((detail, detailIndex) => (
                <li 
                  key={detailIndex}
                  className="flex items-start space-x-3 animate-fade-in"
                  style={{ animationDelay: `${detailIndex * 100}ms` }}
                >
                  <span className="text-yellow-400 mt-1 flex-shrink-0">⚡</span>
                  <span className="text-amber-100/90 text-sm">{detail}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 text-center">
              <Button 
                size="sm" 
                className="btn-epic"
              >
                🚀 Try Now
              </Button>
            </div>

            {/* Back floating elements */}
            <div className="absolute top-4 right-4 opacity-30 animate-float text-lg">💫</div>
            <div className="absolute bottom-4 left-4 opacity-30 animate-float text-lg" style={{ animationDelay: '0.5s' }}>⭐</div>
          </CardContent>
        </Card>
      </div>

      {/* Click hint */}
      <div className="text-center mt-2 opacity-60 text-xs text-amber-200 animate-pulse">
        Click to reveal details
      </div>
    </div>
  )
}