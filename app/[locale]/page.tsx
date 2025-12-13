import type { Metadata } from "next"
import LocalePageClient from "./page-client"
import { getCountry, type CountryCode } from "@/lib/countries"
import { type Language } from "@/lib/i18n"
import { generatePageMetadata } from "@/lib/seo-metadata"
import { generateWebsiteSchema, generateOrganizationSchema } from "@/lib/seo"

type Props = {
  params: Promise<{ locale: string }>
}

// Generate dynamic metadata based on locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  if (!locale) {
    return {
      title: "Monegoo - Tax Declaration",
      description: "Online system for filing tax declarations",
    }
  }

  // Parse locale (e.g., "en-us" -> ["en", "us"])
  const parts = locale.toLowerCase().split("-")

  if (parts.length !== 2) {
    return {
      title: "Monegoo - Tax Declaration",
      description: "Online system for filing tax declarations",
    }
  }

  const [langCode, countryCode] = parts

  // Validate country code
  const country = getCountry(countryCode)
  if (!country) {
    return {
      title: "Monegoo - Tax Declaration",
      description: "Online system for filing tax declarations",
    }
  }

  // Generate SEO-friendly metadata
  return generatePageMetadata(countryCode as CountryCode, langCode as Language, locale)
}


export default async function LocalePage({ params }: Props) {
  const { locale } = await params

  // Parse locale
  const parts = locale?.toLowerCase().split("-") || []
  const [langCode, countryCode] = parts
  const country = getCountry(countryCode)

  // Generate schema.org structured data
  const websiteSchema = generateWebsiteSchema({
    name: "Monegoo Tax Declaration",
    url: "https://monegoo.com",
    description: "Online system for filing tax declarations on property status, income, and investment transactions",
  })

  const organizationSchema = generateOrganizationSchema({
    name: "Monegoo",
    url: "https://monegoo.com",
    logo: "https://monegoo.com/placeholder-logo.png",
    description: "Free and open tax declaration system for everyone",
  })

  return (
    <>
      {/* Schema.org JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <LocalePageClient locale={locale} />
    </>
  )
}

