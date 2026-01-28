'use client'

import { useState, type ReactNode, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, ArrowRight, ChevronUp, Settings, Heart } from 'lucide-react'
import Image from 'next/image'
import { SignInButton, SignUpButton, UserButton, useAuth, useUser } from '@clerk/nextjs'
import { isAdmin } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { DonationPopup } from '@/components/features/donation-popup'
import { PageViewTracker } from '@/components/features/page-view-tracker'

interface MainLayoutProps {
  children: ReactNode
  currentPage?: string // Make currentPage optional
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

  // Auto-detect current page based on pathname if not provided via props
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

  // Scroll detection for header visibility, background, and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      setIsScrolled(currentScrollY > 50)
      setShowScrollTop(currentScrollY > 400)

      // Hide header on scroll down, show on scroll up
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down
          setIsHeaderHidden(true)
        } else {
          // Scrolling up
          setIsHeaderHidden(false)
        }
      } else {
        // Always show header near top of page
        setIsHeaderHidden(false)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Close mobile menu on escape key
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
    { key: 'HOME', text: 'SĀKUMS' },
    { key: 'ABOUT', text: 'PAR MUMS' },
    { key: 'TEAM', text: 'KOMANDA' },
    { key: 'FIXTURES', text: 'SPĒLES' },
    { key: 'NEWS', text: 'ZIŅAS' },
    { key: 'GALLERY', text: 'GALERIJA' },
    { key: 'NOTEIKUMI', text: 'NOTEIKUMI' },
    { key: 'CONTACT', text: 'KONTAKTI' }
  ]

  // Add admin link to nav items if user is admin
  const navItems = isAdminUser
    ? [...baseNavItems, { key: 'ADMIN', text: 'ADMIN', isAdmin: true }]
    : baseNavItems

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-zinc-900">
      {/* Scrolling Announcement Banner */}
      <div className="bg-gradient-to-r from-pink-600 via-red-500 to-pink-600 text-white py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          {[0, 1].map((group) => (
            <div key={group} className="flex shrink-0 items-center" aria-hidden={group === 1 || undefined}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center mx-8">
                  <Heart className="h-4 w-4 mr-2 animate-pulse" />
                  <span className="font-bold tracking-tight mr-1.5">
                    FĒNIKSS
                  </span>
                  <span className="italic font-light text-pink-200 mr-1">
                    autisma atbalstam
                  </span>
                  <span className="font-medium">
                    — tavs ziedojums var mainīt dzīves!
                  </span>
                  <Link
                    href="https://gogetfunding.com/fenikss-in-support-of-autism/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 skew-x-[-12deg] transform bg-white text-pink-600 px-4 py-1 text-sm font-bold hover:bg-pink-100 transition-colors"
                  >
                    <span className="inline-block skew-x-[12deg] transform">ZIEDOT</span>
                  </Link>
                  <span className="mx-8">•</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-teal-900/95 backdrop-blur-md shadow-lg'
            : 'bg-gradient-to-r from-teal-900 to-teal-700'
        } ${isHeaderHidden ? '-translate-y-full' : 'translate-y-0'}`}
      >
        {/* Top accent line */}
        <div className="h-1 bg-gradient-to-r from-teal-400 via-teal-300 to-teal-400" />

        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group">
              <div className="h-12 w-12 lg:h-14 lg:w-14 overflow-hidden transition-all duration-300 group-hover:scale-105">
                <Image
                  src="/Logo/fēniks_logo-removebg-preview.png"
                  alt="RK Fēnikss Logo"
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex">
              <ul className="flex items-center">
                {navItems.map((item) => (
                  <li key={item.key}>
                    {item.key === 'ADMIN' ? (
                      <Link
                        href="/admin"
                        className="group relative mx-0.5 px-4 py-5 text-sm font-medium tracking-wide transition-colors duration-200"
                      >
                        <span className="flex items-center gap-1.5 text-amber-300 group-hover:text-white">
                          <Settings className="h-4 w-4" />
                          {item.text}
                        </span>
                      </Link>
                    ) : (
                      <Link
                        href={item.key === 'HOME' ? '/' : `/${item.key.toLowerCase()}`}
                        className="group relative mx-0.5 px-4 py-5 text-sm font-medium tracking-wide text-white transition-all duration-300"
                      >
                        <span className={`relative z-10 transition-colors duration-300 ${
                          currentPage === item.key ? 'text-teal-300' : 'group-hover:text-teal-200'
                        }`}>
                          {item.text}
                        </span>

                        {/* Skewed background on hover/active */}
                        <span
                          className={`absolute inset-0 -z-0 skew-x-[-12deg] transform bg-white/10 transition-all duration-300 ${
                            currentPage === item.key
                              ? 'opacity-100 scale-100'
                              : 'opacity-0 scale-x-75 group-hover:scale-100 group-hover:opacity-100'
                          }`}
                        />

                        {/* Bottom indicator line */}
                        <span
                          className={`absolute bottom-2 left-1/2 h-0.5 -translate-x-1/2 skew-x-[-12deg] transform bg-teal-400 transition-all duration-300 ${
                            currentPage === item.key
                              ? 'w-8 opacity-100'
                              : 'w-0 opacity-0 group-hover:w-6 group-hover:opacity-100'
                          }`}
                        />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right side buttons */}
            <div className="flex items-center gap-3">
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <Link href="/contact" className="hidden md:block">
                  <button className="animate-nav-glow group skew-x-[-12deg] transform bg-white px-5 py-2.5 font-medium tracking-wide text-teal-800 shadow-lg transition-all duration-300 hover:bg-teal-50 hover:scale-105">
                    <span className="inline-flex skew-x-[12deg] transform items-center text-sm">
                      PIEVIENOJIES
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                className="skew-x-[-12deg] transform bg-white/10 backdrop-blur-sm border border-white/20 p-2.5 text-white transition-all duration-300 hover:bg-white/20 lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Atvērt izvēlni"
              >
                <Menu className="h-5 w-5 skew-x-[12deg] transform" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-teal-300 to-teal-400" />
        <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-teal-400/30 skew-x-[-12deg]" />

        <div className="flex flex-col h-full px-6 py-4 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 overflow-hidden">
              <Image
                src="/Logo/fēniks_logo-removebg-preview.png"
                alt="RK Fēnikss Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <button
              className="skew-x-[-12deg] transform bg-white/10 border border-white/20 p-2.5 text-white transition-all duration-300 hover:bg-white/20"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Aizvērt izvēlni"
            >
              <X className="h-5 w-5 skew-x-[12deg] transform" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-10 flex-1">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li
                  key={item.key}
                  className="menu-item-animate"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {item.key === 'ADMIN' ? (
                    <Link
                      href="/admin"
                      className="group flex items-center py-3 px-4 rounded-lg transition-colors duration-200 text-amber-300 hover:text-white hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mr-3 h-6 w-1 skew-x-[-12deg] transform rounded-full bg-amber-400" />
                      <Settings className="h-4 w-4 mr-2" />
                      <span className="text-base font-medium tracking-wide">{item.text}</span>
                    </Link>
                  ) : (
                    <Link
                      href={item.key === 'HOME' ? '/' : `/${item.key.toLowerCase()}`}
                      className={`group flex items-center py-3 px-4 rounded-lg transition-all duration-300 ${
                        currentPage === item.key
                          ? 'bg-white/15 text-teal-300'
                          : 'text-white hover:bg-white/10 hover:text-teal-200'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {/* Active indicator */}
                      <span
                        className={`mr-3 h-6 w-1 skew-x-[-12deg] transform rounded-full transition-all duration-300 ${
                          currentPage === item.key
                            ? 'bg-teal-400'
                            : 'bg-white/20 group-hover:bg-teal-400/50'
                        }`}
                      />
                      <span className="text-base font-medium tracking-wide">{item.text}</span>
                      {/* Arrow on hover */}
                      <ArrowRight
                        className={`ml-auto h-4 w-4 transition-all duration-300 ${
                          currentPage === item.key
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                        }`}
                      />
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <div className="mt-8">
              {isSignedIn ? (
                <div className="flex justify-center">
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <Link
                  href="/contact"
                  className="block w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <button className="animate-nav-glow w-full group skew-x-[-12deg] transform bg-white px-6 py-3.5 font-bold tracking-wide text-teal-800 shadow-lg transition-all duration-300 hover:bg-teal-50">
                    <span className="inline-flex skew-x-[12deg] transform items-center justify-center">
                      PIEVIENOJIES MUMS
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                </Link>
              )}
            </div>
          </nav>

          {/* Contact info */}
          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="space-y-3 text-sm">
              <a
                href="tel:+37129113938"
                className="flex items-center text-white/80 hover:text-teal-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                +371 29113938
              </a>
              <a
                href="mailto:rkfenikss@gmail.com"
                className="flex items-center text-white/80 hover:text-teal-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                rkfenikss@gmail.com
              </a>
            </div>

            {/* Social Media */}
            <div className="mt-6 flex justify-center gap-4">
              <a
                href="https://www.facebook.com/RKFenikss?locale=lv_LV"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-teal-700 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/rk_fenikss/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-teal-700 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {children}

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 overflow-hidden">
        {/* Top accent line */}
        <div className="h-1 bg-gradient-to-r from-teal-400 via-teal-300 to-teal-400" />

        {/* Decorative elements */}
        <div className="absolute top-16 left-0 w-32 h-0.5 bg-teal-400/20 skew-x-[-12deg]" />
        <div className="absolute top-20 left-0 w-20 h-0.5 bg-teal-400/10 skew-x-[-12deg]" />
        <div className="absolute bottom-32 right-0 w-40 h-0.5 bg-teal-400/20 skew-x-[-12deg]" />

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 py-16 relative z-10">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Logo & Description */}
            <div className="lg:col-span-1">
              <div className="h-12 w-12 overflow-hidden mb-6">
                <Image
                  src="/Logo/fēniks_logo-removebg-preview.png"
                  alt="RK Fēnikss Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <p className="text-teal-100/80 text-sm leading-relaxed mb-6">
                Valmieras novada regbija klubs, dibināts 2005. gadā, apvieno dažāda vecuma un prasmju spēlētājus vienotā komandā.
              </p>

              {/* Social Media */}
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/RKFenikss?locale=lv_LV"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 bg-white/10 hover:bg-white hover:text-teal-800 text-white flex items-center justify-center transition-all duration-300 skew-x-[-12deg]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="skew-x-[12deg]">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/rk_fenikss/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 bg-white/10 hover:bg-white hover:text-teal-800 text-white flex items-center justify-center transition-all duration-300 skew-x-[-12deg]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="skew-x-[12deg]">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-6 flex items-center gap-3">
                <div className="w-8 h-0.5 bg-teal-400 skew-x-[-12deg]" />
                Ātrās saites
              </h3>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.key === 'HOME' ? '/' : `/${item.key.toLowerCase()}`}
                      className="text-teal-100/70 hover:text-white text-sm font-medium tracking-wide transition-all duration-300 flex items-center group"
                    >
                      <span className="w-0 h-0.5 bg-teal-400 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300" />
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-6 flex items-center gap-3">
                <div className="w-8 h-0.5 bg-teal-400 skew-x-[-12deg]" />
                Kontakti
              </h3>
              <address className="not-italic space-y-4">
                <a href="tel:+37129113938" className="flex items-center gap-3 text-teal-100/70 hover:text-white transition-colors group">
                  <div className="w-10 h-10 bg-white/10 group-hover:bg-teal-400 flex items-center justify-center transition-all duration-300 skew-x-[-12deg]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="skew-x-[12deg]">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <span className="text-sm">+371 29113938</span>
                </a>
                <a href="mailto:rkfenikss@gmail.com" className="flex items-center gap-3 text-teal-100/70 hover:text-white transition-colors group">
                  <div className="w-10 h-10 bg-white/10 group-hover:bg-teal-400 flex items-center justify-center transition-all duration-300 skew-x-[-12deg]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="skew-x-[12deg]">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <span className="text-sm">rkfenikss@gmail.com</span>
                </a>
                <div className="flex items-start gap-3 text-teal-100/70">
                  <div className="w-10 h-10 bg-white/10 flex items-center justify-center flex-shrink-0 skew-x-[-12deg]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="skew-x-[12deg]">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <span className="text-sm leading-relaxed">Kaimiņi, Brenguļi, Brenguļu pagasts, Valmieras novads, LV-4245</span>
                </div>
              </address>
            </div>

            {/* Legal Info */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-wider mb-6 flex items-center gap-3">
                <div className="w-8 h-0.5 bg-teal-400 skew-x-[-12deg]" />
                Rekvizīti
              </h3>
              <div className="space-y-3 text-sm text-teal-100/70">
                <p>Biedrība &quot;Regbija klubs &quot;Valmieras Fēnikss&quot;&quot;</p>
                <p>Reģ. nr: 40008126600</p>
                <div className="pt-3 border-t border-white/10">
                  <p className="text-teal-300 font-medium mb-1">Bankas konts:</p>
                  <p>Swedbank</p>
                  <p className="text-xs mt-1">LV86HABA0551035059313</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <p className="text-teal-100/60 text-sm">
                © 2025 RK &quot;FĒNIKSS&quot;. Visas tiesības aizsargātas.
              </p>

              {/* Links */}
              <div className="flex items-center gap-6">
                {!isSignedIn && (
                  <>
                    <SignInButton mode="modal">
                      <button className="text-xs font-medium text-teal-100/60 hover:text-white transition-colors">
                        Ieiet
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="text-xs font-medium text-teal-100/60 hover:text-white transition-colors">
                        Reģistrēties
                      </button>
                    </SignUpButton>
                    <span className="w-px h-4 bg-white/20" />
                  </>
                )}
                <Link href="/privacy-policy" className="text-xs font-medium text-teal-100/60 hover:text-white transition-colors">
                  Privātuma Politika
                </Link>
                <Link href="/cookies-policy" className="text-xs font-medium text-teal-100/60 hover:text-white transition-colors">
                  Sīkdatņu Politika
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 skew-x-[-12deg] transform bg-teal-800 p-3 text-white shadow-lg transition-all duration-300 hover:bg-teal-700 hover:scale-110 ${
          showScrollTop
            ? 'translate-y-0 opacity-100'
            : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
        aria-label="Ritināt uz augšu"
      >
        <ChevronUp className="h-5 w-5 skew-x-[12deg] transform" />
      </button>

      {/* Donation Popup */}
      <DonationPopup />

      {/* Page View Tracker */}
      <PageViewTracker />
    </div>
  )
}

export default MainLayout;
