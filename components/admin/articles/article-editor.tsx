'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, Settings2 } from 'lucide-react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  type AdminArticle, articleState, formatRigaDateTime, fromDateTimeLocal, toDateTimeLocal, validateForPublish,
} from '@/lib/articles'
import { shouldOfferRestore, type LocalBackup } from '@/lib/autosave'
import { ArticleStatusPill } from './article-status-pill'
import { CoverPhotoField } from './cover-photo-field'
import { ArticleSettings, type FixtureOption, type GalleryOption } from './article-settings'
import { BodyEditor } from './editor/body-editor'
import { hasPendingUploads } from './editor/upload-store'
import { useAutosave } from './use-autosave'

export type EditorFields = {
  title: string; content: string; image_url: string | null; excerpt: string; author: string
  is_featured: boolean; fixture_id: string | null; gallery_id: string | null
}

const fieldsFrom = (a: AdminArticle): EditorFields => ({
  title: a.title ?? '', content: a.content ?? '', image_url: a.image_url, excerpt: a.excerpt ?? '',
  author: a.author ?? '', is_featured: a.is_featured ?? false, fixture_id: a.fixture_id, gallery_id: a.gallery_id,
})

const defaultSchedule = () => {
  const d = new Date(Date.now() + 60 * 60 * 1000)
  d.setMinutes(0, 0, 0)
  return toDateTimeLocal(d.toISOString())
}

