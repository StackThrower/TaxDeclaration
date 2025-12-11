"use client"

import { useI18n } from "@/lib/i18n-context"
import { t } from "@/lib/i18n"

export function Footer() {
  const { language } = useI18n()

  return (
    <footer className="bg-secondary text-secondary-foreground py-12 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">{t(language, "footer.about")}</h3>
            <ul className="space-y-2 text-sm opacity-75">
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
            <h3 className="font-semibold mb-4">Documents</h3>
            <ul className="space-y-2 text-sm opacity-75">
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
            <h3 className="font-semibold mb-4">Help</h3>
            <ul className="space-y-2 text-sm opacity-75">
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
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm opacity-75">
              <li>Email: support@pdv.ua</li>
              <li>Phone: +38 (044) 123-45-67</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-secondary/50 pt-8 text-center text-sm opacity-75">
          <p>{t(language, "footer.copyright")}</p>
        </div>
      </div>
    </footer>
  )
}
