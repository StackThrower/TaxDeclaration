"use client"

import { Header } from "@/components/header"
import { PrivacySection } from "@/components/privacy-section"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <PrivacySection />
      <Footer />
    </main>
  )
}
