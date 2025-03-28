"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-2xl font-bold text-[#006600]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M7 9h10v6H7z" />
          </svg>
          Rugby Club
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-[#006600] hover:underline underline-offset-4"
          >
            Home
          </Link>
          <Link
            href="/articles"
            className="text-sm font-medium hover:text-[#006600] hover:underline underline-offset-4"
          >
            Articles
          </Link>
          <Link
            href="/fixtures"
            className="text-sm font-medium hover:text-[#006600] hover:underline underline-offset-4"
          >
            Fixtures
          </Link>
          <Link
            href="/galleries"
            className="text-sm font-medium hover:text-[#006600] hover:underline underline-offset-4"
          >
            Galleries
          </Link>
          <Link
            href="/team"
            className="text-sm font-medium hover:text-[#006600] hover:underline underline-offset-4"
          >
            Team
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium hover:text-[#006600] hover:underline underline-offset-4"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/login"
            className="hidden md:inline-flex h-9 items-center justify-center rounded-md bg-[#006600] px-4 text-sm font-medium text-white shadow hover:bg-[#005500] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
          >
            Admin Login
          </Link>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isMenuOpen ? "hidden" : "block"}
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isMenuOpen ? "block" : "hidden"}
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="container md:hidden">
          <nav className="flex flex-col gap-4 p-4 border-t">
            <Link
              href="/"
              className="text-sm font-medium hover:text-[#006600]"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/articles"
              className="text-sm font-medium hover:text-[#006600]"
              onClick={() => setIsMenuOpen(false)}
            >
              Articles
            </Link>
            <Link
              href="/fixtures"
              className="text-sm font-medium hover:text-[#006600]"
              onClick={() => setIsMenuOpen(false)}
            >
              Fixtures
            </Link>
            <Link
              href="/galleries"
              className="text-sm font-medium hover:text-[#006600]"
              onClick={() => setIsMenuOpen(false)}
            >
              Galleries
            </Link>
            <Link
              href="/team"
              className="text-sm font-medium hover:text-[#006600]"
              onClick={() => setIsMenuOpen(false)}
            >
              Team
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-[#006600]"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex h-9 items-center justify-center rounded-md bg-[#006600] px-4 text-sm font-medium text-white shadow hover:bg-[#005500] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
} 