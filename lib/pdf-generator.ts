import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { setupUkrainianFonts } from "./fonts/font-setup"

// Type for autoTable options
type AutoTableOptions = {
  startY?: number
  head?: any[]
  body?: any[]
  theme?: "plain" | "striped" | "grid"
  styles?: any
  columnStyles?: any
  [key: string]: any
}


// Helper function to ensure text compatibility
const sanitizeText = (text: string): string => {
  return text || ""
}

export interface F0100214Data {
  fullName: string
  taxNumber: string
  passportNumber: string
  residence: string
  year: string
  realEstate: string
  vehicles: string
  otherProperty: string
  totalIncome: string
  expenses: string
  additionalInfo: string
}

export interface F0121214Position {
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
}

export interface F0121214Data {
  fullName: string
  taxNumber: string
  year: string
  notes: string
  positions: F0121214Position[]
  calculations: {
    profit: number
    pdfo: number
    militaryTax: number
    total: number
    profitFromTrades?: number
    dividends?: number
    pdfoFromTrades?: number
    pdfoFromDividends?: number
    militaryTaxFromTrades?: number
    militaryTaxFromDividends?: number
  }
}

export const generateF0100214PDF = async (data: F0100214Data, language: string = "uk") => {
  const doc = new jsPDF()

  // Setup Ukrainian fonts for Cyrillic support
  await setupUkrainianFonts(doc)

  const labels = {
    uk: {
      title: "Податкова декларація Ф0100214",
      subtitle: "Декларація про майновий стан і доходи",
      personalData: "Персональні дані",
      fullName: "Прізвище та ім'я:",
      taxNumber: "ІПН:",
      passport: "Номер паспорта:",
      residence: "Місце проживання:",
      year: "Рік звіту:",
      propertyInfo: "Інформація про майно",
      realEstate: "Нерухоме майно:",
      vehicles: "Транспортні засоби:",
      otherProperty: "Інше майно:",
      financialInfo: "Фінансова інформація",
      totalIncome: "Загальний дохід (грн):",
      expenses: "Витрати (грн):",
      additionalInfo: "Додаткова інформація:",
      generatedDate: "Дата формування:",
    },
    en: {
      title: "Tax Declaration F0100214",
      subtitle: "Declaration of property status and income",
      personalData: "Personal Data",
      fullName: "Full Name:",
      taxNumber: "Tax ID:",
      passport: "Passport Number:",
      residence: "Place of Residence:",
      year: "Reporting Year:",
      propertyInfo: "Property Information",
      realEstate: "Real Estate:",
      vehicles: "Vehicles:",
      otherProperty: "Other Property:",
      financialInfo: "Financial Information",
      totalIncome: "Total Income (UAH):",
      expenses: "Expenses (UAH):",
      additionalInfo: "Additional Information:",
      generatedDate: "Generated Date:",
    },
  }

  const t = labels[language as keyof typeof labels] || labels.en

  // Header
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(18)
  doc.setTextColor(40, 40, 40)
  doc.text(t.title, 105, 20, { align: "center" })

  doc.setFont("DejaVuSans", "normal")
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(t.subtitle, 105, 28, { align: "center" })

  let yPos = 45

  // Personal Data Section
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.personalData, 15, yPos)
  yPos += 10

  doc.setFont("DejaVuSans", "normal")
  doc.setFontSize(11)
  doc.setTextColor(40, 40, 40)
  const personalData = [
    [t.fullName, data.fullName || "-"],
    [t.taxNumber, data.taxNumber || "-"],
    [t.passport, data.passportNumber || "-"],
    [t.residence, data.residence || "-"],
    [t.year, data.year || "-"],
  ]

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: personalData,
    theme: "plain",
    styles: {
      font: "DejaVuSans",
      fontStyle: "normal",
      fontSize: 10,
      cellPadding: 3
    },
    columnStyles: {
      0: { font: "DejaVuSans", fontStyle: "bold", cellWidth: 60 },
      1: { font: "DejaVuSans", cellWidth: 120 },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Property Information Section
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.propertyInfo, 15, yPos)
  yPos += 10

  doc.setFont("DejaVuSans", "normal")
  doc.setFontSize(11)
  doc.setTextColor(40, 40, 40)
  const propertyData = [
    [t.realEstate, data.realEstate || "-"],
    [t.vehicles, data.vehicles || "-"],
    [t.otherProperty, data.otherProperty || "-"],
  ]

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: propertyData,
    theme: "plain",
    styles: {
      font: "DejaVuSans",
      fontStyle: "normal",
      fontSize: 10,
      cellPadding: 3
    },
    columnStyles: {
      0: { font: "DejaVuSans", fontStyle: "bold", cellWidth: 60 },
      1: { font: "DejaVuSans", cellWidth: 120 },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Financial Information Section
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.financialInfo, 15, yPos)
  yPos += 10

  doc.setFont("DejaVuSans", "normal")
  doc.setFontSize(11)
  doc.setTextColor(40, 40, 40)
  const financialData = [
    [t.totalIncome, data.totalIncome ? `${data.totalIncome} UAH` : "-"],
    [t.expenses, data.expenses ? `${data.expenses} UAH` : "-"],
  ]

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: financialData,
    theme: "plain",
    styles: {
      font: "DejaVuSans",
      fontStyle: "normal",
      fontSize: 10,
      cellPadding: 3
    },
    columnStyles: {
      0: { font: "DejaVuSans", fontStyle: "bold", cellWidth: 60 },
      1: { font: "DejaVuSans", cellWidth: 120 },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Additional Information
  if (data.additionalInfo) {
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(14)
    doc.setTextColor(0, 102, 204)
    doc.text(t.additionalInfo, 15, yPos)
    yPos += 8

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(10)
    doc.setTextColor(40, 40, 40)
    const splitText = doc.splitTextToSize(data.additionalInfo, 180)
    doc.text(splitText, 15, yPos)
    yPos += splitText.length * 5 + 10
  }

  // Footer
  doc.setFont("DejaVuSans", "normal")
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  doc.text(`${t.generatedDate} ${new Date().toLocaleDateString()}`, 15, 280)

  // Open in new window
  window.open(doc.output("bloburl"), "_blank")
}

