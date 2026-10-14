import { describe, it, expect } from 'vitest'
import { retryDelay, shouldOfferRestore } from './autosave'

describe('retryDelay', () => {
  it('backs off and caps at 30 seconds', () => {
    expect([0, 1, 2, 3, 4, 10].map(retryDelay)).toEqual([2000, 5000, 10000, 30000, 30000, 30000])
  })
})

describe('shouldOfferRestore', () => {
  const server = { title: 'A', content: '<p>x</p>' }
  const serverAt = '2026-10-14T10:00:00.000Z'
  it('offers a newer, different device copy', () => {
    const backup = { fields: { title: 'A', content: '<p>x y</p>' }, at: Date.parse(serverAt) + 60_000 }
    expect(shouldOfferRestore(backup, serverAt, server)).toBe(true)
  })
  it('offers a different copy even when it was written within a second of the last save', () => {
    // Typed right after a save, then the next save never made it: the device copy is the only record
    const backup = { fields: { title: 'A', content: '<p>x y</p>' }, at: Date.parse(serverAt) + 300 }
    expect(shouldOfferRestore(backup, serverAt, server)).toBe(true)
  })
  it('ignores an identical copy and a missing one', () => {
    expect(shouldOfferRestore({ fields: server, at: Date.parse(serverAt) + 60_000 }, serverAt, server)).toBe(false)
    expect(shouldOfferRestore(null, serverAt, server)).toBe(false)
  })
})
