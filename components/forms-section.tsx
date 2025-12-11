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
    <section id="forms" className="py-16 px-4 max-w-6xl mx-auto">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">{t(language, "forms.title")}</h2>
          <p className="text-foreground/70">{t(language, "forms.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-border hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {t(language, "form.f0100214.title")}
              </CardTitle>
              <CardDescription>{t(language, "form.f0100214.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{t(language, "form.f0100214.content")}</p>
              <ul className="text-sm space-y-2 text-foreground/70">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {t(language, "form.f0100214.property")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {t(language, "form.f0100214.income")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {t(language, "form.f0100214.expenses")}
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border hover:border-accent/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                {t(language, "form.f0121214.title")}
              </CardTitle>
              <CardDescription>{t(language, "form.f0121214.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{t(language, "form.f0121214.content")}</p>
              <ul className="text-sm space-y-2 text-foreground/70">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  {t(language, "form.f0121214.income")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  {t(language, "form.f0121214.military")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  {t(language, "form.f0121214.calculation")}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted">
            <TabsTrigger value="f0100214">F0100214</TabsTrigger>
            <TabsTrigger value="f0121214">F0121214</TabsTrigger>
          </TabsList>

          <TabsContent value="f0100214" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>{t(language, "form.f0100214.full")}</CardTitle>
                <CardDescription>{t(language, "form.f0100214.period")}</CardDescription>
              </CardHeader>
              <CardContent>
                <FormF0100214 />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="f0121214" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>{t(language, "form.f0121214.full")}</CardTitle>
                <CardDescription>{t(language, "form.f0121214.period")}</CardDescription>
              </CardHeader>
              <CardContent>
                <FormF0121214 />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
