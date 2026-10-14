import { describe, it, expect } from 'vitest'
import { SITE_URL, pageUrl } from './site'

describe('pageUrl', () => {
  it('builds absolute www URLs for canonical tags', () => {
    expect(SITE_URL).toBe('https://www.fnx-rugby.lv')
    expect(pageUrl('/noteikumi')).toBe('https://www.fnx-rugby.lv/noteikumi')
    expect(pageUrl('news/abc')).toBe('https://www.fnx-rugby.lv/news/abc')
  })
  it('uses the bare domain for the home page and drops trailing slashes', () => {
    expect(pageUrl('/')).toBe('https://www.fnx-rugby.lv')
    expect(pageUrl('/gallery/')).toBe('https://www.fnx-rugby.lv/gallery')
  })
})
