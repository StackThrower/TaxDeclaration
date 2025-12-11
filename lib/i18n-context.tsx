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