async function sendAction(id: string, body: unknown): Promise<AdminArticle> {
  const res = await fetch(`/api/admin/articles/${id}`, {
    method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Neizdevās saglabāt')
  return data as AdminArticle
}

export function ArticleEditor({ article, fixtures, galleries }: { article: AdminArticle; fixtures: FixtureOption[]; galleries: GalleryOption[] }) {
  const router = useRouter()
  const backupKey = `fnx-article-${article.id}`
  const [fields, setFields] = useState<EditorFields>(() => fieldsFrom(article))
  const [status, setStatus] = useState(article.status)
  const [publishedAt, setPublishedAt] = useState(article.published_at)
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule'>(
    articleState(article) === 'scheduled' ? 'schedule' : 'now'
  )
  const [scheduleAt, setScheduleAt] = useState(() =>
    article.status === 'published' ? toDateTimeLocal(article.published_at) : defaultSchedule()
  )
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [restore, setRestore] = useState<LocalBackup<EditorFields> | null>(null)
  const [editorKey, setEditorKey] = useState(0)
  const isDraft = status === 'draft'
  const titleRef = useRef<HTMLTextAreaElement>(null)

  // Grow the title box with its text, including long titles loaded from the database
  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [fields.title])

  // Offer a newer copy left on this device (e.g. connection dropped before autosave)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(backupKey)
      const backup = raw ? (JSON.parse(raw) as LocalBackup<EditorFields>) : null
      if (shouldOfferRestore(backup, article.updated_at, fieldsFrom(article))) setRestore(backup)
    } catch { /* storage unavailable */ }
  }, [article, backupKey])

  const update = useCallback((patch: Partial<EditorFields>) => {
    setFields((prev) => {
      const next = { ...prev, ...patch }
      try { localStorage.setItem(backupKey, JSON.stringify({ fields: next, at: Date.now() })) } catch { /* ignore */ }
      return next
    })
    setDirty(true)
  }, [backupKey])

  const payload = useMemo(() => ({
    title: fields.title, content: fields.content, image_url: fields.image_url, excerpt: fields.excerpt,
    author: fields.author, is_featured: fields.is_featured, fixture_id: fields.fixture_id, gallery_id: fields.gallery_id,
  }), [fields])

  // Latest values for callbacks that outlive a render (save completions, page hide, unmount)
  const payloadRef = useRef(payload)
  const dirtyRef = useRef(dirty)
  const isDraftRef = useRef(isDraft)
  payloadRef.current = payload
  dirtyRef.current = dirty
  isDraftRef.current = isDraft

  const autosave = useAutosave({
    data: payload,
    enabled: isDraft,
    save: async (data) => {
      await sendAction(article.id, { action: 'save', fields: data })
      // An older save finishing late must not clear newer, still-unsaved edits or their device copy
      if (data !== payloadRef.current) return
      setDirty(false)
      try { localStorage.removeItem(backupKey) } catch { /* ignore */ }
    },
  })

  // Leaving a draft within the autosave delay: send the pending edits on the way out
  useEffect(() => {
    const flush = () => {
      if (!isDraftRef.current || !dirtyRef.current) return
      fetch(`/api/admin/articles/${article.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'save', fields: payloadRef.current }),
        keepalive: true,
      }).catch(() => { /* the device copy remains for the restore banner */ })
    }
    window.addEventListener('pagehide', flush)
    return () => {
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [article.id])

  // Unsaved edits to a live article must not be lost silently: closing the tab or following a link
  useEffect(() => {
    if (isDraft || !dirty) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    const guardLinks = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest('a[href]') as HTMLAnchorElement | null
      if (!link || link.target === '_blank') return
      if (!window.confirm('Ir nesaglabātas izmaiņas. Iziet bez saglabāšanas?')) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    window.addEventListener('beforeunload', warn)
    document.addEventListener('click', guardLinks, true)
    return () => {
      window.removeEventListener('beforeunload', warn)
      document.removeEventListener('click', guardLinks, true)
    }
  }, [isDraft, dirty])

  // Drafts: save first so the preview shows the latest text. Live articles with unsaved
  // changes can't be previewed, because the preview reads what is stored.
  const openPreview = async () => {
    const url = `/admin/articles/${article.id}/preview`
    if (!isDraft) {
      window.open(url, '_blank')
      return
    }
    const tab = window.open('', '_blank')
    try {
      if (dirty) await sendAction(article.id, { action: 'save', fields: payload })
      if (tab) tab.location.href = url
      else window.location.href = url
    } catch (error) {
      tab?.close()
      toast.error(error instanceof Error ? error.message : 'Neizdevās saglabāt')
    }
  }

  const publish = async () => {
    if (hasPendingUploads()) return toast.error('Pagaidi, kamēr foto augšupielādējas')
    const problem = validateForPublish(fields)
    if (problem) return toast.error(problem)
    if (!fields.image_url) toast.warning('Ziņai nav vāka foto — kartītē būs rezerves attēls')
    const scheduled = !isDraft || scheduleMode === 'schedule'
    setBusy(true)
    try {
      const saved = await sendAction(article.id, {
        action: 'publish',
        fields: { ...payload, ...(scheduled ? { published_at: fromDateTimeLocal(scheduleAt) } : {}) },
      })
      setStatus(saved.status)
      setPublishedAt(saved.published_at)
      setScheduleAt(toDateTimeLocal(saved.published_at))
      setDirty(false)
      try { localStorage.removeItem(backupKey) } catch { /* ignore */ }
      if (articleState(saved) === 'scheduled') toast.success(`Ieplānots uz ${formatRigaDateTime(saved.published_at)}`)
      else toast.success(isDraft ? 'Publicēts' : 'Atjaunināts', {
        action: { label: 'Skatīt mājaslapā', onClick: () => window.open(`/news/${article.id}`, '_blank') },
      })
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Neizdevās publicēt')
    } finally {
      setBusy(false)
    }
  }

  const unpublish = async () => {
    setBusy(true)
    try {
      const saved = await sendAction(article.id, { action: 'unpublish' })
      setStatus(saved.status)
      setScheduleMode('now')
      toast.success('Ziņa tagad ir melnraksts')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Neizdevās')
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    setBusy(true)
    const res = await fetch(`/api/admin/articles/${article.id}`, { method: 'DELETE' })
    if (!res.ok) {
      setBusy(false)
      return toast.error('Neizdevās dzēst ziņu')
    }
    try { localStorage.removeItem(backupKey) } catch { /* ignore */ }
    toast.success('Ziņa dzēsta')
    router.push('/admin/articles')
    router.refresh()
  }

  const primaryLabel = isDraft ? (scheduleMode === 'schedule' ? 'Ieplānot' : 'Publicēt') : 'Atjaunināt'
  const saveLabel = !isDraft
    ? (dirty ? 'Nesaglabātas izmaiņas' : 'Viss saglabāts')
    : autosave.state === 'saving' ? 'Saglabā…'
    : autosave.state === 'error' ? 'Neizdevās saglabāt — mēģina vēlreiz'
    : autosave.savedAt ? `✓ Saglabāts ${autosave.savedAt.toLocaleTimeString('lv-LV', { hour: '2-digit', minute: '2-digit' })}`
    : ''

  const settings = (
    <ArticleSettings
      fields={fields}
      onChange={update}
      isDraft={isDraft}
      scheduleMode={scheduleMode}
      onScheduleModeChange={setScheduleMode}
      scheduleAt={scheduleAt}
      onScheduleAtChange={(v) => { setScheduleAt(v); setDirty(true) }}
      fixtures={fixtures}
      galleries={galleries}
      onUnpublish={unpublish}
      onDelete={remove}
    />
  )

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-[#DCE3DF] bg-white px-3 lg:px-5">
        <Link href="/admin/articles" aria-label="Atpakaļ uz ziņām" className="flex items-center gap-1 font-semibold text-[#5B6863] hover:text-[#141414]">
          <ArrowLeft className="h-5 w-5" /><span className="hidden sm:inline">Ziņas</span>
        </Link>
        <span className="hidden sm:inline-flex"><ArticleStatusPill status={status} publishedAt={publishedAt} /></span>
        <span className={`truncate text-xs font-semibold ${autosave.state === 'error' ? 'text-[#B42318]' : 'text-[#146C43]'}`}>{saveLabel}</span>
        <span className="flex-1" />
        <button
          type="button"
          onClick={openPreview}
          disabled={!isDraft && dirty}
          title={!isDraft && dirty ? 'Lai priekšskatītu izmaiņas, vispirms nospied "Atjaunināt"' : undefined}
          className="flex items-center gap-1.5 rounded-md border border-[#DCE3DF] px-3 py-1.5 text-sm font-semibold disabled:opacity-50"
        >
          <Eye className="h-4 w-4" /><span className="hidden sm:inline">Priekšskatīt</span>
        </button>
        <Sheet>
          <SheetTrigger className="flex items-center gap-1.5 rounded-md border border-[#DCE3DF] px-3 py-1.5 text-sm font-semibold lg:hidden">
            <Settings2 className="h-4 w-4" /><span className="sr-only sm:not-sr-only">Iestatījumi</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-sm">
            <SheetHeader><SheetTitle>Iestatījumi</SheetTitle></SheetHeader>
            <div className="mt-4">{settings}</div>
          </SheetContent>
        </Sheet>
        <button type="button" onClick={publish} disabled={busy} className="rounded-md bg-teal-700 px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-600 disabled:opacity-60">
          {busy ? '…' : primaryLabel}
        </button>
      </header>

      {restore && (
        <div className="flex flex-wrap items-center gap-3 border-b border-[#F0C828] bg-[#FFF8E1] px-4 py-2.5 text-sm">
          <span>Šajā ierīcē ir jaunākas, nesaglabātas izmaiņas.</span>
          <button type="button" className="font-semibold text-club" onClick={() => { setFields(restore.fields); setDirty(true); setEditorKey((k) => k + 1); setRestore(null) }}>
            Atjaunot nesaglabātās izmaiņas
          </button>
          <button type="button" className="text-[#5B6863]" onClick={() => { try { localStorage.removeItem(backupKey) } catch { /* ignore */ } setRestore(null) }}>
            Atmest
          </button>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[1fr_320px]">
        <div className="mx-auto grid w-full max-w-3xl gap-5 px-4 pb-32 pt-5 lg:px-10 lg:pb-16">
          <CoverPhotoField articleId={article.id} value={fields.image_url} onChange={(url) => update({ image_url: url })} />
          <textarea
            value={fields.title}
            ref={titleRef}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Virsraksts"
            rows={1}
            aria-label="Virsraksts"
            className="w-full resize-none overflow-hidden border-0 bg-transparent p-0 font-display text-3xl font-bold uppercase leading-tight placeholder:text-[#B8C2BE] focus:outline-none lg:text-4xl"
          />
          <BodyEditor key={editorKey} articleId={article.id} content={fields.content} onChange={(html) => update({ content: html })} />
        </div>
        <aside className="hidden border-l border-[#DCE3DF] bg-[#FAFBFA] p-5 lg:block">
          <div className="sticky top-[72px]">{settings}</div>
        </aside>
      </div>
    </div>
  )
}
