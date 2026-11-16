// Top-level rugby from ESPN's public scoreboard (no key needed): the home page strip, the ticker
// above the menu and the /pasaules-regbijs page. It is an unofficial feed, so every step tolerates
// missing fields and failures return nothing.

// Home page section id
export const WORLD_RUGBY_ANCHOR = 'pasaules-regbijs'
export const WORLD_RUGBY_PATH = '/pasaules-regbijs'

export type WorldTeam = { name: string; logo: string | null; score: string | null; winner: boolean }

export type WorldMatch = {
  id: string
  date: string
  status: string
  competition: string
  competitionSlug: string
  home: WorldTeam
  away: WorldTeam
  venue: string | null
  city: string | null
}

// ESPN league ids; Champions Cup keeps the strip alive between the international windows
export const WORLD_COMPETITIONS = [
  {
    id: '17567', slug: 'naciju-cempionats', label: 'Nāciju čempionāts',
    description: 'Jaunais World Rugby izlašu turnīrs (no 2026. gada): Sešu nāciju izlases spēlē pret Jaunzēlandi, Dienvidāfriku, Austrāliju, Argentīnu, Japānu un Fidži. Spēles jūlijā un novembrī, sezonu noslēdz finālu nedēļas nogale.',
  },
  {
    id: '180659', slug: 'sesu-naciju-turnirs', label: 'Sešu nāciju turnīrs',
    description: 'Eiropas vecākais izlašu turnīrs: Anglija, Francija, Īrija, Itālija, Skotija un Velsa. Notiek katru gadu februārī un martā.',
  },
  {
    id: '244293', slug: 'rugby-championship', label: 'Rugby Championship',
    description: 'Dienvidu puslodes spēcīgāko izlašu turnīrs: Jaunzēlande, Dienvidāfrika, Austrālija un Argentīna.',
  },
  {
    id: '164205', slug: 'pasaules-kauss', label: 'Pasaules kauss',
    description: 'Lielākais regbija turnīrs, notiek reizi četros gados. 2027. gadā tas norisināsies Austrālijā, pirmo reizi ar 24 komandām.',
  },
  {
    id: '268565', slug: 'lions-ture', label: 'Lions tūre',
    description: 'Britu un īru lauvas: Anglijas, Īrijas, Skotijas un Velsas labāko spēlētāju izlase, kas reizi četros gados dodas tūrē uz Dienvidu puslodi.',
  },
  {
    id: '271937', slug: 'cempionu-kauss', label: 'Čempionu kauss',
    description: 'Eiropas spēcīgāko klubu turnīrs (Anglija, Francija, Īrija, Skotija, Velsa, Itālija un Dienvidāfrika). Grupu spēles decembrī un janvārī, fināls maijā.',
  },
]

export type CompetitionSlug = string

export function competitionFromParam(param: string | string[] | undefined): CompetitionSlug | null {
  const value = Array.isArray(param) ? param[0] : param
  return WORLD_COMPETITIONS.some((c) => c.slug === value) ? (value as string) : null
}

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
  return { name: teamNameLv(name), logo: str(team?.logo), score: str(competitor?.score), winner: competitor?.winner === true }
}

export function parseScoreboard(json: unknown, competition: { label: string; slug: string }): WorldMatch[] {
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
      competition: competition.label,
      competitionSlug: competition.slug,
      home,
      away,
      venue: str(obj(comp?.venue)?.fullName),
      city: str(obj(obj(comp?.venue)?.address)?.city),
    })
  }
  return matches
}

const yyyymmdd = (iso: string) => iso.slice(0, 10).replace(/-/g, '')

const DAY_MS = 86_400_000
const WINDOW_DAYS = 120

// League calendars list match days either as ISO strings or as { startDate } / { entries: [...] } objects.
// Returns the YYYYMMDD days between two dates (inclusive), in order.
export function calendarDays(calendar: unknown, from: Date, to: Date): string[] {
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
  const first = yyyymmdd(from.toISOString())
  const last = yyyymmdd(to.toISOString())
  const days = Array.from(new Set(isoDates.filter((d) => /^\d{4}-\d{2}-\d{2}/.test(d)).map(yyyymmdd)))
  return days.filter((d) => d >= first && d <= last).sort()
}

// Only days in the next few months count: a strip of "upcoming" games half a year away is not useful
export function upcomingCalendarDates(calendar: unknown, now: Date, max: number): string[] {
  return calendarDays(calendar, now, new Date(now.getTime() + WINDOW_DAYS * DAY_MS)).slice(0, max)
}

const uniqueById = () => {
  const seen = new Set<string>()
  return (m: WorldMatch) => (seen.has(m.id) ? false : (seen.add(m.id), true))
}

