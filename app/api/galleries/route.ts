import { NextResponse } from 'next/server'
import { getGalleries, getGalleryFirstImage } from '@/lib/api'

export async function GET() {
  try {
    // Fetch all galleries from Supabase
    const galleries = await getGalleries()

    // For each gallery, fetch its first image
    const galleriesWithThumbnails = await Promise.all(
      galleries.map(async (gallery) => {
        try {
          const firstImage = await getGalleryFirstImage(gallery.id)
          return {
            ...gallery,
            thumbnailUrl: firstImage ? firstImage.image_url : null,
          }
        } catch (error) {
          console.error(`Error fetching first image for gallery ${gallery.id}:`, error)
          return {
            ...gallery,
            thumbnailUrl: null,
          }
        }
      })
    )

    return NextResponse.json(galleriesWithThumbnails)
  } catch (error) {
    console.error('Error fetching galleries:', error)
    return NextResponse.json({ error: 'Failed to fetch galleries' }, { status: 500 })
  }
}
