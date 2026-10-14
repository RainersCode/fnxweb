import { describe, it, expect } from 'vitest'
import { playerSchema, trainingSchema, fixtureSchema, galleryOrderSchema, fieldErrors } from './admin-schemas'

describe('playerSchema', () => {
  it('requires a name and keeps numbers in 0–99', () => {
    const r = playerSchema.safeParse({ name: ' ', jersey_number: 120, is_active: true })
    expect(r.success).toBe(false)
    if (!r.success) expect(fieldErrors(r.error)).toMatchObject({ name: 'Ievadi vārdu', jersey_number: 'Numuram jābūt no 0 līdz 99' })
  })
  it('turns empty optional text into null and drops unknown fields', () => {
    const r = playerSchema.parse({ name: 'Kristaps', position: '  ', bio: '', is_active: true, id: 'x' })
    expect(r).toEqual({ name: 'Kristaps', position: null, bio: null, is_active: true })
  })
})

describe('trainingSchema', () => {
  const base = { day_of_week: 1, location: 'Daliņi', is_active: true }
  it('refuses an end time before the start', () => {
    const r = trainingSchema.safeParse({ ...base, start_time: '20:00', end_time: '18:30' })
    expect(r.success).toBe(false)
    if (!r.success) expect(fieldErrors(r.error).end_time).toBe('Beigām jābūt pēc sākuma')
  })
  it('accepts HH:MM and HH:MM:SS', () => {
    expect(trainingSchema.safeParse({ ...base, start_time: '18:30:00', end_time: '20:00' }).success).toBe(true)
  })
})

describe('fixtureSchema', () => {
  it('requires an opponent and a valid date', () => {
    const r = fixtureSchema.safeParse({ opponent: '', match_date: 'rīt', is_home_game: true })
    expect(r.success).toBe(false)
    if (!r.success) expect(Object.keys(fieldErrors(r.error))).toEqual(expect.arrayContaining(['opponent', 'match_date']))
  })
  it('accepts a result and nulls for logos', () => {
    expect(fixtureSchema.safeParse({
      opponent: 'RK Eži', match_date: '2026-10-18T11:00:00.000Z', is_home_game: true,
      score: '24:17', result: 'win', home_logo_url: null, away_logo_url: null,
    }).success).toBe(true)
  })
})

describe('galleryOrderSchema', () => {
  it('accepts uuids only', () => {
    expect(galleryOrderSchema.safeParse({ ids: ['3f2b1c9e-1d2a-4b7c-9a1e-2f3a4b5c6d7e'] }).success).toBe(true)
    expect(galleryOrderSchema.safeParse({ ids: ['x'] }).success).toBe(false)
  })
})
