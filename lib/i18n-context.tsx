"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Language } from "./i18n"
import { translations } from "./i18n"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

// Detect browser language and map to supported languages
function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return "en"

  const browserLang = navigator.language.toLowerCase()

  // Map browser language codes to our supported languages
  const languageMap: Record<string, Language> = {
    uk: "uk",
    "uk-ua": "uk",
    en: "en",
    "en-us": "en",
    "en-gb": "en",
    "en-ca": "en",
    fr: "fr",
    "fr-fr": "fr",
    "fr-ca": "fr",
    pl: "pl",
    "pl-pl": "pl",
    es: "es",
    "es-es": "es",
    "es-mx": "es",
    pt: "pt",
    "pt-pt": "pt",
    "pt-br": "pt",
    de: "de",
    "de-de": "de",
    "de-at": "de",
    "de-ch": "de",
  }

  // Try exact match first
  if (languageMap[browserLang]) {
    return languageMap[browserLang]
  }

  // Try language prefix (e.g., "en" from "en-AU")
  const langPrefix = browserLang.split("-")[0]
  if (languageMap[langPrefix]) {
    return languageMap[langPrefix]
  }

  // Default to English if no match found
  return "en"
}

export function I18nProvider({
  children,
  initialLanguage = "uk",
}: { children: React.ReactNode; initialLanguage?: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("language") as Language
    if (saved && translations[saved]) {
      setLanguage(saved)
    } else {
      // Detect browser language if no saved language
      const detectedLang = detectBrowserLanguage()
      setLanguage(detectedLang)
      localStorage.setItem("language", detectedLang)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      <HydrationBoundary mounted={mounted}>{children}</HydrationBoundary>
    </I18nContext.Provider>
  )
}

function HydrationBoundary({ children, mounted }: { children: React.ReactNode; mounted: boolean }) {
  if (!mounted) {
    return <>{children}</>
  }
  return <>{children}</>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
