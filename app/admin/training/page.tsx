'use client'

import { useState, useEffect } from 'react'
import { Trash2, Edit, Plus, Loader2, Clock, MapPin, Users, Home, X } from 'lucide-react'
import { TrainingSession } from '@/types/supabase'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'

const DAYS_OF_WEEK = [
  { value: 1, label: 'Pirmdiena' },
  { value: 2, label: 'Otrdiena' },
  { value: 3, label: 'Trešdiena' },
  { value: 4, label: 'Ceturtdiena' },
  { value: 5, label: 'Piektdiena' },
  { value: 6, label: 'Sestdiena' },
  { value: 0, label: 'Svētdiena' },
]

const TEAM_GROUPS = [
  'Pieaugušie',
  'Juniori U18',
  'Juniori U16',
  'Bērni U14',
  'Bērni U12',
  'Bērni U10',
  'Visi',
]

export default function AdminTrainingPage() {
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const emptyFormState = {
    day_of_week: 1,
    start_time: '18:00',
    end_time: '20:00',
    location: '',
    team_group: 'Visi',
    description: '',
    is_active: true,
  }
  const [formData, setFormData] = useState(emptyFormState)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [sessionToDelete, setSessionToDelete] = useState<TrainingSession | null>(null)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/training')
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setSessions(data || [])
    } catch (error) {
      console.error('Error fetching training sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDayName = (dayOfWeek: number) => {
    return DAYS_OF_WEEK.find(d => d.value === dayOfWeek)?.label || ''
  }

  const handleAddSession = async () => {
    setFormLoading(true)
    try {
      const response = await fetch('/api/admin/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to create session')

      await fetchSessions()
      setShowAddDialog(false)
      setFormData(emptyFormState)
    } catch (error) {
      console.error('Error creating session:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditSession = async () => {
    if (!currentSessionId) return

    setFormLoading(true)
    try {
      const response = await fetch('/api/admin/training', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentSessionId, ...formData }),
      })

      if (!response.ok) throw new Error('Failed to update session')

      await fetchSessions()
      setShowEditDialog(false)
      setFormData(emptyFormState)
      setCurrentSessionId(null)
    } catch (error) {
      console.error('Error updating session:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return

    try {
      const response = await fetch('/api/admin/training', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sessionToDelete.id }),
      })

      if (!response.ok) throw new Error('Failed to delete session')

      await fetchSessions()
      setSessionToDelete(null)
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }

  const openEditDialog = (session: TrainingSession) => {
    setFormData({
      day_of_week: session.day_of_week,
      start_time: session.start_time,
      end_time: session.end_time,
      location: session.location,
      team_group: session.team_group || 'Visi',
      description: session.description || '',
      is_active: session.is_active,
    })
    setCurrentSessionId(session.id)
    setShowEditDialog(true)
  }

  // Group sessions by day
  const sessionsByDay = DAYS_OF_WEEK.map(day => ({
    day: day.label,
    dayValue: day.value,
    sessions: sessions.filter(s => s.day_of_week === day.value),
  })).filter(d => d.sessions.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Treniņu grafiks</h1>
                <p className="text-teal-200 text-sm">Pārvaldiet treniņu laikus un vietas</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
            >
              <Home className="h-4 w-4" />
              Atpakaļ
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Button */}
        <div className="mb-6 flex justify-end">
          <Button
            onClick={() => {
              setFormData(emptyFormState)
              setShowAddDialog(true)
            }}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Pievienot treniņu
          </Button>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Clock className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nav treniņu</h3>
            <p className="text-gray-500 mb-4">Pievienojiet pirmo treniņu grafikā</p>
            <Button
              onClick={() => {
                setFormData(emptyFormState)
                setShowAddDialog(true)
              }}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Pievienot treniņu
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {sessionsByDay.map(({ day, sessions: daySessions }) => (
              <div key={day} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-teal-600 px-6 py-3">
                  <h2 className="text-lg font-semibold text-white">{day}</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {daySessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-6 flex items-center justify-between ${
                        !session.is_active ? 'opacity-50 bg-gray-50' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-2 text-teal-600">
                            <Clock className="h-4 w-4" />
                            <span className="font-semibold">
                              {session.start_time} - {session.end_time}
                            </span>
                          </div>
                          {session.team_group && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="h-4 w-4" />
                              <span>{session.team_group}</span>
                            </div>
                          )}
                          {!session.is_active && (
                            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                              Neaktīvs
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin className="h-4 w-4" />
                          <span>{session.location}</span>
                        </div>
                        {session.description && (
                          <p className="mt-2 text-sm text-gray-500">{session.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(session)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setSessionToDelete(session)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Pievienot treniņu</DialogTitle>
            <DialogDescription>
              Aizpildiet informāciju par jauno treniņu
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="day">Diena</Label>
              <Select
                value={String(formData.day_of_week)}
                onValueChange={(value) =>
                  setFormData({ ...formData, day_of_week: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Izvēlieties dienu" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={String(day.value)}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_time">Sākuma laiks</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, start_time: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_time">Beigu laiks</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) =>
                    setFormData({ ...formData, end_time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Vieta</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Piemēram: Valmieras sporta halle"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team_group">Grupa</Label>
              <Select
                value={formData.team_group}
                onValueChange={(value) =>
                  setFormData({ ...formData, team_group: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Izvēlieties grupu" />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_GROUPS.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Apraksts (neobligāti)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Papildu informācija par treniņu..."
                rows={2}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked as boolean })
                }
              />
              <Label htmlFor="is_active">Aktīvs (rādīt mājaslapā)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Atcelt
            </Button>
            <Button
              onClick={handleAddSession}
              disabled={formLoading || !formData.location}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {formLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Pievienot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Rediģēt treniņu</DialogTitle>
            <DialogDescription>
              Mainiet treniņa informāciju
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_day">Diena</Label>
              <Select
                value={String(formData.day_of_week)}
                onValueChange={(value) =>
                  setFormData({ ...formData, day_of_week: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Izvēlieties dienu" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={String(day.value)}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_start_time">Sākuma laiks</Label>
                <Input
                  id="edit_start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, start_time: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_end_time">Beigu laiks</Label>
                <Input
                  id="edit_end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) =>
                    setFormData({ ...formData, end_time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_location">Vieta</Label>
              <Input
                id="edit_location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_team_group">Grupa</Label>
              <Select
                value={formData.team_group}
                onValueChange={(value) =>
                  setFormData({ ...formData, team_group: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Izvēlieties grupu" />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_GROUPS.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_description">Apraksts (neobligāti)</Label>
              <Textarea
                id="edit_description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit_is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked as boolean })
                }
              />
              <Label htmlFor="edit_is_active">Aktīvs (rādīt mājaslapā)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Atcelt
            </Button>
            <Button
              onClick={handleEditSession}
              disabled={formLoading || !formData.location}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {formLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Saglabāt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!sessionToDelete}
        onOpenChange={() => setSessionToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dzēst treniņu?</AlertDialogTitle>
            <AlertDialogDescription>
              Vai tiešām vēlaties dzēst šo treniņu? Šo darbību nevar atsaukt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Atcelt</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSession}
              className="bg-red-600 hover:bg-red-700"
            >
              Dzēst
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
