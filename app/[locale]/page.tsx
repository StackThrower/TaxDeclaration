"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { FormsSection } from "@/components/forms-section"
import { Footer } from "@/components/footer"
import { useI18n } from "@/lib/i18n-context"
import { getCountry, getDefaultCountryForLanguage, type CountryCode } from "@/lib/countries"
import { type Language } from "@/lib/i18n"

export default function LocalePage() {
  const params = useParams()
  const router = useRouter()
  const { language, setLanguage } = useI18n()

  const locale = params.locale as string

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

