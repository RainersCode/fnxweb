import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { uploadMedia } from '@/lib/api'
import sharp from 'sharp'

// Increase the bodyParser size limit for this specific route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '12mb', // Set higher than MAX_FILE_SIZE to allow processing
    },
  },
}

// Maximum file size (10MB, increased to allow larger originals for optimization)
const MAX_FILE_SIZE = 10 * 1024 * 1024
// Optimization settings
const MAX_WIDTH = 1920 // Max width in pixels
const QUALITY = 80 // Quality setting for WebP/JPEG (0-100)
const TARGET_FORMAT = 'webp' // Target format

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

    // Check file size *before* processing
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` }, { status: 400 })
    }

    // *** Start Image Optimization Logic ***
    let fileBuffer: Buffer
    let optimizedFileName: string
    const originalName = file.name.split('.').slice(0, -1).join('.') // Get name without extension
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)

    // Check if the file is an image and optimize
    if (file.type.startsWith('image/')) {
        try {
            const originalBuffer = Buffer.from(await file.arrayBuffer())
            fileBuffer = await sharp(originalBuffer)
              .resize({ width: MAX_WIDTH, withoutEnlargement: true }) // Resize if wider than MAX_WIDTH, don't enlarge smaller images
              .toFormat(TARGET_FORMAT, { quality: QUALITY }) // Convert to target format (e.g., webp)
              .toBuffer() // Get the processed image as a buffer

            // Construct filename with new extension
            optimizedFileName = `${folder}/${timestamp}-${randomString}-${originalName}.${TARGET_FORMAT}`
            console.log(`Optimized image: ${optimizedFileName}, Size: ${Math.round(fileBuffer.length / 1024)} KB`)
        } catch (optimizationError) {
            console.error('Error optimizing image:', optimizationError);
            // Fallback: Upload original if optimization fails
            fileBuffer = Buffer.from(await file.arrayBuffer())
            const fileExt = file.name.split('.').pop() || 'bin'; // Get original extension or use 'bin'
            optimizedFileName = `${folder}/${timestamp}-${randomString}-${originalName}.${fileExt}`
            console.log(`Uploading original due to optimization error: ${optimizedFileName}`)
        }
    } else {
      // Not an image, prepare original buffer and filename
      fileBuffer = Buffer.from(await file.arrayBuffer())
      const fileExt = file.name.split('.').pop() || 'bin';
      optimizedFileName = `${folder}/${timestamp}-${randomString}-${originalName}.${fileExt}`
      console.log(`Uploading non-image file: ${optimizedFileName}`)
    }
    // *** End Image Optimization Logic ***


    // Upload the processed (or original) buffer
    // Construct a Blob from the buffer
    const blob = new Blob([fileBuffer], { type: file.type.startsWith('image/') ? `image/${TARGET_FORMAT}` : file.type })
    // Construct a File object from Blob, which uploadMedia likely expects
    const processedFile = new File([blob], optimizedFileName, { type: blob.type });

    // Pass the processed File object and the new filename to uploadMedia
    const publicUrl = await uploadMedia(processedFile, optimizedFileName)

    // Return the URL and the *actual* path/filename saved in storage
    return NextResponse.json({ url: publicUrl, path: optimizedFileName })
  } catch (error) {
    console.error('Error processing/uploading file:', error)
    // Provide more specific error message if possible
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during upload'
    return NextResponse.json({ error: `Error processing/uploading file: ${errorMessage}` }, { status: 500 })
  }
}
