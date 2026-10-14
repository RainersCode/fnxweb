import { describe, it, expect, beforeAll } from 'vitest'
import { storagePathFromUrl, unreferencedUrls } from './storage-paths'

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://proj.supabase.co'
})

describe('storagePathFromUrl', () => {
  it('returns the bucket path for our public media URLs, decoded', () => {
    expect(storagePathFromUrl('https://proj.supabase.co/storage/v1/object/public/media/galleries/g1/1-a.webp')).toBe('galleries/g1/1-a.webp')
    expect(storagePathFromUrl('https://proj.supabase.co/storage/v1/object/public/media/galleries/FNX%20(1%20of%2061).webp')).toBe('galleries/FNX (1 of 61).webp')
  })
  it('ignores other URLs and empty values', () => {
    expect(storagePathFromUrl('https://evil.com/storage/v1/object/public/media/x.webp')).toBeNull()
    expect(storagePathFromUrl('/Logo/x.png')).toBeNull()
    expect(storagePathFromUrl(null)).toBeNull()
    expect(storagePathFromUrl(undefined)).toBeNull()
  })
})

describe('unreferencedUrls', () => {
  const base = 'https://proj.supabase.co/storage/v1/object/public/media/'
  it('keeps files that an article still shows', () => {
    const urls = [base + 'galleries/g/1.webp', base + 'galleries/g/2.webp', base + 'players/p.webp']
    const articles = [
      { content: '<figure><img src="' + base + 'galleries/g/1.webp"></figure>', image_url: null },
      { content: '<p>Teksts</p>', image_url: base + 'players/p.webp' },
    ]
    expect(unreferencedUrls(urls, articles)).toEqual([base + 'galleries/g/2.webp'])
  })
  it('also spots encoded paths in article HTML', () => {
    const url = base + 'galleries/FNX%20(1%20of%2061).webp'
    expect(unreferencedUrls([url], [{ content: '<img src="' + url + '">', image_url: null }])).toEqual([])
  })
})
