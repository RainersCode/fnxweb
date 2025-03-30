import { NextResponse } from 'next/server'
import { getGalleries, getGalleryFirstImage } from '@/lib/api'
import { prepareImagePath } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic' // Ensure we always fetch fresh data

// Fallback data in case the real data can't be fetched
const getFallbackGalleries = () => {
  return [
    {
      id: 'fallback1',
      title: 'Fallback Gallery 1',
      description: 'This is a fallback gallery for testing.',
      created_at: new Date().toISOString(),
      thumbnailUrl: '/placeholder.svg?height=300&width=400&text=Gallery'
    },
    {
      id: 'fallback2',
      title: 'Fallback Gallery 2',
      description: 'Another fallback gallery for testing.',
      created_at: new Date().toISOString(),
      thumbnailUrl: '/placeholder.svg?height=300&width=400&text=Gallery'
    }
  ]
}

export async function GET() {
  try {
    // First, check direct access to gallery_images table
    console.log('DEBUG: Checking direct access to gallery_images table')
    const { data: rawImages, error: rawImagesError } = await supabase
      .from('gallery_images')
      .select('*')
      .limit(5)
    
    if (rawImagesError) {
      console.error('DEBUG: Error accessing gallery_images directly:', rawImagesError)
    } else {
      console.log(`DEBUG: Direct gallery_images access found ${rawImages?.length || 0} items:`, 
        rawImages?.map(img => ({ id: img.id, gallery_id: img.gallery_id, image_url: img.image_url?.substring(0, 30) + '...' }))
      )
    }

    // Fetch all galleries from Supabase
    console.log('Fetching galleries from Supabase...')
    const galleries = await getGalleries()
    console.log(`Successfully fetched ${galleries.length} galleries:`, 
      galleries.map(g => ({ id: g.id, title: g.title, created_at: g.created_at }))
    )

    // If no galleries were found, return fallback data
    if (!galleries || galleries.length === 0) {
      console.log('No galleries found, returning fallback data')
      return NextResponse.json(getFallbackGalleries())
    }

    // For each gallery, fetch its first image
    console.log('Fetching thumbnails for galleries...')
    const galleriesWithThumbnails = await Promise.all(
      galleries.map(async (gallery) => {
        try {
          console.log(`Fetching first image for gallery ${gallery.id}: ${gallery.title}`)
          const firstImage = await getGalleryFirstImage(gallery.id)
          
          console.log(`First image for gallery ${gallery.id}:`, firstImage ? 
            { id: firstImage.id, image_url: firstImage.image_url?.substring(0, 30) + '...' } : 'null')
          
          const thumbnailUrl = firstImage ? prepareImagePath(firstImage.image_url) : null
          console.log(`Gallery ${gallery.id} thumbnail URL: ${thumbnailUrl}`)
          
          return {
            ...gallery,
            thumbnailUrl: thumbnailUrl || '/placeholder.svg?height=300&width=400&text=Gallery'
          }
        } catch (error) {
          console.error(`Error fetching first image for gallery ${gallery.id}:`, error)
          return {
            ...gallery,
            thumbnailUrl: '/placeholder.svg?height=300&width=400&text=Gallery'
          }
        }
      })
    )

    console.log(`Returning ${galleriesWithThumbnails.length} galleries with thumbnails:`, 
      galleriesWithThumbnails.map(g => ({ id: g.id, title: g.title, hasThumbnail: !!g.thumbnailUrl }))
    )
    return NextResponse.json(galleriesWithThumbnails)
  } catch (error) {
    console.error('Error fetching galleries:', error)
    // Return fallback data in case of error
    return NextResponse.json(getFallbackGalleries())
  }
}
