# Admin Step 1 (Shell + Article Editor) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the admin area's layout and article management with a Latvian, phone-friendly admin shell and a full-page article editor with drafts, autosave, photos and videos in the text, scheduling, preview and match/gallery links.

**Architecture:** Next.js 14 App Router. Admin pages are server components that read with the Supabase service-role client (`createAdminClient`) after the admin layout's `isAdminRequest()` check; interactive parts are client components that write through `/api/admin/*` routes (each re-checks `isAdminRequest()` and validates with zod). Pure logic (slugs, visibility, sanitizing, video URLs, publish rules, autosave timing) lives in small `lib/` modules covered by Vitest. Public pages read articles only through one visibility helper.

**Tech Stack:** Next.js 14.2, React 18, TypeScript, Tailwind (club tokens), shadcn/ui, TipTap 2, Clerk 4 (`@clerk/nextjs`), Supabase JS 2, sonner, zod 3, sharp, new: `sanitize-html`, `vitest`.

**Spec:** `docs/superpowers/specs/2026-10-13-admin-articles-design.md`

## Global Constraints

- All admin UI text is Latvian. Toasts via `import { toast } from 'sonner'` (already mounted in `app/layout.tsx`); never `alert()`, `window.prompt` or silent `console.error`.
- Every new admin API route calls `isAdminRequest()` from `@/lib/admin-auth` first and returns 401 when it fails. Admin server pages rely on `app/admin/layout.tsx` (which checks) and must use `export const dynamic = 'force-dynamic'`.
- An article is publicly visible only when `status = 'published'` and `published_at <= now()`. Public code must use `onlyVisible()` from `@/lib/articles` for every article query.
- Article HTML is sanitized with `sanitizeArticleHtml()` on save (server) and before public render.
- Colours: use Tailwind `club` tokens (`bg-club`, `bg-club-deep`, `text-club`, `bg-club-pale`, `text-club-mint`); primary action buttons are `bg-teal-700 hover:bg-teal-600 text-white`.
- Status pills: draft `bg-[#FFF4D6] text-[#8A5A00]` "Melnraksts"; scheduled `bg-[#E3EEFB] text-[#1F4E8C]` "Ieplānots · <date>"; published `bg-[#E2F3EA] text-[#146C43]` "Publicēts".
- Dates shown to users are formatted in the `Europe/Riga` timezone with `lv-LV`.
- Uploads: `/api/admin/upload`, folder for article media `articles/<articleId>`; files are never deleted when a photo is removed or replaced, only when the article is deleted.
- The owner runs a dev server on port 3000 from this same folder. **Never run `npm run build` or delete `.next` while anything listens on port 3000** (check with `Get-NetTCPConnection -LocalPort 3000 -State Listen`); it corrupts their dev server. Use `npx tsc --noEmit -p .` and Vitest instead; the Vercel preview build is the build check.
- Commit messages end with the trailer `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`. Work on branch `admin-redesign`.
- The project has ~39 pre-existing TypeScript errors in unrelated files. "Type-check passes" means: `npx tsc --noEmit -p . 2>&1 | grep -E "<files you touched>"` prints nothing.

## Review Focus

1. Bad connection at the pitch while writing a draft: autosave fails → editor shows "Neizdevās saglabāt — mēģina vēlreiz", retries with backoff, and on reopening offers "Atjaunot nesaglabātās izmaiņas" from the device copy. Pinned by `lib/autosave.test.ts` (Task 10).
2. Text pasted from Word, Facebook or another site carrying scripts, `onclick`, inline styles or foreign iframes: all stripped, while normal formatting and old articles' `text-align` survive. Pinned by `lib/sanitize-article.test.ts` (Task 3).
3. iPhone HEIC photo or a file name with path tricks (`../x`) uploaded: clear Latvian error, nothing written outside the `articles/<id>` folder. Pinned by `lib/upload-rules.test.ts` (Task 5).
4. Publishing with a whitespace-only title, an empty body, or a body that is only a photo/video: first two blocked with a Latvian message, photo/video-only allowed. Pinned by `lib/article-publish.test.ts` (Task 4).
5. Someone opens a draft or scheduled article's public URL `/news/<id>` before its time: 404, and it is absent from the home page, news list and sitemap. Pinned by `lib/articles.test.ts` `onlyVisible`/`articleState` tests (Task 1) plus the manual check in Task 6.

---

## File Map

Create:
- `vitest.config.ts`: Vitest setup with `@` alias.
- `lib/articles.ts` (+ `.test.ts`): slugs, plain text/excerpt, visibility rule and query helper, article state, Riga date formatting, datetime-local conversion, `AdminArticle` type.
- `lib/video-embed.ts` (+ `.test.ts`): YouTube/Facebook URL parsing and embed allowlist.
- `lib/sanitize-article.ts` (+ `.test.ts`): HTML allowlist sanitizer.
- `lib/article-publish.ts` (+ `.test.ts`): zod schemas, publish validation, field preparation, publish update builder, missing-column detection.
- `lib/upload-rules.ts` (+ `.test.ts`): upload folder and HEIC checks.
- `lib/autosave.ts` (+ `.test.ts`): retry delays and restore decision.
- `lib/upload-with-progress.ts`: XHR upload with progress callback.
- `supabase/migrations/2026-10-13-articles-publishing.sql`.
- `app/api/admin/articles/[id]/route.ts`.
- `components/admin/shell/admin-nav.ts` (+ `.test.ts`), `admin-shell.tsx`, `admin-sidebar.tsx`, `admin-tab-bar.tsx`, `quick-add-button.tsx`.
- `components/admin/migration-notice.tsx`.
- `components/admin/dashboard/visitor-stats.tsx`, `components/admin/dashboard/new-article-button.tsx`.
- `components/admin/articles/use-create-article.ts`, `article-status-pill.tsx`, `article-list.tsx`, `cover-photo-field.tsx`, `article-settings.tsx`, `article-editor.tsx`, `use-autosave.ts`.
- `components/admin/articles/editor/upload-store.ts`, `figure-node.tsx`, `video-node.ts`, `use-keyboard-offset.ts`, `link-popover.tsx`, `video-dialog.tsx`, `editor-toolbar.tsx`, `body-editor.tsx`.
- `app/admin/articles/[id]/page.tsx`, `app/admin/articles/[id]/preview/page.tsx`.

Modify:
- `package.json` (deps, `test` script), `types/supabase.ts` (Article fields), `app/globals.css` (article figure/video styles).
- `app/api/admin/articles/route.ts` (rewrite), `app/api/admin/upload/route.ts` (folder + HEIC rules).
- `app/admin/layout.tsx` (use AdminShell), `app/admin/page.tsx` (new dashboard), `app/admin/articles/page.tsx` (new list).
- Public readers: `app/page.tsx`, `app/news/page.tsx`, `app/news/[id]/page.tsx`, `app/news/[id]/news-detail-client.tsx`, `app/news/[id]/opengraph-image.tsx`, `app/sitemap.ts`, `components/features/home-news-section.tsx`, `lib/api.ts`.

Delete (Task 12, if unused): `components/shared/rich-text-editor.tsx`.

---

### Task 1: Vitest and the article core library

**Files:**
- Create: `vitest.config.ts`, `lib/articles.ts`, `lib/articles.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces (used by Tasks 4, 6, 8, 9, 10, 11):
  - `type ArticleStatus = 'draft' | 'published'`
  - `type ArticleState = 'draft' | 'scheduled' | 'published'`
  - `type AdminArticle = { id: string; title: string | null; content: string; image_url: string | null; excerpt: string | null; author: string | null; status: ArticleStatus; published_at: string; updated_at: string; slug: string | null; is_featured: boolean; fixture_id: string | null; gallery_id: string | null }`
  - `slugify(title: string): string`
  - `uniqueSlug(base: string, taken: string[]): string`
  - `plainText(html: string): string`
  - `excerptFor(article: { excerpt?: string | null; content: string }, max?: number): string`
  - `articleState(a: { status?: string | null; published_at?: string | null }, now?: Date): ArticleState`
  - `isPubliclyVisible(a: { status?: string | null; published_at?: string | null }, now?: Date): boolean`
  - `onlyVisible<Q extends VisibleQuery<Q>>(query: Q, now?: Date): Q` where `type VisibleQuery<Q> = { eq(column: string, value: string): Q; lte(column: string, value: string): Q }`
  - `formatRigaDateTime(iso: string): string` → e.g. `"18. okt. 10:00"`
  - `formatRigaDate(iso: string): string` → e.g. `"18. okt."`
  - `toDateTimeLocal(iso: string): string` → `"YYYY-MM-DDTHH:mm"` in the browser's local time
  - `fromDateTimeLocal(value: string): string` → ISO string

- [ ] **Step 1: Install Vitest and add the test script**

Run: `npm install --save-dev vitest@^2`
Then in `package.json` `"scripts"` add `"test": "vitest run"` after `"lint"`.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts', 'components/**/*.test.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

- [ ] **Step 3: Write the failing tests `lib/articles.test.ts`**

```ts
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
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `npx vitest run lib/articles.test.ts`
Expected: FAIL, "Failed to resolve import ./articles" (module missing).

- [ ] **Step 5: Implement `lib/articles.ts`**

```ts
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
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run lib/articles.test.ts`
Expected: PASS (all tests).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts lib/articles.ts lib/articles.test.ts
git commit -m "feat: add article core library with tests" -m "Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Video embed parsing

**Files:**
- Create: `lib/video-embed.ts`, `lib/video-embed.test.ts`

**Interfaces:**
- Produces (used by Tasks 3, 11):
  - `type VideoProvider = 'youtube' | 'facebook'`
  - `type VideoEmbed = { provider: VideoProvider; src: string }`
  - `parseVideoUrl(input: string): VideoEmbed | null`
  - `isAllowedEmbedSrc(src: string): boolean`

- [ ] **Step 1: Write the failing tests `lib/video-embed.test.ts`**

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run lib/video-embed.test.ts`
Expected: FAIL, module `./video-embed` not found.

- [ ] **Step 3: Implement `lib/video-embed.ts`**

```ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run lib/video-embed.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/video-embed.ts lib/video-embed.test.ts
git commit -m "feat: parse YouTube and Facebook video links for article embeds" -m "Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Article HTML sanitizer

**Files:**
- Create: `lib/sanitize-article.ts`, `lib/sanitize-article.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `isAllowedEmbedSrc` (Task 2).
- Produces (used by Tasks 4, 6, 11): `sanitizeArticleHtml(html: string): string`. Allowed image sources: URLs starting with `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/`, read at call time.

- [ ] **Step 1: Install sanitize-html**

Run: `npm install sanitize-html@^2 && npm install --save-dev @types/sanitize-html@^2`

- [ ] **Step 2: Write the failing tests `lib/sanitize-article.test.ts`**

```ts
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
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run lib/sanitize-article.test.ts`
Expected: FAIL, module `./sanitize-article` not found.

- [ ] **Step 4: Implement `lib/sanitize-article.ts`**

```ts
import sanitizeHtml from 'sanitize-html'
import { isAllowedEmbedSrc } from './video-embed'

function mediaPrefix(): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''}/storage/v1/object/public/media/`
}

function isAllowedImageSrc(src: string): boolean {
  return src.startsWith('https://') && src.startsWith(mediaPrefix())
}

function isExternal(href: string): boolean {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fnx-rugby.lv'
  return /^https?:\/\//i.test(href) && !href.startsWith(site)
}

// Shared by the save path (API) and the public render path
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's',
      'ul', 'ol', 'li', 'blockquote', 'a', 'hr', 'img', 'figure', 'figcaption', 'div', 'iframe',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt'],
      div: ['data-video-embed', 'data-provider'],
      iframe: ['src', 'title', 'allow', 'allowfullscreen', 'frameborder'],
      '*': ['style'],
    },
    allowedStyles: { '*': { 'text-align': [/^(left|right|center|justify)$/] } },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['https'], iframe: ['https'] },
    selfClosing: ['img', 'br', 'hr'],
    exclusiveFilter: (frame) =>
      (frame.tag === 'iframe' && !isAllowedEmbedSrc(frame.attribs.src ?? '')) ||
      (frame.tag === 'img' && !isAllowedImageSrc(frame.attribs.src ?? '')),
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? ''
        if (!isExternal(href)) {
          const { target: _t, rel: _r, ...rest } = attribs
          return { tagName, attribs: rest }
        }
        return { tagName, attribs: { ...attribs, target: '_blank', rel: 'noopener noreferrer' } }
      },
    },
  })
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run lib/sanitize-article.test.ts`
Expected: PASS. If the self-closing output differs (`<img ... />` vs `<img ...>`), adjust only the two expectations in the figure test to the library's actual form; do not loosen any other assertion.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json lib/sanitize-article.ts lib/sanitize-article.test.ts
git commit -m "feat: sanitize article HTML with an allowlist" -m "Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Database migration, types and publish rules

**Files:**
- Create: `supabase/migrations/2026-10-13-articles-publishing.sql`, `lib/article-publish.ts`, `lib/article-publish.test.ts`
- Modify: `types/supabase.ts:1-11`

