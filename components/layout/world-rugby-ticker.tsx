'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { WORLD_RUGBY_PATH, formatKickoff, type WorldMatch, type WorldTeam } from '@/lib/world-rugby'

// Plain <img>: tiny remote crests in a looping strip don't need the image optimiser
function Crest({ team }: { team: WorldTeam }) {
  if (!team.logo) return null
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={team.logo} alt="" width={20} height={20} className="h-5 w-5 shrink-0 object-contain" />
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

  const items = matches.map((m) => (
    <span key={m.id} className="inline-flex items-center gap-2.5 px-6 whitespace-nowrap">
      <span className="text-club">{formatKickoff(m.date)}</span>
      <span className="inline-flex items-center gap-1.5 text-[#111]">
        <Crest team={m.home} />
        {m.home.name}
        <span className="text-[#999]">–</span>
        {m.away.name}
        <Crest team={m.away} />
      </span>
      <span className="text-[#888]">{m.competition}</span>
      <span aria-hidden className="pl-6 text-[#ccc]">•</span>
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
          className="animate-marquee absolute inset-y-0 left-0 flex items-center group-hover:[animation-play-state:paused] motion-reduce:[animation:none]"
          style={{ animationDuration: `${matches.length * 7}s` }}
        >
          {items}
          <span aria-hidden className="flex items-center">{items}</span>
        </span>
      </span>
    </Link>
  )
}
