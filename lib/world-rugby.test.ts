import { describe, it, expect } from 'vitest'
import {
  parseScoreboard, upcomingCalendarDates, calendarDays, pickUpcoming, pickRecent, groupByRigaDay,
  formatDayHeading, teamNameLv, formatKickoff, competitionFromParam, type WorldMatch,
} from './world-rugby'

const NATIONS = { label: 'Nāciju čempionāts', slug: 'naciju-cempionats' }

const competitor = (homeAway: 'home' | 'away', name: string, extra: Record<string, unknown> = {}) => ({
  homeAway,
  team: { displayName: name, ...(extra.logo ? { logo: extra.logo } : {}) },
  ...('score' in extra ? { score: extra.score } : {}),
  ...('winner' in extra ? { winner: extra.winner } : {}),
})

const event = (id: string, date: string, status: string, home: string, away: string, venue?: string) => ({
  id,
  date,
  status: { type: { name: status } },
  competitions: [{
    venue: venue ? { fullName: venue, address: { city: 'Dublin', state: 'Ireland' } } : undefined,
    // ESPN does not always list the home side first
    competitors: [competitor('away', away), competitor('home', home, { logo: `https://a.espncdn.com/${home}.png` })],
  }],
})

describe('parseScoreboard', () => {
  it('turns ESPN events into matches with the home side first and Latvian team names', () => {
    const json = { events: [event('1', '2026-11-21T16:40Z', 'STATUS_SCHEDULED', 'Ireland', 'South Africa', 'Aviva Stadium')] }
    expect(parseScoreboard(json, NATIONS)).toEqual([{
      id: '1',
      date: '2026-11-21T16:40Z',
      status: 'STATUS_SCHEDULED',
      competition: 'Nāciju čempionāts',
      competitionSlug: 'naciju-cempionats',
      home: { name: 'Īrija', logo: 'https://a.espncdn.com/Ireland.png', score: null, winner: false },
      away: { name: 'Dienvidāfrika', logo: null, score: null, winner: false },
      venue: 'Aviva Stadium',
      city: 'Dublin',
    }])
  })

  it('keeps the score and the winner of a finished match', () => {
    const json = { events: [{
      id: '9', date: '2026-11-15T15:10Z', status: { type: { name: 'STATUS_FINAL' } },
      competitions: [{ competitors: [
        competitor('home', 'Scotland', { score: '15', winner: true }),
        competitor('away', 'Australia', { score: '12', winner: false }),
      ] }],
    }] }
    const [m] = parseScoreboard(json, NATIONS)
    expect(m.home).toMatchObject({ name: 'Skotija', score: '15', winner: true })
    expect(m.away).toMatchObject({ name: 'Austrālija', score: '12', winner: false })
    expect(m.venue).toBeNull()
    expect(m.city).toBeNull()
  })

  it('skips malformed events and survives an unexpected payload', () => {
    expect(parseScoreboard({ events: [{ id: 'x' }] }, NATIONS)).toEqual([])
    expect(parseScoreboard(null, NATIONS)).toEqual([])
    expect(parseScoreboard({ code: 400 }, NATIONS)).toEqual([])
  })
})

describe('teamNameLv', () => {
  it('translates national teams and keeps club names as they are', () => {
    expect(teamNameLv('New Zealand')).toBe('Jaunzēlande')
    expect(teamNameLv('Wales')).toBe('Velsa')
    expect(teamNameLv('Leinster')).toBe('Leinster')
  })
})

describe('calendar days', () => {
  const now = new Date('2026-11-16T12:00:00Z')

  it('returns the next match days as YYYYMMDD, within the window and capped', () => {
    const calendar = ['2026-11-08T08:00Z', '2026-11-15T08:00Z', '2026-11-21T08:00Z', '2026-11-27T08:00Z', '2026-11-28T08:00Z', '2027-06-01T08:00Z']
    expect(upcomingCalendarDates(calendar, now, 2)).toEqual(['20261121', '20261127'])
    expect(upcomingCalendarDates(calendar, now, 10)).toEqual(['20261121', '20261127', '20261128'])
  })

  it('reads calendar entries given as objects too', () => {
    const calendar = [{ label: 'Round 1', startDate: '2026-11-22T00:00Z' }, { entries: [{ startDate: '2026-11-29T00:00Z' }] }]
    expect(upcomingCalendarDates(calendar, now, 5)).toEqual(['20261122', '20261129'])
  })

  it('treats today as upcoming and ignores junk', () => {
    expect(upcomingCalendarDates(['2026-11-16T08:00Z', 42, null], now, 5)).toEqual(['20261116'])
    expect(upcomingCalendarDates(undefined, now, 5)).toEqual([])
  })

  it('can look back as well as ahead', () => {
    const calendar = ['2026-11-01T08:00Z', '2026-11-08T08:00Z', '2026-11-15T08:00Z', '2026-11-21T08:00Z']
    expect(calendarDays(calendar, new Date('2026-11-09T00:00Z'), new Date('2026-11-30T00:00Z')))
      .toEqual(['20261115', '20261121'])
  })
})

