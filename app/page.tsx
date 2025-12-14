"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { FormsSection } from "@/components/forms-section"
import { TaxCalculator } from "@/components/tax-calculator"
import { Footer } from "@/components/footer"
import { useI18n } from "@/lib/i18n-context"
import { getCountry, type CountryCode } from "@/lib/countries"
import { generateSEOMetadata } from "@/lib/seo-metadata"

export default function Home() {
  const { language } = useI18n()
  const [mounted, setMounted] = useState(false)

  // Default country is always Ukraine
  const countryCode: CountryCode = "ua"
  const country = getCountry(countryCode)

  useEffect(() => {
    setMounted(true)

    // Update document title and meta description dynamically based on browser language
    const seo = generateSEOMetadata(countryCode, language)
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

    // Update Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', seo.title)
    }

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', seo.description)
    }

    // Update Twitter
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle) {
      twitterTitle.setAttribute('content', seo.title)
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', seo.description)
    }
  }, [language, countryCode])

  if (!mounted || !country) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FormsSection country={country} />
      <TaxCalculator countryCode={countryCode} />
      <Footer />
    </main>
  )
}


