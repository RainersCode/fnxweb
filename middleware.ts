import { authMiddleware, clerkClient } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export default authMiddleware({
  // Public routes that don't require authentication - MUST be listed here for Googlebot access
  publicRoutes: [
    '/',
    '/news(.*)',
    '/about(.*)',
    '/team(.*)',
    '/fixtures(.*)',
    '/gallery(.*)',
    '/noteikumi(.*)',
    '/contact(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/articles(.*)',
    '/galleries(.*)',
    '/blog(.*)',
    '/privacy-policy(.*)',
    '/cookies-policy(.*)',
    '/api/webhook/clerk',
    '/api/galleries(.*)',
    '/api/fixtures(.*)',
    '/api/send(.*)',
    '/robots.txt',
    '/sitemap.xml',
    '/opengraph-image(.*)',
    '/icon.png',
    '/apple-icon.png',
    '/favicon.ico',
  ],

  // Routes that completely bypass Clerk - no auth checking at all
  // This is essential for Googlebot and other crawlers to access pages
  ignoredRoutes: [
    '/',
    '/news(.*)',
    '/about(.*)',
    '/team(.*)',
    '/fixtures(.*)',
    '/gallery(.*)',
    '/noteikumi(.*)',
    '/contact(.*)',
    '/blog(.*)',
    '/privacy-policy(.*)',
    '/cookies-policy(.*)',
    '/articles(.*)',
    '/galleries(.*)',
    '/api/webhook/clerk',
    '/api/galleries(.*)',
    '/api/fixtures(.*)',
    '/api/send(.*)',
    '/robots.txt',
    '/sitemap.xml',
    '/favicon.ico',
    '/icon.png',
    '/apple-icon.png',
    '/_next/static(.*)',
    '/_next/image(.*)',
    '/opengraph-image(.*)',
  ],

  async afterAuth(auth, req) {
    const { userId } = auth
    const path = req.nextUrl.pathname

    // Allow all public routes without any checks
    // This ensures Googlebot and other crawlers can access these pages
    if (auth.isPublicRoute) {
      return NextResponse.next()
    }

    // If trying to access admin routes
    if (path.startsWith('/admin')) {
      const allowedEmails = process.env.ALLOWED_EMAILS || ''

      // If not authenticated, redirect to sign-in
      if (!userId) {
        const signInUrl = new URL('/sign-in', req.url)
        signInUrl.searchParams.set('redirect_url', req.url)
        return NextResponse.redirect(signInUrl)
      }

      try {
        // Get the user's email directly from Clerk
        const user = await clerkClient.users.getUser(userId)
        const userEmail = user.emailAddresses[0]?.emailAddress

        // If no email or not authorized
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

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Skip static files and Next.js internals
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
}
