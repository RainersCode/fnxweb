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

    console.log('Initial Auth Debug:', {
      path,
      userId,
      auth: JSON.stringify(auth),
      isPublicPath: isPublic(path),
    })

    // Special case for galleries API - always allow access
    if (path.startsWith('/api/galleries')) {
      console.log('Explicitly allowing galleries API access:', path)
      return NextResponse.next()
    }

    // Allow public paths and static files
    if (isPublic(path) || path.includes('.')) {
      console.log('Allowing public path:', path)
      return NextResponse.next()
    }

    // If trying to access admin routes
    if (path.startsWith('/admin')) {
      console.log('Attempting to access admin route:', path)
      const allowedEmails = process.env.ALLOWED_EMAILS

      // If not authenticated, redirect to sign-in
      if (!userId) {
        console.log('No userId found - redirecting to sign-in')
        const signInUrl = new URL('/sign-in', req.url)
        signInUrl.searchParams.set('redirect_url', req.url)
        return NextResponse.redirect(signInUrl)
      }

      try {
        console.log('Fetching user details for userId:', userId)
        // Get the user's email directly from Clerk
        const user = await clerkClient.users.getUser(userId)
        const userEmail = user.emailAddresses[0]?.emailAddress

        console.log('Auth check details:', {
          userEmail,
          isEmailAllowed: allowedEmails.includes(userEmail || ''),
          hasEmail: !!userEmail,
        })

        // If no email or not authorized
        if (!userEmail || !allowedEmails.includes(userEmail)) {
          console.log('Authorization failed:', {
            email: userEmail,
            isAllowed: allowedEmails.includes(userEmail || ''),
            allowedEmails,
          })
          return NextResponse.redirect(new URL('/', req.url))
        }

        console.log('Authorization successful for:', userEmail)
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
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/webhook/clerk (Clerk webhook)
     * - api/galleries (public API)
     * Match paths starting with /admin (protected routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/webhook/clerk|api/galleries).*)',
    '/admin/:path*', // Explicitly match admin routes
  ],
}
