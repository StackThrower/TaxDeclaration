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
import { FileText, Plus, Trash2 } from "lucide-react"
import { generatePIT39PDF } from "@/lib/pdf-generator"

interface PropertySale {
  id: string
  type: string
  description: string
  purchaseDate: string
  saleDate: string
  purchasePrice: string
  salePrice: string
  improvements: string
  saleCosts: string
}

export function FormPIT39() {
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
    additionalInfo: "",
  })

  const [propertySales, setPropertySales] = useState<PropertySale[]>([
    {
      id: "1",
      type: "property",
      description: "",
      purchaseDate: "",
      saleDate: "",
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
  }

  const addPropertySale = () => {
    const newId = String(Date.now())
    setPropertySales((prev) => [
      ...prev,
      {
        id: newId,
        type: "property",
        description: "",
        purchaseDate: "",
        saleDate: "",
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
        purchaseDate: "",
        saleDate: "",
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

      {/* Sprzedaż majątku */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary">{translations.propertySales}</h3>
          <Button type="button" variant="outline" size="sm" onClick={addPropertySale} className="gap-2">
            <Plus className="w-4 h-4" />
            {translations.addSale}
          </Button>
        </div>

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
                <div className="space-y-2">
                  <Label>{translations.purchasePrice}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={sale.purchasePrice}
                    onChange={(e) => handlePropertyChange(sale.id, "purchasePrice", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{translations.salePrice}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={sale.salePrice}
                    onChange={(e) => handlePropertyChange(sale.id, "salePrice", e.target.value)}
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
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={handleClear}>
          {translations.clear}
        </Button>
        <Button type="submit" className="gap-2">
          <FileText className="w-4 h-4" />
          {translations.generate}
        </Button>
      </div>
    </form>
  )
}

