'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Only count one view per browser session
    if (sessionStorage.getItem('page-view-tracked')) return
    sessionStorage.setItem('page-view-tracked', '1')

    fetch('/api/page-views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_path: pathname }),
    }).catch(() => {})
  }, [pathname])

  return null
}
