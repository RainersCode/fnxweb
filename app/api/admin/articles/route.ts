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
