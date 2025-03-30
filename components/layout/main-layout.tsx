'use client'

import { useState, type ReactNode, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, ArrowRight } from 'lucide-react'
import Image from 'next/image'
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

  // Add animation styles for the Join Us button
  useEffect(() => {
    // Create animation keyframes
    const styleElement = document.createElement('style');
    styleElement.id = 'join-us-animation';
    styleElement.textContent = `
      @keyframes glow-join-us-border {
        0% { border-color: rgba(20, 184, 166, 0.2); box-shadow: 0 0 5px rgba(20, 184, 166, 0.2); }
        50% { border-color: rgba(20, 184, 166, 0.8); box-shadow: 0 0 20px rgba(20, 184, 166, 0.6); }
        100% { border-color: rgba(20, 184, 166, 0.2); box-shadow: 0 0 5px rgba(20, 184, 166, 0.2); }
      }
      .join-us-button {
        animation: glow-join-us-border 2s infinite;
        border: 2px solid transparent;
      }
    `;
    
    // Only add if it doesn't exist yet
    if (!document.getElementById('join-us-animation')) {
      document.head.appendChild(styleElement);
    }
    
    // Cleanup on unmount
    return () => {
      const existingStyle = document.getElementById('join-us-animation');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-teal-900 to-teal-700 shadow-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex skew-x-[-12deg] transform items-center gap-2 bg-white px-3 py-1 shadow-md">
              <div className="h-8 w-8 skew-x-[12deg] transform overflow-hidden">
                <Image 
                  src="/Logo/fēniks_logo-removebg-preview.png" 
                  alt="RK Fēnikss Logo" 
                  width={32} 
                  height={32} 
                  className="object-contain"
                />
              </div>
              <Link href="/">
                <span className="skew-x-[12deg] transform text-xl font-bold tracking-tighter text-teal-800">
                  RK &quot;FĒNIKSS&quot;
                </span>
              </Link>
            </div>
            <nav className="hidden md:flex">
              <ul className="flex items-center">
                {[
                  { key: 'HOME', text: 'SĀKUMS' },
                  { key: 'ABOUT', text: 'PAR MUMS' },
                  { key: 'TEAM', text: 'KOMANDA' },
                  { key: 'FIXTURES', text: 'SPĒLES' },
                  { key: 'NEWS', text: 'ZIŅAS' },
                  { key: 'GALLERY', text: 'GALERIJA' },
                  { key: 'CONTACT', text: 'KONTAKTI' }
                ].map(
                  (item) => (
                    <li key={item.key}>
                      <Link
                        href={item.key === 'HOME' ? '/' : `/${item.key.toLowerCase()}`}
                        className={`group relative mx-1 overflow-hidden px-4 py-5 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:text-teal-100 ${currentPage === item.key ? 'text-teal-100' : ''}`}
                      >
                        <span className="relative z-10">{item.text}</span>
                        <span className="absolute inset-0 -z-0 skew-x-[-12deg] scale-x-[0.8] scale-y-[0.8] transform bg-teal-600 opacity-0 transition-opacity duration-300 group-hover:scale-100 group-hover:opacity-100"></span>
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>
            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <>
                  {isAdminUser && (
                    <Link href="/admin">
                      <button className="hidden skew-x-[-12deg] transform bg-white px-6 py-3 font-medium tracking-wide text-teal-800 shadow-lg transition-all duration-300 hover:bg-white hover:text-teal-900 md:inline-flex">
                        <span className="inline-flex skew-x-[12deg] transform items-center">
                          Vadības panelis
                        </span>
                      </button>
                    </Link>
                  )}
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <>
                  <Link href="/contact">
                    <button className="join-us-button hidden group skew-x-[-12deg] transform bg-white px-6 py-3 font-medium tracking-wide text-teal-800 shadow-lg transition-all duration-300 hover:bg-white hover:text-teal-900 md:inline-flex">
                      <span className="inline-flex skew-x-[12deg] transform items-center">
                        PIEVIENOJIES MUMS
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </button>
                  </Link>
                </>
              )}
              <button
                className="skew-x-[-12deg] transform bg-teal-600 p-2 text-white transition-all duration-300 hover:bg-teal-500 md:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6 skew-x-[12deg] transform transition-transform duration-300 hover:rotate-90" />
                <span className="sr-only">Atvērt izvēlni</span>
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
                <div className="h-8 w-8 skew-x-[12deg] transform overflow-hidden">
                  <Image 
                    src="/Logo/fēniks_logo-removebg-preview.png" 
                    alt="RK Fēnikss Logo" 
                    width={32} 
                    height={32} 
                    className="object-contain"
                  />
                </div>
                <span className="skew-x-[12deg] transform text-xl font-bold tracking-tighter text-teal-800">
                  RK &quot;FĒNIKSS&quot;
                </span>
              </div>
              <button
                className="skew-x-[-12deg] transform bg-teal-600 p-2 text-white transition-colors duration-300 hover:bg-teal-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="animate-spin-once h-6 w-6 skew-x-[12deg] transform" />
                <span className="sr-only">Aizvērt izvēlni</span>
              </button>
            </div>
            <nav className="mt-12">
              <ul className="flex flex-col space-y-6">
                {[
                  { key: 'HOME', text: 'SĀKUMS' },
                  { key: 'ABOUT', text: 'PAR MUMS' },
                  { key: 'TEAM', text: 'KOMANDA' },
                  { key: 'FIXTURES', text: 'SPĒLES' },
                  { key: 'NEWS', text: 'ZIŅAS' },
                  { key: 'GALLERY', text: 'GALERIJA' },
                  { key: 'CONTACT', text: 'KONTAKTI' }
                ].map(
                  (item, index) => (
                    <li
                      key={item.key}
                      className="animate-slide-in-right opacity-100"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <Link
                        href={item.key === 'HOME' ? '/' : `/${item.key.toLowerCase()}`}
                        className="group flex items-center text-lg font-medium tracking-wide text-white hover:text-teal-100"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="mr-4 h-0.5 w-8 origin-left scale-x-0 transform bg-white transition-transform duration-300 group-hover:scale-x-100"></span>
                        {item.text}
                      </Link>
                    </li>
                  )
                )}
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
                          Vadības panelis
                        </span>
                      </button>
                    </Link>
                  )}
                  <div className="mt-4 flex justify-center">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </>
              ) : (
                <Link
                  href="/contact"
                  className="animate-slide-in-up mt-12 block w-full"
                  style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <button className="join-us-button w-full group skew-x-[-12deg] transform bg-white px-6 py-3 font-medium tracking-wide text-teal-800 shadow-lg transition-all duration-300 hover:bg-white hover:text-teal-900">
                    <span className="inline-flex skew-x-[12deg] transform items-center">
                      PIEVIENOJIES MUMS
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                </Link>
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
                <div className="h-8 w-8 overflow-hidden">
                  <Image 
                    src="/Logo/fēniks_logo-removebg-preview.png" 
                    alt="RK Fēnikss Logo" 
                    width={32} 
                    height={32} 
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold uppercase tracking-tighter text-teal-800">
                  RK &quot;FĒNIKSS&quot;
                </span>
              </div>
              <p className="mt-4 text-sm font-medium text-zinc-600">
                Valmieras novada regbija klubs, dibināts 2005. gadā, apvieno dažāda vecuma un prasmju spēlētājus vienotā komandā.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-bold uppercase tracking-wide text-teal-900">Ātrās saites</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>
                  <Link
                    href="/"
                    className="inline-block transform font-medium tracking-wide transition-transform hover:translate-x-1 hover:text-teal-700"
                  >
                    SĀKUMS
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="inline-block transform font-medium tracking-wide transition-transform hover:translate-x-1 hover:text-teal-700"
                  >
                    PAR MUMS
                  </Link>
                </li>
                <li>
                  <Link
                    href="/team"
                    className="inline-block transform font-medium tracking-wide transition-transform hover:translate-x-1 hover:text-teal-700"
                  >
                    KOMANDA
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fixtures"
                    className="inline-block transform font-medium tracking-wide transition-transform hover:translate-x-1 hover:text-teal-700"
                  >
                    SPĒLES
                  </Link>
                </li>
                <li>
                  <Link
                    href="/news"
                    className="inline-block transform font-medium tracking-wide transition-transform hover:translate-x-1 hover:text-teal-700"
                  >
                    ZIŅAS
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="inline-block transform font-medium tracking-wide transition-transform hover:translate-x-1 hover:text-teal-700"
                  >
                    GALERIJA
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="inline-block transform font-medium tracking-wide transition-transform hover:translate-x-1 hover:text-teal-700"
                  >
                    KONTAKTI
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold uppercase tracking-wide text-teal-900">Sazinies ar mums</h3>
              <address className="space-y-2 text-sm font-medium not-italic text-zinc-600">
                <p>Biedrība "Regbija klubs "Valmieras Fēnikss""</p>
                <p>Juridiskā adrese: "Lukstiņi", Bērzaines pagasts, Valmieras novads, LV-4208</p>
                <p>Adrese: Kaimiņi, Brenguļi, Brenguļu pagasts, Valmieras novads, LV-4245</p>
                <p>Reģistrācijas nr: 40008126600</p>
                <p className="mt-2">
                  E-pasts:{' '}
                  <a href="mailto:rkfenikss@gmail.com" className="hover:text-teal-700">
                    rkfenikss@gmail.com
                  </a>
                </p>
                <p>
                  Tālrunis:{' '}
                  <a href="tel:+37129113938" className="hover:text-teal-700">
                    +371 29113938
                  </a>
                </p>
                <p className="mt-2">
                  Bankas konts: Swedbank<br />
                  Konta nr.: LV86HABA0551035059313
                </p>
              </address>
            </div>
          </div>
          
          {/* Sign in/Sign up buttons */}
          <div className="mt-8 mb-4 flex justify-center space-x-6">
            {!isSignedIn && (
              <>
                <SignInButton mode="modal">
                  <button className="text-xs font-medium text-zinc-500 hover:text-teal-700 transition-colors">
                    Ieiet
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="text-xs font-medium text-zinc-500 hover:text-teal-700 transition-colors">
                    Reģistrēties
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
          
          <div className="mt-6 border-t border-zinc-200 pt-6 text-center text-sm font-medium tracking-wide text-zinc-500">
            <p>© 2025 RK &quot;FĒNIKSS&quot;. VISAS TIESĪBAS AIZSARGĀTAS.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
