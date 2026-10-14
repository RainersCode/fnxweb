import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase'
import { removeMediaFiles } from '@/lib/storage'
import { fieldErrors, galleryUpdateSchema } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

type Ctx = { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = galleryUpdateSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Pārbaudi laukus', fields: fieldErrors(parsed.error) }, { status: 400 })
  const { data, error } = await createAdminClient().from('galleries').update(parsed.data).eq('id', params.id).select('*').maybeSingle()
  if (error) return NextResponse.json({ error: 'Neizdevās saglabāt galeriju' }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Galerija nav atrasta' }, { status: 404 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = createAdminClient()
  const { data: images } = await db.from('gallery_images').select('image_url').eq('gallery_id', params.id)
  // Delete rows first (images explicitly, in case the FK has no cascade), then files
  await db.from('gallery_images').delete().eq('gallery_id', params.id)
  const { error } = await db.from('galleries').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: 'Neizdevās dzēst galeriju' }, { status: 500 })
  await removeMediaFiles((images ?? []).map((i: { image_url: string }) => i.image_url))
  return NextResponse.json({ success: true })
}
