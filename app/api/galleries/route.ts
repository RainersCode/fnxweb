import { NextResponse } from 'next/server'
import { getGalleries, getGalleryFirstImage } from '@/lib/api'
import { prepareImagePath } from '@/lib/supabase'

export async function GET() {
  try {
    // Fetch all galleries from Supabase
    console.log('Fetching galleries from Supabase...')
    const galleries = await getGalleries()
    console.log(`Successfully fetched ${galleries.length} galleries`)

    // For each gallery, fetch its first image
    console.log('Fetching thumbnails for galleries...')
    const galleriesWithThumbnails = await Promise.all(
      galleries.map(async (gallery) => {
        try {
          console.log(`Fetching first image for gallery ${gallery.id}: ${gallery.title}`)
          const firstImage = await getGalleryFirstImage(gallery.id)
          
          const thumbnailUrl = firstImage ? prepareImagePath(firstImage.image_url) : null
          console.log(`Gallery ${gallery.id} thumbnail URL: ${thumbnailUrl}`)
          
          return {
            ...gallery,
            thumbnailUrl: thumbnailUrl,
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

    console.log(`Returning ${galleriesWithThumbnails.length} galleries with thumbnails`)
    return NextResponse.json(galleriesWithThumbnails)
  } catch (error) {
    console.error('Error fetching galleries:', error)
    return NextResponse.json({ error: 'Failed to fetch galleries' }, { status: 500 })
  }
}
