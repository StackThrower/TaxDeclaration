"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useI18n } from "@/lib/i18n-context"
import { Trash2, Plus, FileText, Upload } from "lucide-react"
import { generateF0121214PDF } from "@/lib/pdf-generator"
import {
  fetchNBUExchangeRate,
  convertToUAH,
  SUPPORTED_CURRENCIES,
  formatExchangeRate,
  getCurrencySymbol
} from "@/lib/nbu-exchange-rates"
import {
  parseIBXML,
  convertToFormPosition,
  readFileAsText,
  calculateTradeTotals
} from "@/lib/ib-xml-parser"

interface FinancialPosition {
  id: string
  assetType: string
  currency: string
  purchaseDate: string
  saleDate: string
  purchasePriceForeign: string
  salePriceForeign: string
  purchaseRate: string
  saleRate: string
  purchasePrice: string
  salePrice: string
  expenses: string
}

export function FormF0121214() {
  const { language } = useI18n()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState("")

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
      currency: "UAH",
      purchaseDate: "",
      saleDate: "",
      purchasePriceForeign: "",
      salePriceForeign: "",
      purchaseRate: "1",
      saleRate: "1",
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

    // Fetch exchange rates when currency or dates change
    if (field === "currency" || field === "purchaseDate" || field === "saleDate") {
      const position = positions.find(p => p.id === id)
      if (!position) return

      const currency = field === "currency" ? value : position.currency

      if (currency !== "UAH") {
        // Fetch purchase rate
        if ((field === "currency" || field === "purchaseDate") && (field === "purchaseDate" ? value : position.purchaseDate)) {
          const purchaseDate = field === "purchaseDate" ? value : position.purchaseDate
          fetchNBUExchangeRate(purchaseDate, currency).then(rate => {
            if (rate !== null) {
              setPositions(prev => prev.map(p => {
                if (p.id === id) {
                  const updatedPos = { ...p, purchaseRate: rate.toFixed(4) }
                  // Auto-convert if foreign amount exists
                  if (p.purchasePriceForeign) {
                    const foreignAmount = parseFloat(p.purchasePriceForeign)
                    updatedPos.purchasePrice = convertToUAH(foreignAmount, rate).toFixed(2)
                  }
                  return updatedPos
                }
                return p
              }))
            }
          })
        }

        // Fetch sale rate
        if ((field === "currency" || field === "saleDate") && (field === "saleDate" ? value : position.saleDate)) {
          const saleDate = field === "saleDate" ? value : position.saleDate
          fetchNBUExchangeRate(saleDate, currency).then(rate => {
            if (rate !== null) {
              setPositions(prev => prev.map(p => {
                if (p.id === id) {
                  const updatedPos = { ...p, saleRate: rate.toFixed(4) }
                  // Auto-convert if foreign amount exists
                  if (p.salePriceForeign) {
                    const foreignAmount = parseFloat(p.salePriceForeign)
                    updatedPos.salePrice = convertToUAH(foreignAmount, rate).toFixed(2)
                  }
                  return updatedPos
                }
                return p
              }))
            }
          })
        }
      } else {
        // Reset rates to 1 for UAH
        setPositions(prev => prev.map(p => {
          if (p.id === id) {
            return {
              ...p,
              purchaseRate: "1",
              saleRate: "1",
              purchasePrice: p.purchasePriceForeign || p.purchasePrice,
              salePrice: p.salePriceForeign || p.salePrice
            }
          }
          return p
        }))
      }
    }

    // Auto-convert when foreign amounts change
    if (field === "purchasePriceForeign") {
      const position = positions.find(p => p.id === id)
      if (position && position.currency !== "UAH") {
        const foreignAmount = parseFloat(value) || 0
        const rate = parseFloat(position.purchaseRate) || 1
        const uahAmount = convertToUAH(foreignAmount, rate).toFixed(2)
        setPositions(prev => prev.map(p =>
          p.id === id ? { ...p, purchasePrice: uahAmount } : p
        ))
      }
    }

    if (field === "salePriceForeign") {
      const position = positions.find(p => p.id === id)
      if (position && position.currency !== "UAH") {
        const foreignAmount = parseFloat(value) || 0
        const rate = parseFloat(position.saleRate) || 1
        const uahAmount = convertToUAH(foreignAmount, rate).toFixed(2)
        setPositions(prev => prev.map(p =>
          p.id === id ? { ...p, salePrice: uahAmount } : p
        ))
      }
    }
  }

  const addPosition = () => {
    setPositions((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        assetType: "",
        currency: "UAH",
        purchaseDate: "",
        saleDate: "",
        purchasePriceForeign: "",
        salePriceForeign: "",
        purchaseRate: "1",
        saleRate: "1",
        purchasePrice: "",
        salePrice: "",
        expenses: "",
      },
    ])
  }

  const removePosition = (id: string) => {
    if (positions.length > 1) {
      setPositions((prev) => prev.filter((pos) => pos.id !== id))
    }
  }

  const handleImportXML = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportProgress(0)
    setImportStatus(language === "uk" ? "Читання файлу..." : "Reading file...")

    try {
      // Read file content
      setImportProgress(10)
      const xmlContent = await readFileAsText(file)

      // Parse XML
      setImportProgress(20)
      setImportStatus(language === "uk" ? "Парсинг XML..." : "Parsing XML...")
      const parsedData = parseIBXML(xmlContent)

      if (parsedData.trades.length === 0) {
        alert(language === "uk"
          ? "У файлі не знайдено закритих позицій для імпорту"
          : "No closed positions found in the file")
        return
      }

      // Convert trades to form positions
      setImportProgress(30)
      setImportStatus(language === "uk" ? "Конвертація позицій..." : "Converting positions...")
      const newPositions = parsedData.trades.map(trade => convertToFormPosition(trade))

      // Replace existing positions with imported ones
      setPositions(newPositions)

      setImportProgress(40)
      setImportStatus(language === "uk"
        ? `Імпортовано ${parsedData.trades.length} позиції(й). Завантаження курсів НБУ...`
        : `Imported ${parsedData.trades.length} position(s). Fetching NBU rates...`)

      // Fetch rates for each position and update state progressively
      const updatedPositions = [...newPositions]
      const totalPositions = updatedPositions.length
      const progressPerPosition = 60 / totalPositions // Remaining 60% for rate fetching

      for (let i = 0; i < updatedPositions.length; i++) {
        const position = updatedPositions[i]
        const currentProgress = 40 + ((i + 1) * progressPerPosition)

        setImportProgress(currentProgress)
        setImportStatus(language === "uk"
          ? `Завантаження курсів НБУ... (${i + 1}/${totalPositions})`
          : `Fetching NBU rates... (${i + 1}/${totalPositions})`)

        if (position.currency !== "UAH" && position.purchaseDate && position.saleDate) {
          try {
            // Fetch purchase rate
            const purchaseRate = await fetchNBUExchangeRate(position.purchaseDate, position.currency)
            if (purchaseRate !== null) {
              const foreignPurchaseAmount = parseFloat(position.purchasePriceForeign) || 0
              const uahPurchaseAmount = convertToUAH(foreignPurchaseAmount, purchaseRate)

              updatedPositions[i] = {
                ...position,
                purchaseRate: purchaseRate.toFixed(4),
                purchasePrice: uahPurchaseAmount.toFixed(2)
              }
            }

            // Fetch sale rate
            const saleRate = await fetchNBUExchangeRate(position.saleDate, position.currency)
            if (saleRate !== null) {
              const foreignSaleAmount = parseFloat(position.salePriceForeign) || 0
              const uahSaleAmount = convertToUAH(foreignSaleAmount, saleRate)

              updatedPositions[i] = {
                ...updatedPositions[i],
                saleRate: saleRate.toFixed(4),
                salePrice: uahSaleAmount.toFixed(2)
              }
            }
          } catch (error) {
            console.error(`Error fetching rates for position ${position.id}:`, error)
          }
        }
      }

      // Force update with completely new array to trigger useEffect
      setImportProgress(95)
      setImportStatus(language === "uk" ? "Фінальні розрахунки..." : "Final calculations...")
      setPositions(updatedPositions.map(pos => ({...pos})))

      // Calculate totals for summary message
      const totals = calculateTradeTotals(parsedData.trades)

      // Show success message
      setImportProgress(100)
      setImportStatus(language === "uk" ? "Завершено!" : "Complete!")

      setTimeout(() => {
        const message = language === "uk"
          ? `✅ Успішно імпортовано ${parsedData.trades.length} позиції(й)!\n\nЗагальний прибуток/збиток: ${totals.totalProfit.toFixed(2)} ${parsedData.trades[0]?.currency || 'USD'}\n\nКурси НБУ завантажено та суми конвертовано в гривні.`
          : `✅ Successfully imported ${parsedData.trades.length} position(s)!\n\nTotal profit/loss: ${totals.totalProfit.toFixed(2)} ${parsedData.trades[0]?.currency || 'USD'}\n\nNBU rates fetched and amounts converted to UAH.`

        alert(message)
        setImportProgress(0)
        setImportStatus("")
      }, 500)

    } catch (error) {
      console.error("Error importing XML:", error)
      alert(language === "uk"
        ? `Помилка при імпорті файлу: ${error instanceof Error ? error.message : "Невідома помилка"}`
        : `Error importing file: ${error instanceof Error ? error.message : "Unknown error"}`)
      setImportProgress(0)
      setImportStatus("")
    } finally {
      setIsImporting(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Автоматический пересчет налогов при изменении позиций
  useEffect(() => {
    let totalProfit = 0

    positions.forEach((pos) => {
      const purchasePrice = Number.parseFloat(pos.purchasePrice) || 0
      const salePrice = Number.parseFloat(pos.salePrice) || 0
      const expenses = Number.parseFloat(pos.expenses) || 0

      // Разрешаем отрицательные значения (убытки)
      const positionProfit = salePrice - purchasePrice - expenses
      totalProfit += positionProfit

      // Логування для відлагодження
      if (purchasePrice > 0 || salePrice > 0 || expenses > 0) {
        console.log(`Позиція ${pos.id}:`, {
          купівля: purchasePrice,
          продаж: salePrice,
          витрати: expenses,
          прибуток: positionProfit,
          тип: positionProfit >= 0 ? '✅ прибуток' : '❌ збиток'
        })
      }
    })

    // Налоги платятся только с прибыли
    const pdfo = totalProfit > 0 ? totalProfit * 0.18 : 0 // 18% income tax
    const militaryTax = totalProfit > 0 ? totalProfit * 0.05 : 0 // 5% military tax
    const total = pdfo + militaryTax

    console.log('Загальні розрахунки:', {
      'загальний прибуток': totalProfit,
      'ПДФО (18%)': pdfo,
      'Військовий збір (5%)': militaryTax,
      'всього до сплати': total
    })

    setCalculations({
      profit: totalProfit,
      pdfo,
      militaryTax,
      total,
    })
  }, [positions])



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Generate PDF with current form data
    await generateF0121214PDF(
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
        currency: "Валюта операції",
        operationDates: "Дати операцій",
        purchaseDate: "Дата придбання",
        saleDate: "Дата продажу",
        foreignAmounts: "Суми в іноземній валюті",
        purchasePriceForeign: "Сума купівлі (валюта)",
        salePriceForeign: "Сума продажу (валюта)",
        exchangeRates: "Курси НБУ",
        purchaseRate: "Курс НБУ купівлі",
        saleRate: "Курс НБУ продажу",
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
        currency: "Transaction Currency",
        operationDates: "Operation Dates",
        purchaseDate: "Purchase Date",
        saleDate: "Sale Date",
        foreignAmounts: "Foreign Currency Amounts",
        purchasePriceForeign: "Purchase amount (foreign)",
        salePriceForeign: "Sale amount (foreign)",
        exchangeRates: "NBU Exchange Rates",
        purchaseRate: "NBU purchase rate",
        saleRate: "NBU sale rate",
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

            {/* Currency Selector */}
            <div className="space-y-2">
              <Label htmlFor={`currency-${position.id}`}>{getLabel("currency")}</Label>
              <Select
                value={position.currency}
                onValueChange={(value) => handlePositionChange(position.id, "currency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name} ({curr.symbol})
                    </SelectItem>
                  ))}
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

            {/* Foreign Currency Amounts (if not UAH) */}
            {position.currency !== "UAH" && (
              <>
                <div className="pt-2">
                  <h4 className="text-sm font-semibold text-accent mb-3">{getLabel("foreignAmounts")}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`purchasePriceForeign-${position.id}`}>
                        {getLabel("purchasePriceForeign")}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={`purchasePriceForeign-${position.id}`}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={position.purchasePriceForeign}
                          onChange={(e) => handlePositionChange(position.id, "purchasePriceForeign", e.target.value)}
                        />
                        <div className="flex items-center px-3 bg-muted rounded-md min-w-[60px] justify-center">
                          <span className="text-sm font-medium">{getCurrencySymbol(position.currency)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`salePriceForeign-${position.id}`}>
                        {getLabel("salePriceForeign")}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={`salePriceForeign-${position.id}`}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={position.salePriceForeign}
                          onChange={(e) => handlePositionChange(position.id, "salePriceForeign", e.target.value)}
                        />
                        <div className="flex items-center px-3 bg-muted rounded-md min-w-[60px] justify-center">
                          <span className="text-sm font-medium">{getCurrencySymbol(position.currency)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-semibold text-accent mb-3">{getLabel("exchangeRates")}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{getLabel("purchaseRate")}</Label>
                      <div className="p-3 bg-muted rounded-md">
                        <span className="text-sm font-mono">
                          {formatExchangeRate(parseFloat(position.purchaseRate) || null, position.currency)} ₴
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{getLabel("saleRate")}</Label>
                      <div className="p-3 bg-muted rounded-md">
                        <span className="text-sm font-mono">
                          {formatExchangeRate(parseFloat(position.saleRate) || null, position.currency)} ₴
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

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
                  readOnly={position.currency !== "UAH"}
                  className={position.currency !== "UAH" ? "bg-muted cursor-not-allowed" : ""}
                />
                {position.currency !== "UAH" && (
                  <p className="text-xs text-muted-foreground">Автоматично розраховано</p>
                )}
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
                  readOnly={position.currency !== "UAH"}
                  className={position.currency !== "UAH" ? "bg-muted cursor-not-allowed" : ""}
                />
                {position.currency !== "UAH" && (
                  <p className="text-xs text-muted-foreground">Автоматично розраховано</p>
                )}
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

      {/* Import and Add Position Buttons */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xml"
            onChange={handleImportXML}
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={triggerFileInput}
            disabled={isImporting}
            className="gap-2"
          >
            <Upload className="h-5 w-5" />
            {isImporting
              ? (language === "uk" ? "Імпорт..." : "Importing...")
              : (language === "uk" ? "Імпортувати дані" : "Import Data")
            }
          </Button>
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

        {/* Import Progress Bar */}
        {isImporting && (
          <Card className="border-primary/50 bg-primary/5 animate-pulse">
            <CardContent className="pt-6 pb-6 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-primary animate-spin border-2 border-primary-foreground border-t-transparent"></div>
                  <span className="text-sm font-medium text-foreground">
                    {importStatus}
                  </span>
                </div>
                <span className="text-sm font-bold text-primary">
                  {Math.round(importProgress)}%
                </span>
              </div>
              <Progress value={importProgress} className="h-3" />
              <p className="text-xs text-muted-foreground text-center mt-2">
                {language === "uk"
                  ? "Будь ласка, зачекайте. Це може зайняти кілька секунд..."
                  : "Please wait. This may take a few seconds..."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tax Calculation Summary */}
      <Card className="border-border/50 bg-primary/5">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-accent">{getLabel("taxCalculation")}</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2 bg-background p-4 rounded-lg border border-border">
              <Label className="text-xs font-semibold uppercase">{getLabel("profit")}</Label>
              <p className={`text-2xl font-bold ${calculations.profit >= 0 ? 'text-primary' : 'text-red-600'}`}>
                {calculations.profit >= 0 ? '' : '-'}{Math.abs(calculations.profit).toFixed(2)}
              </p>
              <p className="text-xs text-foreground/60">
                {calculations.profit >= 0 ? 'грн (прибуток)' : 'грн (збиток)'}
              </p>
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
