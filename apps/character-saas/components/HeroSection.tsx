'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const heroQuotes = [
  "Every legend begins with a single step into the unknown...",
  "In the realm of imagination, heroes are forged in fire...", 
  "Your destiny awaits beyond the next dice roll...",
  "Adventure calls to those brave enough to answer...",
  "From humble beginnings rise the greatest champions..."
]

export default function HeroSection() {
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % heroQuotes.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Epic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 text-8xl opacity-10 animate-float text-yellow-500">⚔️</div>
        <div className="absolute top-20 right-20 text-6xl opacity-10 animate-float text-purple-400" style={{ animationDelay: '1s' }}>🔮</div>
        <div className="absolute bottom-20 left-20 text-7xl opacity-10 animate-float text-blue-400" style={{ animationDelay: '2s' }}>🛡️</div>
        <div className="absolute bottom-10 right-10 text-9xl opacity-10 animate-float text-red-400" style={{ animationDelay: '1.5s' }}>🐉</div>
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto">
        {/* Epic Title */}
        <div className="mb-8 animate-fade-in">
          <div className="text-7xl md:text-9xl mb-4 animate-float">⚔️</div>
          <h1 className="text-5xl md:text-7xl font-bold text-legendary mb-6 title-ancient leading-tight">
            Forge Your
            <br />
            <span className="text-epic">Epic Legend</span>
          </h1>
          <div className="flex justify-center space-x-4 text-4xl mb-6">
            <span className="animate-float">✨</span>
            <span className="animate-float" style={{ animationDelay: '0.5s' }}>🌟</span>
            <span className="animate-float" style={{ animationDelay: '1s' }}>⭐</span>
          </div>
        </div>

        {/* Rotating Quote */}
        <div className="mb-12 h-16 flex items-center justify-center animate-fade-in" style={{ animationDelay: '500ms' }}>
          <p 
            key={currentQuote}
            className="text-xl md:text-2xl text-amber-200/90 font-serif italic max-w-4xl animate-fade-in"
          >
            {heroQuotes[currentQuote]}
          </p>
        </div>

        {/* Epic Description */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '1000ms' }}>
          <p className="text-xl md:text-2xl text-amber-100/80 mb-6 max-w-4xl mx-auto leading-relaxed">
            Welcome to the <span className="text-epic font-semibold">Epic Character Forge</span> — where ordinary players transform into legendary heroes! 
            Create stunning D&D 5e characters with mystical auto-calculations, 3D dice magic, and AI-powered portraits.
          </p>
          <p className="text-lg text-amber-200/70 max-w-3xl mx-auto">
            Join over <span className="text-epic font-bold">50,000 heroes</span> who have already begun their epic journey through realms of magic and adventure.
          </p>
        </div>

        {/* Epic Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in" style={{ animationDelay: '1500ms' }}>
          <Button asChild size="lg" className="btn-legendary text-xl px-10 py-6 shadow-2xl">
            <Link href="/characters/new">
              🔥 Begin Your Legend
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="btn-epic text-xl px-10 py-6 border-2">
            <Link href="/characters">
              👥 Heroes Gallery
            </Link>
          </Button>
          <Button variant="ghost" size="lg" asChild className="text-amber-300 hover:text-yellow-300 text-xl px-8 py-6 font-serif">
            <Link href="/dice">
              🎲 Roll the Dice
            </Link>
          </Button>
        </div>

        {/* Epic Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '2000ms' }}>
          {[
            {
              icon: "📜",
              title: "Official D&D Format", 
              description: "Wizards-approved sheets"
            },
            {
              icon: "🔮",
              title: "Mystical Calculations",
              description: "Auto-magic math"
            },
            {
              icon: "🎲", 
              title: "3D Dice Rolling",
              description: "Epic dice physics"
            }
          ].map((feature, index) => (
            <div key={feature.title} className="text-center group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-epic mb-2 font-serif">{feature.title}</h3>
              <p className="text-amber-200/70">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Mystical Separator */}
        <div className="mt-20 flex items-center justify-center animate-fade-in" style={{ animationDelay: '2500ms' }}>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent max-w-md"></div>
          <div className="mx-8 text-3xl animate-pulse-slow">
            ⭐
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent max-w-md"></div>
        </div>
      </div>
    </section>
  )
}