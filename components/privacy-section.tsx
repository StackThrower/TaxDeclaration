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
    <section className="py-16 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 text-foreground">{t(language, "privacy.title")}</h1>
          <p className="text-xl text-accent mb-4">{t(language, "privacy.subtitle")}</p>
          <p className="text-foreground/80">{t(language, "privacy.intro")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.key}
                className="bg-secondary p-6 rounded-lg border border-border hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <Icon className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">{t(language, `${feature.key}.title`)}</h3>
                    <p className="text-foreground/70 text-sm">{t(language, `${feature.key}.description`)}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-secondary p-8 rounded-lg border-l-4 border-accent">
          <h2 className="text-2xl font-bold text-foreground mb-4">{t(language, "privacy.contact.title")}</h2>
          <p className="text-foreground/80">{t(language, "privacy.contact.description")}</p>
        </div>
      </div>
    </section>
  )
}
