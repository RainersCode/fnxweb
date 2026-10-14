import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase'
import { fieldErrors, galleryCreateSchema } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = galleryCreateSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Pārbaudi laukus', fields: fieldErrors(parsed.error) }, { status: 400 })
  const { data, error } = await createAdminClient().from('galleries').insert(parsed.data).select('*').single()
  if (error) {
    console.error('Create gallery:', error)
    return NextResponse.json({ error: 'Neizdevās izveidot galeriju' }, { status: 500 })
  }
  return NextResponse.json(data)
}
