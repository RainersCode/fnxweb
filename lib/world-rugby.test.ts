import { describe, it, expect } from 'vitest'
import { parseScoreboard, upcomingCalendarDates, pickUpcoming, teamNameLv, type WorldMatch } from './world-rugby'

const competitor = (homeAway: 'home' | 'away', name: string, logo?: string) => ({
  homeAway,
  team: { displayName: name, ...(logo ? { logo } : {}) },
})

const event = (id: string, date: string, status: string, home: string, away: string, venue?: string) => ({
  id,
  date,
  status: { type: { name: status } },
  competitions: [{
    venue: venue ? { fullName: venue, address: { city: 'Dublin' } } : undefined,
    // ESPN does not always list the home side first
    competitors: [competitor('away', away), competitor('home', home, `https://a.espncdn.com/${home}.png`)],
  }],
})

describe('parseScoreboard', () => {
  it('turns ESPN events into matches with the home side first and Latvian team names', () => {
    const json = { events: [event('1', '2026-11-21T16:40Z', 'STATUS_SCHEDULED', 'Ireland', 'South Africa', 'Aviva Stadium')] }
    expect(parseScoreboard(json, 'Nāciju čempionāts')).toEqual([{
      id: '1',
      date: '2026-11-21T16:40Z',
      status: 'STATUS_SCHEDULED',
      competition: 'Nāciju čempionāts',
      home: { name: 'Īrija', logo: 'https://a.espncdn.com/Ireland.png' },
      away: { name: 'Dienvidāfrika', logo: null },
      venue: 'Aviva Stadium',
    }])
  })

  it('skips malformed events and survives an unexpected payload', () => {
    expect(parseScoreboard({ events: [{ id: 'x' }] }, 'X')).toEqual([])
    expect(parseScoreboard(null, 'X')).toEqual([])
    expect(parseScoreboard({ code: 400 }, 'X')).toEqual([])
  })
})

describe('teamNameLv', () => {
  it('translates national teams and keeps club names as they are', () => {
    expect(teamNameLv('New Zealand')).toBe('Jaunzēlande')
    expect(teamNameLv('Wales')).toBe('Velsa')
    expect(teamNameLv('Leinster')).toBe('Leinster')
  })
})

describe('upcomingCalendarDates', () => {
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
})

describe('pickUpcoming', () => {
  const now = new Date('2026-11-16T12:00:00Z')
  const m = (id: string, date: string, status = 'STATUS_SCHEDULED'): WorldMatch => ({
    id, date, status, competition: 'X', home: { name: 'A', logo: null }, away: { name: 'B', logo: null }, venue: null,
  })

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
