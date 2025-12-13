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
import { Trash2, Plus, FileText } from "lucide-react"
import { generateF0121214PDF } from "@/lib/pdf-generator"

interface FinancialPosition {
  id: string
  assetType: string
  purchaseDate: string
  saleDate: string
  purchasePrice: string
  salePrice: string
  expenses: string
}

export function FormF0121214() {
  const { language } = useI18n()
  const [formData, setFormData] = useState({
    fullName: "",
    taxNumber: "",
    year: "2024",
    notes: "",
  })

  const [positions, setPositions] = useState<FinancialPosition[]>([
    {
      id: Date.now().toString(),
      assetType: "",
      purchaseDate: "",
      saleDate: "",
      purchasePrice: "",
      salePrice: "",
      expenses: "",
    },
  ])

  const [calculations, setCalculations] = useState({
    profit: 0,
    pdfo: 0,
    militaryTax: 0,
    total: 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelect = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePositionChange = (id: string, field: keyof FinancialPosition, value: string) => {
    setPositions((prev) =>
      prev.map((pos) => (pos.id === id ? { ...pos, [field]: value } : pos))
    )
    // Recalculate taxes whenever a position changes
    setTimeout(() => calculateAllTaxes(), 0)
  }

  const addPosition = () => {
    setPositions((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        assetType: "",
        purchaseDate: "",
        saleDate: "",
        purchasePrice: "",
        salePrice: "",
        expenses: "",
      },
    ])
  }

  const removePosition = (id: string) => {
    if (positions.length > 1) {
      setPositions((prev) => prev.filter((pos) => pos.id !== id))
      setTimeout(() => calculateAllTaxes(), 0)
    }
  }

  const calculateAllTaxes = () => {
    let totalProfit = 0

    positions.forEach((pos) => {
      const purchasePrice = Number.parseFloat(pos.purchasePrice) || 0
      const salePrice = Number.parseFloat(pos.salePrice) || 0
      const expenses = Number.parseFloat(pos.expenses) || 0

      const positionProfit = Math.max(0, salePrice - purchasePrice - expenses)
      totalProfit += positionProfit
    })

    const pdfo = totalProfit * 0.18 // 18% income tax
    const militaryTax = totalProfit * 0.05 // 5% military tax
    const total = pdfo + militaryTax

    setCalculations({
      profit: totalProfit,
      pdfo,
      militaryTax,
      total,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate PDF with current form data
    generateF0121214PDF(
      {
        fullName: formData.fullName,
        taxNumber: formData.taxNumber,
        year: formData.year,
        notes: formData.notes,
        positions: positions,
        calculations: calculations,
      },
      language
    )
  }

  const getLabel = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      uk: {
        personalData: "Персональні дані",
        fullName: "Прізвище та ім'я",
        taxId: "ІПН",
        periodAsset: "Період і тип активу",
        year: "Рік звіту",
        assetType: "Тип інвестиційного активу",
        operationDates: "Дати операцій",
        purchaseDate: "Дата придбання",
        saleDate: "Дата продажу",
        financialIndicators: "Фінансові показники",
        purchasePrice: "Вартість придбання (грн)",
        salePrice: "Вартість продажу (грн)",
        expensesOp: "Витрати на операцію (грн)",
        taxCalculation: "Розрахунок податкових зобов'язань",
        profit: "Прибуток",
        pdfo: "ПДФО (18%)",
        military: "Військ. збір (5%)",
        total: "Всього до сплати",
        additionalInfo: "Додаткова інформація",
        notes: "Примітки та уточнення",
        save: "Сформувати PDF",
        clear: "Очистити форму",
        addPosition: "Додати позицію",
        removePosition: "Видалити позицію",
        position: "Позиція",
      },
      en: {
        personalData: "Personal Data",
        fullName: "Full Name",
        taxId: "Tax ID",
        periodAsset: "Period and Asset Type",
        year: "Reporting Year",
        assetType: "Investment Asset Type",
        operationDates: "Operation Dates",
        purchaseDate: "Purchase Date",
        saleDate: "Sale Date",
        financialIndicators: "Financial Indicators",
        purchasePrice: "Purchase Price (UAH)",
        salePrice: "Sale Price (UAH)",
        expensesOp: "Operation Expenses (UAH)",
        taxCalculation: "Tax Obligation Calculation",
        profit: "Profit",
        pdfo: "Personal Income Tax (18%)",
        military: "Military Levy (5%)",
        total: "Total Due",
        additionalInfo: "Additional Information",
        notes: "Notes and Clarifications",
        save: "Generate PDF",
        clear: "Clear Form",
        addPosition: "Add Position",
        removePosition: "Remove Position",
        position: "Position",
      },
      fr: {
        personalData: "Données personnelles",
        fullName: "Nom complet",
        taxId: "ID fiscal",
        periodAsset: "Période et type d'actif",
        year: "Année du rapport",
        assetType: "Type d'actif d'investissement",
        operationDates: "Dates des opérations",
        purchaseDate: "Date d'achat",
        saleDate: "Date de vente",
        financialIndicators: "Indicateurs financiers",
        purchasePrice: "Prix d'achat (UAH)",
        salePrice: "Prix de vente (UAH)",
        expensesOp: "Frais opérationnels (UAH)",
        taxCalculation: "Calcul de l'obligation fiscale",
        profit: "Bénéfice",
        pdfo: "Impôt sur le revenu (18%)",
        military: "Prélèvement militaire (5%)",
        total: "Montant total dû",
        additionalInfo: "Informations supplémentaires",
        notes: "Notes et clarifications",
        save: "Générer PDF",
        clear: "Effacer le formulaire",
        addPosition: "Ajouter une position",
        removePosition: "Supprimer la position",
        position: "Position",
      },
      pl: {
        personalData: "Dane osobowe",
        fullName: "Imię i nazwisko",
        taxId: "NIP",
        periodAsset: "Okres i typ aktywa",
        year: "Rok raportowania",
        assetType: "Typ aktywa inwestycyjnego",
        operationDates: "Daty operacji",
        purchaseDate: "Data nabycia",
        saleDate: "Data sprzedaży",
        financialIndicators: "Wskaźniki finansowe",
        purchasePrice: "Cena nabycia (UAH)",
        salePrice: "Cena sprzedaży (UAH)",
        expensesOp: "Koszty operacyjne (UAH)",
        taxCalculation: "Obliczenie zobowiązania podatkowego",
        profit: "Zysk",
        pdfo: "PIT (18%)",
        military: "Opłata wojskowa (5%)",
        total: "Razem do zapłaty",
        additionalInfo: "Dodatkowe informacje",
        notes: "Uwagi i wyjaśnienia",
        save: "Generuj PDF",
        clear: "Wyczyść formularz",
        addPosition: "Dodaj pozycję",
        removePosition: "Usuń pozycję",
        position: "Pozycja",
      },
      es: {
        personalData: "Datos personales",
        fullName: "Nombre completo",
        taxId: "Número de contribuyente",
        periodAsset: "Período y tipo de activo",
        year: "Año del informe",
        assetType: "Tipo de activo de inversión",
        operationDates: "Fechas de operación",
        purchaseDate: "Fecha de compra",
        saleDate: "Fecha de venta",
        financialIndicators: "Indicadores financieros",
        purchasePrice: "Precio de compra (UAH)",
        salePrice: "Precio de venta (UAH)",
        expensesOp: "Gastos operacionales (UAH)",
        taxCalculation: "Cálculo de obligación fiscal",
        profit: "Ganancia",
        pdfo: "IRPF (18%)",
        military: "Gravamen militar (5%)",
        total: "Total a pagar",
        additionalInfo: "Información adicional",
        notes: "Notas y aclaraciones",
        save: "Generar PDF",
        clear: "Limpiar formulario",
        addPosition: "Agregar posición",
        removePosition: "Eliminar posición",
        position: "Posición",
      },
      pt: {
        personalData: "Dados pessoais",
        fullName: "Nome completo",
        taxId: "Número de contribuinte",
        periodAsset: "Período e tipo de ativo",
        year: "Ano do relatório",
        assetType: "Tipo de ativo de investimento",
        operationDates: "Datas da operação",
        purchaseDate: "Data de compra",
        saleDate: "Data de venda",
        financialIndicators: "Indicadores financeiros",
        purchasePrice: "Preço de compra (UAH)",
        salePrice: "Preço de venda (UAH)",
        expensesOp: "Despesas operacionais (UAH)",
        taxCalculation: "Cálculo de obrigação fiscal",
        profit: "Lucro",
        pdfo: "IR (18%)",
        military: "Taxa militar (5%)",
        total: "Total a pagar",
        additionalInfo: "Informações adicionais",
        notes: "Notas e esclarecimentos",
        save: "Gerar PDF",
        clear: "Limpar formulário",
        addPosition: "Adicionar posição",
        removePosition: "Remover posição",
        position: "Posição",
      },
      de: {
        personalData: "Persönliche Daten",
        fullName: "Vollständiger Name",
        taxId: "Steuernummer",
        periodAsset: "Zeitraum und Anlagentyp",
        year: "Berichtsjahr",
        assetType: "Typ des Anlagegutes",
        operationDates: "Operationsdaten",
        purchaseDate: "Kaufdatum",
        saleDate: "Verkaufsdatum",
        financialIndicators: "Finanzielle Indikatoren",
        purchasePrice: "Kaufpreis (UAH)",
        salePrice: "Verkaufspreis (UAH)",
        expensesOp: "Betriebsausgaben (UAH)",
        taxCalculation: "Berechnung der Steuerschuld",
        profit: "Gewinn",
        pdfo: "Einkommensteuer (18%)",
        military: "Wehrbeitrag (5%)",
        total: "Gesamtzahlbar",
        additionalInfo: "Zusätzliche Informationen",
        notes: "Notizen und Klarstellungen",
        save: "PDF erstellen",
        profit: "Gewinn",
        pdfo: "Einkommensteuer (18%)",
        military: "Wehrbeitrag (5%)",
        total: "Gesamtzahlbar",
        additionalInfo: "Zusätzliche Informationen",
        notes: "Notizen und Klarstellungen",
        save: "PDF erstellen",
        clear: "Formular löschen",
        addPosition: "Position hinzufügen",
        removePosition: "Position entfernen",
        position: "Position",
      },
    }

    return translations[language]?.[key] || key
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="border-border/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-accent">{getLabel("personalData")}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{getLabel("fullName")}</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Smith"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxNumber">{getLabel("taxId")}</Label>
              <Input
                id="taxNumber"
                name="taxNumber"
                placeholder="ХХХХХХХХХХХХ"
                value={formData.taxNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-accent">{getLabel("year")}</h3>
          <div className="space-y-2">
            <Label htmlFor="year">{getLabel("year")}</Label>
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
        </CardContent>
      </Card>

      {/* Multiple Financial Positions */}
      {positions.map((position, index) => (
        <Card key={position.id} className="border-border/50 relative">
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-accent">
                {getLabel("position")} #{index + 1}
              </h3>
              {positions.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removePosition(position.id)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {getLabel("removePosition")}
                </Button>
              )}
            </div>

            {/* Asset Type */}
            <div className="space-y-2">
              <Label htmlFor={`assetType-${position.id}`}>{getLabel("assetType")}</Label>
              <Select
                value={position.assetType}
                onValueChange={(value) => handlePositionChange(position.id, "assetType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stocks">
                    {language === "uk"
                      ? "Акції"
                      : language === "en"
                        ? "Stocks"
                        : language === "fr"
                          ? "Actions"
                          : language === "pl"
                            ? "Akcje"
                            : language === "es"
                              ? "Acciones"
                              : language === "pt"
                                ? "Ações"
                                : "Aktien"}
                  </SelectItem>
                  <SelectItem value="bonds">
                    {language === "uk"
                      ? "Облігації"
                      : language === "en"
                        ? "Bonds"
                        : language === "fr"
                          ? "Obligations"
                          : language === "pl"
                            ? "Obligacje"
                            : language === "es"
                              ? "Bonos"
                              : language === "pt"
                                ? "Títulos"
                                : "Anleihen"}
                  </SelectItem>
                  <SelectItem value="crypto">
                    {language === "uk"
                      ? "Крипто активи"
                      : language === "en"
                        ? "Crypto Assets"
                        : language === "fr"
                          ? "Actifs crypto"
                          : language === "pl"
                            ? "Aktywa kryptograficzne"
                            : language === "es"
                              ? "Activos criptográficos"
                              : language === "pt"
                                ? "Ativos criptográficos"
                                : "Krypto-Vermögenswerte"}
                  </SelectItem>
                  <SelectItem value="real_estate">
                    {language === "uk"
                      ? "Нерухоме майно"
                      : language === "en"
                        ? "Real Estate"
                        : language === "fr"
                          ? "Immobilier"
                          : language === "pl"
                            ? "Nieruchomości"
                            : language === "es"
                              ? "Bienes raíces"
                              : language === "pt"
                                ? "Imóveis"
                                : "Immobilien"}
                  </SelectItem>
                  <SelectItem value="other">{language === "uk" ? "Інше" : "Other"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Operation Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`purchaseDate-${position.id}`}>{getLabel("purchaseDate")}</Label>
                <Input
                  id={`purchaseDate-${position.id}`}
                  type="date"
                  value={position.purchaseDate}
                  onChange={(e) => handlePositionChange(position.id, "purchaseDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`saleDate-${position.id}`}>{getLabel("saleDate")}</Label>
                <Input
                  id={`saleDate-${position.id}`}
                  type="date"
                  value={position.saleDate}
                  onChange={(e) => handlePositionChange(position.id, "saleDate", e.target.value)}
                />
              </div>
            </div>

            {/* Financial Indicators */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`purchasePrice-${position.id}`}>{getLabel("purchasePrice")}</Label>
                <Input
                  id={`purchasePrice-${position.id}`}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={position.purchasePrice}
                  onChange={(e) => handlePositionChange(position.id, "purchasePrice", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`salePrice-${position.id}`}>{getLabel("salePrice")}</Label>
                <Input
                  id={`salePrice-${position.id}`}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={position.salePrice}
                  onChange={(e) => handlePositionChange(position.id, "salePrice", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`expenses-${position.id}`}>{getLabel("expensesOp")}</Label>
                <Input
                  id={`expenses-${position.id}`}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={position.expenses}
                  onChange={(e) => handlePositionChange(position.id, "expenses", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add Position Button */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={addPosition}
          className="gap-2 border-dashed border-2"
        >
          <Plus className="h-5 w-5" />
          {getLabel("addPosition")}
        </Button>
      </div>

      {/* Tax Calculation Summary */}
      <Card className="border-border/50 bg-primary/5">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-accent">{getLabel("taxCalculation")}</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2 bg-background p-4 rounded-lg border border-border">
              <Label className="text-xs font-semibold uppercase">{getLabel("profit")}</Label>
              <p className="text-2xl font-bold text-primary">{calculations.profit.toFixed(2)}</p>
              <p className="text-xs text-foreground/60">грн</p>
            </div>
            <div className="space-y-2 bg-background p-4 rounded-lg border border-border">
              <Label className="text-xs font-semibold uppercase">{getLabel("pdfo")}</Label>
              <p className="text-2xl font-bold text-accent">{calculations.pdfo.toFixed(2)}</p>
              <p className="text-xs text-foreground/60">грн</p>
            </div>
            <div className="space-y-2 bg-background p-4 rounded-lg border border-border">
              <Label className="text-xs font-semibold uppercase">{getLabel("military")}</Label>
              <p className="text-2xl font-bold text-accent">{calculations.militaryTax.toFixed(2)}</p>
              <p className="text-xs text-foreground/60">грн</p>
            </div>
            <div className="space-y-2 bg-background p-4 rounded-lg border border-primary">
              <Label className="text-xs font-semibold uppercase text-primary">{getLabel("total")}</Label>
              <p className="text-2xl font-bold text-primary">{calculations.total.toFixed(2)}</p>
              <p className="text-xs text-foreground/60">грн</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-accent">{getLabel("additionalInfo")}</h3>
          <div className="space-y-2">
            <Label htmlFor="notes">{getLabel("notes")}</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Enter additional information..."
              value={formData.notes}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 pt-6">
        <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 gap-2">
          <FileText className="h-5 w-5" />
          {getLabel("save")}
        </Button>
        <Button type="reset" variant="outline" size="lg">
          {getLabel("clear")}
        </Button>
      </div>
    </form>
  )
}
