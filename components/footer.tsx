"use client"

import { useI18n } from "@/lib/i18n-context"
import { t } from "@/lib/i18n"
import { countries, type CountryCode } from "@/lib/countries"
import { useState } from "react"
import { useParams } from "next/navigation"
import { ChevronDown, ChevronUp } from "lucide-react"

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

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
              <li>
                <a href={`/${locale}/knowledge`} className="hover:opacity-100 transition-opacity hover:underline">
                  {t(language, "knowledge.base")}
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
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://www.linkedin.com/groups/16413023/"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-75 hover:opacity-100 transition-opacity"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/channel/UC-EGlDZD2b8cUOq6oDhR2Bw"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-75 hover:opacity-100 transition-opacity"
                aria-label="YouTube"
              >
                <YouTubeIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-secondary/50 pt-6 md:pt-8 text-center text-xs md:text-sm opacity-75">
          <p>{t(language, "footer.copyright")}</p>
        </div>
      </div>
    </footer>
  )
}
