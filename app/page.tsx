"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n-context"
import { getDefaultCountryForLanguage } from "@/lib/countries"

export default function Home() {
  const router = useRouter()
  const { language } = useI18n()

  useEffect(() => {
    // Redirect to locale-based URL
    const defaultCountry = getDefaultCountryForLanguage(language)
    router.replace(`/${language}-${defaultCountry}`)
  }, [language, router])

  return null
}
