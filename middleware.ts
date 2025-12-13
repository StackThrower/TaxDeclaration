import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_request: NextRequest) {
  // Clone the response
  const response = NextResponse.next()

  // Allow indexing by search engines
  // Remove noindex directives and allow caching
  response.headers.set('X-Robots-Tag', 'index, follow')

  // Set reasonable cache control (allow caching)
  response.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate')

  return response
}

// Apply middleware to all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

