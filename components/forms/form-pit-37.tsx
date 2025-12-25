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
import { useIsMobile } from "@/hooks/use-mobile"
import { FileText } from "lucide-react"
import { generatePIT37PDF } from "@/lib/pdf-generator"

export function FormPIT37() {
  const { language } = useI18n()
  const isMobile = useIsMobile()
  const [formData, setFormData] = useState({
    // Dane identyfikacyjne
    firstName: "",
    lastName: "",
    pesel: "",
    nip: "",
    birthDate: "",
    address: "",
    city: "",
    postalCode: "",
    year: "2025",

    // Przychody z pracy
    employmentIncome: "",
    pensionIncome: "",
    otherIncome: "",

    // Koszty uzyskania przychodu
    employmentCosts: "",
    otherCosts: "",

    // Składki
    socialSecurityContributions: "",
    healthInsuranceContributions: "",

    // Ulgi podatkowe
    childrenNumber: "0",
    childRelief: "",
    internetRelief: "",
    donationsRelief: "",

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
    await generatePIT37PDF(formData, language)
  }

  const handleClear = () => {
    setFormData({
      firstName: "",
      lastName: "",
      pesel: "",
      nip: "",
      birthDate: "",
      address: "",
      city: "",
      postalCode: "",
      year: "2025",
      employmentIncome: "",
      pensionIncome: "",
      otherIncome: "",
      employmentCosts: "",
      otherCosts: "",
      socialSecurityContributions: "",
      healthInsuranceContributions: "",
      childrenNumber: "0",
      childRelief: "",
      internetRelief: "",
      donationsRelief: "",
      additionalInfo: "",
    })
  }

  const t = {
    uk: {
      title: "PIT-37",
      subtitle: "Декларація про доходи з праці та інших джерел",
      personalData: "Особисті дані",
      firstName: "Ім'я",
      lastName: "Прізвище",
      pesel: "PESEL",
      nip: "NIP",
      birthDate: "Дата народження",
      address: "Адреса",
      city: "Місто",
      postalCode: "Поштовий індекс",
      year: "Звітний рік",
      income: "Доходи",
      employmentIncome: "Дохід з праці (PLN)",
      pensionIncome: "Пенсії та ренти (PLN)",
      otherIncome: "Інші доходи (PLN)",
      costs: "Витрати на отримання доходу",
      employmentCosts: "Витрати з праці (PLN)",
      otherCosts: "Інші витрати (PLN)",
      contributions: "Внески",
      socialSecurity: "Соціальне страхування (PLN)",
      healthInsurance: "Медичне страхування (PLN)",
      reliefs: "Податкові пільги",
      children: "Кількість дітей",
      childRelief: "Пільга на дітей (PLN)",
      internetRelief: "Пільга за інтернет (PLN)",
      donationsRelief: "Пільга за пожертви (PLN)",
      additionalInfo: "Додаткова інформація",
      generate: "Сформувати PDF",
      clear: "Очистити",
      disclaimer: "⚠️ Всі сформовані дані повинні бути перевірені та підтверджені податковими консультантами перед поданням до податкових органів.",
    },
    en: {
      title: "PIT-37",
      subtitle: "Tax Return for Employment and Other Income",
      personalData: "Personal Data",
      firstName: "First Name",
      lastName: "Last Name",
      pesel: "PESEL",
      nip: "NIP",
      birthDate: "Date of Birth",
      address: "Address",
      city: "City",
      postalCode: "Postal Code",
      year: "Tax Year",
      income: "Income",
      employmentIncome: "Employment Income (PLN)",
      pensionIncome: "Pensions and Annuities (PLN)",
      otherIncome: "Other Income (PLN)",
      costs: "Income Acquisition Costs",
      employmentCosts: "Employment Costs (PLN)",
      otherCosts: "Other Costs (PLN)",
      contributions: "Contributions",
      socialSecurity: "Social Security (PLN)",
      healthInsurance: "Health Insurance (PLN)",
      reliefs: "Tax Reliefs",
      children: "Number of Children",
      childRelief: "Child Relief (PLN)",
      internetRelief: "Internet Relief (PLN)",
      donationsRelief: "Donations Relief (PLN)",
      additionalInfo: "Additional Information",
      generate: "Generate PDF",
      clear: "Clear",
      disclaimer: "⚠️ All generated data must be verified and confirmed by tax consultants before submission to tax authorities.",
    },
    pl: {
      title: "PIT-37",
      subtitle: "Zeznanie o wysokości osiągniętego dochodu",
      personalData: "Dane osobowe",
      firstName: "Imię",
      lastName: "Nazwisko",
      pesel: "PESEL",
      nip: "NIP",
      birthDate: "Data urodzenia",
      address: "Adres",
      city: "Miejscowość",
      postalCode: "Kod pocztowy",
      year: "Rok podatkowy",
      income: "Przychody",
      employmentIncome: "Przychody z pracy (PLN)",
      pensionIncome: "Emerytury i renty (PLN)",
      otherIncome: "Inne przychody (PLN)",
      costs: "Koszty uzyskania przychodu",
      employmentCosts: "Koszty z pracy (PLN)",
      otherCosts: "Inne koszty (PLN)",
      contributions: "Składki",
      socialSecurity: "Ubezpieczenia społeczne (PLN)",
      healthInsurance: "Ubezpieczenie zdrowotne (PLN)",
      reliefs: "Ulgi podatkowe",
      children: "Liczba dzieci",
      childRelief: "Ulga na dzieci (PLN)",
      internetRelief: "Ulga internetowa (PLN)",
      donationsRelief: "Ulga na darowizny (PLN)",
      additionalInfo: "Informacje dodatkowe",
      generate: "Generuj PDF",
      clear: "Wyczyść",
      disclaimer: "⚠️ Wszystkie wygenerowane dane powinny zostać zweryfikowane i potwierdzone przez doradców podatkowych przed złożeniem do urzędu skarbowego.",
    },
    fr: {
      title: "PIT-37",
      subtitle: "Déclaration de revenus du travail et autres sources",
      personalData: "Données personnelles",
      firstName: "Prénom",
      lastName: "Nom",
      pesel: "PESEL",
      nip: "NIP",
      birthDate: "Date de naissance",
      address: "Adresse",
      city: "Ville",
      postalCode: "Code postal",
      year: "Année fiscale",
      income: "Revenus",
      employmentIncome: "Revenus du travail (PLN)",
      pensionIncome: "Pensions et rentes (PLN)",
      otherIncome: "Autres revenus (PLN)",
      costs: "Frais d'acquisition de revenus",
      employmentCosts: "Frais de travail (PLN)",
      otherCosts: "Autres frais (PLN)",
      contributions: "Cotisations",
      socialSecurity: "Sécurité sociale (PLN)",
      healthInsurance: "Assurance maladie (PLN)",
      reliefs: "Allégements fiscaux",
      children: "Nombre d'enfants",
      childRelief: "Allégement pour enfants (PLN)",
      internetRelief: "Allégement internet (PLN)",
      donationsRelief: "Allégement pour dons (PLN)",
      additionalInfo: "Informations complémentaires",
      generate: "Générer PDF",
      clear: "Effacer",
      disclaimer: "⚠️ Toutes les données générées doivent être vérifiées et confirmées par des conseillers fiscaux avant soumission aux autorités fiscales.",
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
              <Label htmlFor="birthDate">{translations.birthDate}</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
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
                  <SelectItem value="2026">2026</SelectItem>
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

      {/* Przychody */}
      <Card className="border-border/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">{translations.income}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employmentIncome">{translations.employmentIncome}</Label>
              <Input
                id="employmentIncome"
                name="employmentIncome"
                type="number"
                step="0.01"
                value={formData.employmentIncome}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pensionIncome">{translations.pensionIncome}</Label>
              <Input
                id="pensionIncome"
                name="pensionIncome"
                type="number"
                step="0.01"
                value={formData.pensionIncome}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherIncome">{translations.otherIncome}</Label>
              <Input
                id="otherIncome"
                name="otherIncome"
                type="number"
                step="0.01"
                value={formData.otherIncome}
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
              <Label htmlFor="employmentCosts">{translations.employmentCosts}</Label>
              <Input
                id="employmentCosts"
                name="employmentCosts"
                type="number"
                step="0.01"
                value={formData.employmentCosts}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherCosts">{translations.otherCosts}</Label>
              <Input
                id="otherCosts"
                name="otherCosts"
                type="number"
                step="0.01"
                value={formData.otherCosts}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Składki */}
      <Card className="border-border/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">{translations.contributions}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="socialSecurityContributions">{translations.socialSecurity}</Label>
              <Input
                id="socialSecurityContributions"
                name="socialSecurityContributions"
                type="number"
                step="0.01"
                value={formData.socialSecurityContributions}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="healthInsuranceContributions">{translations.healthInsurance}</Label>
              <Input
                id="healthInsuranceContributions"
                name="healthInsuranceContributions"
                type="number"
                step="0.01"
                value={formData.healthInsuranceContributions}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ulgi */}
      <Card className="border-border/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">{translations.reliefs}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="childrenNumber">{translations.children}</Label>
              <Select
                value={formData.childrenNumber}
                onValueChange={(value) => handleSelect("childrenNumber", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="childRelief">{translations.childRelief}</Label>
              <Input
                id="childRelief"
                name="childRelief"
                type="number"
                step="0.01"
                value={formData.childRelief}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internetRelief">{translations.internetRelief}</Label>
              <Input
                id="internetRelief"
                name="internetRelief"
                type="number"
                step="0.01"
                value={formData.internetRelief}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="donationsRelief">{translations.donationsRelief}</Label>
              <Input
                id="donationsRelief"
                name="donationsRelief"
                type="number"
                step="0.01"
                value={formData.donationsRelief}
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
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 ${isMobile ? 'w-full' : 'justify-end'}`}>
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            size={isMobile ? "default" : "lg"}
            className={isMobile ? 'w-full' : ''}
          >
            <span className={isMobile ? 'text-sm' : ''}>{translations.clear}</span>
          </Button>
          <Button
            type="submit"
            className={`gap-2 ${isMobile ? 'w-full' : ''}`}
            size={isMobile ? "default" : "lg"}
          >
            <FileText className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            <span className={isMobile ? 'text-sm' : ''}>{translations.generate}</span>
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

