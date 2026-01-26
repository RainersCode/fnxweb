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
  status: 'uploading' | 'processing' | 'success' | 'error'
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalImages, setTotalImages] = useState(0)
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
    setTotalImages(newUploadingImages.length)
    setCurrentIndex(0)

    // Upload files ONE AT A TIME to prevent server overload
    const successfulUploads: (UploadingImage & { url: string; path: string })[] = []

    for (let i = 0; i < newUploadingImages.length; i++) {
      const image = newUploadingImages[i]
      setCurrentIndex(i + 1)
      try {
        const result = await uploadFile(image)
        if (result.status === 'success' && result.url && result.path) {
          successfulUploads.push(result as UploadingImage & { url: string; path: string })
        }
      } catch (error) {
        console.error(`Error uploading ${image.name}:`, error)
      }
    }

    if (successfulUploads.length > 0) {
      // Call the callback with the new URLs and paths
      onImagesUploaded(successfulUploads.map((img) => ({ url: img.url, path: img.path })))
    }

    setIsUploading(false)

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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
        setUploadingImages((prev) =>
          prev.map((img) => {
            if (img.id === image.id) {
              const nextProgress = img.progress + Math.random() * 15
              if (nextProgress >= 70 && img.status === 'uploading') {
                // Switch to "processing" status when upload is mostly done
                return { ...img, progress: 70, status: 'processing' as const }
              }
              return nextProgress < 70 ? { ...img, progress: nextProgress } : img
            }
            return img
          })
        )
      }, 200)

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
                  <div className="w-20 flex-shrink-0 text-right">
                    {img.status === 'uploading' && (
                      <span className="text-xs text-blue-500">{Math.round(img.progress)}%</span>
                    )}
                    {img.status === 'processing' && (
                      <span className="text-xs text-orange-500 animate-pulse">Optimizing...</span>
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
        <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-blue-50 p-4">
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Uploading image {currentIndex} of {totalImages}
            </span>
          </div>
          <div className="w-full max-w-xs">
            <Progress value={(currentIndex / totalImages) * 100} className="h-2" />
          </div>
          <p className="text-xs text-blue-600">Images are optimized one at a time for best results</p>
        </div>
      )}
    </div>
  )
}
