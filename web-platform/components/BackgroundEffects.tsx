'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  type: 'spark' | 'ember' | 'magic' | 'star'
}

export default function BackgroundEffects() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const createParticle = (id: number): Particle => {
      const types = ['spark', 'ember', 'magic', 'star'] as const
      const colors = {
        spark: '#fbbf24',
        ember: '#f97316', 
        magic: '#a855f7',
        star: '#facc15'
      }
      
      const type = types[Math.floor(Math.random() * types.length)]
      
      return {
        id,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 3 - 1,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[type],
        type
      }
    }

    // Initialize particles
    const initialParticles = Array.from({ length: 50 }, (_, i) => {
      const particle = createParticle(i)
      particle.y = Math.random() * window.innerHeight
      return particle
    })
    
    setParticles(initialParticles)

    let particleId = 50
    const animationFrame = (function() {
      let frame: number
      
      const animate = () => {
        setParticles(currentParticles => {
          let newParticles = currentParticles.map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            opacity: particle.opacity - 0.005,
            vx: particle.vx * 0.999
          })).filter(particle => particle.opacity > 0 && particle.y > -50)

          // Add new particles occasionally
          if (Math.random() < 0.3 && newParticles.length < 80) {
            newParticles.push(createParticle(particleId++))
          }

          return newParticles
        })
        
        frame = requestAnimationFrame(animate)
      }
      
      return { start: () => animate(), stop: () => cancelAnimationFrame(frame) }
    })()

    animationFrame.start()

    const handleResize = () => {
      setParticles(current => current.map(particle => ({
        ...particle,
        x: Math.min(particle.x, window.innerWidth)
      })))
    }

    window.addEventListener('resize', handleResize)

    return () => {
      animationFrame.stop()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getParticleSymbol = (type: string) => {
    switch (type) {
      case 'spark': return '✨'
      case 'ember': return '🔥'
      case 'magic': return '🔮'
      case 'star': return '⭐'
      default: return '✨'
    }
  }

  return (
    <>
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-900/20 to-purple-900/30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-yellow-900/10 via-transparent to-orange-900/20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute transition-opacity duration-500 animate-float"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              opacity: particle.opacity,
              color: particle.color,
              fontSize: `${particle.size * 4}px`,
              textShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              animationDuration: `${2 + Math.random() * 2}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            {getParticleSymbol(particle.type)}
          </div>
        ))}
      </div>

      {/* Epic Geometric Patterns */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          {/* Ancient Runes Pattern */}
          <defs>
            <pattern id="runes" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20 20 L40 40 M60 20 L80 40 M20 60 L40 80 M60 60 L80 80" 
                    stroke="currentColor" strokeWidth="1" className="text-yellow-500" />
              <circle cx="50" cy="50" r="3" fill="currentColor" className="text-yellow-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#runes)" />
        </svg>
      </div>

      {/* Dragon Silhouette */}
      <div className="fixed top-10 right-10 pointer-events-none z-0 opacity-20 animate-float text-9xl text-yellow-500/10">
        🐉
      </div>

      {/* Castle Silhouette */}
      <div className="fixed bottom-10 left-10 pointer-events-none z-0 opacity-15 animate-pulse-slow text-8xl text-purple-500/10">
        🏰
      </div>

      {/* Sword and Shield */}
      <div className="fixed top-1/2 left-0 pointer-events-none z-0 opacity-10 animate-float text-6xl text-amber-500/10 -rotate-45" style={{ animationDelay: '1s' }}>
        ⚔️
      </div>

      <div className="fixed top-1/3 right-0 pointer-events-none z-0 opacity-10 animate-float text-6xl text-blue-500/10 rotate-12" style={{ animationDelay: '2s' }}>
        🛡️
      </div>

      {/* Magic Circles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-yellow-500/10 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 border border-purple-500/10 rounded-full animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-blue-500/5 rounded-full animate-spin" style={{ animationDuration: '30s' }}></div>
      </div>

      {/* Twinkling Stars */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-300 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 10 + 8}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 1}s`
            }}
          >
            ⭐
          </div>
        ))}
      </div>
    </>
  )
}