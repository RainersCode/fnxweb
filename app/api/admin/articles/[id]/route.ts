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
