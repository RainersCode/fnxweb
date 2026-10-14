'use client'

import { useEffect } from 'react'

// Closing the tab or following a link with unsaved changes asks first
export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return
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
  }, [dirty])
}
