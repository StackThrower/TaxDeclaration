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
import { generateF0100214PDF } from "@/lib/pdf-generator"

export function FormF0100214() {
  const { language } = useI18n()
  const isMobile = useIsMobile()
  // Whether user chose to fill anonymously
  const [anonymous, setAnonymous] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    taxNumber: "",
    passportNumber: "",
    residence: "",
    year: "2025",
    realEstate: "",
    vehicles: "",
    otherProperty: "",
    totalIncome: "",
    expenses: "",
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

    // Generate PDF with current form data
    // If anonymous selected, replace fullName and taxNumber with localized "not specified" value
    const anonymousValues: Record<string, { label: string; value: string }> = {
      uk: { label: "Заповнити анонімно", value: "Не вказано" },
      en: { label: "Fill anonymously", value: "Not specified" },
      fr: { label: "Remplir anonymement", value: "Non spécifié" },
      pl: { label: "Wypełnij anonimowo", value: "Nie podano" },
      es: { label: "Rellenar de forma anónima", value: "No especificado" },
      pt: { label: "Preencher anonimamente", value: "Não especificado" },
      de: { label: "Anonym ausfüllen", value: "Nicht angegeben" },
      ru: { label: "Заполнить анонимно", value: "Не указано" },
    }

    const anonValue = anonymousValues[language as keyof typeof anonymousValues]?.value || anonymousValues.uk.value

    await generateF0100214PDF(
      {
        fullName: anonymous ? anonValue : formData.fullName,
        taxNumber: anonymous ? anonValue : formData.taxNumber,
        passportNumber: anonymous ? "" : formData.passportNumber,
        residence: formData.residence,
        year: formData.year,
        realEstate: formData.realEstate,
        vehicles: formData.vehicles,
        otherProperty: formData.otherProperty,
        totalIncome: formData.totalIncome,
        expenses: formData.expenses,
        additionalInfo: formData.additionalInfo,
      },
      language
    )
  }

  const handleClear = () => {
    setFormData({
      fullName: "",
      taxNumber: "",
      passportNumber: "",
      residence: "",
      year: "2025",
      realEstate: "",
      vehicles: "",
      otherProperty: "",
      totalIncome: "",
      expenses: "",
      additionalInfo: "",
    })
  }

  const translations: Record<string, { label: string; placeholder: string }> = {
    uk: {
      label: "Персональні дані",
      placeholder: "Іванов Іван Іванович",
    },
    en: {
      label: "Personal Data",
      placeholder: "John Smith",
    },
    fr: {
      label: "Données personnelles",
      placeholder: "Jean Martin",
    },
    pl: {
      label: "Dane osobowe",
      placeholder: "Jan Kowalski",
    },
    es: {
      label: "Datos personales",
      placeholder: "Juan García",
    },
    pt: {
      label: "Dados pessoais",
      placeholder: "João Silva",
    },
    de: {
      label: "Persönliche Daten",
      placeholder: "Johann Schmidt",
    },
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Персональні дані */}
      <Card className="border-border/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">{translations[language]?.label || "Personal Data"}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                {language === "uk"
                  ? "Прізвище та ім'я"
                  : language === "en"
                    ? "Full Name"
                    : language === "fr"
                      ? "Nom complet"
                      : language === "pl"
                        ? "Imię i nazwisko"
                        : language === "es"
                          ? "Nombre completo"
                          : language === "pt"
                            ? "Nome completo"
                            : "Vollständiger Name"}
              </Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder={translations[language]?.placeholder || "Name"}
                value={formData.fullName}
                onChange={handleChange}
                required={!anonymous}
                disabled={anonymous}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxNumber">
                {language === "uk"
                  ? "ІПН"
                  : language === "en"
                    ? "Tax ID"
                    : language === "fr"
                      ? "ID fiscal"
                      : language === "pl"
                        ? "NIP"
                        : language === "es"
                          ? "Número de contribuyente"
                          : language === "pt"
                            ? "Número de contribuinte"
                            : "Steuernummer"}
              </Label>
              <Input
                id="taxNumber"
                name="taxNumber"
                placeholder="ХХХХХХХХХХХХ"
                value={formData.taxNumber}
                onChange={handleChange}
                required={!anonymous}
                disabled={anonymous}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportNumber">
                {language === "uk"
                  ? "Номер паспорту"
                  : language === "en"
                    ? "Passport Number"
                    : language === "fr"
                      ? "Numéro de passeport"
                      : language === "pl"
                        ? "Numer paszportu"
                        : language === "es"
                          ? "Número de pasaporte"
                          : language === "pt"
                            ? "Número do passaporte"
                            : "Passnummer"}
              </Label>
              <Input
                id="passportNumber"
                name="passportNumber"
                placeholder="АА 123456"
                value={formData.passportNumber}
                onChange={handleChange}
                disabled={anonymous}
              />
            </div>
            {/* Anonymous checkbox */}
            <div className="md:col-span-2">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="form-checkbox h-4 w-4"
                />
                <span className="ml-2">
                  {language === "uk"
                    ? "Заповнити анонімно"
                    : language === "en"
                      ? "Fill anonymously"
                      : language === "fr"
                        ? "Remplir anonymement"
                        : language === "pl"
                          ? "Wypełnij anonimowo"
                          : language === "es"
                            ? "Rellenar de forma anónima"
                            : language === "pt"
                              ? "Preencher anonimamente"
                              : language === "de"
                                ? "Anonym ausfüllen"
                                : "Заполнить анонимно"}
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Період */}
      <Card className="border-border/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">
            {language === "uk"
              ? "Період розрахунку"
              : language === "en"
                ? "Calculation Period"
                : language === "fr"
                  ? "Période de calcul"
                  : language === "pl"
                    ? "Okres rozliczeniowy"
                    : language === "es"
                      ? "Período de cálculo"
                      : language === "pt"
                        ? "Período de cálculo"
                        : "Abrechnungszeitraum"}
          </h3>
          <div className="space-y-2">
            <Label htmlFor="year">
              {language === "uk"
                ? "Рік"
                : language === "en"
                  ? "Year"
                  : language === "fr"
                    ? "Année"
                    : language === "pl"
                      ? "Rok"
                      : language === "es"
                        ? "Año"
                        : language === "pt"
                          ? "Ano"
                          : "Jahr"}
            </Label>
            <Select value={formData.year} onValueChange={(value) => handleSelect("year", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2019">2019</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Майно */}
      <Card className="border-border/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">
            {language === "uk"
              ? "Відомості про майно"
              : language === "en"
                ? "Property Information"
                : language === "fr"
                  ? "Informations sur les biens"
                  : language === "pl"
                    ? "Informacje o majątku"
                    : language === "es"
                      ? "Información sobre bienes"
                      : language === "pt"
                        ? "Informações sobre bens"
                        : "Vermögensinformationen"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="realEstate">
                {language === "uk"
                  ? "Нерухоме майно (кількість об'єктів)"
                  : language === "en"
                    ? "Real Estate (number of objects)"
                    : language === "fr"
                      ? "Immobilier (nombre d'objets)"
                      : language === "pl"
                        ? "Nieruchomości (liczba obiektów)"
                        : language === "es"
                          ? "Inmuebles (número de objetos)"
                          : language === "pt"
                            ? "Imóveis (número de objetos)"
                            : "Immobilien (Anzahl der Objekte)"}
              </Label>
              <Input
                id="realEstate"
                name="realEstate"
                type="number"
                placeholder="0"
                value={formData.realEstate}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicles">
                {language === "uk"
                  ? "Транспортні засоби (кількість)"
                  : language === "en"
                    ? "Vehicles (quantity)"
                    : language === "fr"
                      ? "Véhicules (quantité)"
                      : language === "pl"
                        ? "Pojazdy (ilość)"
                        : language === "es"
                          ? "Vehículos (cantidad)"
                          : language === "pt"
                            ? "Veículos (quantidade)"
                            : "Fahrzeuge (Anzahl)"}
              </Label>
              <Input
                id="vehicles"
                name="vehicles"
                type="number"
                placeholder="0"
                value={formData.vehicles}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="otherProperty">
              {language === "uk"
                ? "Інше майно (опис)"
                : language === "en"
                  ? "Other Property (description)"
                  : language === "fr"
                    ? "Autres biens (description)"
                    : language === "pl"
                      ? "Inny majątek (opis)"
                      : language === "es"
                        ? "Otros bienes (descripción)"
                        : language === "pt"
                          ? "Outros bens (descrição)"
                          : "Sonstiges Vermögen (Beschreibung)"}
            </Label>
            <Textarea
              id="otherProperty"
              name="otherProperty"
              placeholder={language === "uk" ? "Описати інше майно..." : "Describe other property..."}
              value={formData.otherProperty}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Доходи та витрати */}
      <Card className="border-border/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">
            {language === "uk"
              ? "Доходи та витрати"
              : language === "en"
                ? "Income and Expenses"
                : language === "fr"
                  ? "Revenus et dépenses"
                  : language === "pl"
                    ? "Dochody i wydatki"
                    : language === "es"
                      ? "Ingresos y gastos"
                      : language === "pt"
                        ? "Receitas e despesas"
                        : "Einnahmen und Ausgaben"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalIncome">
                {language === "uk"
                  ? "Загальний дохід (грн)"
                  : language === "en"
                    ? "Total Income (UAH)"
                    : language === "fr"
                      ? "Revenu total (UAH)"
                      : language === "pl"
                        ? "Całkowity dochód (UAH)"
                        : language === "es"
                          ? "Ingreso total (UAH)"
                          : language === "pt"
                            ? "Renda total (UAH)"
                            : "Gesamteinkommen (UAH)"}
              </Label>
              <Input
                id="totalIncome"
                name="totalIncome"
                type="number"
                placeholder="0.00"
                value={formData.totalIncome}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenses">
                {language === "uk"
                  ? "Витрати (грн)"
                  : language === "en"
                    ? "Expenses (UAH)"
                    : language === "fr"
                      ? "Dépenses (UAH)"
                      : language === "pl"
                        ? "Wydatki (UAH)"
                        : language === "es"
                          ? "Gastos (UAH)"
                          : language === "pt"
                            ? "Despesas (UAH)"
                            : "Ausgaben (UAH)"}
              </Label>
              <Input
                id="expenses"
                name="expenses"
                type="number"
                placeholder="0.00"
                value={formData.expenses}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Додаткова інформація */}
      <Card className="border-border/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary">
            {language === "uk"
              ? "Додаткова інформація"
              : language === "en"
                ? "Additional Information"
                : language === "fr"
                  ? "Informations supplémentaires"
                  : language === "pl"
                    ? "Dodatkowe informacje"
                    : language === "es"
                      ? "Información adicional"
                      : language === "pt"
                        ? "Informações adicionais"
                        : "Zusätzliche Informationen"}
          </h3>
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">
              {language === "uk"
                ? "Примітки та уточнення"
                : language === "en"
                  ? "Notes and Clarifications"
                  : language === "fr"
                    ? "Notes et clarifications"
                    : language === "pl"
                      ? "Uwagi i wyjaśnienia"
                      : language === "es"
                        ? "Notas y aclaraciones"
                        : language === "pt"
                          ? "Notas e esclarecimentos"
                          : "Notizen und Klarstellungen"}
            </Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              placeholder={language === "uk" ? "Введіть додаткову інформацію..." : "Enter additional information..."}
              value={formData.additionalInfo}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 pt-6">
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 ${isMobile ? 'w-full' : ''}`}>
          <Button
            type="submit"
            size={isMobile ? "default" : "lg"}
            className={`bg-primary hover:bg-primary/90 gap-2 ${isMobile ? 'w-full' : ''}`}
          >
            <FileText className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            <span className={isMobile ? 'text-sm' : ''}>
              {language === "uk"
                ? "Сформувати PDF"
                : language === "en"
                  ? "Generate PDF"
                  : language === "fr"
                    ? "Générer PDF"
                    : language === "pl"
                      ? "Generuj PDF"
                      : language === "es"
                        ? "Generar PDF"
                        : language === "pt"
                          ? "Gerar PDF"
                          : "PDF erstellen"}
            </span>
          </Button>
          <Button
            type="reset"
            variant="outline"
            size={isMobile ? "default" : "lg"}
            onClick={handleClear}
            className={isMobile ? 'w-full' : ''}
          >
            <span className={isMobile ? 'text-sm' : ''}>
              {language === "uk"
                ? "Очистити форму"
                : language === "en"
                  ? "Clear Form"
                  : language === "fr"
                    ? "Effacer le formulaire"
                    : language === "pl"
                      ? "Wyczyść formularz"
                      : language === "es"
                        ? "Limpiar formulario"
                        : language === "pt"
                          ? "Limpar formulário"
                          : "Formular löschen"}
            </span>
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {language === "uk"
              ? "⚠️ Всі сформовані дані повинні бути перевірені та підтверджені кристувачем перед поданням до податкових органів."
              : language === "en"
                ? "⚠️ All generated data must be verified and confirmed by tax consultants before submission to tax authorities."
                : language === "fr"
                  ? "⚠️ Toutes les données générées doivent être vérifiées et confirmées par des conseillers fiscaux avant soumission aux autorités fiscales."
                  : language === "pl"
                    ? "⚠️ Wszystkie wygenerowane dane powinny zostać zweryfikowane i potwierdzone przez doradców podatkowych przed złożeniem do urzędu skarbowego."
                    : language === "es"
                      ? "⚠️ Todos los datos generados deben ser verificados y confirmados por asesores fiscales antes de ser presentados a las autoridades fiscales."
                      : language === "pt"
                        ? "⚠️ Todos os dados gerados devem ser verificados e confirmados por consultores fiscais antes da submissão às autoridades fiscais."
                        : "⚠️ Alle generierten Daten müssen von Steuerberatern überprüft und bestätigt werden, bevor sie bei den Steuerbehörden eingereicht werden."}
          </p>
        </div>
      </div>
    </form>
  )
}
