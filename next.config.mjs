import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  }
});

const CANONICAL_HOST = 'taxered.stackthrow.com';

// Content-Security-Policy.
//
// script-src/style-src keep 'unsafe-inline' because the App Router injects
// inline RSC payload scripts (`self.__next_f.push`) on every page, and the
// theme-init + JSON-LD blocks in app/layout.tsx are inline too. Locking those
// down needs a per-request nonce, which cannot be combined with the shared
// `Cache-Control: public, max-age=3600` that middleware.ts sets on every
// response: a cached document would be served with a stale nonce and every
// script on the page would be blocked. Dropping 'unsafe-inline' therefore has
// to wait until that caching header is scoped down first.
//
// The remaining directives still carry their weight: they stop an injected
// script from loading external code, exfiltrating form data to an arbitrary
// host (connect-src), hijacking relative URLs (base-uri) or retargeting form
// posts (form-action).
// The turbopack dev runtime evaluates modules through eval(), so `next dev`
// white-screens without 'unsafe-eval'. It is never added to production builds.
const devScriptSrc = process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : '';

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${devScriptSrc} https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.clarity.ms https://c.bing.com",
  "font-src 'self' data:",
  // Analytics beacons + the NBU/NBP exchange-rate APIs. Everything else is denied.
  "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.clarity.ms https://c.bing.com https://bank.gov.ua https://api.nbp.pl",
  // blob: is required by the workbox service worker and by the generated PDFs,
  // which are opened via window.open(doc.output('bloburl')).
  "worker-src 'self' blob:",
  "frame-src 'self' blob:",
  "object-src 'self' blob:",
  "manifest-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Don't advertise the framework in every response.
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  // Use webpack for PWA compatibility
  turbopack: {},

  // Security headers and X-Robots-Tag
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Security headers (like WordPress security plugins)
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // The legacy XSS auditor is disabled on purpose: `1; mode=block`
            // introduced its own vulnerabilities and is ignored by modern
            // browsers. CSP above is the real control.
            key: 'X-XSS-Protection',
            value: '0',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // PWA manifest with correct content-type
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      // Service Worker
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ]
  },

  // Permanent redirects for www to non-www and http to https
  async redirects() {
    return [
      // Redirect all monegoo.com pages to taxered.stackthrow.com
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'monegoo.com',
          },
        ],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.monegoo.com',
          },
        ],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
      // NOTE: there is deliberately no rule matching host `taxered.stackthrow.com`.
      // Redirecting the canonical host to itself is an infinite 308 loop, and a
      // permanent redirect gets cached by browsers.
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.taxered.stackthrow.com',
          },
        ],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
      // Redirect http to https. Two things matter here:
      //  - the destination host is hardcoded rather than echoed back from the
      //    request, so a spoofed Host header cannot make this an open redirect;
      //  - it is scoped to the canonical host, so staging/preview deployments
      //    and local runs behind a TLS-terminating proxy (which also send
      //    `x-forwarded-proto: http`) are not force-redirected to production
      //    by a browser-cached 308.
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
          {
            type: 'host',
            value: CANONICAL_HOST,
          },
        ],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true, // 308 redirect
      },
    ]
  },
}

export default withPWA(nextConfig);