**Interfaces:**
- Consumes: `plainText`, `ArticleStatus` (Task 1); `sanitizeArticleHtml` (Task 3).
- Produces (used by Tasks 5, 8, 9, 10, 11):
  - `articleFieldsSchema` (zod object, unknown keys stripped) with optional: `title: string|null (max 255)`, `content: string (max 200000)`, `image_url: string url|null`, `excerpt: string|null (max 160)`, `author: string|null (max 100)`, `is_featured: boolean`, `fixture_id: uuid|null`, `gallery_id: uuid|null`, `published_at: ISO datetime string`
  - `type ArticleFields = z.infer<typeof articleFieldsSchema>`
  - `articleActionSchema`: discriminated union on `action`: `{ action: 'save'; fields: ArticleFields } | { action: 'publish'; fields: ArticleFields } | { action: 'unpublish' }`
  - `validateForPublish(a: { title?: string | null; content?: string | null }): string | null`
  - `prepareFields(fields: ArticleFields): Record<string, unknown>`
  - `buildPublishUpdate(current: { status: string; published_at: string | null }, fields: ArticleFields, now: Date, slug?: string): Record<string, unknown>`
  - `isMissingColumnError(error: { code?: string; message?: string } | null): boolean`
  - `MIGRATION_MESSAGE = 'Datubāzei vajadzīgs atjauninājums'`

- [ ] **Step 1: Create the migration `supabase/migrations/2026-10-13-articles-publishing.sql`**

```sql
-- Admin step 1: drafts, scheduling, excerpt and match/gallery links for articles.
-- Safe to run more than once. Existing articles stay published.
alter table articles add column if not exists status text not null default 'published';
do $$ begin
  alter table articles add constraint articles_status_check check (status in ('draft', 'published'));
exception when duplicate_object then null; end $$;
alter table articles add column if not exists excerpt text;
alter table articles add column if not exists fixture_id uuid references fixtures(id) on delete set null;
alter table articles add column if not exists gallery_id uuid references galleries(id) on delete set null;
alter table articles alter column title drop not null;
alter table articles alter column content set default '';
create index if not exists articles_visible_idx on articles (status, published_at desc);
```

- [ ] **Step 2: Ask the owner to run the migration and wait**

Tell the owner (in Latvian-free plain English, they are not technical): open Supabase → SQL Editor → paste the file's contents → Run → reply "done". The old site keeps working after it (it ignores the new columns). Do not continue to Task 6 before they confirm. Tasks 4 and 5 can continue meanwhile.

- [ ] **Step 3: Update `types/supabase.ts` `Article`**

Replace lines 1-11 with:

```ts
export type Article = {
  id: string
  title: string
  content: string
  image_url?: string
  published_at: string
  updated_at: string
  author?: string
  slug: string
  is_featured: boolean
  status?: 'draft' | 'published'
  excerpt?: string | null
  fixture_id?: string | null
  gallery_id?: string | null
}
```

- [ ] **Step 4: Write the failing tests `lib/article-publish.test.ts`**

```ts
import { describe, it, expect, beforeAll } from 'vitest'
import {
  articleFieldsSchema, articleActionSchema, validateForPublish, prepareFields,
  buildPublishUpdate, isMissingColumnError,
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
```

- [ ] **Step 5: Run tests to verify they fail**

Run: `npx vitest run lib/article-publish.test.ts`
Expected: FAIL, module `./article-publish` not found.

- [ ] **Step 6: Implement `lib/article-publish.ts`**

```ts
import { z } from 'zod'
import { plainText } from './articles'
import { sanitizeArticleHtml } from './sanitize-article'

export const MIGRATION_MESSAGE = 'Datubāzei vajadzīgs atjauninājums'

export const articleFieldsSchema = z.object({
  title: z.string().max(255).nullable().optional(),
  content: z.string().max(200_000).optional(),
  image_url: z.string().url().nullable().optional(),
  excerpt: z.string().max(160).nullable().optional(),
  author: z.string().max(100).nullable().optional(),
  is_featured: z.boolean().optional(),
  fixture_id: z.string().uuid().nullable().optional(),
  gallery_id: z.string().uuid().nullable().optional(),
  published_at: z.string().datetime({ offset: true }).optional(),
})

export type ArticleFields = z.infer<typeof articleFieldsSchema>

export const articleActionSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('save'), fields: articleFieldsSchema }),
  z.object({ action: z.literal('publish'), fields: articleFieldsSchema }),
  z.object({ action: z.literal('unpublish') }),
])

export function validateForPublish(a: { title?: string | null; content?: string | null }): string | null {
  if (!a.title?.trim()) return 'Pievieno virsrakstu'
  const content = a.content ?? ''
  const hasMedia = /<figure|<img|data-video-embed/.test(content)
  if (!plainText(content) && !hasMedia) return 'Ziņai vajag tekstu, foto vai video'
  return null
}

const trimOrNull = (v: string | null | undefined) => {
  if (v === undefined) return undefined
  const t = v?.trim() ?? ''
  return t ? t : null
}

export function prepareFields(fields: ArticleFields): Record<string, unknown> {
  const out: Record<string, unknown> = { ...fields }
  if (fields.title !== undefined) out.title = fields.title?.trim() ?? null
  if (fields.excerpt !== undefined) out.excerpt = trimOrNull(fields.excerpt)
  if (fields.author !== undefined) out.author = trimOrNull(fields.author)
  if (fields.content !== undefined) out.content = sanitizeArticleHtml(fields.content)
  delete out.published_at
  return out
}

export function buildPublishUpdate(
  current: { status: string; published_at: string | null },
  fields: ArticleFields,
  now: Date,
  slug?: string
): Record<string, unknown> {
  const published_at =
    fields.published_at ?? (current.status === 'draft' || !current.published_at ? now.toISOString() : current.published_at)
  return {
    ...prepareFields(fields),
    status: 'published',
    published_at,
    updated_at: now.toISOString(),
    ...(slug ? { slug } : {}),
  }
}

export function isMissingColumnError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false
  return error.code === '42703' || error.code === 'PGRST204' || /column .* does not exist/i.test(error.message ?? '')
}
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx vitest run lib/article-publish.test.ts`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add supabase/migrations/2026-10-13-articles-publishing.sql types/supabase.ts lib/article-publish.ts lib/article-publish.test.ts
git commit -m "feat: add article publishing migration and publish rules" -m "Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Article API routes and upload hardening

**Files:**
- Create: `app/api/admin/articles/[id]/route.ts`, `lib/upload-rules.ts`, `lib/upload-rules.test.ts`
- Modify: `app/api/admin/articles/route.ts` (full rewrite), `app/api/admin/upload/route.ts:24-47` and the optimization `catch` block

**Interfaces:**
- Consumes: `isAdminRequest` (`lib/admin-auth.ts`), `createAdminClient` (`lib/supabase.ts`), Task 1 `slugify`, `uniqueSlug`; Task 4 `articleActionSchema`, `prepareFields`, `buildPublishUpdate`, `validateForPublish`, `isMissingColumnError`, `MIGRATION_MESSAGE`.
- Produces (used by Tasks 8-11):
  - `GET /api/admin/articles` → `AdminArticle[]` subset `{ id, title, status, published_at, updated_at, image_url, author }[]`, newest edit first. 409 `{ error: MIGRATION_MESSAGE }` before migration.
  - `POST /api/admin/articles` (no body) → `{ id: string }` of a new draft; author prefilled from Clerk.
  - `GET /api/admin/articles/:id` → full row or 404 `{ error: 'Ziņa nav atrasta' }`.
  - `PATCH /api/admin/articles/:id` body `{ action: 'save' | 'publish', fields }` or `{ action: 'unpublish' }` → updated full row. Errors: 400 invalid body, 409 `save` on a published article, 422 `{ error: <validateForPublish message> }`.
  - `DELETE /api/admin/articles/:id` → `{ success: true }`; also removes storage files under `articles/<id>/`.
  - `isSafeUploadFolder(folder: string): boolean`, `isHeicFile(name: string, type: string): boolean`, `HEIC_MESSAGE = 'Šo foto formātu nevar apstrādāt — izvēlies JPG vai PNG'`.

- [ ] **Step 1: Write the failing tests `lib/upload-rules.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { isSafeUploadFolder, isHeicFile } from './upload-rules'

describe('isSafeUploadFolder', () => {
  it.each(['articles', 'players', 'articles/3f2b1c9e-1d2a-4b7c-9a1e-2f3a4b5c6d7e', 'galleries'])('allows %s', (f) => {
    expect(isSafeUploadFolder(f)).toBe(true)
  })
  it.each(['', '../secrets', 'articles/../x', '/abs', 'a/b/c', 'Articles', 'articles/', 'a b'])('rejects %s', (f) => {
    expect(isSafeUploadFolder(f)).toBe(false)
  })
})

describe('isHeicFile', () => {
  it('detects by type or extension', () => {
    expect(isHeicFile('IMG_1.HEIC', '')).toBe(true)
    expect(isHeicFile('photo', 'image/heif')).toBe(true)
    expect(isHeicFile('photo.jpg', 'image/jpeg')).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run lib/upload-rules.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `lib/upload-rules.ts`**

```ts
export const HEIC_MESSAGE = 'Šo foto formātu nevar apstrādāt — izvēlies JPG vai PNG'

// One or two lowercase path segments, e.g. "players" or "articles/<uuid>"
export function isSafeUploadFolder(folder: string): boolean {
  return /^[a-z0-9-]+(\/[a-z0-9-]+)?$/.test(folder)
}

export function isHeicFile(name: string, type: string): boolean {
  return /image\/hei[cf]/i.test(type) || /\.(heic|heif)$/i.test(name)
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run lib/upload-rules.test.ts`
Expected: PASS.

- [ ] **Step 5: Harden `app/api/admin/upload/route.ts`**

Add the import below the existing imports:

```ts
import { isSafeUploadFolder, isHeicFile, HEIC_MESSAGE } from '@/lib/upload-rules'
```

Replace the folder check

```ts
    if (!folder) {
      return NextResponse.json({ error: 'No folder specified' }, { status: 400 })
    }
```

with

```ts
    if (!folder || !isSafeUploadFolder(folder)) {
      return NextResponse.json({ error: 'Nederīga mape' }, { status: 400 })
    }
```

In the image-optimization `catch (optimizationError)` block, add as its first statement:

```ts
            if (isHeicFile(file.name, file.type)) {
              return NextResponse.json({ error: HEIC_MESSAGE }, { status: 415 })
            }
```

Change the size error message to Latvian:

```ts
      return NextResponse.json({ error: 'Fails ir lielāks par 10 MB' }, { status: 400 })
```

- [ ] **Step 6: Rewrite `app/api/admin/articles/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { isAdminRequest } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase'
import { isMissingColumnError, MIGRATION_MESSAGE } from '@/lib/article-publish'

export const dynamic = 'force-dynamic'

// GET - list articles for the admin (all statuses), newest edit first
export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const db = createAdminClient()
  const { data, error } = await db
    .from('articles')
    .select('id, title, status, published_at, updated_at, image_url, author')
    .order('updated_at', { ascending: false })

  if (error) {
    if (isMissingColumnError(error)) return NextResponse.json({ error: MIGRATION_MESSAGE }, { status: 409 })
    console.error('Error listing articles:', error)
    return NextResponse.json({ error: 'Neizdevās ielādēt ziņas' }, { status: 500 })
  }
  return NextResponse.json(data)
}

// POST - create an empty draft so the editor has an id to autosave into
export async function POST() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await currentUser()
  const author =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.emailAddresses[0]?.emailAddress || null

  const db = createAdminClient()
  const { data, error } = await db
    .from('articles')
    .insert({ status: 'draft', title: null, content: '', author })
    .select('id')
    .single()

  if (error) {
    if (isMissingColumnError(error)) return NextResponse.json({ error: MIGRATION_MESSAGE }, { status: 409 })
    console.error('Error creating draft:', error)
    return NextResponse.json({ error: 'Neizdevās izveidot ziņu' }, { status: 500 })
  }
  return NextResponse.json({ id: data.id })
}
```

- [ ] **Step 7: Create `app/api/admin/articles/[id]/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase'
import { slugify, uniqueSlug } from '@/lib/articles'
import {
  articleActionSchema, buildPublishUpdate, isMissingColumnError, MIGRATION_MESSAGE,
  prepareFields, validateForPublish,
} from '@/lib/article-publish'

export const dynamic = 'force-dynamic'

type Params = { params: { id: string } }

const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
const notFound = () => NextResponse.json({ error: 'Ziņa nav atrasta' }, { status: 404 })

function failure(error: { code?: string; message?: string }, fallback: string) {
  if (isMissingColumnError(error)) return NextResponse.json({ error: MIGRATION_MESSAGE }, { status: 409 })
  console.error(fallback, error)
  return NextResponse.json({ error: fallback }, { status: 500 })
}

export async function GET(_req: NextRequest, { params }: Params) {
  if (!(await isAdminRequest())) return unauthorized()
  const db = createAdminClient()
  const { data, error } = await db.from('articles').select('*').eq('id', params.id).maybeSingle()
  if (error) return failure(error, 'Neizdevās ielādēt ziņu')
  return data ? NextResponse.json(data) : notFound()
}

