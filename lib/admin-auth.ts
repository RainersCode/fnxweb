import { auth, clerkClient } from '@clerk/nextjs'

type ClerkEmail = { emailAddress: string; verification?: { status?: string | null } | null }

// Exact, case-insensitive match against the comma-separated ALLOWED_EMAILS list
export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const allowed = (process.env.ALLOWED_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return allowed.includes(email.trim().toLowerCase())
}

// A user counts as admin when any of their verified emails is on the list
export function hasAdminEmail(emails: ClerkEmail[]): boolean {
  return emails.some(
    (e) => e.verification?.status === 'verified' && isAllowedAdminEmail(e.emailAddress)
  )
}

// Server-side check for API routes and server components: signed in AND on the allowlist
export async function isAdminRequest(): Promise<boolean> {
  const { userId } = auth()
  if (!userId) return false
  try {
    const user = await clerkClient.users.getUser(userId)
    return hasAdminEmail(user.emailAddresses)
  } catch (error) {
    console.error('Admin check failed:', error)
    return false
  }
}
