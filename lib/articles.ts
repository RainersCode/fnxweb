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

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: string): boolean {
  return UUID.test(value)
}

// Public address of an article: /news/<slug>, or /news/<id> while it has no slug yet (drafts)
export function articlePath(article: { id: string; slug?: string | null }): string {
  return `/news/${article.slug || article.id}`
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

// End of the first sentence: . ! or ? followed by the end or by a capitalised word.
// A period right after a digit is a Latvian ordinal ("18. oktobrī", "2. vietu"), not an ending.
function firstSentence(text: string): string {
  for (const match of Array.from(text.matchAll(/[.!?]/g))) {
    const i = match.index ?? 0
    if (match[0] === '.' && /\d/.test(text[i - 1] ?? '')) continue
    const rest = text.slice(i + 1)
    if (rest === '' || /^\s+["„“(]?[A-ZĀČĒĢĪĶĻŅŠŪŽ]/.test(rest)) return text.slice(0, i + 1)
  }
  return text
}

export function excerptFor(article: { excerpt?: string | null; content: string }, max = 160): string {
  const written = article.excerpt?.trim()
  if (written) return written
  const text = plainText(article.content)
  const sentence = firstSentence(text)
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

// The one place that defines "public": every public article query goes through this.
// Unconstrained on purpose: checking Supabase's query builder against any constraint
// hits TypeScript's instantiation depth limit. The tests pin the eq/lte calls.
export function onlyVisible<Q>(query: Q, now: Date = new Date()): Q {
  const q = query as unknown as VisibleQuery<VisibleQuery<Q>>
  return q.eq('status', 'published').lte('published_at', now.toISOString()) as unknown as Q
}

// Browser-safe (the editor uses it); the server runs it on sanitized content via checkPublishable
export function validateForPublish(a: { title?: string | null; content?: string | null }): string | null {
  if (!a.title?.trim()) return 'Pievieno virsrakstu'
  const content = a.content ?? ''
  // An empty <figure> left after the sanitizer removed a foreign photo is not content
  const hasMedia = /<img\b|data-video-embed/.test(content)
  if (!plainText(content) && !hasMedia) return 'Ziņai vajag tekstu, foto vai video'
  return null
}

// JSON for a <script type="application/ld+json"> tag: escaping < stops text from closing the tag
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

// Photos we store ourselves; anything else in article content is dropped
export function isMediaUrl(src: string): boolean {
  const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''}/storage/v1/object/public/media/`
  return src.startsWith('https://') && src.startsWith(prefix)
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