const m = (id: string, date: string, status = 'STATUS_SCHEDULED'): WorldMatch => ({
  id, date, status, competition: 'X', competitionSlug: 'x',
  home: { name: 'A', logo: null, score: null, winner: false },
  away: { name: 'B', logo: null, score: null, winner: false },
  venue: null, city: null,
})

describe('pickUpcoming', () => {
  const now = new Date('2026-11-16T12:00:00Z')

  it('keeps future scheduled matches, soonest first, without duplicates', () => {
    const picked = pickUpcoming([
      m('late', '2026-11-28T15:00Z'),
      m('done', '2026-11-15T15:00Z', 'STATUS_FINAL'),
      m('past', '2026-11-16T10:00Z'),
      m('soon', '2026-11-21T14:10Z'),
      m('soon', '2026-11-21T14:10Z'),
      m('off', '2026-11-22T14:10Z', 'STATUS_CANCELED'),
    ], now, 6)
    expect(picked.map((x) => x.id)).toEqual(['soon', 'late'])
  })

  it('stops at the limit', () => {
    const many = ['21', '22', '23', '24'].map((d) => m(d, `2026-11-${d}T12:00Z`))
    expect(pickUpcoming(many, now, 3).map((x) => x.id)).toEqual(['21', '22', '23'])
  })
})

describe('pickRecent', () => {
  it('keeps finished matches from the last days, newest first', () => {
    const now = new Date('2026-11-16T12:00:00Z')
    const picked = pickRecent([
      m('old', '2026-11-01T15:00Z', 'STATUS_FINAL'),
      m('sat', '2026-11-14T15:00Z', 'STATUS_FINAL'),
      m('sun', '2026-11-15T15:00Z', 'STATUS_FINAL'),
      m('sun', '2026-11-15T15:00Z', 'STATUS_FINAL'),
      m('next', '2026-11-21T15:00Z'),
      m('off', '2026-11-14T15:00Z', 'STATUS_CANCELED'),
    ], now, 7)
    expect(picked.map((x) => x.id)).toEqual(['sun', 'sat'])
  })
})

describe('groupByRigaDay', () => {
  it('groups by the Latvian calendar day, so a late UTC kick-off lands on the next day', () => {
    const groups = groupByRigaDay([
      m('a', '2026-11-21T14:10Z'),
      m('b', '2026-11-21T20:10Z'),
      m('c', '2026-11-21T22:30Z'),
    ])
    expect(groups.map((g) => [g.day, g.matches.map((x) => x.id)])).toEqual([
      ['2026-11-21', ['a', 'b']],
      ['2026-11-22', ['c']],
    ])
  })
})

describe('formatting', () => {
  it('shows the day and the Latvian kick-off time', () => {
    // 14:10 UTC is 16:10 in Riga in November
    expect(formatKickoff('2026-11-21T14:10Z')).toMatch(/^S.*21\. nov\. · 16:10$/)
  })

  it('writes a full day heading', () => {
    expect(formatDayHeading('2026-11-21')).toBe('Sestdiena, 21. novembris')
  })
})

describe('competitionFromParam', () => {
  it('accepts a known tournament slug only', () => {
    expect(competitionFromParam('cempionu-kauss')).toBe('cempionu-kauss')
    expect(competitionFromParam(['sesu-naciju-turnirs'])).toBe('sesu-naciju-turnirs')
    expect(competitionFromParam('nav')).toBeNull()
    expect(competitionFromParam(undefined)).toBeNull()
  })
})
