import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const allowedEmails = process.env.ALLOWED_EMAILS

export const isAdmin = (email: string | null | undefined): boolean => {
  if (!email || !allowedEmails) return false
  return allowedEmails.includes(email)
}
