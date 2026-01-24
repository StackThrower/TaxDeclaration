"use client"

import type React from "react"
import { useState, useEffect, useRef, useId } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useI18n } from "@/lib/i18n-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { Trash2, Plus, FileText, Upload, FileSpreadsheet, HelpCircle } from "lucide-react"
import Link from "next/link"
import { generateF0121214PDF } from "@/lib/pdf-generator"
import { generateTaxCalculationExcel } from "@/lib/excel-generator"
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
  convertDividendToFormPosition,
  readFileAsText,
  calculateTradeTotals
} from "@/lib/ib-xml-parser"

interface FinancialPosition {
  id: string
  assetType: string
  assetDescription?: string
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
  quantity?: string
  multiplier?: string
}

export function FormF0121214() {
  const { language } = useI18n()
  const isMobile = useIsMobile()
  const [anonymous, setAnonymous] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState("")

  // Use stable ID generation to avoid hydration mismatch
  const baseId = useId()
  const idCounterRef = useRef(0)
  const generateId = () => {
    idCounterRef.current += 1
    return `${baseId}-${idCounterRef.current}`
  }

  const [formData, setFormData] = useState({
    fullName: "",
    taxNumber: "",
    year: "2026",
    notes: "",
  })

  const [positions, setPositions] = useState<FinancialPosition[]>([
    {
      id: `${baseId}-0`,
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
      quantity: "",
      multiplier: "1",
    },
  ])

  const [calculations, setCalculations] = useState({
    profit: 0,
    pdfo: 0,
    militaryTax: 0,
    total: 0,
    profitFromTrades: 0,
    dividends: 0,
    pdfoFromTrades: 0,
    pdfoFromDividends: 0,
    militaryTaxFromTrades: 0,
    militaryTaxFromDividends: 0,
  })

  // Ставка военного сбора для отображения: 1.5% для года ≤2024, 5% для года ≥2025
  const [militaryTaxRateDisplay, setMilitaryTaxRateDisplay] = useState("5")

  // Обновляем ставку при изменении года
  useEffect(() => {
    const reportYear = parseInt(formData.year) || 2026
    setMilitaryTaxRateDisplay(reportYear >= 2025 ? "5" : "1.5")
  }, [formData.year])

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
        id: generateId(),
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
        quantity: "",
        multiplier: "1",
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

      if (parsedData.trades.length === 0 && parsedData.dividends.length === 0) {
        alert(language === "uk"
          ? "У файлі не знайдено закритих позицій або дивідендів для імпорту"
          : "No closed positions or dividends found in the file")
        return
      }

      // Convert trades to form positions
      setImportProgress(30)
      setImportStatus(language === "uk" ? "Конвертація позицій..." : "Converting positions...")
      const tradePositions = parsedData.trades.map(trade => convertToFormPosition(trade))
      const dividendPositions = parsedData.dividends.map(dividend => convertDividendToFormPosition(dividend))
      const newPositions = [...tradePositions, ...dividendPositions]

      // Replace existing positions with imported ones
      setPositions(newPositions)

      setImportProgress(40)
      const totalItems = parsedData.trades.length + parsedData.dividends.length
      setImportStatus(language === "uk"
        ? `Імпортовано ${totalItems} позиції(й) (трейди: ${parsedData.trades.length}, дивіденди: ${parsedData.dividends.length}). Завантаження курсів НБУ...`
        : `Imported ${totalItems} position(s) (trades: ${parsedData.trades.length}, dividends: ${parsedData.dividends.length}). Fetching NBU rates...`)

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

        if (position.currency !== "UAH" && position.saleDate) {
          try {
            // For dividends, only fetch sale rate (payment date)
            // For other assets, fetch both rates
            if (position.assetType === "dividends") {
              // Only fetch sale rate for dividends
              const saleRate = await fetchNBUExchangeRate(position.saleDate, position.currency)
              if (saleRate !== null) {
                const foreignSaleAmount = parseFloat(position.salePriceForeign) || 0
                const uahSaleAmount = convertToUAH(foreignSaleAmount, saleRate)

                updatedPositions[i] = {
                  ...position,
                  saleRate: saleRate.toFixed(4),
                  salePrice: uahSaleAmount.toFixed(2)
                }
              }
            } else {
              // For other assets, fetch both rates
              if (position.purchaseDate) {
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
        const totalItems = parsedData.trades.length + parsedData.dividends.length
        const message = language === "uk"
          ? `✅ Успішно імпортовано ${totalItems} позиції(й)!\n\n` +
            `Трейди: ${parsedData.trades.length}\n` +
            `Дивіденди: ${parsedData.dividends.length}\n\n` +
            (parsedData.trades.length > 0 ? `Загальний прибуток/збиток від трейдів: ${totals.totalProfit.toFixed(2)} ${parsedData.trades[0]?.currency || 'USD'}\n\n` : '') +
            `Курси НБУ завантажено та суми конвертовано в гривні.`
          : `✅ Successfully imported ${totalItems} position(s)!\n\n` +
            `Trades: ${parsedData.trades.length}\n` +
            `Dividends: ${parsedData.dividends.length}\n\n` +
            (parsedData.trades.length > 0 ? `Total profit/loss from trades: ${totals.totalProfit.toFixed(2)} ${parsedData.trades[0]?.currency || 'USD'}\n\n` : '') +
            `NBU rates fetched and amounts converted to UAH`

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

  // Автоматический пересчет налогов при изменении позиций или года
  useEffect(() => {
    let totalProfitFromTrades = 0
    let totalDividends = 0

    // Ставка военного сбора: 1.5% для года ≤2024, 5% для года ≥2025
    const reportYear = parseInt(formData.year) || 2026
    const militaryTaxRate = reportYear >= 2025 ? 0.05 : 0.015

    positions.forEach((pos) => {
      const purchasePrice = Number.parseFloat(pos.purchasePrice) || 0
      const salePrice = Number.parseFloat(pos.salePrice) || 0
      const expenses = Number.parseFloat(pos.expenses) || 0

      // Разделяем дивиденды и остальные операции
      if (pos.assetType === "dividends") {
        // Для дивідендів считаем только полученную сумму
        totalDividends += salePrice

        // Логування для дивідендів
        if (salePrice > 0) {
          console.log(`Дивіденд ${pos.id}:`, {
            тип: 'dividends',
            сума: salePrice,
            валюта: pos.currency,
            'сума (валюта)': pos.salePriceForeign,
            'курс НБУ': pos.saleRate
          })
        }
      } else {
        // Для трейдов разрешаем отрицательные значения (убытки)
        const positionProfit = salePrice - purchasePrice - expenses
        totalProfitFromTrades += positionProfit

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
      }
    })

    // Налоги для трейдов: 18% ПДФО + военный сбор (1.5% или 5%)
    const pdfoFromTrades = totalProfitFromTrades > 0 ? totalProfitFromTrades * 0.18 : 0
    const militaryTaxFromTrades = totalProfitFromTrades > 0 ? totalProfitFromTrades * militaryTaxRate : 0

    // Налоги для дивидендов: 9% ПДФО + военный сбор (1.5% или 5%)
    const pdfoFromDividends = totalDividends > 0 ? totalDividends * 0.09 : 0
    const militaryTaxFromDividends = totalDividends > 0 ? totalDividends * militaryTaxRate : 0

    // Общие налоги
    const totalPdfo = pdfoFromTrades + pdfoFromDividends
    const totalMilitaryTax = militaryTaxFromTrades + militaryTaxFromDividends
    const total = totalPdfo + totalMilitaryTax

    const militaryTaxPercent = (militaryTaxRate * 100).toFixed(1)
    console.log('Загальні розрахунки:', {
      'рік звіту': reportYear,
      'ставка військового збору': `${militaryTaxPercent}%`,
      'прибуток від трейдів': totalProfitFromTrades,
      'дивіденди': totalDividends,
      'ПДФО від трейдів (18%)': pdfoFromTrades,
      'ПДФО від дивідендів (9%)': pdfoFromDividends,
      'ПДФО загалом': totalPdfo,
      [`Військовий збір від трейдів (${militaryTaxPercent}%)`]: militaryTaxFromTrades,
      [`Військовий збір від дивідендів (${militaryTaxPercent}%)`]: militaryTaxFromDividends,
      'Військовий збір загалом': totalMilitaryTax,
      'всього до сплати': total
    })

    setCalculations({
      profit: totalProfitFromTrades + totalDividends,
      pdfo: totalPdfo,
      militaryTax: totalMilitaryTax,
      total,
      profitFromTrades: totalProfitFromTrades,
      dividends: totalDividends,
      pdfoFromTrades: pdfoFromTrades,
      pdfoFromDividends: pdfoFromDividends,
      militaryTaxFromTrades: militaryTaxFromTrades,
      militaryTaxFromDividends: militaryTaxFromDividends,
    })
  }, [positions, formData.year])



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Localized anonymous strings
    const anonymousValues: Record<string, string> = {
      uk: "Не вказано",
      en: "Not specified",
      fr: "Non spécifié",
      pl: "Nie podano",
      es: "No especificado",
      pt: "Não especificado",
      de: "Nicht angegeben",
      ru: "Не указано",
    }

    const anonValue = anonymousValues[language as keyof typeof anonymousValues] || anonymousValues.uk

    // Generate PDF with current form data (respect anonymous selection)
    await generateF0121214PDF(
      {
        fullName: anonymous ? anonValue : formData.fullName,
        taxNumber: anonymous ? anonValue : formData.taxNumber,
        year: formData.year,
        notes: formData.notes,
        positions: positions,
        calculations: calculations,
      },
      language
    )
  }

  const handleClear = () => {
    // Очищаємо основні дані форми
    setFormData({
      fullName: "",
      taxNumber: "",
      year: "2026",
      notes: "",
    })

    // Очищаємо всі позиції і повертаємо одну порожню
    setPositions([
      {
        id: generateId(),
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

    // Очищаємо розрахунки
    setCalculations({
      profit: 0,
      pdfo: 0,
      militaryTax: 0,
      total: 0,
      profitFromTrades: 0,
      dividends: 0,
      pdfoFromTrades: 0,
      pdfoFromDividends: 0,
      militaryTaxFromTrades: 0,
      militaryTaxFromDividends: 0,
    })
  }

  const handleExportExcel = () => {
    // Validate that we have required data
    // If not anonymous, ensure required fields are present
    if (!anonymous && (!formData.fullName || !formData.taxNumber)) {
      alert(language === "uk"
        ? "Будь ласка, заповніть ім'я та ІПН перед експортом"
        : "Please fill in name and tax ID before export")
      return
    }

    const anonymousValues: Record<string, string> = {
      uk: "Не вказано",
      en: "Not specified",
      fr: "Non spécifié",
      pl: "Nie podano",
      es: "No especificado",
      pt: "Não especificado",
      de: "Nicht angegeben",
      ru: "Не указано",
    }

    const anonValue = anonymousValues[language as keyof typeof anonymousValues] || anonymousValues.uk

    // Generate Excel file; substitute anonymous values when needed
    generateTaxCalculationExcel(
      {
        fullName: anonymous ? anonValue : formData.fullName,
        taxNumber: anonymous ? anonValue : formData.taxNumber,
        year: formData.year,
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
        pdfo: "ПДФО (18% + 9%)",
        military: `Військ. збір (${militaryTaxRateDisplay}%)`,
        total: "Всього до сплати",
        additionalInfo: "Додаткова інформація",
        notes: "Примітки та уточнення",
        save: "Сформувати PDF",
        clear: "Очистити форму",
        addPosition: "Додати позицію",
        removePosition: "Видалити позицію",
        position: "Позиція",
        checkCalculations: "Перевірити розрахунки",
        disclaimer: "⚠️ Всі сформовані дані повинні бути перевірені та підтверджені користувачем перед поданням до податкових органів.",
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
        military: `Military Levy (${militaryTaxRateDisplay}%)`,
        total: "Total Due",
        additionalInfo: "Additional Information",
        notes: "Notes and Clarifications",
        save: "Generate PDF",
        clear: "Clear Form",
        addPosition: "Add Position",
        removePosition: "Remove Position",
        position: "Position",
        checkCalculations: "Check Calculations",
        disclaimer: "⚠️ All generated data must be verified and confirmed by tax consultants before submission to tax authorities.",
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
        military: `Prélèvement militaire (${militaryTaxRateDisplay}%)`,
        total: "Montant total dû",
        additionalInfo: "Informations supplémentaires",
        notes: "Notes et clarifications",
        save: "Générer PDF",
        clear: "Effacer le formulaire",
        addPosition: "Ajouter une position",
        removePosition: "Supprimer la position",
        position: "Position",
        checkCalculations: "Vérifier les calculs",
        disclaimer: "⚠️ Toutes les données générées doivent être vérifiées et confirmées par des conseillers fiscaux avant soumission aux autorités fiscales.",
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
        military: `Opłata wojskowa (${militaryTaxRateDisplay}%)`,
        total: "Razem do zapłaty",
        additionalInfo: "Dodatkowe informacje",
        notes: "Uwagi i wyjaśnienia",
        save: "Generuj PDF",
        clear: "Wyczyść formularz",
        addPosition: "Dodaj pozycję",
        removePosition: "Usuń pozycję",
        position: "Pozycja",
        checkCalculations: "Sprawdź obliczenia",
        disclaimer: "⚠️ Wszystkie wygenerowane dane powinny zostać zweryfikowane i potwierdzone przez doradców podatkowych przed złożeniem do urzędu skarbowego.",
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
        military: `Gravamen militar (${militaryTaxRateDisplay}%)`,
        total: "Total a pagar",
        additionalInfo: "Información adicional",
        notes: "Notas y aclaraciones",
        save: "Generar PDF",
        clear: "Limpiar formulario",
        addPosition: "Agregar posición",
        removePosition: "Eliminar posición",
        position: "Posición",
        checkCalculations: "Verificar cálculos",
        disclaimer: "⚠️ Todos los datos generados deben ser verificados y confirmados por asesores fiscales antes de ser presentados a las autoridades fiscales.",
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
        military: `Taxa militar (${militaryTaxRateDisplay}%)`,
        total: "Total a pagar",
        additionalInfo: "Informações adicionais",
        notes: "Notas e esclarecimentos",
        save: "Gerar PDF",
        clear: "Limpar formulário",
        addPosition: "Adicionar posição",
        removePosition: "Remover posição",
        position: "Posição",
        checkCalculations: "Verificar cálculos",
        disclaimer: "⚠️ Todos os dados gerados devem ser verificados e confirmados por consultores fiscais antes da submissão às autoridades fiscais.",
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
        military: `Wehrbeitrag (${militaryTaxRateDisplay}%)`,
        total: "Gesamtzahlbar",
        additionalInfo: "Zusätzliche Informationen",
        notes: "Notizen und Klarstellungen",
        save: "PDF erstellen",
        clear: "Formular löschen",
        addPosition: "Position hinzufügen",
        removePosition: "Position entfernen",
        position: "Position",
        checkCalculations: "Berechnungen überprüfen",
        disclaimer: "⚠️ Alle generierten Daten müssen von Steuerberatern überprüft und bestätigt werden, bevor sie bei den Steuerbehörden eingereicht werden.",
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
                required={!anonymous}
                disabled={anonymous}
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
                required={!anonymous}
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
                  <SelectItem value="options">
                    {language === "uk"
                      ? "Опціони"
                      : language === "en"
                        ? "Options"
                        : language === "fr"
                          ? "Options"
                          : language === "pl"
                            ? "Opcje"
                            : language === "es"
                              ? "Opciones"
                              : language === "pt"
                                ? "Opções"
                                : "Optionen"}
                  </SelectItem>
                  <SelectItem value="dividends">
                    {language === "uk"
                      ? "Дивіденди"
                      : language === "en"
                        ? "Dividends"
                        : language === "fr"
                          ? "Dividendes"
                          : language === "pl"
                            ? "Dywidendy"
                            : language === "es"
                              ? "Dividendos"
                              : language === "pt"
                                ? "Dividendos"
                                : "Dividenden"}
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
            {position.assetType === "dividends" ? (
              // For dividends, only show payment date
              <div className="space-y-2">
                <Label htmlFor={`saleDate-${position.id}`}>
                  {language === "uk" ? "Дата отримання дивідендів" : "Dividend Payment Date"}
                </Label>
                <Input
                  id={`saleDate-${position.id}`}
                  type="date"
                  value={position.saleDate}
                  onChange={(e) => handlePositionChange(position.id, "saleDate", e.target.value)}
                />
              </div>
            ) : (
              // For other assets, show both dates
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
            )}

            {/* Foreign Currency Amounts (if not UAH) */}
            {position.currency !== "UAH" && (
              <>
                <div className="pt-2">
                  <h4 className="text-sm font-semibold text-accent mb-3">{getLabel("foreignAmounts")}</h4>
                  {position.assetType === "dividends" ? (
                    // For dividends, only show received amount
                    <div className="space-y-2">
                      <Label htmlFor={`salePriceForeign-${position.id}`}>
                        {language === "uk" ? "Сума отримана (валюта)" : "Amount Received (foreign)"}
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
                  ) : (
                    // For other assets, show both amounts
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
                  )}
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-semibold text-accent mb-3">{getLabel("exchangeRates")}</h4>
                  {position.assetType === "dividends" ? (
                    // For dividends, only show one rate
                    <div className="space-y-2">
                      <Label>{language === "uk" ? "Курс НБУ на дату отримання" : "NBU Rate on Payment Date"}</Label>
                      <div className="p-3 bg-muted rounded-md">
                        <span className="text-sm font-mono">
                          {formatExchangeRate(parseFloat(position.saleRate) || null, position.currency)} ₴
                        </span>
                      </div>
                    </div>
                  ) : (
                    // For other assets, show both rates
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
                  )}
                </div>
              </>
            )}

            {/* Financial Indicators */}
            {position.assetType === "dividends" ? (
              // For dividends, only show received amount
              <div className="space-y-2">
                <Label htmlFor={`salePrice-${position.id}`}>
                  {language === "uk" ? "Сума отримана (грн)" : "Amount Received (UAH)"}
                </Label>
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
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    💡 {language === "uk"
                      ? `Для дивідендів: ПДФО 9% + Військовий збір ${militaryTaxRateDisplay}%`
                      : `For dividends: PIT 9% + Military Levy ${militaryTaxRateDisplay}%`
                    }
                  </p>
                </div>
              </div>
            ) : (
              // For other assets, show all fields
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
            )}
          </CardContent>
        </Card>
      ))}

      {/* Import and Add Position Buttons */}
      <div className="flex flex-col gap-4">
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} justify-center gap-3 ${isMobile ? 'w-full' : ''}`}>
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
            size={isMobile ? "default" : "lg"}
            onClick={triggerFileInput}
            disabled={isImporting}
            className={`gap-2 ${isMobile ? 'w-full' : ''}`}
          >
            <Upload className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            <span className={isMobile ? 'text-sm' : ''}>
              {isImporting
                ? (language === "uk" ? "Імпорт..." : "Importing...")
                : (language === "uk" ? "Імпортувати дані" : "Import Data")
              }
            </span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size={isMobile ? "default" : "lg"}
            onClick={addPosition}
            className={`gap-2 border-dashed border-2 ${isMobile ? 'w-full' : ''}`}
          >
            <Plus className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            <span className={isMobile ? 'text-sm' : ''}>{getLabel("addPosition")}</span>
          </Button>
        </div>

        {/* Import Info */}
        {!isImporting && (
          <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span>
              {language === "uk" ? (
                <>
                  Завантажте XML файл з Interactive Brokers (
                  <Link
                    href="/uk-ua/knowledge/flex-report-ib"
                    className="text-primary hover:underline font-medium"
                    target="_blank"
                  >
                    FlexQuery Report з закритими позиціями
                  </Link>
                  )
                </>
              ) : (
                "Upload XML file from Interactive Brokers (FlexQuery Report with closed positions)"
              )}
            </span>
            {language === "uk" && (
              <Link
                href="/uk-ua/knowledge/flex-report-ib"
                className="text-primary hover:text-primary/80 transition-colors"
                target="_blank"
                title="Детальна інструкція про FlexQuery Report"
              >
                <HelpCircle className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}

        {/* Import Progress Bar */}
        {isImporting && (
          <Card className="border-primary/50 bg-primary/5 shadow-lg">
            <CardContent className="pt-6 pb-6 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-primary animate-spin border-2 border-background border-t-transparent"></div>
                  <span className="text-sm font-medium text-foreground">
                    {importStatus}
                  </span>
                </div>
                <span className="text-sm font-bold text-primary tabular-nums">
                  {Math.round(importProgress)}%
                </span>
              </div>
              <Progress value={importProgress} className="h-3 transition-all duration-300" />
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

      {/* Detailed Tax Breakdown */}
      {(calculations.profitFromTrades !== 0 || (calculations.dividends !== undefined && calculations.dividends > 0)) && (
        <Card className="border-border/50 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-accent">
              {language === "uk" ? "Деталізація податків" : "Tax Breakdown"}
            </h3>

            {/* Trades Section */}
            {calculations.profitFromTrades !== undefined && calculations.profitFromTrades !== 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <h4 className="font-semibold text-sm">
                    {language === "uk" ? "Трейди (Акції, Опціони, Облігації)" : "Trades (Stocks, Options, Bonds)"}
                  </h4>
                </div>
                <div className="grid md:grid-cols-3 gap-3 pl-4">
                  <div className="space-y-1 bg-background p-3 rounded-md border border-border">
                    <p className="text-xs text-muted-foreground">
                      {language === "uk" ? "Прибуток/Збиток" : "Profit/Loss"}
                    </p>
                    <p className={`text-lg font-bold ${calculations.profitFromTrades >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calculations.profitFromTrades >= 0 ? '' : '-'}{Math.abs(calculations.profitFromTrades).toFixed(2)} ₴
                    </p>
                  </div>
                  <div className="space-y-1 bg-background p-3 rounded-md border border-border">
                    <p className="text-xs text-muted-foreground">
                      {language === "uk" ? "ПДФО (18%)" : "PIT (18%)"}
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {calculations.pdfoFromTrades.toFixed(2)} ₴
                    </p>
                  </div>
                  <div className="space-y-1 bg-background p-3 rounded-md border border-border">
                    <p className="text-xs text-muted-foreground">
                      {language === "uk" ? `Військовий збір (${militaryTaxRateDisplay}%)` : `Military Levy (${militaryTaxRateDisplay}%)`}
                    </p>
                    <p className="text-lg font-bold text-orange-600">
                      {calculations.militaryTaxFromTrades.toFixed(2)} ₴
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dividends Section */}
            {calculations.dividends !== undefined && calculations.dividends > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <h4 className="font-semibold text-sm">
                    {language === "uk" ? "Дивіденди" : "Dividends"}
                  </h4>
                </div>
                <div className="grid md:grid-cols-3 gap-3 pl-4">
                  <div className="space-y-1 bg-background p-3 rounded-md border border-border">
                    <p className="text-xs text-muted-foreground">
                      {language === "uk" ? "Отримано дивідендів" : "Dividends Received"}
                    </p>
                    <p className="text-lg font-bold text-purple-600">
                      {calculations.dividends.toFixed(2)} ₴
                    </p>
                  </div>
                  <div className="space-y-1 bg-background p-3 rounded-md border border-border">
                    <p className="text-xs text-muted-foreground">
                      {language === "uk" ? "ПДФО (9%)" : "PIT (9%)"}
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {calculations.pdfoFromDividends.toFixed(2)} ₴
                    </p>
                  </div>
                  <div className="space-y-1 bg-background p-3 rounded-md border border-border">
                    <p className="text-xs text-muted-foreground">
                      {language === "uk" ? `Військовий збір (${militaryTaxRateDisplay}%)` : `Military Levy (${militaryTaxRateDisplay}%)`}
                    </p>
                    <p className="text-lg font-bold text-orange-600">
                      {calculations.militaryTaxFromDividends.toFixed(2)} ₴
                    </p>
                  </div>
                </div>
                <div className="pl-4 pt-2">
                  <div className="flex items-center gap-2 p-2 bg-purple-100 dark:bg-purple-950/30 rounded-md">
                    <span className="text-lg">💡</span>
                    <p className="text-xs text-purple-900 dark:text-purple-100">
                      {language === "uk"
                        ? "Для дивідендів застосовується знижена ставка ПДФО 9% замість стандартних 18%"
                        : "For dividends, a reduced PIT rate of 9% is applied instead of the standard 18%"
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4 pt-6">
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 ${isMobile ? 'w-full' : ''}`}>
          <Button
            type="submit"
            size={isMobile ? "default" : "lg"}
            className={`bg-accent hover:bg-accent/90 gap-2 ${isMobile ? 'w-full' : ''}`}
          >
            <FileText className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            <span className={isMobile ? 'text-sm' : ''}>{getLabel("save")}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size={isMobile ? "default" : "lg"}
            onClick={handleExportExcel}
            className={`gap-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 ${isMobile ? 'w-full' : ''}`}
          >
            <FileSpreadsheet className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            <span className={isMobile ? 'text-sm' : ''}>{getLabel("checkCalculations")}</span>
          </Button>
          <Button
            type="reset"
            variant="outline"
            size={isMobile ? "default" : "lg"}
            onClick={handleClear}
            className={isMobile ? 'w-full' : ''}
          >
            <span className={isMobile ? 'text-sm' : ''}>{getLabel("clear")}</span>
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {getLabel("disclaimer")}
          </p>
        </div>
      </div>
    </form>
  )
}
