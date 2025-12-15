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

export const generateF0121214PDF = async (data: F0121214Data, language: string = "uk", createCopy: boolean = true) => {
  const doc = new jsPDF()

  // Setup Ukrainian fonts for Cyrillic support
  await setupUkrainianFonts(doc)

  const labels = {
    uk: {
      title: "ПОДАТКОВА ДЕКЛАРАЦІЯ",
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
        trades: "Операції з цінними паперами (18% ПДФО + 5% ВЗ)",
        dividends: "Дивіденди (9% ПДФО + 5% ВЗ)",
      },
    },
    en: {
      title: "TAX DECLARATION",
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
        trades: "Securities transactions (18% PIT + 5% ML)",
        dividends: "Dividends (9% PIT + 5% ML)",
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
      doc.text(t.copyLabel, 180, 15, { align: "right" })
    } else {
      doc.setTextColor(0, 100, 0)
      doc.text(t.originalLabel, 180, 15, { align: "right" })
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
        [`${language === "uk" ? "  - Військовий збір (5%):" : "  - Military levy (5%):"}`, `${(data.calculations.militaryTaxFromTrades || 0).toFixed(2)} UAH`]
      )
    }

    if (data.calculations.dividends !== undefined && data.calculations.dividends > 0) {
      taxData.push(
        [`${language === "uk" ? "Дивіденди отримано:" : "Dividends received:"}`, `${(data.calculations.dividends || 0).toFixed(2)} UAH`],
        [`${language === "uk" ? "  - ПДФО (9%):" : "  - PIT (9%):"}`, `${(data.calculations.pdfoFromDividends || 0).toFixed(2)} UAH`],
        [`${language === "uk" ? "  - Військовий збір (5%):" : "  - Military levy (5%):"}`, `${(data.calculations.militaryTaxFromDividends || 0).toFixed(2)} UAH`]
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

export const generatePIT37PDF = async (data: PIT37Data, language: string = "pl") => {
  const doc = new jsPDF()
  await setupUkrainianFonts(doc)

  const labels = {
    uk: {
      title: "PIT-37 - Податкова декларація",
      subtitle: "Декларація про доходи з праці та інших джерел",
      personalData: "Особисті дані",
      fullName: "ПІБ:",
      pesel: "PESEL:",
      nip: "NIP:",
      birthDate: "Дата народження:",
      address: "Адреса:",
      year: "Звітний рік:",
      income: "Доходи",
      employmentIncome: "Дохід з праці:",
      pensionIncome: "Пенсії та ренти:",
      otherIncome: "Інші доходи:",
      totalIncome: "Загальний дохід:",
      costs: "Витрати",
      employmentCosts: "Витрати з праці:",
      otherCosts: "Інші витрати:",
      totalCosts: "Загальні витрати:",
      contributions: "Внески",
      socialSecurity: "Соціальне страхування:",
      healthInsurance: "Медичне страхування:",
      reliefs: "Податкові пільги",
      children: "Кількість дітей:",
      childRelief: "Пільга на дітей:",
      internetRelief: "Пільга за інтернет:",
      donationsRelief: "Пільга за пожертви:",
      taxBase: "База оподаткування:",
      calculatedTax: "Розрахований податок:",
      additionalInfo: "Додаткова інформація:",
      generatedDate: "Дата формування:",
    },
    en: {
      title: "PIT-37 - Tax Return",
      subtitle: "Income from Employment and Other Sources",
      personalData: "Personal Data",
      fullName: "Full Name:",
      pesel: "PESEL:",
      nip: "NIP:",
      birthDate: "Date of Birth:",
      address: "Address:",
      year: "Tax Year:",
      income: "Income",
      employmentIncome: "Employment Income:",
      pensionIncome: "Pensions and Annuities:",
      otherIncome: "Other Income:",
      totalIncome: "Total Income:",
      costs: "Costs",
      employmentCosts: "Employment Costs:",
      otherCosts: "Other Costs:",
      totalCosts: "Total Costs:",
      contributions: "Contributions",
      socialSecurity: "Social Security:",
      healthInsurance: "Health Insurance:",
      reliefs: "Tax Reliefs",
      children: "Number of Children:",
      childRelief: "Child Relief:",
      internetRelief: "Internet Relief:",
      donationsRelief: "Donations Relief:",
      taxBase: "Tax Base:",
      calculatedTax: "Calculated Tax:",
      additionalInfo: "Additional Information:",
      generatedDate: "Generated Date:",
    },
    pl: {
      title: "PIT-37 - Zeznanie podatkowe",
      subtitle: "Dochody z pracy i innych źródeł",
      personalData: "Dane osobowe",
      fullName: "Imię i nazwisko:",
      pesel: "PESEL:",
      nip: "NIP:",
      birthDate: "Data urodzenia:",
      address: "Adres:",
      year: "Rok podatkowy:",
      income: "Przychody",
      employmentIncome: "Przychody z pracy:",
      pensionIncome: "Emerytury i renty:",
      otherIncome: "Inne przychody:",
      totalIncome: "Suma przychodów:",
      costs: "Koszty",
      employmentCosts: "Koszty z pracy:",
      otherCosts: "Inne koszty:",
      totalCosts: "Suma kosztów:",
      contributions: "Składki",
      socialSecurity: "Ubezpieczenia społeczne:",
      healthInsurance: "Ubezpieczenie zdrowotne:",
      reliefs: "Ulgi podatkowe",
      children: "Liczba dzieci:",
      childRelief: "Ulga na dzieci:",
      internetRelief: "Ulga internetowa:",
      donationsRelief: "Ulga na darowizny:",
      taxBase: "Podstawa opodatkowania:",
      calculatedTax: "Obliczony podatek:",
      additionalInfo: "Informacje dodatkowe:",
      generatedDate: "Data wygenerowania:",
    },
    fr: {
      title: "PIT-37 - Déclaration fiscale",
      subtitle: "Revenus du travail et autres sources",
      personalData: "Données personnelles",
      fullName: "Nom complet:",
      pesel: "PESEL:",
      nip: "NIP:",
      birthDate: "Date de naissance:",
      address: "Adresse:",
      year: "Année fiscale:",
      income: "Revenus",
      employmentIncome: "Revenus du travail:",
      pensionIncome: "Pensions et rentes:",
      otherIncome: "Autres revenus:",
      totalIncome: "Total des revenus:",
      costs: "Frais",
      employmentCosts: "Frais de travail:",
      otherCosts: "Autres frais:",
      totalCosts: "Total des frais:",
      contributions: "Cotisations",
      socialSecurity: "Sécurité sociale:",
      healthInsurance: "Assurance maladie:",
      reliefs: "Allégements fiscaux",
      children: "Nombre d'enfants:",
      childRelief: "Allégement pour enfants:",
      internetRelief: "Allégement internet:",
      donationsRelief: "Allégement pour dons:",
      taxBase: "Base d'imposition:",
      calculatedTax: "Impôt calculé:",
      additionalInfo: "Informations complémentaires:",
      generatedDate: "Date de génération:",
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
  const calculatedTax = taxBase * 0.17 // Simplified 17% tax rate

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

  // Personal Data
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.personalData, 15, yPos)
  yPos += 10

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
    theme: "plain",
    styles: { font: "DejaVuSans", fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Income Section
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.income, 15, yPos)
  yPos += 10

  const incomeData = [
    [t.employmentIncome, `${employmentIncome.toFixed(2)} PLN`],
    [t.pensionIncome, `${pensionIncome.toFixed(2)} PLN`],
    [t.otherIncome, `${otherIncome.toFixed(2)} PLN`],
    [t.totalIncome, `${totalIncome.toFixed(2)} PLN`],
  ]

  autoTable(doc, {
    startY: yPos,
    body: incomeData,
    theme: "plain",
    styles: { font: "DejaVuSans", fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Costs Section
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.costs, 15, yPos)
  yPos += 10

  const costsData = [
    [t.employmentCosts, `${employmentCosts.toFixed(2)} PLN`],
    [t.otherCosts, `${otherCosts.toFixed(2)} PLN`],
    [t.totalCosts, `${totalCosts.toFixed(2)} PLN`],
  ]

  autoTable(doc, {
    startY: yPos,
    body: costsData,
    theme: "plain",
    styles: { font: "DejaVuSans", fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Contributions
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.contributions, 15, yPos)
  yPos += 10

  const contributionsData = [
    [t.socialSecurity, `${socialSecurity.toFixed(2)} PLN`],
    [t.healthInsurance, `${healthInsurance.toFixed(2)} PLN`],
  ]

  autoTable(doc, {
    startY: yPos,
    body: contributionsData,
    theme: "plain",
    styles: { font: "DejaVuSans", fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Tax Reliefs
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.reliefs, 15, yPos)
  yPos += 10

  const reliefsData = [
    [t.children, data.childrenNumber],
    [t.childRelief, `${childRelief.toFixed(2)} PLN`],
    [t.internetRelief, `${internetRelief.toFixed(2)} PLN`],
    [t.donationsRelief, `${donationsRelief.toFixed(2)} PLN`],
  ]

  autoTable(doc, {
    startY: yPos,
    body: reliefsData,
    theme: "plain",
    styles: { font: "DejaVuSans", fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Tax Calculation
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(12)
  doc.setTextColor(220, 38, 38)
  const taxCalcData = [
    [t.taxBase, `${taxBase.toFixed(2)} PLN`],
    [t.calculatedTax, `${calculatedTax.toFixed(2)} PLN`],
  ]

  autoTable(doc, {
    startY: yPos,
    body: taxCalcData,
    theme: "grid",
    styles: { font: "DejaVuSans", fontSize: 11, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { fontStyle: "bold", cellWidth: 120 },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Additional Info
  if (data.additionalInfo) {
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(12)
    doc.setTextColor(0, 102, 204)
    doc.text(t.additionalInfo, 15, yPos)
    yPos += 8

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(10)
    doc.setTextColor(40, 40, 40)
    const lines = doc.splitTextToSize(data.additionalInfo, 180)
    doc.text(lines, 15, yPos)
  }

  // Footer
  doc.setFont("DejaVuSans", "normal")
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(`${t.generatedDate} ${new Date().toLocaleDateString()}`, 105, 285, { align: "center" })

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

export const generatePIT38PDF = async (data: PIT38Data, language: string = "pl") => {
  const doc = new jsPDF()
  await setupUkrainianFonts(doc)

  const labels = {
    uk: {
      title: "PIT-38 - Податкова декларація",
      subtitle: "Декларація про доходи з капіталів",
      personalData: "I. ВІДОМОСТІ ПРО ПЛАТНИКА ПОДАТКУ",
      fullName: "Прізвище, ім'я, по батькові:",
      pesel: "PESEL:",
      nip: "NIP:",
      address: "Адреса:",
      year: "Звітний рік:",
      capitalIncome: "II. ДОХОДИ З КАПІТАЛІВ",
      dividends: "Дивіденди:",
      interest: "Відсотки:",
      stockSales: "Продаж акцій:",
      bonds: "Облігації:",
      otherCapital: "Інші доходи з капіталів:",
      totalIncome: "Загальний дохід:",
      costs: "III. ВИТРАТИ",
      stockCosts: "Витрати на акції:",
      otherCosts: "Інші витрати:",
      losses: "Збитки з минулих років:",
      totalCosts: "Загальні витрати:",
      taxPaid: "IV. СПЛАЧЕНИЙ ПОДАТОК",
      advanceTax: "Авансовий податок:",
      foreignTax: "Податок за кордоном:",
      taxBase: "Податкова база:",
      calculatedTax: "Розрахований податок (19%):",
      taxToPay: "До сплати:",
      additionalInfo: "V. ДОДАТКОВА ІНФОРМАЦІЯ",
      generatedDate: "Дата формування:",
    },
    en: {
      title: "PIT-38 - Tax Return",
      subtitle: "Capital Income",
      personalData: "I. INFORMATION ABOUT THE TAXPAYER",
      fullName: "Full name:",
      pesel: "PESEL:",
      nip: "NIP:",
      address: "Address:",
      year: "Tax Year:",
      capitalIncome: "II. CAPITAL INCOME",
      dividends: "Dividends:",
      interest: "Interest:",
      stockSales: "Stock Sales:",
      bonds: "Bonds:",
      otherCapital: "Other capital income:",
      totalIncome: "Total Income:",
      costs: "III. COSTS",
      stockCosts: "Stock costs:",
      otherCosts: "Other costs:",
      losses: "Previous year losses:",
      totalCosts: "Total Costs:",
      taxPaid: "IV. TAX PAID",
      advanceTax: "Advance Tax:",
      foreignTax: "Foreign Tax:",
      taxBase: "Tax Base:",
      calculatedTax: "Calculated Tax (19%):",
      taxToPay: "Tax to Pay:",
      additionalInfo: "V. ADDITIONAL INFORMATION",
      generatedDate: "Generated Date:",
    },
    pl: {
      title: "PIT-38 - Zeznanie podatkowe",
      subtitle: "Dochody z kapitałów pieniężnych",
      personalData: "I. DANE OSOBOWE",
      fullName: "Imię i nazwisko:",
      pesel: "PESEL:",
      nip: "NIP:",
      address: "Adres:",
      year: "Rok podatkowy:",
      capitalIncome: "II. DOCHODY Z KAPITAŁÓW",
      dividends: "Dywidendy:",
      interest: "Odsetki:",
      stockSales: "Sprzedaż akcji:",
      bonds: "Obligacje:",
      otherCapital: "Inne dochody z kapitałów:",
      totalIncome: "Suma przychodów:",
      costs: "III. KOSZTY",
      stockCosts: "Koszty nabycia akcji:",
      otherCosts: "Inne koszty:",
      losses: "Straty z lat poprzednich:",
      totalCosts: "Suma kosztów:",
      taxPaid: "IV. PODATEK ZAPŁACONY",
      advanceTax: "Zaliczki na podatek:",
      foreignTax: "Podatek za granicą:",
      taxBase: "Podstawa opodatkowania:",
      calculatedTax: "Obliczony podatek (19%):",
      taxToPay: "Do zapłaty:",
      additionalInfo: "V. INFORMACJE DODATKOWE",
      generatedDate: "Data wygenerowania:",
    },
    fr: {
      title: "PIT-38 - Déclaration fiscale",
      subtitle: "Revenus de capitaux",
      personalData: "I. DONNÉES PERSONNELLES",
      fullName: "Nom complet:",
      pesel: "PESEL:",
      nip: "NIP:",
      address: "Adresse:",
      year: "Année fiscale:",
      capitalIncome: "II. REVENUS DE CAPITAUX",
      dividends: "Dividendes:",
      interest: "Intérêts:",
      stockSales: "Vente d'actions:",
      bonds: "Obligations:",
      otherCapital: "Autres revenus de capitaux:",
      totalIncome: "Total des revenus:",
      costs: "III. FRAIS",
      stockCosts: "Frais d'achat d'actions:",
      otherCosts: "Autres frais:",
      losses: "Pertes des années précédentes:",
      totalCosts: "Total des frais:",
      taxPaid: "IV. IMPÔT PAYÉ",
      advanceTax: "Acomptes d'impôt:",
      foreignTax: "Impôt à l'étranger:",
      taxBase: "Base d'imposition:",
      calculatedTax: "Impôt calculé (19%):",
      taxToPay: "À payer:",
      additionalInfo: "V. INFORMATIONS COMPLÉMENTAIRES",
      generatedDate: "Date de génération:",
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
  const calculatedTax = taxBase * 0.19 // 19% flat tax on capital gains
  const taxToPay = Math.max(0, calculatedTax - advanceTax - foreignTax)

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

  // Personal Data
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.personalData, 15, yPos)
  yPos += 10

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
    theme: "plain",
    styles: { font: "DejaVuSans", fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Capital Income Section
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.capitalIncome, 15, yPos)
  yPos += 10

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
    theme: "plain",
    styles: { font: "DejaVuSans", fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Costs Section
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.costs, 15, yPos)
  yPos += 10

  const costsData = [
    [t.stockCosts, `${stockCosts.toFixed(2)} PLN`],
    [t.otherCosts, `${otherCosts.toFixed(2)} PLN`],
    [t.losses, `${losses.toFixed(2)} PLN`],
    [t.totalCosts, `${totalCosts.toFixed(2)} PLN`],
  ]

  autoTable(doc, {
    startY: yPos,
    body: costsData,
    theme: "plain",
    styles: { font: "DejaVuSans", fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Tax Paid Section
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.taxPaid, 15, yPos)
  yPos += 10

  const taxPaidData = [
    [t.advanceTax, `${advanceTax.toFixed(2)} PLN`],
    [t.foreignTax, `${foreignTax.toFixed(2)} PLN`],
  ]

  autoTable(doc, {
    startY: yPos,
    body: taxPaidData,
    theme: "plain",
    styles: { font: "DejaVuSans", fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Tax Calculation
  const taxCalcData = [
    [t.taxBase, `${taxBase.toFixed(2)} PLN`],
    [t.calculatedTax, `${calculatedTax.toFixed(2)} PLN`],
    [t.taxToPay, `${taxToPay.toFixed(2)} PLN`],
  ]

  autoTable(doc, {
    startY: yPos,
    body: taxCalcData,
    theme: "grid",
    styles: { font: "DejaVuSans", fontSize: 11, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { fontStyle: "bold", cellWidth: 120 },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Additional Info
  if (data.additionalInfo && yPos < 250) {
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(12)
    doc.setTextColor(0, 102, 204)
    doc.text(t.additionalInfo, 15, yPos)
    yPos += 8

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(10)
    doc.setTextColor(40, 40, 40)
    const lines = doc.splitTextToSize(data.additionalInfo, 180)
    doc.text(lines, 15, yPos)
  }

  // Footer
  doc.setFont("DejaVuSans", "normal")
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(`${t.generatedDate} ${new Date().toLocaleDateString()}`, 105, 285, { align: "center" })

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

export const generatePIT39PDF = async (data: PIT39Data, language: string = "pl") => {
  const doc = new jsPDF()
  await setupUkrainianFonts(doc)

  const labels = {
    uk: {
      title: "PIT-39 - Податкова декларація",
      subtitle: "Декларація про доходи від відчуження майна",
      personalData: "Особисті дані",
      fullName: "ПІБ:",
      pesel: "PESEL:",
      nip: "NIP:",
      address: "Адреса:",
      year: "Звітний рік:",
      propertySales: "Продаж майна",
      saleNo: "Продаж №",
      type: "Тип:",
      description: "Опис:",
      purchaseDate: "Дата придбання:",
      saleDate: "Дата продажу:",
      purchasePrice: "Ціна придбання:",
      salePrice: "Ціна продажу:",
      improvements: "Витрати на поліпшення:",
      saleCosts: "Витрати на продаж:",
      profit: "Прибуток:",
      loss: "Збиток:",
      summary: "Підсумок",
      totalRevenue: "Загальний дохід:",
      totalCosts: "Загальні витрати:",
      totalProfit: "Загальний прибуток:",
      calculatedTax: "Розрахований податок (19%):",
      typeProperty: "Нерухомість",
      typeStocks: "Акції",
      typeOther: "Інше",
      additionalInfo: "Додаткова інформація:",
      generatedDate: "Дата формування:",
    },
    en: {
      title: "PIT-39 - Tax Return",
      subtitle: "Income from Property Disposal",
      personalData: "Personal Data",
      fullName: "Full Name:",
      pesel: "PESEL:",
      nip: "NIP:",
      address: "Address:",
      year: "Tax Year:",
      propertySales: "Property Sales",
      saleNo: "Sale No.",
      type: "Type:",
      description: "Description:",
      purchaseDate: "Purchase Date:",
      saleDate: "Sale Date:",
      purchasePrice: "Purchase Price:",
      salePrice: "Sale Price:",
      improvements: "Improvements:",
      saleCosts: "Sale Costs:",
      profit: "Profit:",
      loss: "Loss:",
      summary: "Summary",
      totalRevenue: "Total Revenue:",
      totalCosts: "Total Costs:",
      totalProfit: "Total Profit:",
      calculatedTax: "Calculated Tax (19%):",
      typeProperty: "Real Estate",
      typeStocks: "Stocks",
      typeOther: "Other",
      additionalInfo: "Additional Information:",
      generatedDate: "Generated Date:",
    },
    pl: {
      title: "PIT-39 - Zeznanie podatkowe",
      subtitle: "Dochody z odpłatnego zbycia",
      personalData: "Dane osobowe",
      fullName: "Imię i nazwisko:",
      pesel: "PESEL:",
      nip: "NIP:",
      address: "Adres:",
      year: "Rok podatkowy:",
      propertySales: "Sprzedaż majątku",
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
      summary: "Podsumowanie",
      totalRevenue: "Suma przychodów:",
      totalCosts: "Suma kosztów:",
      totalProfit: "Suma zysków:",
      calculatedTax: "Obliczony podatek (19%):",
      typeProperty: "Nieruchomość",
      typeStocks: "Akcje",
      typeOther: "Inne",
      additionalInfo: "Informacje dodatkowe:",
      generatedDate: "Data wygenerowania:",
    },
    fr: {
      title: "PIT-39 - Déclaration fiscale",
      subtitle: "Revenus de cession de biens",
      personalData: "Données personnelles",
      fullName: "Nom complet:",
      pesel: "PESEL:",
      nip: "NIP:",
      address: "Adresse:",
      year: "Année fiscale:",
      propertySales: "Ventes de biens",
      saleNo: "Vente n°",
      type: "Type:",
      description: "Description:",
      purchaseDate: "Date d'achat:",
      saleDate: "Date de vente:",
      purchasePrice: "Prix d'achat:",
      salePrice: "Prix de vente:",
      improvements: "Frais d'amélioration:",
      saleCosts: "Frais de vente:",
      profit: "Profit:",
      loss: "Perte:",
      summary: "Résumé",
      totalRevenue: "Total des revenus:",
      totalCosts: "Total des frais:",
      totalProfit: "Total des profits:",
      calculatedTax: "Impôt calculé (19%):",
      typeProperty: "Immobilier",
      typeStocks: "Actions",
      typeOther: "Autre",
      additionalInfo: "Informations complémentaires:",
      generatedDate: "Date de génération:",
    },
  }

  const t = labels[language as keyof typeof labels] || labels.pl

  const getTypeLabel = (type: string) => {
    if (type === "property") return t.typeProperty
    if (type === "stocks") return t.typeStocks
    return t.typeOther
  }

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

  // Personal Data
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.personalData, 15, yPos)
  yPos += 10

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
    theme: "plain",
    styles: { font: "DejaVuSans", fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Property Sales Section
  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.propertySales, 15, yPos)
  yPos += 10

  let totalRevenue = 0
  let totalCosts = 0
  let totalProfit = 0

  data.propertySales.forEach((sale, index) => {
    const purchasePrice = parseFloat(sale.purchasePrice) || 0
    const salePrice = parseFloat(sale.salePrice) || 0
    const improvements = parseFloat(sale.improvements) || 0
    const saleCosts = parseFloat(sale.saleCosts) || 0

    const totalSaleCosts = purchasePrice + improvements + saleCosts
    const profit = salePrice - totalSaleCosts

    totalRevenue += salePrice
    totalCosts += totalSaleCosts
    totalProfit += profit

    // Check if we need a new page
    if (yPos > 230) {
      doc.addPage()
      yPos = 20
    }

    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(12)
    doc.setTextColor(40, 40, 40)
    doc.text(`${t.saleNo} ${index + 1}`, 15, yPos)
    yPos += 8

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
      theme: "plain",
      styles: { font: "DejaVuSans", fontSize: 9, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: 120 },
      },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10
  })

  // Summary
  if (yPos > 220) {
    doc.addPage()
    yPos = 20
  }

  doc.setFont("DejaVuSans", "bold")
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text(t.summary, 15, yPos)
  yPos += 10

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
    styles: { font: "DejaVuSans", fontSize: 11, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { fontStyle: "bold", cellWidth: 120 },
    },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Additional Info
  if (data.additionalInfo && yPos < 250) {
    doc.setFont("DejaVuSans", "bold")
    doc.setFontSize(12)
    doc.setTextColor(0, 102, 204)
    doc.text(t.additionalInfo, 15, yPos)
    yPos += 8

    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(10)
    doc.setTextColor(40, 40, 40)
    const lines = doc.splitTextToSize(data.additionalInfo, 180)
    doc.text(lines, 15, yPos)
  }

  // Footer on each page
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFont("DejaVuSans", "normal")
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(
      `${t.generatedDate} ${new Date().toLocaleDateString()} | ${t.saleNo.replace("No.", "")} ${i}/${pageCount}`,
      105,
      285,
      { align: "center" }
    )
  }

  window.open(doc.output("bloburl"), "_blank")
}
