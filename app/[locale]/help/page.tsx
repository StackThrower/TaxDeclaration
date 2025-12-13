import type { Metadata } from "next"
import { getCountry, type CountryCode } from "@/lib/countries"
import { type Language } from "@/lib/i18n"
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
  return <HelpPageClient locale={locale} />
}



