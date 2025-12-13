import type { Metadata } from "next"
import LocalePageClient from "./page-client"
import { getCountry, type CountryCode } from "@/lib/countries"
import { type Language } from "@/lib/i18n"
import { generatePageMetadata } from "@/lib/seo-metadata"

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
  return <LocalePageClient locale={locale} />
}

