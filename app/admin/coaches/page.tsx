'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Edit, Plus, Search, Loader2, User, X } from 'lucide-react'
import { SectionContainer } from '@/components/shared/section-container'
import { SectionTitle } from '@/components/shared/section-title'
import { ImageUploader } from '@/components/shared/image-uploader'
import { Coach } from '@/types/supabase'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function AdminCoachesPage() {
  const router = useRouter()
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  // Form state for add/edit
  const emptyFormState = {
    name: '',
    role: '',
    bio: '',
    image_url: '',
    is_active: true,
  }
  const [formData, setFormData] = useState(emptyFormState)
  const [currentCoachId, setCurrentCoachId] = useState<string | null>(null)
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null)

  // Delete confirmation dialog
  const [coachToDelete, setCoachToDelete] = useState<Coach | null>(null)

  // Load coaches from Supabase
  useEffect(() => {
    fetchCoaches()
  }, [])

  const fetchCoaches = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/coaches')
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setCoaches(data || [])
    } catch (error) {
      console.error('Error fetching coaches:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter coaches based on search query
  const filteredCoaches = coaches.filter(
    (coach) =>
      coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (coach.role && coach.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (coach.bio && coach.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      is_active: checked,
    })
  }

  // Handle image upload
  const handleImageUploaded = async (url: string, path: string) => {
    // If there was an existing image, we need to delete it
    if (formData.image_url && formData.image_url !== url) {
      try {
        // Extract the path from the URL
        const pathMatch = formData.image_url.match(/media\/([^?]+)/)
        if (pathMatch && pathMatch[1]) {
          const oldPath = `${pathMatch[1]}`
          // Delete the old image using the API
          await fetch('/api/admin/delete-media', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ path: oldPath }),
          })
        }
      } catch (error) {
        console.error('Error deleting old image:', error)
      }
    }

    setFormData({
      ...formData,
      image_url: url,
    })
    setCurrentImagePath(path)
  }

  // Handle image removal
  const handleImageRemoved = async () => {
    // If there was an existing image, we need to delete it
    if (formData.image_url) {
      try {
        // Extract the path from the URL
        const pathMatch = formData.image_url.match(/media\/([^?]+)/)
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
        console.error('Error deleting image:', error)
      }
    }

    setFormData({
      ...formData,
      image_url: '',
    })
    setCurrentImagePath(null)
  }

  // Handle form submission for adding a new coach
  const handleAddCoach = async () => {
    if (!formData.name) return

    setFormLoading(true)

    try {
      const newCoach = {
        name: formData.name,
        role: formData.role || null,
        bio: formData.bio || null,
        image_url: formData.image_url || null,
        is_active: formData.is_active,
      }

      const response = await fetch('/api/admin/coaches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCoach),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setShowAddDialog(false)
      setFormData(emptyFormState)
      setCurrentImagePath(null)
      await fetchCoaches()
    } catch (error) {
      console.error('Error adding coach:', error)
    } finally {
      setFormLoading(false)
    }
  }

  // Open edit dialog with coach data
  const handleEditClick = (coach: Coach) => {
    setCurrentCoachId(coach.id)
    setFormData({
      name: coach.name,
      role: coach.role || '',
      bio: coach.bio || '',
      image_url: coach.image_url || '',
      is_active: coach.is_active,
    })
    setShowEditDialog(true)
  }

  // Handle form submission for updating a coach
  const handleUpdateCoach = async () => {
    if (!currentCoachId || !formData.name) return

    setFormLoading(true)

    try {
      const coachUpdate = {
        id: currentCoachId,
        name: formData.name,
        role: formData.role || null,
        bio: formData.bio || null,
        image_url: formData.image_url || null,
        is_active: formData.is_active,
      }

      const response = await fetch('/api/admin/coaches', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coachUpdate),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setShowEditDialog(false)
      setFormData(emptyFormState)
      setCurrentCoachId(null)
      setCurrentImagePath(null)
      await fetchCoaches()
    } catch (error) {
      console.error('Error updating coach:', error)
    } finally {
      setFormLoading(false)
    }
  }

  // Delete a coach
  const deleteCoach = async () => {
    if (!coachToDelete) return

    try {
      const response = await fetch('/api/admin/coaches', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: coachToDelete.id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // If coach had an image, delete it
      if (coachToDelete.image_url) {
        try {
          const pathMatch = coachToDelete.image_url.match(/media\/([^?]+)/)
          if (pathMatch && pathMatch[1]) {
            const path = `${pathMatch[1]}`
            await fetch('/api/admin/delete-media', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ path }),
            })
          }
        } catch (error) {
          console.error('Error deleting coach image:', error)
        }
      }

      setCoachToDelete(null)
      await fetchCoaches()
    } catch (error) {
      console.error('Error deleting coach:', error)
    }
  }

  return (
    <SectionContainer>
      <div className="mb-6 flex items-center justify-between">
        <SectionTitle title="Coaching Staff Management" />
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Coach
        </Button>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search coaches..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Coaches Table */}
      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border">
          {filteredCoaches.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center bg-white">
              <User className="mb-2 h-8 w-8 text-gray-400" />
              <p className="text-gray-500">No coaches found</p>
              {searchQuery && (
                <Button variant="link" className="mt-2" onClick={() => setSearchQuery('')}>
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Coach
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredCoaches.map((coach) => (
                    <tr key={coach.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          {coach.image_url ? (
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                              <img
                                src={coach.image_url}
                                alt={coach.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{coach.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {coach.role || '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            coach.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {coach.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditClick(coach)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCoachToDelete(coach)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {coach.name}? This action cannot
                                  be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setCoachToDelete(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={deleteCoach}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Coach Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Coach</DialogTitle>
            <DialogDescription>Create a new coaching staff profile</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role" className="mb-2 block">
                  Role
                </Label>
                <Input id="role" name="role" value={formData.role} onChange={handleInputChange} />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="is_active">Active Coach</Label>
              </div>
            </div>
            <div>
              <Label htmlFor="bio" className="mb-2 block">
                Biography
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="image" className="mb-2 block">
                Coach Image
              </Label>
              <ImageUploader
                imageUrl={formData.image_url}
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
                folder="coaches"
              />
              <p className="mt-1 text-xs text-gray-500">Recommended: Square image (1:1 ratio)</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false)
                setFormData(emptyFormState)
                setCurrentImagePath(null)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddCoach} disabled={!formData.name || formLoading}>
              {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Coach
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Coach Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Coach</DialogTitle>
            <DialogDescription>Update coach information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="edit_name" className="mb-2 block">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit_name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_role" className="mb-2 block">
                  Role
                </Label>
                <Input
                  id="edit_role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit_is_active"
                  checked={formData.is_active}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="edit_is_active">Active Coach</Label>
              </div>
            </div>
            <div>
              <Label htmlFor="edit_bio" className="mb-2 block">
                Biography
              </Label>
              <Textarea
                id="edit_bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="edit_image" className="mb-2 block">
                Coach Image
              </Label>
              <ImageUploader
                imageUrl={formData.image_url}
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
                folder="coaches"
              />
              <p className="mt-1 text-xs text-gray-500">Recommended: Square image (1:1 ratio)</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false)
                setFormData(emptyFormState)
                setCurrentCoachId(null)
                setCurrentImagePath(null)
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleUpdateCoach}
              disabled={!formData.name || formLoading}
            >
              {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Coach
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SectionContainer>
  )
}
