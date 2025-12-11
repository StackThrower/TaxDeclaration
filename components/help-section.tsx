"use client"

import { useI18n } from "@/lib/i18n-context"
import { t } from "@/lib/i18n"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, FileText, Edit, Download, Shield, MessageSquare } from "lucide-react"

export function HelpSection() {
  const { language } = useI18n()

  const helpItems = [
    {
      id: "getting-started",
      icon: HelpCircle,
      title: t(language, "help.getting-started.title"),
      description: t(language, "help.getting-started.description"),
      content: t(language, "help.getting-started.content"),
    },
    {
      id: "forms",
      icon: FileText,
      title: t(language, "help.forms.title"),
      description: t(language, "help.forms.description"),
      content: t(language, "help.forms.content"),
    },
    {
      id: "filling",
      icon: Edit,
      title: t(language, "help.filling.title"),
      description: t(language, "help.filling.description"),
      content: t(language, "help.filling.content"),
    },
    {
      id: "export",
      icon: Download,
      title: t(language, "help.export.title"),
      description: t(language, "help.export.description"),
      content: t(language, "help.export.content"),
    },
    {
      id: "privacy",
      icon: Shield,
      title: t(language, "help.privacy.title"),
      description: t(language, "help.privacy.description"),
      content: t(language, "help.privacy.content"),
    },
    {
      id: "support",
      icon: MessageSquare,
      title: t(language, "help.support.title"),
      description: t(language, "help.support.description"),
      content: t(language, "help.support.content"),
    },
  ]

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t(language, "help.title")}</h1>
          <p className="text-xl text-muted-foreground mb-2">{t(language, "help.subtitle")}</p>
          <p className="text-muted-foreground">{t(language, "help.intro")}</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {helpItems.map((item) => {
            const Icon = item.icon
            return (
              <AccordionItem key={item.id} value={item.id} className="border rounded-lg">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <div className="flex items-center gap-4 text-left">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pl-14 text-muted-foreground">
                    {item.content}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        <Card className="mt-12 bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {t(language, "help.support.title")}
            </CardTitle>
            <CardDescription>
              {t(language, "help.support.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t(language, "help.support.content")}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

