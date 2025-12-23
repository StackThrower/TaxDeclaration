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
  quantity?: string
  multiplier?: string
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

export const generateF0100214PDF = async (data: F0100214Data, language: string = "uk", createCopy: boolean = true) => {
  const doc = new jsPDF()

  // Setup Ukrainian fonts for Cyrillic support
  await setupUkrainianFonts(doc)

  const labels = {
    uk: {
      title: "ПРИКЛАД ДЛЯ ЗАПОВНЕННЯ ПОДАТКОВОЇ ДЕКЛАРАЦІЇ",
      formNumber: "Ф0100214",
      subtitle: "про майновий стан і доходи",
      officialNote: "Річна податкова декларація про майновий стан і доходи",
      copyLabel: "КОПІЯ",
      originalLabel: "ОРИГІНАЛ",
      personalData: "I. ВІДОМОСТІ ПРО ПЛАТНИКА ПОДАТКУ",
      fullName: "Прізвище, ім'я, по батькові:",
      taxNumber: "Реєстраційний номер облікової картки платника податків (ІПН):",
      passport: "Серія та номер паспорта:",
      residence: "Місце проживання (реєстрації):",
      year: "Звітний (податковий) період (рік):",
      propertyInfo: "II. ВІДОМОСТІ ПРО МАЙНО",
      realEstate: "Нерухоме майно (адреса, площа, м²):",
      vehicles: "Транспортні засоби (марка, модель, рік випуску):",
      otherProperty: "Інше майно (опис):",
      financialInfo: "III. ФІНАНСОВА ІНФОРМАЦІЯ",
      totalIncome: "Загальний дохід за рік (грн):",
      expenses: "Документально підтверджені витрати (грн):",
      netIncome: "Чистий дохід (грн):",
      additionalInfo: "IV. ДОДАТКОВА ІНФОРМАЦІЯ",
      generatedDate: "Дата формування декларації:",
      signature: "Підпис платника податку",
      signatureLine: "_________________",
      date: "Дата",
    },
    en: {
      title: "EXAMPLE FOR FILLING OUT TAX DECLARATION",
      formNumber: "F0100214",
      subtitle: "on property status and income",
      officialNote: "Annual tax declaration on property status and income",
      copyLabel: "COPY",
      originalLabel: "ORIGINAL",
      personalData: "I. INFORMATION ABOUT THE TAXPAYER",
      fullName: "Full name:",
      taxNumber: "Taxpayer identification number (TIN):",
      passport: "Passport series and number:",
      residence: "Place of residence (registration):",
      year: "Reporting (tax) period (year):",
      propertyInfo: "II. PROPERTY INFORMATION",
      realEstate: "Real estate (address, area, m²):",
      vehicles: "Vehicles (brand, model, year):",
      otherProperty: "Other property (description):",
      financialInfo: "III. FINANCIAL INFORMATION",
      totalIncome: "Total annual income (UAH):",
      expenses: "Documented expenses (UAH):",
      netIncome: "Net income (UAH):",
      additionalInfo: "IV. ADDITIONAL INFORMATION",
      generatedDate: "Declaration date:",
      signature: "Taxpayer signature",
      signatureLine: "_________________",
      date: "Date",
    },
  }

  const t = labels[language as keyof typeof labels] || labels.en

  // Calculate net income
  const totalIncome = parseFloat(data.totalIncome) || 0
  const expenses = parseFloat(data.expenses) || 0
  const netIncome = totalIncome - expenses

  // Function to generate document content (original or copy)
  const generateContent = (isCopy: boolean) => {
    // Header - Official format
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text(t.title, 105, 15, { align: "center" })

    doc.setFontSize(13)
    doc.text(t.formNumber, 105, 23, { align: "center" })

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(11)
    doc.text(t.subtitle, 105, 30, { align: "center" })

    // Official note
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    doc.text(t.officialNote, 105, 36, { align: "center" })

    // Original/Copy marker
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(11)
    if (isCopy) {
      doc.setTextColor(200, 0, 0)
      doc.text(t.copyLabel, 180, 25, { align: "right" })
    } else {
      doc.setTextColor(0, 100, 0)
      doc.text(t.originalLabel, 180, 25, { align: "right" })
    }

    let yPos = 48

    // Personal Data Section
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.personalData, 15, yPos)
    yPos += 10

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(10)
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
      theme: "grid",
      styles: {
        font: "DejaVuSans",
        fontStyle: "normal",
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { font: "DejaVuSans", fontStyle: "bold", cellWidth: 80 },
        1: { font: "DejaVuSans", cellWidth: 100 },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 12

    // Property Information Section
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.propertyInfo, 15, yPos)
    yPos += 10

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(10)
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
      theme: "grid",
      styles: {
        font: "DejaVuSans",
        fontStyle: "normal",
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { font: "DejaVuSans", fontStyle: "bold", cellWidth: 80 },
        1: { font: "DejaVuSans", cellWidth: 100 },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 12

    // Financial Information Section
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.financialInfo, 15, yPos)
    yPos += 10

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(10)
    doc.setTextColor(40, 40, 40)
    const financialData = [
      [t.totalIncome, totalIncome > 0 ? `${totalIncome.toFixed(2)} UAH` : "-"],
      [t.expenses, expenses > 0 ? `${expenses.toFixed(2)} UAH` : "-"],
      [t.netIncome, netIncome > 0 ? `${netIncome.toFixed(2)} UAH` : "-"],
    ]

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: financialData,
      theme: "grid",
      styles: {
        font: "DejaVuSans",
        fontStyle: "normal",
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { font: "DejaVuSans", fontStyle: "bold", cellWidth: 80 },
        1: { font: "DejaVuSans", cellWidth: 100 },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 12

    // Additional Information
    if (data.additionalInfo) {
      doc.setFont("DejaVuSans", "bold")
      doc.setFontSize(13)
      doc.setTextColor(0, 0, 0)
      doc.text(t.additionalInfo, 15, yPos)
      yPos += 8

      doc.setFont("DejaVuSans", "normal")
      doc.setFontSize(9)
      doc.setTextColor(40, 40, 40)
      const splitText = doc.splitTextToSize(data.additionalInfo, 180)
      doc.text(splitText, 15, yPos)
      yPos += splitText.length * 4 + 10
    }

    // Signature section
    if (yPos > 240) {
      doc.addPage()
      yPos = 20
    } else {
      yPos += 10
    }

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(9)
    doc.setTextColor(40, 40, 40)
    doc.text(t.signature, 15, yPos)
    doc.text(t.signatureLine, 80, yPos)
    doc.text(t.date, 140, yPos)
    doc.text("_______________", 155, yPos)

    return (doc as any).internal.getNumberOfPages()
  }

  // Generate original
  const originalPages = generateContent(false)

  // Add footer to original pages
  doc.setFont("DejaVuSans", "normal")
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  for (let i = 1; i <= originalPages; i++) {
    doc.setPage(i)
    doc.text(
      `${t.generatedDate} ${new Date().toLocaleDateString()} | Сторінка ${i} з ${originalPages}`,
      105,
      285,
      { align: "center" }
    )
  }

  // Generate copy if requested
  if (createCopy) {
    // Add separator page
    doc.addPage()
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(20)
    doc.setTextColor(100, 100, 100)
    doc.text("--- КОПІЯ / COPY ---", 105, 140, { align: "center" })

    // Generate copy content
    doc.addPage()
    const copyStartPage = originalPages + 2
    const copyEndPage = generateContent(true) + copyStartPage - 1

    // Add footer to copy pages
    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    for (let i = copyStartPage; i <= copyEndPage; i++) {
      doc.setPage(i)
      const pageNum = i - copyStartPage + 1
      const totalCopyPages = copyEndPage - copyStartPage + 1
      doc.text(
        `${t.copyLabel} | ${t.generatedDate} ${new Date().toLocaleDateString()} | Сторінка ${pageNum} з ${totalCopyPages}`,
        105,
        285,
        { align: "center" }
      )
    }
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `F0100214_${data.taxNumber || 'NN'}_${data.year}_${timestamp}.pdf`

  // Save and open
  doc.save(filename)
  window.open(doc.output("bloburl"), "_blank")
}

export const generateF0121214PDF = async (data: F0121214Data, language: string = "uk", createCopy: boolean = true) => {
  const doc = new jsPDF()

  // Setup Ukrainian fonts for Cyrillic support
  await setupUkrainianFonts(doc)

  // Ставка военного сбора: 1.5% для года ≤2024, 5% для года ≥2025
  const reportYear = parseInt(data.year) || 2025
  const militaryTaxRate = reportYear >= 2025 ? 5 : 1.5
  const militaryTaxPercent = militaryTaxRate.toFixed(1).replace('.0', '')

  const labels = {
    uk: {
      title: "ПРИКЛАД ДЛЯ ЗАПОВНЕННЯ ПОДАТКОВОЇ ДЕКЛАРАЦІЇ",
      formNumber: "Ф0121214 (Ф1)",
      subtitle: "про майновий стан і доходи",
      officialNote: "Додаток Ф1 до річної податкової декларації",
      copyLabel: "КОПІЯ",
      originalLabel: "ОРИГІНАЛ",
      personalData: "I. ВІДОМОСТІ ПРО ПЛАТНИКА ПОДАТКУ",
      fullName: "Прізвище, ім'я, по батькові:",
      taxNumber: "Реєстраційний номер облікової картки платника податків (ІПН):",
      year: "Звітний (податковий) період (рік):",
      positions: "II. ВІДОМОСТІ ПРО ІНВЕСТИЦІЙНІ ПРИБУТКИ",
      position: "Позиція",
      assetType: "Вид активу:",
      currency: "Валюта:",
      quantity: "Кількість:",
      multiplier: "Множник:",
      purchaseDate: "Дата придбання:",
      saleDate: "Дата продажу/отримання:",
      purchasePriceForeign: "Сума купівлі (валюта):",
      salePriceForeign: "Сума продажу (валюта):",
      purchaseRate: "Курс НБУ на дату придбання:",
      saleRate: "Курс НБУ на дату продажу:",
      purchasePrice: "Вартість придбання (грн):",
      salePrice: "Вартість продажу (грн):",
      expenses: "Документально підтверджені витрати (грн):",
      positionProfit: "Фінансовий результат (грн):",
      taxSummary: "III. РОЗРАХУНОК ПОДАТКОВИХ ЗОБОВ'ЯЗАНЬ",
      totalProfit: "Загальний інвестиційний прибуток:",
      pdfo: "Податок на доходи фізичних осіб (ПДФО):",
      militaryTax: "Військовий збір:",
      totalTax: "ЗАГАЛЬНА СУМА ДО СПЛАТИ:",
      notes: "IV. ДОДАТКОВА ІНФОРМАЦІЯ",
      generatedDate: "Дата формування декларації:",
      signature: "Підпис платника податку",
      signatureLine: "_________________",
      assetTypes: {
        stocks: "Акції",
        bonds: "Облігації",
        options: "Опціони",
        dividends: "Дивіденди",
        crypto: "Криптовалюта",
        real_estate: "Нерухоме майно",
        other: "Інше",
      },
      taxRates: {
        trades: `Операції з цінними паперами (18% ПДФО + ${militaryTaxPercent}% ВЗ)`,
        dividends: `Дивіденди (9% ПДФО + ${militaryTaxPercent}% ВЗ)`,
      },
    },
    en: {
      title: "EXAMPLE FOR FILLING OUT TAX DECLARATION",
      formNumber: "F0121214 (F1)",
      subtitle: "on property status and income",
      officialNote: "Appendix F1 to annual tax return",
      copyLabel: "COPY",
      originalLabel: "ORIGINAL",
      personalData: "I. INFORMATION ABOUT THE TAXPAYER",
      fullName: "Full name:",
      taxNumber: "Taxpayer identification number (TIN):",
      year: "Reporting (tax) period (year):",
      positions: "II. INFORMATION ABOUT INVESTMENT INCOME",
      position: "Position",
      assetType: "Asset type:",
      currency: "Currency:",
      quantity: "Quantity:",
      multiplier: "Multiplier:",
      purchaseDate: "Purchase date:",
      saleDate: "Sale/receipt date:",
      purchasePriceForeign: "Purchase amount (foreign currency):",
      salePriceForeign: "Sale amount (foreign currency):",
      purchaseRate: "NBU rate on purchase date:",
      saleRate: "NBU rate on sale date:",
      purchasePrice: "Purchase cost (UAH):",
      salePrice: "Sale value (UAH):",
      expenses: "Documented expenses (UAH):",
      positionProfit: "Financial result (UAH):",
      taxSummary: "III. TAX LIABILITY CALCULATION",
      totalProfit: "Total investment profit:",
      pdfo: "Personal income tax (PIT):",
      militaryTax: "Military levy:",
      totalTax: "TOTAL AMOUNT DUE:",
      notes: "IV. ADDITIONAL INFORMATION",
      generatedDate: "Declaration date:",
      signature: "Taxpayer signature",
      signatureLine: "_________________",
      assetTypes: {
        stocks: "Stocks",
        bonds: "Bonds",
        options: "Options",
        dividends: "Dividends",
        crypto: "Cryptocurrency",
        real_estate: "Real Estate",
        other: "Other",
      },
      taxRates: {
        trades: `Securities transactions (18% PIT + ${militaryTaxPercent}% ML)`,
        dividends: `Dividends (9% PIT + ${militaryTaxPercent}% ML)`,
      },
    },
  }

  const t = labels[language as keyof typeof labels] || labels.en

  // Function to generate document content (original or copy)
  const generateContent = (isCopy: boolean) => {
    // Header - Official format
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text(t.title, 105, 15, { align: "center" })

    doc.setFontSize(13)
    doc.text(t.formNumber, 105, 23, { align: "center" })

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(11)
    doc.text(t.subtitle, 105, 30, { align: "center" })

    // Official note
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    doc.text(t.officialNote, 105, 36, { align: "center" })

    // Original/Copy marker
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(11)
    if (isCopy) {
      doc.setTextColor(200, 0, 0)
      doc.text(t.copyLabel, 180, 25, { align: "right" })
    } else {
      doc.setTextColor(0, 100, 0)
      doc.text(t.originalLabel, 180, 25, { align: "right" })
    }

    let yPos = 48

    // Personal Data Section
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.personalData, 15, yPos)
    yPos += 10

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(10)
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
      theme: "grid",
      styles: {
        font: "DejaVuSans",
        fontStyle: "normal",
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { font: "DejaVuSans", fontStyle: "bold", cellWidth: 80 },
        1: { font: "DejaVuSans", cellWidth: 100 },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 12

    // Positions Section
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.positions, 15, yPos)
    yPos += 8

    data.positions.forEach((position, index) => {
      const purchasePrice = parseFloat(position.purchasePrice) || 0
      const salePrice = parseFloat(position.salePrice) || 0
      const expenses = parseFloat(position.expenses) || 0

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
      doc.setFontSize(11)
      doc.setTextColor(60, 60, 60)
      doc.text(`${t.position} #${index + 1}`, 15, yPos)
      yPos += 7

      const positionData = [
        [t.assetType, assetTypeLabel],
        [t.currency, currency],
      ]

      // Add quantity for stocks and options
      if (position.assetType !== "dividends" && position.quantity) {
        const quantity = parseFloat(position.quantity) || 0
        const multiplier = parseFloat(position.multiplier || "1") || 1
        if (quantity !== 0) {
          positionData.push([t.quantity, quantity.toString()])
          if (multiplier !== 1) {
            positionData.push([t.multiplier, multiplier.toString()])
          }
        }
      }

      if (position.assetType !== "dividends") {
        positionData.push(
          [t.purchaseDate, position.purchaseDate || "-"],
          [t.saleDate, position.saleDate || "-"]
        )
      } else {
        positionData.push([t.saleDate, position.saleDate || "-"])
      }

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
          fontSize: 8,
          cellPadding: 2
        },
        columnStyles: {
          0: { font: "DejaVuSans", fontStyle: "bold", cellWidth: 80 },
          1: { font: "DejaVuSans", cellWidth: 100 },
        },
      })

      yPos = (doc as any).lastAutoTable.finalY + 8

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
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.taxSummary, 15, yPos)
    yPos += 8

    const taxData = []

    if (data.calculations.profitFromTrades !== undefined && data.calculations.profitFromTrades !== 0) {
      taxData.push(
        [`${language === "uk" ? "Прибуток від операцій з ЦП:" : "Profit from securities:"}`, `${(data.calculations.profitFromTrades || 0).toFixed(2)} UAH`],
        [`${language === "uk" ? "  - ПДФО (18%):" : "  - PIT (18%):"}`, `${(data.calculations.pdfoFromTrades || 0).toFixed(2)} UAH`],
        [`${language === "uk" ? `  - Військовий збір (${militaryTaxPercent}%):` : `  - Military levy (${militaryTaxPercent}%):`}`, `${(data.calculations.militaryTaxFromTrades || 0).toFixed(2)} UAH`]
      )
    }

    if (data.calculations.dividends !== undefined && data.calculations.dividends > 0) {
      taxData.push(
        [`${language === "uk" ? "Дивіденди отримано:" : "Dividends received:"}`, `${(data.calculations.dividends || 0).toFixed(2)} UAH`],
        [`${language === "uk" ? "  - ПДФО (9%):" : "  - PIT (9%):"}`, `${(data.calculations.pdfoFromDividends || 0).toFixed(2)} UAH`],
        [`${language === "uk" ? `  - Військовий збір (${militaryTaxPercent}%):` : `  - Military levy (${militaryTaxPercent}%):`}`, `${(data.calculations.militaryTaxFromDividends || 0).toFixed(2)} UAH`]
      )
    }

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
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { font: "DejaVuSans", fontStyle: "bold", cellWidth: 80 },
        1: { font: "DejaVuSans", cellWidth: 100, halign: "right" },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 5

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: [[t.totalTax, `${data.calculations.total.toFixed(2)} UAH`]],
      theme: "grid",
      styles: {
        font: "DejaVuSans",
        fontSize: 10,
        cellPadding: 4,
        fontStyle: "bold",
        fillColor: [240, 240, 255]
      },
      columnStyles: {
        0: { font: "DejaVuSans", cellWidth: 80 },
        1: { font: "DejaVuSans", cellWidth: 100, halign: "right" },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 12

    // Notes
    if (data.notes) {
      doc.setFont("DejaVuSans", "bold")
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(t.notes, 15, yPos)
      yPos += 7

      doc.setFont("DejaVuSans", "normal")
      doc.setFontSize(9)
      doc.setTextColor(40, 40, 40)
      const splitText = doc.splitTextToSize(data.notes, 180)
      doc.text(splitText, 15, yPos)
      yPos += splitText.length * 4 + 10
    }

    // Signature section
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    } else {
      yPos += 8
    }

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(9)
    doc.setTextColor(40, 40, 40)
    doc.text(t.signature, 15, yPos)
    doc.text(t.signatureLine, 80, yPos)

    return (doc as any).internal.getNumberOfPages()
  }

  // Generate original
  const originalPages = generateContent(false)

  // Add footer to original pages
  doc.setFont("DejaVuSans", "normal")
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  for (let i = 1; i <= originalPages; i++) {
    doc.setPage(i)
    doc.text(
      `${t.generatedDate} ${new Date().toLocaleDateString()} | Сторінка ${i} з ${originalPages}`,
      105,
      285,
      { align: "center" }
    )
  }

  // Generate copy if requested
  if (createCopy) {
    // Add separator page
    doc.addPage()
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(20)
    doc.setTextColor(100, 100, 100)
    doc.text("--- КОПІЯ / COPY ---", 105, 140, { align: "center" })

    // Generate copy content
    doc.addPage()
    const copyStartPage = originalPages + 2
    const copyEndPage = generateContent(true) + copyStartPage - 1

    // Add footer to copy pages
    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    for (let i = copyStartPage; i <= copyEndPage; i++) {
      doc.setPage(i)
      const pageNum = i - copyStartPage + 1
      const totalCopyPages = copyEndPage - copyStartPage + 1
      doc.text(
        `${t.copyLabel} | ${t.generatedDate} ${new Date().toLocaleDateString()} | Сторінка ${pageNum} з ${totalCopyPages}`,
        105,
        285,
        { align: "center" }
      )
    }
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `F0121214_${data.taxNumber || 'NN'}_${data.year}_${timestamp}.pdf`

  // Save and open
  doc.save(filename)
  window.open(doc.output("bloburl"), "_blank")
}

