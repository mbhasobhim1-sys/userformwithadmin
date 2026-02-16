import { auth } from '@/auth'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Public routes (no auth required) — handle before looking up session
  const publicRoutes = ['/login', '/api/auth']
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
  if (isPublicRoute) {
    return NextResponse.next()
  }

  const session = await auth()

  // If user is not authenticated
  if (!session || !session.user) {
    // Allow public routes
    if (isPublicRoute) {
      return NextResponse.next()
    }

    // For API requests, return JSON 401 instead of redirecting
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Redirect to login for protected non-API routes
    const loginUrl = new URL('/login', request.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user is authenticated but trying to access login page
  if (pathname === '/login') {
    // Redirect to appropriate dashboard based on role
    const dashboardUrl =
      session.user.role === 'admin' ? '/admin' : '/'
    return NextResponse.redirect(new URL(dashboardUrl, request.nextUrl.origin))
  }

  // Admin-only routes
  if (pathname.startsWith('/admin')) {
    if (session.user.role !== 'admin') {
      // For API admin endpoints, return JSON 403
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
      }
      return NextResponse.redirect(new URL('/', request.nextUrl.origin))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|images|public).*)',
  ],
}