export const generateF0121214PDF = async (data: F0121214Data, language: string = "uk") => {
  const doc = new jsPDF()

  // Setup Ukrainian fonts for Cyrillic support
  await setupUkrainianFonts(doc)

  const labels = {
    uk: {
      title: "Податкова декларація Ф0121214 (Ф1)",
      subtitle: "Декларація про інвестиційні активи",
      personalData: "Персональні дані",
      fullName: "Прізвище та ім'я:",
      taxNumber: "ІПН:",
      year: "Рік звіту:",
      positions: "Фінансові позиції",
      position: "Позиція",
      assetType: "Тип активу:",
      currency: "Валюта:",
      purchaseDate: "Дата придбання:",
      saleDate: "Дата продажу:",
      purchasePriceForeign: "Сума купівлі (валюта):",
      salePriceForeign: "Сума продажу (валюта):",
      purchaseRate: "Курс НБУ купівлі:",
      saleRate: "Курс НБУ продажу:",
      purchasePrice: "Вартість придбання:",
      salePrice: "Вартість продажу:",
      expenses: "Витрати:",
      positionProfit: "Прибуток позиції:",
      taxSummary: "Підсумок податкових зобов'язань",
      totalProfit: "Загальний прибуток:",
      pdfo: "ПДФО (18%):",
      militaryTax: "Військовий збір (5%):",
      totalTax: "Всього до сплати:",
      notes: "Примітки:",
      generatedDate: "Дата формування:",
      assetTypes: {
        stocks: "Акції",
        bonds: "Облігації",
        options: "Опціони",
        dividends: "Дивіденди",
        crypto: "Крипто активи",
        real_estate: "Нерухоме майно",
        other: "Інше",
      },
      taxRates: {
        trades: "Трейди (18% ПДФО + 5% ВЗ)",
        dividends: "Дивіденди (9% ПДФО + 5% ВЗ)",
      },
    },
    en: {
      title: "Tax Declaration F0121214 (F1)",
      subtitle: "Declaration of investment assets",
      personalData: "Personal Data",
      fullName: "Full Name:",
      taxNumber: "Tax ID:",
      year: "Reporting Year:",
      positions: "Financial Positions",
      position: "Position",
      assetType: "Asset Type:",
      currency: "Currency:",
      purchaseDate: "Purchase Date:",
      saleDate: "Sale Date:",
      purchasePriceForeign: "Purchase amount (foreign):",
      salePriceForeign: "Sale amount (foreign):",
      purchaseRate: "NBU purchase rate:",
      saleRate: "NBU sale rate:",
      purchasePrice: "Purchase Price:",
      salePrice: "Sale Price:",
      expenses: "Expenses:",
      positionProfit: "Position Profit:",
      taxSummary: "Tax Obligations Summary",
      totalProfit: "Total Profit:",
      pdfo: "Personal Income Tax (18%):",
      militaryTax: "Military Levy (5%):",
      totalTax: "Total Due:",
      notes: "Notes:",
      generatedDate: "Generated Date:",
      assetTypes: {
        stocks: "Stocks",
        bonds: "Bonds",
        options: "Options",
        dividends: "Dividends",
        crypto: "Crypto Assets",
        real_estate: "Real Estate",
        other: "Other",
      },
      taxRates: {
        trades: "Trades (18% PIT + 5% ML)",
        dividends: "Dividends (9% PIT + 5% ML)",
      },
    },
  }

  const t = labels[language as keyof typeof labels] || labels.en

  // Header
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(18)
  doc.setTextColor(40, 40, 40)
  doc.text(t.title, 105, 20, { align: "center" })

  doc.setFont("DejaVuSans", "normal")
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(t.subtitle, 105, 28, { align: "center" })

  let yPos = 45

  // Personal Data Section
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.personalData, 15, yPos)
  yPos += 10

  doc.setFont("DejaVuSans", "normal")
  doc.setFontSize(11)
  doc.setTextColor(40, 40, 40)
  const personalData = [
    [t.fullName, data.fullName || "-"],
    [t.taxNumber, data.taxNumber || "-"],
    [t.year, data.year || "-"],
  ]

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: personalData,
    theme: "plain",
    styles: {
      font: "DejaVuSans",
      fontStyle: "normal",
      fontSize: 10,
      cellPadding: 3
    },
    columnStyles: {
      0: { font: "DejaVuSans", fontStyle: "bold", cellWidth: 50 },
      1: { font: "DejaVuSans", cellWidth: 130 },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Positions Section
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.positions, 15, yPos)
  yPos += 10

  data.positions.forEach((position, index) => {
    const purchasePrice = parseFloat(position.purchasePrice) || 0
    const salePrice = parseFloat(position.salePrice) || 0
    const expenses = parseFloat(position.expenses) || 0

    // For dividends, profit is just the received amount (no purchase cost)
    const profit = position.assetType === "dividends"
      ? salePrice
      : Math.max(0, salePrice - purchasePrice - expenses)

    const assetTypeLabel =
      t.assetTypes[position.assetType as keyof typeof t.assetTypes] || position.assetType || "-"

    const currency = position.currency || "UAH"
    const purchasePriceForeign = parseFloat(position.purchasePriceForeign) || 0
    const salePriceForeign = parseFloat(position.salePriceForeign) || 0
    const purchaseRate = parseFloat(position.purchaseRate) || 0
    const saleRate = parseFloat(position.saleRate) || 0

    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(12)
    doc.setTextColor(60, 60, 60)
    doc.text(`${t.position} #${index + 1}`, 15, yPos)
    yPos += 8

    const positionData = [
      [t.assetType, assetTypeLabel],
      [t.currency, currency],
    ]

    // For non-dividends, show purchase and sale dates
    if (position.assetType !== "dividends") {
      positionData.push(
        [t.purchaseDate, position.purchaseDate || "-"],
        [t.saleDate, position.saleDate || "-"]
      )
    } else {
      // For dividends, only show payment date
      positionData.push(
        [t.saleDate, position.saleDate || "-"]
      )
    }

    // Add foreign currency amounts if not UAH
    if (currency !== "UAH") {
      if (position.assetType !== "dividends" && purchasePriceForeign > 0) {
        positionData.push(
          [t.purchasePriceForeign, `${purchasePriceForeign.toFixed(2)} ${currency}`],
          [t.purchaseRate, purchaseRate > 0 ? `${purchaseRate.toFixed(4)}` : "-"]
        )
      }
      if (salePriceForeign > 0) {
        positionData.push(
          [position.assetType === "dividends" ? "Дивіденди (валюта):" : t.salePriceForeign, `${salePriceForeign.toFixed(2)} ${currency}`],
          [position.assetType === "dividends" ? "Курс НБУ:" : t.saleRate, saleRate > 0 ? `${saleRate.toFixed(4)}` : "-"]
        )
      }
    }

    // Add UAH amounts
    if (position.assetType !== "dividends" && purchasePrice > 0) {
      positionData.push([t.purchasePrice, `${purchasePrice.toFixed(2)} UAH`])
    }
    positionData.push(
      [position.assetType === "dividends" ? "Дивіденди (UAH):" : t.salePrice, `${salePrice.toFixed(2)} UAH`]
    )
    if (position.assetType !== "dividends" && expenses > 0) {
      positionData.push([t.expenses, `${expenses.toFixed(2)} UAH`])
    }
    positionData.push(
      [position.assetType === "dividends" ? "Оподатковувана сума:" : t.positionProfit, `${profit.toFixed(2)} UAH`]
    )

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: positionData,
      theme: "striped",
      styles: {
        font: "DejaVuSans",
        fontStyle: "normal",
        fontSize: 9,
        cellPadding: 2
      },
      columnStyles: {
        0: { font: "DejaVuSans", fontStyle: "bold", cellWidth: 50 },
        1: { font: "DejaVuSans", cellWidth: 130 },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10

    // Add new page if needed
    if (yPos > 250 && index < data.positions.length - 1) {
      doc.addPage()
      yPos = 20
    }
  })

  // Tax Summary Section
  if (yPos > 220) {
    doc.addPage()
    yPos = 20
  }

  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.taxSummary, 15, yPos)
  yPos += 10

  const taxData = []

  // Add trades breakdown if exists
  if (data.calculations.profitFromTrades !== undefined && data.calculations.profitFromTrades !== 0) {
    taxData.push(
      [`${language === "uk" ? "Прибуток від трейдів:" : "Profit from trades:"}`, `${(data.calculations.profitFromTrades || 0).toFixed(2)} UAH`],
      [`${language === "uk" ? "  - ПДФО (18%):" : "  - PIT (18%):"}`, `${(data.calculations.pdfoFromTrades || 0).toFixed(2)} UAH`],
      [`${language === "uk" ? "  - Військовий збір (5%):" : "  - Military levy (5%):"}`, `${(data.calculations.militaryTaxFromTrades || 0).toFixed(2)} UAH`]
    )
  }

  // Add dividends breakdown if exists
  if (data.calculations.dividends !== undefined && data.calculations.dividends > 0) {
    taxData.push(
      [`${language === "uk" ? "Дивіденди отримано:" : "Dividends received:"}`, `${(data.calculations.dividends || 0).toFixed(2)} UAH`],
      [`${language === "uk" ? "  - ПДФО (9%):" : "  - PIT (9%):"}`, `${(data.calculations.pdfoFromDividends || 0).toFixed(2)} UAH`],
      [`${language === "uk" ? "  - Військовий збір (5%):" : "  - Military levy (5%):"}`, `${(data.calculations.militaryTaxFromDividends || 0).toFixed(2)} UAH`]
    )
  }

  // Add totals
  taxData.push(
    ["", ""],
    [t.totalProfit, `${data.calculations.profit.toFixed(2)} UAH`],
    [t.pdfo, `${data.calculations.pdfo.toFixed(2)} UAH`],
    [t.militaryTax, `${data.calculations.militaryTax.toFixed(2)} UAH`]
  )

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: taxData,
    theme: "plain",
    styles: {
      font: "DejaVuSans",
      fontStyle: "normal",
      fontSize: 10,
      cellPadding: 3
    },
    columnStyles: {
      0: { font: "DejaVuSans", fontStyle: "bold", cellWidth: 70 },
      1: { font: "DejaVuSans", cellWidth: 110, halign: "right" },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 5

  // Total Tax (highlighted)
  autoTable(doc, {
    startY: yPos,
    head: [],
    body: [[t.totalTax, `${data.calculations.total.toFixed(2)} UAH`]],
    theme: "grid",
    styles: {
      font: "DejaVuSans",
      fontSize: 11,
      cellPadding: 4,
      fontStyle: "bold",
      fillColor: [240, 240, 255]
    },
    columnStyles: {
      0: { font: "DejaVuSans", cellWidth: 70 },
      1: { font: "DejaVuSans", cellWidth: 110, halign: "right" },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Notes
  if (data.notes) {
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(12)
    doc.setTextColor(0, 102, 204)
    doc.text(t.notes, 15, yPos)
    yPos += 8

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(10)
    doc.setTextColor(40, 40, 40)
    const splitText = doc.splitTextToSize(data.notes, 180)
    doc.text(splitText, 15, yPos)
  }

  // Footer
  doc.setFont("DejaVuSans", "normal")
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.text(
      `${t.generatedDate} ${new Date().toLocaleDateString()} | Сторінка ${i} з ${pageCount}`,
      105,
      285,
      { align: "center" }
    )
  }

  // Open in new window
  window.open(doc.output("bloburl"), "_blank")
}

