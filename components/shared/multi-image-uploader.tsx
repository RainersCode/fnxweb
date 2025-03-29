'use client'

import { useState, useRef } from 'react'
import { Upload, Loader2, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface MultiImageUploaderProps {
  onImagesUploaded: (urls: { url: string; path: string }[]) => void
  folder?: string
  className?: string
}

type UploadingImage = {
  id: string
  file: File
  name: string
  progress: number
  status: 'uploading' | 'success' | 'error'
  url?: string
  path?: string
  error?: string
}

export function MultiImageUploader({
  onImagesUploaded,
  folder = 'galleries',
  className = '',
}: MultiImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    // Create a list of files to upload
    const newUploadingImages: UploadingImage[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      progress: 0,
      status: 'uploading',
    }))

    setUploadingImages(newUploadingImages)

    // Upload each file individually
    const uploadPromises = newUploadingImages.map((image) => uploadFile(image))

    try {
      const results = await Promise.all(uploadPromises)

      // Filter out any failed uploads
      const successfulUploads = results.filter(
        (result) => result.status === 'success'
      ) as (UploadingImage & { url: string; path: string })[]

      if (successfulUploads.length > 0) {
        // Call the callback with the new URLs and paths
        onImagesUploaded(successfulUploads.map((img) => ({ url: img.url, path: img.path })))
      }
    } catch (error) {
      console.error('Error uploading images:', error)
    } finally {
      setIsUploading(false)

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const uploadFile = async (image: UploadingImage): Promise<UploadingImage> => {
    try {
      // Update progress to show upload starting
      updateImageProgress(image.id, 10)

      // Create form data for the upload
      const formData = new FormData()
      formData.append('file', image.file)
      formData.append('folder', folder)

      // Simulate progress updates (since fetch doesn't provide progress)
      const progressInterval = setInterval(() => {
        updateImageProgress(image.id, (prev) => {
          const nextProgress = prev + Math.random() * 10
          return nextProgress < 90 ? nextProgress : prev
        })
      }, 300)

      // Upload the file
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await response.json()

      // Update the image status with the result
      const updatedImage: UploadingImage = {
        ...image,
        progress: 100,
        status: 'success',
        url: data.url,
        path: data.path,
      }

      setUploadingImages((prev) => prev.map((img) => (img.id === image.id ? updatedImage : img)))

      return updatedImage
    } catch (error) {
      console.error(`Error uploading ${image.name}:`, error)

      // Update the image status with the error
      const updatedImage: UploadingImage = {
        ...image,
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to upload image',
      }

      setUploadingImages((prev) => prev.map((img) => (img.id === image.id ? updatedImage : img)))

      return updatedImage
    }
  }

  const updateImageProgress = (id: string, progressValue: number | ((prev: number) => number)) => {
    setUploadingImages((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          const newProgress =
            typeof progressValue === 'function' ? progressValue(img.progress) : progressValue

          return { ...img, progress: newProgress }
        }
        return img
      })
    )
  }

  const removeImage = (id: string) => {
    setUploadingImages((prev) => prev.filter((img) => img.id !== id))
  }

  const clearAllImages = () => {
    setUploadingImages([])
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mb-1 h-5 w-5 text-gray-400" />
        <p className="text-sm text-gray-500">Click to upload multiple images</p>
        <p className="mt-1 text-xs text-gray-400">SVG, PNG, JPG or GIF</p>
      </div>

      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        disabled={isUploading}
        multiple
      />

      {uploadingImages.length > 0 && (
        <div className="rounded-md border p-3">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-medium">Uploading {uploadingImages.length} images</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllImages}
              disabled={isUploading}
              className="h-7 px-2"
            >
              Clear All
            </Button>
          </div>

          <div className="max-h-36 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-2">
              {uploadingImages.map((img) => (
                <div
                  key={img.id}
                  className="flex items-center space-x-2 border-b border-gray-100 pb-2 text-sm"
                >
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded bg-gray-100">
                    <ImageIcon size={14} className="text-gray-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs">{img.name}</p>
                    <Progress value={img.progress} className="mt-1 h-1" />
                  </div>
                  <div className="w-12 flex-shrink-0 text-right">
                    {img.status === 'uploading' && (
                      <span className="text-xs text-blue-500">{Math.round(img.progress)}%</span>
                    )}
                    {img.status === 'success' && (
                      <span className="text-xs text-green-500">Done</span>
                    )}
                    {img.status === 'error' && <span className="text-xs text-red-500">Failed</span>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => removeImage(img.id)}
                    disabled={isUploading && img.status === 'uploading'}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span className="text-sm">Uploading images...</span>
        </div>
      )}
    </div>
  )
}
