import { authMiddleware, clerkClient } from '@clerk/nextjs'
import { NextResponse } from 'next/server'


const publicPaths = [
  '/articles',
  '/fixtures',
  '/galleries',
  '/team',
  '/contact',
  '/sign-in',
  '/api/webhook/clerk',
  '/api/galleries',
]

const isPublic = (path: string) => {
  // Exact match for homepage
  if (path === '/') return true
  // Check other public paths
  return publicPaths.some((publicPath) => path.startsWith(publicPath))
}

export default authMiddleware({
  async afterAuth(auth, req) {
    const { userId } = auth
    const path = req.nextUrl.pathname

    // Special case for galleries API - always allow access
    if (path.startsWith('/api/galleries')) {
      return NextResponse.next()
    }

    // Allow public paths and static files
    if (isPublic(path) || path.includes('.')) {
      return NextResponse.next()
    }

    // If trying to access admin routes
    if (path.startsWith('/admin')) {
      const allowedEmails = process.env.ALLOWED_EMAILS

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
  publicRoutes: [...publicPaths, '/api/galleries(.*)'],
})

// Stop Middleware running on static files and api routes
export const config = {
  matcher: [
    // Skip all static files (files with extensions like .png, .jpg, .css, .js)
    // Skip _next folder
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
}
