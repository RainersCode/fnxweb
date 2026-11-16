// Upcoming top-level rugby for the home page, from ESPN's public scoreboard (no key needed).
// It is an unofficial feed, so every step tolerates missing fields and failures return nothing.

// Home page section id; the ticker above the menu links to /#pasaules-regbijs
export const WORLD_RUGBY_ANCHOR = 'pasaules-regbijs'

export type WorldTeam = { name: string; logo: string | null }

export type WorldMatch = {
  id: string
  date: string
  status: string
  competition: string
  home: WorldTeam
  away: WorldTeam
  venue: string | null
}

// ESPN league ids; Champions Cup keeps the strip alive between the international windows
export const WORLD_COMPETITIONS = [
  { id: '17567', label: 'Nāciju čempionāts' },
  { id: '180659', label: 'Sešu nāciju turnīrs' },
  { id: '244293', label: 'Rugby Championship' },
  { id: '164205', label: 'Pasaules kauss' },
  { id: '268565', label: 'Lions tūre' },
  { id: '271937', label: 'Čempionu kauss' },
]

const TEAM_NAMES_LV: Record<string, string> = {
  England: 'Anglija',
  Scotland: 'Skotija',
  Ireland: 'Īrija',
  Wales: 'Velsa',
  France: 'Francija',
  Italy: 'Itālija',
  'New Zealand': 'Jaunzēlande',
  'South Africa': 'Dienvidāfrika',
  Australia: 'Austrālija',
  Argentina: 'Argentīna',
  Japan: 'Japāna',
  Fiji: 'Fidži',
  Samoa: 'Samoa',
  Tonga: 'Tonga',
  Georgia: 'Gruzija',
  Portugal: 'Portugāle',
  Spain: 'Spānija',
  Romania: 'Rumānija',
  Uruguay: 'Urugvaja',
  Chile: 'Čīle',
  Canada: 'Kanāda',
  'United States': 'ASV',
  USA: 'ASV',
  Namibia: 'Namībija',
  Germany: 'Vācija',
  Netherlands: 'Nīderlande',
  Belgium: 'Beļģija',
  'Hong Kong': 'Honkonga',
  'Hong Kong China': 'Honkonga',
  Zimbabwe: 'Zimbabve',
  Russia: 'Krievija',
  'British and Irish Lions': 'Britu un īru lauvas',
  'British & Irish Lions': 'Britu un īru lauvas',
}

export function teamNameLv(name: string): string {
  return TEAM_NAMES_LV[name] ?? name
}

type Json = Record<string, unknown>
const obj = (v: unknown): Json | null => (v && typeof v === 'object' ? (v as Json) : null)
const str = (v: unknown): string | null => (typeof v === 'string' && v ? v : null)

function parseTeam(competitor: Json | null): WorldTeam | null {
  const team = obj(competitor?.team)
  const name = str(team?.displayName) ?? str(team?.name)
  if (!name) return null
  return { name: teamNameLv(name), logo: str(team?.logo) }
}

export function parseScoreboard(json: unknown, competition: string): WorldMatch[] {
  const events = obj(json)?.events
  if (!Array.isArray(events)) return []
  const matches: WorldMatch[] = []
  for (const raw of events) {
    const e = obj(raw)
    const comp = obj(Array.isArray(e?.competitions) ? e?.competitions[0] : null)
    const competitors = Array.isArray(comp?.competitors) ? comp.competitors.map(obj) : []
    const homeRaw = competitors.find((c) => c?.homeAway === 'home') ?? competitors[0] ?? null
    const awayRaw = competitors.find((c) => c?.homeAway === 'away') ?? competitors[1] ?? null
    const id = str(e?.id)
    const date = str(e?.date)
    const home = parseTeam(homeRaw)
    const away = parseTeam(awayRaw)
    if (!id || !date || !home || !away) continue
    matches.push({
      id,
      date,
      status: str(obj(obj(e?.status)?.type)?.name) ?? 'STATUS_SCHEDULED',
      competition,
      home,
      away,
      venue: str(obj(comp?.venue)?.fullName),
    })
  }
  return matches
}

const yyyymmdd = (iso: string) => iso.slice(0, 10).replace(/-/g, '')

const WINDOW_DAYS = 120

// League calendars list match days either as ISO strings or as { startDate } / { entries: [...] } objects.
// Only days in the next few months count: a strip of "upcoming" games half a year away is not useful.
export function upcomingCalendarDates(calendar: unknown, now: Date, max: number): string[] {
  if (!Array.isArray(calendar)) return []
  const isoDates: string[] = []
  for (const item of calendar) {
    if (typeof item === 'string') isoDates.push(item)
    const o = obj(item)
    if (str(o?.startDate)) isoDates.push(o!.startDate as string)
    if (Array.isArray(o?.entries)) for (const entry of o.entries) {
      const start = str(obj(entry)?.startDate)
      if (start) isoDates.push(start)
    }
  }
  const today = yyyymmdd(now.toISOString())
  const last = yyyymmdd(new Date(now.getTime() + WINDOW_DAYS * 86_400_000).toISOString())
  const days = Array.from(new Set(isoDates.filter((d) => /^\d{4}-\d{2}-\d{2}/.test(d)).map(yyyymmdd)))
  return days.filter((d) => d >= today && d <= last).sort().slice(0, max)
}

export function pickUpcoming(matches: WorldMatch[], now: Date, limit: number): WorldMatch[] {
  const seen = new Set<string>()
  return matches
    .filter((m) => m.status === 'STATUS_SCHEDULED' && new Date(m.date) > now)
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true)))
    .slice(0, limit)
}

// "Sestd., 21. nov. · 16:10" in Latvian time; the timezone is pinned so server and browser agree
export function formatKickoff(iso: string): string {
  const date = new Date(iso)
  const day = date.toLocaleDateString('lv-LV', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Europe/Riga' })
  const time = date.toLocaleTimeString('lv-LV', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Riga' })
  return `${day.charAt(0).toUpperCase()}${day.slice(1)} · ${time}`
}

const SCOREBOARD = 'https://site.api.espn.com/apis/site/v2/sports/rugby'

async function fetchJson(url: string): Promise<unknown> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) })
    return res.ok ? await res.json() : null
  } catch {
    return null
  }
}

// The default scoreboard holds the current week plus the league calendar; later match days are fetched by date
export async function getUpcomingWorldMatches(limit = 6, now: Date = new Date()): Promise<WorldMatch[]> {
  const perLeague = await Promise.all(
    WORLD_COMPETITIONS.map(async ({ id, label }) => {
      const current = await fetchJson(`${SCOREBOARD}/${id}/scoreboard`)
      const league = obj(Array.isArray(obj(current)?.leagues) ? (obj(current)!.leagues as unknown[])[0] : null)
      const days = upcomingCalendarDates(league?.calendar, now, 3)
      const later = await Promise.all(days.map((d) => fetchJson(`${SCOREBOARD}/${id}/scoreboard?dates=${d}`)))
      return [current, ...later].flatMap((json) => parseScoreboard(json, label))
    })
  )
  return pickUpcoming(perLeague.flat(), now, limit)
}
