import type { Metadata } from "next"
import { getCountry, type CountryCode } from "@/lib/countries"
import { type Language, t } from "@/lib/i18n"
import { generateCalculatorMetadata } from "@/lib/seo-metadata"
import CalculatorPageClient from "./page-client"

type Props = {
  params: Promise<{ locale: string }>
}

// Generate dynamic metadata based on locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  if (!locale) {
    return {
      title: "Tax Calculator - Taxered",
      description: "Calculate your taxes online for different countries",
    }
  }

  // Parse locale (e.g., "en-us" -> ["en", "us"])
  const parts = locale.toLowerCase().split("-")

  if (parts.length !== 2) {
    return {
      title: "Tax Calculator - Taxered",
      description: "Calculate your taxes online for different countries",
    }
  }

  const [langCode, countryCode] = parts

  // Validate country code
  const country = getCountry(countryCode)
  if (!country) {
    return {
      title: "Tax Calculator - Taxered",
      description: "Calculate your taxes online for different countries",
    }
  }

  // Generate SEO-friendly metadata for calculator page
  return generateCalculatorMetadata(countryCode as CountryCode, langCode as Language, locale)
}

export default async function CalculatorPage({ params }: Props) {
  const { locale } = await params

  // Parse locale
  const parts = locale?.toLowerCase().split("-") || []
  const [langCode, countryCode] = parts
  const lang = langCode as Language

  // Generate WebPage schema.org structured data
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": t(lang, "calculator.title"),
    "description": t(lang, "calculator.subtitle"),
    "url": `https://taxered.stackthrow.com/${locale}/calculator`,
    "inLanguage": langCode,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
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
        "name": t(lang, "calculator.title"),
        "item": `https://taxered.stackthrow.com/${locale}/calculator`,
      },
    ],
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
      <CalculatorPageClient locale={locale} />
    </>
  )
}
