import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase'
import { galleryImageCreateSchema } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = galleryImageCreateSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Nederīgi dati' }, { status: 400 })
  const { data, error } = await createAdminClient()
    .from('gallery_images')
    .insert({ gallery_id: params.id, image_url: parsed.data.image_url, display_order: parsed.data.display_order })
    .select('*')
    .single()
  if (error) {
    console.error('Add gallery image:', error)
    return NextResponse.json({ error: 'Neizdevās pievienot foto galerijai' }, { status: 500 })
  }
  return NextResponse.json(data)
}
