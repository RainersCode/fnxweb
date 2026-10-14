'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AdminFormPage } from '@/components/admin/ui/admin-form-page'
import { Field, inputClass } from '@/components/admin/ui/field'
import { apiSend } from '@/lib/admin-fetch'
import { fieldErrors, fixtureSchema } from '@/lib/admin-schemas'
import { fromDateTimeLocal, toDateTimeLocal } from '@/lib/articles'
import { findTeamByName, fixtureLogos, teamLogoFromFixture } from '@/lib/teams'
import { TeamPicker } from './team-picker'
import type { TeamRow } from './team-dialog'

export type FixtureRow = {
  id: string; opponent: string; match_date: string; location: string | null; score: string | null; is_home_game: boolean
  result: 'win' | 'loss' | 'draw' | null; description: string | null; home_logo_url: string | null; away_logo_url: string | null
}

const defaultDate = () => {
  const d = new Date(Date.now() + 7 * 24 * 3600 * 1000)
  d.setHours(14, 0, 0, 0)
  return toDateTimeLocal(d.toISOString())
}

export function FixtureForm({ initial, teams: initialTeams }: { initial?: FixtureRow; teams: TeamRow[] }) {
  const router = useRouter()
  const [teams, setTeams] = useState(initialTeams)
  const [team, setTeam] = useState<TeamRow | null>(() => findTeamByName(initialTeams, initial?.opponent) ?? null)
  const [form, setForm] = useState({
    is_home_game: initial?.is_home_game ?? true,
    when: initial ? toDateTimeLocal(initial.match_date) : defaultDate(),
    location: initial?.location ?? '',
    score: initial?.score ?? '',
    result: (initial?.result ?? '') as '' | 'win' | 'loss' | 'draw',
    description: initial?.description ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const set = (patch: Partial<typeof form>) => { setForm((f) => ({ ...f, ...patch })); setDirty(true) }

  const played = form.when ? new Date(form.when) < new Date() : false

  const save = async () => {
    // Without a picked team an old match keeps its stored opponent and logo
    const opponent = team?.name ?? initial?.opponent ?? ''
    const logo = team ? team.logo_url : initial ? teamLogoFromFixture(initial) : null
    const payload = {
      opponent,
      match_date: form.when ? fromDateTimeLocal(form.when) : '',
      is_home_game: form.is_home_game,
      location: form.location,
      score: played ? form.score : '',
      result: played && form.result ? form.result : null,
      description: form.description,
      ...fixtureLogos(logo, form.is_home_game),
    }
    const result = fixtureSchema.safeParse(payload)
    if (!result.success) {
      const found = fieldErrors(result.error)
      setErrors(found)
      // Logo fields have no input of their own, so say it out loud
      if (found.home_logo_url || found.away_logo_url) toast.error('Komandas logo saite nav derīga. Nomaini logo.')
      return
    }
    setErrors({})
    setSaving(true)
    try {
      await apiSend(initial ? `/api/admin/fixtures/${initial.id}` : '/api/admin/fixtures', initial ? 'PATCH' : 'POST', result.data)
      setDirty(false)
      toast.success('Saglabāts')
      router.push('/admin/fixtures')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Neizdevās saglabāt')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!initial) return
    try {
      await apiSend(`/api/admin/fixtures/${initial.id}`, 'DELETE')
      setDirty(false)
      toast.success('Dzēsts')
      router.push('/admin/fixtures')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Neizdevās dzēst')
    }
  }

  return (
    <AdminFormPage backHref="/admin/fixtures" backLabel="Spēles" title={initial ? `Fēnikss v ${initial.opponent}` : 'Jauna spēle'} saving={saving} dirty={dirty} onSave={save} onDelete={initial ? remove : undefined} deleteTitle="Dzēst šo spēli?">
      <Field label="Pretinieks" error={errors.opponent}>
        <TeamPicker teams={teams} value={team} fallbackName={initial?.opponent} onChange={(t) => { setTeam(t); setDirty(true) }} onTeamsChange={setTeams} />
      </Field>
      <div className="grid grid-cols-2 rounded-md bg-club-pale p-1" role="radiogroup" aria-label="Mājas vai izbraukumā">
        {[true, false].map((home) => (
          <button key={String(home)} type="button" role="radio" aria-checked={form.is_home_game === home} onClick={() => set({ is_home_game: home })}
            className={`rounded py-2 text-sm font-semibold ${form.is_home_game === home ? 'bg-white shadow-sm' : 'text-[#5B6863]'}`}>
            {home ? 'Mājās' : 'Izbraukumā'}
          </button>
        ))}
      </div>
      <Field label="Datums un laiks" htmlFor="when" error={errors.match_date}>
        <input id="when" type="datetime-local" value={form.when} onChange={(e) => set({ when: e.target.value })} className={inputClass} />
      </Field>
      <Field label="Vieta" htmlFor="loc" error={errors.location}>
        <input id="loc" value={form.location} onChange={(e) => set({ location: e.target.value })} placeholder="Brenguļi" className={inputClass} />
      </Field>
      {played && (
        <div className="grid gap-5 rounded-lg border border-[#DCE3DF] p-4 sm:grid-cols-2">
          <Field label="Rezultāts" htmlFor="score" error={errors.score} hint="Piemēram 24:17">
            <input id="score" value={form.score} onChange={(e) => set({ score: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Iznākums" htmlFor="result">
            <select id="result" value={form.result} onChange={(e) => set({ result: e.target.value as typeof form.result })} className={inputClass}>
              <option value="">Nav</option>
              <option value="win">Uzvara</option>
              <option value="loss">Zaudējums</option>
              <option value="draw">Neizšķirts</option>
            </select>
          </Field>
        </div>
      )}
      <Field label="Apraksts" htmlFor="desc" error={errors.description}>
        <textarea id="desc" rows={3} value={form.description} onChange={(e) => set({ description: e.target.value })} className={inputClass} />
      </Field>
    </AdminFormPage>
  )
}
