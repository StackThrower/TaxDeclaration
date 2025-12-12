"use client"

import { useParams, useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n-context"
import { languages, type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { type CountryCode } from "@/lib/countries"

const flagMap: Record<Language, string> = {
  uk: "🇺🇦",
  en: "🇬🇧",
  fr: "🇫🇷",
  pl: "🇵🇱",
  es: "🇪🇸",
  pt: "🇵🇹",
  de: "🇩🇪",
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n()
  const router = useRouter()
  const params = useParams()

  // Parse current locale to get country code
  const locale = params?.locale as string
  const currentCountryCode = locale?.split("-")[1] as CountryCode || "ua"

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    // Navigate to new locale with language-country format
    router.push(`/${lang}-${currentCountryCode}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline uppercase">{language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.entries(languages) as [Language, string][]).map(([lang, name]) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={language === lang ? "bg-accent" : ""}
          >
            <span className="mr-2">{flagMap[lang]}</span>
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
