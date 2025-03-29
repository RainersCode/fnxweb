'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Edit, Plus, Search, Loader2, CalendarDays, MapPin, Home, X } from 'lucide-react'
import { SectionContainer } from '@/components/shared/section-container'
import { SectionTitle } from '@/components/shared/section-title'
import { ImageUploader } from '@/components/shared/image-uploader'
import { Fixture } from '@/types/supabase'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function AdminFixturesPage() {
  const router = useRouter()
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  // Form state for add/edit
  const emptyFormState = {
    opponent: '',
    match_date: new Date().toISOString().slice(0, 10),
    location: '',
    score: '',
    is_home_game: true,
    result: '' as 'win' | 'loss' | 'draw' | undefined,
    description: '',
    home_logo_url: '',
    away_logo_url: '',
  }
  const [formData, setFormData] = useState(emptyFormState)
  const [currentFixtureId, setCurrentFixtureId] = useState<string | null>(null)
  const [homeLogoPath, setHomeLogoPath] = useState<string | null>(null)
  const [awayLogoPath, setAwayLogoPath] = useState<string | null>(null)

  // Delete confirmation dialog
  const [fixtureToDelete, setFixtureToDelete] = useState<Fixture | null>(null)

  // Load fixtures from Supabase
  useEffect(() => {
    fetchFixtures()
  }, [])

  const fetchFixtures = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/fixtures')
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setFixtures(data || [])
    } catch (error) {
      console.error('Error fetching fixtures:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter fixtures based on search query
  const filteredFixtures = fixtures.filter(
    (fixture) =>
      fixture.opponent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fixture.location && fixture.location.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle checkbox change for is_home_game
  const handleHomeGameChange = (checked: boolean) => {
    setFormData({
      ...formData,
      is_home_game: checked,
    })
  }

  // Handle select change for result
  const handleResultChange = (value: string) => {
    setFormData({
      ...formData,
      result: value === 'none' ? undefined : (value as 'win' | 'loss' | 'draw'),
    })
  }

  // Handle home logo upload
  const handleHomeLogoUploaded = async (url: string, path: string) => {
    // If there was an existing logo, we need to delete it
    if (formData.home_logo_url && formData.home_logo_url !== url) {
      try {
        // Extract the path from the URL
        const pathMatch = formData.home_logo_url.match(/media\/([^?]+)/)
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
        console.error('Error deleting old home logo:', error)
      }
    }

    setFormData({
      ...formData,
      home_logo_url: url,
    })
    setHomeLogoPath(path)
  }

  // Handle away logo upload
  const handleAwayLogoUploaded = async (url: string, path: string) => {
    // If there was an existing logo, we need to delete it
    if (formData.away_logo_url && formData.away_logo_url !== url) {
      try {
        // Extract the path from the URL
        const pathMatch = formData.away_logo_url.match(/media\/([^?]+)/)
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
        console.error('Error deleting old away logo:', error)
      }
    }

    setFormData({
      ...formData,
      away_logo_url: url,
    })
    setAwayLogoPath(path)
  }

  // Handle home logo removal
  const handleHomeLogoRemoved = async () => {
    // If there was an existing logo, we need to delete it
    if (formData.home_logo_url) {
      try {
        // Extract the path from the URL
        const pathMatch = formData.home_logo_url.match(/media\/([^?]+)/)
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
        console.error('Error deleting home logo:', error)
      }
    }

    setFormData({
      ...formData,
      home_logo_url: '',
    })
    setHomeLogoPath(null)
  }

  // Handle away logo removal
  const handleAwayLogoRemoved = async () => {
    // If there was an existing logo, we need to delete it
    if (formData.away_logo_url) {
      try {
        // Extract the path from the URL
        const pathMatch = formData.away_logo_url.match(/media\/([^?]+)/)
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
        console.error('Error deleting away logo:', error)
      }
    }

    setFormData({
      ...formData,
      away_logo_url: '',
    })
    setAwayLogoPath(null)
  }

  // Handle form submission for adding a new fixture
  const handleAddFixture = async () => {
    if (!formData.opponent || !formData.match_date) return

    setFormLoading(true)

    try {
      const newFixture = {
        opponent: formData.opponent,
        match_date: formData.match_date,
        location: formData.location || null,
        score: formData.score || null,
        is_home_game: formData.is_home_game,
        result: formData.result || null,
        description: formData.description || null,
        home_logo_url: formData.home_logo_url || null,
        away_logo_url: formData.away_logo_url || null,
      }

      const response = await fetch('/api/admin/fixtures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFixture),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      await fetchFixtures() // Refresh the list
      setShowAddDialog(false)
      setFormData(emptyFormState)
      setHomeLogoPath(null)
      setAwayLogoPath(null)
    } catch (error) {
      console.error('Error adding fixture:', error)
    } finally {
      setFormLoading(false)
    }
  }

  // Handle edit click
  const handleEditClick = (fixture: Fixture) => {
    setCurrentFixtureId(fixture.id)
    setFormData({
      opponent: fixture.opponent,
      match_date: new Date(fixture.match_date).toISOString().slice(0, 10),
      location: fixture.location || '',
      score: fixture.score || '',
      is_home_game: fixture.is_home_game,
      result: fixture.result,
      description: fixture.description || '',
      home_logo_url: fixture.home_logo_url || '',
      away_logo_url: fixture.away_logo_url || '',
    })
    setShowEditDialog(true)
  }

  // Handle form submission for updating an existing fixture
  const handleUpdateFixture = async () => {
    if (!currentFixtureId || !formData.opponent || !formData.match_date) return

    setFormLoading(true)

    try {
      const updatedFixture = {
        id: currentFixtureId,
        opponent: formData.opponent,
        match_date: formData.match_date,
        location: formData.location || null,
        score: formData.score || null,
        is_home_game: formData.is_home_game,
        result: formData.result || null,
        description: formData.description || null,
        home_logo_url: formData.home_logo_url || null,
        away_logo_url: formData.away_logo_url || null,
      }

      const response = await fetch('/api/admin/fixtures', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFixture),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setShowEditDialog(false)
      setFormData(emptyFormState)
      setCurrentFixtureId(null)
      setHomeLogoPath(null)
      setAwayLogoPath(null)
      await fetchFixtures()
    } catch (error) {
      console.error('Error updating fixture:', error)
    } finally {
      setFormLoading(false)
    }
  }

  // Delete fixture
  const deleteFixture = async () => {
    if (!fixtureToDelete) return

    try {
      // Delete logos if they exist
      if (fixtureToDelete.home_logo_url) {
        try {
          // Extract the path from the URL
          const pathMatch = fixtureToDelete.home_logo_url.match(/media\/([^?]+)/)
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
        } catch (imageError) {
          console.error('Error deleting home logo:', imageError)
          // Continue with fixture deletion even if image deletion fails
        }
      }

      if (fixtureToDelete.away_logo_url) {
        try {
          // Extract the path from the URL
          const pathMatch = fixtureToDelete.away_logo_url.match(/media\/([^?]+)/)
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
        } catch (imageError) {
          console.error('Error deleting away logo:', imageError)
          // Continue with fixture deletion even if image deletion fails
        }
      }

      const response = await fetch('/api/admin/fixtures', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: fixtureToDelete.id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setFixtures(fixtures.filter((fixture) => fixture.id !== fixtureToDelete.id))
      setFixtureToDelete(null)
    } catch (error) {
      console.error('Error deleting fixture:', error)
    }
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString('en-GB', options)
  }

  return (
    <main className="flex-1 pb-16">
      <SectionContainer className="bg-white">
        <div className="relative z-10">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <SectionTitle title="MANAGE" titleHighlight="FIXTURES" />
            <p className="mt-4 text-muted-foreground">
              Add, edit and delete match fixtures for the club website.
            </p>
          </div>

          <div className="mb-8 flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search fixtures..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Fixture
            </Button>
          </div>

          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span>Loading fixtures...</span>
            </div>
          ) : filteredFixtures.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center">
              <p className="mb-4 text-lg font-medium">No fixtures found</p>
              <Button variant="outline" onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add your first fixture
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFixtures.map((fixture) => (
                <div
                  key={fixture.id}
                  className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-semibold leading-tight tracking-tight text-gray-800">
                      {fixture.is_home_game ? 'Our Team vs' : 'Away at'} {fixture.opponent}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          fixture.result === 'win'
                            ? 'bg-green-50 text-green-800'
                            : fixture.result === 'loss'
                              ? 'bg-red-50 text-red-800'
                              : fixture.result === 'draw'
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-blue-50 text-blue-800'
                        }`}
                      >
                        {fixture.result
                          ? fixture.result === 'win'
                            ? 'Win'
                            : fixture.result === 'loss'
                              ? 'Loss'
                              : 'Draw'
                          : 'Upcoming'}
                      </span>
                      <span className="inline-flex items-center">
                        <CalendarDays className="mr-1 h-4 w-4" />
                        {formatDate(fixture.match_date)}
                      </span>
                      <span className="inline-flex items-center">
                        <Home className="mr-1 h-4 w-4" />
                        {fixture.is_home_game ? 'Home' : 'Away'}
                      </span>
                      {fixture.location && (
                        <span className="inline-flex items-center">
                          <MapPin className="mr-1 h-4 w-4" />
                          {fixture.location}
                        </span>
                      )}
                      {fixture.score && <span>Score: {fixture.score}</span>}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-2 md:mt-0">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(fixture)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setFixtureToDelete(fixture)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the fixture against &quot;
                            {fixtureToDelete?.opponent}
                            &quot;. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setFixtureToDelete(null)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={deleteFixture}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionContainer>

      {/* Add Fixture Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Fixture</DialogTitle>
            <DialogDescription>
              Create a new match fixture to be displayed on the website.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="opponent">Opponent Team</Label>
              <Input
                id="opponent"
                name="opponent"
                placeholder="Enter opponent team name"
                value={formData.opponent}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="match_date">Match Date</Label>
              <Input
                id="match_date"
                name="match_date"
                type="date"
                value={formData.match_date}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Enter match location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_home_game"
                checked={formData.is_home_game}
                onCheckedChange={handleHomeGameChange}
              />
              <Label htmlFor="is_home_game" className="cursor-pointer">
                Home Game
              </Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="score">Score (for completed matches)</Label>
              <Input
                id="score"
                name="score"
                placeholder="e.g. 24-17"
                value={formData.score}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="result">Result (for completed matches)</Label>
              <Select value={formData.result || 'none'} onValueChange={handleResultChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select match result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not played yet</SelectItem>
                  <SelectItem value="win">Win</SelectItem>
                  <SelectItem value="loss">Loss</SelectItem>
                  <SelectItem value="draw">Draw</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Home Team Logo</Label>
              <ImageUploader
                imageUrl={formData.home_logo_url}
                onImageUploaded={handleHomeLogoUploaded}
                onImageRemoved={handleHomeLogoRemoved}
              />
            </div>
            <div className="grid gap-2">
              <Label>Away Team Logo</Label>
              <ImageUploader
                imageUrl={formData.away_logo_url}
                onImageUploaded={handleAwayLogoUploaded}
                onImageRemoved={handleAwayLogoRemoved}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Additional Notes</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Any additional information about the match..."
                value={formData.description}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddDialog(false)
                setFormData(emptyFormState)
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAddFixture} disabled={formLoading}>
              {formLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Fixture'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Fixture Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Fixture</DialogTitle>
            <DialogDescription>Make changes to the match fixture.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-opponent">Opponent Team</Label>
              <Input
                id="edit-opponent"
                name="opponent"
                placeholder="Enter opponent team name"
                value={formData.opponent}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-match_date">Match Date</Label>
              <Input
                id="edit-match_date"
                name="match_date"
                type="date"
                value={formData.match_date}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                name="location"
                placeholder="Enter match location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-is_home_game"
                checked={formData.is_home_game}
                onCheckedChange={handleHomeGameChange}
              />
              <Label htmlFor="edit-is_home_game" className="cursor-pointer">
                Home Game
              </Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-score">Score (for completed matches)</Label>
              <Input
                id="edit-score"
                name="score"
                placeholder="e.g. 24-17"
                value={formData.score || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-result">Result (for completed matches)</Label>
              <Select value={formData.result || 'none'} onValueChange={handleResultChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select match result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not played yet</SelectItem>
                  <SelectItem value="win">Win</SelectItem>
                  <SelectItem value="loss">Loss</SelectItem>
                  <SelectItem value="draw">Draw</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Home Team Logo</Label>
              <ImageUploader
                imageUrl={formData.home_logo_url}
                onImageUploaded={handleHomeLogoUploaded}
                onImageRemoved={handleHomeLogoRemoved}
              />
            </div>
            <div className="grid gap-2">
              <Label>Away Team Logo</Label>
              <ImageUploader
                imageUrl={formData.away_logo_url}
                onImageUploaded={handleAwayLogoUploaded}
                onImageRemoved={handleAwayLogoRemoved}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Additional Notes</Label>
              <Textarea
                id="edit-description"
                name="description"
                placeholder="Any additional information about the match..."
                value={formData.description || ''}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowEditDialog(false)
                setFormData(emptyFormState)
                setCurrentFixtureId(null)
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdateFixture} disabled={formLoading}>
              {formLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Update Fixture'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
