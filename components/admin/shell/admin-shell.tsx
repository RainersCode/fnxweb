'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { adminNav, isActiveNav, isEditorPath, isPreviewPath } from './admin-nav'
import { AdminSidebar } from './admin-sidebar'
import { AdminTabBar } from './admin-tab-bar'
import { QuickAddButton } from './quick-add-button'

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/admin'

  // The preview shows the article exactly like the public page, without admin chrome
  if (isPreviewPath(pathname)) return <>{children}</>

  // The editor brings its own top bar and keyboard toolbar on phones
  const editor = isEditorPath(pathname)
  const current = adminNav.find((i) => isActiveNav(pathname, i.href))

  return (
    <div className="min-h-screen bg-[#F4F6F5] text-[#141414] font-body lg:grid lg:grid-cols-[232px_1fr]">
      <AdminSidebar pathname={pathname} />
      <div className="min-w-0 flex flex-col min-h-screen">
        {!editor && (
          <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#DCE3DF] bg-white px-4">
            <span className="font-display text-xl font-bold uppercase text-club">{current?.label ?? 'Admin'}</span>
            <UserButton afterSignOutUrl="/" />
          </header>
        )}
        <main className={`flex-1 ${editor ? '' : 'pb-28 lg:pb-10'}`}>{children}</main>
      </div>
      {!editor && <AdminTabBar pathname={pathname} />}
      {!editor && <QuickAddButton />}
    </div>
  )
}
