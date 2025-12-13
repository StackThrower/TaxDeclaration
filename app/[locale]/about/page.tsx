import type { Metadata } from "next"
import { getCountry } from "@/lib/countries"
import { type Language, t } from "@/lib/i18n"
import AboutPageClient from "./page-client"

type Props = {
  params: Promise<{ locale: string }>
}

// Generate dynamic metadata based on locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  if (!locale) {
    return {
      title: "About - Monegoo Tax Declaration",
      description: "Free and open tax declaration system for everyone",
    }
  }

  // Parse locale (e.g., "en-us" -> ["en", "us"])
  const parts = locale.toLowerCase().split("-")

  if (parts.length !== 2) {
    return {
      title: "About - Monegoo Tax Declaration",
      description: "Free and open tax declaration system for everyone",
    }
  }

  const [langCode, countryCode] = parts

  // Validate country code
  const country = getCountry(countryCode)
  if (!country) {
    return {
      title: "About - Monegoo Tax Declaration",
      description: "Free and open tax declaration system for everyone",
    }
  }

  const lang = langCode as Language

  // Generate SEO-friendly metadata for about page
  const title = `${t(lang, "about.title")} - Monegoo`
  const description = t(lang, "about.intro")

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        "uk-UA": "/uk-ua/about",
        "en-US": "/en-us/about",
        "fr-FR": "/fr-fr/about",
        "pl-PL": "/pl-pl/about",
        "es-ES": "/es-es/about",
        "pt-PT": "/pt-pt/about",
        "de-DE": "/de-de/about",
      },
    },
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  return <AboutPageClient locale={locale} />
}