export async function PATCH(request: NextRequest, { params }: Params) {
  if (!(await isAdminRequest())) return unauthorized()

  const parsed = articleActionSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Nederīgi dati' }, { status: 400 })
  }
  const body = parsed.data

  const db = createAdminClient()
  const { data: current, error: loadError } = await db
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .maybeSingle()
  if (loadError) return failure(loadError, 'Neizdevās ielādēt ziņu')
  if (!current) return notFound()

  const now = new Date()
  let update: Record<string, unknown>

  if (body.action === 'save') {
    // Published articles only change through "Atjaunināt", never through autosave
    if (current.status === 'published') {
      return NextResponse.json({ error: 'Publicētu ziņu saglabā ar "Atjaunināt"' }, { status: 409 })
    }
    update = { ...prepareFields(body.fields), updated_at: now.toISOString() }
  } else if (body.action === 'publish') {
    const merged = { ...current, ...body.fields }
    const problem = validateForPublish(merged)
    if (problem) return NextResponse.json({ error: problem }, { status: 422 })

    let slug: string | undefined
    if (!current.slug) {
      const base = slugify(merged.title ?? '')
      const { data: taken } = await db.from('articles').select('slug').like('slug', `${base}%`)
      slug = uniqueSlug(base, (taken ?? []).map((t: { slug: string | null }) => t.slug ?? ''))
    }
    update = buildPublishUpdate(current, body.fields, now, slug)
  } else {
    update = { status: 'draft', updated_at: now.toISOString() }
  }

  const { data, error } = await db.from('articles').update(update).eq('id', params.id).select('*').single()
  if (error) return failure(error, 'Neizdevās saglabāt ziņu')
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!(await isAdminRequest())) return unauthorized()
  const db = createAdminClient()
  const { error } = await db.from('articles').delete().eq('id', params.id)
  if (error) return failure(error, 'Neizdevās dzēst ziņu')

  // Clean up this article's photos; a failure here must not undo the delete
  const folder = `articles/${params.id}`
  const { data: files } = await db.storage.from('media').list(folder)
  if (files?.length) {
    const { error: removeError } = await db.storage.from('media').remove(files.map((f) => `${folder}/${f.name}`))
    if (removeError) console.error('Error removing article files:', removeError)
  }
  return NextResponse.json({ success: true })
}
```

- [ ] **Step 8: Check nothing else used the old article API shapes**

Run: `grep -rn "api/admin/articles" app components lib --include=*.ts --include=*.tsx`
Expected: only `app/admin/articles/page.tsx` (replaced in Task 9) and the new files. If another caller sends `PATCH`/`DELETE` with `{ id }` in the body, note it for Task 9.

- [ ] **Step 9: Type-check and verify signed-out access is refused**

Run: `npx tsc --noEmit -p . 2>&1 | grep -E "api/admin/articles|api/admin/upload|lib/upload-rules"`
Expected: no output.
With the dev server on port 3000 running, run in Node (no curl with a body, a hook blocks it):

```bash
node -e "(async()=>{for(const [m,u] of [['GET','/api/admin/articles'],['POST','/api/admin/articles'],['GET','/api/admin/articles/00000000-0000-0000-0000-000000000000'],['PATCH','/api/admin/articles/00000000-0000-0000-0000-000000000000'],['DELETE','/api/admin/articles/00000000-0000-0000-0000-000000000000']]){const r=await fetch('http://localhost:3000'+u,{method:m});console.log(m,u,r.status)}})()"
```

Expected: every line ends with `401`.

- [ ] **Step 10: Commit**

```bash
git add lib/upload-rules.ts lib/upload-rules.test.ts app/api/admin/upload/route.ts app/api/admin/articles/route.ts "app/api/admin/articles/[id]/route.ts"
git commit -m "feat: rewrite article admin API with drafts, publish and safe uploads" -m "Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Public pages respect drafts and scheduling

Precondition: the owner confirmed the migration ran (Task 4 Step 2). Without it `status` does not exist and these queries return nothing.

**Files:**
- Modify: `app/page.tsx` (`getArticles`), `app/news/page.tsx` (articles query), `app/news/[id]/page.tsx`, `app/news/[id]/news-detail-client.tsx`, `app/news/[id]/opengraph-image.tsx`, `app/sitemap.ts`, `components/features/home-news-section.tsx` (`getContent`), `lib/api.ts`, `app/globals.css`

**Interfaces:**
- Consumes: `onlyVisible`, `excerptFor`, `formatRigaDate` (Task 1); `sanitizeArticleHtml` (Task 3).
- Produces (used by Task 12 preview): `NewsDetailClient` accepts two new optional props `linkedFixture?: LinkedFixture | null` and `linkedGallery?: LinkedGallery | null`, where `type LinkedFixture = { id: string; opponent: string; match_date: string; is_home_game: boolean; score?: string | null }` and `type LinkedGallery = { id: string; title: string }`, both exported from `app/news/[id]/news-detail-client.tsx`.

- [ ] **Step 1: Home page query (`app/page.tsx`)**

Add `import { onlyVisible } from '@/lib/articles'` and change `getArticles` to:

```ts
    const { data, error } = await onlyVisible(supabase.from('articles').select('*'))
      .order('published_at', { ascending: false })
      .limit(4)
```

- [ ] **Step 2: News list (`app/news/page.tsx`)**

Add the same import and change its query to:

```ts
    const { data, error } = await onlyVisible(supabase.from('articles').select('*'))
      .order('published_at', { ascending: false })
```

Then run `grep -n "content" app/news/page.tsx`. Wherever an article snippet is built from `content` (e.g. `stripHtml(article.content)` or a substring of it), use `excerptFor(article)` instead (import it from `@/lib/articles`).

- [ ] **Step 3: Sitemap (`app/sitemap.ts`) and share image (`app/news/[id]/opengraph-image.tsx`)**

Sitemap:

```ts
  const { data: articles } = await onlyVisible(supabase.from('articles').select('id, published_at'))
    .order('published_at', { ascending: false });
```

Share image:

```ts
  const { data: article } = await onlyVisible(
    supabase.from('articles').select('title, image_url, published_at').eq('id', params.id)
  ).maybeSingle()
```

Add `import { onlyVisible } from '@/lib/articles'` to both.

- [ ] **Step 4: Article page (`app/news/[id]/page.tsx`)**

Add imports:

```ts
import { notFound } from 'next/navigation'
import { onlyVisible, excerptFor } from '@/lib/articles'
import { sanitizeArticleHtml } from '@/lib/sanitize-article'
import type { LinkedFixture, LinkedGallery } from './news-detail-client'
```

Replace `getArticle` and `getRelatedArticles` bodies' queries:

```ts
    const { data, error } = await onlyVisible(supabase.from('articles').select('*').eq('id', id)).maybeSingle()
```

```ts
    const { data } = await onlyVisible(supabase.from('articles').select('*').neq('id', id))
      .order('published_at', { ascending: false })
      .limit(3)
```

Add after `getLatestGalleries`:

```ts
async function getLinked(article: Article): Promise<{ fixture: LinkedFixture | null; gallery: LinkedGallery | null }> {
  const [fixture, gallery] = await Promise.all([
    article.fixture_id
      ? supabase.from('fixtures').select('id, opponent, match_date, is_home_game, score').eq('id', article.fixture_id).maybeSingle()
      : Promise.resolve({ data: null }),
    article.gallery_id
      ? supabase.from('galleries').select('id, title').eq('id', article.gallery_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ])
  return { fixture: fixture.data ?? null, gallery: gallery.data ?? null }
}
```

In `generateMetadata`, replace the two lines computing `plainText`/`description` with:

```ts
  const description = excerptFor(article)
```

and delete the now-unused local `stripHtml` function.

In `NewsDetailPage`, after the `Promise.all`, add:

```ts
  if (!article) notFound()
  const linked = await getLinked(article)
  const safeArticle = { ...article, content: sanitizeArticleHtml(article.content) }
```

and pass `article={safeArticle}`, `linkedFixture={linked.fixture}`, `linkedGallery={linked.gallery}` to `NewsDetailClient`; use `safeArticle` in `generateJsonLd`.

- [ ] **Step 5: Linked match and gallery cards (`app/news/[id]/news-detail-client.tsx`)**

Add near the props interface and extend the props:

```ts
export type LinkedFixture = { id: string; opponent: string; match_date: string; is_home_game: boolean; score?: string | null }
export type LinkedGallery = { id: string; title: string }
```

```ts
interface NewsDetailClientProps {
  article: Article | null
  relatedArticles: Article[]
  latestGalleries: GalleryWithThumbnail[]
  pageUrl: string
  linkedFixture?: LinkedFixture | null
  linkedGallery?: LinkedGallery | null
}
```

Destructure `linkedFixture`, `linkedGallery` in the component signature and add `import { formatRigaDate } from '@/lib/articles'`. Insert directly after the closing `</article>` tag of the article body:

```tsx
                {(linkedFixture || linkedGallery) && (
                  <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    {linkedFixture && (
                      <Link href="/fixtures" className="group block border border-[#e5e5e5] p-5 hover:border-club transition-colors">
                        <span className="font-cond text-[11px] font-bold tracking-[2px] uppercase text-[#888]">Spēle</span>
                        <span className="block font-display text-xl font-bold uppercase text-[#111] mt-1">
                          {linkedFixture.is_home_game ? `Fēnikss v ${linkedFixture.opponent}` : `${linkedFixture.opponent} v Fēnikss`}
                        </span>
                        <span className="block font-cond text-sm text-[#666] mt-1">
                          {formatRigaDate(linkedFixture.match_date)}{linkedFixture.score ? ` · ${linkedFixture.score}` : ''}
                        </span>
                      </Link>
                    )}
                    {linkedGallery && (
                      <Link href={`/gallery/${linkedGallery.id}`} className="group block bg-club text-white p-5 hover:bg-club-deep transition-colors">
                        <span className="font-cond text-[11px] font-bold tracking-[2px] uppercase text-club-mint">Foto</span>
                        <span className="block font-display text-xl font-bold uppercase mt-1">Skatīt foto galeriju</span>
                        <span className="block font-cond text-sm text-white/70 mt-1">{linkedGallery.title}</span>
                      </Link>
                    )}
                  </div>
                )}
```

- [ ] **Step 6: Home news cards use the excerpt (`components/features/home-news-section.tsx`)**

Change the `getContent` line for articles to:

```ts
    if ('id' in item) return item.excerpt?.trim() || stripHtml(item.content)
```

- [ ] **Step 7: Remove unused article readers in `lib/api.ts`**

Run: `grep -n "from('articles')" lib/api.ts` and, for each enclosing exported function, `grep -rn "<functionName>" app components lib --include=*.ts --include=*.tsx`. Delete every article function in `lib/api.ts` that has no caller outside `lib/api.ts`. If one does have a caller, wrap its query with `onlyVisible(...)` instead.

- [ ] **Step 8: Article figure and video styles (`app/globals.css`)**

Append at the end of the file:

```css
/* Article body: photos with captions and responsive video embeds (public page and editor) */
.prose figure, .ProseMirror figure { margin: 1.75rem 0; }
.prose figure img, .ProseMirror figure img { width: 100%; height: auto; display: block; margin: 0; }
.prose figcaption, .ProseMirror figcaption { font-size: 0.875rem; color: #666; margin-top: 0.5rem; }
[data-video-embed] { position: relative; aspect-ratio: 16 / 9; margin: 1.75rem 0; background: #111; }
[data-video-embed] iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
```

- [ ] **Step 9: Verify**

Run: `npx tsc --noEmit -p . 2>&1 | grep -E "app/page.tsx|app/news|app/sitemap|home-news-section|lib/api.ts"` → no output.
Run: `npx vitest run` → all PASS.
With the dev server on port 3000: open `/`, `/news`, an existing `/news/<id>` and `/sitemap.xml`; existing articles still appear (they were migrated as published). Then in Supabase set one test article's `status` to `draft`, reload `/news` and its `/news/<id>`: it must be gone and its URL must show the 404 page. Set it back to `published`.

- [ ] **Step 10: Commit**

```bash
git add app/page.tsx app/news app/sitemap.ts components/features/home-news-section.tsx lib/api.ts app/globals.css
git commit -m "feat: hide drafts and scheduled articles from public pages" -m "Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Admin shell

**Files:**
- Create: `components/admin/shell/admin-nav.ts`, `components/admin/shell/admin-nav.test.ts`, `components/admin/shell/admin-shell.tsx`, `components/admin/shell/admin-sidebar.tsx`, `components/admin/shell/admin-tab-bar.tsx`, `components/admin/shell/quick-add-button.tsx`, `components/admin/articles/use-create-article.ts`
- Modify: `app/admin/layout.tsx`

**Interfaces:**
- Produces:
  - `adminNav: AdminNavItem[]`, `type AdminNavItem = { href: string; label: string; icon: LucideIcon; inTabBar?: boolean }`
  - `isActiveNav(pathname: string, href: string): boolean`
  - `isEditorPath(pathname: string): boolean` (true for `/admin/articles/<id>`, false for `/admin/articles` and `/preview` paths)
  - `isPreviewPath(pathname: string): boolean`
  - `useCreateArticle(): { create: () => Promise<void>; creating: boolean }` (used by Tasks 8, 9)
  - `<AdminShell>{children}</AdminShell>`

- [ ] **Step 1: Write the failing tests `components/admin/shell/admin-nav.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { isActiveNav, isEditorPath, isPreviewPath } from './admin-nav'

