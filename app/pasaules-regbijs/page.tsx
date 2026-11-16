import { Metadata } from 'next'
import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { pageUrl } from '@/lib/site'
import {
  WORLD_COMPETITIONS, WORLD_RUGBY_PATH, competitionFromParam, formatDayHeading, formatKickoff, formatShortDate,
  formatTime, getWorldRugbySchedule, groupByRigaDay, type WorldMatch, type WorldTeam,
} from '@/lib/world-rugby'

const TITLE = 'Pasaules regbijs | RK Fēnikss'
const DESCRIPTION =
  'Nākamās lielās regbija spēles un nesenie rezultāti: Nāciju čempionāts, Sešu nāciju turnīrs, Pasaules kauss un Eiropas Čempionu kauss. Laiki pēc Latvijas laika.'

export const metadata: Metadata = {
  alternates: { canonical: pageUrl(WORLD_RUGBY_PATH) },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { url: pageUrl(WORLD_RUGBY_PATH), title: TITLE, description: DESCRIPTION },
}

const filterHref = (slug: string | null) => (slug ? `${WORLD_RUGBY_PATH}?turnirs=${slug}` : WORLD_RUGBY_PATH)

function Crest({ team, size = 32 }: { team: WorldTeam; size?: number }) {
  if (!team.logo) return <span className="block shrink-0 rounded-full bg-club-pale" style={{ width: size, height: size }} />
  // Remote crests from ESPN; plain <img> keeps them out of the image optimiser
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={team.logo} alt="" width={size} height={size} loading="lazy" className="shrink-0 object-contain" style={{ width: size, height: size }} />
}

const place = (m: WorldMatch) => [m.venue, m.city].filter(Boolean).join(', ')

function UpcomingRow({ match }: { match: WorldMatch }) {
  return (
    <li className="grid grid-cols-[56px_1fr] md:grid-cols-[72px_1fr_220px] items-center gap-x-4 gap-y-1.5 py-4 border-b border-[#e5e7eb] last:border-b-0">
      <span className="font-display text-xl font-bold text-club row-span-2 md:row-span-1">{formatTime(match.date)}</span>
      <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:gap-x-3 min-w-0">
        <span className="inline-flex items-center gap-2.5 min-w-0">
          <Crest team={match.home} />
          <span className="font-display text-lg font-bold uppercase text-[#111] truncate">{match.home.name}</span>
        </span>
        <span className="hidden md:inline font-cond text-sm font-semibold text-[#999]">pret</span>
        <span className="inline-flex items-center gap-2.5 min-w-0">
          <Crest team={match.away} />
          <span className="font-display text-lg font-bold uppercase text-[#111] truncate">{match.away.name}</span>
        </span>
      </div>
      <div className="col-start-2 md:col-start-3 md:text-right min-w-0">
        <span className="block font-cond text-xs font-bold tracking-[1.5px] uppercase text-club">{match.competition}</span>
        {place(match) && <span className="block font-body text-sm text-[#888] truncate">{place(match)}</span>}
      </div>
    </li>
  )
}

function ResultTeam({ team }: { team: WorldTeam }) {
  return (
    <span className={`flex items-center gap-2.5 min-w-0 ${team.winner ? 'text-[#111]' : 'text-[#999]'}`}>
      <Crest team={team} size={26} />
      <span className="font-display text-base font-bold uppercase truncate">{team.name}</span>
      <span className="ml-auto font-display text-xl font-bold tabular-nums">{team.score ?? '–'}</span>
    </span>
  )
}

function ResultCard({ match }: { match: WorldMatch }) {
  return (
    <li className="border border-[#e5e7eb] bg-white p-4 flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="font-cond text-[11px] font-bold tracking-[1.5px] uppercase text-club truncate">{match.competition}</span>
        <span className="font-cond text-xs font-semibold tracking-[1px] uppercase text-[#888] whitespace-nowrap">{formatKickoff(match.date)}</span>
      </div>
      <ResultTeam team={match.home} />
      <ResultTeam team={match.away} />
      {place(match) && <span className="font-body text-xs text-[#888] truncate">{place(match)}</span>}
    </li>
  )
}

const sectionTitle = 'font-display text-3xl md:text-4xl font-bold uppercase text-club leading-[1.15] tracking-tight'

