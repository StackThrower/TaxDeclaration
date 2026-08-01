import type { Metadata } from "next"
import { getCountry, type CountryCode } from "@/lib/countries"
import { type Language, t } from "@/lib/i18n"
import { generateAboutMetadata } from "@/lib/seo-metadata"
import AboutPageClient from "./page-client"

type Props = {
  params: Promise<{ locale: string }>
}

// Generate dynamic metadata based on locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  if (!locale) {
    return {
      title: "About - Taxered Tax Declaration",
      description: "Free and open tax declaration system for everyone",
    }
  }

  // Parse locale (e.g., "en-us" -> ["en", "us"])
  const parts = locale.toLowerCase().split("-")

  if (parts.length !== 2) {
    return {
      title: "About - Taxered Tax Declaration",
      description: "Free and open tax declaration system for everyone",
    }
  }

  const [langCode, countryCode] = parts

  // Validate country code
  const country = getCountry(countryCode)
  if (!country) {
    return {
      title: "About - Taxered Tax Declaration",
      description: "Free and open tax declaration system for everyone",
    }
  }

  // Generate SEO-friendly metadata for about page
  return generateAboutMetadata(countryCode as CountryCode, langCode as Language, locale)
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params

  // Parse locale
  const parts = locale?.toLowerCase().split("-") || []
  const [langCode] = parts
  const lang = langCode as Language

  // Generate schema.org WebPage structured data
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": t(lang, "about.title"),
    "description": t(lang, "about.intro"),
    "url": `https://taxered.stackthrow.com/${locale}/about`,
    "inLanguage": langCode,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Taxered Tax Declaration",
      "url": "https://taxered.stackthrow.com"
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `https://taxered.stackthrow.com/${locale}`,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": t(lang, "about.title"),
        "item": `https://taxered.stackthrow.com/${locale}/about`,
      },
    ],
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Taxered",
    "url": "https://taxered.stackthrow.com",
    "logo": "https://taxered.stackthrow.com/placeholder-logo.png",
    "description": "Free and open tax declaration system for everyone",
  }

  return (
    <>
      {/* Schema.org JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <AboutPageClient locale={locale} />
    </>
  )
}

