import { describe, it, expect } from 'vitest'
import { parseVideoUrl, isAllowedEmbedSrc } from './video-embed'

const yt = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'

describe('parseVideoUrl', () => {
  it.each([
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtube.com/watch?v=dQw4w9WgXcQ&t=42s',
    'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    'https://www.youtube.com/live/dQw4w9WgXcQ',
    '  youtube.com/watch?v=dQw4w9WgXcQ  ',
  ])('accepts YouTube link %s', (url) => {
    expect(parseVideoUrl(url)).toEqual({ provider: 'youtube', src: yt })
  })

  it.each([
    'https://www.facebook.com/RKFenikss/videos/1234567890/',
    'https://m.facebook.com/watch/?v=1234567890',
    'https://www.facebook.com/reel/1234567890',
    'https://fb.watch/abcDEF123/',
  ])('accepts Facebook link %s', (url) => {
    const result = parseVideoUrl(url)
    expect(result?.provider).toBe('facebook')
    expect(result?.src.startsWith('https://www.facebook.com/plugins/video.php?href=')).toBe(true)
  })

  it.each([
    'https://vimeo.com/123',
    'https://www.youtube.com/watch?v=short',
    'https://www.facebook.com/RKFenikss',
    'https://evil.com/?u=youtube.com/watch?v=dQw4w9WgXcQ',
    'javascript:alert(1)',
    'nav saite',
    '',
  ])('rejects %s', (url) => {
    expect(parseVideoUrl(url)).toBeNull()
  })
})

describe('isAllowedEmbedSrc', () => {
  it('allows only the two embed hosts', () => {
    expect(isAllowedEmbedSrc(yt)).toBe(true)
    expect(isAllowedEmbedSrc('https://www.facebook.com/plugins/video.php?href=x')).toBe(true)
    expect(isAllowedEmbedSrc('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(false)
    expect(isAllowedEmbedSrc('https://evil.com/embed')).toBe(false)
  })
})
