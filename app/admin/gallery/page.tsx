'use client'

import { useState, useEffect } from 'react'
import { Trash2, Edit, Plus, Search, Loader2, CalendarDays, ImagePlus, Images, FolderOpen } from 'lucide-react'
import { SectionContainer } from '@/components/shared/section-container'
import { SectionTitle } from '@/components/shared/section-title'
import { ImageUploader } from '@/components/shared/image-uploader'
import { MultiImageUploader } from '@/components/shared/multi-image-uploader'
import { Gallery, GalleryImage } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function AdminGalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showImagesDialog, setShowImagesDialog] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [uploadingMultiple, setUploadingMultiple] = useState(false)

  // Form state for add/edit
  const emptyFormState = {
    title: '',
    description: '',
  }
  const [formData, setFormData] = useState(emptyFormState)
  const [currentGalleryId, setCurrentGalleryId] = useState<string | null>(null)

  // Gallery images management
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [newImageCaption, setNewImageCaption] = useState('')
  const [tempImageUrl, setTempImageUrl] = useState('')

  // Delete confirmation dialog
  const [galleryToDelete, setGalleryToDelete] = useState<Gallery | null>(null)
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null)

  // Load galleries from Supabase
  useEffect(() => {
    fetchGalleries()
  }, [])

  const fetchGalleries = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/gallery')
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setGalleries(data || [])
    } catch (error) {
      console.error('Error fetching galleries:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch gallery images when viewing a gallery
  const fetchGalleryImages = async (galleryId: string) => {
    try {
      const response = await fetch(`/api/admin/gallery/${galleryId}/images`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setGalleryImages(data || [])
    } catch (error) {
      console.error('Error fetching gallery images:', error)
    }
  }

  // Filter galleries based on search query
  const filteredGalleries = galleries.filter(
    (gallery) =>
      gallery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (gallery.description && gallery.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle form submission for adding a new gallery
  const handleAddGallery = async () => {
    if (!formData.title) return

    setFormLoading(true)

    try {
      const newGallery = {
        title: formData.title,
        description: formData.description || null,
      }

      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGallery),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Refresh galleries list
      await fetchGalleries()

      // Close dialog and reset form
      setShowAddDialog(false)
      setFormData(emptyFormState)
    } catch (error) {
      console.error('Error adding gallery:', error)
    } finally {
      setFormLoading(false)
    }
  }

  // Handle click on edit button
  const handleEditClick = (gallery: Gallery) => {
    setCurrentGalleryId(gallery.id)
    setFormData({
      title: gallery.title,
      description: gallery.description || '',
    })
    setShowEditDialog(true)
  }

  // Handle form submission for updating a gallery
  const handleUpdateGallery = async () => {
    if (!currentGalleryId || !formData.title) return

    setFormLoading(true)

    try {
      const updatedGallery = {
        title: formData.title,
        description: formData.description || null,
      }

      const response = await fetch(`/api/admin/gallery/${currentGalleryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGallery),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Refresh galleries list
      await fetchGalleries()

      // Close dialog and reset form
      setShowEditDialog(false)
      setFormData(emptyFormState)
      setCurrentGalleryId(null)
    } catch (error) {
      console.error('Error updating gallery:', error)
    } finally {
      setFormLoading(false)
    }
  }

  // Delete gallery
  const deleteGallery = async () => {
    if (!galleryToDelete) return

    try {
      const response = await fetch(`/api/admin/gallery/${galleryToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Refresh galleries list
      await fetchGalleries()
    } catch (error) {
      console.error('Error deleting gallery:', error)
    } finally {
      setGalleryToDelete(null)
    }
  }

  // Open images management dialog
  const handleManageImages = (gallery: Gallery) => {
    setCurrentGalleryId(gallery.id)
    fetchGalleryImages(gallery.id)
    setShowImagesDialog(true)
    setTempImageUrl('')
  }

  // Handle image upload to gallery
  const handleImageUploaded = async (url: string) => {
    if (!currentGalleryId) return

    try {
      const newImage = {
        gallery_id: currentGalleryId,
        image_url: url,
        caption: newImageCaption || null,
        display_order: galleryImages.length + 1,
      }

      const response = await fetch(`/api/admin/gallery/${currentGalleryId}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newImage),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Refresh gallery images list
      await fetchGalleryImages(currentGalleryId)
      setNewImageCaption('')
      setTempImageUrl('')
    } catch (error) {
      console.error('Error adding gallery image:', error)
    }
  }

  // Handle multiple images upload to gallery
  const handleMultipleImagesUploaded = async (images: { url: string; path: string }[]) => {
    if (!currentGalleryId || images.length === 0) return

    setUploadingMultiple(true)

    try {
      // Process each image
      for (let i = 0; i < images.length; i++) {
        const { url } = images[i]

        const newImage = {
          gallery_id: currentGalleryId,
          image_url: url,
          caption: '',
          display_order: galleryImages.length + i + 1,
        }

        await fetch(`/api/admin/gallery/${currentGalleryId}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newImage),
        })
      }

      // Refresh gallery images list
      await fetchGalleryImages(currentGalleryId)
    } catch (error) {
      console.error('Error adding multiple gallery images:', error)
    } finally {
      setUploadingMultiple(false)
    }
  }

  // Handle image removal
  const handleImageRemoved = () => {
    setTempImageUrl('')
  }

  // Delete gallery image
  const deleteGalleryImage = async () => {
    if (!imageToDelete || !currentGalleryId) return

    try {
      const response = await fetch(
        `/api/admin/gallery/${currentGalleryId}/images/${imageToDelete.id}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Also delete the image file from storage
      try {
        // Extract the path from the URL
        const pathMatch = imageToDelete.image_url.match(/media\/([^?]+)/)
        if (pathMatch && pathMatch[1]) {
          const path = `${pathMatch[1]}`
          // Delete the image using the API
          await fetch('/api/admin/delete-media', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ path }),
          })
        }
      } catch (error) {
        console.error('Error deleting image file:', error)
      }

      // Refresh gallery images list
      await fetchGalleryImages(currentGalleryId)
    } catch (error) {
      console.error('Error deleting gallery image:', error)
    } finally {
      setImageToDelete(null)
    }
  }

  // Update image caption
  const handleUpdateImageCaption = async (image: GalleryImage, newCaption: string) => {
    if (!currentGalleryId) return

    try {
      const response = await fetch(`/api/admin/gallery/${currentGalleryId}/images/${image.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ caption: newCaption || null }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Refresh gallery images list
      await fetchGalleryImages(currentGalleryId)
    } catch (error) {
      console.error('Error updating image caption:', error)
    }
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <main className="flex-1 pb-16">
      <SectionContainer className="bg-white">
        <div className="relative z-10">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <SectionTitle title="MANAGE" titleHighlight="GALLERIES" />
            <p className="mt-4 text-muted-foreground">
              Create and manage photo galleries for the club website.
            </p>
          </div>

          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search galleries..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Gallery
            </Button>
          </div>

          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span>Loading galleries...</span>
            </div>
          ) : filteredGalleries.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mb-4 text-lg font-medium">No galleries found</p>
              <Button variant="outline" onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create your first gallery
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGalleries.map((gallery) => (
                <div
                  key={gallery.id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                >
                  {/* Gallery Preview Header */}
                  <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                    {gallery.cover_image ? (
                      <img
                        src={gallery.cover_image}
                        alt={gallery.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Images className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3">
                      <Button
                        size="sm"
                        className="shadow-md"
                        onClick={() => handleManageImages(gallery)}
                      >
                        <ImagePlus className="mr-1.5 h-3.5 w-3.5" />
                        Manage Images
                      </Button>
                    </div>
                  </div>

                  {/* Gallery Info */}
                  <div className="p-4">
                    <h3 className="mb-1 text-lg font-semibold text-gray-800 line-clamp-1">
                      {gallery.title}
                    </h3>
                    {gallery.description && (
                      <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                        {gallery.description}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                      <span>{formatDate(gallery.created_at)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex border-t border-gray-100 bg-gray-50/50">
                    <button
                      className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => handleEditClick(gallery)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <div className="w-px bg-gray-200" />
                    <button
                      className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                      onClick={() => setGalleryToDelete(gallery)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionContainer>

      {/* Add Gallery Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl">Create New Gallery</DialogTitle>
            <DialogDescription>Add a new photo gallery to showcase images</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-5">
            <div className="space-y-2">
              <Label htmlFor="title">Gallery Title <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Season 2024 Highlights"
                value={formData.title}
                onChange={handleInputChange}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add a brief description of this gallery..."
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">Optional - helps visitors understand the gallery content</p>
            </div>
          </div>
          <DialogFooter className="border-t pt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGallery} disabled={formLoading || !formData.title}>
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Create Gallery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Gallery Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl">Edit Gallery</DialogTitle>
            <DialogDescription>Update the gallery details</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-5">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Gallery Title <span className="text-destructive">*</span></Label>
              <Input
                id="edit-title"
                name="title"
                placeholder="e.g., Season 2024 Highlights"
                value={formData.title}
                onChange={handleInputChange}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                placeholder="Add a brief description of this gallery..."
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">Optional - helps visitors understand the gallery content</p>
            </div>
          </div>
          <DialogFooter className="border-t pt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateGallery} disabled={formLoading || !formData.title}>
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Gallery Images Dialog */}
      <Dialog open={showImagesDialog} onOpenChange={setShowImagesDialog}>
        <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-[900px]">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl">Manage Gallery Images</DialogTitle>
            <DialogDescription>Upload and organize images for this gallery</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {/* Upload Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">Upload Images</h3>
              <Tabs defaultValue="multiple" className="w-full">
                <TabsList className="mb-4 grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="multiple">Bulk Upload</TabsTrigger>
                  <TabsTrigger value="single">Single Upload</TabsTrigger>
                </TabsList>

                <TabsContent value="multiple" className="mt-0">
                  <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-6">
                    <div className="text-center mb-4">
                      <Images className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Drag and drop multiple images or click to select
                      </p>
                    </div>
                    <MultiImageUploader
                      folder="galleries"
                      onImagesUploaded={handleMultipleImagesUploaded}
                    />
                    {uploadingMultiple && (
                      <div className="mt-4 flex items-center justify-center p-4 bg-white rounded-lg border">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm font-medium">Uploading images...</span>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="single" className="mt-0">
                  <div className="rounded-lg border bg-white p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="new-image-caption">Caption</Label>
                        <Input
                          id="new-image-caption"
                          placeholder="Optional image caption"
                          value={newImageCaption}
                          onChange={(e) => setNewImageCaption(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Add a description for this image</p>
                      </div>
                      <div>
                        <Label className="mb-2 block">Image</Label>
                        <ImageUploader
                          folder="galleries"
                          onImageUploaded={handleImageUploaded}
                          onImageRemoved={handleImageRemoved}
                          imageUrl={tempImageUrl}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <Separator />

            {/* Gallery Images Section */}
            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Gallery Images</h3>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  {galleryImages.length} {galleryImages.length === 1 ? 'image' : 'images'}
                </span>
              </div>

              {galleryImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50/50 py-12">
                  <Images className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-muted-foreground font-medium">No images yet</p>
                  <p className="text-sm text-muted-foreground">Upload images using the options above</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {galleryImages.map((image) => (
                    <div
                      key={image.id}
                      className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={image.image_url}
                          alt={image.caption || 'Gallery image'}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        {/* Delete button overlay */}
                        <button
                          className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 hover:bg-red-600"
                          onClick={() => setImageToDelete(image)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="p-2">
                        <Input
                          placeholder="Add caption..."
                          value={image.caption || ''}
                          onChange={(e) => handleUpdateImageCaption(image, e.target.value)}
                          className="h-8 text-xs border-gray-200 focus:border-gray-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Gallery Confirmation */}
      <AlertDialog
        open={!!galleryToDelete}
        onOpenChange={(open) => !open && setGalleryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Gallery</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{galleryToDelete?.title}&quot;? This will permanently remove the gallery and all its images. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteGallery} className="bg-red-600 hover:bg-red-700">
              Delete Gallery
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Image Confirmation */}
      <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteGalleryImage} className="bg-red-600 hover:bg-red-700">
              Delete Image
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
