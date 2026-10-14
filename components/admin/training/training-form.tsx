'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { AdminFormPage } from '@/components/admin/ui/admin-form-page'
import { Field, inputClass } from '@/components/admin/ui/field'
import { apiSend } from '@/lib/admin-fetch'
import { fieldErrors, trainingSchema } from '@/lib/admin-schemas'
import { DAY_NAMES, WEEK_ORDER, formatTime } from '@/lib/training'
import type { TrainingRow } from './training-list'

const GROUPS = ['Pieaugušie', 'Juniori', 'Bērni']

export function TrainingForm({ initial }: { initial?: TrainingRow }) {
  const router = useRouter()
  const [form, setForm] = useState({
    day_of_week: initial?.day_of_week ?? 1,
    start_time: initial ? formatTime(initial.start_time) : '18:30',
    end_time: initial ? formatTime(initial.end_time) : '20:00',
    location: initial?.location ?? '',
    team_group: initial?.team_group ?? '',
    description: initial?.description ?? '',
    is_active: initial?.is_active ?? true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const set = (patch: Partial<typeof form>) => { setForm((f) => ({ ...f, ...patch })); setDirty(true) }

  const save = async () => {
    const result = trainingSchema.safeParse(form)
    if (!result.success) { setErrors(fieldErrors(result.error)); return }
    setErrors({})
    setSaving(true)
    try {
      await apiSend(initial ? `/api/admin/training/${initial.id}` : '/api/admin/training', initial ? 'PATCH' : 'POST', result.data)
      setDirty(false)
      toast.success('Saglabāts')
      router.push('/admin/training')
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
      await apiSend(`/api/admin/training/${initial.id}`, 'DELETE')
      setDirty(false)
      toast.success('Dzēsts')
      router.push('/admin/training')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Neizdevās dzēst')
    }
  }

  return (
    <AdminFormPage backHref="/admin/training" backLabel="Treniņi" title={initial ? `${DAY_NAMES[initial.day_of_week]} ${formatTime(initial.start_time)}` : 'Jauns treniņš'} saving={saving} dirty={dirty} onSave={save} onDelete={initial ? remove : undefined} deleteTitle="Dzēst šo treniņu?">
      <Field label="Diena" htmlFor="day">
        <select id="day" value={form.day_of_week} onChange={(e) => set({ day_of_week: Number(e.target.value) })} className={inputClass}>
          {WEEK_ORDER.map((d) => <option key={d} value={d}>{DAY_NAMES[d]}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-5">
        <Field label="Sākums" htmlFor="start" error={errors.start_time}>
          <input id="start" type="time" value={form.start_time} onChange={(e) => set({ start_time: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Beigas" htmlFor="end" error={errors.end_time}>
          <input id="end" type="time" value={form.end_time} onChange={(e) => set({ end_time: e.target.value })} className={inputClass} />
        </Field>
      </div>
      <Field label="Vieta" htmlFor="loc" error={errors.location}>
        <input id="loc" value={form.location} onChange={(e) => set({ location: e.target.value })} placeholder="Valmiera, Daliņi" className={inputClass} />
      </Field>
      <Field label="Grupa" htmlFor="group" error={errors.team_group}>
        <input id="group" list="groups" value={form.team_group} onChange={(e) => set({ team_group: e.target.value })} className={inputClass} />
        <datalist id="groups">{GROUPS.map((g) => <option key={g} value={g} />)}</datalist>
      </Field>
      <Field label="Piezīme" htmlFor="desc" error={errors.description}>
        <textarea id="desc" rows={3} value={form.description} onChange={(e) => set({ description: e.target.value })} className={inputClass} />
      </Field>
      <label className="flex items-center justify-between gap-3 rounded-lg border border-[#DCE3DF] p-4">
        <span><span className="block font-semibold">Aktīvs</span><span className="text-sm text-[#5B6863]">Neaktīvie netiek rādīti mājaslapā</span></span>
        <Switch checked={form.is_active} onCheckedChange={(v) => set({ is_active: v })} />
      </label>
    </AdminFormPage>
  )
}
