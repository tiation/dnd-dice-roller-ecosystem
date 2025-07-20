'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import EpicDiceRoller from '@/components/EpicDiceRoller'
import DiceHistory from '@/components/DiceHistory'

interface DiceRoll {
  id: string
  timestamp: Date
  dice: string
  result: number[]
  total: number
  modifier: number
  advantage?: boolean
  disadvantage?: boolean
  criticalHit?: boolean
  criticalFail?: boolean
}

export default function DiceOraclePage() {
  const [rollHistory, setRollHistory] = useState<DiceRoll[]>([])

  const addToHistory = (roll: Omit<DiceRoll, 'id' | 'timestamp'>) => {
    const newRoll: DiceRoll = {
      ...roll,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    setRollHistory(prev => [newRoll, ...prev.slice(0, 19)]) // Keep last 20 rolls
  }

  const quickRolls = [
    { name: "Attack Roll", dice: "1d20", modifier: 0, icon: "⚔️" },
    { name: "Damage", dice: "1d8", modifier: 0, icon: "💥" },
    { name: "Fireball", dice: "8d6", modifier: 0, icon: "🔥" },
    { name: "Healing", dice: "2d4", modifier: 2, icon: "❤️" },
    { name: "Initiative", dice: "1d20", modifier: 3, icon: "⚡" },
    { name: "Perception", dice: "1d20", modifier: 5, icon: "👁️" }
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Epic Header */}
      <div className="text-center mb-12">
        <div className="text-8xl mb-6 animate-float">🎲</div>
        <h1 className="text-6xl font-bold text-legendary mb-4 title-ancient">
          The Dice Oracle
        </h1>
        <p className="text-xl text-amber-200/80 font-serif max-w-3xl mx-auto">
          Commune with the ancient spirits of chance and fortune. Let the sacred dice reveal your destiny!
        </p>
        <div className="flex justify-center mt-6 space-x-4 text-3xl">
          <span className="animate-float">⚔️</span>
          <span className="animate-float" style={{ animationDelay: '0.5s' }}>🔮</span>
          <span className="animate-float" style={{ animationDelay: '1s' }}>⭐</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Dice Roller */}
        <div className="xl:col-span-2 space-y-8">
          <EpicDiceRoller onRoll={addToHistory} />

          {/* Quick Roll Buttons */}
          <Card className="card-epic">
            <CardHeader>
              <CardTitle className="text-2xl text-epic font-serif flex items-center">
                <span className="mr-3 text-3xl animate-pulse-slow">⚡</span>
                Quick Spell Rolls
              </CardTitle>
              <CardDescription className="text-amber-200/70">
                Common D&D rolls at your fingertips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickRolls.map((roll, index) => (
                  <Button
                    key={roll.name}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2 border-yellow-500/30 hover:border-yellow-400/70 hover:bg-yellow-500/10 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => {
                      // This would trigger a roll with the specified dice
                      const result = Math.floor(Math.random() * 20) + 1 // Mock roll
                      addToHistory({
                        dice: roll.dice,
                        result: [result],
                        total: result + roll.modifier,
                        modifier: roll.modifier
                      })
                    }}
                  >
                    <span className="text-2xl animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                      {roll.icon}
                    </span>
                    <div className="text-center">
                      <div className="font-semibold text-amber-100">{roll.name}</div>
                      <div className="text-xs text-amber-200/60">
                        {roll.dice}{roll.modifier !== 0 && ` + ${roll.modifier}`}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dice Tips */}
          <Card className="card-legendary">
            <CardHeader>
              <CardTitle className="text-2xl text-legendary font-serif flex items-center">
                <span className="mr-3 text-3xl animate-pulse-slow">📚</span>
                Oracle Wisdom
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-epic font-serif">Dice Notation</h4>
                  <div className="space-y-2 text-sm text-amber-200/80">
                    <div><span className="text-yellow-400 font-mono">1d20</span> - Roll one twenty-sided die</div>
                    <div><span className="text-yellow-400 font-mono">2d6</span> - Roll two six-sided dice</div>
                    <div><span className="text-yellow-400 font-mono">1d8+3</span> - Roll one d8, add 3</div>
                    <div><span className="text-yellow-400 font-mono">4d6k3</span> - Roll 4d6, keep highest 3</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-epic font-serif">Magic Modifiers</h4>
                  <div className="space-y-2 text-sm text-amber-200/80">
                    <div><span className="text-purple-400">Advantage</span> - Roll 2d20, take higher</div>
                    <div><span className="text-red-400">Disadvantage</span> - Roll 2d20, take lower</div>
                    <div><span className="text-green-400">Critical Hit</span> - Natural 20 on attack</div>
                    <div><span className="text-orange-400">Critical Fail</span> - Natural 1 on attack</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dice History Sidebar */}
        <div className="space-y-8">
          <DiceHistory rolls={rollHistory} />

          {/* Dice Stats */}
          <Card className="card-epic">
            <CardHeader>
              <CardTitle className="text-xl text-epic font-serif flex items-center">
                <span className="mr-2 text-2xl animate-pulse-slow">📊</span>
                Session Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-epic">{rollHistory.length}</div>
                  <div className="text-xs text-amber-200/60">Total Rolls</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-epic">
                    {rollHistory.filter(r => r.criticalHit).length}
                  </div>
                  <div className="text-xs text-amber-200/60">Nat 20s</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-epic">
                    {rollHistory.filter(r => r.criticalFail).length}
                  </div>
                  <div className="text-xs text-amber-200/60">Nat 1s</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-epic">
                    {rollHistory.length > 0 
                      ? Math.round(rollHistory.reduce((acc, r) => acc + r.total, 0) / rollHistory.length)
                      : 0
                    }
                  </div>
                  <div className="text-xs text-amber-200/60">Avg Roll</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dice Collection */}
          <Card className="card-legendary">
            <CardHeader>
              <CardTitle className="text-xl text-legendary font-serif flex items-center">
                <span className="mr-2 text-2xl animate-pulse-slow">🎲</span>
                Sacred Dice Set
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { sides: 4, emoji: '🔺' },
                  { sides: 6, emoji: '🎲' },
                  { sides: 8, emoji: '🔹' },
                  { sides: 10, emoji: '🔸' },
                  { sides: 12, emoji: '🔷' },
                  { sides: 20, emoji: '🎯' },
                  { sides: 100, emoji: '💯' },
                  { sides: 2, emoji: '🪙' }
                ].map((die, index) => (
                  <div 
                    key={die.sides}
                    className="text-center p-3 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="text-2xl mb-1 animate-float" style={{ animationDelay: `${index * 0.1}s` }}>
                      {die.emoji}
                    </div>
                    <div className="text-xs text-amber-200/80">d{die.sides}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}