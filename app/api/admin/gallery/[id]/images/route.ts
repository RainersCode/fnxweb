import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'
import { addGalleryImage } from '@/lib/api'
import { GalleryImage } from '@/types/supabase'

interface RouteParams {
  params: {
    id: string
  }
}

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest, { params }: RouteParams) {
  // Check authentication
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch gallery images from Supabase
    const { data: images, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('gallery_id', params.id)
      .order('display_order', { ascending: true })

    if (error) throw error

    return NextResponse.json(images || [])
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  // Check authentication
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Validate request body
    if (!body.image_url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    // Add gallery image to Supabase
    const galleryImage: GalleryImage = {
      gallery_id: params.id,
      image_url: body.image_url,
      caption: body.caption || null,
      display_order: body.display_order || 0,
    }

    const createdImage = await addGalleryImage(galleryImage)
    return NextResponse.json(createdImage)
  } catch (error) {
    console.error('Error adding gallery image:', error)
    return NextResponse.json({ error: 'Failed to add gallery image' }, { status: 500 })
  }
}
