"use client"

import { useI18n } from "@/lib/i18n-context"
import { t } from "@/lib/i18n"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Lightbulb, Code, Mail, Shield, DollarSign, FileText, Calculator, Languages } from "lucide-react"

export function AboutSection() {
  const { language } = useI18n()

  const features = [
    {
      icon: Shield,
      title: t(language, "about.features.privacy"),
    },
    {
      icon: DollarSign,
      title: t(language, "about.features.free"),
    },
    {
      icon: Code,
      title: t(language, "about.features.opensource"),
    },
    {
      icon: Languages,
      title: t(language, "about.features.multilang"),
    },
    {
      icon: Calculator,
      title: t(language, "about.features.calculator"),
    },
    {
      icon: FileText,
      title: t(language, "about.features.forms"),
    },
  ]

  return (
    <section className="py-12 md:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">{t(language, "about.title")}</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-2">{t(language, "about.subtitle")}</p>
          <p className="text-sm md:text-base text-muted-foreground px-4 max-w-3xl mx-auto">
            {t(language, "about.intro")}
          </p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* Mission */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                <Target className="w-6 h-6 text-primary flex-shrink-0" />
                <span>{t(language, "about.mission.title")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t(language, "about.mission.description")}
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                <Lightbulb className="w-6 h-6 text-primary flex-shrink-0" />
                <span>{t(language, "about.features.title")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm md:text-base flex-1">{feature.title}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Technology */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                <Code className="w-6 h-6 text-primary flex-shrink-0" />
                <span>{t(language, "about.technology.title")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t(language, "about.technology.description")}
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                <Mail className="w-6 h-6 text-primary flex-shrink-0" />
                <span>{t(language, "about.contact.title")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm md:text-base text-muted-foreground">
                {t(language, "about.contact.description")}
              </p>
              <div className="flex items-center gap-2 text-sm md:text-base">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <a
                  href="mailto:0x01code@gmail.com"
                  className="text-primary hover:underline break-all"
                >
                  0x01code@gmail.com
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

