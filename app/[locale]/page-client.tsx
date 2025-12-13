"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { FormsSection } from "@/components/forms-section"
import { Footer } from "@/components/footer"
import { useI18n } from "@/lib/i18n-context"
import { getCountry, getDefaultCountryForLanguage, type CountryCode } from "@/lib/countries"
import { type Language } from "@/lib/i18n"
import { generateSEOMetadata } from "@/lib/seo-metadata"

export default function LocalePageClient({ locale }: { locale: string }) {
  const router = useRouter()
  const { language, setLanguage } = useI18n()

  useEffect(() => {
    if (!locale) {
      // Redirect to default locale
      const defaultCountry = getDefaultCountryForLanguage(language)
      router.replace(`/${language}-${defaultCountry}`)
      return
    }

    // Parse locale (e.g., "en-us" -> ["en", "us"])
    const parts = locale.toLowerCase().split("-")

    if (parts.length !== 2) {
      // Invalid locale format, redirect to default
      const defaultCountry = getDefaultCountryForLanguage(language)
      router.replace(`/${language}-${defaultCountry}`)
      return
    }

    const [langCode, countryCode] = parts

    // Validate country code
    const country = getCountry(countryCode)
    if (!country) {
      // Invalid country, redirect to default
      const defaultCountry = getDefaultCountryForLanguage(language)
      router.replace(`/${langCode}-${defaultCountry}`)
      return
    }

    // Update language if different
    if (langCode !== language) {
      setLanguage(langCode as Language)
    }

    // Update document title and meta description dynamically
    const seo = generateSEOMetadata(countryCode as CountryCode, langCode as Language)
    document.title = seo.title

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', seo.description)
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', seo.keywords.join(', '))
    }

    // Update Open Graph title and description
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', seo.title)
    }

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', seo.description)
    }

    // Update Twitter title and description
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle) {
      twitterTitle.setAttribute('content', seo.title)
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', seo.description)
    }
  }, [locale, language, setLanguage, router])

  // Get current country from locale
  const countryCode = locale?.split("-")[1] as CountryCode
  const country = getCountry(countryCode)

  if (!country) {
    return null // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FormsSection country={country} />
      <Footer />
    </main>
  )
}

