'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, inputClass } from '@/components/admin/ui/field'
import { PhotoField } from '@/components/admin/ui/photo-field'
import { apiSend } from '@/lib/admin-fetch'
import { fieldErrors, teamSchema } from '@/lib/admin-schemas'

export type TeamRow = { id: string; name: string; logo_url: string | null }

export function TeamDialog({ open, onOpenChange, team, initialName, onSaved }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  team?: TeamRow | null
  initialName?: string
  onSaved: (team: TeamRow) => void
}) {
  const [name, setName] = useState('')
  const [logo, setLogo] = useState<string | null>(null)
  const [error, setError] = useState<string | undefined>()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setName(team?.name ?? initialName ?? '')
    setLogo(team?.logo_url ?? null)
    setError(undefined)
  }, [open, team, initialName])

  const save = async () => {
    const result = teamSchema.safeParse({ name, logo_url: logo })
    if (!result.success) { setError(fieldErrors(result.error).name); return }
    setSaving(true)
    try {
      const saved = await apiSend<TeamRow>(team ? `/api/admin/teams/${team.id}` : '/api/admin/teams', team ? 'PATCH' : 'POST', result.data)
      onSaved(saved)
      onOpenChange(false)
      toast.success(team ? 'Komanda saglabāta' : 'Komanda pievienota')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Neizdevās saglabāt')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>{team ? 'Labot komandu' : 'Jauna komanda'}</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <Field label="Nosaukums" htmlFor="team-name" error={error}>
            <input id="team-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoFocus />
          </Field>
          <Field label="Logo">
            <PhotoField value={logo} folder="teams" aspect="square" onChange={setLogo} label="Logo" />
          </Field>
          <button type="button" onClick={save} disabled={saving} className="justify-self-end rounded-md bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-600 disabled:opacity-60">
            {saving ? 'Saglabā…' : 'Saglabāt'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
