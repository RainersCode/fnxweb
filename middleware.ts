import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/news(.*)',
  '/about(.*)',
  '/team(.*)',
  '/fixtures(.*)',
  '/gallery(.*)',
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
])

// Define admin routes that require special authorization
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname

  // Always allow public routes without any auth check
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Handle admin routes
  if (isAdminRoute(req)) {
    const { userId } = await auth()
    const allowedEmails = process.env.ALLOWED_EMAILS || ''

    // If not authenticated, redirect to sign-in
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return NextResponse.redirect(signInUrl)
    }

    try {
      // Import clerkClient dynamically to avoid issues
      const { clerkClient } = await import('@clerk/nextjs/server')
      const client = await clerkClient()
      const user = await client.users.getUser(userId)
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

  // For any other routes, allow access
  return NextResponse.next()
})

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Skip static files and Next.js internals
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
