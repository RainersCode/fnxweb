import { describe, it, expect, beforeAll } from 'vitest'
import {
  articleFieldsSchema, articleActionSchema, validateForPublish, prepareFields,
  buildPublishUpdate, isMissingColumnError, checkPublishable,
} from './article-publish'

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://proj.supabase.co'
})

describe('schemas', () => {
  it('drops unknown fields such as status or id', () => {
    const parsed = articleFieldsSchema.parse({ title: 'A', status: 'published', id: 'x', slug: 'y' })
    expect(parsed).toEqual({ title: 'A' })
  })
  it('rejects an over-long excerpt and a bad fixture id', () => {
    expect(articleFieldsSchema.safeParse({ excerpt: 'x'.repeat(161) }).success).toBe(false)
    expect(articleFieldsSchema.safeParse({ fixture_id: 'nope' }).success).toBe(false)
  })
  it('parses the three actions', () => {
    expect(articleActionSchema.parse({ action: 'unpublish' })).toEqual({ action: 'unpublish' })
    expect(articleActionSchema.safeParse({ action: 'explode' }).success).toBe(false)
  })
})

describe('validateForPublish', () => {
  it('requires a real title', () => {
    expect(validateForPublish({ title: '   ', content: '<p>Teksts</p>' })).toBe('Pievieno virsrakstu')
    expect(validateForPublish({ title: null, content: '<p>Teksts</p>' })).toBe('Pievieno virsrakstu')
  })
  it('requires a body', () => {
    expect(validateForPublish({ title: 'A', content: '<p></p>' })).toBe('Ziņai vajag tekstu, foto vai video')
  })
  it('accepts a photo-only or video-only body', () => {
    expect(validateForPublish({ title: 'A', content: '<figure><img src="x"></figure>' })).toBeNull()
    expect(validateForPublish({ title: 'A', content: '<div data-video-embed=""></div>' })).toBeNull()
  })
})

describe('prepareFields', () => {
  it('trims text, nulls empty excerpt and sanitizes content', () => {
    expect(prepareFields({ title: '  A  ', excerpt: '  ', content: '<p>x</p><script>y</script>' }))
      .toEqual({ title: 'A', excerpt: null, content: '<p>x</p>' })
  })
})

describe('buildPublishUpdate', () => {
  const now = new Date('2026-10-14T12:00:00Z')
  it('publishes a draft now when no time is given', () => {
    const update = buildPublishUpdate({ status: 'draft', published_at: '2026-10-01T00:00:00Z' }, { title: 'A' }, now, 'a')
    expect(update).toMatchObject({ status: 'published', published_at: now.toISOString(), slug: 'a', title: 'A' })
  })
  it('schedules when a time is given', () => {
    const update = buildPublishUpdate({ status: 'draft', published_at: null }, { published_at: '2026-10-18T07:00:00.000Z' }, now)
    expect(update.published_at).toBe('2026-10-18T07:00:00.000Z')
  })
  it('keeps the original date when updating a published article', () => {
    const update = buildPublishUpdate({ status: 'published', published_at: '2026-01-24T10:00:00Z' }, { title: 'B' }, now)
    expect(update.published_at).toBe('2026-01-24T10:00:00Z')
    expect(update).not.toHaveProperty('slug')
  })
})

describe('isMissingColumnError', () => {
  it('detects Postgres undefined-column errors', () => {
    expect(isMissingColumnError({ code: '42703', message: 'column articles.status does not exist' })).toBe(true)
    expect(isMissingColumnError({ code: 'PGRST204', message: "Could not find the 'status' column" })).toBe(true)
    expect(isMissingColumnError({ code: '23505', message: 'duplicate' })).toBe(false)
    expect(isMissingColumnError(null)).toBe(false)
  })
})

describe('checkPublishable', () => {
  it('judges the body after sanitizing, so a foreign pasted photo does not count', () => {
    expect(checkPublishable({ title: 'A', content: '<figure><img src="https://evil.com/a.png"></figure>' })).toBe('Ziņai vajag tekstu, foto vai video')
    expect(checkPublishable({ title: 'A', content: '<p>Teksts</p>' })).toBeNull()
  })
})
