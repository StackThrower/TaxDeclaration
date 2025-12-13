"use client"

import { Header } from "@/components/header"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"

type Props = {
  locale: string
}

export default function AboutPageClient({ locale }: Props) {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <AboutSection />
      <Footer />
    </main>
  )
}

