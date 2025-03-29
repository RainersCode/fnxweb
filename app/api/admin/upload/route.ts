import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { uploadMedia } from '@/lib/api'

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  // Check authentication
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!folder) {
      return NextResponse.json({ error: 'No folder specified' }, { status: 400 })
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 })
    }

    // Create path
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`

    // Upload the file
    const publicUrl = await uploadMedia(file, fileName)

    return NextResponse.json({ url: publicUrl, path: fileName })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
  }
}
