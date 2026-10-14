import { z } from 'zod'
import { validateForPublish } from './articles'
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

// validateForPublish lives in the browser-safe lib/articles; re-exported for server callers
export { validateForPublish }

// Server-side check on what will actually be stored: a pasted foreign photo is removed by the
// sanitizer, so it must not count as content
export function checkPublishable(a: { title?: string | null; content?: string | null }): string | null {
  return validateForPublish({ ...a, content: sanitizeArticleHtml(a.content ?? '') })
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
