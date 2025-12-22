"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n-context"
import { t } from "@/lib/i18n"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calculator, AlertCircle, Briefcase, TrendingUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type IncomeType = "salary" | "investment"

// Tax calculation functions for each country with income type support
// Sources: Official tax authorities and international tax databases (2024/2025)
const taxCalculations = {
  ua: (income: number, incomeType: IncomeType) => {
    // Ukraine:
    // Salary: 18% income tax + 1.5% ESV (employer pays most social contributions)
    // Investment (passive): 18% PDFO + 5% military tax (from 2025)
    if (incomeType === "salary") {
      const incomeTax = income * 0.18
      const militaryTax = income * 0.05 // Military tax increased to 5% from Oct 2024
      const totalTax = incomeTax + militaryTax
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "income_tax", value: incomeTax, rate: 18 },
        { label: "military_tax", value: militaryTax, rate: 5 }
      ]}
    } else {
      // Investment income
      const incomeTax = income * 0.18
      const militaryTax = income * 0.05 // 5% from 2025
      const totalTax = incomeTax + militaryTax
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "investment_income_tax", value: incomeTax, rate: 18 },
        { label: "military_tax", value: militaryTax, rate: 5 }
      ]}
    }
  },
  pl: (income: number, incomeType: IncomeType) => {
    // Poland:
    // Salary: Progressive 12%/32% + ZUS 13.71%
    // Investment: 19% flat tax (Belka tax) on capital gains/dividends
    if (incomeType === "salary") {
      let incomeTax = 0
      const threshold = 120000
      const taxFreeAllowance = 30000 // 2024 kwota wolna

      const taxableIncome = Math.max(0, income - taxFreeAllowance)
      if (taxableIncome <= threshold - taxFreeAllowance) {
        incomeTax = taxableIncome * 0.12
      } else {
        incomeTax = (threshold - taxFreeAllowance) * 0.12 + (taxableIncome - (threshold - taxFreeAllowance)) * 0.32
      }
      incomeTax = Math.max(0, incomeTax)

      // ZUS employee contribution approximately 13.71%
      const socialSecurity = income * 0.1371
      const totalTax = incomeTax + socialSecurity
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "income_tax", value: incomeTax, rate: taxableIncome > threshold - taxFreeAllowance ? 32 : 12 },
        { label: "social_security", value: socialSecurity, rate: 13.71 }
      ]}
    } else {
      // Investment: 19% Belka tax
      const capitalGainsTax = income * 0.19
      const totalTax = capitalGainsTax
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "capital_gains_tax", value: capitalGainsTax, rate: 19 }
      ]}
    }
  },
  fr: (income: number, incomeType: IncomeType) => {
    // France:
    // Salary: Progressive 0-45% + social contributions ~17.2%
    // Investment: PFU (Flat Tax) 30% (12.8% income + 17.2% social)
    if (incomeType === "salary") {
      let incomeTax = 0
      const brackets = [
        { limit: 11294, rate: 0 },
        { limit: 28797, rate: 0.11 },
        { limit: 82341, rate: 0.30 },
        { limit: 177106, rate: 0.41 },
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

      // CSG + CRDS approximately 9.7%, other social ~7.5%
      const socialContributions = income * 0.172
      const totalTax = incomeTax + socialContributions
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "income_tax", value: incomeTax, rate: 0 },
        { label: "social_contributions", value: socialContributions, rate: 17.2 }
      ]}
    } else {
      // PFU (Prélèvement Forfaitaire Unique) - Flat Tax
      const flatTax = income * 0.128 // 12.8% income tax portion
      const socialContributions = income * 0.172 // 17.2% social contributions
      const totalTax = flatTax + socialContributions // Total 30%
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "flat_tax", value: flatTax, rate: 12.8 },
        { label: "social_contributions", value: socialContributions, rate: 17.2 }
      ]}
    }
  },
  de: (income: number, incomeType: IncomeType) => {
    // Germany:
    // Salary: Progressive 0-45% + social ~20%
    // Investment: Abgeltungsteuer 25% + Soli 5.5% of tax + church tax (optional)
    if (incomeType === "salary") {
      let incomeTax = 0
      const basicAllowance = 11604 // 2024

      if (income <= basicAllowance) {
        incomeTax = 0
      } else if (income <= 66760) {
        const y = (income - basicAllowance) / 10000
        incomeTax = (922.98 * y + 1400) * y
      } else if (income <= 277825) {
        const z = (income - 66760) / 10000
        incomeTax = (181.19 * z + 2397) * z + 17671.20
      } else {
        incomeTax = income * 0.45 - 18936.88
      }

      // Solidaritätszuschlag (only if tax > threshold)
      const soli = incomeTax > 18130 ? (incomeTax - 18130) * 0.055 : 0

      // Social insurance approximately 20% (employee share)
      const socialInsurance = Math.min(income, 90600) * 0.20
      const totalTax = incomeTax + soli + socialInsurance
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "income_tax", value: incomeTax, rate: 0 },
        { label: "solidarity_surcharge", value: soli, rate: 5.5 },
        { label: "social_insurance", value: socialInsurance, rate: 20 }
      ]}
    } else {
      // Abgeltungsteuer (withholding tax on capital)
      const capitalTax = income * 0.25
      const soli = capitalTax * 0.055 // 5.5% of capital tax
      const totalTax = capitalTax + soli // ~26.375%
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "capital_gains_tax", value: capitalTax, rate: 25 },
        { label: "solidarity_surcharge", value: soli, rate: 5.5 }
      ]}
    }
  },
  pt: (income: number, incomeType: IncomeType) => {
    // Portugal:
    // Salary: Progressive 14.5%-48% + social 11%
    // Investment: 28% flat tax on capital gains/dividends
    if (incomeType === "salary") {
      let incomeTax = 0
      const brackets = [
        { limit: 7703, rate: 0.1325 }, // Updated 2024
        { limit: 11623, rate: 0.18 },
        { limit: 16472, rate: 0.23 },
        { limit: 21321, rate: 0.26 },
        { limit: 27146, rate: 0.3275 },
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
      return { totalTax, netIncome, breakdown: [
        { label: "income_tax", value: incomeTax, rate: 0 },
        { label: "social_security", value: socialSecurity, rate: 11 }
      ]}
    } else {
      // Investment: 28% flat tax
      const capitalGainsTax = income * 0.28
      const totalTax = capitalGainsTax
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "capital_gains_tax", value: capitalGainsTax, rate: 28 }
      ]}
    }
  },
  es: (income: number, incomeType: IncomeType) => {
    // Spain:
    // Salary: Progressive 19%-47% + social ~6.35%
    // Investment: Progressive on savings 19%-28%
    if (incomeType === "salary") {
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
      return { totalTax, netIncome, breakdown: [
        { label: "income_tax", value: incomeTax, rate: 0 },
        { label: "social_security", value: socialSecurity, rate: 6.35 }
      ]}
    } else {
      // Savings/Investment progressive brackets
      let investmentTax = 0
      const savingsBrackets = [
        { limit: 6000, rate: 0.19 },
        { limit: 50000, rate: 0.21 },
        { limit: 200000, rate: 0.23 },
        { limit: 300000, rate: 0.27 },
        { limit: Infinity, rate: 0.28 }
      ]

      let remaining = income
      let prevLimit = 0
      for (const bracket of savingsBrackets) {
        if (remaining <= 0) break
        const taxable = Math.min(remaining, bracket.limit - prevLimit)
        investmentTax += taxable * bracket.rate
        remaining -= taxable
        prevLimit = bracket.limit
      }

      const totalTax = investmentTax
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "savings_tax", value: investmentTax, rate: 0 }
      ]}
    }
  },
  se: (income: number, incomeType: IncomeType) => {
    // Sweden:
    // Salary: Municipal ~32% + State 0-20%
    // Investment: 30% on capital gains
    if (incomeType === "salary") {
      const municipalTax = income * 0.32 // Average municipal tax
      let stateTax = 0

      if (income > 615300) {
        stateTax = (income - 615300) * 0.20
      }
      // Note: värnskatt has been removed, so no additional state tax for income 540700-615300

      const totalTax = municipalTax + stateTax
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "municipal_tax", value: municipalTax, rate: 32 },
        { label: "state_tax", value: stateTax, rate: stateTax > 0 ? 20 : 0 }
      ]}
    } else {
      // Investment: 30% capital gains tax
      const capitalGainsTax = income * 0.30
      const totalTax = capitalGainsTax
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "capital_gains_tax", value: capitalGainsTax, rate: 30 }
      ]}
    }
  },
  gb: (income: number, incomeType: IncomeType) => {
    // UK:
    // Salary: Progressive 20%-45% + NI ~12%
    // Investment: CGT 10%/20% (basic/higher rate), dividends have own rates
    if (incomeType === "salary") {
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

      // National Insurance approximately 12% (on earnings above £12,570)
      const nationalInsurance = Math.max(0, income - personalAllowance) * 0.12
      const totalTax = incomeTax + nationalInsurance
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "income_tax", value: incomeTax, rate: 0 },
        { label: "national_insurance", value: nationalInsurance, rate: 12 }
      ]}
    } else {
      // Capital Gains Tax: 10% basic rate / 20% higher rate
      // Using higher rate for simplicity (most investment income)
      // Also has £3,000 annual exempt amount (2024-25)
      const exemptAmount = 3000
      const taxableGain = Math.max(0, income - exemptAmount)
      const capitalGainsTax = taxableGain * 0.20 // Higher rate
      const totalTax = capitalGainsTax
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "capital_gains_tax", value: capitalGainsTax, rate: 20 }
      ]}
    }
  },
  us: (income: number, incomeType: IncomeType) => {
    // USA:
    // Salary: Federal progressive 10%-37% + FICA ~7.65%
    // Investment: Long-term capital gains 0%/15%/20%
    if (incomeType === "salary") {
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

      // FICA: Social Security 6.2% (up to $168,600) + Medicare 1.45%
      const socialSecurity = Math.min(income, 168600) * 0.062
      const medicare = income * 0.0145
      const ficaTax = socialSecurity + medicare
      const totalTax = federalTax + ficaTax
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "federal_tax", value: federalTax, rate: 0 },
        { label: "fica_tax", value: ficaTax, rate: 7.65 }
      ]}
    } else {
      // Long-term capital gains progressive brackets (single filer)
      let capitalGainsTax = 0
      const cgBrackets = [
        { limit: 47025, rate: 0 },
        { limit: 518900, rate: 0.15 },
        { limit: Infinity, rate: 0.20 }
      ]

      let remaining = income
      let prevLimit = 0
      for (const bracket of cgBrackets) {
        if (remaining <= 0) break
        const taxable = Math.min(remaining, bracket.limit - prevLimit)
        capitalGainsTax += taxable * bracket.rate
        remaining -= taxable
        prevLimit = bracket.limit
      }

      // Net Investment Income Tax (NIIT) 3.8% for high earners
      const niit = income > 200000 ? (income - 200000) * 0.038 : 0
      const totalTax = capitalGainsTax + niit
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "capital_gains_tax", value: capitalGainsTax, rate: 0 },
        { label: "niit", value: niit, rate: 3.8 }
      ]}
    }
  },
  ca: (income: number, incomeType: IncomeType) => {
    // Canada:
    // Salary: Federal progressive 15%-33% + CPP/EI
    // Investment: 50% inclusion rate, so effectively half the rates
    if (incomeType === "salary") {
      let federalTax = 0
      const brackets = [
        { limit: 55867, rate: 0.15 },
        { limit: 111733, rate: 0.205 },
        { limit: 173205, rate: 0.26 },
        { limit: 246752, rate: 0.29 },
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

      // CPP ~5.95% (up to maximum) + EI ~1.63%
      const cppMax = 3867.50
      const eiMax = 1049.12
      const cpp = Math.min(income * 0.0595, cppMax)
      const ei = Math.min(income * 0.0163, eiMax)
      const cppEi = cpp + ei
      const totalTax = federalTax + cppEi
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "federal_tax", value: federalTax, rate: 0 },
        { label: "cpp_ei", value: cppEi, rate: 7.58 }
      ]}
    } else {
      // Capital gains: 50% inclusion rate
      // Effective rate is half the marginal rate
      const inclusionRate = 0.5
      const taxableGain = income * inclusionRate

      let federalTax = 0
      const brackets = [
        { limit: 55867, rate: 0.15 },
        { limit: 111733, rate: 0.205 },
        { limit: 173205, rate: 0.26 },
        { limit: 246752, rate: 0.29 },
        { limit: Infinity, rate: 0.33 }
      ]

      let remaining = taxableGain
      let prevLimit = 0
      for (const bracket of brackets) {
        if (remaining <= 0) break
        const taxable = Math.min(remaining, bracket.limit - prevLimit)
        federalTax += taxable * bracket.rate
        remaining -= taxable
        prevLimit = bracket.limit
      }

      const totalTax = federalTax
      const netIncome = income - totalTax
      return { totalTax, netIncome, breakdown: [
        { label: "capital_gains_tax", value: federalTax, rate: 0 }
      ]}
    }
  }
}

