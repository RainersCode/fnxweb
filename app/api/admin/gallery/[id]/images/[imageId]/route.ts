import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { updateGalleryImage, deleteGalleryImage } from '@/lib/api'
import { GalleryImage } from '@/types/supabase'

interface RouteParams {
  params: {
    id: string
    imageId: string
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

    // Update gallery image in Supabase
    const imageUpdate: Partial<GalleryImage> = {
      caption: body.caption,
      display_order: body.display_order,
    }

    const updatedImage = await updateGalleryImage(params.imageId, imageUpdate)
    return NextResponse.json(updatedImage)
  } catch (error) {
    console.error('Error updating gallery image:', error)
    return NextResponse.json({ error: 'Failed to update gallery image' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  // Check authentication
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Delete gallery image from Supabase
    await deleteGalleryImage(params.imageId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting gallery image:', error)
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 })
  }
}
