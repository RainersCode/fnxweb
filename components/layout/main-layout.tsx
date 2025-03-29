'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, Menu, X } from 'lucide-react'
import { SignInButton, SignUpButton, UserButton, useAuth, useUser } from '@clerk/nextjs'
import { isAdmin } from '@/lib/utils'

interface MainLayoutProps {
  children: ReactNode
  currentPage: string
}

export default function MainLayout({ children, currentPage }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const userEmail = user?.emailAddresses[0]?.emailAddress
  const isAdminUser = isAdmin(userEmail)

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-teal-900 to-teal-700 shadow-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex skew-x-[-12deg] transform items-center gap-2 bg-white px-3 py-1 shadow-md">
              <Shield className="h-8 w-8 skew-x-[12deg] transform text-teal-800" />
              <Link href="/">
                <span className="skew-x-[12deg] transform text-xl font-bold tracking-tighter text-teal-800">
                  RIVERSIDE RUGBY
                </span>
              </Link>
            </div>
            <nav className="hidden md:flex">
              <ul className="flex items-center">
                {['HOME', 'TEAM', 'FIXTURES', 'NEWS', 'GALLERY', 'CONTACT'].map((item, index) => (
                  <li key={item}>
                    <Link
                      href={item === 'HOME' ? '/' : `/${item.toLowerCase()}`}
                      className={`group relative mx-1 overflow-hidden px-4 py-5 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:text-teal-100 ${currentPage === item ? 'text-teal-100' : ''}`}
                    >
                      <span className="relative z-10">{item}</span>
                      <span className="absolute inset-0 -z-0 skew-x-[-12deg] scale-x-[0.8] scale-y-[0.8] transform bg-teal-600 opacity-0 transition-opacity duration-300 group-hover:scale-100 group-hover:opacity-100"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <>
                  {isAdminUser && (
                    <Link href="/admin">
                      <button className="hidden skew-x-[-12deg] transform bg-white px-6 py-3 font-medium tracking-wide text-teal-800 shadow-lg transition-all duration-300 hover:bg-white hover:text-teal-900 md:inline-flex">
                        <span className="inline-flex skew-x-[12deg] transform items-center">
                          Dashboard
                        </span>
                      </button>
                    </Link>
                  )}
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="hidden skew-x-[-12deg] transform bg-white px-6 py-3 font-medium tracking-wide text-teal-800 shadow-lg transition-all duration-300 hover:bg-white hover:text-teal-900 md:inline-flex">
                      <span className="inline-flex skew-x-[12deg] transform items-center">
                        Sign In
                      </span>
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="hidden skew-x-[-12deg] transform border border-white/20 bg-white/10 px-6 py-3 font-medium tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-white/20 md:inline-flex">
                      <span className="inline-flex skew-x-[12deg] transform items-center">
                        Sign Up
                      </span>
                    </button>
                  </SignUpButton>
                </>
              )}
              <button
                className="skew-x-[-12deg] transform bg-teal-600 p-2 text-white transition-all duration-300 hover:bg-teal-500 md:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6 skew-x-[12deg] transform transition-transform duration-300 hover:rotate-90" />
                <span className="sr-only">Open menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-teal-900 to-teal-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex skew-x-[-12deg] transform items-center gap-2 bg-white px-3 py-1">
                <Shield className="h-8 w-8 skew-x-[12deg] transform text-teal-800" />
                <span className="skew-x-[12deg] transform text-xl font-bold tracking-tighter text-teal-800">
                  RIVERSIDE RUGBY
                </span>
              </div>
              <button
                className="skew-x-[-12deg] transform bg-teal-600 p-2 text-white transition-colors duration-300 hover:bg-teal-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="animate-spin-once h-6 w-6 skew-x-[12deg] transform" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>
            <nav className="mt-12">
              <ul className="flex flex-col space-y-6">
                {['HOME', 'TEAM', 'FIXTURES', 'NEWS', 'GALLERY', 'CONTACT'].map((item, index) => (
                  <li
                    key={item}
                    className="animate-slide-in-right opacity-100"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <Link
                      href={item === 'HOME' ? '/' : `/${item.toLowerCase()}`}
                      className="group flex items-center text-lg font-medium tracking-wide text-white hover:text-teal-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mr-4 h-0.5 w-8 origin-left scale-x-0 transform bg-white transition-transform duration-300 group-hover:scale-x-100"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
              {isSignedIn ? (
                <>
                  {isAdminUser && (
                    <Link
                      href="/admin"
                      className="animate-slide-in-up mt-12 block w-full"
                      style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <button className="w-full skew-x-[-12deg] transform bg-white px-6 py-3 font-medium tracking-wide text-teal-800 shadow-lg transition-all duration-300 hover:bg-white hover:text-teal-900">
                        <span className="inline-flex skew-x-[12deg] transform items-center">
                          Dashboard
                        </span>
                      </button>
                    </Link>
                  )}
                  <div className="mt-4 flex justify-center">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="mt-12 w-full skew-x-[-12deg] transform bg-white px-6 py-3 font-medium tracking-wide text-teal-800 shadow-lg transition-all duration-300 hover:bg-white hover:text-teal-900">
                      <span className="inline-flex skew-x-[12deg] transform items-center">
                        Sign In
                      </span>
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="mt-4 w-full skew-x-[-12deg] transform border border-white/20 bg-white/10 px-6 py-3 font-medium tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-white/20">
                      <span className="inline-flex skew-x-[12deg] transform items-center">
                        Sign Up
                      </span>
                    </button>
                  </SignUpButton>
                </>
              )}
            </nav>

            {/* Decorative elements */}
            <div className="animate-float absolute right-[10%] top-[20%] z-0 h-32 w-32 rotate-45 transform border-4 border-teal-500/30"></div>
            <div className="animate-float-delay absolute bottom-[30%] left-[15%] z-0 h-24 w-24 rounded-full border-8 border-teal-800/20"></div>
            <div className="absolute bottom-[10%] right-[20%] z-0 h-1 w-48 -rotate-12 transform animate-pulse bg-teal-500/40"></div>
          </div>
        </div>
      )}

      {children}

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-teal-800" />
                <span className="text-xl font-bold uppercase tracking-tighter text-teal-800">
                  RIVERSIDE RUGBY
                </span>
              </div>
              <p className="mt-4 text-sm font-medium text-zinc-600">
                A community rugby club established in 1985, bringing together players of all ages
                and abilities.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-bold uppercase tracking-wide text-teal-900">Quick Links</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>
                  <Link
                    href="/"
                    className="inline-block transform font-medium tracking-wide transition-transform hover:translate-x-1 hover:text-teal-700"
                  >
                    HOME
                  </Link>
                </li>
                <li>
                  <Link
                    href="/team"
                    className="inline-block transform font-medium tracking-wide transition-transform hover:translate-x-1 hover:text-teal-700"
                  >
                    TEAM
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fixtures"
                    className="inline-block transform font-medium tracking-wide transition-transform hover:translate-x-1 hover:text-teal-700"
                  >
                    FIXTURES
                  </Link>
                </li>
                <li>
                  <Link
                    href="/news"
                    className="inline-block transform font-medium tracking-wide transition-transform hover:translate-x-1 hover:text-teal-700"
                  >
                    NEWS
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="inline-block transform font-medium tracking-wide transition-transform hover:translate-x-1 hover:text-teal-700"
                  >
                    GALLERY
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="inline-block transform font-medium tracking-wide transition-transform hover:translate-x-1 hover:text-teal-700"
                  >
                    CONTACT
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold uppercase tracking-wide text-teal-900">Contact Us</h3>
              <address className="space-y-2 text-sm font-medium not-italic text-zinc-600">
                <p>Riverside Rugby Club</p>
                <p>Riverside Park, Main Street</p>
                <p>Riverside Town, RT1 2AB</p>
                <p className="mt-2">
                  Email:{' '}
                  <a href="mailto:info@riversiderugby.com" className="hover:text-teal-700">
                    info@riversiderugby.com
                  </a>
                </p>
                <p>
                  Phone:{' '}
                  <a href="tel:+441234567890" className="hover:text-teal-700">
                    01234 567890
                  </a>
                </p>
              </address>
            </div>
          </div>
          <div className="mt-12 border-t border-zinc-200 pt-6 text-center text-sm font-medium tracking-wide text-zinc-500">
            <p>© 2025 RIVERSIDE RUGBY CLUB. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
