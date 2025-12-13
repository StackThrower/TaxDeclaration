"use client"

import { Header } from "@/components/header"
import { HelpSection } from "@/components/help-section"
import { Footer } from "@/components/footer"

type Props = {
  locale: string
}

export default function HelpPageClient({ locale }: Props) {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HelpSection />
      <Footer />
    </main>
  )
}

