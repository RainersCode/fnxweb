import { describe, it, expect } from 'vitest'
import { latestDate } from './sitemap-dates'

describe('latestDate', () => {
  it('picks the most recent of the given dates', () => {
    expect(latestDate('2026-03-01T10:00:00Z', '2026-05-02T08:00:00Z', '2025-12-31T00:00:00Z')?.toISOString()).toBe('2026-05-02T08:00:00.000Z')
  })
  it('ignores empty and invalid values', () => {
    expect(latestDate(null, undefined, 'nav datums', '2026-01-01T00:00:00Z')?.toISOString()).toBe('2026-01-01T00:00:00.000Z')
  })
  it('returns undefined when there is no real date, so the sitemap leaves lastmod out', () => {
    expect(latestDate()).toBeUndefined()
    expect(latestDate(null, '')).toBeUndefined()
  })
})
