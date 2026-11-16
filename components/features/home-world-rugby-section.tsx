import { default as NextImage } from 'next/image'
import type { WorldMatch, WorldTeam } from '@/lib/world-rugby'

// Pin the timezone so server and browser render the same kick-off time
const kickoff = (iso: string) => {
  const date = new Date(iso)
  const day = date.toLocaleDateString('lv-LV', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Europe/Riga' })
  const time = date.toLocaleTimeString('lv-LV', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Riga' })
  return `${day.charAt(0).toUpperCase()}${day.slice(1)} · ${time}`
}

function Team({ team }: { team: WorldTeam }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="relative w-7 h-7 shrink-0">
        {team.logo ? (
          <NextImage src={team.logo} alt="" fill sizes="28px" className="object-contain" unoptimized />
        ) : (
          <span className="block w-7 h-7 rounded-full bg-club-pale" />
        )}
      </div>
      <span className="font-display text-base font-bold uppercase text-[#111] leading-tight truncate">{team.name}</span>
    </div>
  )
}

export function HomeWorldRugbySection({ matches }: { matches: WorldMatch[] }) {
  if (matches.length === 0) return null

  return (
    <section className="py-12 md:py-14 bg-white" aria-labelledby="world-rugby-title">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <span className="block font-cond text-xs font-bold tracking-[2.5px] uppercase text-club/70 mb-2">
              Pasaules regbijs
            </span>
            <h2 id="world-rugby-title" className="font-display text-3xl md:text-4xl font-bold uppercase text-club leading-[1.15] tracking-tight">
              Nākamās lielās spēles
            </h2>
          </div>
          <span className="font-cond text-xs tracking-[1.5px] uppercase text-[#999]">Laiks: Latvijā · Dati: ESPN</span>
        </div>

        {/* One scrollable row keeps the strip small on every screen */}
        <ul className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 sm:scroll-px-0 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:thin]">
          {matches.map((match) => (
            <li key={match.id} className="snap-start shrink-0 w-[280px] border border-[#e5e7eb] border-t-[3px] border-t-club p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-cond text-[11px] font-bold tracking-[1.5px] uppercase text-club truncate">
                  {match.competition}
                </span>
                <span className="font-cond text-xs font-semibold tracking-[1px] uppercase text-[#111] whitespace-nowrap">
                  {kickoff(match.date)}
                </span>
              </div>
              <div className="grid gap-2">
                <Team team={match.home} />
                <Team team={match.away} />
              </div>
              {match.venue && (
                <span className="font-body text-xs text-[#888] truncate mt-auto">{match.venue}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
