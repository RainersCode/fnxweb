export type QueueStatus = 'waiting' | 'uploading' | 'done' | 'failed'
export type QueueItem = { id: string; name: string; status: QueueStatus; progress: number; error?: string; order: number }

const collator = new Intl.Collator('lv', { numeric: true, sensitivity: 'base' })

// Shooting order: DSC_9 before DSC_10
export function naturalSortByName<T extends { name: string }>(files: T[]): T[] {
  return [...files].sort((a, b) => collator.compare(a.name, b.name))
}

export function pickNextToStart(items: QueueItem[], limit = 3): string[] {
  const active = items.filter((i) => i.status === 'uploading').length
  const free = Math.max(0, limit - active)
  return items
    .filter((i) => i.status === 'waiting')
    .sort((a, b) => a.order - b.order)
    .slice(0, free)
    .map((i) => i.id)
}

export function queueSummary(items: QueueItem[]) {
  return {
    total: items.length,
    done: items.filter((i) => i.status === 'done').length,
    failed: items.filter((i) => i.status === 'failed').length,
    active: items.filter((i) => i.status === 'uploading').length,
    waiting: items.filter((i) => i.status === 'waiting').length,
  }
}

export function retryFailed(items: QueueItem[], ids?: string[]): QueueItem[] {
  return items.map((i) =>
    i.status === 'failed' && (!ids || ids.includes(i.id)) ? { ...i, status: 'waiting', progress: 0, error: undefined } : i
  )
}
