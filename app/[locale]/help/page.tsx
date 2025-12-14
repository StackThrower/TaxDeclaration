import type { Metadata } from "next"
import { getCountry, type CountryCode } from "@/lib/countries"
import { type Language, t } from "@/lib/i18n"
import { generateHelpMetadata } from "@/lib/seo-metadata"
import HelpPageClient from "./page-client"

type Props = {
  params: Promise<{ locale: string }>
}

// Generate dynamic metadata based on locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  if (!locale) {
    return {
      title: "Help - Monegoo Tax Declaration",
      description: "Find answers to questions about using the tax declaration system",
    }
  }

  // Parse locale (e.g., "en-us" -> ["en", "us"])
  const parts = locale.toLowerCase().split("-")

  if (parts.length !== 2) {
    return {
      title: "Help - Monegoo Tax Declaration",
      description: "Find answers to questions about using the tax declaration system",
    }
  }

  const [langCode, countryCode] = parts

  // Validate country code
  const country = getCountry(countryCode)
  if (!country) {
    return {
      title: "Help - Monegoo Tax Declaration",
      description: "Find answers to questions about using the tax declaration system",
    }
  }

  // Generate SEO-friendly metadata for help page
  return generateHelpMetadata(countryCode as CountryCode, langCode as Language, locale)
}

export default async function HelpPage({ params }: Props) {
  const { locale } = await params

  // Parse locale
  const parts = locale?.toLowerCase().split("-") || []
  const [langCode] = parts
  const lang = langCode as Language

  // Generate FAQ schema.org structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t(lang, "help.getting-started.title"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t(lang, "help.getting-started.content")
        }
      },
      {
        "@type": "Question",
        "name": t(lang, "help.forms.title"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t(lang, "help.forms.content")
        }
      },
      {
        "@type": "Question",
        "name": t(lang, "help.filling.title"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t(lang, "help.filling.content")
        }
      },
      {
        "@type": "Question",
        "name": t(lang, "help.export.title"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t(lang, "help.export.content")
        }
      },
      {
        "@type": "Question",
        "name": t(lang, "help.privacy.title"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t(lang, "help.privacy.content")
        }
      },
      {
        "@type": "Question",
        "name": t(lang, "help.support.title"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t(lang, "help.support.content")
        }
      }
    ]
  }

  // Generate WebPage schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": t(lang, "help.title"),
    "description": t(lang, "help.intro"),
    "url": `https://monegoo.com/${locale}/help`,
    "inLanguage": langCode,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Monegoo Tax Declaration",
      "url": "https://monegoo.com"
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
        "item": `https://monegoo.com/${locale}`,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": t(lang, "help.title"),
        "item": `https://monegoo.com/${locale}/help`,
      },
    ],
  }

  return (
    <>
      {/* Schema.org JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <HelpPageClient locale={locale} />
    </>
  )
}



