'use client'

import { useState } from 'react'
import { default as NextImage } from 'next/image'
import { TeamPlayer } from '@/types/supabase'
import { prepareImagePath } from '@/lib/supabase'

interface HomePlayersSectionProps {
  players: TeamPlayer[]
}

const fallbackPlayers: { name: string; position: string; image: string }[] = [
  {
    name: 'Kārlis Bērziņš',
    position: 'Āķis / Hooker',
    image: '/placeholder.svg?height=520&width=400&text=Player+1',
  },
  {
    name: 'Rihards Ozoliņš',
    position: 'Atpakaļsargs / Fullback',
    image: '/placeholder.svg?height=520&width=400&text=Player+2',
  },
  {
    name: 'Mārtiņš Kalniņš',
    position: 'Pussargs / Fly-half',
    image: '/placeholder.svg?height=520&width=400&text=Player+3',
  },
]

export function HomePlayersSection({ players }: HomePlayersSectionProps) {
  const [page, setPage] = useState(0)

  const items = players.length > 0
    ? players.map(p => ({
        id: p.id,
        name: p.name,
        position: p.position || '',
        image: p.image_url ? prepareImagePath(p.image_url) : '/placeholder.svg?height=520&width=400&text=Player',
      }))
    : fallbackPlayers.map((p, i) => ({ id: String(i), ...p }))

  const perPage = 3
  const totalPages = Math.ceil(items.length / perPage)
  const visibleItems = items.slice(page * perPage, page * perPage + perPage)

  const goPrev = () => setPage(p => (p === 0 ? totalPages - 1 : p - 1))
  const goNext = () => setPage(p => (p === totalPages - 1 ? 0 : p + 1))

  return (
    <section className="bg-[#111] bg-stripes-dark relative overflow-visible pt-20 pb-0 mb-20">
      <div className="relative z-[2] max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-display text-[clamp(60px,7vw,100px)] font-bold uppercase text-white leading-[0.85] tracking-tight">
            Spēlētāji
          </h2>
          <div className="flex gap-2">
            <button
              onClick={goPrev}
              className="w-11 h-11 border-2 border-white/30 bg-transparent text-white text-xl grid place-items-center cursor-pointer transition-all duration-200 hover:border-white hover:bg-white/[0.08]"
              aria-label="Iepriekšējie"
            >
              ‹
            </button>
            <button
              onClick={goNext}
              className="w-11 h-11 border-2 border-white/30 bg-transparent text-white text-xl grid place-items-center cursor-pointer transition-all duration-200 hover:border-white hover:bg-white/[0.08]"
              aria-label="Nākamie"
            >
              ›
            </button>
          </div>
        </div>

        {/* Player cards - always 3 visible, crossfade on page change */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 translate-y-[60px] sm:translate-y-[50px] lg:translate-y-[60px]">
          {visibleItems.map((player) => (
            <div
              key={player.id}
              className="group cursor-pointer overflow-hidden transition-transform duration-300 hover:-translate-y-2 animate-[fadeIn_0.4s_ease-out] bg-[#f5f5f5]"
            >
              <div className="relative h-[360px] sm:h-[400px] lg:h-[520px] overflow-hidden">
                <NextImage
                  src={player.image}
                  alt={player.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-display text-3xl font-bold uppercase tracking-[1px] text-white leading-tight">
                    {player.name}
                  </p>
                  <p className="font-cond text-sm font-bold tracking-[3px] uppercase text-white/60 mt-1">
                    {player.position}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Page dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 translate-y-[80px] sm:translate-y-[70px] lg:translate-y-[80px]">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-[3px] transition-all duration-300 ${
                  i === page ? 'w-8 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Lapa ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
