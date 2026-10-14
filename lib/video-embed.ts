export type VideoProvider = 'youtube' | 'facebook'
export type VideoEmbed = { provider: VideoProvider; src: string }

const YOUTUBE_EMBED = 'https://www.youtube-nocookie.com/embed/'
const FACEBOOK_EMBED = 'https://www.facebook.com/plugins/video.php?'
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/

function toUrl(input: string): URL | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null
  } catch {
    return null
  }
}

function youtubeId(url: URL): string | null {
  const host = url.hostname.replace(/^(www|m)\./, '')
  let id: string | null = null
  if (host === 'youtu.be') id = url.pathname.split('/')[1] ?? null
  else if (host === 'youtube.com') {
    if (url.pathname === '/watch') id = url.searchParams.get('v')
    else {
      const match = url.pathname.match(/^\/(shorts|live|embed)\/([^/]+)/)
      id = match?.[2] ?? null
    }
  }
  return id && YOUTUBE_ID.test(id) ? id : null
}

function facebookHref(url: URL): string | null {
  const host = url.hostname.replace(/^(www|m|web)\./, '')
  if (host === 'fb.watch' && url.pathname.length > 1) return url.toString()
  if (host !== 'facebook.com') return null
  const isVideo =
    /\/videos\/\d+/.test(url.pathname) ||
    /^\/reel\/\d+/.test(url.pathname) ||
    (url.pathname.startsWith('/watch') && /^\d+$/.test(url.searchParams.get('v') ?? ''))
  if (!isVideo) return null
  return `https://www.facebook.com${url.pathname}${url.pathname.startsWith('/watch') ? `?v=${url.searchParams.get('v')}` : ''}`
}

export function parseVideoUrl(input: string): VideoEmbed | null {
  const url = toUrl(input)
  if (!url) return null
  const id = youtubeId(url)
  if (id) return { provider: 'youtube', src: `${YOUTUBE_EMBED}${id}` }
  const href = facebookHref(url)
  if (href) return { provider: 'facebook', src: `${FACEBOOK_EMBED}href=${encodeURIComponent(href)}&show_text=false` }
  return null
}

export function isAllowedEmbedSrc(src: string): boolean {
  return src.startsWith(YOUTUBE_EMBED) || src.startsWith(FACEBOOK_EMBED)
}