// PIT-37 Data Interface
export interface PIT37Data {
  firstName: string
  lastName: string
  pesel: string
  nip: string
  birthDate: string
  address: string
  city: string
  postalCode: string
  year: string
  employmentIncome: string
  pensionIncome: string
  otherIncome: string
  employmentCosts: string
  otherCosts: string
  socialSecurityContributions: string
  healthInsuranceContributions: string
  childrenNumber: string
  childRelief: string
  internetRelief: string
  donationsRelief: string
  additionalInfo: string
}

export const generatePIT37PDF = async (data: PIT37Data, language: string = "pl", createCopy: boolean = true) => {
  const doc = new jsPDF()
  await setupUkrainianFonts(doc)

  const labels = {
    pl: {
      title: "PRZYKŁAD WYPEŁNIENIA ZEZNANIA PODATKOWEGO PIT-37",
      subtitle: "Zeznanie o wysokości osiągniętego dochodu (w tym z działalności gospodarczej)",
      officialNote: "Urząd Skarbowy - Roczne zeznanie podatkowe",
      copyLabel: "KOPIA",
      originalLabel: "ORYGINAŁ",
      personalData: "A. DANE PODATNIKA",
      fullName: "Nazwisko i imię:",
      pesel: "PESEL:",
      nip: "NIP:",
      birthDate: "Data urodzenia:",
      address: "Adres zamieszkania:",
      year: "Rok podatkowy:",
      income: "B. PRZYCHODY",
      employmentIncome: "Przychody z umowy o pracę:",
      pensionIncome: "Emerytury i renty:",
      otherIncome: "Inne przychody:",
      totalIncome: "Suma przychodów:",
      costs: "C. KOSZTY UZYSKANIA PRZYCHODÓW",
      employmentCosts: "Koszty z pracy:",
      otherCosts: "Inne koszty:",
      totalCosts: "Suma kosztów:",
      contributions: "D. SKŁADKI",
      socialSecurity: "Składki na ubezpieczenia społeczne:",
      healthInsurance: "Składki na ubezpieczenie zdrowotne:",
      reliefs: "E. ULGI PODATKOWE",
      children: "Liczba dzieci:",
      childRelief: "Ulga na dzieci:",
      internetRelief: "Ulga internetowa:",
      donationsRelief: "Darowizny:",
      taxCalculation: "F. OBLICZENIE PODATKU",
      taxBase: "Podstawa opodatkowania:",
      calculatedTax: "Podatek należny (17%):",
      taxToPay: "Podatek do zapłaty:",
      additionalInfo: "G. INFORMACJE DODATKOWE",
      generatedDate: "Data sporządzenia:",
      signature: "Podpis podatnika",
      signatureLine: "_________________",
    },
    en: {
      title: "EXAMPLE FOR FILLING OUT TAX RETURN PIT-37",
      subtitle: "Declaration of income achieved",
      officialNote: "Tax Office - Annual tax return",
      copyLabel: "COPY",
      originalLabel: "ORIGINAL",
      personalData: "A. TAXPAYER DATA",
      fullName: "Name and surname:",
      pesel: "PESEL:",
      nip: "NIP:",
      birthDate: "Date of birth:",
      address: "Residential address:",
      year: "Tax year:",
      income: "B. INCOME",
      employmentIncome: "Employment income:",
      pensionIncome: "Pensions and annuities:",
      otherIncome: "Other income:",
      totalIncome: "Total income:",
      costs: "C. TAX DEDUCTIBLE COSTS",
      employmentCosts: "Employment costs:",
      otherCosts: "Other costs:",
      totalCosts: "Total costs:",
      contributions: "D. CONTRIBUTIONS",
      socialSecurity: "Social security contributions:",
      healthInsurance: "Health insurance contributions:",
      reliefs: "E. TAX RELIEFS",
      children: "Number of children:",
      childRelief: "Child relief:",
      internetRelief: "Internet relief:",
      donationsRelief: "Donations:",
      taxCalculation: "F. TAX CALCULATION",
      taxBase: "Tax base:",
      calculatedTax: "Tax due (17%):",
      taxToPay: "Tax to pay:",
      additionalInfo: "G. ADDITIONAL INFORMATION",
      generatedDate: "Date prepared:",
      signature: "Taxpayer signature",
      signatureLine: "_________________",
    },
    uk: {
      title: "ПРИКЛАД ЗАПОВНЕННЯ ДЕКЛАРАЦІЇ PIT-37",
      subtitle: "Zeznanie o wysokości osiągniętego dochodu",
      officialNote: "Urząd Skarbowy - Roczne zeznanie podatkowe",
      copyLabel: "KOPIA",
      originalLabel: "ORYGINAŁ",
      personalData: "A. DANE PODATНІКА",
      fullName: "Nazwisko i imię:",
      pesel: "PESEL:",
      nip: "NIP:",
      birthDate: "Data urodzenia:",
      address: "Adres zamieszkania:",
      year: "Rok podatkowy:",
      income: "B. PRZYCHODY",
      employmentIncome: "Przychody z umowy o pracę:",
      pensionIncome: "Emerytury i renty:",
      otherIncome: "Inne przychody:",
      totalIncome: "Suma przychodów:",
      costs: "C. KOSZTY УЗИСКАННЯ ПРИХОДІВ",
      employmentCosts: "Кошти з праці:",
      otherCosts: "Інші кошти:",
      totalCosts: "Сума коштів:",
      contributions: "D. СКЛАДКИ",
      socialSecurity: "Складки на соціальне страхування:",
      healthInsurance: "Складки на медичне страхування:",
      reliefs: "E. ПІЛЬГИ ПОДАТКОВІ",
      children: "Кількість дітей:",
      childRelief: "Пільга на дітей:",
      internetRelief: "Пільга інтернетова:",
      donationsRelief: "Дарунки:",
      taxCalculation: "F. ОБЧИСЛЕННЯ ПОДАТКУ",
      taxBase: "Податкова база:",
      calculatedTax: "Податок належний (17%):",
      taxToPay: "Податок до сплати:",
      additionalInfo: "G. ДОДАТКОВА ІНФОРМАЦІЯ",
      generatedDate: "Дата складання:",
      signature: "Підпис платника податку",
      signatureLine: "_________________",
    },
  }

  const t = labels[language as keyof typeof labels] || labels.pl

  // Calculate totals
  const employmentIncome = parseFloat(data.employmentIncome) || 0
  const pensionIncome = parseFloat(data.pensionIncome) || 0
  const otherIncome = parseFloat(data.otherIncome) || 0
  const totalIncome = employmentIncome + pensionIncome + otherIncome

  const employmentCosts = parseFloat(data.employmentCosts) || 0
  const otherCosts = parseFloat(data.otherCosts) || 0
  const totalCosts = employmentCosts + otherCosts

  const socialSecurity = parseFloat(data.socialSecurityContributions) || 0
  const healthInsurance = parseFloat(data.healthInsuranceContributions) || 0

  const childRelief = parseFloat(data.childRelief) || 0
  const internetRelief = parseFloat(data.internetRelief) || 0
  const donationsRelief = parseFloat(data.donationsRelief) || 0
  const totalReliefs = childRelief + internetRelief + donationsRelief

  const taxBase = Math.max(0, totalIncome - totalCosts - socialSecurity - totalReliefs)
  const calculatedTax = taxBase * 0.17
  const taxToPay = Math.max(0, calculatedTax - healthInsurance)

  // Function to generate document content
  const generateContent = (isCopy: boolean) => {
    // Header - Official format
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text(t.title, 105, 15, { align: "center" })

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(10)
    doc.text(t.subtitle, 105, 23, { align: "center" })

    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    doc.text(t.officialNote, 105, 30, { align: "center" })

    // Copy/Original marker
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(11)
    if (isCopy) {
      doc.setTextColor(200, 0, 0)
      doc.text(t.copyLabel, 180, 35, { align: "right" })
    } else {
      doc.setTextColor(0, 100, 0)
      doc.text(t.originalLabel, 180, 35, { align: "right" })
    }

    let yPos = 42

    // Personal Data
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.personalData, 15, yPos)
    yPos += 8

    const personalData = [
      [t.fullName, `${data.firstName} ${data.lastName}`],
      [t.pesel, data.pesel || "-"],
      [t.nip, data.nip || "-"],
      [t.birthDate, data.birthDate || "-"],
      [t.address, `${data.address}, ${data.postalCode} ${data.city}`],
      [t.year, data.year],
    ]

    autoTable(doc, {
      startY: yPos,
      body: personalData,
      theme: "grid",
      styles: { font: "DejaVuSans", fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 70 },
        1: { cellWidth: 110 },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10

    // Income Section
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.income, 15, yPos)
    yPos += 8

    const incomeData = [
      [t.employmentIncome, `${employmentIncome.toFixed(2)} PLN`],
      [t.pensionIncome, `${pensionIncome.toFixed(2)} PLN`],
      [t.otherIncome, `${otherIncome.toFixed(2)} PLN`],
      [t.totalIncome, `${totalIncome.toFixed(2)} PLN`],
    ]

    autoTable(doc, {
      startY: yPos,
      body: incomeData,
      theme: "grid",
      styles: { font: "DejaVuSans", fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 70 },
        1: { cellWidth: 110, halign: "right" },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10

    // Costs Section
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.costs, 15, yPos)
    yPos += 8

    const costsData = [
      [t.employmentCosts, `${employmentCosts.toFixed(2)} PLN`],
      [t.otherCosts, `${otherCosts.toFixed(2)} PLN`],
      [t.totalCosts, `${totalCosts.toFixed(2)} PLN`],
    ]

    autoTable(doc, {
      startY: yPos,
      body: costsData,
      theme: "grid",
      styles: { font: "DejaVuSans", fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 70 },
        1: { cellWidth: 110, halign: "right" },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10

    // Contributions
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.contributions, 15, yPos)
    yPos += 8

    const contributionsData = [
      [t.socialSecurity, `${socialSecurity.toFixed(2)} PLN`],
      [t.healthInsurance, `${healthInsurance.toFixed(2)} PLN`],
    ]

    autoTable(doc, {
      startY: yPos,
      body: contributionsData,
      theme: "grid",
      styles: { font: "DejaVuSans", fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 70 },
        1: { cellWidth: 110, halign: "right" },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10

    // Tax Reliefs
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.reliefs, 15, yPos)
    yPos += 8

    const reliefsData = [
      [t.children, data.childrenNumber || "0"],
      [t.childRelief, `${childRelief.toFixed(2)} PLN`],
      [t.internetRelief, `${internetRelief.toFixed(2)} PLN`],
      [t.donationsRelief, `${donationsRelief.toFixed(2)} PLN`],
    ]

    autoTable(doc, {
      startY: yPos,
      body: reliefsData,
      theme: "grid",
      styles: { font: "DejaVuSans", fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 70 },
        1: { cellWidth: 110, halign: "right" },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10

    // Tax Calculation
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.taxCalculation, 15, yPos)
    yPos += 8

    const taxCalcData = [
      [t.taxBase, `${taxBase.toFixed(2)} PLN`],
      [t.calculatedTax, `${calculatedTax.toFixed(2)} PLN`],
      [t.taxToPay, `${taxToPay.toFixed(2)} PLN`],
    ]

    autoTable(doc, {
      startY: yPos,
      body: taxCalcData,
      theme: "grid",
      styles: {
        font: "DejaVuSans",
        fontSize: 10,
        cellPadding: 4,
        fontStyle: "bold",
        fillColor: [240, 240, 255]
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 110, halign: "right" },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10

    // Additional Info
    if (data.additionalInfo) {
      doc.setFont("DejaVuSans", "bold")
      doc.setFontSize(13)
      doc.setTextColor(0, 0, 0)
      doc.text(t.additionalInfo, 15, yPos)
      yPos += 7

      doc.setFont("DejaVuSans", "normal")
      doc.setFontSize(9)
      doc.setTextColor(40, 40, 40)
      const lines = doc.splitTextToSize(data.additionalInfo, 180)
      doc.text(lines, 15, yPos)
      yPos += lines.length * 4 + 10
    }

    // Signature section
    if (yPos > 240) {
      doc.addPage()
      yPos = 20
    } else {
      yPos += 8
    }

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(9)
    doc.setTextColor(40, 40, 40)
    doc.text(t.signature, 15, yPos)
    doc.text(t.signatureLine, 80, yPos)

    return (doc as any).internal.getNumberOfPages()
  }

  // Generate original
  const originalPages = generateContent(false)

  // Add footer to original pages
  doc.setFont("DejaVuSans", "normal")
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  for (let i = 1; i <= originalPages; i++) {
    doc.setPage(i)
    doc.text(
      `${t.generatedDate} ${new Date().toLocaleDateString()} | Strona ${i} z ${originalPages}`,
      105,
      285,
      { align: "center" }
    )
  }

  // Generate copy if requested
  if (createCopy) {
    doc.addPage()
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(20)
    doc.setTextColor(100, 100, 100)
    doc.text("--- KOPIA / COPY ---", 105, 140, { align: "center" })

    doc.addPage()
    const copyStartPage = originalPages + 2
    const copyEndPage = generateContent(true) + copyStartPage - 1

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    for (let i = copyStartPage; i <= copyEndPage; i++) {
      doc.setPage(i)
      const pageNum = i - copyStartPage + 1
      const totalCopyPages = copyEndPage - copyStartPage + 1
      doc.text(
        `${t.copyLabel} | ${t.generatedDate} ${new Date().toLocaleDateString()} | Strona ${pageNum} z ${totalCopyPages}`,
        105,
        285,
        { align: "center" }
      )
    }
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `PIT-37_${data.nip || data.pesel || 'NN'}_${data.year}_${timestamp}.pdf`

  doc.save(filename)
  window.open(doc.output("bloburl"), "_blank")
}

// PIT-38 Data Interface
export interface PIT38Data {
  firstName: string
  lastName: string
  pesel: string
  nip: string
  address: string
  city: string
  postalCode: string
  year: string
  dividendsIncome: string
  interestIncome: string
  stockSalesIncome: string
  bondIncome: string
  otherCapitalIncome: string
  stockPurchaseCosts: string
  otherCapitalCosts: string
  previousYearLosses: string
  advanceTaxPaid: string
  foreignTaxPaid: string
  additionalInfo: string
}

export const generatePIT38PDF = async (data: PIT38Data, language: string = "pl", createCopy: boolean = true) => {
  const doc = new jsPDF()
  await setupUkrainianFonts(doc)

  const labels = {
    pl: {
      title: "PRZYKŁAD WYPEŁNIENIA ZEZNANIA PODATKOWEGO PIT-38",
      subtitle: "Zeznanie o wysokości osiągniętego dochodu z kapitałów pieniężnych",
      officialNote: "Urząd Skarbowy - Dochody z kapitałów pieniężnych",
      copyLabel: "KOPIA",
      originalLabel: "ORYGINAŁ",
      personalData: "A. DANE PODATNIKA",
      fullName: "Nazwisko i imię:",
      pesel: "PESEL:",
      nip: "NIP:",
      address: "Adres zamieszkania:",
      year: "Rok podatkowy:",
      capitalIncome: "B. PRZYCHODY Z KAPITAŁÓW PIENIĘŻNYCH",
      dividends: "Dywidendy:",
      interest: "Odsetki:",
      stockSales: "Sprzedaż akcji:",
      bonds: "Obligacje:",
      otherCapital: "Inne przychody:",
      totalIncome: "Suma przychodów:",
      costs: "C. KOSZTY UZYSKANIA PRZYCHODÓW",
      stockCosts: "Koszty nabycia akcji:",
      otherCosts: "Inne koszty:",
      losses: "Straty z lat ubiegłych:",
      totalCosts: "Suma kosztów:",
      taxPaid: "D. PODATEK ZAPŁACONY",
      advanceTax: "Zaliczki na podatek:",
      foreignTax: "Podatek za granicą:",
      taxCalculation: "E. OBLICZENIE PODATKU",
      taxBase: "Podstawa opodatkowania:",
      calculatedTax: "Podatek należny (19%):",
      taxToPay: "Podatek do zapłaty:",
      additionalInfo: "F. INFORMACJE DODATKOWE",
      generatedDate: "Data sporządzenia:",
      signature: "Podpis podatnika",
      signatureLine: "_________________",
    },
    en: {
      title: "EXAMPLE FOR FILLING OUT TAX RETURN PIT-38",
      subtitle: "Declaration of income from capital",
      officialNote: "Tax Office - Income from capital",
      copyLabel: "COPY",
      originalLabel: "ORIGINAL",
      personalData: "A. TAXPAYER DATA",
      fullName: "Name and surname:",
      pesel: "PESEL:",
      nip: "NIP:",
      address: "Residential address:",
      year: "Tax year:",
      capitalIncome: "B. INCOME FROM CAPITAL",
      dividends: "Dividends:",
      interest: "Interest:",
      stockSales: "Stock sales:",
      bonds: "Bonds:",
      otherCapital: "Other income:",
      totalIncome: "Total income:",
      costs: "C. TAX DEDUCTIBLE COSTS",
      stockCosts: "Stock purchase costs:",
      otherCosts: "Other costs:",
      losses: "Previous year losses:",
      totalCosts: "Total costs:",
      taxPaid: "D. TAX PAID",
      advanceTax: "Advance tax:",
      foreignTax: "Foreign tax:",
      taxCalculation: "E. TAX CALCULATION",
      taxBase: "Tax base:",
      calculatedTax: "Tax due (19%):",
      taxToPay: "Tax to pay:",
      additionalInfo: "F. ADDITIONAL INFORMATION",
      generatedDate: "Date prepared:",
      signature: "Taxpayer signature",
      signatureLine: "_________________",
    },
    uk: {
      title: "ПРИКЛАД ЗАПОВНЕННЯ ДЕКЛАРАЦІЇ PIT-38",
      subtitle: "Zeznanie o wysokości osiągniętego dochodu z kapitałów pieniężnych",
      officialNote: "Urząd Skarbowy - Dochody z kapitałów pieniężnych",
      copyLabel: "KOPIA",
      originalLabel: "ORYGINAŁ",
      personalData: "A. DANE PODATNIKA",
      fullName: "Nazwisko i imię:",
      pesel: "PESEL:",
      nip: "NIP:",
      address: "Adres zamieszkania:",
      year: "Rok podatkowy:",
      capitalIncome: "B. PRZYCHODY Z KAPITAŁÓW PIENIĘŻNYCH",
      dividends: "Dywidendy:",
      interest: "Odsetki:",
      stockSales: "Sprzedaż akcji:",
      bonds: "Obligacje:",
      otherCapital: "Inne przychody:",
      totalIncome: "Suma przychodów:",
      costs: "C. KOSZTY UZYSKANIA PRZYCHODÓW",
      stockCosts: "Koszty nabycia akcji:",
      otherCosts: "Inne koszty:",
      losses: "Straty z lat ubiegłych:",
      totalCosts: "Suma kosztów:",
      taxPaid: "D. PODATEK ZAPŁACONY",
      advanceTax: "Zaliczki na podatek:",
      foreignTax: "Podatek za granicą:",
      taxCalculation: "E. OBLICZENIE PODATKU",
      taxBase: "Podstawa opodatkowania:",
      calculatedTax: "Podatek należny (19%):",
      taxToPay: "Podatek do zapłaty:",
      additionalInfo: "F. INFORMACJE DODATKOWE",
      generatedDate: "Data sporządzenia:",
      signature: "Podpis podatnika",
      signatureLine: "_________________",
    },
  }

  const t = labels[language as keyof typeof labels] || labels.pl

  // Calculate totals
  const dividends = parseFloat(data.dividendsIncome) || 0
  const interest = parseFloat(data.interestIncome) || 0
  const stockSales = parseFloat(data.stockSalesIncome) || 0
  const bonds = parseFloat(data.bondIncome) || 0
  const otherCapital = parseFloat(data.otherCapitalIncome) || 0
  const totalIncome = dividends + interest + stockSales + bonds + otherCapital

  const stockCosts = parseFloat(data.stockPurchaseCosts) || 0
  const otherCosts = parseFloat(data.otherCapitalCosts) || 0
  const losses = parseFloat(data.previousYearLosses) || 0
  const totalCosts = stockCosts + otherCosts + losses

  const advanceTax = parseFloat(data.advanceTaxPaid) || 0
  const foreignTax = parseFloat(data.foreignTaxPaid) || 0

  const taxBase = Math.max(0, totalIncome - totalCosts)
  const calculatedTax = taxBase * 0.19
  const taxToPay = Math.max(0, calculatedTax - advanceTax - foreignTax)

  // Function to generate document content
  const generateContent = (isCopy: boolean) => {
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text(t.title, 105, 15, { align: "center" })

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(10)
    doc.text(t.subtitle, 105, 23, { align: "center" })

    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    doc.text(t.officialNote, 105, 30, { align: "center" })

    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(11)
    if (isCopy) {
      doc.setTextColor(200, 0, 0)
      doc.text(t.copyLabel, 180, 35, { align: "right" })
    } else {
      doc.setTextColor(0, 100, 0)
      doc.text(t.originalLabel, 180, 35, { align: "right" })
    }

    let yPos = 42

    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.personalData, 15, yPos)
    yPos += 8

    const personalData = [
      [t.fullName, `${data.firstName} ${data.lastName}`],
      [t.pesel, data.pesel || "-"],
      [t.nip, data.nip || "-"],
      [t.address, `${data.address}, ${data.postalCode} ${data.city}`],
      [t.year, data.year],
    ]

    autoTable(doc, {
      startY: yPos,
      body: personalData,
      theme: "grid",
      styles: { font: "DejaVuSans", fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 70 },
        1: { cellWidth: 110 },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10

    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.capitalIncome, 15, yPos)
    yPos += 8

    const incomeData = [
      [t.dividends, `${dividends.toFixed(2)} PLN`],
      [t.interest, `${interest.toFixed(2)} PLN`],
      [t.stockSales, `${stockSales.toFixed(2)} PLN`],
      [t.bonds, `${bonds.toFixed(2)} PLN`],
      [t.otherCapital, `${otherCapital.toFixed(2)} PLN`],
      [t.totalIncome, `${totalIncome.toFixed(2)} PLN`],
    ]

    autoTable(doc, {
      startY: yPos,
      body: incomeData,
      theme: "grid",
      styles: { font: "DejaVuSans", fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 70 },
        1: { cellWidth: 110, halign: "right" },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10

    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.costs, 15, yPos)
    yPos += 8

    const costsData = [
      [t.stockCosts, `${stockCosts.toFixed(2)} PLN`],
      [t.otherCosts, `${otherCosts.toFixed(2)} PLN`],
      [t.losses, `${losses.toFixed(2)} PLN`],
      [t.totalCosts, `${totalCosts.toFixed(2)} PLN`],
    ]

    autoTable(doc, {
      startY: yPos,
      body: costsData,
      theme: "grid",
      styles: { font: "DejaVuSans", fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 70 },
        1: { cellWidth: 110, halign: "right" },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10

    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.taxPaid, 15, yPos)
    yPos += 8

    const taxPaidData = [
      [t.advanceTax, `${advanceTax.toFixed(2)} PLN`],
      [t.foreignTax, `${foreignTax.toFixed(2)} PLN`],
    ]

    autoTable(doc, {
      startY: yPos,
      body: taxPaidData,
      theme: "grid",
      styles: { font: "DejaVuSans", fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 70 },
        1: { cellWidth: 110, halign: "right" },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10

    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.taxCalculation, 15, yPos)
    yPos += 8

    const taxCalcData = [
      [t.taxBase, `${taxBase.toFixed(2)} PLN`],
      [t.calculatedTax, `${calculatedTax.toFixed(2)} PLN`],
      [t.taxToPay, `${taxToPay.toFixed(2)} PLN`],
    ]

    autoTable(doc, {
      startY: yPos,
      body: taxCalcData,
      theme: "grid",
      styles: {
        font: "DejaVuSans",
        fontSize: 10,
        cellPadding: 4,
        fontStyle: "bold",
        fillColor: [240, 240, 255]
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 110, halign: "right" },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10

    if (data.additionalInfo) {
      doc.setFont("DejaVuSans", "bold")
      doc.setFontSize(13)
      doc.setTextColor(0, 0, 0)
      doc.text(t.additionalInfo, 15, yPos)
      yPos += 7

      doc.setFont("DejaVuSans", "normal")
      doc.setFontSize(9)
      doc.setTextColor(40, 40, 40)
      const lines = doc.splitTextToSize(data.additionalInfo, 180)
      doc.text(lines, 15, yPos)
      yPos += lines.length * 4 + 10
    }

    if (yPos > 240) {
      doc.addPage()
      yPos = 20
    } else {
      yPos += 8
    }

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(9)
    doc.setTextColor(40, 40, 40)
    doc.text(t.signature, 15, yPos)
    doc.text(t.signatureLine, 80, yPos)

    return (doc as any).internal.getNumberOfPages()
  }

  const originalPages = generateContent(false)

  doc.setFont("DejaVuSans", "normal")
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  for (let i = 1; i <= originalPages; i++) {
    doc.setPage(i)
    doc.text(
      `${t.generatedDate} ${new Date().toLocaleDateString()} | Strona ${i} z ${originalPages}`,
      105,
      285,
      { align: "center" }
    )
  }

  if (createCopy) {
    doc.addPage()
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(20)
    doc.setTextColor(100, 100, 100)
    doc.text("--- KOPIA / COPY ---", 105, 140, { align: "center" })

    doc.addPage()
    const copyStartPage = originalPages + 2
    const copyEndPage = generateContent(true) + copyStartPage - 1

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    for (let i = copyStartPage; i <= copyEndPage; i++) {
      doc.setPage(i)
      const pageNum = i - copyStartPage + 1
      const totalCopyPages = copyEndPage - copyStartPage + 1
      doc.text(
        `${t.copyLabel} | ${t.generatedDate} ${new Date().toLocaleDateString()} | Strona ${pageNum} z ${totalCopyPages}`,
        105,
        285,
        { align: "center" }
      )
    }
  }

  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `PIT-38_${data.nip || data.pesel || 'NN'}_${data.year}_${timestamp}.pdf`

  doc.save(filename)
  window.open(doc.output("bloburl"), "_blank")
}

// PIT-39 Data Interface
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

export interface PIT39Data {
  firstName: string
  lastName: string
  pesel: string
  nip: string
  address: string
  city: string
  postalCode: string
  year: string
  propertySales: PropertySale[]
  additionalInfo: string
}

export const generatePIT39PDF = async (data: PIT39Data, language: string = "pl", createCopy: boolean = true) => {
  const doc = new jsPDF()
  await setupUkrainianFonts(doc)

  const labels = {
    pl: {
      title: "PRZYKŁAD WYPEŁNIENIA ZEZNANIA PODATKOWEGO PIT-39",
      subtitle: "Zeznanie o wysokości osiągniętego dochodu (przychodu) z odpłatnego zbycia nieruchomości",
      officialNote: "Urząd Skarbowy - Dochody z odpłatnego zbycia",
      copyLabel: "KOPIA",
      originalLabel: "ORYGINAŁ",
      personalData: "A. DANE PODATNIKA",
      fullName: "Nazwisko i imię:",
      pesel: "PESEL:",
      nip: "NIP:",
      address: "Adres zamieszkania:",
      year: "Rok podatkowy:",
      propertySales: "B. SPRZEDAŻ MAJĄTKU",
      saleNo: "Sprzedaż nr",
      type: "Rodzaj:",
      description: "Opis:",
      purchaseDate: "Data nabycia:",
      saleDate: "Data sprzedaży:",
      purchasePrice: "Cena nabycia:",
      salePrice: "Cena sprzedaży:",
      improvements: "Wydatki na ulepszenie:",
      saleCosts: "Koszty sprzedaży:",
      profit: "Zysk:",
      loss: "Strata:",
      summary: "C. PODSUMOWANIE",
      totalRevenue: "Suma przychodów:",
      totalCosts: "Suma kosztów:",
      totalProfit: "Suma zysków:",
      calculatedTax: "Obliczony podatek (19%):",
      typeProperty: "Nieruchomość",
      typeStocks: "Akcje",
      typeOther: "Inne",
      additionalInfo: "D. INFORMACJE DODATKOWE",
      generatedDate: "Data sporządzenia:",
      signature: "Podpis podatnika",
      signatureLine: "_________________",
    },
    en: {
      title: "EXAMPLE FOR FILLING OUT TAX RETURN PIT-39",
      subtitle: "Declaration of income from property disposal",
      officialNote: "Tax Office - Income from property disposal",
      copyLabel: "COPY",
      originalLabel: "ORIGINAL",
      personalData: "A. TAXPAYER DATA",
      fullName: "Name and surname:",
      pesel: "PESEL:",
      nip: "NIP:",
      address: "Residential address:",
      year: "Tax year:",
      propertySales: "B. PROPERTY SALES",
      saleNo: "Sale no.",
      type: "Type:",
      description: "Description:",
      purchaseDate: "Purchase date:",
      saleDate: "Sale date:",
      purchasePrice: "Purchase price:",
      salePrice: "Sale price:",
      improvements: "Improvements:",
      saleCosts: "Sale costs:",
      profit: "Profit:",
      loss: "Loss:",
      summary: "C. SUMMARY",
      totalRevenue: "Total revenue:",
      totalCosts: "Total costs:",
      totalProfit: "Total profit:",
      calculatedTax: "Calculated tax (19%):",
      typeProperty: "Real Estate",
      typeStocks: "Stocks",
      typeOther: "Other",
      additionalInfo: "D. ADDITIONAL INFORMATION",
      generatedDate: "Date prepared:",
      signature: "Taxpayer signature",
      signatureLine: "_________________",
    },
    uk: {
      title: "ПРИКЛАД ЗАПОВНЕННЯ ДЕКЛАРАЦІЇ PIT-39",
      subtitle: "Zeznanie o wysokości osiągniętego dochodu z odpłatnego zbycia nieruchomości",
      officialNote: "Urząd Skarbowy - Dochody z odpłatnego zbycia",
      copyLabel: "KOPIA",
      originalLabel: "ORYGINAŁ",
      personalData: "A. DANE PODATNIKA",
      fullName: "Nazwisko i imię:",
      pesel: "PESEL:",
      nip: "NIP:",
      address: "Adres zamieszkania:",
      year: "Rok podatkowy:",
      propertySales: "B. SPRZEDAŻ MAJĄTKU",
      saleNo: "Sprzedaż nr",
      type: "Rodzaj:",
      description: "Opis:",
      purchaseDate: "Data nabycia:",
      saleDate: "Data sprzedaży:",
      purchasePrice: "Cena nabycia:",
      salePrice: "Cena sprzedaży:",
      improvements: "Wydatki na ulepszenie:",
      saleCosts: "Koszty sprzedaży:",
      profit: "Zysk:",
      loss: "Strata:",
      summary: "C. PODSUMOWANIE",
      totalRevenue: "Suma przychodów:",
      totalCosts: "Suma kosztów:",
      totalProfit: "Suma zysków:",
      calculatedTax: "Obliczony podatek (19%):",
      typeProperty: "Nieruchomość",
      typeStocks: "Akcje",
      typeOther: "Inne",
      additionalInfo: "D. INFORMACJE DODATKOWE",
      generatedDate: "Data sporządzenia:",
      signature: "Podpis podatnika",
      signatureLine: "_________________",
    },
  }

  const t = labels[language as keyof typeof labels] || labels.pl

  const getTypeLabel = (type: string) => {
    if (type === "property") return t.typeProperty
    if (type === "stocks") return t.typeStocks
    return t.typeOther
  }

  // Calculate totals
  let totalRevenue = 0
  let totalCosts = 0
  let totalProfit = 0

  data.propertySales.forEach((sale) => {
    const purchasePrice = parseFloat(sale.purchasePrice) || 0
    const salePrice = parseFloat(sale.salePrice) || 0
    const improvements = parseFloat(sale.improvements) || 0
    const saleCosts = parseFloat(sale.saleCosts) || 0

    const totalSaleCosts = purchasePrice + improvements + saleCosts
    const profit = salePrice - totalSaleCosts

    totalRevenue += salePrice
    totalCosts += totalSaleCosts
    totalProfit += profit
  })

  // Function to generate document content
  const generateContent = (isCopy: boolean) => {
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text(t.title, 105, 15, { align: "center" })

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(10)
    doc.text(t.subtitle, 105, 23, { align: "center" })

    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    doc.text(t.officialNote, 105, 30, { align: "center" })

    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(11)
    if (isCopy) {
      doc.setTextColor(200, 0, 0)
      doc.text(t.copyLabel, 180, 35, { align: "right" })
    } else {
      doc.setTextColor(0, 100, 0)
      doc.text(t.originalLabel, 180, 35, { align: "right" })
    }

    let yPos = 42

    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.personalData, 15, yPos)
    yPos += 8

    const personalData = [
      [t.fullName, `${data.firstName} ${data.lastName}`],
      [t.pesel, data.pesel || "-"],
      [t.nip, data.nip || "-"],
      [t.address, `${data.address}, ${data.postalCode} ${data.city}`],
      [t.year, data.year],
    ]

    autoTable(doc, {
      startY: yPos,
      body: personalData,
      theme: "grid",
      styles: { font: "DejaVuSans", fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 70 },
        1: { cellWidth: 110 },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10

    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.propertySales, 15, yPos)
    yPos += 8

    data.propertySales.forEach((sale, index) => {
      const purchasePrice = parseFloat(sale.purchasePrice) || 0
      const salePrice = parseFloat(sale.salePrice) || 0
      const improvements = parseFloat(sale.improvements) || 0
      const saleCosts = parseFloat(sale.saleCosts) || 0

      const totalSaleCosts = purchasePrice + improvements + saleCosts
      const profit = salePrice - totalSaleCosts

      if (yPos > 230) {
        doc.addPage()
        yPos = 20
      }

      doc.setFont("DejaVuSans", "bold")
      doc.setFontSize(11)
      doc.setTextColor(60, 60, 60)
      doc.text(`${t.saleNo} ${index + 1}`, 15, yPos)
      yPos += 7

      const saleData = [
        [t.type, getTypeLabel(sale.type)],
        [t.description, sale.description || "-"],
        [t.purchaseDate, sale.purchaseDate || "-"],
        [t.saleDate, sale.saleDate || "-"],
        [t.salePrice, `${salePrice.toFixed(2)} PLN`],
        [t.purchasePrice, `${purchasePrice.toFixed(2)} PLN`],
        [t.improvements, `${improvements.toFixed(2)} PLN`],
        [t.saleCosts, `${saleCosts.toFixed(2)} PLN`],
        [profit >= 0 ? t.profit : t.loss, `${Math.abs(profit).toFixed(2)} PLN`],
      ]

      autoTable(doc, {
        startY: yPos,
        body: saleData,
        theme: "grid",
        styles: { font: "DejaVuSans", fontSize: 9, cellPadding: 2 },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 70 },
          1: { cellWidth: 110 },
        },
      })

      yPos = (doc as any).lastAutoTable.finalY + 8
    })

    if (yPos > 220) {
      doc.addPage()
      yPos = 20
    }

    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text(t.summary, 15, yPos)
    yPos += 8

    const calculatedTax = Math.max(0, totalProfit * 0.19)

    const summaryData = [
      [t.totalRevenue, `${totalRevenue.toFixed(2)} PLN`],
      [t.totalCosts, `${totalCosts.toFixed(2)} PLN`],
      [t.totalProfit, `${totalProfit.toFixed(2)} PLN`],
      [t.calculatedTax, `${calculatedTax.toFixed(2)} PLN`],
    ]

    autoTable(doc, {
      startY: yPos,
      body: summaryData,
      theme: "grid",
      styles: {
        font: "DejaVuSans",
        fontSize: 10,
        cellPadding: 4,
        fontStyle: "bold",
        fillColor: [240, 240, 255]
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 110, halign: "right" },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10

    if (data.additionalInfo) {
      doc.setFont("DejaVuSans", "bold")
      doc.setFontSize(13)
      doc.setTextColor(0, 0, 0)
      doc.text(t.additionalInfo, 15, yPos)
      yPos += 7

      doc.setFont("DejaVuSans", "normal")
      doc.setFontSize(9)
      doc.setTextColor(40, 40, 40)
      const lines = doc.splitTextToSize(data.additionalInfo, 180)
      doc.text(lines, 15, yPos)
      yPos += lines.length * 4 + 10
    }

    if (yPos > 240) {
      doc.addPage()
      yPos = 20
    } else {
      yPos += 8
    }

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(9)
    doc.setTextColor(40, 40, 40)
    doc.text(t.signature, 15, yPos)
    doc.text(t.signatureLine, 80, yPos)

    return (doc as any).internal.getNumberOfPages()
  }

  const originalPages = generateContent(false)

  doc.setFont("DejaVuSans", "normal")
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  for (let i = 1; i <= originalPages; i++) {
    doc.setPage(i)
    doc.text(
      `${t.generatedDate} ${new Date().toLocaleDateString()} | Strona ${i} z ${originalPages}`,
      105,
      285,
      { align: "center" }
    )
  }

  if (createCopy) {
    doc.addPage()
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(20)
    doc.setTextColor(100, 100, 100)
    doc.text("--- KOPIA / COPY ---", 105, 140, { align: "center" })

    doc.addPage()
    const copyStartPage = originalPages + 2
    const copyEndPage = generateContent(true) + copyStartPage - 1

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    for (let i = copyStartPage; i <= copyEndPage; i++) {
      doc.setPage(i)
      const pageNum = i - copyStartPage + 1
      const totalCopyPages = copyEndPage - copyStartPage + 1
      doc.text(
        `${t.copyLabel} | ${t.generatedDate} ${new Date().toLocaleDateString()} | Strona ${pageNum} z ${totalCopyPages}`,
        105,
        285,
        { align: "center" }
      )
    }
  }

  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `PIT-39_${data.nip || data.pesel || 'NN'}_${data.year}_${timestamp}.pdf`

  doc.save(filename)
  window.open(doc.output("bloburl"), "_blank")
}
