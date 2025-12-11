"use client"

import Link from "next/link"
import { FileText } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { t } from "@/lib/i18n"
import { ThemeToggle } from "./theme-toggle"
import { LanguageSwitcher } from "./language-switcher"

export function Header() {
  const { language } = useI18n()

  return (
    <header className="bg-secondary text-secondary-foreground sticky top-0 z-50 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <FileText className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">{t(language, "header.title")}</h1>
            <p className="text-xs opacity-75">{t(language, "header.subtitle")}</p>
          </div>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/#forms" className="hover:text-accent transition-colors">
            {t(language, "header.forms")}
          </Link>
          <Link href="/privacy" className="hover:text-accent transition-colors">
            {t(language, "header.info")}
          </Link>
          <Link href="#help" className="hover:text-accent transition-colors">
            {t(language, "header.help")}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
