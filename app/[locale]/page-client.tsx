"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { FormsSection } from "@/components/forms-section"
import { Footer } from "@/components/footer"
import { useI18n } from "@/lib/i18n-context"
import { getCountry } from "@/lib/countries"
import { generateSEOMetadata } from "@/lib/seo-metadata"

// The project is Ukrainian-only; the single supported locale is "uk-ua".
export default function LocalePageClient({ locale }: { locale: string }) {
  const router = useRouter()
  const { language, setLanguage } = useI18n()

  useEffect(() => {
    // Any locale other than the Ukrainian one redirects to it.
    if (locale?.toLowerCase() !== "uk-ua") {
      router.replace("/uk-ua")
      return
    }

    if (language !== "uk") {
      setLanguage("uk")
    }

    // Update document title and meta description dynamically
    const seo = generateSEOMetadata("ua", "uk")
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

  const country = getCountry("ua")

  if (!country || locale?.toLowerCase() !== "uk-ua") {
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

