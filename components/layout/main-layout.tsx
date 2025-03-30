'use client'

import { useState, type ReactNode, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { SignInButton, SignUpButton, UserButton, useAuth, useUser } from '@clerk/nextjs'
import { isAdmin } from '@/lib/utils'
import { usePathname } from 'next/navigation'

interface MainLayoutProps {
  children: ReactNode
  currentPage?: string // Make currentPage optional
}

export function MainLayout({ children, currentPage: propCurrentPage }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    if (path === '/contact') return 'CONTACT'
    if (path === '/privacy-policy') return 'PRIVACY_POLICY'
    if (path === '/cookies-policy') return 'COOKIES_POLICY'
    return ''
  }
  
  const currentPage = propCurrentPage || getActivePageKey(pathname)

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
                        className={`group relative mx-1 overflow-hidden px-4 py-5 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:text-teal-100 ${currentPage === item.key ? 'text-teal-100 font-bold' : ''}`}
                      >
                        <span className="relative z-10">{item.text}</span>
                        <span className={`absolute inset-0 -z-0 skew-x-[-12deg] transform bg-teal-600 transition-all duration-300 ${
                          currentPage === item.key 
                            ? 'opacity-100 scale-100' 
                            : 'opacity-0 scale-x-[0.8] scale-y-[0.8] group-hover:scale-100 group-hover:opacity-100'
                        }`}></span>
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
                <X className="h-6 w-6 skew-x-[12deg] transform" />
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
                    >
                      <Link
                        href={item.key === 'HOME' ? '/' : `/${item.key.toLowerCase()}`}
                        className={`group flex items-center text-lg font-medium tracking-wide text-white hover:text-teal-100 ${
                          currentPage === item.key ? 'text-teal-100 font-bold' : ''
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className={`mr-4 h-0.5 w-8 origin-left bg-white transition-transform duration-300 ${
                          currentPage === item.key 
                            ? 'scale-x-100' 
                            : 'scale-x-0 group-hover:scale-x-100'
                        }`}></span>
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
                      className="mt-12 block w-full"
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
                  className="mt-12 block w-full"
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
            
            {/* Contact info and social links in mobile menu */}
            <div className="mt-8 border-t border-teal-600 pt-8">
              <h3 className="text-lg font-bold text-white mb-4">Kontaktinformācija</h3>
              <div className="space-y-3 text-sm text-white">
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <a href="tel:+37129113938" className="hover:text-teal-100">+371 29113938</a>
                </p>
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <a href="mailto:rkfenikss@gmail.com" className="hover:text-teal-100">rkfenikss@gmail.com</a>
                </p>
              </div>
              
              {/* Social Media in Mobile Menu */}
              <div className="mt-6 flex justify-center space-x-6">
                <a 
                  href="https://www.facebook.com/RKFenikss?locale=lv_LV" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="bg-white p-3 rounded-md text-teal-700 hover:bg-teal-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/rk_fenikss/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="bg-white p-3 rounded-md text-teal-700 hover:bg-teal-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
              </div>
            </div>
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
                
                {/* Social Media Links */}
                <div className="mt-4 flex items-center space-x-4">
                  <a 
                    href="https://www.facebook.com/RKFenikss?locale=lv_LV" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-zinc-600 hover:text-teal-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://www.instagram.com/rk_fenikss/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-zinc-600 hover:text-teal-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </a>
                </div>
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
            <div className="mb-4 flex justify-center space-x-6">
              <Link href="/privacy-policy" className="text-zinc-500 hover:text-teal-700 transition-colors">
                Privātuma Politika
              </Link>
              <Link href="/cookies-policy" className="text-zinc-500 hover:text-teal-700 transition-colors">
                Sīkdatņu Politika
              </Link>
            </div>
            <p>© 2025 RK &quot;FĒNIKSS&quot;. VISAS TIESĪBAS AIZSARGĀTAS.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout;
