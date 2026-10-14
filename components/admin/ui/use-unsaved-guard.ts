'use client'

import { useEffect } from 'react'

// Closing the tab or following a link asks first whenever there is something to lose
export function useUnsavedGuard(message: string | null) {
  useEffect(() => {
    if (!message) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    const guardLinks = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest('a[href]') as HTMLAnchorElement | null
      if (!link || link.target === '_blank') return
      if (!window.confirm(message)) {
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
  }, [message])
}
