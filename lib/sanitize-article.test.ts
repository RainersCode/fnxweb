import { describe, it, expect, beforeAll } from 'vitest'
import { sanitizeArticleHtml } from './sanitize-article'

const MEDIA = 'https://proj.supabase.co/storage/v1/object/public/media/articles/a1/x.webp'

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://proj.supabase.co'
  process.env.NEXT_PUBLIC_SITE_URL = 'https://www.fnx-rugby.lv'
})

describe('sanitizeArticleHtml', () => {
  it('keeps normal formatting', () => {
    const html = '<h2>Virsraksts</h2><p><strong>B</strong> <em>I</em> <u>U</u></p><ul><li>a</li></ul><blockquote><p>c</p></blockquote>'
    expect(sanitizeArticleHtml(html)).toBe(html)
  })
  it('removes scripts and event handlers', () => {
    const out = sanitizeArticleHtml('<p onclick="x()">Hi</p><script>alert(1)</script><img src="x" onerror="alert(1)">')
    expect(out).toBe('<p>Hi</p>')
  })
  it('keeps text-align but drops other inline styles', () => {
    expect(sanitizeArticleHtml('<p style="text-align: center; color: red; font-size: 40px">x</p>'))
      .toBe('<p style="text-align:center">x</p>')
  })
  it('keeps figures with media-bucket images and drops foreign images', () => {
    const ok = `<figure><img src="${MEDIA}" alt="Komanda" /><figcaption>Pēc spēles</figcaption></figure>`
    expect(sanitizeArticleHtml(ok)).toBe(`<figure><img src="${MEDIA}" alt="Komanda" /><figcaption>Pēc spēles</figcaption></figure>`)
    expect(sanitizeArticleHtml('<p><img src="https://evil.com/a.png" /></p>')).toBe('<p></p>')
    expect(sanitizeArticleHtml('<p><img src="blob:http://localhost/123" /></p>')).toBe('<p></p>')
  })
  it('keeps allowed video embeds and drops other iframes', () => {
    const video = '<div data-video-embed="" data-provider="youtube"><iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" title="Video" allowfullscreen="true"></iframe></div>'
    expect(sanitizeArticleHtml(video)).toContain('src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"')
    expect(sanitizeArticleHtml('<iframe src="https://evil.com/x"></iframe>')).toBe('')
  })
  it('opens external links safely and blocks javascript links', () => {
    expect(sanitizeArticleHtml('<a href="https://lrf.lv">LRF</a>'))
      .toBe('<a href="https://lrf.lv" target="_blank" rel="noopener noreferrer">LRF</a>')
    expect(sanitizeArticleHtml('<a href="/news">Ziņas</a>')).toBe('<a href="/news">Ziņas</a>')
    expect(sanitizeArticleHtml('<a href="javascript:alert(1)">x</a>')).toBe('<a>x</a>')
  })
})
