"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n-context"
import { t } from "@/lib/i18n"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calculator, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

// Tax calculation functions for each country
const taxCalculations = {
  ua: (income: number) => {
    // Ukraine: 18% income tax + 5% military tax
    const incomeTax = income * 0.18
    const militaryTax = income * 0.05
    const totalTax = incomeTax + militaryTax
    const netIncome = income - totalTax
    return { incomeTax, militaryTax, totalTax, netIncome, breakdown: [
      { label: "income_tax", value: incomeTax, rate: 18 },
      { label: "military_tax", value: militaryTax, rate: 5 }
    ]}
  },
  pl: (income: number) => {
    // Poland: Progressive tax 12% up to 120,000 PLN, then 32%
    let incomeTax = 0
    const threshold = 120000
    if (income <= threshold) {
      incomeTax = income * 0.12 - 3600 // tax-free allowance
    } else {
      incomeTax = (threshold * 0.12) + ((income - threshold) * 0.32) - 3600
    }
    incomeTax = Math.max(0, incomeTax)

    // Social security (ZUS) approximately 13.71%
    const socialSecurity = income * 0.1371
    const totalTax = incomeTax + socialSecurity
    const netIncome = income - totalTax
    return { incomeTax, socialSecurity, totalTax, netIncome, breakdown: [
      { label: "income_tax", value: incomeTax, rate: income <= threshold ? 12 : 32 },
      { label: "social_security", value: socialSecurity, rate: 13.71 }
    ]}
  },
  fr: (income: number) => {
    // France: Progressive tax system
    let incomeTax = 0
    const brackets = [
      { limit: 10777, rate: 0 },
      { limit: 27478, rate: 0.11 },
      { limit: 78570, rate: 0.30 },
      { limit: 168994, rate: 0.41 },
      { limit: Infinity, rate: 0.45 }
    ]

    let remaining = income
    let prevLimit = 0
    for (const bracket of brackets) {
      if (remaining <= 0) break
      const taxable = Math.min(remaining, bracket.limit - prevLimit)
      incomeTax += taxable * bracket.rate
      remaining -= taxable
      prevLimit = bracket.limit
    }

    // Social contributions approximately 17.2%
    const socialContributions = income * 0.172
    const totalTax = incomeTax + socialContributions
    const netIncome = income - totalTax
    return { incomeTax, socialContributions, totalTax, netIncome, breakdown: [
      { label: "income_tax", value: incomeTax, rate: 0 },
      { label: "social_contributions", value: socialContributions, rate: 17.2 }
    ]}
  },
  de: (income: number) => {
    // Germany: Progressive tax system
    let incomeTax = 0
    const basicAllowance = 10908 // 2024

    if (income <= basicAllowance) {
      incomeTax = 0
    } else if (income <= 62809) {
      // Progressive zone 1
      const y = (income - basicAllowance) / 10000
      incomeTax = (922.98 * y + 1400) * y
    } else if (income <= 277825) {
      // Progressive zone 2
      const z = (income - 62809) / 10000
      incomeTax = (181.19 * z + 2397) * z + 15729.92
    } else {
      // Top rate
      incomeTax = income * 0.45 - 17374.99
    }

    // Social insurance approximately 20%
    const socialInsurance = income * 0.20
    const totalTax = incomeTax + socialInsurance
    const netIncome = income - totalTax
    return { incomeTax, socialInsurance, totalTax, netIncome, breakdown: [
      { label: "income_tax", value: incomeTax, rate: 0 },
      { label: "social_insurance", value: socialInsurance, rate: 20 }
    ]}
  },
  pt: (income: number) => {
    // Portugal: Progressive tax system
    let incomeTax = 0
    const brackets = [
      { limit: 7703, rate: 0.145 },
      { limit: 11623, rate: 0.21 },
      { limit: 16472, rate: 0.265 },
      { limit: 21321, rate: 0.285 },
      { limit: 27146, rate: 0.35 },
      { limit: 39791, rate: 0.37 },
      { limit: 51997, rate: 0.435 },
      { limit: 81199, rate: 0.45 },
      { limit: Infinity, rate: 0.48 }
    ]

    let remaining = income
    let prevLimit = 0
    for (const bracket of brackets) {
      if (remaining <= 0) break
      const taxable = Math.min(remaining, bracket.limit - prevLimit)
      incomeTax += taxable * bracket.rate
      remaining -= taxable
      prevLimit = bracket.limit
    }

    // Social security approximately 11%
    const socialSecurity = income * 0.11
    const totalTax = incomeTax + socialSecurity
    const netIncome = income - totalTax
    return { incomeTax, socialSecurity, totalTax, netIncome, breakdown: [
      { label: "income_tax", value: incomeTax, rate: 0 },
      { label: "social_security", value: socialSecurity, rate: 11 }
    ]}
  },
  es: (income: number) => {
    // Spain: Progressive tax system (state + regional, average)
    let incomeTax = 0
    const brackets = [
      { limit: 12450, rate: 0.19 },
      { limit: 20200, rate: 0.24 },
      { limit: 35200, rate: 0.30 },
      { limit: 60000, rate: 0.37 },
      { limit: 300000, rate: 0.45 },
      { limit: Infinity, rate: 0.47 }
    ]

    let remaining = income
    let prevLimit = 0
    for (const bracket of brackets) {
      if (remaining <= 0) break
      const taxable = Math.min(remaining, bracket.limit - prevLimit)
      incomeTax += taxable * bracket.rate
      remaining -= taxable
      prevLimit = bracket.limit
    }

    // Social security approximately 6.35%
    const socialSecurity = income * 0.0635
    const totalTax = incomeTax + socialSecurity
    const netIncome = income - totalTax
    return { incomeTax, socialSecurity, totalTax, netIncome, breakdown: [
      { label: "income_tax", value: incomeTax, rate: 0 },
      { label: "social_security", value: socialSecurity, rate: 6.35 }
    ]}
  },
  se: (income: number) => {
    // Sweden: Progressive tax system (municipal + state)
    const municipalTax = income * 0.32 // Average municipal tax
    let stateTax = 0

    if (income > 615300) {
      stateTax = (income - 615300) * 0.20
    } else if (income > 540700) {
      stateTax = (income - 540700) * 0.05
    }

    const incomeTax = municipalTax + stateTax
    const totalTax = incomeTax
    const netIncome = income - totalTax
    return { incomeTax, totalTax, netIncome, breakdown: [
      { label: "municipal_tax", value: municipalTax, rate: 32 },
      { label: "state_tax", value: stateTax, rate: stateTax > 0 ? 20 : 0 }
    ]}
  },
  gb: (income: number) => {
    // UK: Progressive tax system
    let incomeTax = 0
    const personalAllowance = 12570

    if (income <= personalAllowance) {
      incomeTax = 0
    } else if (income <= 50270) {
      incomeTax = (income - personalAllowance) * 0.20
    } else if (income <= 125140) {
      incomeTax = (50270 - personalAllowance) * 0.20 + (income - 50270) * 0.40
    } else {
      incomeTax = (50270 - personalAllowance) * 0.20 + (125140 - 50270) * 0.40 + (income - 125140) * 0.45
    }

    // National Insurance approximately 12%
    const nationalInsurance = income * 0.12
    const totalTax = incomeTax + nationalInsurance
    const netIncome = income - totalTax
    return { incomeTax, nationalInsurance, totalTax, netIncome, breakdown: [
      { label: "income_tax", value: incomeTax, rate: 0 },
      { label: "national_insurance", value: nationalInsurance, rate: 12 }
    ]}
  },
  us: (income: number) => {
    // USA: Federal tax system (single filer)
    let federalTax = 0
    const brackets = [
      { limit: 11600, rate: 0.10 },
      { limit: 47150, rate: 0.12 },
      { limit: 100525, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243725, rate: 0.32 },
      { limit: 609350, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ]

    let remaining = income
    let prevLimit = 0
    for (const bracket of brackets) {
      if (remaining <= 0) break
      const taxable = Math.min(remaining, bracket.limit - prevLimit)
      federalTax += taxable * bracket.rate
      remaining -= taxable
      prevLimit = bracket.limit
    }

    // Social Security + Medicare approximately 7.65%
    const ficaTax = Math.min(income, 160200) * 0.062 + income * 0.0145
    const totalTax = federalTax + ficaTax
    const netIncome = income - totalTax
    return { federalTax, ficaTax, totalTax, netIncome, breakdown: [
      { label: "federal_tax", value: federalTax, rate: 0 },
      { label: "fica_tax", value: ficaTax, rate: 7.65 }
    ]}
  },
  ca: (income: number) => {
    // Canada: Federal tax system
    let federalTax = 0
    const brackets = [
      { limit: 53359, rate: 0.15 },
      { limit: 106717, rate: 0.205 },
      { limit: 165430, rate: 0.26 },
      { limit: 235675, rate: 0.29 },
      { limit: Infinity, rate: 0.33 }
    ]

    let remaining = income
    let prevLimit = 0
    for (const bracket of brackets) {
      if (remaining <= 0) break
      const taxable = Math.min(remaining, bracket.limit - prevLimit)
      federalTax += taxable * bracket.rate
      remaining -= taxable
      prevLimit = bracket.limit
    }

    // CPP + EI approximately 7.65%
    const cppEi = income * 0.0765
    const totalTax = federalTax + cppEi
    const netIncome = income - totalTax
    return { federalTax, cppEi, totalTax, netIncome, breakdown: [
      { label: "federal_tax", value: federalTax, rate: 0 },
      { label: "cpp_ei", value: cppEi, rate: 7.65 }
    ]}
  }
}

type CountryCode = "ua" | "pl" | "fr" | "de" | "pt" | "es" | "se" | "gb" | "us" | "ca"

export function TaxCalculator({ countryCode }: { countryCode: CountryCode }) {
  const { language } = useI18n()
  const [income, setIncome] = useState<string>("")
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCode)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    setSelectedCountry(countryCode)
  }, [countryCode])

  const calculateTax = () => {
    const incomeValue = parseFloat(income)
    if (isNaN(incomeValue) || incomeValue <= 0) {
      setResult(null)
      return
    }

    const calculation = taxCalculations[selectedCountry](incomeValue)
    setResult(calculation)
  }

  const handleReset = () => {
    setIncome("")
    setResult(null)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const getCurrencySymbol = (country: CountryCode) => {
    const symbols: Record<CountryCode, string> = {
      ua: "₴", pl: "zł", fr: "€", de: "€", pt: "€",
      es: "€", se: "kr", gb: "£", us: "$", ca: "CAD"
    }
    return symbols[country] || ""
  }

  return (
    <section id="calculator" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Calculator className="w-8 h-8" />
            {t(language, "calculator.title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t(language, "calculator.subtitle")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t(language, "calculator.input_title")}</CardTitle>
            <CardDescription>{t(language, "calculator.input_description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="country">{t(language, "calculator.select_country")}</Label>
              <Select value={selectedCountry} onValueChange={(value) => setSelectedCountry(value as CountryCode)}>
                <SelectTrigger id="country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ua">🇺🇦 {t(language, "country.ukraine")}</SelectItem>
                  <SelectItem value="pl">🇵🇱 {t(language, "country.poland")}</SelectItem>
                  <SelectItem value="fr">🇫🇷 {t(language, "country.france")}</SelectItem>
                  <SelectItem value="de">🇩🇪 {t(language, "country.germany")}</SelectItem>
                  <SelectItem value="pt">🇵🇹 {t(language, "country.portugal")}</SelectItem>
                  <SelectItem value="es">🇪🇸 {t(language, "country.spain")}</SelectItem>
                  <SelectItem value="se">🇸🇪 {t(language, "country.sweden")}</SelectItem>
                  <SelectItem value="gb">🇬🇧 {t(language, "country.england")}</SelectItem>
                  <SelectItem value="us">🇺🇸 {t(language, "country.usa")}</SelectItem>
                  <SelectItem value="ca">🇨🇦 {t(language, "country.canada")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="income">{t(language, "calculator.annual_income")} ({getCurrencySymbol(selectedCountry)})</Label>
              <Input
                id="income"
                type="number"
                placeholder="50000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && calculateTax()}
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t(language, "calculator.disclaimer")}
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button onClick={calculateTax} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />
                {t(language, "calculator.calculate")}
              </Button>
              <Button onClick={handleReset} variant="outline">
                {t(language, "calculator.reset")}
              </Button>
            </div>

            {result && (
              <>
                <Separator />
                <div className="space-y-4 pt-4">
                  <h3 className="text-xl font-semibold">{t(language, "calculator.results")}</h3>

                  <div className="grid gap-4">
                    <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg">
                      <span className="font-medium">{t(language, "calculator.gross_income")}</span>
                      <span className="text-xl font-bold">{getCurrencySymbol(selectedCountry)} {formatCurrency(parseFloat(income))}</span>
                    </div>

                    {result.breakdown.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span>{t(language, `calculator.${item.label}`)} {item.rate > 0 && `(${item.rate}%)`}</span>
                        <span className="font-semibold text-destructive">-{getCurrencySymbol(selectedCountry)} {formatCurrency(item.value)}</span>
                      </div>
                    ))}

                    <Separator />

                    <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                      <span className="font-medium">{t(language, "calculator.total_tax")}</span>
                      <span className="text-xl font-bold text-destructive">{getCurrencySymbol(selectedCountry)} {formatCurrency(result.totalTax)}</span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-primary/20 rounded-lg border-2 border-primary">
                      <span className="font-bold text-lg">{t(language, "calculator.net_income")}</span>
                      <span className="text-2xl font-bold text-primary">{getCurrencySymbol(selectedCountry)} {formatCurrency(result.netIncome)}</span>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                      {t(language, "calculator.tax_rate")}: {((result.totalTax / parseFloat(income)) * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

