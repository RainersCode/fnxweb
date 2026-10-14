'use client'

import { formatRigaDate } from '@/lib/articles'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { EditorFields } from './article-editor'

export type FixtureOption = { id: string; opponent: string; match_date: string; is_home_game: boolean }
export type GalleryOption = { id: string; title: string }

type Props = {
  fields: EditorFields
  onChange: (patch: Partial<EditorFields>) => void
  isDraft: boolean
  scheduleMode: 'now' | 'schedule'
  onScheduleModeChange: (mode: 'now' | 'schedule') => void
  scheduleAt: string
  onScheduleAtChange: (value: string) => void
  fixtures: FixtureOption[]
  galleries: GalleryOption[]
  onUnpublish: () => void
  onDelete: () => void
}

const label = 'text-xs font-bold uppercase tracking-wide text-[#5B6863]'
const control = 'w-full rounded-md border border-[#DCE3DF] bg-white px-3 py-2 text-[15px]'

const fixtureLabel = (f: FixtureOption) =>
  `${f.is_home_game ? `Fēnikss v ${f.opponent}` : `${f.opponent} v Fēnikss`} · ${formatRigaDate(f.match_date)}`

export function ArticleSettings(p: Props) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <span className={label}>Publicēšana</span>
        {p.isDraft && (
          <div className="grid grid-cols-2 rounded-md bg-club-pale p-1" role="radiogroup">
            {(['now', 'schedule'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={p.scheduleMode === mode}
                onClick={() => p.onScheduleModeChange(mode)}
                className={`rounded py-1.5 text-sm font-semibold ${p.scheduleMode === mode ? 'bg-white shadow-sm' : 'text-[#5B6863]'}`}
              >
                {mode === 'now' ? 'Tagad' : 'Ieplānot'}
              </button>
            ))}
          </div>
        )}
        {(!p.isDraft || p.scheduleMode === 'schedule') && (
          <input
            type="datetime-local"
            aria-label="Publicēšanas laiks"
            value={p.scheduleAt}
            onChange={(e) => p.onScheduleAtChange(e.target.value)}
            className={control}
          />
        )}
      </div>

      <label className="grid gap-2">
        <span className={label}>Īss apraksts</span>
        <textarea
          rows={3}
          maxLength={160}
          value={p.fields.excerpt}
          onChange={(e) => p.onChange({ excerpt: e.target.value })}
          placeholder="Ja atstāsi tukšu, izmantos pirmo teikumu"
          className={control}
        />
        <span className="text-xs text-[#5B6863]">Redzams ziņu kartītēs un Google. {p.fields.excerpt.length} / 160</span>
      </label>

      <label className="grid gap-2">
        <span className={label}>Saistītā spēle</span>
        <select value={p.fields.fixture_id ?? ''} onChange={(e) => p.onChange({ fixture_id: e.target.value || null })} className={control}>
          <option value="">Nav</option>
          {p.fixtures.map((f) => <option key={f.id} value={f.id}>{fixtureLabel(f)}</option>)}
        </select>
      </label>

      <label className="grid gap-2">
        <span className={label}>Saistītā galerija</span>
        <select value={p.fields.gallery_id ?? ''} onChange={(e) => p.onChange({ gallery_id: e.target.value || null })} className={control}>
          <option value="">Nav</option>
          {p.galleries.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
        </select>
      </label>

      <label className="grid gap-2">
        <span className={label}>Autors</span>
        <input value={p.fields.author} onChange={(e) => p.onChange({ author: e.target.value })} maxLength={100} className={control} />
      </label>

      <label className="flex items-center justify-between gap-3">
        <span className="font-medium">Izcelt sākumlapā</span>
        <Switch checked={p.fields.is_featured} onCheckedChange={(v) => p.onChange({ is_featured: v })} />
      </label>

      <div className="grid gap-2 border-t border-[#DCE3DF] pt-4">
        {!p.isDraft && (
          <button type="button" onClick={p.onUnpublish} className="justify-self-start text-sm font-semibold text-[#5B6863] hover:text-[#141414]">
            Pārvērst par melnrakstu
          </button>
        )}
        <AlertDialog>
          <AlertDialogTrigger className="justify-self-start text-sm font-semibold text-[#B42318]">Dzēst ziņu</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Dzēst šo ziņu?</AlertDialogTitle>
              <AlertDialogDescription>Ziņa un tās foto tiks neatgriezeniski dzēsti.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Atcelt</AlertDialogCancel>
              <AlertDialogAction onClick={p.onDelete} className="bg-[#B42318] hover:bg-[#912018]">Dzēst</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
