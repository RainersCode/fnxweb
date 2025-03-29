import { NextRequest, NextResponse } from 'next/server'
import { getGalleryWithImages } from '@/lib/api'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    // Fetch gallery with its images from Supabase
    const galleryWithImages = await getGalleryWithImages(id)
    return NextResponse.json(galleryWithImages)
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}
