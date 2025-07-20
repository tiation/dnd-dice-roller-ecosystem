'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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

interface DiceHistoryProps {
  rolls: DiceRoll[]
}

export default function DiceHistory({ rolls }: DiceHistoryProps) {
  const getResultClass = (roll: DiceRoll) => {
    if (roll.criticalHit) return 'text-green-400 border-green-500/50 bg-green-900/20'
    if (roll.criticalFail) return 'text-red-400 border-red-500/50 bg-red-900/20'
    if (roll.total >= 15) return 'text-yellow-400 border-yellow-500/50 bg-yellow-900/20'
    return 'text-amber-100 border-slate-500/50 bg-slate-700/20'
  }

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getResultIcon = (roll: DiceRoll) => {
    if (roll.criticalHit) return '🌟'
    if (roll.criticalFail) return '💀'
    if (roll.total >= 15) return '⭐'
    if (roll.total >= 10) return '✨'
    return '🎲'
  }

  return (
    <Card className="card-epic">
      <CardHeader>
        <CardTitle className="text-xl text-epic font-serif flex items-center">
          <span className="mr-2 text-2xl animate-pulse-slow">📜</span>
          Roll Chronicle
        </CardTitle>
        <CardDescription className="text-amber-200/70">
          Your dice rolling history
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {rolls.length === 0 ? (
          <div className="text-center py-8 text-amber-200/60">
            <div className="text-4xl mb-3 animate-float">🎲</div>
            <p className="font-serif italic">
              No rolls yet...
              <br />
              Cast your first dice!
            </p>
          </div>
        ) : (
          rolls.map((roll, index) => (
            <div
              key={roll.id}
              className={cn(
                "p-3 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] animate-fade-in",
                getResultClass(roll)
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg animate-float" style={{ animationDelay: `${index * 0.1}s` }}>
                    {getResultIcon(roll)}
                  </span>
                  <span className="font-bold text-2xl">
                    {roll.total}
                  </span>
                  {roll.advantage && <span className="text-green-400 text-xs">📈</span>}
                  {roll.disadvantage && <span className="text-red-400 text-xs">📉</span>}
                </div>
                <div className="text-xs opacity-60 font-mono">
                  {formatTime(roll.timestamp)}
                </div>
              </div>
              
              <div className="text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono">{roll.dice}</span>
                  <span className="opacity-80">
                    [{roll.result.join(', ')}]
                    {roll.modifier !== 0 && (
                      <span className="ml-1">
                        {roll.modifier > 0 ? '+' : ''}{roll.modifier}
                      </span>
                    )}
                  </span>
                </div>
                
                {roll.criticalHit && (
                  <div className="text-green-400 font-semibold text-center animate-pulse">
                    CRITICAL SUCCESS!
                  </div>
                )}
                
                {roll.criticalFail && (
                  <div className="text-red-400 font-semibold text-center animate-pulse">
                    CRITICAL FAILURE!
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}