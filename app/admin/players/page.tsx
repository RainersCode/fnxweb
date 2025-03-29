'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Edit, Plus, Search, Loader2, User, X } from 'lucide-react'
import { SectionContainer } from '@/components/shared/section-container'
import { SectionTitle } from '@/components/shared/section-title'
import { ImageUploader } from '@/components/shared/image-uploader'
import { TeamPlayer } from '@/types/supabase'
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

export default function AdminPlayersPage() {
  const router = useRouter()
  const [players, setPlayers] = useState<TeamPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  // Form state for add/edit
  const emptyFormState = {
    name: '',
    position: '',
    bio: '',
    image_url: '',
    jersey_number: undefined,
    is_active: true,
  }
  const [formData, setFormData] = useState(emptyFormState)
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null)
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null)

  // Delete confirmation dialog
  const [playerToDelete, setPlayerToDelete] = useState<TeamPlayer | null>(null)

  // Load players from Supabase
  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/players')
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setPlayers(data || [])
    } catch (error) {
      console.error('Error fetching players:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter players based on search query
  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (player.position && player.position.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (player.bio && player.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle jersey number input (numeric)
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({
      ...formData,
      jersey_number: value ? parseInt(value) : undefined,
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

  // Handle form submission for adding a new player
  const handleAddPlayer = async () => {
    if (!formData.name) return

    setFormLoading(true)

    try {
      const newPlayer = {
        name: formData.name,
        position: formData.position || null,
        bio: formData.bio || null,
        image_url: formData.image_url || null,
        jersey_number: formData.jersey_number || null,
        is_active: formData.is_active,
      }

      const response = await fetch('/api/admin/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlayer),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setShowAddDialog(false)
      setFormData(emptyFormState)
      setCurrentImagePath(null)
      await fetchPlayers()
    } catch (error) {
      console.error('Error adding player:', error)
    } finally {
      setFormLoading(false)
    }
  }

  // Open edit dialog with player data
  const handleEditClick = (player: TeamPlayer) => {
    setCurrentPlayerId(player.id)
    setFormData({
      name: player.name,
      position: player.position || '',
      bio: player.bio || '',
      image_url: player.image_url || '',
      jersey_number: player.jersey_number,
      is_active: player.is_active,
    })
    setShowEditDialog(true)
  }

  // Handle form submission for updating a player
  const handleUpdatePlayer = async () => {
    if (!currentPlayerId || !formData.name) return

    setFormLoading(true)

    try {
      const playerUpdate = {
        id: currentPlayerId,
        name: formData.name,
        position: formData.position || null,
        bio: formData.bio || null,
        image_url: formData.image_url || null,
        jersey_number: formData.jersey_number || null,
        is_active: formData.is_active,
      }

      const response = await fetch('/api/admin/players', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerUpdate),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setShowEditDialog(false)
      setFormData(emptyFormState)
      setCurrentPlayerId(null)
      setCurrentImagePath(null)
      await fetchPlayers()
    } catch (error) {
      console.error('Error updating player:', error)
    } finally {
      setFormLoading(false)
    }
  }

  // Delete a player
  const deletePlayer = async () => {
    if (!playerToDelete) return

    try {
      const response = await fetch('/api/admin/players', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: playerToDelete.id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // If player had an image, delete it
      if (playerToDelete.image_url) {
        try {
          const pathMatch = playerToDelete.image_url.match(/media\/([^?]+)/)
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
          console.error('Error deleting player image:', error)
        }
      }

      setPlayerToDelete(null)
      await fetchPlayers()
    } catch (error) {
      console.error('Error deleting player:', error)
    }
  }

  return (
    <SectionContainer>
      <div className="mb-6 flex items-center justify-between">
        <SectionTitle title="Team Players Management" />
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Player
        </Button>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search players..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Players Table */}
      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border">
          {filteredPlayers.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center bg-white">
              <User className="mb-2 h-8 w-8 text-gray-400" />
              <p className="text-gray-500">No players found</p>
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
                      Player
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Position
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Number
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
                  {filteredPlayers.map((player) => (
                    <tr key={player.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          {player.image_url ? (
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                              <img
                                src={player.image_url}
                                alt={player.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{player.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {player.position || '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {player.jersey_number || '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            player.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {player.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditClick(player)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPlayerToDelete(player)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {player.name}? This action cannot
                                  be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setPlayerToDelete(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={deletePlayer}>Delete</AlertDialogAction>
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

      {/* Add Player Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Player</DialogTitle>
            <DialogDescription>Create a new team player profile</DialogDescription>
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
                <Label htmlFor="position" className="mb-2 block">
                  Position
                </Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="jersey_number" className="mb-2 block">
                  Jersey Number
                </Label>
                <Input
                  id="jersey_number"
                  name="jersey_number"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.jersey_number || ''}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="is_active">Active Player</Label>
                </div>
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
                Player Image
              </Label>
              <ImageUploader
                imageUrl={formData.image_url}
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
                folder="players"
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
            <Button
              type="submit"
              onClick={handleAddPlayer}
              disabled={!formData.name || formLoading}
            >
              {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Player
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Player Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
            <DialogDescription>Update player information</DialogDescription>
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
                <Label htmlFor="edit_position" className="mb-2 block">
                  Position
                </Label>
                <Input
                  id="edit_position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="edit_jersey_number" className="mb-2 block">
                  Jersey Number
                </Label>
                <Input
                  id="edit_jersey_number"
                  name="jersey_number"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.jersey_number || ''}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit_is_active"
                    checked={formData.is_active}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="edit_is_active">Active Player</Label>
                </div>
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
                Player Image
              </Label>
              <ImageUploader
                imageUrl={formData.image_url}
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
                folder="players"
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
                setCurrentPlayerId(null)
                setCurrentImagePath(null)
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleUpdatePlayer}
              disabled={!formData.name || formLoading}
            >
              {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Player
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SectionContainer>
  )
}