describe('admin navigation', () => {
  it('matches the dashboard only exactly', () => {
    expect(isActiveNav('/admin', '/admin')).toBe(true)
    expect(isActiveNav('/admin/articles', '/admin')).toBe(false)
  })
  it('matches sections by prefix', () => {
    expect(isActiveNav('/admin/articles/abc', '/admin/articles')).toBe(true)
    expect(isActiveNav('/admin/gallery', '/admin/articles')).toBe(false)
  })
  it('detects editor and preview paths', () => {
    expect(isEditorPath('/admin/articles/3f2b')).toBe(true)
    expect(isEditorPath('/admin/articles')).toBe(false)
    expect(isEditorPath('/admin/articles/3f2b/preview')).toBe(false)
    expect(isPreviewPath('/admin/articles/3f2b/preview')).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run components/admin/shell/admin-nav.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `components/admin/shell/admin-nav.ts`**

```ts
import { Home, Newspaper, Images, CalendarDays, Users, UserCog, Clock, type LucideIcon } from 'lucide-react'

export type AdminNavItem = { href: string; label: string; icon: LucideIcon; inTabBar?: boolean }

export const adminNav: AdminNavItem[] = [
  { href: '/admin', label: 'Sākums', icon: Home, inTabBar: true },
  { href: '/admin/articles', label: 'Ziņas', icon: Newspaper, inTabBar: true },
  { href: '/admin/gallery', label: 'Galerijas', icon: Images, inTabBar: true },
  { href: '/admin/fixtures', label: 'Spēles', icon: CalendarDays },
  { href: '/admin/players', label: 'Spēlētāji', icon: Users },
  { href: '/admin/coaches', label: 'Treneri', icon: UserCog },
  { href: '/admin/training', label: 'Treniņi', icon: Clock },
]

export function isActiveNav(pathname: string, href: string): boolean {
  return href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(`${href}/`)
}

export function isEditorPath(pathname: string): boolean {
  return /^\/admin\/articles\/[^/]+$/.test(pathname)
}

export function isPreviewPath(pathname: string): boolean {
  return pathname.endsWith('/preview')
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run components/admin/shell/admin-nav.test.ts`
Expected: PASS.

- [ ] **Step 5: Create `components/admin/articles/use-create-article.ts`**

```ts
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// "+ Jauna ziņa" creates a draft first, so autosave always has an id. A button, not a link:
// a prefetched link would create empty drafts.
export function useCreateArticle() {
  const router = useRouter()
  const [creating, setCreating] = useState(false)

  const create = async () => {
    if (creating) return
    setCreating(true)
    try {
      const res = await fetch('/api/admin/articles', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Neizdevās izveidot ziņu')
      router.push(`/admin/articles/${data.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Neizdevās izveidot ziņu')
      setCreating(false)
    }
  }

  return { create, creating }
}
```

- [ ] **Step 6: Create `components/admin/shell/admin-sidebar.tsx`**

```tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { ExternalLink } from 'lucide-react'
import { adminNav, isActiveNav } from './admin-nav'

export function AdminSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden lg:flex flex-col sticky top-0 h-screen bg-club-deep text-white px-3 py-5">
      <Link href="/admin" className="flex items-center gap-2.5 px-2 pb-6">
        <Image src="/Logo/fēniks_logo-removebg-preview.png" alt="" width={32} height={32} className="object-contain" />
        <span className="font-display text-lg font-bold uppercase tracking-wide">FNX Admin</span>
      </Link>
      <nav className="flex flex-col gap-1" aria-label="Admin sadaļas">
        {adminNav.map(({ href, label, icon: Icon }) => {
          const active = isActiveNav(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] font-medium transition-colors ${
                active ? 'bg-white/15 text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto border-t border-white/10 pt-4 flex flex-col gap-3 px-2">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/75 hover:text-white">
          <ExternalLink className="h-4 w-4" /> Skatīt mājaslapu
        </a>
        <UserButton afterSignOutUrl="/" showName />
      </div>
    </aside>
  )
}
```

- [ ] **Step 7: Create `components/admin/shell/quick-add-button.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { Plus, Newspaper, Images } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCreateArticle } from '@/components/admin/articles/use-create-article'

export function QuickAddButton() {
  const { create, creating } = useCreateArticle()
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Pievienot"
        className="lg:hidden fixed right-4 bottom-[calc(76px+env(safe-area-inset-bottom,0px))] z-40 h-14 w-14 rounded-full bg-teal-700 text-white shadow-lg grid place-items-center active:scale-95 transition-transform"
      >
        <Plus className="h-7 w-7" />
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-56 p-1.5">
        <button
          type="button"
          onClick={create}
          disabled={creating}
          className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left font-medium hover:bg-club-pale disabled:opacity-60"
        >
          <Newspaper className="h-5 w-5 text-club" /> {creating ? 'Veido…' : 'Jauna ziņa'}
        </button>
        <Link href="/admin/gallery" className="flex items-center gap-3 rounded-md px-3 py-3 font-medium hover:bg-club-pale">
          <Images className="h-5 w-5 text-club" /> Pievienot foto
        </Link>
      </PopoverContent>
    </Popover>
  )
}
```

- [ ] **Step 8: Create `components/admin/shell/admin-tab-bar.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { MoreHorizontal, ExternalLink } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { adminNav, isActiveNav } from './admin-nav'

export function AdminTabBar({ pathname }: { pathname: string }) {
  const tabs = adminNav.filter((i) => i.inTabBar)
  const more = adminNav.filter((i) => !i.inTabBar)
  const moreActive = more.some((i) => isActiveNav(pathname, i.href))

  const tabClass = (active: boolean) =>
    `flex flex-col items-center gap-1 py-2 text-[11px] font-semibold ${active ? 'text-club' : 'text-[#5B6863]'}`

  return (
    <nav
      aria-label="Admin sadaļas"
      className="lg:hidden fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-[#DCE3DF] bg-white pb-[env(safe-area-inset-bottom,0px)]"
    >
      {tabs.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={tabClass(isActiveNav(pathname, href))}>
          <Icon className="h-5 w-5" />
          {label}
        </Link>
      ))}
      <Sheet>
        <SheetTrigger className={tabClass(moreActive)}>
          <MoreHorizontal className="h-5 w-5" />
          Vairāk
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Vairāk</SheetTitle>
          </SheetHeader>
          <div className="mt-3 grid gap-1">
            {more.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 rounded-md px-3 py-3 font-medium hover:bg-club-pale">
                <Icon className="h-5 w-5 text-club" /> {label}
              </Link>
            ))}
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-md px-3 py-3 font-medium hover:bg-club-pale">
              <ExternalLink className="h-5 w-5 text-club" /> Skatīt mājaslapu
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}
```

Note: shadcn `SheetContent` closes when the route changes only if wrapped; that's acceptable here since links navigate away. If the sheet stays open after navigation in testing, control it with `open`/`onOpenChange` state and close it in each link's `onClick`.

- [ ] **Step 9: Create `components/admin/shell/admin-shell.tsx`**

```tsx
'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { adminNav, isActiveNav, isEditorPath, isPreviewPath } from './admin-nav'
import { AdminSidebar } from './admin-sidebar'
import { AdminTabBar } from './admin-tab-bar'
import { QuickAddButton } from './quick-add-button'

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // The preview shows the article exactly like the public page, without admin chrome
  if (isPreviewPath(pathname)) return <>{children}</>

  // The editor brings its own top bar and keyboard toolbar on phones
  const editor = isEditorPath(pathname)
  const current = adminNav.find((i) => isActiveNav(pathname, i.href))

  return (
    <div className="min-h-screen bg-[#F4F6F5] text-[#141414] font-body lg:grid lg:grid-cols-[232px_1fr]">
      <AdminSidebar pathname={pathname} />
      <div className="min-w-0 flex flex-col min-h-screen">
        {!editor && (
          <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#DCE3DF] bg-white px-4">
            <span className="font-display text-xl font-bold uppercase text-club">{current?.label ?? 'Admin'}</span>
            <UserButton afterSignOutUrl="/" />
          </header>
        )}
        <main className={`flex-1 ${editor ? '' : 'pb-28 lg:pb-10'}`}>{children}</main>
      </div>
      {!editor && <AdminTabBar pathname={pathname} />}
      {!editor && <QuickAddButton />}
    </div>
  )
}
```

- [ ] **Step 10: Use the shell in `app/admin/layout.tsx`**

Replace the `MainLayout` import with `import { AdminShell } from '@/components/admin/shell/admin-shell'` and the return with:

```tsx
  return <AdminShell>{children}</AdminShell>
```

- [ ] **Step 11: Verify**

Run: `npx vitest run` → PASS. `npx tsc --noEmit -p . 2>&1 | grep -E "components/admin|app/admin/layout"` → no output.
Owner check (needs login) on `http://localhost:3000/admin/gallery` at desktop width and in the browser's phone mode (390px): sidebar on desktop; title bar, bottom tab bar with Sākums/Ziņas/Galerijas/Vairāk and the "+" button on phone; "Vairāk" opens the sheet; the old gallery page still works inside the shell.

- [ ] **Step 12: Commit**

```bash
git add components/admin/shell components/admin/articles/use-create-article.ts app/admin/layout.tsx
git commit -m "feat: add admin shell with sidebar, phone tab bar and quick add" -m "Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Dashboard

**Files:**
- Create: `components/admin/migration-notice.tsx`, `components/admin/articles/article-status-pill.tsx`, `components/admin/dashboard/visitor-stats.tsx`, `components/admin/dashboard/new-article-button.tsx`
- Modify: `app/admin/page.tsx` (full rewrite)

**Interfaces:**
- Consumes: `articleState`, `formatRigaDateTime` (Task 1); `isMissingColumnError` (Task 4); `useCreateArticle` (Task 7).
- Produces (used by Tasks 9, 10):
  - `<MigrationNotice />`
  - `<ArticleStatusPill status={string | null} publishedAt={string | null} />`

- [ ] **Step 1: Create `components/admin/migration-notice.tsx`**

```tsx
export function MigrationNotice() {
  return (
    <div className="rounded-lg border border-[#F0C828] bg-[#FFF8E1] p-5">
      <p className="font-semibold">Datubāzei vajadzīgs atjauninājums</p>
      <p className="mt-1 text-sm text-[#5B6863]">
        Supabase SQL redaktorā palaid failu <code>supabase/migrations/2026-10-13-articles-publishing.sql</code> un pārlādē lapu.
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Create `components/admin/articles/article-status-pill.tsx`**

```tsx
import { articleState, formatRigaDateTime } from '@/lib/articles'

const styles = {
  draft: 'bg-[#FFF4D6] text-[#8A5A00]',
  scheduled: 'bg-[#E3EEFB] text-[#1F4E8C]',
  published: 'bg-[#E2F3EA] text-[#146C43]',
}

export function ArticleStatusPill({ status, publishedAt }: { status: string | null; publishedAt: string | null }) {
  const state = articleState({ status, published_at: publishedAt })
  const label =
    state === 'draft' ? 'Melnraksts' : state === 'scheduled' ? `Ieplānots · ${formatRigaDateTime(publishedAt!)}` : 'Publicēts'
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${styles[state]}`}>{label}</span>
}
```

- [ ] **Step 3: Create `components/admin/dashboard/new-article-button.tsx`**

```tsx
'use client'

import { Newspaper } from 'lucide-react'
import { useCreateArticle } from '@/components/admin/articles/use-create-article'

export function NewArticleButton() {
  const { create, creating } = useCreateArticle()
  return (
    <button
      type="button"
      onClick={create}
      disabled={creating}
      className="flex items-center gap-3 rounded-lg bg-club px-5 py-4 text-left text-white hover:bg-club-deep disabled:opacity-60 transition-colors"
    >
      <Newspaper className="h-6 w-6 shrink-0" />
      <span className="font-semibold">{creating ? 'Veido…' : 'Jauna ziņa'}</span>
    </button>
  )
}
```

- [ ] **Step 4: Create `components/admin/dashboard/visitor-stats.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

type Period = 'week' | 'month' | 'year'
type Stats = { totalViews: number; todayViews: number; weekViews: number; monthViews: number; chartData: { date: string; views: number }[] }

const chartConfig = { views: { label: 'Skatījumi', color: '#014D43' } } satisfies ChartConfig
const periods: { key: Period; label: string }[] = [
  { key: 'week', label: 'Nedēļa' },
  { key: 'month', label: 'Mēnesis' },
  { key: 'year', label: 'Gads' },
]

