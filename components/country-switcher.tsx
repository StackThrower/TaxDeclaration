"use client"

import { useParams, useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MapPin } from "lucide-react"
import { countries, getCountryCodes, type CountryCode } from "@/lib/countries"

export function CountrySwitcher() {
  const { language } = useI18n()
  const router = useRouter()
  const params = useParams()

  // Parse current locale to get country code
  const locale = params?.locale as string
  const currentCountryCode = (locale?.split("-")[1] as CountryCode) || "ua"
  const currentCountry = countries[currentCountryCode]

  const handleCountryChange = (countryCode: CountryCode) => {
    // Navigate to locale-specific page with language-country format
    router.push(`/${language}-${countryCode}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">{currentCountry?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {getCountryCodes().map((code) => {
          const country = countries[code]
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => handleCountryChange(code)}
              className={currentCountryCode === code ? "bg-accent" : ""}
            >
              <span className="mr-2">{country.flag}</span>
              {country.name}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

