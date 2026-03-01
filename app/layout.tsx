import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
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
  metadataBase: new URL("https://taxered.com"),
  title: {
    default: "Taxered - F0100214 & F0121214",
    template: "%s | Taxered",
  },
  description: "Online system for filing tax declarations on property status, income, and investment transactions",
  generator: "Next.js",
  applicationName: "Taxered Tax Declaration",
  referrer: "origin-when-cross-origin",
  keywords: ["tax declaration", "F0100214", "F0121214", "income declaration", "property status", "tax calculator", "online tax filing"],
  authors: [{ name: "Taxered", url: "https://taxered.com" }],
  creator: "Taxered",
  publisher: "Taxered",
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
    url: "https://taxered.com",
    title: "Taxered - F0100214 & F0121214",
    description: "Online system for filing tax declarations on property status, income, and investment transactions",
    siteName: "Taxered Tax Declaration",
    images: [
      {
        url: "/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "Taxered Tax Declaration",
      },
    ],
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Taxered - F0100214 & F0121214",
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
    canonical: "https://taxered.com",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get language from middleware header
  const headersList = await headers()
  const lang = headersList.get('x-lang') || 'en'

  // Generate structured data for Organization and WebSite
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Taxered",
    "url": "https://taxered.com",
    "logo": "https://taxered.com/placeholder-logo.png",
    "description": "Free and open tax declaration system for everyone",
    "sameAs": [
      "https://twitter.com/monegoo",
    ],
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Taxered Tax Declaration",
    "url": "https://taxered.com",
    "description": "Online system for filing tax declarations on property status, income, and investment transactions",
    "inLanguage": lang,
    "publisher": {
      "@type": "Organization",
      "name": "Taxered",
      "url": "https://taxered.com",
    },
  }

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Taxered Tax Declaration",
    "url": "https://taxered.com",
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
        {/* PWA Manifest - Critical for PWA detection */}
        <link rel="manifest" href="/manifest.json" />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="Taxered" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Taxered" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />

        {/* Additional PWA Icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
        <link rel="shortcut icon" href="/favicon.ico" />

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
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
