'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MoreHorizontal, ExternalLink } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { adminNav, isActiveNav } from './admin-nav'

export function AdminTabBar({ pathname }: { pathname: string }) {
  const [moreOpen, setMoreOpen] = useState(false)
  const tabs = adminNav.filter((i) => i.inTabBar)
  const more = adminNav.filter((i) => !i.inTabBar)
  const moreActive = more.some((i) => isActiveNav(pathname, i.href))

  const tabClass = (active: boolean) =>
    `flex flex-col items-center gap-1 py-2 text-[11px] font-semibold ${active ? 'text-club' : 'text-[#5B6863]'}`

  return (
    <nav
      aria-label="Admin sadaļas"
      className="lg:hidden fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-[#DCE3DF] bg-white pb-[env(safe-area-inset-bottom,0px)]"
    >
      {tabs.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={tabClass(isActiveNav(pathname, href))}>
          <Icon className="h-5 w-5" />
          {label}
        </Link>
      ))}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetTrigger className={tabClass(moreActive)}>
          <MoreHorizontal className="h-5 w-5" />
          Vairāk
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Vairāk</SheetTitle>
          </SheetHeader>
          <div className="mt-3 grid gap-1">
            {more.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-3 font-medium hover:bg-club-pale"
              >
                <Icon className="h-5 w-5 text-club" /> {label}
              </Link>
            ))}
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-md px-3 py-3 font-medium hover:bg-club-pale">
              <ExternalLink className="h-5 w-5 text-club" /> Skatīt mājaslapu
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}
