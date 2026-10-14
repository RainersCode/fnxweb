'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { AdminFormPage } from '@/components/admin/ui/admin-form-page'
import { Field, inputClass } from '@/components/admin/ui/field'
import { apiSend } from '@/lib/admin-fetch'
import { fieldErrors, galleryUpdateSchema } from '@/lib/admin-schemas'
import { applyOrder, galleryCover, moveId } from '@/lib/gallery'
import { uploadGalleryPhoto } from '@/lib/gallery-upload'
import { createLatestSaver } from '@/lib/latest-saver'
import { uploadWithProgress } from '@/lib/upload-with-progress'
import { PhotoGrid, type GalleryImageRow } from './photo-grid'
import { UploadPanel } from './upload-panel'
import { useUploadQueue } from './use-upload-queue'

export type GalleryRow = { id: string; title: string; description: string | null; cover_image_url: string | null; created_at: string }

export function GalleryEditor({ gallery, initialImages }: { gallery: GalleryRow; initialImages: GalleryImageRow[] }) {
  const router = useRouter()
  const [images, setImages] = useState(initialImages)
  const [cover, setCover] = useState(gallery.cover_image_url)
  const [meta, setMeta] = useState({ title: gallery.title, description: gallery.description ?? '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selecting, setSelecting] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const nextOrder = useRef(Math.max(0, ...initialImages.map((i) => i.display_order ?? 0)) + 1)

  const queue = useUploadQueue((file, order, onProgress, memo) =>
    uploadGalleryPhoto(memo, {
      uploadFile: async () => (await uploadWithProgress(file, `galleries/${gallery.id}`, onProgress)).url,
      addRow: async (url) => {
        const row = await apiSend<GalleryImageRow>(`/api/admin/gallery/${gallery.id}/images`, 'POST', { image_url: url, display_order: order })
        setImages((prev) => (prev.some((i) => i.id === row.id) ? prev : [...prev, row].sort((a, b) => a.display_order - b.display_order)))
      },
    })
  )
  const { total, failed, active, waiting } = queue.summary
  const uploading = active > 0 || waiting > 0
  const { clearDone } = queue

  // The finished photos are in the grid now; the queue only keeps failures
  useEffect(() => {
    if (!uploading && total > 0 && failed === 0) clearDone()
  }, [uploading, total, failed, clearDone])

  // One order save at a time; a failed save puts the grid back to the last saved order
  const savedOrder = useRef(initialImages.map((i) => i.id))
  const saveOrder = useMemo(() => createLatestSaver(async (ids: string[]) => {
    await apiSend(`/api/admin/gallery/${gallery.id}/order`, 'PUT', { ids })
    savedOrder.current = ids
  }), [gallery.id])

  const shownCover = useMemo(() => galleryCover(cover, images[0]?.image_url), [cover, images])

  const addFiles = (files: File[]) => {
    const start = nextOrder.current
    nextOrder.current += files.length
    queue.add(files, start)
  }

  const reorder = async (activeId: string, overId: string) => {
    const ids = moveId(images.map((i) => i.id), activeId, overId)
    setImages(ids.map((id, index) => ({ ...images.find((i) => i.id === id)!, display_order: index + 1 })))
    try {
      await saveOrder(ids)
    } catch (e) {
      setImages((prev) => applyOrder(prev, savedOrder.current))
      toast.error(e instanceof Error ? e.message : 'Neizdevās saglabāt secību')
    }
  }

  const setAsCover = async (image: GalleryImageRow) => {
    try {
      await apiSend(`/api/admin/gallery/${gallery.id}`, 'PATCH', { cover_image_url: image.image_url })
      setCover(image.image_url)
      toast.success('Vāks nomainīts')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Neizdevās')
    }
  }

  const deleteImages = async (targets: GalleryImageRow[]) => {
    const results = await Promise.allSettled(
      targets.map((t) => apiSend<{ cover_cleared: boolean }>(`/api/admin/gallery/${gallery.id}/images/${t.id}`, 'DELETE'))
    )
    const deleted = targets.filter((_, i) => results[i].status === 'fulfilled')
    setImages((prev) => prev.filter((i) => !deleted.some((d) => d.id === i.id)))
    if (deleted.some((d) => d.image_url === cover)) setCover(null)
    if (deleted.length < targets.length) toast.error(`Neizdevās dzēst ${targets.length - deleted.length} foto`)
    else toast.success(deleted.length === 1 ? 'Foto dzēsts' : `Dzēsti ${deleted.length} foto`)
  }

  const saveCaption = async (image: GalleryImageRow, caption: string) => {
    try {
      const row = await apiSend<GalleryImageRow>(`/api/admin/gallery/${gallery.id}/images/${image.id}`, 'PATCH', { caption })
      setImages((prev) => prev.map((i) => (i.id === row.id ? row : i)))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Neizdevās saglabāt parakstu')
    }
  }

  const saveMeta = async () => {
    const result = galleryUpdateSchema.safeParse(meta)
    if (!result.success) { setErrors(fieldErrors(result.error)); return }
    setErrors({})
    setSaving(true)
    try {
      await apiSend(`/api/admin/gallery/${gallery.id}`, 'PATCH', result.data)
      setDirty(false)
      toast.success('Saglabāts')
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Neizdevās saglabāt')
    } finally {
      setSaving(false)
    }
  }

  const removeGallery = async () => {
    try {
      await apiSend(`/api/admin/gallery/${gallery.id}`, 'DELETE')
      setDirty(false)
      toast.success('Galerija dzēsta')
      router.push('/admin/gallery')
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Neizdevās dzēst galeriju')
    }
  }

  const toggle = (id: string) => setSelected((prev) => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  return (
    <AdminFormPage backHref="/admin/gallery" backLabel="Galerijas" title={meta.title || 'Galerija'} saving={saving} dirty={dirty} uploading={uploading} onSave={saveMeta} onDelete={removeGallery} deleteTitle="Dzēst visu galeriju un tās foto?">
      <a href={`/gallery/${gallery.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 justify-self-start text-sm font-semibold text-club">
        Skatīt mājaslapā <ExternalLink className="h-4 w-4" />
      </a>
      <Field label="Nosaukums" htmlFor="title" error={errors.title}>
        <input id="title" value={meta.title} onChange={(e) => { setMeta((m) => ({ ...m, title: e.target.value })); setDirty(true) }} className={inputClass} />
      </Field>
      <Field label="Apraksts" htmlFor="desc">
        <textarea id="desc" rows={2} value={meta.description} onChange={(e) => { setMeta((m) => ({ ...m, description: e.target.value })); setDirty(true) }} className={inputClass} />
      </Field>

      <UploadPanel items={queue.items} summary={queue.summary} onFiles={addFiles} onRetry={queue.retry} previewOf={queue.previewOf} />

      <div className="flex items-center gap-3">
        <h2 className="font-semibold">Foto ({images.length})</h2>
        <span className="flex-1" />
        {selecting && selected.size > 0 && (
          <button type="button" onClick={() => { if (window.confirm(`Dzēst ${selected.size} foto?`)) { deleteImages(images.filter((i) => selected.has(i.id))); setSelected(new Set()); setSelecting(false) } }} className="rounded-md bg-[#B42318] px-3 py-1.5 text-sm font-semibold text-white">
            Dzēst ({selected.size})
          </button>
        )}
        {images.length > 0 && (
          <button type="button" onClick={() => { setSelecting((s) => !s); setSelected(new Set()) }} className="rounded-md border border-[#DCE3DF] px-3 py-1.5 text-sm font-semibold">
            {selecting ? 'Atcelt' : 'Izvēlēties'}
          </button>
        )}
      </div>
      {images.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[#DCE3DF] p-6 text-center text-[#5B6863]">Galerijā vēl nav foto.</p>
      ) : (
        <PhotoGrid
          images={images}
          coverUrl={shownCover}
          selecting={selecting}
          selected={selected}
          onToggle={toggle}
          onReorder={reorder}
          onCover={setAsCover}
          onDelete={(image) => { if (window.confirm('Dzēst šo foto?')) deleteImages([image]) }}
          onCaption={saveCaption}
        />
      )}
    </AdminFormPage>
  )
}
