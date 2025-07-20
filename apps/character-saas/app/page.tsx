import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import EpicFeatureCard from '@/components/EpicFeatureCard'
import HeroSection from '@/components/HeroSection'
import TestimonialSection from '@/components/TestimonialSection'

type FeatureType = {
  title: string
  subtitle: string
  description: string
  icon: string
  rarity: 'epic' | 'legendary' | 'rare' | 'common'
  details: string[]
}

export default function Home() {
  const features: FeatureType[] = [
    {
      title: "Ancient Wisdom",
      subtitle: "Official D&D 5e Format",
      description: "Crafted with the ancient knowledge of the official Wizards of the Coast character sheet format. Every field, every calculation, blessed by the gods of gaming.",
      icon: "📜",
      rarity: "legendary",
      details: [
        "Complete official D&D 5e layout",
        "All standard fields and sections", 
        "Wizards-approved formatting",
        "Tournament legal sheets"
      ]
    },
    {
      title: "Arcane Calculations",
      subtitle: "Mystical Auto-Math",
      description: "Witness the power of arcane algorithms! Ability modifiers, skill bonuses, and saving throws calculated with magical precision. No more math errors in your epic journey.",
      icon: "🔮",
      rarity: "epic",
      details: [
        "Auto ability modifier calculations",
        "Dynamic skill bonus updates", 
        "Proficiency bonus tracking",
        "Combat stat automation"
      ]
    },
    {
      title: "Tome of Legends",
      subtitle: "PDF Scroll Export",
      description: "Transform your digital character into an ancient tome! Export your hero's tale as a mystical PDF scroll, ready for any tavern table or dragon's lair.",
      icon: "📋",
      rarity: "epic", 
      details: [
        "High-quality PDF generation",
        "Print-ready formatting",
        "Custom character themes",
        "Instant download magic"
      ]
    },
    {
      title: "Dragon's Dice",
      subtitle: "3D Dice Enchantment",
      description: "Summon the power of 3D animated dice! Watch as mystical d20s tumble through dimensions, bringing fortune or doom to your adventures.",
      icon: "🎲",
      rarity: "legendary",
      details: [
        "Realistic 3D dice physics",
        "Multiple dice sets",
        "Advantage/disadvantage rolls",
        "Epic roll animations"
      ]
    },
    {
      title: "Portrait Magic",
      subtitle: "AI Character Art",
      description: "Conjure stunning character portraits with the power of AI magic! Transform your written descriptions into breathtaking visual representations.",
      icon: "🎨",
      rarity: "legendary",
      details: [
        "AI-generated character art",
        "Multiple art styles",
        "Customizable features",
        "High-resolution portraits"
      ]
    },
    {
      title: "Spellbook Codex",
      subtitle: "Magical Spell Manager",
      description: "Organize your arcane knowledge with our legendary spellbook system. Track spell slots, manage prepared spells, and unleash magical mayhem!",
      icon: "📚",
      rarity: "epic",
      details: [
        "Complete D&D spell database",
        "Spell slot tracking",
        "Custom spell creation",
        "Quick reference cards"
      ]
    }
  ]

  const testimonials = [
    {
      name: "Gandalf the Gray",
      title: "Wizard of the White Council",
      quote: "This magical contraption has transformed my character creation! No longer do I struggle with arithmetic when the fate of Middle-earth hangs in the balance.",
      avatar: "🧙‍♂️",
      rating: 5
    },
    {
      name: "Aragorn, King of Gondor", 
      title: "Ranger of the North",
      quote: "As a ranger who's traveled far and wide, I can say this tool is as reliable as Andúril in battle. The PDF exports are perfect for any adventure!",
      avatar: "👑",
      rating: 5
    },
    {
      name: "Legolas Greenleaf",
      title: "Prince of the Woodland Realm", 
      quote: "The character sheets are as beautiful as the forests of Mirkwood. Even my elven eyes are impressed by the attention to detail!",
      avatar: "🏹",
      rating: 5
    }
  ]

  return (
    <div className="space-y-20">
      <HeroSection />
      
      {/* Epic Stats */}
      <section className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Heroes Forged", value: "50,000+", icon: "⚔️" },
            { label: "Dice Rolled", value: "2.5M+", icon: "🎲" },
            { label: "Adventures Born", value: "10,000+", icon: "🗺️" }, 
            { label: "Dragons Slain", value: "∞", icon: "🐉" }
          ].map((stat, index) => (
            <div key={stat.label} className="text-center animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
              <div className="text-4xl mb-2 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-epic mb-1">{stat.value}</div>
              <div className="text-amber-200/80 font-serif">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-legendary mb-4 title-ancient">
            Legendary Features
          </h2>
          <p className="text-xl text-amber-200/80 font-serif max-w-3xl mx-auto">
            Discover the mystical powers that make Epic Character Forge the ultimate destination for D&D heroes
          </p>
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2 text-3xl">
              <span className="animate-float">⭐</span>
              <span className="animate-float" style={{ animationDelay: '0.5s' }}>✨</span>
              <span className="animate-float" style={{ animationDelay: '1s' }}>🌟</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <EpicFeatureCard 
              key={feature.title}
              {...feature}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl animate-pulse-slow"></div>
          <div className="relative z-10 p-12">
            <div className="text-6xl mb-6 animate-float">⚔️</div>
            <h2 className="text-4xl font-bold text-legendary mb-6 title-ancient">
              Your Legend Awaits
            </h2>
            <p className="text-xl text-amber-200/80 font-serif mb-8 max-w-2xl mx-auto">
              Join thousands of heroes who have already begun their epic journey. 
              Forge your character, roll the dice, and write your legend in the annals of history!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="btn-legendary text-lg px-8 py-4">
                <Link href="/characters/new">
                  🔥 Forge Your Hero
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/10 text-lg px-8 py-4">
                <Link href="/characters">
                  👥 View Heroes Gallery
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection testimonials={testimonials} />

      {/* Epic Journey Steps */}
      <section className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-epic mb-4 title-ancient">
            Begin Your Epic Journey
          </h2>
          <p className="text-lg text-amber-200/80 font-serif">
            Three simple steps to legendary character creation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Create",
              description: "Forge your character with our intuitive creation tools",
              icon: "⚒️"
            },
            {
              step: "2", 
              title: "Customize",
              description: "Add epic details, spells, and equipment to your hero",
              icon: "🎨"
            },
            {
              step: "3",
              title: "Adventure",
              description: "Export, share, and begin your legendary adventures",
              icon: "🗺️"
            }
          ].map((item, index) => (
            <div key={item.step} className="text-center animate-fade-in" style={{ animationDelay: `${index * 300}ms` }}>
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-3xl font-bold text-black font-serif shadow-2xl animate-glow">
                  {item.step}
                </div>
                <div className="absolute -top-2 -right-2 text-3xl animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                  {item.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-epic mb-3 font-serif">{item.title}</h3>
              <p className="text-amber-200/80">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}