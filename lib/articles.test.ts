import { describe, it, expect } from 'vitest'
import {
  slugify, uniqueSlug, plainText, excerptFor, articleState, isPubliclyVisible,
  onlyVisible, toDateTimeLocal, fromDateTimeLocal,
} from './articles'

describe('slugify', () => {
  it('transliterates Latvian letters', () => {
    expect(slugify('Fēnikss uzvar Jūrmalā — 24:17!')).toBe('fenikss-uzvar-jurmala-24-17')
  })
  it('handles every Latvian letter', () => {
    expect(slugify('ā č ē ģ ī ķ ļ ņ š ū ž Ā Š')).toBe('a-c-e-g-i-k-l-n-s-u-z-a-s')
  })
  it('falls back when nothing usable remains', () => {
    expect(slugify('!!!')).toBe('zina')
    expect(slugify('')).toBe('zina')
  })
  it('caps length without a trailing hyphen', () => {
    const slug = slugify('a '.repeat(100))
    expect(slug.length).toBeLessThanOrEqual(80)
    expect(slug.endsWith('-')).toBe(false)
  })
})

describe('uniqueSlug', () => {
  it('keeps a free slug', () => {
    expect(uniqueSlug('spele', ['cits'])).toBe('spele')
  })
  it('adds the first free number', () => {
    expect(uniqueSlug('spele', ['spele', 'spele-2'])).toBe('spele-3')
  })
})

describe('plainText and excerptFor', () => {
  it('strips tags and decodes common entities', () => {
    expect(plainText('<p>Sveiki&nbsp;&amp; <b>labdien</b></p><p>Otra</p>')).toBe('Sveiki & labdien Otra')
  })
  it('prefers the written excerpt', () => {
    expect(excerptFor({ excerpt: '  Īsi.  ', content: '<p>Garš teksts.</p>' })).toBe('Īsi.')
  })
  it('falls back to the first sentence', () => {
    expect(excerptFor({ excerpt: null, content: '<p>Pirmais teikums. Otrais teikums.</p>' })).toBe('Pirmais teikums.')
  })
  it('cuts long text at a word boundary', () => {
    const text = excerptFor({ content: `<p>${'vārds '.repeat(60)}</p>` }, 40)
    expect(text.length).toBeLessThanOrEqual(41)
    expect(text.endsWith('…')).toBe(true)
  })
})

describe('visibility', () => {
  const now = new Date('2026-10-14T12:00:00Z')
  it('treats drafts as not visible', () => {
    expect(articleState({ status: 'draft', published_at: '2026-10-01T00:00:00Z' }, now)).toBe('draft')
    expect(isPubliclyVisible({ status: 'draft', published_at: '2026-10-01T00:00:00Z' }, now)).toBe(false)
  })
  it('treats future published articles as scheduled', () => {
    expect(articleState({ status: 'published', published_at: '2026-10-18T07:00:00Z' }, now)).toBe('scheduled')
    expect(isPubliclyVisible({ status: 'published', published_at: '2026-10-18T07:00:00Z' }, now)).toBe(false)
  })
  it('treats past published articles as visible', () => {
    expect(articleState({ status: 'published', published_at: '2026-10-14T11:59:00Z' }, now)).toBe('published')
    expect(isPubliclyVisible({ status: 'published', published_at: '2026-10-14T11:59:00Z' }, now)).toBe(true)
  })
  it('onlyVisible filters on status and publish time', () => {
    const calls: string[] = []
    const fake = {
      eq(c: string, v: string) { calls.push(`eq ${c} ${v}`); return fake },
      lte(c: string, v: string) { calls.push(`lte ${c} ${v}`); return fake },
    }
    onlyVisible(fake, now)
    expect(calls).toEqual(['eq status published', `lte published_at ${now.toISOString()}`])
  })
})

describe('datetime-local conversion', () => {
  it('round-trips to the minute', () => {
    const iso = '2026-10-18T07:30:00.000Z'
    expect(fromDateTimeLocal(toDateTimeLocal(iso))).toBe(iso)
  })
  it('produces the input format', () => {
    expect(toDateTimeLocal('2026-10-18T07:30:45.000Z')).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
  })
})
