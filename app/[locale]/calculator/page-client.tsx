"use client"

import { Header } from "@/components/header"
import { TaxCalculator } from "@/components/tax-calculator"
import { Footer } from "@/components/footer"
import { getCountry, type CountryCode } from "@/lib/countries"

type Props = {
  locale: string
}

export default function CalculatorPageClient({ locale }: Props) {
  // Get current country from locale
  const countryCode = locale?.split("-")[1] as CountryCode
  const country = getCountry(countryCode)

  // Default to 'ua' if country not found
  const validCountryCode = country ? countryCode : "ua"

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <TaxCalculator countryCode={validCountryCode} />
      <Footer />
    </main>
  )
}
