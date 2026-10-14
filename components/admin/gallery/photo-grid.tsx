'use client'

import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Star, Trash2, Check } from 'lucide-react'

export type GalleryImageRow = { id: string; image_url: string; caption: string | null; display_order: number }

function Tile({ image, isCover, selecting, selected, onToggle, onCover, onDelete, onCaption }: {
  image: GalleryImageRow; isCover: boolean; selecting: boolean; selected: boolean
  onToggle: () => void; onCover: () => void; onDelete: () => void; onCaption: (caption: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id, disabled: selecting })
  const [caption, setCaption] = useState(image.caption ?? '')
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`grid gap-1.5 ${isDragging ? 'z-10 opacity-70' : ''}`}>
      <div className="relative aspect-square overflow-hidden rounded-md bg-[#EEF2EF]">
        {/* The photo itself is the drag handle; buttons and caption stay clickable */}
        <div {...attributes} {...listeners} className={`h-full w-full touch-none ${selecting ? 'cursor-pointer' : 'cursor-grab'}`} onClick={selecting ? onToggle : undefined}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.image_url} alt={caption} className="h-full w-full object-cover" draggable={false} loading="lazy" />
        </div>
        {isCover && <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded bg-white/95 px-1.5 py-0.5 text-xs font-bold text-club"><Star className="h-3 w-3 fill-current" /> Vāks</span>}
        {selecting ? (
          <span className={`pointer-events-none absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full border-2 border-white ${selected ? 'bg-teal-700' : 'bg-black/30'}`}>{selected && <Check className="h-4 w-4 text-white" />}</span>
        ) : (
          <div className="absolute right-1.5 top-1.5 flex gap-1">
            {!isCover && <button type="button" onClick={onCover} aria-label="Padarīt par vāku" title="Padarīt par vāku" className="grid h-7 w-7 place-items-center rounded bg-white/95 text-club"><Star className="h-4 w-4" /></button>}
            <button type="button" onClick={onDelete} aria-label="Dzēst foto" title="Dzēst foto" className="grid h-7 w-7 place-items-center rounded bg-white/95 text-[#B42318]"><Trash2 className="h-4 w-4" /></button>
          </div>
        )}
      </div>
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        onBlur={() => { if (caption !== (image.caption ?? '')) onCaption(caption) }}
        placeholder="Paraksts"
        maxLength={255}
        aria-label="Foto paraksts"
        className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-sm hover:border-[#DCE3DF] focus:border-club focus:outline-none"
      />
    </li>
  )
}

export function PhotoGrid({ images, coverUrl, selecting, selected, onToggle, onReorder, onCover, onDelete, onCaption }: {
  images: GalleryImageRow[]
  coverUrl: string | null
  selecting: boolean
  selected: Set<string>
  onToggle: (id: string) => void
  onReorder: (activeId: string, overId: string) => void
  onCover: (image: GalleryImageRow) => void
  onDelete: (image: GalleryImageRow) => void
  onCaption: (image: GalleryImageRow, caption: string) => void
}) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const onDragEnd = (e: DragEndEvent) => {
    if (e.over && e.active.id !== e.over.id) onReorder(String(e.active.id), String(e.over.id))
  }
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <Tile
              key={image.id}
              image={image}
              isCover={image.image_url === coverUrl}
              selecting={selecting}
              selected={selected.has(image.id)}
              onToggle={() => onToggle(image.id)}
              onCover={() => onCover(image)}
              onDelete={() => onDelete(image)}
              onCaption={(c) => onCaption(image, c)}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
