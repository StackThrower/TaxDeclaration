"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n-context"
import { t } from "@/lib/i18n"

export function Hero() {
  const { language } = useI18n()

  return (
    <section className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            {t(language, "hero.title")} <span className="text-primary">{t(language, "hero.highlight")}</span>
          </h2>
          <p className="text-lg text-foreground/70 text-balance">{t(language, "hero.description")}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            {t(language, "hero.start")}
          </Button>
          <Button size="lg" variant="outline">
            {t(language, "hero.learn")}
          </Button>
        </div>
      </div>
    </section>
  )
}
