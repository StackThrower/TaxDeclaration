"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { FileText, Heart, Menu, X, Home, HelpCircle, Calculator, Globe, MapPin } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { t } from "@/lib/i18n"
import { ThemeToggle } from "./theme-toggle"
import { LanguageSwitcher } from "./language-switcher"
import { CountrySwitcher } from "./country-switcher"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "./ui/sheet"
import { Separator } from "./ui/separator"

export function Header() {
  const { language } = useI18n()
  const params = useParams()
  const locale = params?.locale as string || `${language}-ua`
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-secondary text-secondary-foreground sticky top-0 z-50 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-2">
        <Link href={`/${locale}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0">
          <FileText className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-base md:text-xl font-bold truncate">{t(language, "header.title")}</h1>
            <p className="text-xs opacity-75 hidden sm:block">{t(language, "header.subtitle")}</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-6">
          <Link href={`/${locale}#forms`} className="hover:text-accent transition-colors whitespace-nowrap">
            {t(language, "header.forms")}
          </Link>
          <Link href={`/${locale}/calculator`} className="hover:text-accent transition-colors whitespace-nowrap">
            {t(language, "header.calculator")}
          </Link>
          <Link href={`/${locale}/help`} className="hover:text-accent transition-colors whitespace-nowrap">
            {t(language, "header.help")}
          </Link>
        </nav>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="gap-2 whitespace-nowrap"
            asChild
          >
            <a
              href="https://www.paypal.com/donate/?hosted_button_id=RMHSQVH59BVPS"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden lg:inline">{t(language, "header.support")}</span>
            </a>
          </Button>
          <ThemeToggle />
          <CountrySwitcher />
          <LanguageSwitcher />
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[400px] px-0">
              <SheetHeader className="px-6 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <SheetTitle className="text-left text-lg">{t(language, "header.title")}</SheetTitle>
                    <SheetDescription className="text-left text-xs">
                      {t(language, "header.subtitle")}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex flex-col h-[calc(100vh-120px)] px-6 py-6">
                {/* Navigation Links */}
                <nav className="flex flex-col gap-2 mb-6">
                  <Link
                    href={`/${locale}#forms`}
                    className="flex items-center gap-4 px-4 py-3.5 text-base font-medium rounded-lg hover:bg-accent/10 hover:text-accent transition-all duration-200 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <span className="flex-1">{t(language, "header.forms")}</span>
                  </Link>

                  <Link
                    href={`/${locale}/calculator`}
                    className="flex items-center gap-4 px-4 py-3.5 text-base font-medium rounded-lg hover:bg-accent/10 hover:text-accent transition-all duration-200 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Calculator className="w-4 h-4 text-accent" />
                    </div>
                    <span className="flex-1">{t(language, "header.calculator")}</span>
                  </Link>

                  <Link
                    href={`/${locale}/help`}
                    className="flex items-center gap-4 px-4 py-3.5 text-base font-medium rounded-lg hover:bg-accent/10 hover:text-accent transition-all duration-200 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <HelpCircle className="w-4 h-4 text-accent" />
                    </div>
                    <span className="flex-1">{t(language, "header.help")}</span>
                  </Link>
                </nav>

                <Separator className="my-4" />

                {/* Settings Section */}
                <div className="space-y-3 mb-6">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-3">
                    {language === "uk" ? "Налаштування" : "Settings"}
                  </h3>

                  <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
                        <Globe className="w-4 h-4 text-foreground" />
                      </div>
                      <span className="text-sm font-medium">
                        {language === "uk" ? "Мова" : "Language"}
                      </span>
                    </div>
                    <LanguageSwitcher />
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-foreground" />
                      </div>
                      <span className="text-sm font-medium">
                        {language === "uk" ? "Країна" : "Country"}
                      </span>
                    </div>
                    <CountrySwitcher />
                  </div>
                </div>

                {/* Spacer to push button to bottom */}
                <div className="flex-1" />

                {/* Support Button */}
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="default"
                    size="lg"
                    className="gap-3 w-full shadow-lg hover:shadow-xl transition-all duration-200"
                    asChild
                  >
                    <a
                      href="https://www.paypal.com/donate/?hosted_button_id=RMHSQVH59BVPS"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                      <span className="font-semibold">{t(language, "header.support")}</span>
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
