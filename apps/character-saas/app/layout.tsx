import { Inter } from 'next/font/google'
import './globals.css'
import EpicNavigation from '@/components/EpicNavigation'
import BackgroundEffects from '@/components/BackgroundEffects'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '⚔️ Epic D&D Character Sheets | Forge Your Legend',
  description: 'Create legendary D&D 5e character sheets with epic animations, 3D dice rolling, and immersive fantasy themes. Forge your legend today!',
  keywords: 'D&D, Dungeons & Dragons, character sheets, RPG, fantasy, dice roller, character creator',
  openGraph: {
    title: '⚔️ Epic D&D Character Sheets | Forge Your Legend',
    description: 'Create legendary D&D 5e character sheets with epic animations and immersive fantasy themes',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen relative">
          <BackgroundEffects />
          
          {/* Epic Header */}
          <header className="relative z-10 border-b border-yellow-500/30 bg-slate-900/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl animate-float">⚔️</div>
                  <div>
                    <h1 className="text-3xl font-bold text-epic title-ancient">
                      Epic Character Forge
                    </h1>
                    <p className="text-sm text-amber-200/80 font-serif italic">
                      Where Legends Are Born
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-2xl animate-pulse-slow">🐉</div>
                  <div className="text-2xl animate-float" style={{animationDelay: '1s'}}>🔮</div>
                  <div className="text-2xl animate-pulse-slow" style={{animationDelay: '2s'}}>⚡</div>
                </div>
              </div>
              
              <EpicNavigation />
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8 relative z-10">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>

          {/* Epic Footer */}
          <footer className="relative z-10 border-t border-yellow-500/30 bg-slate-900/90 backdrop-blur-sm mt-20">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center">
                <div className="flex justify-center space-x-8 mb-6 text-2xl">
                  <span className="animate-float">🎲</span>
                  <span className="animate-float" style={{animationDelay: '0.5s'}}>⚔️</span>
                  <span className="animate-float" style={{animationDelay: '1s'}}>🛡️</span>
                  <span className="animate-float" style={{animationDelay: '1.5s'}}>🏰</span>
                  <span className="animate-float" style={{animationDelay: '2s'}}>🐉</span>
                </div>
                <p className="text-amber-200/60 font-serif text-lg mb-2">
                  "Adventure awaits those brave enough to forge their destiny"
                </p>
                <p className="text-amber-200/40 text-sm">
                  Epic Character Forge © 2024 • Built for Heroes, by Heroes
                </p>
                <p className="text-amber-200/30 text-xs mt-2">
                  Not affiliated with Wizards of the Coast • D&D is a trademark of Wizards of the Coast LLC
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}