"use client"

import { useI18n } from "@/lib/i18n-context"
import { t } from "@/lib/i18n"

export function Footer() {
  const { language } = useI18n()

  return (
    <footer className="bg-secondary text-secondary-foreground py-8 md:py-12 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">{t(language, "footer.about")}</h3>
            <ul className="space-y-2 text-xs md:text-sm opacity-75">
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity">
                  {t(language, "footer.about")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity">
                  News
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Documents</h3>
            <ul className="space-y-2 text-xs md:text-sm opacity-75">
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity">
                  F0100214
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity">
                  F0121214
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Help</h3>
            <ul className="space-y-2 text-xs md:text-sm opacity-75">
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity">
                  Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Contact</h3>
            <ul className="space-y-2 text-xs md:text-sm opacity-75">
              <li className="break-words">Email: support@pdv.ua</li>
              <li className="whitespace-nowrap">Phone: +38 (044) 123-45-67</li>
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
