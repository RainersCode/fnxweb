import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { createGallery, getGalleriesWithCovers } from '@/lib/api'
import { Gallery } from '@/types/supabase'

export async function GET() {
  // Check authentication
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch all galleries with cover images from Supabase
    const galleries = await getGalleriesWithCovers()
    return NextResponse.json(galleries)
  } catch (error) {
    console.error('Error fetching galleries:', error)
    return NextResponse.json({ error: 'Failed to fetch galleries' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Check authentication
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // Validate request body
    if (!body.title) {
      return NextResponse.json({ error: 'Gallery title is required' }, { status: 400 })
    }

    // Create gallery in Supabase
    const gallery: Gallery = {
      title: body.title,
      description: body.description || null,
    }

    const createdGallery = await createGallery(gallery)
    return NextResponse.json(createdGallery)
  } catch (error) {
    console.error('Error creating gallery:', error)
    return NextResponse.json({ error: 'Failed to create gallery' }, { status: 500 })
  }
} 