export type ArticleStatus = 'draft' | 'published'
export type ArticleState = 'draft' | 'scheduled' | 'published'

export type AdminArticle = {
  id: string
  title: string | null
  content: string
  image_url: string | null
  excerpt: string | null
  author: string | null
  status: ArticleStatus
  published_at: string
  updated_at: string
  slug: string | null
  is_featured: boolean
  fixture_id: string | null
  gallery_id: string | null
}

const LATVIAN: Record<string, string> = {
  ā: 'a', č: 'c', ē: 'e', ģ: 'g', ī: 'i', ķ: 'k', ļ: 'l', ņ: 'n', š: 's', ū: 'u', ž: 'z',
}

export function slugify(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[āčēģīķļņšūž]/g, (c) => LATVIAN[c])
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '')
  return slug || 'zina'
}

export function uniqueSlug(base: string, taken: string[]): string {
  if (!taken.includes(base)) return base
  let n = 2
  while (taken.includes(`${base}-${n}`)) n++
  return `${base}-${n}`
}

export function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

export function excerptFor(article: { excerpt?: string | null; content: string }, max = 160): string {
  const written = article.excerpt?.trim()
  if (written) return written
  const text = plainText(article.content)
  const sentence = text.match(/^(.+?[.!?])(\s|$)/)?.[1] ?? text
  if (sentence.length <= max) return sentence
  const cut = sentence.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

export function articleState(
  a: { status?: string | null; published_at?: string | null },
  now: Date = new Date()
): ArticleState {
  if ((a.status ?? 'published') !== 'published' || !a.published_at) return 'draft'
  return new Date(a.published_at) > now ? 'scheduled' : 'published'
}

export function isPubliclyVisible(
  a: { status?: string | null; published_at?: string | null },
  now: Date = new Date()
): boolean {
  return articleState(a, now) === 'published'
}

export type VisibleQuery<Q> = {
  eq(column: string, value: string): Q
  lte(column: string, value: string): Q
}

// The one place that defines "public": every public article query goes through this
export function onlyVisible<Q extends VisibleQuery<Q>>(query: Q, now: Date = new Date()): Q {
  return query.eq('status', 'published').lte('published_at', now.toISOString())
}

export function formatRigaDateTime(iso: string): string {
  return new Date(iso).toLocaleString('lv-LV', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Riga',
  })
}

export function formatRigaDate(iso: string): string {
  return new Date(iso).toLocaleDateString('lv-LV', { day: 'numeric', month: 'short', timeZone: 'Europe/Riga' })
}

// <input type="datetime-local"> works in the browser's local time (Latvia for our users)
export function toDateTimeLocal(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function fromDateTimeLocal(value: string): string {
  return new Date(value).toISOString()
}
