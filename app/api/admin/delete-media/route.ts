import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { deleteMedia } from '@/lib/api'

export async function POST(request: NextRequest) {
  // Check authentication
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { path } = await request.json()

    if (!path) {
      return NextResponse.json({ error: 'No path provided' }, { status: 400 })
    }

    // Delete the file
    await deleteMedia(path)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Error deleting file' }, { status: 500 })
  }
}
