import { describe, it, expect } from 'vitest'
import { splitFixtures } from './fixtures-admin'

describe('splitFixtures', () => {
  const now = new Date('2026-10-14T12:00:00Z')
  const f = (id: string, match_date: string) => ({ id, match_date })
  it('upcoming soonest first, played most recent first', () => {
    const { upcoming, played } = splitFixtures(
      [f('old', '2026-04-05T09:00:00Z'), f('next', '2026-10-18T11:00:00Z'), f('later', '2026-11-01T11:00:00Z'), f('recent', '2026-10-01T11:00:00Z')],
      now
    )
    expect(upcoming.map((x) => x.id)).toEqual(['next', 'later'])
    expect(played.map((x) => x.id)).toEqual(['recent', 'old'])
  })
})
