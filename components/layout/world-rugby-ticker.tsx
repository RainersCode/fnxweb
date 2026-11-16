'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { WORLD_RUGBY_PATH, formatKickoff, type WorldMatch, type WorldTeam } from '@/lib/world-rugby'

// Plain <img>: tiny remote crests in a looping strip don't need the image optimiser
function Crest({ team }: { team: WorldTeam }) {
  if (!team.logo) return null
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={team.logo} alt="" width={20} height={20} className="block h-5 w-5 min-w-5 shrink-0 object-contain" />
}

// Thin strip above the menu: the next big games scroll past; a click opens the world rugby page
export function WorldRugbyTicker() {
  const [matches, setMatches] = useState<WorldMatch[]>([])

  useEffect(() => {
    let cancelled = false
    fetch('/api/world-rugby')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: WorldMatch[]) => { if (!cancelled && Array.isArray(data)) setMatches(data) })
      .catch(() => { /* no ticker without data */ })
    return () => { cancelled = true }
  }, [])

  if (matches.length === 0) return null

  // Every piece is its own non-shrinking box: Safari mis-sized the row when bare text and
  // crests shared a flex line inside the moving strip, and the crests slid over the words
  const items = matches.map((m) => (
    <span key={m.id} className="flex shrink-0 items-center gap-2.5 whitespace-nowrap px-6">
      <span className="shrink-0 text-club">{formatKickoff(m.date)}</span>
      <Crest team={m.home} />
      <span className="shrink-0 text-[#111]">{m.home.name}</span>
      <span className="shrink-0 text-[#999]">–</span>
      <span className="shrink-0 text-[#111]">{m.away.name}</span>
      <Crest team={m.away} />
      <span className="shrink-0 text-[#888]">{m.competition}</span>
      <span aria-hidden className="shrink-0 pl-4 text-[#ccc]">•</span>
    </span>
  ))

  return (
    <Link
      href={WORLD_RUGBY_PATH}
      aria-label="Pasaules regbija tuvākās spēles"
      className="group flex h-8 items-stretch overflow-hidden border-b border-[#e5e7eb] bg-white font-cond text-[12px] font-semibold uppercase tracking-[1px]"
    >
      <span className="relative z-10 flex shrink-0 items-center border-r border-[#e5e7eb] bg-white px-4 font-bold tracking-[1.5px] text-club sm:px-8 md:px-16">
        Pasaules regbijs
      </span>
      <span className="relative flex-1 overflow-hidden">
        {/* The list is doubled so the -50% loop of the shared marquee animation is seamless */}
        <span
          className="animate-marquee absolute inset-y-0 left-0 flex w-max items-center group-hover:[animation-play-state:paused] motion-reduce:[animation:none]"
          style={{ animationDuration: `${matches.length * 7}s` }}
        >
          {items}
          <span aria-hidden className="flex shrink-0 items-center">{items}</span>
        </span>
      </span>
    </Link>
  )
}