export function VisitorStats() {
  const [period, setPeriod] = useState<Period>('week')
  const [stats, setStats] = useState<Stats | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    setFailed(false)
    fetch(`/api/page-views?period=${period}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Stats) => { if (!cancelled) setStats(data) })
      .catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [period])

  return (
    <section className="rounded-lg border border-[#DCE3DF] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">Apmeklējumi</h2>
        <div className="flex gap-1 rounded-md bg-club-pale p-1">
          {periods.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPeriod(p.key)}
              className={`rounded px-3 py-1 text-sm font-semibold ${period === p.key ? 'bg-white shadow-sm' : 'text-[#5B6863]'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      {failed ? (
        <p className="mt-4 text-sm text-[#5B6863]">Neizdevās ielādēt statistiku.</p>
      ) : (
        <>
          <dl className="mt-4 grid grid-cols-3 gap-3">
            {[
              ['Šodien', stats?.todayViews],
              ['Nedēļā', stats?.weekViews],
              ['Mēnesī', stats?.monthViews],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-md bg-[#F4F6F5] p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-[#5B6863]">{label}</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums">{value ?? '–'}</dd>
              </div>
            ))}
          </dl>
          <ChartContainer config={chartConfig} className="mt-4 h-40 w-full">
            <AreaChart data={stats?.chartData ?? []} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={24} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area dataKey="views" type="monotone" stroke="var(--color-views)" fill="var(--color-views)" fillOpacity={0.15} />
            </AreaChart>
          </ChartContainer>
        </>
      )}
    </section>
  )
}
```

- [ ] **Step 5: Rewrite `app/admin/page.tsx`**

```tsx
import Link from 'next/link'
import { Images, ExternalLink } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase'
import { articleState, formatRigaDateTime } from '@/lib/articles'
import { isMissingColumnError } from '@/lib/article-publish'
import { MigrationNotice } from '@/components/admin/migration-notice'
import { ArticleStatusPill } from '@/components/admin/articles/article-status-pill'
import { NewArticleButton } from '@/components/admin/dashboard/new-article-button'
import { VisitorStats } from '@/components/admin/dashboard/visitor-stats'

export const dynamic = 'force-dynamic'

type Row = { id: string; title: string | null; status: string | null; published_at: string; updated_at: string }

function Section({ title, empty, children }: { title: string; empty: string; children: React.ReactNode[] }) {
  return (
    <section className="rounded-lg border border-[#DCE3DF] bg-white">
      <h2 className="border-b border-[#DCE3DF] px-5 py-3 font-semibold">{title}</h2>
      {children.length ? <ul className="divide-y divide-[#DCE3DF]">{children}</ul> : <p className="px-5 py-4 text-sm text-[#5B6863]">{empty}</p>}
    </section>
  )
}

export default async function AdminHome() {
  const db = createAdminClient()
  const { data, error } = await db
    .from('articles')
    .select('id, title, status, published_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(60)

  const now = new Date()
  const rows = (data ?? []) as Row[]
  const drafts = rows.filter((a) => articleState(a, now) === 'draft').slice(0, 5)
  const scheduled = rows
    .filter((a) => articleState(a, now) === 'scheduled')
    .sort((a, b) => a.published_at.localeCompare(b.published_at))
  const recent = rows
    .filter((a) => articleState(a, now) === 'published')
    .sort((a, b) => b.published_at.localeCompare(a.published_at))
    .slice(0, 5)

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 lg:px-8 lg:py-10">
      <h1 className="hidden lg:block font-display text-3xl font-bold uppercase text-club">Sākums</h1>

      <div className="grid grid-cols-2 gap-3">
        <NewArticleButton />
        <Link href="/admin/gallery" className="flex items-center gap-3 rounded-lg bg-club-pale px-5 py-4 font-semibold text-club hover:bg-[#E2EAE5]">
          <Images className="h-6 w-6 shrink-0" /> Pievienot foto
        </Link>
      </div>

      {error && isMissingColumnError(error) ? (
        <MigrationNotice />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Turpināt rakstīt" empty="Nav nepabeigtu melnrakstu.">
            {drafts.map((a) => (
              <li key={a.id}>
                <Link href={`/admin/articles/${a.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-[#F4F6F5]">
                  <span className="min-w-0 truncate font-medium">{a.title || 'Bez nosaukuma'}</span>
                  <span className="shrink-0 text-xs text-[#5B6863]">{formatRigaDateTime(a.updated_at)}</span>
                </Link>
              </li>
            ))}
          </Section>
          <Section title="Ieplānots" empty="Nekas nav ieplānots.">
            {scheduled.map((a) => (
              <li key={a.id}>
                <Link href={`/admin/articles/${a.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-[#F4F6F5]">
                  <span className="min-w-0 truncate font-medium">{a.title}</span>
                  <ArticleStatusPill status={a.status} publishedAt={a.published_at} />
                </Link>
              </li>
            ))}
          </Section>
          <div className="lg:col-span-2">
            <Section title="Nesen publicēts" empty="Vēl nav publicētu ziņu.">
              {recent.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <Link href={`/admin/articles/${a.id}`} className="min-w-0 truncate font-medium hover:text-club">{a.title}</Link>
                  <a href={`/news/${a.id}`} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center gap-1 text-sm text-[#5B6863] hover:text-club">
                    Skatīt <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </li>
              ))}
            </Section>
          </div>
        </div>
      )}

      <VisitorStats />
    </div>
  )
}
```

- [ ] **Step 6: Verify**

`npx tsc --noEmit -p . 2>&1 | grep -E "app/admin/page|components/admin"` → no output. Owner check (logged in) at `/admin`, desktop and 390px: quick actions, three sections (empty states readable), visitor chart loads.

- [ ] **Step 7: Commit**

```bash
git add app/admin/page.tsx components/admin/migration-notice.tsx components/admin/articles/article-status-pill.tsx components/admin/dashboard
git commit -m "feat: new admin dashboard with drafts, scheduled and recent articles" -m "Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Article list

**Files:**
- Create: `components/admin/articles/article-list.tsx`
- Modify: `app/admin/articles/page.tsx` (full rewrite; the old 691-line client page is replaced)

**Interfaces:**
- Consumes: `articleState`, `formatRigaDateTime`, `ArticleState` (Task 1); `isMissingColumnError` (Task 4); `ArticleStatusPill`, `MigrationNotice` (Task 8); `useCreateArticle` (Task 7).
- Produces: `type ArticleListItem = { id: string; title: string | null; status: string | null; published_at: string; updated_at: string; image_url: string | null; author: string | null }`.

- [ ] **Step 1: Create `components/admin/articles/article-list.tsx`**

```tsx
'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, ExternalLink } from 'lucide-react'
import { articleState, formatRigaDateTime, type ArticleState } from '@/lib/articles'
import { ArticleStatusPill } from './article-status-pill'
import { useCreateArticle } from './use-create-article'

export type ArticleListItem = {
  id: string; title: string | null; status: string | null; published_at: string
  updated_at: string; image_url: string | null; author: string | null
}

type Filter = 'all' | ArticleState
const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Visas' },
  { key: 'draft', label: 'Melnraksti' },
  { key: 'scheduled', label: 'Ieplānotas' },
  { key: 'published', label: 'Publicētas' },
]

export function ArticleList({ articles }: { articles: ArticleListItem[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const { create, creating } = useCreateArticle()

  const withState = useMemo(() => {
    const now = new Date()
    return articles.map((a) => ({ ...a, state: articleState(a, now) }))
  }, [articles])

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: withState.length, draft: 0, scheduled: 0, published: 0 }
    withState.forEach((a) => { c[a.state]++ })
    return c
  }, [withState])

  const shown = withState.filter(
    (a) => (filter === 'all' || a.state === filter) && (a.title ?? '').toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div className="mx-auto grid max-w-5xl gap-5 px-4 py-6 lg:px-8 lg:py-10">
      <div className="flex items-center gap-3">
        <h1 className="hidden lg:block font-display text-3xl font-bold uppercase text-club">Ziņas</h1>
        <button
          type="button"
          onClick={create}
          disabled={creating}
          className="ml-auto hidden lg:inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2.5 font-semibold text-white hover:bg-teal-600 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> {creating ? 'Veido…' : 'Jauna ziņa'}
        </button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-club-pale p-1" role="tablist">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold ${filter === f.key ? 'bg-white shadow-sm' : 'text-[#5B6863]'}`}
            >
              {f.label} <span className="font-medium text-[#5B6863]">{counts[f.key]}</span>
            </button>
          ))}
        </div>
        <label className="relative lg:ml-auto lg:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6863]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Meklēt ziņas…"
            aria-label="Meklēt ziņas"
            className="w-full rounded-md border border-[#DCE3DF] bg-white py-2 pl-9 pr-3 text-[15px]"
          />
        </label>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[#DCE3DF] bg-white p-8 text-center text-[#5B6863]">
          {query ? 'Nekas netika atrasts.' : 'Šeit vēl nav ziņu.'}
        </p>
      ) : (
        <ul className="grid gap-3 lg:gap-0 lg:divide-y lg:divide-[#DCE3DF] lg:rounded-lg lg:border lg:border-[#DCE3DF] lg:bg-white">
          {shown.map((a) => (
            <li key={a.id} className="rounded-lg border border-[#DCE3DF] bg-white lg:rounded-none lg:border-0">
              <div className="flex items-center gap-4 p-3 lg:px-4">
                <Link href={`/admin/articles/${a.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                  {a.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.image_url} alt="" className="h-14 w-20 shrink-0 rounded object-cover" />
                  ) : (
                    <span className="h-14 w-20 shrink-0 rounded bg-club-pale" />
                  )}
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{a.title || 'Bez nosaukuma'}</span>
                    <span className="mt-0.5 block text-xs text-[#5B6863]">
                      {[a.author, `labots ${formatRigaDateTime(a.updated_at)}`].filter(Boolean).join(' · ')}
                    </span>
                    <span className="mt-1.5 block lg:hidden"><ArticleStatusPill status={a.status} publishedAt={a.published_at} /></span>
                  </span>
                </Link>
                <span className="hidden lg:block"><ArticleStatusPill status={a.status} publishedAt={a.published_at} /></span>
                {a.state === 'published' && (
                  <a href={`/news/${a.id}`} target="_blank" rel="noopener noreferrer" aria-label="Skatīt mājaslapā" className="hidden shrink-0 text-[#5B6863] hover:text-club lg:block">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Rewrite `app/admin/articles/page.tsx`**

```tsx
import { createAdminClient } from '@/lib/supabase'
import { isMissingColumnError } from '@/lib/article-publish'
import { MigrationNotice } from '@/components/admin/migration-notice'
import { ArticleList, type ArticleListItem } from '@/components/admin/articles/article-list'

export const dynamic = 'force-dynamic'

export default async function ArticlesPage() {
  const db = createAdminClient()
  const { data, error } = await db
    .from('articles')
    .select('id, title, status, published_at, updated_at, image_url, author')
    .order('updated_at', { ascending: false })

  if (error && isMissingColumnError(error)) {
    return <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-10"><MigrationNotice /></div>
  }
  if (error) {
    return <p className="mx-auto max-w-5xl px-4 py-10 text-[#5B6863]">Neizdevās ielādēt ziņas. Pārlādē lapu.</p>
  }
  return <ArticleList articles={(data ?? []) as ArticleListItem[]} />
}
```

- [ ] **Step 3: Verify**

`npx tsc --noEmit -p . 2>&1 | grep -E "app/admin/articles|article-list"` → no output. Owner check at `/admin/articles` (desktop + 390px): filters with counts, search, status pills, "+ Jauna ziņa" creates a draft and opens `/admin/articles/<id>` (the editor page arrives in Task 11; until then that URL 404s, which is expected).

- [ ] **Step 4: Commit**

```bash
git add app/admin/articles/page.tsx components/admin/articles/article-list.tsx
git commit -m "feat: new admin article list with filters and search" -m "Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Upload helper and the article body editor

**Files:**
- Create: `lib/upload-with-progress.ts`, `components/admin/articles/editor/upload-store.ts`, `components/admin/articles/editor/figure-node.tsx`, `components/admin/articles/editor/video-node.ts`, `components/admin/articles/editor/use-keyboard-offset.ts`, `components/admin/articles/editor/link-popover.tsx`, `components/admin/articles/editor/video-dialog.tsx`, `components/admin/articles/editor/editor-toolbar.tsx`, `components/admin/articles/editor/body-editor.tsx`

**Interfaces:**
- Consumes: `parseVideoUrl`, `isAllowedEmbedSrc` (Task 2).
- Produces (used by Task 11):
  - `uploadWithProgress(file: File, folder: string, onProgress: (percent: number) => void): Promise<{ url: string; path: string }>`; rejects with an `Error` whose message is the server's Latvian `error` text.
  - `hasPendingUploads(): boolean`
  - `<BodyEditor articleId={string} content={string} onChange={(html: string) => void} />`

- [ ] **Step 1: Create `lib/upload-with-progress.ts`**

```ts
// XHR instead of fetch so the progress bar shows real upload progress
export function uploadWithProgress(
  file: File,
  folder: string,
  onProgress: (percent: number) => void
): Promise<{ url: string; path: string }> {
  return new Promise((resolve, reject) => {
    const form = new FormData()
    form.append('file', file)
    form.append('folder', folder)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/admin/upload')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 95))
    }
    xhr.onload = () => {
      let body: { url?: string; path?: string; error?: string } = {}
      try { body = JSON.parse(xhr.responseText) } catch { /* non-JSON error page */ }
      if (xhr.status >= 200 && xhr.status < 300 && body.url && body.path) {
        onProgress(100)
        resolve({ url: body.url, path: body.path })
      } else {
        reject(new Error(body.error || 'Neizdevās augšupielādēt foto'))
      }
    }
    xhr.onerror = () => reject(new Error('Nav savienojuma — foto netika augšupielādēts'))
    xhr.send(form)
  })
}
```

- [ ] **Step 2: Create `components/admin/articles/editor/upload-store.ts`**

```ts
'use client'

import { useSyncExternalStore } from 'react'

// Upload progress by upload id, shared between the editor and figure node views
const progress = new Map<string, number>()
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export function setUploadProgress(id: string, percent: number) {
  progress.set(id, percent)
  emit()
}

export function clearUploadProgress(id: string) {
  progress.delete(id)
  emit()
}

export function hasPendingUploads(): boolean {
  return progress.size > 0
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useUploadProgress(id: string | null): number {
  return useSyncExternalStore(subscribe, () => (id ? progress.get(id) ?? 0 : 0), () => 0)
}
```

- [ ] **Step 3: Create `components/admin/articles/editor/figure-node.tsx`**

```tsx
'use client'

import { Node, NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from '@tiptap/react'
import { useUploadProgress } from './upload-store'

function FigureView({ node }: NodeViewProps) {
  const uploadId = node.attrs.uploadId as string | null
  const percent = useUploadProgress(uploadId)
  return (
    <NodeViewWrapper as="figure" className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={node.attrs.src} alt={node.attrs.alt ?? ''} className={uploadId ? 'opacity-60' : ''} draggable={false} contentEditable={false} />
      {uploadId && (
        <div contentEditable={false} className="absolute inset-x-3 bottom-12 rounded bg-white/95 px-3 py-2 text-sm font-semibold">
          Augšupielādē… {percent}%
          <div className="mt-1.5 h-1.5 rounded bg-[#DCE3DF]"><div className="h-full rounded bg-teal-700" style={{ width: `${percent}%` }} /></div>
        </div>
      )}
      <NodeViewContent as="figcaption" />
    </NodeViewWrapper>
  )
}

// Photo with an optional caption: <figure><img><figcaption>…</figcaption></figure>
export const Figure = Node.create({
  name: 'figure',
  group: 'block',
  content: 'inline*',
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: '' },
      uploadId: { default: null, rendered: false },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        contentElement: 'figcaption',
        getAttrs: (el) => {
          const img = (el as HTMLElement).querySelector('img')
          return img ? { src: img.getAttribute('src'), alt: img.getAttribute('alt') ?? '' } : false
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (el) => ({ src: (el as HTMLElement).getAttribute('src'), alt: (el as HTMLElement).getAttribute('alt') ?? '' }),
      },
    ]
  },

  renderHTML({ node }) {
    return ['figure', {}, ['img', { src: node.attrs.src, alt: node.attrs.alt }], ['figcaption', 0]]
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigureView)
  },
})
```

- [ ] **Step 4: Create `components/admin/articles/editor/video-node.ts`**

```ts
import { Node } from '@tiptap/react'
import { isAllowedEmbedSrc } from '@/lib/video-embed'

export const VideoEmbed = Node.create({
  name: 'videoEmbed',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      provider: { default: 'youtube' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-video-embed]',
        getAttrs: (el) => {
          const element = el as HTMLElement
          const src = element.querySelector('iframe')?.getAttribute('src') ?? ''
          return isAllowedEmbedSrc(src) ? { src, provider: element.dataset.provider ?? 'youtube' } : false
        },
      },
    ]
  },

  renderHTML({ node }) {
    return [
      'div',
      { 'data-video-embed': '', 'data-provider': node.attrs.provider },
      ['iframe', {
        src: node.attrs.src,
        title: 'Video',
        frameborder: '0',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        allowfullscreen: 'true',
      }],
    ]
  },
})
```

- [ ] **Step 5: Create `components/admin/articles/editor/use-keyboard-offset.ts`**

```ts
'use client'

import { useEffect, useState } from 'react'

// Height covered by the phone's on-screen keyboard, so the toolbar can sit just above it
export function useKeyboardOffset(): number {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const update = () => setOffset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop))
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    update()
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [])
  return offset
}

export function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return desktop
}
```

- [ ] **Step 6: Create `components/admin/articles/editor/link-popover.tsx`**

```tsx
'use client'

import { useState } from 'react'
import type { Editor } from '@tiptap/react'
import { Link2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function LinkPopover({ editor, buttonClass }: { editor: Editor; buttonClass: string }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')

  const onOpenChange = (next: boolean) => {
    if (next) setUrl(editor.getAttributes('link').href ?? '')
    setOpen(next)
  }

  const apply = () => {
    const value = url.trim()
    const chain = editor.chain().focus().extendMarkRange('link')
    if (!value) chain.unsetLink().run()
    else chain.setLink({ href: /^(https?:|mailto:|\/)/i.test(value) ? value : `https://${value}` }).run()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger type="button" aria-label="Saite" className={buttonClass}>
        <Link2 className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3">
        <form onSubmit={(e) => { e.preventDefault(); apply() }} className="grid gap-2">
          <label htmlFor="link-url" className="text-sm font-semibold">Saite</label>
          <input id="link-url" type="url" inputMode="url" autoFocus value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className="rounded-md border border-[#DCE3DF] px-3 py-2" />
          <div className="flex justify-end gap-2">
            {editor.isActive('link') && (
              <button type="button" onClick={() => { editor.chain().focus().unsetLink().run(); setOpen(false) }} className="rounded-md px-3 py-1.5 text-sm font-semibold text-[#B42318]">Noņemt</button>
            )}
            <button type="submit" className="rounded-md bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white">Saglabāt</button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
```

- [ ] **Step 7: Create `components/admin/articles/editor/video-dialog.tsx`**

```tsx
'use client'

import { useState } from 'react'
import type { Editor } from '@tiptap/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { parseVideoUrl } from '@/lib/video-embed'

export function VideoDialog({ editor, open, onOpenChange }: { editor: Editor; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  const insert = () => {
    const video = parseVideoUrl(url)
    if (!video) {
      setError('Šī saite netiek atbalstīta. Ielīmē YouTube vai Facebook video saiti.')
      return
    }
    editor.chain().focus().insertContent({ type: 'videoEmbed', attrs: video }).run()
    setUrl('')
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { setError(null); onOpenChange(next) }}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Pievienot video</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); insert() }} className="grid gap-3">
          <label htmlFor="video-url" className="text-sm font-semibold">Ielīmē YouTube vai Facebook saiti</label>
          <input id="video-url" type="url" inputMode="url" autoFocus value={url} onChange={(e) => { setUrl(e.target.value); setError(null) }} placeholder="https://youtu.be/…" className="rounded-md border border-[#DCE3DF] px-3 py-2" />
          {error && <p className="text-sm text-[#B42318]">{error}</p>}
          <button type="submit" className="justify-self-end rounded-md bg-teal-700 px-4 py-2 font-semibold text-white">Pievienot</button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 8: Create `components/admin/articles/editor/editor-toolbar.tsx`**

```tsx
'use client'

import { useRef, useState } from 'react'
import type { Editor } from '@tiptap/react'
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, ImagePlus, Video } from 'lucide-react'
import { LinkPopover } from './link-popover'
import { VideoDialog } from './video-dialog'
import { useIsDesktop, useKeyboardOffset } from './use-keyboard-offset'

const base = 'grid h-9 min-w-9 place-items-center rounded-md px-2 text-[#141414] hover:bg-club-pale'
const active = 'bg-club-pale text-club'

export function EditorToolbar({ editor, onPickImages }: { editor: Editor; onPickImages: (files: File[]) => void }) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [videoOpen, setVideoOpen] = useState(false)
  const keyboard = useKeyboardOffset()
  const desktop = useIsDesktop()

  const btn = (label: string, isActive: boolean, onClick: () => void, icon: React.ReactNode) => (
    <button type="button" aria-label={label} aria-pressed={isActive} onClick={onClick} className={`${base} ${isActive ? active : ''}`}>
      {icon}
    </button>
  )

  return (
    <div
      className="z-40 flex gap-1 overflow-x-auto border-[#DCE3DF] bg-white p-1.5 max-lg:fixed max-lg:inset-x-0 max-lg:border-t lg:sticky lg:top-[57px] lg:rounded-lg lg:border"
      style={desktop ? undefined : { bottom: keyboard }}
    >
      {btn('Virsraksts', editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="h-4 w-4" />)}
      {btn('Apakšvirsraksts', editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 className="h-4 w-4" />)}
      {btn('Treknraksts', editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), <Bold className="h-4 w-4" />)}
      {btn('Slīpraksts', editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), <Italic className="h-4 w-4" />)}
      {btn('Saraksts', editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), <List className="h-4 w-4" />)}
      {btn('Numurēts saraksts', editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="h-4 w-4" />)}
      {btn('Citāts', editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), <Quote className="h-4 w-4" />)}
      <LinkPopover editor={editor} buttonClass={`${base} ${editor.isActive('link') ? active : ''}`} />
      <span className="mx-1 w-px shrink-0 bg-[#DCE3DF]" />
      <button type="button" onClick={() => fileInput.current?.click()} className={`${base} gap-1.5 font-semibold text-club`}>
        <ImagePlus className="h-4 w-4" /> Foto
      </button>
      <button type="button" onClick={() => setVideoOpen(true)} className={`${base} gap-1.5 font-semibold text-club`}>
        <Video className="h-4 w-4" /> Video
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => { onPickImages(Array.from(e.target.files ?? [])); e.target.value = '' }}
      />
      <VideoDialog editor={editor} open={videoOpen} onOpenChange={setVideoOpen} />
    </div>
  )
}
```

- [ ] **Step 9: Create `components/admin/articles/editor/body-editor.tsx`**

```tsx
'use client'

import { useCallback, useRef } from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { toast } from 'sonner'
import { uploadWithProgress } from '@/lib/upload-with-progress'
import { Figure } from './figure-node'
import { VideoEmbed } from './video-node'
import { EditorToolbar } from './editor-toolbar'
import { clearUploadProgress, setUploadProgress } from './upload-store'

function findFigure(editor: Editor, uploadId: string): { pos: number; size: number; attrs: Record<string, unknown> } | null {
  let found: { pos: number; size: number; attrs: Record<string, unknown> } | null = null
  editor.state.doc.descendants((node, pos) => {
    if (found) return false
    if (node.type.name === 'figure' && node.attrs.uploadId === uploadId) {
      found = { pos, size: node.nodeSize, attrs: node.attrs }
      return false
    }
  })
  return found
}

export function BodyEditor({ articleId, content, onChange }: { articleId: string; content: string; onChange: (html: string) => void }) {
  const insertImagesRef = useRef<(files: File[], pos?: number) => void>(() => {})

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({
        includeChildren: true,
        placeholder: ({ node }) => (node.type.name === 'figure' ? 'Paraksts (nav obligāts)' : 'Raksti šeit…'),
      }),
      Figure,
      VideoEmbed,
    ],
    content,
    editorProps: {
      attributes: { class: 'prose prose-lg max-w-none min-h-[40vh] focus:outline-none prose-headings:font-display prose-headings:uppercase' },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) => f.type.startsWith('image/'))
        if (!files.length) return false
        insertImagesRef.current(files)
        return true
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false
        const files = Array.from(event.dataTransfer?.files ?? []).filter((f) => f.type.startsWith('image/'))
        if (!files.length) return false
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos
        insertImagesRef.current(files, pos)
        return true
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  const insertImages = useCallback(
    async (files: File[], pos?: number) => {
      if (!editor) return
      for (const file of files.filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name))) {
        const uploadId = crypto.randomUUID()
        const preview = URL.createObjectURL(file)
        const figure = { type: 'figure', attrs: { src: preview, alt: '', uploadId } }
        const chain = editor.chain().focus()
        if (pos !== undefined) chain.insertContentAt(pos, figure)
        else chain.insertContent(figure)
        chain.run()
        setUploadProgress(uploadId, 0)
        try {
          const { url } = await uploadWithProgress(file, `articles/${articleId}`, (p) => setUploadProgress(uploadId, p))
          const found = findFigure(editor, uploadId)
          if (found) editor.view.dispatch(editor.state.tr.setNodeMarkup(found.pos, undefined, { ...found.attrs, src: url, uploadId: null }))
        } catch (error) {
          const found = findFigure(editor, uploadId)
          if (found) editor.view.dispatch(editor.state.tr.delete(found.pos, found.pos + found.size))
          toast.error(error instanceof Error ? error.message : 'Neizdevās augšupielādēt foto')
        } finally {
          clearUploadProgress(uploadId)
          URL.revokeObjectURL(preview)
        }
      }
    },
    [editor, articleId]
  )
  insertImagesRef.current = insertImages

  if (!editor) return <div className="min-h-[40vh]" />

  return (
    <div className="grid gap-3">
      <EditorToolbar editor={editor} onPickImages={(files) => insertImages(files)} />
      <EditorContent editor={editor} />
    </div>
  )
}
```

- [ ] **Step 10: Type-check**

Run: `npx tsc --noEmit -p . 2>&1 | grep -E "components/admin/articles/editor|lib/upload-with-progress"`
Expected: no output. If `immediatelyRender` is reported as unknown, the installed `@tiptap/react` is older than 2.5; run `npm install @tiptap/react@^2.11 @tiptap/starter-kit@^2.11 @tiptap/extension-link@^2.11 @tiptap/pm@^2.11` and re-check.

- [ ] **Step 11: Commit**

```bash
git add lib/upload-with-progress.ts components/admin/articles/editor
git commit -m "feat: article body editor with photos, captions, video and phone toolbar" -m "Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Editor page, settings and autosave

**Files:**
- Create: `lib/autosave.ts`, `lib/autosave.test.ts`, `components/admin/articles/use-autosave.ts`, `components/admin/articles/cover-photo-field.tsx`, `components/admin/articles/article-settings.tsx`, `components/admin/articles/article-editor.tsx`, `app/admin/articles/[id]/page.tsx`

**Interfaces:**
- Consumes: Task 1 (`AdminArticle`, `toDateTimeLocal`, `fromDateTimeLocal`, `articleState`, `formatRigaDateTime`, `formatRigaDate`), Task 4 (`validateForPublish`, `isMissingColumnError`), Task 5 API, Task 8 (`ArticleStatusPill`, `MigrationNotice`), Task 10 (`BodyEditor`, `uploadWithProgress`, `hasPendingUploads`).
- Produces:
  - `retryDelay(attempt: number): number` → 2000, 5000, 10000, then 30000
  - `type LocalBackup<T> = { fields: T; at: number }`
  - `shouldOfferRestore<T>(backup: LocalBackup<T> | null, serverUpdatedAt: string, server: T): boolean`
  - `useAutosave<T>(opts: { data: T; enabled: boolean; save: (data: T) => Promise<void>; delay?: number }): { state: 'idle' | 'saving' | 'saved' | 'error'; savedAt: Date | null }`
  - `type EditorFields = { title: string; content: string; image_url: string | null; excerpt: string; author: string; is_featured: boolean; fixture_id: string | null; gallery_id: string | null }`
  - `type FixtureOption = { id: string; opponent: string; match_date: string; is_home_game: boolean }`, `type GalleryOption = { id: string; title: string }` (exported from `article-settings.tsx`)

- [ ] **Step 1: Write the failing tests `lib/autosave.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { retryDelay, shouldOfferRestore } from './autosave'

describe('retryDelay', () => {
  it('backs off and caps at 30 seconds', () => {
    expect([0, 1, 2, 3, 4, 10].map(retryDelay)).toEqual([2000, 5000, 10000, 30000, 30000, 30000])
  })
})

describe('shouldOfferRestore', () => {
  const server = { title: 'A', content: '<p>x</p>' }
  const serverAt = '2026-10-14T10:00:00.000Z'
  it('offers a newer, different device copy', () => {
    const backup = { fields: { title: 'A', content: '<p>x y</p>' }, at: Date.parse(serverAt) + 60_000 }
    expect(shouldOfferRestore(backup, serverAt, server)).toBe(true)
  })
  it('ignores an older copy', () => {
    const backup = { fields: { title: 'B', content: '' }, at: Date.parse(serverAt) - 60_000 }
    expect(shouldOfferRestore(backup, serverAt, server)).toBe(false)
  })
  it('ignores an identical copy and a missing one', () => {
    expect(shouldOfferRestore({ fields: server, at: Date.parse(serverAt) + 60_000 }, serverAt, server)).toBe(false)
    expect(shouldOfferRestore(null, serverAt, server)).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run lib/autosave.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `lib/autosave.ts`**

```ts
const DELAYS = [2000, 5000, 10000, 30000]

export function retryDelay(attempt: number): number {
  return DELAYS[Math.min(attempt, DELAYS.length - 1)]
}

export type LocalBackup<T> = { fields: T; at: number }

// Offer the device copy only when it is newer than the server row and actually different
export function shouldOfferRestore<T>(backup: LocalBackup<T> | null, serverUpdatedAt: string, server: T): boolean {
  if (!backup) return false
  if (backup.at <= Date.parse(serverUpdatedAt) + 1000) return false
  return JSON.stringify(backup.fields) !== JSON.stringify(server)
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run lib/autosave.test.ts`
Expected: PASS.

- [ ] **Step 5: Create `components/admin/articles/use-autosave.ts`**

```ts
'use client'

import { useEffect, useRef, useState } from 'react'
import { retryDelay } from '@/lib/autosave'

export type AutosaveState = 'idle' | 'saving' | 'saved' | 'error'

export function useAutosave<T>({ data, enabled, save, delay = 2000 }: { data: T; enabled: boolean; save: (data: T) => Promise<void>; delay?: number }) {
  const [state, setState] = useState<AutosaveState>('idle')
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const firstRun = useRef(true)
  const attempt = useRef(0)
  const latest = useRef(data)
  const saveRef = useRef(save)
  latest.current = data
  saveRef.current = save

  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return }
    if (!enabled) return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const run = async () => {
      setState('saving')
      try {
        await saveRef.current(latest.current)
        if (cancelled) return
        attempt.current = 0
        setState('saved')
        setSavedAt(new Date())
      } catch {
        if (cancelled) return
        setState('error')
        timer = setTimeout(run, retryDelay(attempt.current++))
      }
    }

    timer = setTimeout(run, delay)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [data, enabled, delay])

  return { state, savedAt }
}
```

- [ ] **Step 6: Create `components/admin/articles/cover-photo-field.tsx`**

```tsx
'use client'

import { useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { toast } from 'sonner'
import { uploadWithProgress } from '@/lib/upload-with-progress'

export function CoverPhotoField({ articleId, value, onChange }: { articleId: string; value: string | null; onChange: (url: string | null) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)

  const upload = async (file: File | undefined) => {
    if (!file) return
    setProgress(0)
    try {
      const { url } = await uploadWithProgress(file, `articles/${articleId}`, setProgress)
      onChange(url)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Neizdevās augšupielādēt foto')
    } finally {
      setProgress(null)
    }
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files[0]) }}
      className={`relative overflow-hidden rounded-lg ${dragging ? 'ring-2 ring-teal-700' : ''}`}
    >
      {value ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Vāka foto" className="aspect-[16/7] w-full object-cover" />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button type="button" onClick={() => input.current?.click()} className="rounded-md bg-white/95 px-3 py-1.5 text-sm font-semibold">Mainīt</button>
            <button type="button" onClick={() => onChange(null)} className="rounded-md bg-white/95 px-3 py-1.5 text-sm font-semibold text-[#B42318]">Noņemt</button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="flex aspect-[16/7] w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-[#DCE3DF] bg-[#F7F9F8] text-[#5B6863] hover:border-teal-700 hover:text-club"
        >
          <ImagePlus className="h-8 w-8" />
          <span className="font-semibold">Pievieno vāka foto</span>
          <span className="text-sm">Pieskaries vai ievelc foto šeit</span>
        </button>
      )}
      {progress !== null && (
        <div className="absolute inset-x-3 bottom-3 rounded bg-white/95 px-3 py-2 text-sm font-semibold">
          Augšupielādē… {progress}%
          <div className="mt-1.5 h-1.5 rounded bg-[#DCE3DF]"><div className="h-full rounded bg-teal-700" style={{ width: `${progress}%` }} /></div>
        </div>
      )}
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { upload(e.target.files?.[0]); e.target.value = '' }} />
    </div>
  )
}
```

- [ ] **Step 7: Create `components/admin/articles/article-settings.tsx`**

```tsx
'use client'

import { formatRigaDate } from '@/lib/articles'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { EditorFields } from './article-editor'

export type FixtureOption = { id: string; opponent: string; match_date: string; is_home_game: boolean }
export type GalleryOption = { id: string; title: string }

type Props = {
  fields: EditorFields
  onChange: (patch: Partial<EditorFields>) => void
  isDraft: boolean
  scheduleMode: 'now' | 'schedule'
  onScheduleModeChange: (mode: 'now' | 'schedule') => void
  scheduleAt: string
  onScheduleAtChange: (value: string) => void
  fixtures: FixtureOption[]
  galleries: GalleryOption[]
  onUnpublish: () => void
  onDelete: () => void
}

const label = 'text-xs font-bold uppercase tracking-wide text-[#5B6863]'
const control = 'w-full rounded-md border border-[#DCE3DF] bg-white px-3 py-2 text-[15px]'

const fixtureLabel = (f: FixtureOption) =>
  `${f.is_home_game ? `Fēnikss v ${f.opponent}` : `${f.opponent} v Fēnikss`} · ${formatRigaDate(f.match_date)}`

export function ArticleSettings(p: Props) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <span className={label}>Publicēšana</span>
        {p.isDraft && (
          <div className="grid grid-cols-2 rounded-md bg-club-pale p-1" role="radiogroup">
            {(['now', 'schedule'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={p.scheduleMode === mode}
                onClick={() => p.onScheduleModeChange(mode)}
                className={`rounded py-1.5 text-sm font-semibold ${p.scheduleMode === mode ? 'bg-white shadow-sm' : 'text-[#5B6863]'}`}
              >
                {mode === 'now' ? 'Tagad' : 'Ieplānot'}
              </button>
            ))}
          </div>
        )}
        {(!p.isDraft || p.scheduleMode === 'schedule') && (
          <input
            type="datetime-local"
            aria-label="Publicēšanas laiks"
            value={p.scheduleAt}
            onChange={(e) => p.onScheduleAtChange(e.target.value)}
            className={control}
          />
        )}
      </div>

      <label className="grid gap-2">
        <span className={label}>Īss apraksts</span>
        <textarea
          rows={3}
          maxLength={160}
          value={p.fields.excerpt}
          onChange={(e) => p.onChange({ excerpt: e.target.value })}
          placeholder="Ja atstāsi tukšu, izmantos pirmo teikumu"
          className={control}
        />
        <span className="text-xs text-[#5B6863]">Redzams ziņu kartītēs un Google. {p.fields.excerpt.length} / 160</span>
      </label>

      <label className="grid gap-2">
        <span className={label}>Saistītā spēle</span>
        <select value={p.fields.fixture_id ?? ''} onChange={(e) => p.onChange({ fixture_id: e.target.value || null })} className={control}>
          <option value="">Nav</option>
          {p.fixtures.map((f) => <option key={f.id} value={f.id}>{fixtureLabel(f)}</option>)}
        </select>
      </label>

      <label className="grid gap-2">
        <span className={label}>Saistītā galerija</span>
        <select value={p.fields.gallery_id ?? ''} onChange={(e) => p.onChange({ gallery_id: e.target.value || null })} className={control}>
          <option value="">Nav</option>
          {p.galleries.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
        </select>
      </label>

      <label className="grid gap-2">
        <span className={label}>Autors</span>
        <input value={p.fields.author} onChange={(e) => p.onChange({ author: e.target.value })} maxLength={100} className={control} />
      </label>

      <label className="flex items-center justify-between gap-3">
        <span className="font-medium">Izcelt sākumlapā</span>
        <Switch checked={p.fields.is_featured} onCheckedChange={(v) => p.onChange({ is_featured: v })} />
      </label>

      <div className="grid gap-2 border-t border-[#DCE3DF] pt-4">
        {!p.isDraft && (
          <button type="button" onClick={p.onUnpublish} className="justify-self-start text-sm font-semibold text-[#5B6863] hover:text-[#141414]">
            Pārvērst par melnrakstu
          </button>
        )}
        <AlertDialog>
          <AlertDialogTrigger className="justify-self-start text-sm font-semibold text-[#B42318]">Dzēst ziņu</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Dzēst šo ziņu?</AlertDialogTitle>
              <AlertDialogDescription>Ziņa un tās foto tiks neatgriezeniski dzēsti.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Atcelt</AlertDialogCancel>
              <AlertDialogAction onClick={p.onDelete} className="bg-[#B42318] hover:bg-[#912018]">Dzēst</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Create `components/admin/articles/article-editor.tsx`**

```tsx
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, Settings2 } from 'lucide-react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { type AdminArticle, articleState, formatRigaDateTime, fromDateTimeLocal, toDateTimeLocal } from '@/lib/articles'
import { validateForPublish } from '@/lib/article-publish'
import { shouldOfferRestore, type LocalBackup } from '@/lib/autosave'
import { ArticleStatusPill } from './article-status-pill'
import { CoverPhotoField } from './cover-photo-field'
import { ArticleSettings, type FixtureOption, type GalleryOption } from './article-settings'
import { BodyEditor } from './editor/body-editor'
import { hasPendingUploads } from './editor/upload-store'
import { useAutosave } from './use-autosave'

export type EditorFields = {
  title: string; content: string; image_url: string | null; excerpt: string; author: string
  is_featured: boolean; fixture_id: string | null; gallery_id: string | null
}

const fieldsFrom = (a: AdminArticle): EditorFields => ({
  title: a.title ?? '', content: a.content ?? '', image_url: a.image_url, excerpt: a.excerpt ?? '',
  author: a.author ?? '', is_featured: a.is_featured ?? false, fixture_id: a.fixture_id, gallery_id: a.gallery_id,
})

const defaultSchedule = () => {
  const d = new Date(Date.now() + 60 * 60 * 1000)
  d.setMinutes(0, 0, 0)
  return toDateTimeLocal(d.toISOString())
}

async function sendAction(id: string, body: unknown): Promise<AdminArticle> {
  const res = await fetch(`/api/admin/articles/${id}`, {
    method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Neizdevās saglabāt')
  return data as AdminArticle
}

export function ArticleEditor({ article, fixtures, galleries }: { article: AdminArticle; fixtures: FixtureOption[]; galleries: GalleryOption[] }) {
  const router = useRouter()
  const backupKey = `fnx-article-${article.id}`
  const [fields, setFields] = useState<EditorFields>(() => fieldsFrom(article))
  const [status, setStatus] = useState(article.status)
  const [publishedAt, setPublishedAt] = useState(article.published_at)
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule'>(
    articleState(article) === 'scheduled' ? 'schedule' : 'now'
  )
  const [scheduleAt, setScheduleAt] = useState(() =>
    article.status === 'published' ? toDateTimeLocal(article.published_at) : defaultSchedule()
  )
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [restore, setRestore] = useState<LocalBackup<EditorFields> | null>(null)
  const [editorKey, setEditorKey] = useState(0)
  const isDraft = status === 'draft'

  // Offer a newer copy left on this device (e.g. connection dropped before autosave)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(backupKey)
      const backup = raw ? (JSON.parse(raw) as LocalBackup<EditorFields>) : null
      if (shouldOfferRestore(backup, article.updated_at, fieldsFrom(article))) setRestore(backup)
    } catch { /* storage unavailable */ }
  }, [article, backupKey])

  const update = useCallback((patch: Partial<EditorFields>) => {
    setFields((prev) => {
      const next = { ...prev, ...patch }
      try { localStorage.setItem(backupKey, JSON.stringify({ fields: next, at: Date.now() })) } catch { /* ignore */ }
      return next
    })
    setDirty(true)
  }, [backupKey])

  const payload = useMemo(() => ({
    title: fields.title, content: fields.content, image_url: fields.image_url, excerpt: fields.excerpt,
    author: fields.author, is_featured: fields.is_featured, fixture_id: fields.fixture_id, gallery_id: fields.gallery_id,
  }), [fields])

  const autosave = useAutosave({
    data: payload,
    enabled: isDraft,
    save: async (data) => {
      await sendAction(article.id, { action: 'save', fields: data })
      setDirty(false)
      try { localStorage.removeItem(backupKey) } catch { /* ignore */ }
    },
  })

  // Unsaved edits to a live article must not be lost silently
  useEffect(() => {
    if (isDraft || !dirty) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [isDraft, dirty])

  const publish = async () => {
    if (hasPendingUploads()) return toast.error('Pagaidi, kamēr foto augšupielādējas')
    const problem = validateForPublish(fields)
    if (problem) return toast.error(problem)
    const scheduled = !isDraft || scheduleMode === 'schedule'
    setBusy(true)
    try {
      const saved = await sendAction(article.id, {
        action: 'publish',
        fields: { ...payload, ...(scheduled ? { published_at: fromDateTimeLocal(scheduleAt) } : {}) },
      })
      setStatus(saved.status)
      setPublishedAt(saved.published_at)
      setScheduleAt(toDateTimeLocal(saved.published_at))
      setDirty(false)
      try { localStorage.removeItem(backupKey) } catch { /* ignore */ }
      if (articleState(saved) === 'scheduled') toast.success(`Ieplānots uz ${formatRigaDateTime(saved.published_at)}`)
      else toast.success(isDraft ? 'Publicēts' : 'Atjaunināts', {
        action: { label: 'Skatīt mājaslapā', onClick: () => window.open(`/news/${article.id}`, '_blank') },
      })
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Neizdevās publicēt')
    } finally {
      setBusy(false)
    }
  }

  const unpublish = async () => {
    setBusy(true)
    try {
      const saved = await sendAction(article.id, { action: 'unpublish' })
      setStatus(saved.status)
      setScheduleMode('now')
      toast.success('Ziņa tagad ir melnraksts')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Neizdevās')
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    setBusy(true)
    const res = await fetch(`/api/admin/articles/${article.id}`, { method: 'DELETE' })
    if (!res.ok) {
      setBusy(false)
      return toast.error('Neizdevās dzēst ziņu')
    }
    try { localStorage.removeItem(backupKey) } catch { /* ignore */ }
    toast.success('Ziņa dzēsta')
    router.push('/admin/articles')
    router.refresh()
  }

  const primaryLabel = isDraft ? (scheduleMode === 'schedule' ? 'Ieplānot' : 'Publicēt') : 'Atjaunināt'
  const saveLabel = !isDraft
    ? (dirty ? 'Nesaglabātas izmaiņas' : 'Viss saglabāts')
    : autosave.state === 'saving' ? 'Saglabā…'
    : autosave.state === 'error' ? 'Neizdevās saglabāt — mēģina vēlreiz'
    : autosave.savedAt ? `✓ Saglabāts ${autosave.savedAt.toLocaleTimeString('lv-LV', { hour: '2-digit', minute: '2-digit' })}`
    : ''

  const settings = (
    <ArticleSettings
      fields={fields}
      onChange={update}
      isDraft={isDraft}
      scheduleMode={scheduleMode}
      onScheduleModeChange={setScheduleMode}
      scheduleAt={scheduleAt}
      onScheduleAtChange={(v) => { setScheduleAt(v); setDirty(true) }}
      fixtures={fixtures}
      galleries={galleries}
      onUnpublish={unpublish}
      onDelete={remove}
    />
  )

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-[#DCE3DF] bg-white px-3 lg:px-5">
        <Link href="/admin/articles" aria-label="Atpakaļ uz ziņām" className="flex items-center gap-1 font-semibold text-[#5B6863] hover:text-[#141414]">
          <ArrowLeft className="h-5 w-5" /><span className="hidden sm:inline">Ziņas</span>
        </Link>
        <span className="hidden sm:inline-flex"><ArticleStatusPill status={status} publishedAt={publishedAt} /></span>
        <span className={`truncate text-xs font-semibold ${autosave.state === 'error' ? 'text-[#B42318]' : 'text-[#146C43]'}`}>{saveLabel}</span>
        <span className="flex-1" />
        <Link href={`/admin/articles/${article.id}/preview`} target="_blank" className="flex items-center gap-1.5 rounded-md border border-[#DCE3DF] px-3 py-1.5 text-sm font-semibold">
          <Eye className="h-4 w-4" /><span className="hidden sm:inline">Priekšskatīt</span>
        </Link>
        <Sheet>
          <SheetTrigger className="flex items-center gap-1.5 rounded-md border border-[#DCE3DF] px-3 py-1.5 text-sm font-semibold lg:hidden">
            <Settings2 className="h-4 w-4" /><span className="sr-only sm:not-sr-only">Iestatījumi</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-sm">
            <SheetHeader><SheetTitle>Iestatījumi</SheetTitle></SheetHeader>
            <div className="mt-4">{settings}</div>
          </SheetContent>
        </Sheet>
        <button type="button" onClick={publish} disabled={busy} className="rounded-md bg-teal-700 px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-600 disabled:opacity-60">
          {busy ? '…' : primaryLabel}
        </button>
      </header>

      {restore && (
        <div className="flex flex-wrap items-center gap-3 border-b border-[#F0C828] bg-[#FFF8E1] px-4 py-2.5 text-sm">
          <span>Šajā ierīcē ir jaunākas, nesaglabātas izmaiņas.</span>
          <button type="button" className="font-semibold text-club" onClick={() => { setFields(restore.fields); setDirty(true); setEditorKey((k) => k + 1); setRestore(null) }}>
            Atjaunot nesaglabātās izmaiņas
          </button>
          <button type="button" className="text-[#5B6863]" onClick={() => { try { localStorage.removeItem(backupKey) } catch { /* ignore */ } setRestore(null) }}>
            Atmest
          </button>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[1fr_320px]">
        <div className="mx-auto grid w-full max-w-3xl gap-5 px-4 pb-32 pt-5 lg:px-10 lg:pb-16">
          <CoverPhotoField articleId={article.id} value={fields.image_url} onChange={(url) => update({ image_url: url })} />
          <textarea
            value={fields.title}
            onChange={(e) => update({ title: e.target.value })}
            onInput={(e) => {
              // Grow with the title so long headlines stay fully visible
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = `${el.scrollHeight}px`
            }}
            placeholder="Virsraksts"
            rows={1}
            aria-label="Virsraksts"
            className="w-full resize-none overflow-hidden border-0 bg-transparent p-0 font-display text-3xl font-bold uppercase leading-tight placeholder:text-[#B8C2BE] focus:outline-none lg:text-4xl"
          />
          <BodyEditor key={editorKey} articleId={article.id} content={fields.content} onChange={(html) => update({ content: html })} />
        </div>
        <aside className="hidden border-l border-[#DCE3DF] bg-[#FAFBFA] p-5 lg:block">
          <div className="sticky top-[72px]">{settings}</div>
        </aside>
      </div>
    </div>
  )
}
```

- [ ] **Step 9: Create `app/admin/articles/[id]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import { isMissingColumnError } from '@/lib/article-publish'
import type { AdminArticle } from '@/lib/articles'
import { MigrationNotice } from '@/components/admin/migration-notice'
import { ArticleEditor } from '@/components/admin/articles/article-editor'
import type { FixtureOption, GalleryOption } from '@/components/admin/articles/article-settings'

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const db = createAdminClient()
  const [article, fixtures, galleries] = await Promise.all([
    db.from('articles').select('*').eq('id', params.id).maybeSingle(),
    db.from('fixtures').select('id, opponent, match_date, is_home_game').order('match_date', { ascending: false }).limit(60),
    db.from('galleries').select('id, title').order('created_at', { ascending: false }).limit(60),
  ])

  if (article.error && isMissingColumnError(article.error)) {
    return <div className="mx-auto max-w-3xl px-4 py-10"><MigrationNotice /></div>
  }
  if (!article.data) notFound()

  return (
    <ArticleEditor
      article={article.data as AdminArticle}
      fixtures={(fixtures.data ?? []) as FixtureOption[]}
      galleries={(galleries.data ?? []) as GalleryOption[]}
    />
  )
}
```

- [ ] **Step 10: Verify**

Run: `npx vitest run` → all PASS. `npx tsc --noEmit -p . 2>&1 | grep -E "components/admin|app/admin|lib/autosave"` → no output.
Owner checklist on `localhost:3000` (logged in), desktop and phone (390px or a real phone on the same network):
1. "+ Jauna ziņa" opens the editor; typing a title shows "Saglabā…" then "✓ Saglabāts".
2. Cover photo: pick and drag-drop; progress shows; "Mainīt"/"Noņemt" work.
3. Body: type text, add heading/list/quote/link, add a photo (button, paste, drop) with progress, add a caption, add a YouTube and a Facebook link; a Vimeo link shows the Latvian error.
4. On a phone the toolbar sits above the keyboard.
5. "Publicēt" with an empty title shows "Pievieno virsrakstu"; with a title it publishes and the toast offers "Skatīt mājaslapā".
6. Edit the live article: header shows "Nesaglabātas izmaiņas"; closing the tab warns; "Atjaunināt" saves.
7. "Pārvērst par melnrakstu", then "Ieplānot" for a few minutes ahead: blue pill; the article appears on `/news` within about a minute after that time.
8. Turn off Wi-Fi, type, see "Neizdevās saglabāt — mēģina vēlreiz"; reload while offline-edited: the restore banner appears.
9. "Dzēst ziņu" asks for confirmation and returns to the list.

- [ ] **Step 11: Commit**

```bash
git add lib/autosave.ts lib/autosave.test.ts components/admin/articles "app/admin/articles/[id]/page.tsx"
git commit -m "feat: full-page article editor with autosave, scheduling and settings" -m "Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Preview, cleanup and pull request

**Files:**
- Create: `app/admin/articles/[id]/preview/page.tsx`
- Delete: `components/shared/rich-text-editor.tsx` (only if unused)

**Interfaces:**
- Consumes: `NewsDetailClient`, `LinkedFixture`, `LinkedGallery` (Task 6); `sanitizeArticleHtml` (Task 3); `articleState` (Task 1); `isPreviewPath` handling in `AdminShell` (Task 7).

- [ ] **Step 1: Create `app/admin/articles/[id]/preview/page.tsx`**

```tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import { articleState } from '@/lib/articles'
import { sanitizeArticleHtml } from '@/lib/sanitize-article'
import { NewsDetailClient, type LinkedFixture, type LinkedGallery } from '@/app/news/[id]/news-detail-client'
import type { Article } from '@/types/supabase'

export const dynamic = 'force-dynamic'

export default async function PreviewArticlePage({ params }: { params: { id: string } }) {
  const db = createAdminClient()
  const { data: article } = await db.from('articles').select('*').eq('id', params.id).maybeSingle()
  if (!article) notFound()

  const [fixture, gallery] = await Promise.all([
    article.fixture_id
      ? db.from('fixtures').select('id, opponent, match_date, is_home_game, score').eq('id', article.fixture_id).maybeSingle()
      : Promise.resolve({ data: null }),
    article.gallery_id
      ? db.from('galleries').select('id, title').eq('id', article.gallery_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  const live = articleState(article) === 'published'
  const safe: Article = { ...article, title: article.title || 'Bez nosaukuma', content: sanitizeArticleHtml(article.content ?? '') }

  return (
    <>
      <div className="sticky top-0 z-[60] flex items-center justify-between gap-3 bg-[#FFF4D6] px-4 py-2.5 text-sm font-semibold text-[#8A5A00]">
        <span>{live ? 'Priekšskatījums — šī ziņa ir publicēta' : 'Priekšskatījums — šī ziņa vēl nav publicēta'}</span>
        <Link href={`/admin/articles/${article.id}`} className="underline">← Atpakaļ uz redaktoru</Link>
      </div>
      <NewsDetailClient
        article={safe}
        relatedArticles={[]}
        latestGalleries={[]}
        pageUrl=""
        linkedFixture={(fixture.data ?? null) as LinkedFixture | null}
        linkedGallery={(gallery.data ?? null) as LinkedGallery | null}
      />
    </>
  )
}
```

- [ ] **Step 2: Remove the old editor if nothing uses it**

Run: `grep -rn "rich-text-editor" app components lib --include=*.ts --include=*.tsx`
Expected: no results (the old article page was replaced in Task 9). If empty, `git rm components/shared/rich-text-editor.tsx`. If something still imports it, leave the file.

- [ ] **Step 3: Full verification**

Run: `npx vitest run` → all PASS.
Run: `npx tsc --noEmit -p . 2>&1 | grep -c "error TS"` → at most the pre-existing count (39); and `npx tsc --noEmit -p . 2>&1 | grep -E "components/admin|app/admin|app/api/admin/articles|lib/(articles|video-embed|sanitize-article|article-publish|upload-rules|autosave|upload-with-progress)|app/news|app/page.tsx|app/sitemap"` → no output.
Screenshot check (Playwright, signed out is fine for public pages): `/`, `/news`, one `/news/<id>` at 1440px and 390px; no horizontal scroll; articles present.
Owner: open a draft's "Priekšskatīt": yellow bar, article looks like the public page, no admin sidebar.

- [ ] **Step 4: Commit and open the pull request (do not merge)**

```bash
git add "app/admin/articles/[id]/preview/page.tsx"
git commit -m "feat: admin article preview" -m "Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
git push -u origin admin-redesign
gh pr create --base main --head admin-redesign --title "New admin: shell and article editor" --body-file - <<'EOF'
## Summary
- Admin shell: sidebar on desktop, bottom tab bar and "+" button on phones, all in Latvian.
- Dashboard with drafts, scheduled and recent articles plus visitor stats.
- Article list with filters and search.
- Full-page editor: cover photo, photos with captions and video embeds in the text, autosave for drafts, scheduling, match and gallery links, preview.
- Public pages show only published articles whose time has come; article HTML is sanitized.

## Before merging
- [ ] Migration `supabase/migrations/2026-10-13-articles-publishing.sql` has been run in Supabase.
- [ ] Owner checklist from the plan (Task 11 Step 10) done on the preview deployment.

## Tests
- Vitest: slugs, visibility, video links, sanitizer, publish rules, upload rules, autosave timing, admin navigation.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
```

Expected: a PR URL. Report it and the Vercel preview URL to the owner; merging happens only after they confirm the checklist.
