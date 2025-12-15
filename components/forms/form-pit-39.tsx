"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useI18n } from "@/lib/i18n-context"
import { FileText, Plus, Trash2, Upload } from "lucide-react"
import { generatePIT39PDF } from "@/lib/pdf-generator"
import {
  fetchNBPExchangeRate,
  convertToPLN,
  SUPPORTED_CURRENCIES_PLN,
  formatExchangeRatePLN,
  getCurrencySymbolPLN
} from "@/lib/nbp-exchange-rates"
import {
  parseIBXML,
  readFileAsText
} from "@/lib/ib-xml-parser"

interface PropertySale {
  id: string
  type: string
  description: string
  currency: string
  purchaseDate: string
  saleDate: string
  purchasePriceForeign: string
  salePriceForeign: string
  purchaseRate: string
  saleRate: string
  purchasePrice: string
  salePrice: string
  improvements: string
  saleCosts: string
}

export function FormPIT39() {
  const { language } = useI18n()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState("")
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
    additionalInfo: "",
  })

  const [propertySales, setPropertySales] = useState<PropertySale[]>([
    {
      id: "1",
      type: "property",
      description: "",
      currency: "PLN",
      purchaseDate: "",
      saleDate: "",
      purchasePriceForeign: "",
      salePriceForeign: "",
      purchaseRate: "1",
      saleRate: "1",
      purchasePrice: "",
      salePrice: "",
      improvements: "",
      saleCosts: "",
    },
  ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelect = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePropertyChange = (id: string, field: keyof PropertySale, value: string) => {
    setPropertySales((prev) =>
      prev.map((sale) => (sale.id === id ? { ...sale, [field]: value } : sale))
    )

    // Fetch exchange rates when currency or dates change
    if (field === "currency" || field === "purchaseDate" || field === "saleDate") {
      const sale = propertySales.find(s => s.id === id)
      if (!sale) return

      const currency = field === "currency" ? value : sale.currency

      if (currency !== "PLN") {
        // Fetch purchase rate
        if ((field === "currency" || field === "purchaseDate") && (field === "purchaseDate" ? value : sale.purchaseDate)) {
          const purchaseDate = field === "purchaseDate" ? value : sale.purchaseDate
          fetchNBPExchangeRate(purchaseDate, currency).then(rate => {
            if (rate !== null) {
              setPropertySales(prev => prev.map(s => {
                if (s.id === id) {
                  const updatedSale = { ...s, purchaseRate: rate.toFixed(4) }
                  // Auto-convert if foreign amount exists
                  if (s.purchasePriceForeign) {
                    const foreignAmount = parseFloat(s.purchasePriceForeign)
                    updatedSale.purchasePrice = convertToPLN(foreignAmount, rate).toFixed(2)
                  }
                  return updatedSale
                }
                return s
              }))
            }
          })
        }

        // Fetch sale rate
        if ((field === "currency" || field === "saleDate") && (field === "saleDate" ? value : sale.saleDate)) {
          const saleDate = field === "saleDate" ? value : sale.saleDate
          fetchNBPExchangeRate(saleDate, currency).then(rate => {
            if (rate !== null) {
              setPropertySales(prev => prev.map(s => {
                if (s.id === id) {
                  const updatedSale = { ...s, saleRate: rate.toFixed(4) }
                  // Auto-convert if foreign amount exists
                  if (s.salePriceForeign) {
                    const foreignAmount = parseFloat(s.salePriceForeign)
                    updatedSale.salePrice = convertToPLN(foreignAmount, rate).toFixed(2)
                  }
                  return updatedSale
                }
                return s
              }))
            }
          })
        }
      } else {
        // Reset rates to 1 for PLN
        setPropertySales(prev => prev.map(s => {
          if (s.id === id) {
            return {
              ...s,
              purchaseRate: "1",
              saleRate: "1",
              purchasePrice: s.purchasePriceForeign || s.purchasePrice,
              salePrice: s.salePriceForeign || s.salePrice
            }
          }
          return s
        }))
      }
    }

    // Auto-convert when foreign amounts change
    if (field === "purchasePriceForeign") {
      const sale = propertySales.find(s => s.id === id)
      if (sale && sale.currency !== "PLN") {
        const foreignAmount = parseFloat(value) || 0
        const rate = parseFloat(sale.purchaseRate) || 1
        const plnAmount = convertToPLN(foreignAmount, rate).toFixed(2)
        setPropertySales(prev => prev.map(s =>
          s.id === id ? { ...s, purchasePrice: plnAmount } : s
        ))
      }
    }

    if (field === "salePriceForeign") {
      const sale = propertySales.find(s => s.id === id)
      if (sale && sale.currency !== "PLN") {
        const foreignAmount = parseFloat(value) || 0
        const rate = parseFloat(sale.saleRate) || 1
        const plnAmount = convertToPLN(foreignAmount, rate).toFixed(2)
        setPropertySales(prev => prev.map(s =>
          s.id === id ? { ...s, salePrice: plnAmount } : s
        ))
      }
    }
  }

  const addPropertySale = () => {
    const newId = String(Date.now())
    setPropertySales((prev) => [
      ...prev,
      {
        id: newId,
        type: "property",
        description: "",
        currency: "PLN",
        purchaseDate: "",
        saleDate: "",
        purchasePriceForeign: "",
        salePriceForeign: "",
        purchaseRate: "1",
        saleRate: "1",
        purchasePrice: "",
        salePrice: "",
        improvements: "",
        saleCosts: "",
      },
    ])
  }

  const removePropertySale = (id: string) => {
    setPropertySales((prev) => prev.filter((sale) => sale.id !== id))
  }

  const handleImportXML = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportProgress(0)
    setImportStatus(language === "uk" ? "Читання файлу..." : language === "pl" ? "Odczytywanie pliku..." : "Reading file...")

    try {
      // Read file content
      setImportProgress(10)
      const xmlContent = await readFileAsText(file)

      // Parse XML
      setImportProgress(20)
      setImportStatus(language === "uk" ? "Парсинг XML..." : language === "pl" ? "Parsowanie XML..." : "Parsing XML...")
      const parsedData = parseIBXML(xmlContent)

      if (parsedData.trades.length === 0) {
        alert(language === "uk"
          ? "У файлі не знайдено закритих позицій для імпорту"
          : language === "pl"
            ? "Nie znaleziono zamkniętych pozycji w pliku"
            : "No closed positions found in the file")
        setIsImporting(false)
        return
      }

      // Convert trades to property sales
      setImportProgress(30)
      setImportStatus(language === "uk" ? "Конвертація позицій..." : language === "pl" ? "Konwersja pozycji..." : "Converting positions...")

      const newSales: PropertySale[] = parsedData.trades.map(trade => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: trade.assetCategory === "STK" ? "stocks" : "other",
        description: `${trade.symbol} - ${trade.description}`,
        currency: trade.currency,
        purchaseDate: trade.openDateTime,
        saleDate: trade.tradeDate,
        purchasePriceForeign: Math.abs(trade.cost).toFixed(2),
        salePriceForeign: (Math.abs(trade.cost) + trade.fifoPnlRealized).toFixed(2),
        purchaseRate: "1",
        saleRate: "1",
        purchasePrice: "",
        salePrice: "",
        improvements: "0",
        saleCosts: "0",
      }))

      // Replace existing sales with imported ones
      setPropertySales(newSales)

      setImportProgress(40)
      setImportStatus(language === "uk"
        ? `Імпортовано ${newSales.length} позиції(й). Завантаження курсів NBP...`
        : language === "pl"
          ? `Zaimportowano ${newSales.length} pozycji. Pobieranie kursów NBP...`
          : `Imported ${newSales.length} position(s). Fetching NBP rates...`)

      // Fetch rates for each sale and update state progressively
      const updatedSales = [...newSales]
      const totalSales = updatedSales.length
      const progressPerSale = 60 / totalSales // Remaining 60% for rate fetching

      for (let i = 0; i < updatedSales.length; i++) {
        const sale = updatedSales[i]
        const currentProgress = 40 + ((i + 1) * progressPerSale)

        setImportProgress(currentProgress)
        setImportStatus(language === "uk"
          ? `Завантаження курсів NBP... (${i + 1}/${totalSales})`
          : language === "pl"
            ? `Pobieranie kursów NBP... (${i + 1}/${totalSales})`
            : `Fetching NBP rates... (${i + 1}/${totalSales})`)

        if (sale.currency !== "PLN") {
          try {
            // Fetch purchase rate
            if (sale.purchaseDate) {
              const purchaseRate = await fetchNBPExchangeRate(sale.purchaseDate, sale.currency)
              if (purchaseRate !== null) {
                const foreignPurchaseAmount = parseFloat(sale.purchasePriceForeign) || 0
                const plnPurchaseAmount = convertToPLN(foreignPurchaseAmount, purchaseRate)

                updatedSales[i] = {
                  ...sale,
                  purchaseRate: purchaseRate.toFixed(4),
                  purchasePrice: plnPurchaseAmount.toFixed(2)
                }
              }
            }

            // Fetch sale rate
            if (sale.saleDate) {
              const saleRate = await fetchNBPExchangeRate(sale.saleDate, sale.currency)
              if (saleRate !== null) {
                const foreignSaleAmount = parseFloat(sale.salePriceForeign) || 0
                const plnSaleAmount = convertToPLN(foreignSaleAmount, saleRate)

                updatedSales[i] = {
                  ...updatedSales[i],
                  saleRate: saleRate.toFixed(4),
                  salePrice: plnSaleAmount.toFixed(2)
                }
              }
            }

            // Update state after each sale is processed
            setPropertySales([...updatedSales])
          } catch (error) {
            console.error(`Error fetching rates for sale ${i}:`, error)
          }
        } else {
          // For PLN, just copy the foreign amounts
          updatedSales[i] = {
            ...sale,
            purchasePrice: sale.purchasePriceForeign,
            salePrice: sale.salePriceForeign
          }
          setPropertySales([...updatedSales])
        }
      }

      setImportProgress(100)
      setImportStatus(language === "uk"
        ? `Імпорт завершено! Імпортовано ${newSales.length} позиції(й)`
        : language === "pl"
          ? `Import zakończony! Zaimportowano ${newSales.length} pozycji`
          : `Import completed! Imported ${newSales.length} position(s)`)

      setTimeout(() => {
        setIsImporting(false)
        setImportProgress(0)
        setImportStatus("")
      }, 2000)
    } catch (error) {
      console.error("Error importing XML:", error)
      alert(language === "uk"
        ? `Помилка імпорту: ${error instanceof Error ? error.message : "Невідома помилка"}`
        : language === "pl"
          ? `Błąd importu: ${error instanceof Error ? error.message : "Nieznany błąd"}`
          : `Import error: ${error instanceof Error ? error.message : "Unknown error"}`)
      setIsImporting(false)
      setImportProgress(0)
      setImportStatus("")
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await generatePIT39PDF({ ...formData, propertySales }, language)
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
      additionalInfo: "",
    })
    setPropertySales([
      {
        id: "1",
        type: "property",
        description: "",
        currency: "PLN",
        purchaseDate: "",
        saleDate: "",
        purchasePriceForeign: "",
        salePriceForeign: "",
        purchaseRate: "1",
        saleRate: "1",
        purchasePrice: "",
        salePrice: "",
        improvements: "",
        saleCosts: "",
      },
    ])
  }

  const t = {
    uk: {
      title: "PIT-39",
      subtitle: "Декларація про доходи від відчуження майна",
      personalData: "Особисті дані",
      firstName: "Ім'я",
      lastName: "Прізвище",
      pesel: "PESEL",
      nip: "NIP",
      address: "Адреса",
      city: "Місто",
      postalCode: "Поштовий індекс",
      year: "Звітний рік",
      propertySales: "Продаж майна",
      type: "Тип майна",
      typeProperty: "Нерухомість",
      typeStocks: "Акції",
      typeOther: "Інше",
      description: "Опис",
      purchaseDate: "Дата придбання",
      saleDate: "Дата продажу",
      purchasePrice: "Ціна придбання (PLN)",
      salePrice: "Ціна продажу (PLN)",
      improvements: "Витрати на поліпшення (PLN)",
      saleCosts: "Витрати на продаж (PLN)",
      addSale: "Додати продаж",
      remove: "Видалити",
      additionalInfo: "Додаткова інформація",
      generate: "Сформувати PDF",
      clear: "Очистити",
      importXML: "Імпорт з Interactive Brokers",
      importButton: "Завантажити XML",
      importing: "Імпорт...",
      currency: "Валюта",
      purchasePriceForeign: "Ціна придбання (валюта)",
      salePriceForeign: "Ціна продажу (валюта)",
      purchaseRate: "Курс NBP (придбання)",
      saleRate: "Курс NBP (продаж)",
    },
    en: {
      title: "PIT-39",
      subtitle: "Tax Return for Income from Property Disposal",
      personalData: "Personal Data",
      firstName: "First Name",
      lastName: "Last Name",
      pesel: "PESEL",
      nip: "NIP",
      address: "Address",
      city: "City",
      postalCode: "Postal Code",
      year: "Tax Year",
      propertySales: "Property Sales",
      type: "Property Type",
      typeProperty: "Real Estate",
      typeStocks: "Stocks",
      typeOther: "Other",
      description: "Description",
      purchaseDate: "Purchase Date",
      saleDate: "Sale Date",
      purchasePrice: "Purchase Price (PLN)",
      salePrice: "Sale Price (PLN)",
      improvements: "Improvement Costs (PLN)",
      saleCosts: "Sale Costs (PLN)",
      addSale: "Add Sale",
      remove: "Remove",
      additionalInfo: "Additional Information",
      generate: "Generate PDF",
      clear: "Clear",
      importXML: "Import from Interactive Brokers",
      importButton: "Upload XML",
      importing: "Importing...",
      currency: "Currency",
      purchasePriceForeign: "Purchase Price (currency)",
      salePriceForeign: "Sale Price (currency)",
      purchaseRate: "NBP Rate (purchase)",
      saleRate: "NBP Rate (sale)",
    },
    pl: {
      title: "PIT-39",
      subtitle: "Zeznanie o dochodach z odpłatnego zbycia",
      personalData: "Dane osobowe",
      firstName: "Imię",
      lastName: "Nazwisko",
      pesel: "PESEL",
      nip: "NIP",
      address: "Adres",
      city: "Miejscowość",
      postalCode: "Kod pocztowy",
      year: "Rok podatkowy",
      propertySales: "Sprzedaż majątku",
      type: "Rodzaj majątku",
      typeProperty: "Nieruchomość",
      typeStocks: "Akcje",
      typeOther: "Inne",
      description: "Opis",
      purchaseDate: "Data nabycia",
      saleDate: "Data sprzedaży",
      purchasePrice: "Cena nabycia (PLN)",
      salePrice: "Cena sprzedaży (PLN)",
      improvements: "Wydatki na ulepszenie (PLN)",
      saleCosts: "Koszty sprzedaży (PLN)",
      addSale: "Dodaj sprzedaż",
      remove: "Usuń",
      additionalInfo: "Informacje dodatkowe",
      generate: "Generuj PDF",
      clear: "Wyczyść",
      importXML: "Import z Interactive Brokers",
      importButton: "Wczytaj XML",
      importing: "Importowanie...",
      currency: "Waluta",
      purchasePriceForeign: "Cena nabycia (waluta)",
      salePriceForeign: "Cena sprzedaży (waluta)",
      purchaseRate: "Kurs NBP (nabycie)",
      saleRate: "Kurs NBP (sprzedaż)",
    },
    fr: {
      title: "PIT-39",
      subtitle: "Déclaration de revenus de cession de biens",
      personalData: "Données personnelles",
      firstName: "Prénom",
      lastName: "Nom",
      pesel: "PESEL",
      nip: "NIP",
      address: "Adresse",
      city: "Ville",
      postalCode: "Code postal",
      year: "Année fiscale",
      propertySales: "Ventes de biens",
      type: "Type de bien",
      typeProperty: "Immobilier",
      typeStocks: "Actions",
      typeOther: "Autre",
      description: "Description",
      purchaseDate: "Date d'achat",
      saleDate: "Date de vente",
      purchasePrice: "Prix d'achat (PLN)",
      salePrice: "Prix de vente (PLN)",
      improvements: "Frais d'amélioration (PLN)",
      saleCosts: "Frais de vente (PLN)",
      addSale: "Ajouter une vente",
      remove: "Supprimer",
      additionalInfo: "Informations complémentaires",
      generate: "Générer PDF",
      clear: "Effacer",
      importXML: "Importer depuis Interactive Brokers",
      importButton: "Charger XML",
      importing: "Importation...",
      currency: "Devise",
      purchasePriceForeign: "Prix d'achat (devise)",
      salePriceForeign: "Prix de vente (devise)",
      purchaseRate: "Taux NBP (achat)",
      saleRate: "Taux NBP (vente)",
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
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="gap-2"
          >
            <Upload className="h-5 w-5" />
            {isImporting ? translations.importing : translations.importButton}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={addPropertySale}
            className="gap-2 border-dashed border-2"
          >
            <Plus className="h-5 w-5" />
            {translations.addSale}
          </Button>
        </div>

        {/* Import Info */}
        {!isImporting && (
          <div className="text-center text-sm text-muted-foreground">
            {language === "uk"
              ? "Завантажте XML файл з Interactive Brokers (FlexQuery Report з закритими позиціями)"
              : language === "pl"
                ? "Wczytaj plik XML z Interactive Brokers (FlexQuery Report z zamkniętymi pozycjami)"
                : "Upload XML file from Interactive Brokers (FlexQuery Report with closed positions)"
            }
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
                  : language === "pl"
                    ? "Proszę czekać. To może potrwać kilka sekund..."
                    : "Please wait. This may take a few seconds..."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sprzedaż majątku */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">{translations.propertySales}</h3>

        {propertySales.map((sale, index) => (
          <Card key={sale.id} className="border-border/50">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">
                  {translations.propertySales} #{index + 1}
                </h4>
                {propertySales.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePropertySale(sale.id)}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    {translations.remove}
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{translations.type}</Label>
                  <Select
                    value={sale.type}
                    onValueChange={(value) => handlePropertyChange(sale.id, "type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="property">{translations.typeProperty}</SelectItem>
                      <SelectItem value="stocks">{translations.typeStocks}</SelectItem>
                      <SelectItem value="other">{translations.typeOther}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{translations.currency}</Label>
                  <Select
                    value={sale.currency}
                    onValueChange={(value) => handlePropertyChange(sale.id, "currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_CURRENCIES_PLN.map((curr) => (
                        <SelectItem key={curr.code} value={curr.code}>
                          {curr.code} - {curr.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>{translations.description}</Label>
                  <Input
                    value={sale.description}
                    onChange={(e) => handlePropertyChange(sale.id, "description", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{translations.purchaseDate}</Label>
                  <Input
                    type="date"
                    value={sale.purchaseDate}
                    onChange={(e) => handlePropertyChange(sale.id, "purchaseDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{translations.saleDate}</Label>
                  <Input
                    type="date"
                    value={sale.saleDate}
                    onChange={(e) => handlePropertyChange(sale.id, "saleDate", e.target.value)}
                  />
                </div>
                {sale.currency !== "PLN" && (
                  <>
                    <div className="space-y-2">
                      <Label>{translations.purchasePriceForeign}</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={sale.purchasePriceForeign}
                        onChange={(e) => handlePropertyChange(sale.id, "purchasePriceForeign", e.target.value)}
                        placeholder={`0.00 ${getCurrencySymbolPLN(sale.currency)}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{translations.purchaseRate}</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={sale.purchaseRate}
                        onChange={(e) => handlePropertyChange(sale.id, "purchaseRate", e.target.value)}
                        placeholder="1.0000"
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label>{sale.currency !== "PLN" ? translations.purchasePrice : translations.purchasePrice}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={sale.purchasePrice}
                    onChange={(e) => handlePropertyChange(sale.id, "purchasePrice", e.target.value)}
                    placeholder="0.00 PLN"
                    readOnly={sale.currency !== "PLN"}
                  />
                </div>
                {sale.currency !== "PLN" && (
                  <>
                    <div className="space-y-2">
                      <Label>{translations.salePriceForeign}</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={sale.salePriceForeign}
                        onChange={(e) => handlePropertyChange(sale.id, "salePriceForeign", e.target.value)}
                        placeholder={`0.00 ${getCurrencySymbolPLN(sale.currency)}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{translations.saleRate}</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={sale.saleRate}
                        onChange={(e) => handlePropertyChange(sale.id, "saleRate", e.target.value)}
                        placeholder="1.0000"
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label>{sale.currency !== "PLN" ? translations.salePrice : translations.salePrice}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={sale.salePrice}
                    onChange={(e) => handlePropertyChange(sale.id, "salePrice", e.target.value)}
                    placeholder="0.00 PLN"
                    readOnly={sale.currency !== "PLN"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{translations.improvements}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={sale.improvements}
                    onChange={(e) => handlePropertyChange(sale.id, "improvements", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{translations.saleCosts}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={sale.saleCosts}
                    onChange={(e) => handlePropertyChange(sale.id, "saleCosts", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
      <div className="flex gap-4 pt-6">
        <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 gap-2">
          <FileText className="h-5 w-5" />
          {translations.generate}
        </Button>
        <Button type="reset" variant="outline" size="lg" onClick={handleClear}>
          {translations.clear}
        </Button>
      </div>
    </form>
  )
}

