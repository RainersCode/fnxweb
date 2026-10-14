'use client'

import { useSyncExternalStore } from 'react'

// Upload progress by upload id, shared between the editor and figure node views
const progress = new Map<string, number>()
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export function setUploadProgress(id: string, percent: number) {
  progress.set(id, percent)
  emit()
}

export function clearUploadProgress(id: string) {
  progress.delete(id)
  emit()
}

export function hasPendingUploads(): boolean {
  return progress.size > 0
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useUploadProgress(id: string | null): number {
  return useSyncExternalStore(subscribe, () => (id ? progress.get(id) ?? 0 : 0), () => 0)
}
