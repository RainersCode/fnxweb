'use client'

import { useState, type ReactNode, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight, ChevronUp, Settings } from 'lucide-react'
import Image from 'next/image'
import { SignInButton, SignUpButton, UserButton, useAuth, useUser } from '@clerk/nextjs'
import { isAdmin } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { PageViewTracker } from '@/components/features/page-view-tracker'

interface MainLayoutProps {
  children: ReactNode
  currentPage?: string
}

export function MainLayout({ children, currentPage: propCurrentPage }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const lastScrollY = useRef(0)
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const userEmail = user?.emailAddresses[0]?.emailAddress
  const isAdminUser = isAdmin(userEmail)
  const pathname = usePathname()

  const getActivePageKey = (path: string): string => {
    if (path === '/') return 'HOME'
    if (path === '/about') return 'ABOUT'
    if (path === '/team') return 'TEAM'
    if (path === '/fixtures') return 'FIXTURES'
    if (path === '/news') return 'NEWS'
    if (path === '/gallery') return 'GALLERY'
    if (path === '/noteikumi') return 'NOTEIKUMI'
    if (path === '/contact') return 'CONTACT'
    if (path === '/privacy-policy') return 'PRIVACY_POLICY'
    if (path === '/cookies-policy') return 'COOKIES_POLICY'
    return ''
  }

  const currentPage = propCurrentPage || getActivePageKey(pathname)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 10)
      setShowScrollTop(currentScrollY > 400)
      if (currentScrollY > 100) {
        setIsHeaderHidden(currentScrollY > lastScrollY.current)
      } else {
        setIsHeaderHidden(false)
      }
      lastScrollY.current = currentScrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const baseNavItems = [
    { key: 'HOME', text: 'Sākums' },
    { key: 'NEWS', text: 'Ziņas' },
    { key: 'FIXTURES', text: 'Spēles' },
    { key: 'TEAM', text: 'Komanda' },
    { key: 'GALLERY', text: 'Galerija' },
    { key: 'ABOUT', text: 'Klubs' },
    { key: 'NOTEIKUMI', text: 'Noteikumi' },
    { key: 'CONTACT', text: 'Kontakti' },
  ]

  const navItems = isAdminUser
    ? [...baseNavItems, { key: 'ADMIN', text: 'Admin', isAdmin: true }]
    : baseNavItems

  return (
    <div className="flex min-h-screen flex-col bg-white font-body text-[#111]">
      {/* Top bar */}
      <div className="h-8 bg-[#111] flex items-center justify-end px-4 sm:px-8 md:px-16 gap-5">
        <Link href="/contact" className="font-body text-[11px] font-medium text-white/50 tracking-wider uppercase hover:text-white transition-colors">
          Kontakti
        </Link>
        <div className="w-px h-3 bg-white/15" />
        <Link href="/about" className="font-body text-[11px] font-medium text-white/50 tracking-wider uppercase hover:text-white transition-colors">
          Par mums
        </Link>
        {isSignedIn && isAdminUser && (
          <>
            <div className="w-px h-3 bg-white/15" />
            <Link href="/admin" className="font-body text-[11px] font-medium text-amber-400/70 tracking-wider uppercase hover:text-amber-300 transition-colors">
              Admin
            </Link>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? 'shadow-[0_2px_24px_rgba(0,0,0,0.1)]' : ''
        } ${isHeaderHidden ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="flex items-center h-[76px] px-4 sm:px-8 md:px-16 max-w-[1600px] mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3.5 mr-12 relative z-10 group">
            <Image
              src="/Logo/fēniks_logo-removebg-preview.png"
              alt="RK Fēnikss Logo"
              width={50}
              height={50}
              className="object-contain transition-transform duration-300 group-hover:scale-[1.06]"
            />
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center list-none flex-1">
            {navItems.map((item) => (
              <li key={item.key}>
                {item.key === 'ADMIN' ? (
                  <Link
                    href="/admin"
                    className="flex items-center h-[76px] px-[18px] font-cond text-sm font-bold tracking-[2.5px] uppercase text-amber-600 hover:text-amber-800 relative transition-colors duration-200"
                  >
                    <Settings className="h-4 w-4 mr-1.5" />
                    {item.text}
                  </Link>
                ) : (
                  <Link
                    href={item.key === 'HOME' ? '/' : `/${item.key.toLowerCase()}`}
                    className={`flex items-center h-[76px] px-[18px] font-cond text-[14px] font-bold tracking-[2.5px] uppercase relative transition-colors duration-250 ${
                      currentPage === item.key ? 'text-teal-700' : 'text-[#111] hover:text-teal-700'
                    }`}
                  >
                    {item.text}
                    {/* Bottom underline indicator */}
                    <span
                      className={`absolute bottom-0 left-[18px] right-[18px] h-[3px] bg-teal-700 transition-transform duration-300 origin-left ${
                        currentPage === item.key ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-1.5 ml-auto">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link
                href="/contact"
                className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 bg-teal-700 text-white font-cond text-xs font-bold tracking-[2px] uppercase hover:bg-[#111] transition-colors duration-200 ml-1.5"
              >
                Pievienojies
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            )}

            {/* Hamburger */}
            <button
              className="w-10 h-10 rounded-full hover:bg-[#f5f5f5] flex flex-col justify-center items-center gap-[5px] p-1 lg:hidden transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Atvērt izvēlni"
            >
              <span className="h-0.5 w-5 bg-[#111] block" />
              <span className="h-0.5 w-5 bg-[#111] block" />
              <span className="h-0.5 w-5 bg-[#111] block" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full px-6 py-4 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
              <Image
                src="/Logo/fēniks_logo-removebg-preview.png"
                alt="RK Fēnikss Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="font-display text-lg font-bold uppercase tracking-wider">RK &quot;Fēnikss&quot;</span>
            </Link>
            <button
              className="w-10 h-10 rounded-full hover:bg-[#f5f5f5] grid place-items-center transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Aizvērt izvēlni"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="mt-8 flex-1">
            <ul className="space-y-0">
              {navItems.map((item, index) => (
                <li
                  key={item.key}
                  className="menu-item-animate border-b border-[#f0f0f0]"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {item.key === 'ADMIN' ? (
                    <Link
                      href="/admin"
                      className="flex items-center py-4 font-cond text-sm font-bold tracking-[2px] uppercase text-amber-600 hover:text-amber-800 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {item.text}
                    </Link>
                  ) : (
                    <Link
                      href={item.key === 'HOME' ? '/' : `/${item.key.toLowerCase()}`}
                      className={`flex items-center justify-between py-4 font-cond text-sm font-bold tracking-[2px] uppercase transition-colors ${
                        currentPage === item.key ? 'text-teal-700' : 'text-[#111] hover:text-teal-700'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.text}
                      {currentPage === item.key && (
                        <span className="w-2 h-2 bg-teal-700 rounded-full" />
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-8">
              {isSignedIn ? (
                <div className="flex justify-center">
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-teal-700 text-white font-cond text-xs font-bold tracking-[2px] uppercase hover:bg-[#111] transition-colors">
                    Pievienojies mums
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              )}
            </div>
          </nav>

          {/* Contact info */}
          <div className="mt-auto pt-6 border-t border-[#e5e5e5]">
            <div className="space-y-3 text-sm text-[#888]">
              <a href="tel:+37129113938" className="flex items-center gap-2 hover:text-teal-700 transition-colors">
                +371 29113938
              </a>
              <a href="mailto:rkfenikss@gmail.com" className="flex items-center gap-2 hover:text-teal-700 transition-colors">
                rkfenikss@gmail.com
              </a>
            </div>
            <div className="mt-4 flex gap-3.5">
              <a href="https://www.facebook.com/RKFenikss?locale=lv_LV" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-8 h-8 grid place-items-center text-[#888] hover:text-teal-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="https://www.instagram.com/rk_fenikss/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-8 h-8 grid place-items-center text-[#888] hover:text-teal-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {children}

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white pt-14">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16">
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-16 pb-12 border-b border-white/[0.06]">
            {/* Brand */}
            <div className="flex-shrink-0 w-[180px]">
              <div className="flex items-center gap-2.5 mb-3">
                <Image
                  src="/Logo/fēniks_logo-removebg-preview.png"
                  alt="RK Fēnikss Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <span className="font-display text-lg font-bold uppercase">RK &quot;Fēnikss&quot;</span>
              </div>
            </div>

            {/* Columns */}
            <div className="flex flex-wrap gap-8 md:gap-16 flex-1">
              <div>
                <h4 className="font-cond text-xs font-bold tracking-[3px] uppercase text-white/40 mb-4">
                  Apmeklē mūs
                </h4>
                <p className="text-sm text-white/30 leading-relaxed">
                  Kaimiņi, Brenguļi<br />
                  Brenguļu pagasts<br />
                  Valmieras novads<br />
                  LV-4245<br /><br />
                  Tel: +371 29113938
                </p>
              </div>
              <div>
                <h4 className="font-cond text-xs font-bold tracking-[3px] uppercase text-white/40 mb-4">
                  Kontakti
                </h4>
                <ul className="space-y-2">
                  <li><a href="mailto:rkfenikss@gmail.com" className="text-sm text-white/35 hover:text-teal-400 transition-colors">rkfenikss@gmail.com</a></li>
                  <li><Link href="/privacy-policy" className="text-sm text-white/35 hover:text-teal-400 transition-colors">Privātuma politika</Link></li>
                  <li><Link href="/cookies-policy" className="text-sm text-white/35 hover:text-teal-400 transition-colors">Sīkdatņu politika</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-cond text-xs font-bold tracking-[3px] uppercase text-white/40 mb-4">
                  Rekvizīti
                </h4>
                <p className="text-sm text-white/30 leading-relaxed">
                  Biedrība &quot;Regbija klubs<br />
                  &quot;Valmieras Fēnikss&quot;&quot;<br />
                  Reģ. nr: 40008126600<br /><br />
                  <span className="font-mono text-xs text-white/20">LV86HABA0551035059313</span>
                </p>
              </div>
              <div>
                <h4 className="font-cond text-xs font-bold tracking-[3px] uppercase text-white/40 mb-4">
                  Ātrās saites
                </h4>
                <ul className="space-y-2">
                  {baseNavItems.map((item) => (
                    <li key={item.key}>
                      <Link
                        href={item.key === 'HOME' ? '/' : `/${item.key.toLowerCase()}`}
                        className="text-sm text-white/35 hover:text-teal-400 transition-colors"
                      >
                        {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Teal bottom strip */}
        <div className="bg-teal-700 mt-12">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-white/60">
              © 2025 RK &quot;Fēnikss&quot;. Visas tiesības aizsargātas.
            </span>
            <div className="flex items-center gap-3.5">
              {!isSignedIn && (
                <>
                  <SignInButton mode="modal">
                    <button className="text-xs text-white/60 hover:text-white transition-colors">
                      Ieiet
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="text-xs text-white/60 hover:text-white transition-colors">
                      Reģistrēties
                    </button>
                  </SignUpButton>
                  <span className="w-px h-3 bg-white/20" />
                </>
              )}
              <a href="https://www.facebook.com/RKFenikss?locale=lv_LV" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-8 h-8 grid place-items-center text-white opacity-70 hover:opacity-100 transition-opacity">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/rk_fenikss/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-8 h-8 grid place-items-center text-white opacity-70 hover:opacity-100 transition-opacity">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/></svg>
              </a>
              <a href="https://www.tiktok.com/@rk_fenikss" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                className="w-8 h-8 grid place-items-center text-white opacity-70 hover:opacity-100 transition-opacity">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.14V11.7a4.83 4.83 0 01-3.77-1.24V6.69h3.77z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 w-10 h-10 bg-[#111] text-white grid place-items-center shadow-lg transition-all duration-300 hover:bg-teal-700 ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
        aria-label="Ritināt uz augšu"
      >
        <ChevronUp className="h-5 w-5" />
      </button>

      <PageViewTracker />
    </div>
  )
}

export default MainLayout;
