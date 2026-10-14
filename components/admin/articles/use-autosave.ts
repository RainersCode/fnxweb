'use client'

import { useEffect, useRef, useState } from 'react'
import { retryDelay } from '@/lib/autosave'

export type AutosaveState = 'idle' | 'saving' | 'saved' | 'error'

export function useAutosave<T>({ data, enabled, save, delay = 2000 }: { data: T; enabled: boolean; save: (data: T) => Promise<void>; delay?: number }) {
  const [state, setState] = useState<AutosaveState>('idle')
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const firstRun = useRef(true)
  const attempt = useRef(0)
  const latest = useRef(data)
  const saveRef = useRef(save)
  latest.current = data
  saveRef.current = save

  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return }
    if (!enabled) return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const run = async () => {
      setState('saving')
      try {
        await saveRef.current(latest.current)
        if (cancelled) return
        attempt.current = 0
        setState('saved')
        setSavedAt(new Date())
      } catch {
        if (cancelled) return
        setState('error')
        timer = setTimeout(run, retryDelay(attempt.current++))
      }
    }

    timer = setTimeout(run, delay)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [data, enabled, delay])

  return { state, savedAt }
}
