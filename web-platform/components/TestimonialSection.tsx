'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface Testimonial {
  name: string
  title: string
  quote: string
  avatar: string
  rating: number
}

interface TestimonialSectionProps {
  testimonials: Testimonial[]
}

export default function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-2xl ${
          i < rating ? 'text-yellow-400 animate-pulse' : 'text-gray-600'
        }`}
        style={{ animationDelay: `${i * 100}ms` }}
      >
        ⭐
      </span>
    ))
  }

  return (
    <section className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-epic mb-4 title-ancient">
          Tales from Fellow Heroes
        </h2>
        <p className="text-lg text-amber-200/80 font-serif">
          Hear the legendary stories from heroes across the realms
        </p>
        <div className="flex justify-center mt-6 space-x-2">
          <span className="animate-float text-3xl">🗡️</span>
          <span className="animate-float text-3xl" style={{ animationDelay: '0.5s' }}>🛡️</span>
          <span className="animate-float text-3xl" style={{ animationDelay: '1s' }}>⚔️</span>
        </div>
      </div>

      {/* Main Testimonial Display */}
      <div className="max-w-4xl mx-auto mb-12">
        <Card className="card-legendary relative overflow-hidden min-h-[300px]">
          <CardContent className="p-8 text-center relative z-10">
            {/* Avatar */}
            <div className="text-8xl mb-6 animate-float">
              {testimonials[currentTestimonial].avatar}
            </div>

            {/* Quote */}
            <blockquote className="text-xl md:text-2xl text-amber-100 font-serif italic mb-6 leading-relaxed">
              "{testimonials[currentTestimonial].quote}"
            </blockquote>

            {/* Rating */}
            <div className="flex justify-center space-x-1 mb-4">
              {renderStars(testimonials[currentTestimonial].rating)}
            </div>

            {/* Author */}
            <div className="text-center">
              <h4 className="text-xl font-bold text-epic font-serif mb-1">
                {testimonials[currentTestimonial].name}
              </h4>
              <p className="text-amber-300/80 text-sm">
                {testimonials[currentTestimonial].title}
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 left-4 text-3xl opacity-20 animate-float">✨</div>
            <div className="absolute top-4 right-4 text-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🌟</div>
            <div className="absolute bottom-4 left-4 text-2xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>💫</div>
            <div className="absolute bottom-4 right-4 text-2xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>⭐</div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonial Navigation */}
      <div className="flex justify-center space-x-4 mb-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTestimonial(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentTestimonial
                ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50 scale-150'
                : 'bg-slate-600 hover:bg-slate-500'
            }`}
          />
        ))}
      </div>

      {/* All Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <Card
            key={testimonial.name}
            className={`card-epic cursor-pointer transition-all duration-300 ${
              index === currentTestimonial ? 'ring-2 ring-yellow-500 shadow-2xl shadow-yellow-500/20' : 'hover:scale-105'
            } animate-fade-in`}
            style={{ animationDelay: `${index * 200}ms` }}
            onClick={() => setCurrentTestimonial(index)}
          >
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3 animate-float" style={{ animationDelay: `${index * 0.3}s` }}>
                {testimonial.avatar}
              </div>
              
              <h4 className="font-bold text-epic font-serif mb-1">
                {testimonial.name}
              </h4>
              
              <p className="text-amber-300/60 text-xs mb-3">
                {testimonial.title}
              </p>
              
              <div className="flex justify-center space-x-1 mb-3">
                {Array.from({ length: testimonial.rating }, (_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">⭐</span>
                ))}
              </div>
              
              <p className="text-amber-100/80 text-sm italic">
                "{testimonial.quote.length > 80 
                  ? testimonial.quote.substring(0, 80) + '...' 
                  : testimonial.quote}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Epic Divider */}
      <div className="mt-16 flex items-center justify-center">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent max-w-md"></div>
        <div className="mx-8 text-4xl animate-pulse-slow">
          🏆
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent max-w-md"></div>
      </div>
    </section>
  )
}