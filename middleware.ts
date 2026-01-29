import { authMiddleware, clerkClient } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export default authMiddleware({
  publicRoutes: [
    '/sign-in(.*)',
    '/sign-up(.*)',
  ],

  async afterAuth(auth, req) {
    const { userId } = auth
    const path = req.nextUrl.pathname

    // Sign-in/sign-up pages are public
    if (auth.isPublicRoute) {
      return NextResponse.next()
    }

    // Admin routes require authentication + email allowlist
    if (path.startsWith('/admin')) {
      const allowedEmails = process.env.ALLOWED_EMAILS || ''

      if (!userId) {
        const signInUrl = new URL('/sign-in', req.url)
        signInUrl.searchParams.set('redirect_url', req.url)
        return NextResponse.redirect(signInUrl)
      }

      try {
        const user = await clerkClient.users.getUser(userId)
        const userEmail = user.emailAddresses[0]?.emailAddress

        if (!userEmail || !allowedEmails.includes(userEmail)) {
          return NextResponse.redirect(new URL('/', req.url))
        }

        return NextResponse.next()
      } catch (error) {
        console.error('Error in auth process:', error)
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    return NextResponse.next()
  },
})

// Only run middleware on routes that actually need authentication.
// All public pages (/, /news, /gallery, etc.) bypass Clerk entirely,
// which prevents 401 errors for Googlebot and other crawlers.
export const config = {
  matcher: [
    '/admin(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
  ],
}
