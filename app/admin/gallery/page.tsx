'use client'

import { useState, useEffect } from 'react'
import { Trash2, Edit, Plus, Search, Loader2, CalendarDays, ImagePlus } from 'lucide-react'
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
    <div className="container py-6">
      <SectionContainer>
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle title="Manage Galleries" />
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus size={16} className="mr-2" /> Add Gallery
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Search galleries..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredGalleries.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No galleries found. Create your first gallery!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredGalleries.map((gallery) => (
              <div
                key={gallery.id}
                className="overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">{gallery.title}</h3>
                      {gallery.description && (
                        <p className="mb-2 text-muted-foreground">{gallery.description}</p>
                      )}
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarDays size={14} className="mr-1" />
                        <span>Created: {formatDate(gallery.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManageImages(gallery)}
                      >
                        <ImagePlus size={16} className="mr-2" /> Images
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(gallery)}>
                        <Edit size={16} className="mr-2" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGalleryToDelete(gallery)}
                      >
                        <Trash2 size={16} className="mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionContainer>

      {/* Add Gallery Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Gallery</DialogTitle>
            <DialogDescription>Create a new gallery for your images</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Gallery Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter gallery title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter gallery description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGallery} disabled={formLoading || !formData.title}>
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Gallery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Gallery Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Gallery</DialogTitle>
            <DialogDescription>Update gallery details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Gallery Title</Label>
              <Input
                id="edit-title"
                name="title"
                placeholder="Enter gallery title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                name="description"
                placeholder="Enter gallery description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateGallery} disabled={formLoading || !formData.title}>
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update Gallery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Gallery Images Dialog */}
      <Dialog open={showImagesDialog} onOpenChange={setShowImagesDialog}>
        <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-5 sm:max-w-[85vw] lg:max-w-[800px]">
          <DialogHeader className="mb-2">
            <DialogTitle>Manage Gallery Images</DialogTitle>
            <DialogDescription>Add, edit, or remove images from this gallery</DialogDescription>
          </DialogHeader>
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="mb-3">
                <TabsTrigger value="single">Single Upload</TabsTrigger>
                <TabsTrigger value="multiple">Multiple Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="single" className="rounded-lg border p-3">
                <h4 className="mb-2 font-medium">Add New Image</h4>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="new-image-caption">Image Caption (Optional)</Label>
                    <Input
                      id="new-image-caption"
                      placeholder="Enter image caption"
                      value={newImageCaption}
                      onChange={(e) => setNewImageCaption(e.target.value)}
                    />
                  </div>
                  <ImageUploader
                    folder="galleries"
                    onImageUploaded={handleImageUploaded}
                    onImageRemoved={handleImageRemoved}
                    imageUrl={tempImageUrl}
                  />
                </div>
              </TabsContent>

              <TabsContent value="multiple" className="rounded-lg border p-3">
                <h4 className="mb-2 font-medium">Upload Multiple Images</h4>
                <p className="mb-3 text-sm text-muted-foreground">
                  Select multiple images to upload at once. Captions can be added after upload.
                </p>
                <MultiImageUploader
                  folder="galleries"
                  onImagesUploaded={handleMultipleImagesUploaded}
                />
                {uploadingMultiple && (
                  <div className="mt-3 flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="text-sm">Processing images...</span>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <Separator className="my-3" />

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-medium">Gallery Images</h4>
                <p className="text-sm text-muted-foreground">{galleryImages.length} images</p>
              </div>

              {galleryImages.length === 0 ? (
                <p className="text-muted-foreground">No images in this gallery yet.</p>
              ) : (
                <div className="grid max-h-[40vh] grid-cols-1 gap-3 overflow-y-auto p-1 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="overflow-hidden rounded-lg border shadow-sm">
                      <div className="relative aspect-square">
                        <img
                          src={image.image_url}
                          alt={image.caption || 'Gallery image'}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-2 p-2">
                        <Input
                          placeholder="Image caption"
                          value={image.caption || ''}
                          onChange={(e) => handleUpdateImageCaption(image, e.target.value)}
                          className="text-sm"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 w-full text-xs"
                          onClick={() => setImageToDelete(image)}
                        >
                          <Trash2 size={12} className="mr-1" /> Delete
                        </Button>
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the gallery &quot;{galleryToDelete?.title}&quot; and all
              its images. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteGallery}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Image Confirmation */}
      <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this image from the gallery. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteGalleryImage}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
