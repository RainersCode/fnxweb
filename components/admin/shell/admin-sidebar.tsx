'use client'

import Link from 'next/link'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { ExternalLink } from 'lucide-react'
import { adminNav, isActiveNav } from './admin-nav'

export function AdminSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden lg:flex flex-col sticky top-0 h-screen bg-club-deep text-white px-3 py-5">
      <Link href="/admin" className="flex items-center gap-2.5 px-2 pb-6">
        <Image src="/Logo/fēniks_logo-removebg-preview.png" alt="" width={32} height={32} className="object-contain" />
        <span className="font-display text-lg font-bold uppercase tracking-wide">FNX Admin</span>
      </Link>
      <nav className="flex flex-col gap-1" aria-label="Admin sadaļas">
        {adminNav.map(({ href, label, icon: Icon }) => {
          const active = isActiveNav(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] font-medium transition-colors ${
                active ? 'bg-white/15 text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto border-t border-white/10 pt-4 flex flex-col gap-3 px-2">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/75 hover:text-white">
          <ExternalLink className="h-4 w-4" /> Skatīt mājaslapu
        </a>
        <UserButton afterSignOutUrl="/" showName />
      </div>
    </aside>
  )
}
