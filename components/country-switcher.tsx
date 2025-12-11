"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n-context"
import { t } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MapPin } from "lucide-react"

type Country = "ukraine" | "poland" | "france" | "germany" | "portugal" | "spain" | "sweden" | "england" | "usa" | "canada"

const countryFlags: Record<Country, string> = {
  ukraine: "🇺🇦",
  poland: "🇵🇱",
  france: "🇫🇷",
  germany: "🇩🇪",
  portugal: "🇵🇹",
  spain: "🇪🇸",
  sweden: "🇸🇪",
  england: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  usa: "🇺🇸",
  canada: "🇨🇦",
}

const countries: Country[] = ["ukraine", "poland", "france", "germany", "portugal", "spain", "sweden", "england", "usa", "canada"]

export function CountrySwitcher() {
  const { language } = useI18n()
  const [selectedCountry, setSelectedCountry] = useState<Country>("ukraine")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">{countryFlags[selectedCountry]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {countries.map((country) => (
          <DropdownMenuItem
            key={country}
            onClick={() => setSelectedCountry(country)}
            className={selectedCountry === country ? "bg-accent" : ""}
          >
            {t(language, `country.${country}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

