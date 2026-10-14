import { Home, Newspaper, Images, CalendarDays, Users, UserCog, Clock, type LucideIcon } from 'lucide-react'

export type AdminNavItem = { href: string; label: string; icon: LucideIcon; inTabBar?: boolean }

export const adminNav: AdminNavItem[] = [
  { href: '/admin', label: 'Sākums', icon: Home, inTabBar: true },
  { href: '/admin/articles', label: 'Ziņas', icon: Newspaper, inTabBar: true },
  { href: '/admin/gallery', label: 'Galerijas', icon: Images, inTabBar: true },
  { href: '/admin/fixtures', label: 'Spēles', icon: CalendarDays },
  { href: '/admin/players', label: 'Spēlētāji', icon: Users },
  { href: '/admin/coaches', label: 'Treneri', icon: UserCog },
  { href: '/admin/training', label: 'Treniņi', icon: Clock },
]

export function isActiveNav(pathname: string, href: string): boolean {
  return href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(`${href}/`)
}

// Full-page editors bring their own top bar: articles, and the new/edit forms of every section
export function isEditorPath(pathname: string): boolean {
  return /^\/admin\/(articles|players|coaches|training|fixtures|gallery)\/[^/]+$/.test(pathname)
}

export function isPreviewPath(pathname: string): boolean {
  return pathname.endsWith('/preview')
}
