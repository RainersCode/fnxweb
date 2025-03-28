"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Menu, X } from "lucide-react"

interface MainLayoutProps {
  children: ReactNode
  currentPage: string
}

export default function MainLayout({ children, currentPage }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-teal-900 to-teal-700 shadow-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 bg-white py-1 px-3 transform skew-x-[-12deg] shadow-md">
              <Shield className="h-8 w-8 text-teal-800 transform skew-x-[12deg]" />
              <Link href="/">
                <span className="text-xl font-bold tracking-tighter text-teal-800 transform skew-x-[12deg]">
                  RIVERSIDE RUGBY
                </span>
              </Link>
            </div>
            <nav className="hidden md:flex">
              <ul className="flex items-center">
                {["HOME", "TEAM", "FIXTURES", "GALLERY", "CONTACT"].map((item, index) => (
                  <li key={item}>
                    <Link
                      href={item === "HOME" ? "/" : `/${item.toLowerCase()}`}
                      className={`relative mx-1 px-4 py-5 text-sm font-medium tracking-wide text-white hover:text-teal-100 transition-all duration-300 overflow-hidden group ${currentPage === item ? "text-teal-100" : ""}`}
                    >
                      <span className="relative z-10">{item}</span>
                      <span className="absolute inset-0 bg-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0 transform skew-x-[-12deg] scale-x-[0.8] scale-y-[0.8] group-hover:scale-100"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/contact">
                <button className="hidden md:inline-flex px-6 py-3 font-medium tracking-wide transform skew-x-[-12deg] transition-all duration-300 bg-white text-teal-800 hover:text-teal-900 hover:bg-white shadow-lg">
                  <span className="transform skew-x-[12deg] inline-flex items-center">JOIN US</span>
                </button>
              </Link>
              <button
                className="md:hidden text-white bg-teal-600 p-2 transform skew-x-[-12deg] hover:bg-teal-500 transition-all duration-300"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6 transform skew-x-[12deg] transition-transform duration-300 hover:rotate-90" />
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
              <div className="flex items-center gap-2 bg-white py-1 px-3 transform skew-x-[-12deg]">
                <Shield className="h-8 w-8 text-teal-800 transform skew-x-[12deg]" />
                <span className="text-xl font-bold tracking-tighter text-teal-800 transform skew-x-[12deg]">
                  RIVERSIDE RUGBY
                </span>
              </div>
              <button
                className="text-white bg-teal-600 p-2 transform skew-x-[-12deg] hover:bg-teal-500 transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6 transform skew-x-[12deg] animate-spin-once" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>
            <nav className="mt-12">
              <ul className="flex flex-col space-y-6">
                {["HOME", "TEAM", "FIXTURES", "GALLERY", "CONTACT"].map((item, index) => (
                  <li
                    key={item}
                    className="opacity-100 animate-slide-in-right"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <Link
                      href={item === "HOME" ? "/" : `/${item.toLowerCase()}`}
                      className="text-lg font-medium tracking-wide text-white hover:text-teal-100 flex items-center group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="w-8 h-0.5 bg-white mr-4 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link 
                href="/contact" 
                className="block mt-12 w-full animate-slide-in-up" 
                style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <button className="w-full px-6 py-3 font-medium tracking-wide transform skew-x-[-12deg] transition-all duration-300 bg-white text-teal-800 hover:text-teal-900 hover:bg-white shadow-lg">
                  <span className="transform skew-x-[12deg] inline-flex items-center">JOIN US</span>
                </button>
              </Link>
            </nav>

            {/* Decorative elements */}
            <div className="absolute top-[20%] right-[10%] w-32 h-32 border-4 border-teal-500/30 transform rotate-45 z-0 animate-float"></div>
            <div className="absolute bottom-[30%] left-[15%] w-24 h-24 border-8 border-teal-800/20 rounded-full z-0 animate-float-delay"></div>
            <div className="absolute bottom-[10%] right-[20%] w-48 h-1 bg-teal-500/40 transform -rotate-12 z-0 animate-pulse"></div>
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
                <span className="text-xl font-bold tracking-tighter text-teal-800 uppercase">RIVERSIDE RUGBY</span>
              </div>
              <p className="mt-4 text-sm text-zinc-600 font-medium">
                A community rugby club established in 1985, bringing together players of all ages and abilities.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-bold text-teal-900 uppercase tracking-wide">Quick Links</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>
                  <Link
                    href="/"
                    className="font-medium hover:text-teal-700 tracking-wide inline-block transform hover:translate-x-1 transition-transform"
                  >
                    HOME
                  </Link>
                </li>
                <li>
                  <Link
                    href="/team"
                    className="font-medium hover:text-teal-700 tracking-wide inline-block transform hover:translate-x-1 transition-transform"
                  >
                    TEAM
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fixtures"
                    className="font-medium hover:text-teal-700 tracking-wide inline-block transform hover:translate-x-1 transition-transform"
                  >
                    FIXTURES
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="font-medium hover:text-teal-700 tracking-wide inline-block transform hover:translate-x-1 transition-transform"
                  >
                    GALLERY
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="font-medium hover:text-teal-700 tracking-wide inline-block transform hover:translate-x-1 transition-transform"
                  >
                    CONTACT
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold text-teal-900 uppercase tracking-wide">Contact Us</h3>
              <address className="not-italic text-sm text-zinc-600 space-y-2 font-medium">
                <p>Riverside Rugby Club</p>
                <p>Riverside Park, Main Street</p>
                <p>Riverside Town, RT1 2AB</p>
                <p className="mt-2">
                  Email:{" "}
                  <a href="mailto:info@riversiderugby.com" className="hover:text-teal-700">
                    info@riversiderugby.com
                  </a>
                </p>
                <p>
                  Phone:{" "}
                  <a href="tel:+441234567890" className="hover:text-teal-700">
                    01234 567890
                  </a>
                </p>
              </address>
            </div>
          </div>
          <div className="mt-12 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500 font-medium tracking-wide">
            <p>© 2025 RIVERSIDE RUGBY CLUB. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

