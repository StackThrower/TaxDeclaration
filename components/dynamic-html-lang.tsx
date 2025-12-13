"use client"

import { useEffect } from "react"
import { useI18n } from "@/lib/i18n-context"

export function DynamicHtmlLang() {
  const { language } = useI18n()

  useEffect(() => {
    // Update html lang attribute when language changes
    document.documentElement.lang = language
  }, [language])

  return null
}

