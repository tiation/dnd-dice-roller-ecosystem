'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface DiceRoll {
  dice: string
  result: number[]
  total: number
  modifier: number
  advantage?: boolean
  disadvantage?: boolean
  criticalHit?: boolean
  criticalFail?: boolean
}

interface EpicDiceRollerProps {
  onRoll: (roll: DiceRoll) => void
}

export default function EpicDiceRoller({ onRoll }: EpicDiceRollerProps) {
  const [diceInput, setDiceInput] = useState('1d20')
  const [modifier, setModifier] = useState(0)
  const [advantage, setAdvantage] = useState(false)
  const [disadvantage, setDisadvantage] = useState(false)
  const [isRolling, setIsRolling] = useState(false)
  const [lastRoll, setLastRoll] = useState<DiceRoll | null>(null)
  const [rollAnimation, setRollAnimation] = useState('')

  const parseDice = (diceString: string) => {
    const match = diceString.toLowerCase().match(/(\d+)?d(\d+)(?:[kh](\d+))?/i)
    if (!match) throw new Error('Invalid dice format')
    
    const count = parseInt(match[1] || '1')
    const sides = parseInt(match[2])
    const keepHighest = match[3] ? parseInt(match[3]) : null
    
    return { count, sides, keepHighest }
  }

  const rollDie = (sides: number): number => {
    return Math.floor(Math.random() * sides) + 1
  }

  const performRoll = async () => {
    if (isRolling) return

    setIsRolling(true)
    setRollAnimation('animate-spin')

    // Simulate roll animation delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      const { count, sides, keepHighest } = parseDice(diceInput)
      let results: number[] = []
      
      // Handle advantage/disadvantage for d20 rolls
      if (sides === 20 && count === 1 && (advantage || disadvantage)) {
        const roll1 = rollDie(20)
        const roll2 = rollDie(20)
        results = advantage ? [Math.max(roll1, roll2)] : [Math.min(roll1, roll2)]
      } else {
        // Normal dice rolling
        for (let i = 0; i < count; i++) {
          results.push(rollDie(sides))
        }
        
        // Handle keep highest
        if (keepHighest && keepHighest < results.length) {
          results = results.sort((a, b) => b - a).slice(0, keepHighest)
        }
      }

      const baseTotal = results.reduce((sum, die) => sum + die, 0)
      const finalTotal = baseTotal + modifier

      // Check for critical hit/fail on d20 rolls
      const criticalHit = sides === 20 && results.some(r => r === 20)
      const criticalFail = sides === 20 && results.some(r => r === 1)

      const roll: DiceRoll = {
        dice: diceInput,
        result: results,
        total: finalTotal,
        modifier,
        advantage,
        disadvantage,
        criticalHit,
        criticalFail
      }

      setLastRoll(roll)
      onRoll(roll)
      
      // Trigger appropriate animation based on result
      if (criticalHit) {
        setRollAnimation('animate-bounce text-green-400')
      } else if (criticalFail) {
        setRollAnimation('animate-pulse text-red-400')
      } else if (finalTotal >= 15) {
        setRollAnimation('animate-pulse text-yellow-400')
      } else {
        setRollAnimation('animate-fade-in')
      }

    } catch (error) {
      console.error('Invalid dice format:', error)
    }

    setIsRolling(false)
    setTimeout(() => setRollAnimation(''), 2000)
  }

  const getDiceEmoji = (sides: number) => {
    const emojiMap: { [key: number]: string } = {
      4: '🔺', 6: '🎲', 8: '🔹', 10: '🔸', 12: '🔷', 20: '🎯', 100: '💯'
    }
    return emojiMap[sides] || '🎲'
  }

  const getResultColor = (roll: DiceRoll) => {
    if (roll.criticalHit) return 'text-green-400'
    if (roll.criticalFail) return 'text-red-400'
    if (roll.total >= 15) return 'text-yellow-400'
    return 'text-amber-100'
  }

  return (
    <Card className="card-legendary">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl text-legendary font-serif flex items-center justify-center">
          <span className="mr-3 text-4xl animate-float">🎲</span>
          Epic Dice Chamber
          <span className="ml-3 text-4xl animate-float" style={{ animationDelay: '1s' }}>🎲</span>
        </CardTitle>
        <CardDescription className="text-lg text-amber-200/80">
          Channel the power of the cosmic dice to determine your fate
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Dice Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">Dice Formula</label>
            <Input
              value={diceInput}
              onChange={(e) => setDiceInput(e.target.value)}
              placeholder="e.g., 1d20, 2d6, 4d6k3"
              className="input-epic text-center font-mono text-lg"
            />
            <div className="text-xs text-amber-200/60 mt-1">
              Format: [count]d[sides][modifiers]
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">Modifier</label>
            <Input
              type="number"
              value={modifier}
              onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
              className="input-epic text-center font-mono text-lg"
              placeholder="0"
            />
            <div className="text-xs text-amber-200/60 mt-1">
              Bonus/penalty to add
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <Button
              onClick={performRoll}
              disabled={isRolling}
              className="btn-legendary text-xl py-3 h-auto"
            >
              {isRolling ? (
                <>
                  <span className="animate-spin mr-2">🎲</span>
                  Rolling...
                </>
              ) : (
                <>
                  <span className="mr-2">⚡</span>
                  Cast Dice
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Advantage/Disadvantage Toggle */}
        <div className="flex justify-center space-x-4">
          <Button
            variant={advantage ? "default" : "outline"}
            onClick={() => {
              setAdvantage(!advantage)
              if (!advantage) setDisadvantage(false)
            }}
            className={cn(
              "transition-all duration-300",
              advantage ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/30" : "border-green-500/50 text-green-400 hover:bg-green-500/10"
            )}
          >
            <span className="mr-2">📈</span>
            Advantage
          </Button>
          
          <Button
            variant={disadvantage ? "default" : "outline"}
            onClick={() => {
              setDisadvantage(!disadvantage)
              if (!disadvantage) setAdvantage(false)
            }}
            className={cn(
              "transition-all duration-300",
              disadvantage ? "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30" : "border-red-500/50 text-red-400 hover:bg-red-500/10"
            )}
          >
            <span className="mr-2">📉</span>
            Disadvantage
          </Button>
        </div>

        {/* 3D Dice Display */}
        <div className="text-center py-8">
          <div className="inline-block dice-container">
            <div className={cn("text-8xl transition-all duration-500", rollAnimation)}>
              {isRolling ? '🎲' : getDiceEmoji(20)}
            </div>
          </div>
        </div>

        {/* Roll Result Display */}
        {lastRoll && (
          <div className="text-center space-y-4 p-6 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/30">
            <div className="text-sm text-amber-200/60 font-serif">
              The Oracle has spoken...
            </div>
            
            <div className={cn("text-6xl font-bold font-serif", getResultColor(lastRoll), rollAnimation)}>
              {lastRoll.total}
            </div>
            
            <div className="text-amber-200/80">
              <div className="flex justify-center items-center space-x-2 mb-2">
                <span className="font-mono">{lastRoll.dice}</span>
                {lastRoll.advantage && <span className="text-green-400 text-xs">📈 ADV</span>}
                {lastRoll.disadvantage && <span className="text-red-400 text-xs">📉 DIS</span>}
              </div>
              
              <div className="text-sm space-x-2">
                <span>Rolled: [{lastRoll.result.join(', ')}]</span>
                {lastRoll.modifier !== 0 && (
                  <span>
                    {lastRoll.modifier > 0 ? '+' : ''}{lastRoll.modifier}
                  </span>
                )}
              </div>

              {lastRoll.criticalHit && (
                <div className="mt-2 text-green-400 font-semibold animate-pulse">
                  🌟 CRITICAL SUCCESS! 🌟
                </div>
              )}
              
              {lastRoll.criticalFail && (
                <div className="mt-2 text-red-400 font-semibold animate-pulse">
                  💀 CRITICAL FAILURE! 💀
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Dice Buttons */}
        <div>
          <h4 className="text-lg font-semibold text-epic mb-4 text-center font-serif">
            Sacred Dice Collection
          </h4>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {[
              { dice: '1d4', emoji: '🔺' },
              { dice: '1d6', emoji: '🎲' },
              { dice: '1d8', emoji: '🔹' },
              { dice: '1d10', emoji: '🔸' },
              { dice: '1d12', emoji: '🔷' },
              { dice: '1d20', emoji: '🎯' },
              { dice: '1d100', emoji: '💯' },
              { dice: '2d6', emoji: '🎲🎲' }
            ].map((die, index) => (
              <Button
                key={die.dice}
                variant="outline"
                className="aspect-square p-2 flex flex-col items-center justify-center border-yellow-500/30 hover:border-yellow-400/70 hover:bg-yellow-500/10 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setDiceInput(die.dice)}
              >
                <div className="text-lg animate-float" style={{ animationDelay: `${index * 0.1}s` }}>
                  {die.emoji}
                </div>
                <div className="text-xs mt-1 text-amber-200/80 font-mono">{die.dice}</div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}