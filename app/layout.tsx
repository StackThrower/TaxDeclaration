import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "next-themes"
import { I18nProvider } from "@/lib/i18n-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: {
    default: "Monegoo - F0100214 & F0121214",
    template: "%s | Monegoo",
  },
  description: "Online system for filing tax declarations on property status, income, and investment transactions",
  generator: "Next.js",
  applicationName: "Monegoo Tax Declaration",
  referrer: "origin-when-cross-origin",
  keywords: ["tax declaration", "F0100214", "F0121214", "income declaration", "property status"],
  authors: [{ name: "Monegoo" }],
  creator: "Monegoo",
  publisher: "Monegoo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Block all search engines from indexing
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
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
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/apple-icon.png",
  },
  // Verification (можно добавить позже)
  // verification: {
  //   google: "google-site-verification-code",
  //   yandex: "yandex-verification-code",
  // },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        {/* Block all search engines from indexing */}
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="bingbot" content="noindex, nofollow" />
        <meta name="yandex" content="noindex, nofollow" />

        {/* Prevent page caching */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />

        {/* X-Robots-Tag equivalent */}
        <meta name="rating" content="general" />

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <I18nProvider>
            {children}
            <Analytics />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
