// The chosen cover, else the first photo by display order
export function galleryCover(coverUrl: string | null | undefined, firstImageUrl: string | null | undefined): string | null {
  return coverUrl || firstImageUrl || null
}

export function moveId(ids: string[], activeId: string, overId: string): string[] {
  const from = ids.indexOf(activeId)
  const to = ids.indexOf(overId)
  if (from < 0 || to < 0 || from === to) return ids
  const next = [...ids]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}
