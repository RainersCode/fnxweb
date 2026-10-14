import { describe, it, expect } from 'vitest'
import { formatTime, groupTrainingByDay, DAY_NAMES } from './training'

describe('formatTime', () => {
  it('shows HH:MM for Postgres time values', () => {
    expect(formatTime('18:30:00')).toBe('18:30')
    expect(formatTime('08:05')).toBe('08:05')
  })
})

describe('groupTrainingByDay', () => {
  it('groups Monday first, Sunday last, sorted by start time', () => {
    const sessions = [
      { id: 'a', day_of_week: 0, start_time: '10:00' },
      { id: 'b', day_of_week: 2, start_time: '18:00:00' },
      { id: 'c', day_of_week: 1, start_time: '18:30' },
      { id: 'd', day_of_week: 1, start_time: '17:00' },
    ]
    const groups = groupTrainingByDay(sessions)
    expect(groups.map((g) => g.label)).toEqual([DAY_NAMES[1], DAY_NAMES[2], DAY_NAMES[0]])
    expect(groups[0].sessions.map((s) => s.id)).toEqual(['d', 'c'])
  })
  it('returns nothing for no sessions', () => {
    expect(groupTrainingByDay([])).toEqual([])
  })
})
