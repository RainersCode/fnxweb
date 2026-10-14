import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase'
import { removeMediaFiles } from '@/lib/storage'
import { galleryImageUpdateSchema } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

type Ctx = { params: { id: string; imageId: string } }

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = galleryImageUpdateSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Paraksts ir par garu' }, { status: 400 })
  const { data, error } = await createAdminClient()
    .from('gallery_images').update(parsed.data).eq('id', params.imageId).eq('gallery_id', params.id).select('*').maybeSingle()
  if (error || !data) return NextResponse.json({ error: 'Neizdevās saglabāt parakstu' }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = createAdminClient()
  const { data: image } = await db.from('gallery_images').select('image_url').eq('id', params.imageId).eq('gallery_id', params.id).maybeSingle()
  if (!image) return NextResponse.json({ error: 'Foto nav atrasts' }, { status: 404 })
  const { error } = await db.from('gallery_images').delete().eq('id', params.imageId)
  if (error) return NextResponse.json({ error: 'Neizdevās dzēst foto' }, { status: 500 })
  // A deleted cover falls back to the first photo on the site
  const { data: cleared } = await db.from('galleries').update({ cover_image_url: null })
    .eq('id', params.id).eq('cover_image_url', image.image_url).select('id')
  await removeMediaFiles([image.image_url])
  return NextResponse.json({ success: true, cover_cleared: Boolean(cleared?.length) })
}