export function pickUpcoming(matches: WorldMatch[], now: Date, limit: number): WorldMatch[] {
  return matches
    .filter((m) => m.status === 'STATUS_SCHEDULED' && new Date(m.date) > now)
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter(uniqueById())
    .slice(0, limit)
}

export function pickRecent(matches: WorldMatch[], now: Date, days: number): WorldMatch[] {
  const since = now.getTime() - days * DAY_MS
  return matches
    .filter((m) => m.status === 'STATUS_FINAL' && new Date(m.date).getTime() >= since && new Date(m.date) <= now)
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter(uniqueById())
}

const rigaDay = (iso: string) => new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Europe/Riga' })

// Consecutive matches on the same Latvian calendar day, in the order given
export function groupByRigaDay(matches: WorldMatch[]): { day: string; matches: WorldMatch[] }[] {
  const groups: { day: string; matches: WorldMatch[] }[] = []
  for (const match of matches) {
    const day = rigaDay(match.date)
    const last = groups[groups.length - 1]
    if (last?.day === day) last.matches.push(match)
    else groups.push({ day, matches: [match] })
  }
  return groups
}

const capitalise = (text: string) => `${text.charAt(0).toUpperCase()}${text.slice(1)}`

// "2026-11-21" → "Sestdiena, 21. novembris"
export function formatDayHeading(day: string): string {
  return capitalise(new Date(`${day}T12:00:00Z`).toLocaleDateString('lv-LV', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Riga',
  }))
}

// "20271001" or an ISO date → "2027. g. 1. okt."
export function formatShortDate(day: string): string {
  const iso = /^\d{8}$/.test(day) ? `${day.slice(0, 4)}-${day.slice(4, 6)}-${day.slice(6)}T12:00:00Z` : day
  return new Date(iso).toLocaleDateString('lv-LV', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Riga' })
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('lv-LV', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Riga' })
}

// "Sestd., 21. nov. · 16:10" in Latvian time; the timezone is pinned so server and browser agree
export function formatKickoff(iso: string): string {
  const date = new Date(iso)
  const day = date.toLocaleDateString('lv-LV', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Europe/Riga' })
  const time = date.toLocaleTimeString('lv-LV', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Riga' })
  return `${capitalise(day)} · ${time}`
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

type League = (typeof WORLD_COMPETITIONS)[number]

// The default scoreboard holds the current week plus the league calendar; other match days are fetched by date
async function loadLeague(league: League, pickDays: (calendar: unknown) => string[]) {
  const current = await fetchJson(`${SCOREBOARD}/${league.id}/scoreboard`)
  const calendar = obj(Array.isArray(obj(current)?.leagues) ? (obj(current)!.leagues as unknown[])[0] : null)?.calendar
  const days = pickDays(calendar)
  const others = await Promise.all(days.map((d) => fetchJson(`${SCOREBOARD}/${league.id}/scoreboard?dates=${d}`)))
  return { calendar, matches: [current, ...others].flatMap((json) => parseScoreboard(json, league)) }
}

export async function getUpcomingWorldMatches(limit = 6, now: Date = new Date()): Promise<WorldMatch[]> {
  const perLeague = await Promise.all(
    WORLD_COMPETITIONS.map((league) => loadLeague(league, (calendar) => upcomingCalendarDates(calendar, now, 3)))
  )
  return pickUpcoming(perLeague.flatMap((l) => l.matches), now, limit)
}

export type WorldSchedule = {
  upcoming: WorldMatch[]
  recent: WorldMatch[]
  // Next match day per tournament (YYYYMMDD), also beyond the window, e.g. a World Cup a year away
  nextDay: Record<CompetitionSlug, string | null>
}

// Everything for the /pasaules-regbijs page: the next weeks, the last week's results, and when each tournament resumes
export async function getWorldRugbySchedule(now: Date = new Date(), daysAhead = 60, daysBack = 7): Promise<WorldSchedule> {
  const from = new Date(now.getTime() - daysBack * DAY_MS)
  const to = new Date(now.getTime() + daysAhead * DAY_MS)
  const perLeague = await Promise.all(
    WORLD_COMPETITIONS.map(async (league) => {
      const loaded = await loadLeague(league, (calendar) => calendarDays(calendar, from, to).slice(0, 14))
      const future = calendarDays(loaded.calendar, now, new Date(now.getTime() + 3 * 365 * DAY_MS))
      return { slug: league.slug, matches: loaded.matches, next: future[0] ?? null }
    })
  )
  const all = perLeague.flatMap((l) => l.matches)
  return {
    upcoming: pickUpcoming(all, now, 200).filter((m) => new Date(m.date) <= to),
    recent: pickRecent(all, now, daysBack),
    nextDay: Object.fromEntries(perLeague.map((l) => [l.slug, l.next])),
  }
}