type CountryCode = "ua" | "pl" | "fr" | "de" | "pt" | "es" | "se" | "gb" | "us" | "ca"

export function TaxCalculator({ countryCode }: { countryCode: CountryCode }) {
  const { language } = useI18n()
  const [income, setIncome] = useState<string>("100000")
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCode)
  const [incomeType, setIncomeType] = useState<IncomeType>("salary")
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    setSelectedCountry(countryCode)
  }, [countryCode])

  // Auto-recalculate when income type or country changes (if we have a result)
  useEffect(() => {
    if (result !== null && income) {
      calculateTax()
    }
  }, [incomeType, selectedCountry])

  const calculateTax = () => {
    const incomeValue = parseFloat(income)
    if (isNaN(incomeValue) || incomeValue <= 0) {
      setResult(null)
      return
    }

    const calculation = taxCalculations[selectedCountry](incomeValue, incomeType)
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

            {/* Income Type Tabs */}
            <div className="space-y-2">
              <Label>{t(language, "calculator.income_type")}</Label>
              <Tabs value={incomeType} onValueChange={(value) => setIncomeType(value as IncomeType)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="salary" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {t(language, "calculator.salary")}
                  </TabsTrigger>
                  <TabsTrigger value="investment" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {t(language, "calculator.investment")}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="salary" className="mt-4">
                  <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                    <Briefcase className="h-4 w-4" />
                    <AlertDescription>
                      {t(language, "calculator.salary_description")}
                    </AlertDescription>
                  </Alert>
                </TabsContent>
                <TabsContent value="investment" className="mt-4">
                  <Alert className="bg-green-50 dark:bg-green-950 border-green-200">
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      {t(language, "calculator.investment_description")}
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
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

