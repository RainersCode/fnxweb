import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Server-side admin emails (for API routes and middleware)
export const allowedEmails = process.env.ALLOWED_EMAILS

// Client-side admin emails (for navigation and UI)
const clientAllowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS

export const isAdmin = (email: string | null | undefined): boolean => {
  if (!email) return false
  // Use client-side env var if available (client components), otherwise server-side
  const adminEmails = clientAllowedEmails || allowedEmails
  if (!adminEmails) return false
  return adminEmails.split(',').map(e => e.trim().toLowerCase()).includes(email.toLowerCase())
}
