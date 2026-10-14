import { describe, it, expect } from 'vitest'
import { RUGBY_POSITIONS, POSITION_NAMES } from './rugby-positions'

describe('rugby positions', () => {
  it('covers every jersey number 1–15 exactly once', () => {
    const numbers = RUGBY_POSITIONS.flatMap((p) => p.numbers).sort((a, b) => a - b)
    expect(numbers).toEqual(Array.from({ length: 15 }, (_, i) => i + 1))
  })
  it('puts 1–8 in the forwards and 9–15 in the backs', () => {
    for (const p of RUGBY_POSITIONS) {
      for (const n of p.numbers) expect(p.group).toBe(n <= 8 ? 'uzbrucēji' : 'aizsargi')
    }
  })
  it('offers the Latvian names used in Latvian rugby to the admin form', () => {
    expect(POSITION_NAMES).toContain('Cīņas pussargs')
    expect(POSITION_NAMES).toContain('Hukers')
    expect(new Set(POSITION_NAMES).size).toBe(POSITION_NAMES.length)
  })
})