export default async function WorldRugbyPage({ searchParams }: { searchParams: { turnirs?: string | string[] } }) {
  const schedule = await getWorldRugbySchedule()
  const active = competitionFromParam(searchParams.turnirs)
  const only = (list: WorldMatch[]) => (active ? list.filter((m) => m.competitionSlug === active) : list)
  const upcoming = only(schedule.upcoming)
  const recent = only(schedule.recent)
  const withMatches = new Set([...schedule.upcoming, ...schedule.recent].map((m) => m.competitionSlug))
  const filters = WORLD_COMPETITIONS.filter((c) => withMatches.has(c.slug))
  const activeLabel = WORLD_COMPETITIONS.find((c) => c.slug === active)?.label

  return (
    <MainLayout currentPage="WORLD">
      <main className="flex-1">
        {/* Hero, same look as the news page */}
        <section className="relative h-[300px] md:h-[380px] bg-[#111] overflow-hidden">
          <div className="absolute inset-0">
            <NextImage src="/AboutUs/parallax.jpg" alt="" fill className="object-cover opacity-30 scale-105 blur-[2px]" priority />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 h-full flex items-end pb-12">
            <div>
              <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-club-mint mb-3 block">
                Izlases un Eiropas klubi
              </span>
              <h1 className="font-display text-[clamp(44px,6vw,80px)] font-bold uppercase text-white leading-[1.15] tracking-tight">
                Pasaules regbijs
              </h1>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-16 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            {filters.length > 1 && (
              <nav aria-label="Turnīri" className="flex flex-wrap gap-2.5 mb-10">
                {[null, ...filters.map((c) => c.slug)].map((slug) => {
                  const isActive = slug === active
                  return (
                    <Link
                      key={slug ?? 'all'}
                      href={filterHref(slug)}
                      scroll={false}
                      aria-current={isActive ? 'page' : undefined}
                      className={`px-5 py-2.5 font-cond text-xs font-bold tracking-[1.5px] uppercase border-2 transition-colors duration-200 ${
                        isActive ? 'bg-[#111] border-[#111] text-white' : 'border-[#ddd] text-[#111] hover:border-[#111]'
                      }`}
                    >
                      {slug ? WORLD_COMPETITIONS.find((c) => c.slug === slug)?.label : 'Visi turnīri'}
                    </Link>
                  )
                })}
              </nav>
            )}

            <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
              <h2 className={sectionTitle}>Nākamās spēles</h2>
              <span className="font-cond text-xs tracking-[1.5px] uppercase text-[#999]">Laiks: Latvijā · Dati: ESPN</span>
            </div>

            {upcoming.length === 0 ? (
              <p className="py-10 font-body text-[#666]">
                {activeLabel ? `${activeLabel}: tuvāko divu mēnešu laikā spēļu nav.` : 'Tuvāko divu mēnešu laikā lielu spēļu nav.'}{' '}
                Turnīru sarakstā zemāk redzams, kad tie atsāksies.
              </p>
            ) : (
              <div className="grid gap-10">
                {groupByRigaDay(upcoming).map((group) => (
                  <div key={group.day}>
                    <h3 className="font-cond text-sm font-bold tracking-[2px] uppercase text-[#111] pb-2 border-b-2 border-club">
                      {formatDayHeading(group.day)}
                    </h3>
                    <ul>
                      {group.matches.map((match) => <UpcomingRow key={match.id} match={match} />)}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {recent.length > 0 && (
          <section className="py-14 md:py-16 bg-club-pale">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
              <h2 className={`${sectionTitle} mb-6`}>Nesenie rezultāti</h2>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recent.map((match) => <ResultCard key={match.id} match={match} />)}
              </ul>
            </div>
          </section>
        )}

        <section className="py-14 md:py-16 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            <h2 className={`${sectionTitle} mb-6`}>Turnīri</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WORLD_COMPETITIONS.map((c) => {
                const next = schedule.nextDay[c.slug]
                return (
                  <li key={c.slug} className="border border-[#e5e7eb] border-t-[3px] border-t-club p-5 flex flex-col gap-3">
                    <h3 className="font-display text-xl font-bold uppercase text-[#111]">{c.label}</h3>
                    <p className="font-body text-sm text-[#555] leading-relaxed">{c.description}</p>
                    <div className="mt-auto pt-2 flex items-center justify-between gap-3">
                      <span className="font-cond text-xs font-semibold tracking-[1px] uppercase text-[#888]">
                        {next ? `Nākamā spēle: ${formatShortDate(next)}` : 'Datumi vēl nav zināmi'}
                      </span>
                      {withMatches.has(c.slug) && (
                        <Link href={filterHref(c.slug)} scroll={false} className="font-cond text-xs font-bold tracking-[1.5px] uppercase text-club hover:underline whitespace-nowrap">
                          Skatīt spēles
                        </Link>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
            <p className="mt-8 font-body text-xs text-[#999]">
              Dati no ESPN, atjaunojas reizi stundā. Laiki norādīti pēc Latvijas laika.
            </p>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
