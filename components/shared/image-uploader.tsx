'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { X, Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploaderProps {
  imageUrl: string
  onImageUploaded: (url: string, path: string) => void
  onImageRemoved: () => void
  folder?: string
  className?: string
}

export function ImageUploader({
  imageUrl,
  onImageUploaded,
  onImageRemoved,
  folder = 'articles',
  className = '',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)

      // Create a preview URL
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Upload the file using the API endpoint
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await response.json()

      // Call the callback with the new URL and path
      onImageUploaded(data.url, data.path)
    } catch (error) {
      console.error('Error uploading image:', error)
      setPreviewUrl(imageUrl || null)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onImageRemoved()
  }

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      {previewUrl ? (
        <div className="relative h-48 w-full overflow-hidden rounded-md border">
          <Image src={previewUrl} alt="Image preview" fill className="object-cover" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full"
            onClick={handleRemoveImage}
            disabled={isUploading}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mb-2 h-6 w-6 text-gray-400" />
          <p className="text-sm text-gray-500">Click to upload image</p>
          <p className="mt-1 text-xs text-gray-400">SVG, PNG, JPG or GIF</p>
        </div>
      )}

      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        disabled={isUploading}
      />

      {isUploading && (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span className="text-sm">Uploading...</span>
        </div>
      )}
    </div>
  )
}
