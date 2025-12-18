import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "next-themes"
import { I18nProvider } from "@/lib/i18n-context"
import { DynamicHtmlLang } from "@/components/dynamic-html-lang"
import { GoogleAnalytics } from "@/components/google-analytics"
import { CookieConsent } from "@/components/cookie-consent"
import { PwaInstallPrompt } from "@/components/pwa-install-prompt"
import { headers } from "next/headers"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL("https://monegoo.com"),
  title: {
    default: "Monegoo - F0100214 & F0121214",
    template: "%s | Monegoo",
  },
  description: "Online system for filing tax declarations on property status, income, and investment transactions",
  generator: "Next.js",
  applicationName: "Monegoo Tax Declaration",
  referrer: "origin-when-cross-origin",
  keywords: ["tax declaration", "F0100214", "F0121214", "income declaration", "property status", "tax calculator", "online tax filing"],
  authors: [{ name: "Monegoo", url: "https://monegoo.com" }],
  creator: "Monegoo",
  publisher: "Monegoo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // PWA manifest
  manifest: "/manifest.json",
  // Allow search engines to index
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Open Graph
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "https://monegoo.com",
    title: "Monegoo - F0100214 & F0121214",
    description: "Online system for filing tax declarations on property status, income, and investment transactions",
    siteName: "Monegoo Tax Declaration",
    images: [
      {
        url: "/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "Monegoo Tax Declaration",
      },
    ],
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Monegoo - F0100214 & F0121214",
    description: "Online system for filing tax declarations on property status, income, and investment transactions",
    images: ["/placeholder-logo.png"],
    creator: "@monegoo",
  },
  // Icons
  icons: {
    icon: [
      {
        url: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  // Alternate languages
  alternates: {
    canonical: "https://monegoo.com",
    languages: {
      "uk-UA": "/uk-ua",
      "en-US": "/en-us",
      "en-GB": "/en-gb",
      "en-CA": "/en-ca",
      "fr-FR": "/fr-fr",
      "pl-PL": "/pl-pl",
      "es-ES": "/es-es",
      "pt-PT": "/pt-pt",
      "de-DE": "/de-de",
      "sv-SE": "/sv-se",
    },
  },
  // Additional metadata
  category: "Finance",
  // Verification (можно добавить позже)
  // verification: {
  //   google: "google-site-verification-code",
  //   yandex: "yandex-verification-code",
  // },
}

// Extract language from URL path (e.g., /uk-ua -> uk, /en-us -> en)
function getLanguageFromPath(pathname: string): string {
  const localeMatch = pathname.match(/^\/([a-z]{2})-[a-z]{2}/)
  return localeMatch ? localeMatch[1] : 'en'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get current pathname from headers (SSR)
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''

  // Extract language code from pathname (e.g., /uk-ua -> uk, /en-us -> en)
  const lang = getLanguageFromPath(pathname)

  // Generate structured data for Organization and WebSite
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Monegoo",
    "url": "https://monegoo.com",
    "logo": "https://monegoo.com/placeholder-logo.png",
    "description": "Free and open tax declaration system for everyone",
    "sameAs": [
      "https://twitter.com/monegoo",
    ],
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Monegoo Tax Declaration",
    "url": "https://monegoo.com",
    "description": "Online system for filing tax declarations on property status, income, and investment transactions",
    "inLanguage": lang,
    "publisher": {
      "@type": "Organization",
      "name": "Monegoo",
      "url": "https://monegoo.com",
    },
  }

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Monegoo Tax Declaration",
    "url": "https://monegoo.com",
    "description": "Online system for filing tax declarations on property status, income, and investment transactions",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Fill tax declarations online",
      "F0100214 - Property and Income Declaration",
      "F0121214 - Tax Calculation Annex",
      "Export to PDF",
      "Privacy-first: All data stays in your browser",
    ],
  }

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Monegoo" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Monegoo" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Structured Data - WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
        />
        {/* Theme initialization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                
                if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                  // Save system preference on first visit
                  if (!savedTheme) {
                    localStorage.setItem('theme', 'system');
                  }
                } else {
                  document.documentElement.classList.remove('dark');
                  // Save system preference on first visit
                  if (!savedTheme) {
                    localStorage.setItem('theme', 'system');
                  }
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        <GoogleAnalytics />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <I18nProvider>
            <DynamicHtmlLang />
            {children}
            <CookieConsent />
            <PwaInstallPrompt />
            <Analytics />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
