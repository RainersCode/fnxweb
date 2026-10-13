import { authMiddleware, clerkClient } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { hasAdminEmail } from '@/lib/admin-auth'

export default authMiddleware({
  publicRoutes: [
    '/sign-in(.*)',
    '/sign-up(.*)',
    // Page views are recorded by every visitor; the admin stats (GET) are checked in the route itself
    '/api/page-views(.*)',
  ],

  async afterAuth(auth, req) {
    const { userId } = auth
    const path = req.nextUrl.pathname

    // Sign-in/sign-up pages are public
    if (auth.isPublicRoute) {
      return NextResponse.next()
    }

    // Admin pages and admin API both require authentication + email allowlist
    const isAdminApi = path.startsWith('/api/admin')
    if (path.startsWith('/admin') || isAdminApi) {
      if (!userId) {
        if (isAdminApi) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const signInUrl = new URL('/sign-in', req.url)
        signInUrl.searchParams.set('redirect_url', req.url)
        return NextResponse.redirect(signInUrl)
      }

      try {
        const user = await clerkClient.users.getUser(userId)
        if (!hasAdminEmail(user.emailAddresses)) {
          return isAdminApi
            ? NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            : NextResponse.redirect(new URL('/', req.url))
        }
        return NextResponse.next()
      } catch (error) {
        console.error('Error in auth process:', error)
        return isAdminApi
          ? NextResponse.json({ error: 'Forbidden' }, { status: 403 })
          : NextResponse.redirect(new URL('/', req.url))
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
    '/api/admin(.*)',
    '/api/page-views(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
  ],
}
