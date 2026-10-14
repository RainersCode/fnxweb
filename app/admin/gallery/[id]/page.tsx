import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import { requireAdminPage } from '@/lib/require-admin-page'
import { GalleryEditor, type GalleryRow } from '@/components/admin/gallery/gallery-editor'
import type { GalleryImageRow } from '@/components/admin/gallery/photo-grid'

export const dynamic = 'force-dynamic'

export default async function EditGalleryPage({ params }: { params: { id: string } }) {
  await requireAdminPage()
  const db = createAdminClient()
  const [gallery, images] = await Promise.all([
    db.from('galleries').select('id, title, description, cover_image_url, created_at').eq('id', params.id).maybeSingle(),
    db.from('gallery_images').select('id, image_url, caption, display_order').eq('gallery_id', params.id).order('display_order').order('uploaded_at'),
  ])
  if (!gallery.data) notFound()
  return <GalleryEditor gallery={gallery.data as GalleryRow} initialImages={(images.data ?? []) as GalleryImageRow[]} />
}
