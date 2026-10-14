import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase'
import { galleryOrderSchema } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = galleryOrderSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Nederīgi dati' }, { status: 400 })
  const db = createAdminClient()
  const results = await Promise.all(
    parsed.data.ids.map((id, index) =>
      db.from('gallery_images').update({ display_order: index + 1 }).eq('id', id).eq('gallery_id', params.id)
    )
  )
  if (results.some((r) => r.error)) return NextResponse.json({ error: 'Neizdevās saglabāt secību' }, { status: 500 })
  return NextResponse.json({ success: true })
}
