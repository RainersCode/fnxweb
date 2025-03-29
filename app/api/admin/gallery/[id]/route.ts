import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { updateGallery, deleteGallery, getGalleryWithImages } from '@/lib/api'
import { Gallery } from '@/types/supabase'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  // Check authentication
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch gallery and its images
    const gallery = await getGalleryWithImages(params.id)
    return NextResponse.json(gallery)
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    // Update gallery in Supabase
    const galleryUpdate: Partial<Gallery> = {
      title: body.title,
      description: body.description || null,
    }

    const updatedGallery = await updateGallery(params.id, galleryUpdate)
    return NextResponse.json(updatedGallery)
  } catch (error) {
    console.error('Error updating gallery:', error)
    return NextResponse.json({ error: 'Failed to update gallery' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  // Check authentication
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Delete gallery from Supabase
    await deleteGallery(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting gallery:', error)
    return NextResponse.json({ error: 'Failed to delete gallery' }, { status: 500 })
  }
}
