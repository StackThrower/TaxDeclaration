"use client"

import { useI18n } from "@/lib/i18n-context"
import { t } from "@/lib/i18n"
import { countries, type CountryCode } from "@/lib/countries"
import { useState } from "react"
import { useParams } from "next/navigation"
import { ChevronDown, ChevronUp } from "lucide-react"

export function Footer() {
  const { language } = useI18n()
  const params = useParams()
  const locale = params?.locale as string || `${language}-ua`
  const [expandedCountry, setExpandedCountry] = useState<CountryCode | null>(null)

  return (
    <footer className="bg-secondary text-secondary-foreground py-8 md:py-12 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">{t(language, "footer.about")}</h3>
            <ul className="space-y-2 text-xs md:text-sm opacity-75">
              <li>
                <a href={`/${locale}/about`} className="hover:opacity-100 transition-opacity hover:underline">
                  {t(language, "footer.about")}
                </a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              {Object.values(countries).map((country) => (
                <div key={country.code} className="text-xs md:text-sm">
                  <button
                    onClick={() => setExpandedCountry(expandedCountry === country.code ? null : country.code)}
                    className="flex items-center gap-2 w-full text-left opacity-75 hover:opacity-100 transition-opacity font-medium"
                  >
                    <span>{country.flag} {country.name}</span>
                    {expandedCountry === country.code ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                  {expandedCountry === country.code && (
                    <ul className="mt-2 ml-6 space-y-1 opacity-75">
                      {country.taxForms.map((form) => (
                        <li key={form.id}>
                          <a
                            href={`/${language}-${country.code}#forms`}
                            className="hover:opacity-100 transition-opacity hover:underline"
                          >
                            {form.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Help</h3>
            <ul className="space-y-2 text-xs md:text-sm opacity-75">
              <li>
                <a href={`/${locale}/help`} className="hover:opacity-100 transition-opacity hover:underline">
                  {t(language, "help.title")}
                </a>
              </li>
            </ul>
            <h3 className="font-semibold mb-3 md:mb-4 mt-6 text-sm md:text-base">Contact</h3>
            <ul className="space-y-2 text-xs md:text-sm opacity-75">
              <li className="break-words">Email: 0x01code@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-secondary/50 pt-6 md:pt-8 text-center text-xs md:text-sm opacity-75">
          <p>{t(language, "footer.copyright")}</p>
        </div>
      </div>
    </footer>
  )
}
