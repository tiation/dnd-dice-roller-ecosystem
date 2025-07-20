'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Sword,
  ScrollText,
  Users,
  Dice6,
  Sparkles,
  Crown,
  Shield,
  Flame
} from 'lucide-react'

const navigationItems = [
  {
    name: 'Forge',
    href: '/',
    icon: Flame,
    description: 'Begin your legend'
  },
  {
    name: 'Heroes',
    href: '/characters',
    icon: Users,
    description: 'Your character roster'
  },
  {
    name: 'Features',
    href: '/features',
    icon: Sparkles,
    description: 'Epic tools & systems'
  },
  {
    name: 'Grimoire',
    href: '/grimoire',
    icon: ScrollText,
    description: 'Arcane spell compendium'
  },
  {
    name: 'Dice Oracle',
    href: '/dice',
    icon: Dice6,
    description: 'Sacred dice chamber'
  },
  {
    name: 'Campaigns',
    href: '/campaigns',
    icon: Crown,
    description: 'Epic adventures'
  }
]

export default function EpicNavigation() {
  const pathname = usePathname()

  return (
    <nav className="mt-6">
      <div className="flex flex-wrap justify-center gap-2 md:gap-4">
        {navigationItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
                          (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105",
                "border border-transparent hover:border-yellow-500/50",
                "bg-slate-800/50 hover:bg-slate-700/70 backdrop-blur-sm",
                isActive && "bg-gradient-to-r from-yellow-600/30 to-yellow-500/20 border-yellow-500/70 shadow-lg shadow-yellow-500/20",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background glow effect */}
              <div className={cn(
                "absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                "bg-gradient-to-r from-yellow-500/10 to-transparent"
              )} />
              
              <Icon className={cn(
                "h-5 w-5 transition-all duration-300 relative z-10",
                isActive ? "text-yellow-400" : "text-amber-300 group-hover:text-yellow-400",
                "group-hover:scale-110"
              )} />
              
              <span className={cn(
                "font-semibold font-serif relative z-10 transition-all duration-300",
                isActive ? "text-yellow-300" : "text-amber-100 group-hover:text-yellow-300"
              )}>
                {item.name}
              </span>

              {/* Tooltip */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="bg-slate-900/90 text-amber-100 text-xs px-2 py-1 rounded border border-yellow-500/30 whitespace-nowrap backdrop-blur-sm">
                  {item.description}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900/90 border-l border-t border-yellow-500/30 rotate-45"></div>
                </div>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              )}
            </Link>
          )
        })}
      </div>

      {/* Epic divider */}
      <div className="mt-6 flex items-center justify-center">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
        <div className="mx-4 text-yellow-400 animate-pulse-slow">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
      </div>
    </nav>
  )
}