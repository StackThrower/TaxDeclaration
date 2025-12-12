"use client"

import { useI18n } from "@/lib/i18n-context"
import { t } from "@/lib/i18n"
import { Lock, Server, Database, Download, Shield, Cookie } from "lucide-react"

export function PrivacySection() {
  const { language } = useI18n()

  const features = [
    {
      icon: Lock,
      key: "privacy.local",
    },
    {
      icon: Database,
      key: "privacy.storage",
    },
    {
      icon: Server,
      key: "privacy.no-server",
    },
    {
      icon: Download,
      key: "privacy.export",
    },
    {
      icon: Shield,
      key: "privacy.security",
    },
    {
      icon: Cookie,
      key: "privacy.cookies",
    },
  ]

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">{t(language, "privacy.title")}</h1>
          <p className="text-lg md:text-xl text-accent mb-3 md:mb-4">{t(language, "privacy.subtitle")}</p>
          <p className="text-sm md:text-base text-foreground/80 px-4">{t(language, "privacy.intro")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.key}
                className="bg-secondary p-4 md:p-6 rounded-lg border border-border hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-accent mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground mb-1.5 md:mb-2 text-sm md:text-base">
                      {t(language, `${feature.key}.title`)}
                    </h3>
                    <p className="text-foreground/70 text-xs md:text-sm">
                      {t(language, `${feature.key}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-secondary p-6 md:p-8 rounded-lg border-l-4 border-accent">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">
            {t(language, "privacy.contact.title")}
          </h2>
          <p className="text-sm md:text-base text-foreground/80">{t(language, "privacy.contact.description")}</p>
        </div>
      </div>
    </section>
  )
}
