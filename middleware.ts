import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// The project is Ukrainian-only.
function getLanguageFromPath(_pathname: string): string {
  return 'uk'
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Redirect specific URLs to homepage
  const redirectUrls = [
    '/tag/etf',
    '/en-us/the-role-of-technology-for-stocks-in-shaping-the-u-s-stock-market',
    '/en-us/tag/savings',
    '/en-us/home'
  ]

  if (redirectUrls.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Clone the response
  const response = NextResponse.next()

  // Allow indexing by search engines
  // Remove noindex directives and allow caching
  response.headers.set('X-Robots-Tag', 'index, follow')

  // Set reasonable cache control (allow caching)
  response.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate')

  // Determine language from URL prefix and add to header
  const lang = getLanguageFromPath(pathname)
  response.headers.set('x-lang', lang)

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

