"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useI18n } from "@/lib/i18n-context"
import { FileText } from "lucide-react"
import { generatePIT38PDF } from "@/lib/pdf-generator"

export function FormPIT38() {
  const { language } = useI18n()
  const [formData, setFormData] = useState({
    // Dane identyfikacyjne
    firstName: "",
    lastName: "",
    pesel: "",
    nip: "",
    address: "",
    city: "",
    postalCode: "",
    year: "2024",

    // Przychody z kapitałów pieniężnych
    dividendsIncome: "",
    interestIncome: "",
    stockSalesIncome: "",
    bondIncome: "",
    otherCapitalIncome: "",

    // Koszty
    stockPurchaseCosts: "",
    otherCapitalCosts: "",

    // Straty z lat poprzednich
    previousYearLosses: "",

    // Podatek zapłacony
    advanceTaxPaid: "",
    foreignTaxPaid: "",

    // Dodatkowe informacje
    additionalInfo: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelect = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await generatePIT38PDF(formData, language)
  }

  const handleClear = () => {
    setFormData({
      firstName: "",
      lastName: "",
      pesel: "",
      nip: "",
      address: "",
      city: "",
      postalCode: "",
      year: "2024",
      dividendsIncome: "",
      interestIncome: "",
      stockSalesIncome: "",
      bondIncome: "",
      otherCapitalIncome: "",
      stockPurchaseCosts: "",
      otherCapitalCosts: "",
      previousYearLosses: "",
      advanceTaxPaid: "",
      foreignTaxPaid: "",
      additionalInfo: "",
    })
  }

  const t = {
    uk: {
      title: "PIT-38",
      subtitle: "Декларація про доходи з капіталів",
      personalData: "Особисті дані",
      firstName: "Ім'я",
      lastName: "Прізвище",
      pesel: "PESEL",
      nip: "NIP",
      address: "Адреса",
      city: "Місто",
      postalCode: "Поштовий індекс",
      year: "Звітний рік",
      capitalIncome: "Доходи з капіталів",
      dividends: "Дивіденди (PLN)",
      interest: "Відсотки (PLN)",
      stockSales: "Продаж акцій (PLN)",
      bonds: "Облігації (PLN)",
      otherCapital: "Інші капітальні доходи (PLN)",
      costs: "Витрати",
      stockCosts: "Витрати на купівлю акцій (PLN)",
      otherCosts: "Інші витрати (PLN)",
      losses: "Збитки з минулих років (PLN)",
      taxPaid: "Сплачений податок",
      advanceTax: "Авансовий податок (PLN)",
      foreignTax: "Податок за кордоном (PLN)",
      additionalInfo: "Додаткова інформація",
      generate: "Сформувати PDF",
      clear: "Очистити",
      disclaimer: "⚠️ Ми не несемо відповідальності за проведені розрахунки. Всі сформовані дані повинні бути перевірені та підтверджені податковими консультантами перед поданням до податкових органів.",
    },
    en: {
      title: "PIT-38",
      subtitle: "Tax Return for Capital Income",
      personalData: "Personal Data",
      firstName: "First Name",
      lastName: "Last Name",
      pesel: "PESEL",
      nip: "NIP",
      address: "Address",
      city: "City",
      postalCode: "Postal Code",
      year: "Tax Year",
      capitalIncome: "Capital Income",
      dividends: "Dividends (PLN)",
      interest: "Interest (PLN)",
      stockSales: "Stock Sales (PLN)",
      bonds: "Bonds (PLN)",
      otherCapital: "Other Capital Income (PLN)",
      costs: "Costs",
      stockCosts: "Stock Purchase Costs (PLN)",
      otherCosts: "Other Costs (PLN)",
      losses: "Previous Year Losses (PLN)",
      taxPaid: "Tax Paid",
      advanceTax: "Advance Tax (PLN)",
      foreignTax: "Foreign Tax (PLN)",
      additionalInfo: "Additional Information",
      generate: "Generate PDF",
      clear: "Clear",
      disclaimer: "⚠️ We are not responsible for the calculations performed. All generated data must be verified and confirmed by tax consultants before submission to tax authorities.",
    },
    pl: {
      title: "PIT-38",
      subtitle: "Zeznanie o wysokości osiągniętego dochodu z kapitałów",
      personalData: "Dane osobowe",
      firstName: "Imię",
      lastName: "Nazwisko",
      pesel: "PESEL",
      nip: "NIP",
      address: "Adres",
      city: "Miejscowość",
      postalCode: "Kod pocztowy",
      year: "Rok podatkowy",
      capitalIncome: "Przychody z kapitałów pieniężnych",
      dividends: "Dywidendy (PLN)",
      interest: "Odsetki (PLN)",
      stockSales: "Sprzedaż akcji (PLN)",
      bonds: "Obligacje (PLN)",
      otherCapital: "Inne przychody kapitałowe (PLN)",
      costs: "Koszty",
      stockCosts: "Koszty nabycia akcji (PLN)",
      otherCosts: "Inne koszty (PLN)",
      losses: "Straty z lat poprzednich (PLN)",
      taxPaid: "Podatek zapłacony",
      advanceTax: "Zaliczki na podatek (PLN)",
      foreignTax: "Podatek zapłacony za granicą (PLN)",
      additionalInfo: "Informacje dodatkowe",
      generate: "Generuj PDF",
      clear: "Wyczyść",
      disclaimer: "⚠️ Nie ponosimy odpowiedzialności za przeprowadzone obliczenia. Wszystkie wygenerowane dane powinny zostać zweryfikowane i potwierdzone przez doradców podatkowych przed złożeniem do urzędu skarbowego.",
    },
    fr: {
      title: "PIT-38",
      subtitle: "Déclaration de revenus de capitaux",
      personalData: "Données personnelles",
      firstName: "Prénom",
      lastName: "Nom",
      pesel: "PESEL",
      nip: "NIP",
      address: "Adresse",
      city: "Ville",
      postalCode: "Code postal",
      year: "Année fiscale",
      capitalIncome: "Revenus de capitaux",
      dividends: "Dividendes (PLN)",
      interest: "Intérêts (PLN)",
      stockSales: "Vente d'actions (PLN)",
      bonds: "Obligations (PLN)",
      otherCapital: "Autres revenus de capitaux (PLN)",
      costs: "Frais",
      stockCosts: "Frais d'achat d'actions (PLN)",
      otherCosts: "Autres frais (PLN)",
      losses: "Pertes des années précédentes (PLN)",
      taxPaid: "Impôt payé",
      advanceTax: "Acomptes d'impôt (PLN)",
      foreignTax: "Impôt payé à l'étranger (PLN)",
      additionalInfo: "Informations complémentaires",
      generate: "Générer PDF",
      clear: "Effacer",
      disclaimer: "⚠️ Nous ne sommes pas responsables des calculs effectués. Toutes les données générées doivent être vérifiées et confirmées par des conseillers fiscaux avant soumission aux autorités fiscales.",
    },
  }

  const translations = t[language as keyof typeof t] || t.en

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Dane osobowe */}
      <Card className="border-border/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">{translations.personalData}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{translations.firstName}</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{translations.lastName}</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pesel">{translations.pesel}</Label>
              <Input
                id="pesel"
                name="pesel"
                placeholder="12345678901"
                value={formData.pesel}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nip">{translations.nip}</Label>
              <Input
                id="nip"
                name="nip"
                placeholder="1234567890"
                value={formData.nip}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">{translations.year}</Label>
              <Select value={formData.year} onValueChange={(value) => handleSelect("year", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">{translations.address}</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">{translations.postalCode}</Label>
              <Input
                id="postalCode"
                name="postalCode"
                placeholder="00-000"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">{translations.city}</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Przychody z kapitałów */}
      <Card className="border-border/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">{translations.capitalIncome}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dividendsIncome">{translations.dividends}</Label>
              <Input
                id="dividendsIncome"
                name="dividendsIncome"
                type="number"
                step="0.01"
                value={formData.dividendsIncome}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interestIncome">{translations.interest}</Label>
              <Input
                id="interestIncome"
                name="interestIncome"
                type="number"
                step="0.01"
                value={formData.interestIncome}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockSalesIncome">{translations.stockSales}</Label>
              <Input
                id="stockSalesIncome"
                name="stockSalesIncome"
                type="number"
                step="0.01"
                value={formData.stockSalesIncome}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bondIncome">{translations.bonds}</Label>
              <Input
                id="bondIncome"
                name="bondIncome"
                type="number"
                step="0.01"
                value={formData.bondIncome}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherCapitalIncome">{translations.otherCapital}</Label>
              <Input
                id="otherCapitalIncome"
                name="otherCapitalIncome"
                type="number"
                step="0.01"
                value={formData.otherCapitalIncome}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Koszty */}
      <Card className="border-border/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">{translations.costs}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stockPurchaseCosts">{translations.stockCosts}</Label>
              <Input
                id="stockPurchaseCosts"
                name="stockPurchaseCosts"
                type="number"
                step="0.01"
                value={formData.stockPurchaseCosts}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherCapitalCosts">{translations.otherCosts}</Label>
              <Input
                id="otherCapitalCosts"
                name="otherCapitalCosts"
                type="number"
                step="0.01"
                value={formData.otherCapitalCosts}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="previousYearLosses">{translations.losses}</Label>
              <Input
                id="previousYearLosses"
                name="previousYearLosses"
                type="number"
                step="0.01"
                value={formData.previousYearLosses}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Podatek zapłacony */}
      <Card className="border-border/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">{translations.taxPaid}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="advanceTaxPaid">{translations.advanceTax}</Label>
              <Input
                id="advanceTaxPaid"
                name="advanceTaxPaid"
                type="number"
                step="0.01"
                value={formData.advanceTaxPaid}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foreignTaxPaid">{translations.foreignTax}</Label>
              <Input
                id="foreignTaxPaid"
                name="foreignTaxPaid"
                type="number"
                step="0.01"
                value={formData.foreignTaxPaid}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dodatkowe informacje */}
      <Card className="border-border/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">{translations.additionalInfo}</h3>
          <div className="space-y-2">
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              rows={4}
              value={formData.additionalInfo}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="space-y-4">
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={handleClear}>
            {translations.clear}
          </Button>
          <Button type="submit" className="gap-2">
            <FileText className="w-4 h-4" />
            {translations.generate}
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {translations.disclaimer}
          </p>
        </div>
      </div>
    </form>
  )
}

