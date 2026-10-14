'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { AdminFormPage } from '@/components/admin/ui/admin-form-page'
import { Field, inputClass } from '@/components/admin/ui/field'
import { PhotoField } from '@/components/admin/ui/photo-field'
import { apiSend } from '@/lib/admin-fetch'
import { coachSchema, fieldErrors, playerSchema } from '@/lib/admin-schemas'
import { POSITION_NAMES } from '@/lib/rugby-positions'
import type { PersonKind, PersonRow } from './people-list'


const copy = {
  player: { api: '/api/admin/players', base: '/admin/players', back: 'Spēlētāji', newTitle: 'Jauns spēlētājs', del: 'Dzēst šo spēlētāju?', folder: 'players' },
  coach: { api: '/api/admin/coaches', base: '/admin/coaches', back: 'Treneri', newTitle: 'Jauns treneris', del: 'Dzēst šo treneri?', folder: 'coaches' },
}

type Form = { name: string; image_url: string | null; is_active: boolean; bio: string; jersey_number: string; position: string; role: string }

const fromRow = (r?: PersonRow & { bio?: string | null }): Form => ({
  name: r?.name ?? '', image_url: r?.image_url ?? null, is_active: r?.is_active ?? true, bio: r?.bio ?? '',
  jersey_number: r?.jersey_number != null ? String(r.jersey_number) : '', position: r?.position ?? '', role: r?.role ?? '',
})

export function PersonForm({ kind, initial }: { kind: PersonKind; initial?: PersonRow & { bio?: string | null } }) {
  const router = useRouter()
  const c = copy[kind]
  const [form, setForm] = useState<Form>(() => fromRow(initial))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  const set = (patch: Partial<Form>) => { setForm((f) => ({ ...f, ...patch })); setDirty(true) }

  const save = async () => {
    const payload = kind === 'player'
      ? { name: form.name, image_url: form.image_url, is_active: form.is_active, bio: form.bio, position: form.position, jersey_number: form.jersey_number === '' ? null : Number(form.jersey_number) }
      : { name: form.name, image_url: form.image_url, is_active: form.is_active, bio: form.bio, role: form.role }
    const result = (kind === 'player' ? playerSchema : coachSchema).safeParse(payload)
    if (!result.success) { setErrors(fieldErrors(result.error)); return }
    setErrors({})
    setSaving(true)
    try {
      await apiSend(initial ? `${c.api}/${initial.id}` : c.api, initial ? 'PATCH' : 'POST', result.data)
      setDirty(false)
      toast.success('Saglabāts')
      router.push(c.base)
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
      await apiSend(`${c.api}/${initial.id}`, 'DELETE')
      setDirty(false)
      toast.success('Dzēsts')
      router.push(c.base)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Neizdevās dzēst')
    }
  }

  return (
    <AdminFormPage backHref={c.base} backLabel={c.back} title={initial ? initial.name : c.newTitle} saving={saving} dirty={dirty} onSave={save} onDelete={initial ? remove : undefined} deleteTitle={c.del}>
      <PhotoField value={form.image_url} folder={c.folder} aspect="portrait" onChange={(url) => set({ image_url: url })} />
      <Field label="Vārds, uzvārds" htmlFor="name" error={errors.name}>
        <input id="name" value={form.name} onChange={(e) => set({ name: e.target.value })} className={inputClass} />
      </Field>
      {kind === 'player' ? (
        <div className="grid gap-5 sm:grid-cols-[120px_1fr]">
          <Field label="Numurs" htmlFor="num" error={errors.jersey_number}>
            <input id="num" inputMode="numeric" value={form.jersey_number} onChange={(e) => set({ jersey_number: e.target.value.replace(/\D/g, '').slice(0, 2) })} className={inputClass} />
          </Field>
          <Field label="Pozīcija" htmlFor="pos" error={errors.position}>
            <input id="pos" list="positions" value={form.position} onChange={(e) => set({ position: e.target.value })} className={inputClass} />
            <datalist id="positions">{POSITION_NAMES.map((p) => <option key={p} value={p} />)}</datalist>
          </Field>
        </div>
      ) : (
        <Field label="Loma" htmlFor="role" error={errors.role}>
          <input id="role" value={form.role} onChange={(e) => set({ role: e.target.value })} placeholder="Galvenais treneris" className={inputClass} />
        </Field>
      )}
      <Field label="Par sevi" htmlFor="bio" error={errors.bio}>
        <textarea id="bio" rows={5} value={form.bio} onChange={(e) => set({ bio: e.target.value })} className={inputClass} />
      </Field>
      <label className="flex items-center justify-between gap-3 rounded-lg border border-[#DCE3DF] p-4">
        <span><span className="block font-semibold">Aktīvs</span><span className="text-sm text-[#5B6863]">Neaktīvie netiek rādīti mājaslapā</span></span>
        <Switch checked={form.is_active} onCheckedChange={(v) => set({ is_active: v })} />
      </label>
    </AdminFormPage>
  )
}
