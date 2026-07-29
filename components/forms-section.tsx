"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormF0100214 } from "./forms/form-f0100214"
import { FormF0121214 } from "./forms/form-f0121214"
import { FileText, CheckCircle, AlertCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { t } from "@/lib/i18n"
import { type Country } from "@/lib/countries"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FormsSectionProps {
  country: Country
}

export function FormsSection({ country }: FormsSectionProps) {
  const [activeTab, setActiveTab] = useState(country.taxForms[0]?.id || "f0100214")
  const { language } = useI18n()
  const tabsRef = useRef<HTMLDivElement>(null)

  const handleCardClick = (formId: string) => {
    setActiveTab(formId)
    // Scroll to the tabs section with smooth animation
    setTimeout(() => {
      tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  return (
    <section id="forms" className="py-12 md:py-16 px-4 max-w-6xl mx-auto">
      <div className="space-y-6 md:space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">
            {t(language, "forms.title")} - {country.flag} {country.name}
          </h2>
          <p className="text-sm md:text-base text-foreground/70 max-w-2xl mx-auto px-4">
            {t(language, "forms.subtitle")}
          </p>
        </div>

        <div className="gap-4 md:gap-6 mb-6 md:mb-8">
          {country.taxForms.map((form, index) => (
            <Card
              key={form.id}
              className="mt-5 border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => handleCardClick(form.id)}
            >
              <CardHeader className="space-y-1.5">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <FileText className={`w-5 h-5 flex-shrink-0 ${index === 0 ? "text-primary" : "text-accent"}`} />
                  <span>{form.title}</span>
                </CardTitle>
                <CardDescription className="text-sm">
                  {form.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground/70">Year: {form.year}</p>
                <ul className="text-sm space-y-2 text-foreground/70">
                  {form.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${index === 0 ? "text-primary" : "text-accent"} mt-0.5`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {country.taxForms.length > 0 && (
          <Tabs ref={tabsRef} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full max-w-md mx-auto bg-muted h-auto`} style={{ gridTemplateColumns: `repeat(${Math.min(country.taxForms.length, 3)}, 1fr)` }}>
              {country.taxForms.slice(0, 3).map((form) => (
                <TabsTrigger key={form.id} value={form.id} className="text-sm md:text-base py-2">
                  {form.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {country.taxForms.map((form) => (
              <TabsContent key={form.id} value={form.id} className="mt-6 md:mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">{form.title}</CardTitle>
                    <CardDescription className="text-sm">{form.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-3 md:px-6">
                    {form.id === "f0100214" && <FormF0100214 />}
                    {form.id === "f0121214" && <FormF0121214 />}
                    {!["f0100214", "f0121214"].includes(form.id) && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Form implementation coming soon. This is a placeholder for {form.title}.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  )
}
