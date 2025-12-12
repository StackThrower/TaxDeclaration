"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormF0100214 } from "./forms/form-f0100214"
import { FormF0121214 } from "./forms/form-f0121214"
import { FileText, CheckCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { t } from "@/lib/i18n"

export function FormsSection() {
  const [activeTab, setActiveTab] = useState("f0100214")
  const { language } = useI18n()

  return (
    <section id="forms" className="py-12 md:py-16 px-4 max-w-6xl mx-auto">
      <div className="space-y-6 md:space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">{t(language, "forms.title")}</h2>
          <p className="text-sm md:text-base text-foreground/70 max-w-2xl mx-auto px-4">
            {t(language, "forms.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="border-border hover:border-primary/50 transition-colors">
            <CardHeader className="space-y-1.5">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <FileText className="w-5 h-5 flex-shrink-0 text-primary" />
                <span>{t(language, "form.f0100214.title")}</span>
              </CardTitle>
              <CardDescription className="text-sm">
                {t(language, "form.f0100214.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{t(language, "form.f0100214.content")}</p>
              <ul className="text-sm space-y-2 text-foreground/70">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 text-primary mt-0.5" />
                  <span>{t(language, "form.f0100214.property")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 text-primary mt-0.5" />
                  <span>{t(language, "form.f0100214.income")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 text-primary mt-0.5" />
                  <span>{t(language, "form.f0100214.expenses")}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border hover:border-accent/50 transition-colors">
            <CardHeader className="space-y-1.5">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <FileText className="w-5 h-5 flex-shrink-0 text-accent" />
                <span>{t(language, "form.f0121214.title")}</span>
              </CardTitle>
              <CardDescription className="text-sm">
                {t(language, "form.f0121214.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{t(language, "form.f0121214.content")}</p>
              <ul className="text-sm space-y-2 text-foreground/70">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 text-accent mt-0.5" />
                  <span>{t(language, "form.f0121214.income")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 text-accent mt-0.5" />
                  <span>{t(language, "form.f0121214.military")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 text-accent mt-0.5" />
                  <span>{t(language, "form.f0121214.calculation")}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-muted h-auto">
            <TabsTrigger value="f0100214" className="text-sm md:text-base py-2">
              F0100214
            </TabsTrigger>
            <TabsTrigger value="f0121214" className="text-sm md:text-base py-2">
              F0121214
            </TabsTrigger>
          </TabsList>

          <TabsContent value="f0100214" className="mt-6 md:mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">{t(language, "form.f0100214.full")}</CardTitle>
                <CardDescription className="text-sm">{t(language, "form.f0100214.period")}</CardDescription>
              </CardHeader>
              <CardContent className="px-3 md:px-6">
                <FormF0100214 />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="f0121214" className="mt-6 md:mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">{t(language, "form.f0121214.full")}</CardTitle>
                <CardDescription className="text-sm">{t(language, "form.f0121214.period")}</CardDescription>
              </CardHeader>
              <CardContent className="px-3 md:px-6">
                <FormF0121214 />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
