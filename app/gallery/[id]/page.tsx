import { Metadata } from 'next'
import { supabase, prepareImagePath } from '@/lib/supabase'
import { Gallery, GalleryImage } from '@/types/supabase'
import { GalleryDetailClient } from './gallery-detail-client'

export const revalidate = 60

async function getGallery(id: string): Promise<Gallery | null> {
  try {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return null
  }
}

async function getGalleryImages(id: string): Promise<GalleryImage[]> {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('gallery_id', id)

    if (error) throw error

    if (data && data.length > 0) {
      if (data[0].hasOwnProperty('order')) {
        return [...data].sort((a, b) => (a.order || 0) - (b.order || 0))
      } else if (data[0].hasOwnProperty('display_order')) {
        return [...data].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      }
      return data
    }

    return []
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const gallery = await getGallery(id)

  if (!gallery) {
    return {
      title: 'Galerija nav atrasta | RK Fēnikss',
      description: 'Meklētā galerija neeksistē vai ir dzēsta.',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fnx-rugby.lv'

  return {
    title: `${gallery.title} | Galerija | RK Fēnikss`,
    description: gallery.description || `Foto galerija: ${gallery.title}`,
    openGraph: {
      title: `${gallery.title} | RK Fēnikss`,
      description: gallery.description || `Foto galerija: ${gallery.title}`,
      type: 'website',
      url: `${baseUrl}/gallery/${id}`,
      siteName: 'RK Fēnikss',
      locale: 'lv_LV',
    },
  }
}

export default async function GalleryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [gallery, images] = await Promise.all([
    getGallery(id),
    getGalleryImages(id),
  ])

  return (
    <GalleryDetailClient
      gallery={gallery}
      images={images}
    />
  )
}
