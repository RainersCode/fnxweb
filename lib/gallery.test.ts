import { describe, it, expect } from 'vitest'
import { galleryCover, moveId, applyOrder } from './gallery'

describe('galleryCover', () => {
  it('uses the chosen cover', () => {
    expect(galleryCover('cover.webp', 'first.webp')).toBe('cover.webp')
  })
  it('falls back to the first photo when no cover is set', () => {
    expect(galleryCover(null, 'first.webp')).toBe('first.webp')
    expect(galleryCover('', 'first.webp')).toBe('first.webp')
  })
  it('returns null for an empty gallery', () => {
    expect(galleryCover(null, null)).toBeNull()
  })
})

describe('moveId', () => {
  it('moves an id to the position of another', () => {
    expect(moveId(['a', 'b', 'c', 'd'], 'a', 'c')).toEqual(['b', 'c', 'a', 'd'])
    expect(moveId(['a', 'b', 'c', 'd'], 'd', 'b')).toEqual(['a', 'd', 'b', 'c'])
  })
  it('leaves the list unchanged for unknown ids', () => {
    expect(moveId(['a', 'b'], 'x', 'a')).toEqual(['a', 'b'])
  })
})

describe('applyOrder', () => {
  it('arranges items by the saved id order and keeps unknown ones at the end', () => {
    const items = [{ id: 'c' }, { id: 'a' }, { id: 'new' }, { id: 'b' }]
    expect(applyOrder(items, ['a', 'b', 'c']).map((i) => i.id)).toEqual(['a', 'b', 'c', 'new'])
  })
})
