import { createAdminClient } from '@/lib/supabase'
import { requireAdminPage } from '@/lib/require-admin-page'
import { galleryCover } from '@/lib/gallery'
import { GalleryList, type GalleryCard } from '@/components/admin/gallery/gallery-list'

export const dynamic = 'force-dynamic'

export default async function GalleriesPage() {
  await requireAdminPage()
  const db = createAdminClient()
  const { data } = await db
    .from('galleries')
    .select('id, title, created_at, cover_image_url, gallery_images(count)')
    .order('created_at', { ascending: false })
  const rows = (data ?? []) as Array<{ id: string; title: string; created_at: string; cover_image_url: string | null; gallery_images: { count: number }[] }>
  const cards: GalleryCard[] = await Promise.all(rows.map(async (g) => {
    let first: string | null = null
    if (!g.cover_image_url) {
      const { data: img } = await db.from('gallery_images').select('image_url').eq('gallery_id', g.id).order('display_order').limit(1).maybeSingle()
      first = img?.image_url ?? null
    }
    return { id: g.id, title: g.title, created_at: g.created_at, cover: galleryCover(g.cover_image_url, first), count: g.gallery_images?.[0]?.count ?? 0 }
  }))
  return <GalleryList galleries={cards} />
}
