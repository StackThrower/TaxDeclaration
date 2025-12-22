import * as XLSX from 'xlsx'

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
}

interface Calculations {
  profit: number
  pdfo: number
  militaryTax: number
  total: number
  profitFromTrades: number
  dividends: number
  pdfoFromTrades: number
  pdfoFromDividends: number
  militaryTaxFromTrades: number
  militaryTaxFromDividends: number
}

interface FormData {
  fullName: string
  taxNumber: string
  year: string
  positions: FinancialPosition[]
  calculations: Calculations
}

export function generateTaxCalculationExcel(formData: FormData, language: string = 'uk') {
  // Create a new workbook
  const wb = XLSX.utils.book_new()

  // Ставка военного сбора: 1.5% для года ≤2024, 5% для года ≥2025
  const reportYear = parseInt(formData.year) || 2025
  const militaryTaxRate = reportYear >= 2025 ? 0.05 : 0.015
  const militaryTaxPercent = (militaryTaxRate * 100).toFixed(1)

  // Translations
  const t = getTranslations(language, militaryTaxPercent)

  // Sheet 1: Summary
  const summaryData = [
    [t.title, '', '', ''],
    ['', '', '', ''],
    [t.personalInfo, '', '', ''],
    [t.fullName, formData.fullName, '', ''],
    [t.taxNumber, formData.taxNumber, '', ''],
    [t.year, formData.year, '', ''],
    ['', '', '', ''],
    [t.taxSummary, '', '', ''],
    [t.profit, formData.calculations.profit.toFixed(2), t.uah, ''],
    [t.pdfo, formData.calculations.pdfo.toFixed(2), t.uah, ''],
    [t.militaryTax, formData.calculations.militaryTax.toFixed(2), t.uah, ''],
    [t.totalTax, formData.calculations.total.toFixed(2), t.uah, ''],
    ['', '', '', ''],
  ]

  // Add breakdown if there are trades and/or dividends
  if (formData.calculations.profitFromTrades !== 0 || formData.calculations.dividends > 0) {
    summaryData.push([t.breakdown, '', '', ''])
    summaryData.push(['', '', '', ''])

    if (formData.calculations.profitFromTrades !== 0) {
      summaryData.push([t.tradesSection, '', '', ''])
      summaryData.push([t.profitFromTrades, formData.calculations.profitFromTrades.toFixed(2), t.uah, ''])
      summaryData.push([t.pdfoFromTrades, formData.calculations.pdfoFromTrades.toFixed(2), t.uah, t.rate18])
      summaryData.push([t.militaryFromTrades, formData.calculations.militaryTaxFromTrades.toFixed(2), t.uah, t.rate5])
      summaryData.push(['', '', '', ''])
    }

    if (formData.calculations.dividends > 0) {
      summaryData.push([t.dividendsSection, '', '', ''])
      summaryData.push([t.totalDividends, formData.calculations.dividends.toFixed(2), t.uah, ''])
      summaryData.push([t.pdfoFromDividends, formData.calculations.pdfoFromDividends.toFixed(2), t.uah, t.rate9])
      summaryData.push([t.militaryFromDividends, formData.calculations.militaryTaxFromDividends.toFixed(2), t.uah, t.rate5])
    }
  }

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData)

  // Set column widths for summary
  wsSummary['!cols'] = [
    { wch: 30 },
    { wch: 20 },
    { wch: 10 },
    { wch: 15 }
  ]

  XLSX.utils.book_append_sheet(wb, wsSummary, t.summarySheet)

  // Sheet 2: Detailed Calculations
  const detailsHeader = [
    [t.detailedCalculations],
    [''],
    [
      '№',
      t.assetType,
      t.description,
      t.currency,
      t.purchaseDate,
      t.saleDate,
      t.purchaseAmountForeign,
      t.purchaseRate,
      t.purchaseAmountUAH,
      t.saleAmountForeign,
      t.saleRate,
      t.saleAmountUAH,
      t.expenses,
      t.profitLoss,
      t.taxRate,
      t.pdfoAmount,
      t.militaryAmount,
      t.totalAmount
    ]
  ]

  const detailsData = formData.positions.map((pos, index) => {
    const purchasePrice = parseFloat(pos.purchasePrice) || 0
    const salePrice = parseFloat(pos.salePrice) || 0
    const expenses = parseFloat(pos.expenses) || 0

    let profit = 0
    let pdfo = 0
    let military = 0
    let total = 0
    let taxRateLabel = ''

    if (pos.assetType === 'dividends') {
      // For dividends: 9% PDFO + military tax (1.5% or 5%)
      profit = salePrice
      pdfo = salePrice * 0.09
      military = salePrice * militaryTaxRate
      total = pdfo + military
      taxRateLabel = `9% + ${militaryTaxPercent}%`
    } else {
      // For trades: 18% PDFO + military tax (1.5% or 5%) (only on profit)
      profit = salePrice - purchasePrice - expenses
      if (profit > 0) {
        pdfo = profit * 0.18
        military = profit * militaryTaxRate
        total = pdfo + military
        taxRateLabel = `18% + ${militaryTaxPercent}%`
      } else {
        taxRateLabel = t.noTax
      }
    }

    return [
      index + 1,
      getAssetTypeLabel(pos.assetType, language),
      pos.assetDescription || '-',
      pos.currency,
      pos.purchaseDate || '-',
      pos.saleDate || '-',
      pos.purchasePriceForeign || '-',
      pos.purchaseRate || '1',
      purchasePrice.toFixed(2),
      pos.salePriceForeign || '-',
      pos.saleRate || '1',
      salePrice.toFixed(2),
      expenses.toFixed(2),
      profit.toFixed(2),
      taxRateLabel,
      pdfo.toFixed(2),
      military.toFixed(2),
      total.toFixed(2)
    ]
  })

  const wsDetails = XLSX.utils.aoa_to_sheet([...detailsHeader, ...detailsData])

  // Set column widths for details
  wsDetails['!cols'] = [
    { wch: 5 },   // №
    { wch: 18 },  // Asset Type
    { wch: 25 },  // Description
    { wch: 8 },   // Currency
    { wch: 12 },  // Purchase Date
    { wch: 12 },  // Sale Date
    { wch: 15 },  // Purchase Amount Foreign
    { wch: 12 },  // Purchase Rate
    { wch: 15 },  // Purchase Amount UAH
    { wch: 15 },  // Sale Amount Foreign
    { wch: 12 },  // Sale Rate
    { wch: 15 },  // Sale Amount UAH
    { wch: 12 },  // Expenses
    { wch: 15 },  // Profit/Loss
    { wch: 12 },  // Tax Rate
    { wch: 12 },  // PDFO
    { wch: 12 },  // Military
    { wch: 12 }   // Total
  ]

  XLSX.utils.book_append_sheet(wb, wsDetails, t.detailsSheet)

  // Sheet 3: Tax Formulas and Calculations
  const formulasData = [
    [t.formulasTitle],
    [''],
    [t.taxRatesTitle],
    [t.pdfoRate, '18%', t.forTrades],
    [t.pdfoRate, '9%', t.forDividends],
    [t.militaryRate, '5%', t.forAll],
    [''],
    [t.calculationMethodTitle],
    [''],
    [t.tradesCalculation],
    [t.step1, t.calculateProfit],
    ['', t.profitFormula],
    [t.step2, t.calculatePdfo],
    ['', t.pdfoTradesFormula],
    [t.step3, t.calculateMilitary],
    ['', t.militaryTradesFormula],
    [''],
    [t.dividendsCalculation],
    [t.step1, t.calculatePdfoDividends],
    ['', t.pdfoDividendsFormula],
    [t.step2, t.calculateMilitaryDividends],
    ['', t.militaryDividendsFormula],
    [''],
    [t.totalCalculation],
    [t.totalFormula],
    [''],
    [t.example],
    [t.exampleTrade],
    [t.purchase, '10000', t.uah],
    [t.sale, '15000', t.uah],
    [t.expenses, '500', t.uah],
    [t.profit, '4500', t.uah, '(15000 - 10000 - 500)'],
    [t.pdfo, '810', t.uah, '(4500 × 18%)'],
    [t.militaryTax, '225', t.uah, '(4500 × 5%)'],
    [t.totalTax, '1035', t.uah, '(810 + 225)'],
  ]

  const wsFormulas = XLSX.utils.aoa_to_sheet(formulasData)

  // Set column widths for formulas
  wsFormulas['!cols'] = [
    { wch: 35 },
    { wch: 20 },
    { wch: 40 }
  ]

  XLSX.utils.book_append_sheet(wb, wsFormulas, t.formulasSheet)

  // Sheet 4: Breakdown by Asset Type
  const assetTypeBreakdown = new Map<string, {
    count: number
    totalPurchase: number
    totalSale: number
    totalExpenses: number
    totalProfit: number
    totalPdfo: number
    totalMilitary: number
    totalTax: number
  }>()

  // Calculate breakdown by asset type
  formData.positions.forEach((pos) => {
    const assetLabel = getAssetTypeLabel(pos.assetType, language)
    if (!assetTypeBreakdown.has(assetLabel)) {
      assetTypeBreakdown.set(assetLabel, {
        count: 0,
        totalPurchase: 0,
        totalSale: 0,
        totalExpenses: 0,
        totalProfit: 0,
        totalPdfo: 0,
        totalMilitary: 0,
        totalTax: 0
      })
    }

    const stats = assetTypeBreakdown.get(assetLabel)!
    const purchasePrice = parseFloat(pos.purchasePrice) || 0
    const salePrice = parseFloat(pos.salePrice) || 0
    const expenses = parseFloat(pos.expenses) || 0

    stats.count++
    stats.totalPurchase += purchasePrice
    stats.totalSale += salePrice
    stats.totalExpenses += expenses

    if (pos.assetType === 'dividends') {
      stats.totalProfit += salePrice
      stats.totalPdfo += salePrice * 0.09
      stats.totalMilitary += salePrice * militaryTaxRate
      stats.totalTax += (salePrice * 0.09) + (salePrice * militaryTaxRate)
    } else {
      const profit = salePrice - purchasePrice - expenses
      stats.totalProfit += profit
      if (profit > 0) {
        stats.totalPdfo += profit * 0.18
        stats.totalMilitary += profit * militaryTaxRate
        stats.totalTax += (profit * 0.18) + (profit * militaryTaxRate)
      }
    }
  })

  const breakdownData = [
    [t.assetTypeBreakdown],
    [''],
    [
      t.assetType,
      t.positionCount,
      t.totalPurchaseAmount,
      t.totalSaleAmount,
      t.totalExpensesAmount,
      t.totalProfitAmount,
      t.pdfoAmount,
      t.militaryAmount,
      t.totalAmount
    ]
  ]

  Array.from(assetTypeBreakdown.entries()).forEach(([assetType, stats]) => {
    breakdownData.push([
      assetType,
      stats.count,
      stats.totalPurchase.toFixed(2),
      stats.totalSale.toFixed(2),
      stats.totalExpenses.toFixed(2),
      stats.totalProfit.toFixed(2),
      stats.totalPdfo.toFixed(2),
      stats.totalMilitary.toFixed(2),
      stats.totalTax.toFixed(2)
    ])
  })

  // Add totals row
  const grandTotals = Array.from(assetTypeBreakdown.values()).reduce((acc, stats) => ({
    count: acc.count + stats.count,
    totalPurchase: acc.totalPurchase + stats.totalPurchase,
    totalSale: acc.totalSale + stats.totalSale,
    totalExpenses: acc.totalExpenses + stats.totalExpenses,
    totalProfit: acc.totalProfit + stats.totalProfit,
    totalPdfo: acc.totalPdfo + stats.totalPdfo,
    totalMilitary: acc.totalMilitary + stats.totalMilitary,
    totalTax: acc.totalTax + stats.totalTax
  }), {
    count: 0,
    totalPurchase: 0,
    totalSale: 0,
    totalExpenses: 0,
    totalProfit: 0,
    totalPdfo: 0,
    totalMilitary: 0,
    totalTax: 0
  })

  breakdownData.push([''])
  breakdownData.push([
    t.total,
    grandTotals.count,
    grandTotals.totalPurchase.toFixed(2),
    grandTotals.totalSale.toFixed(2),
    grandTotals.totalExpenses.toFixed(2),
    grandTotals.totalProfit.toFixed(2),
    grandTotals.totalPdfo.toFixed(2),
    grandTotals.totalMilitary.toFixed(2),
    grandTotals.totalTax.toFixed(2)
  ])

  const wsBreakdown = XLSX.utils.aoa_to_sheet(breakdownData)

  // Set column widths for breakdown
  wsBreakdown['!cols'] = [
    { wch: 20 },  // Asset Type
    { wch: 12 },  // Count
    { wch: 18 },  // Total Purchase
    { wch: 18 },  // Total Sale
    { wch: 18 },  // Total Expenses
    { wch: 18 },  // Total Profit
    { wch: 15 },  // PDFO
    { wch: 15 },  // Military
    { wch: 15 }   // Total
  ]

  XLSX.utils.book_append_sheet(wb, wsBreakdown, t.breakdownSheet)

  // Generate and download the file
  const fileName = `${t.fileName}_${formData.fullName.replace(/\s+/g, '_')}_${formData.year}.xlsx`
  XLSX.writeFile(wb, fileName)
}

function getAssetTypeLabel(assetType: string, language: string): string {
  const labels: Record<string, Record<string, string>> = {
    uk: {
      'stocks': 'Акції',
      'bonds': 'Облігації',
      'options': 'Опціони',
      'futures': 'Ф\'ючерси',
      'crypto': 'Криптовалюта',
      'dividends': 'Дивіденди',
      'other': 'Інше'
    },
    en: {
      'stocks': 'Stocks',
      'bonds': 'Bonds',
      'options': 'Options',
      'futures': 'Futures',
      'crypto': 'Cryptocurrency',
      'dividends': 'Dividends',
      'other': 'Other'
    },
    pl: {
      'stocks': 'Akcje',
      'bonds': 'Obligacje',
      'options': 'Opcje',
      'futures': 'Kontrakty futures',
      'crypto': 'Kryptowaluty',
      'dividends': 'Dywidendy',
      'other': 'Inne'
    },
    de: {
      'stocks': 'Aktien',
      'bonds': 'Anleihen',
      'options': 'Optionen',
      'futures': 'Futures',
      'crypto': 'Kryptowährung',
      'dividends': 'Dividenden',
      'other': 'Sonstiges'
    },
    es: {
      'stocks': 'Acciones',
      'bonds': 'Bonos',
      'options': 'Opciones',
      'futures': 'Futuros',
      'crypto': 'Criptomonedas',
      'dividends': 'Dividendos',
      'other': 'Otro'
    },
    fr: {
      'stocks': 'Actions',
      'bonds': 'Obligations',
      'options': 'Options',
      'futures': 'Contrats à terme',
      'crypto': 'Cryptomonnaie',
      'dividends': 'Dividendes',
      'other': 'Autre'
    },
    pt: {
      'stocks': 'Ações',
      'bonds': 'Títulos',
      'options': 'Opções',
      'futures': 'Futuros',
      'crypto': 'Criptomoeda',
      'dividends': 'Dividendos',
      'other': 'Outro'
    }
  }

  return labels[language]?.[assetType] || labels['en'][assetType] || assetType
}

function getTranslations(language: string, militaryTaxPercent: string = '5') {
  const translations: Record<string, any> = {
    uk: {
      title: 'Розрахунок податкових зобов\'язань (Додаток Ф1 / F0121214)',
      personalInfo: 'Персональна інформація',
      fullName: 'ПІБ',
      taxNumber: 'ІПН',
      year: 'Рік',
      taxSummary: 'Підсумок податків',
      profit: 'Прибуток/Збиток',
      pdfo: 'ПДФО',
      militaryTax: 'Військовий збір',
      totalTax: 'Всього до сплати',
      uah: 'грн',
      breakdown: 'Деталізація розрахунків',
      tradesSection: 'Трейди (Акції, Опціони, Облігації)',
      profitFromTrades: 'Прибуток/Збиток від трейдів',
      pdfoFromTrades: 'ПДФО від трейдів',
      militaryFromTrades: 'Військовий збір від трейдів',
      dividendsSection: 'Дивіденди',
      totalDividends: 'Всього дивідендів',
      pdfoFromDividends: 'ПДФО від дивідендів',
      militaryFromDividends: 'Військовий збір від дивідендів',
      rate18: '(18%)',
      rate9: '(9%)',
      rate5: `(${militaryTaxPercent}%)`,
      summarySheet: 'Підсумок',
      detailedCalculations: 'Детальні розрахунки по кожній позиції',
      assetType: 'Тип активу',
      description: 'Опис',
      currency: 'Валюта',
      purchaseDate: 'Дата купівлі',
      saleDate: 'Дата продажу',
      purchaseAmountForeign: 'Купівля (валюта)',
      purchaseRate: 'Курс купівлі',
      purchaseAmountUAH: 'Купівля (грн)',
      saleAmountForeign: 'Продаж (валюта)',
      saleRate: 'Курс продажу',
      saleAmountUAH: 'Продаж (грн)',
      expenses: 'Витрати',
      profitLoss: 'Прибуток/Збиток',
      taxRate: 'Ставка податку',
      noTax: 'Немає податку (збиток)',
      pdfoAmount: 'ПДФО',
      militaryAmount: 'Військ. збір',
      totalAmount: 'Всього',
      detailsSheet: 'Детальні розрахунки',
      formulasTitle: 'Формули розрахунку податків',
      taxRatesTitle: 'Ставки податків:',
      pdfoRate: 'ПДФО',
      militaryRate: 'Військовий збір',
      forTrades: 'Для трейдів',
      forDividends: 'Для дивідендів',
      forAll: 'Для всіх доходів',
      calculationMethodTitle: 'Методика розрахунку:',
      tradesCalculation: 'Для трейдів (акції, опціони, облігації):',
      step1: 'Крок 1:',
      step2: 'Крок 2:',
      step3: 'Крок 3:',
      calculateProfit: 'Розрахунок прибутку/збитку',
      profitFormula: 'Прибуток = Продаж - Купівля - Витрати',
      calculatePdfo: 'Розрахунок ПДФО',
      pdfoTradesFormula: 'ПДФО = Прибуток × 18% (якщо прибуток > 0)',
      calculateMilitary: 'Розрахунок військового збору',
      militaryTradesFormula: `Військовий збір = Прибуток × ${militaryTaxPercent}% (якщо прибуток > 0)`,
      dividendsCalculation: 'Для дивідендів:',
      calculatePdfoDividends: 'Розрахунок ПДФО (знижена ставка)',
      pdfoDividendsFormula: 'ПДФО = Дивіденди × 9%',
      calculateMilitaryDividends: 'Розрахунок військового збору',
      militaryDividendsFormula: `Військовий збір = Дивіденди × ${militaryTaxPercent}%`,
      totalCalculation: 'Загальна сума податків:',
      totalFormula: 'Всього = ПДФО + Військовий збір',
      example: 'Приклад розрахунку:',
      exampleTrade: 'Трейд з акціями:',
      purchase: 'Купівля',
      sale: 'Продаж',
      formulasSheet: 'Формули та приклади',
      fileName: 'Розрахунок_податків',
      assetTypeBreakdown: 'Розбивка по типах активів',
      positionCount: 'Кількість позицій',
      totalPurchaseAmount: 'Сума купівлі (грн)',
      totalSaleAmount: 'Сума продажу (грн)',
      totalExpensesAmount: 'Витрати (грн)',
      totalProfitAmount: 'Прибуток (грн)',
      breakdownSheet: 'По типах активів'
    },
    en: {
      title: 'Tax Obligations Calculation (Appendix F1 / F0121214)',
      personalInfo: 'Personal Information',
      fullName: 'Full Name',
      taxNumber: 'Tax ID',
      year: 'Year',
      taxSummary: 'Tax Summary',
      profit: 'Profit/Loss',
      pdfo: 'Personal Income Tax',
      militaryTax: 'Military Levy',
      totalTax: 'Total Due',
      uah: 'UAH',
      breakdown: 'Calculation Breakdown',
      tradesSection: 'Trades (Stocks, Options, Bonds)',
      profitFromTrades: 'Profit/Loss from Trades',
      pdfoFromTrades: 'PIT from Trades',
      militaryFromTrades: 'Military Levy from Trades',
      dividendsSection: 'Dividends',
      totalDividends: 'Total Dividends',
      pdfoFromDividends: 'PIT from Dividends',
      militaryFromDividends: 'Military Levy from Dividends',
      rate18: '(18%)',
      rate9: '(9%)',
      rate5: `(${militaryTaxPercent}%)`,
      summarySheet: 'Summary',
      detailedCalculations: 'Detailed Calculations for Each Position',
      assetType: 'Asset Type',
      description: 'Description',
      currency: 'Currency',
      purchaseDate: 'Purchase Date',
      saleDate: 'Sale Date',
      purchaseAmountForeign: 'Purchase (foreign)',
      purchaseRate: 'Purchase Rate',
      purchaseAmountUAH: 'Purchase (UAH)',
      saleAmountForeign: 'Sale (foreign)',
      saleRate: 'Sale Rate',
      saleAmountUAH: 'Sale (UAH)',
      expenses: 'Expenses',
      profitLoss: 'Profit/Loss',
      taxRate: 'Tax Rate',
      noTax: 'No Tax (Loss)',
      pdfoAmount: 'PIT',
      militaryAmount: 'Military Levy',
      totalAmount: 'Total',
      detailsSheet: 'Detailed Calculations',
      formulasTitle: 'Tax Calculation Formulas',
      taxRatesTitle: 'Tax Rates:',
      pdfoRate: 'Personal Income Tax',
      militaryRate: 'Military Levy',
      forTrades: 'For Trades',
      forDividends: 'For Dividends',
      forAll: 'For All Income',
      calculationMethodTitle: 'Calculation Method:',
      tradesCalculation: 'For trades (stocks, options, bonds):',
      step1: 'Step 1:',
      step2: 'Step 2:',
      step3: 'Step 3:',
      calculateProfit: 'Calculate Profit/Loss',
      profitFormula: 'Profit = Sale - Purchase - Expenses',
      calculatePdfo: 'Calculate Personal Income Tax',
      pdfoTradesFormula: 'PIT = Profit × 18% (if profit > 0)',
      calculateMilitary: 'Calculate Military Levy',
      militaryTradesFormula: `Military Levy = Profit × ${militaryTaxPercent}% (if profit > 0)`,
      dividendsCalculation: 'For dividends:',
      calculatePdfoDividends: 'Calculate PIT (reduced rate)',
      pdfoDividendsFormula: 'PIT = Dividends × 9%',
      calculateMilitaryDividends: 'Calculate Military Levy',
      militaryDividendsFormula: `Military Levy = Dividends × ${militaryTaxPercent}%`,
      totalCalculation: 'Total Tax Amount:',
      totalFormula: 'Total = PIT + Military Levy',
      example: 'Calculation Example:',
      exampleTrade: 'Stock Trade:',
      purchase: 'Purchase',
      sale: 'Sale',
      formulasSheet: 'Formulas and Examples',
      fileName: 'Tax_Calculation',
      assetTypeBreakdown: 'Breakdown by Asset Type',
      positionCount: 'Number of Positions',
      totalPurchaseAmount: 'Purchase Amount (UAH)',
      totalSaleAmount: 'Sale Amount (UAH)',
      totalExpensesAmount: 'Expenses (UAH)',
      totalProfitAmount: 'Profit (UAH)',
      breakdownSheet: 'By Asset Type'
    },
    pl: {
      title: 'Obliczenie zobowiązań podatkowych (Załącznik Ф1 / F0121214)',
      personalInfo: 'Informacje osobiste',
      fullName: 'Imię i nazwisko',
      taxNumber: 'NIP',
      year: 'Rok',
      taxSummary: 'Podsumowanie podatków',
      profit: 'Zysk/Strata',
      pdfo: 'Podatek dochodowy',
      militaryTax: 'Opłata wojskowa',
      totalTax: 'Razem do zapłaty',
      uah: 'UAH',
      breakdown: 'Szczegóły obliczeń',
      tradesSection: 'Transakcje (Akcje, Opcje, Obligacje)',
      profitFromTrades: 'Zysk/Strata z transakcji',
      pdfoFromTrades: 'Podatek z transakcji',
      militaryFromTrades: 'Opłata wojskowa z transakcji',
      dividendsSection: 'Dywidendy',
      totalDividends: 'Łącznie dywidend',
      pdfoFromDividends: 'Podatek z dywidend',
      militaryFromDividends: 'Opłata wojskowa z dywidend',
      rate18: '(18%)',
      rate9: '(9%)',
      rate5: `(${militaryTaxPercent}%)`,
      summarySheet: 'Podsumowanie',
      detailedCalculations: 'Szczegółowe obliczenia dla każdej pozycji',
      assetType: 'Typ aktywa',
      description: 'Opis',
      currency: 'Waluta',
      purchaseDate: 'Data zakupu',
      saleDate: 'Data sprzedaży',
      purchaseAmountForeign: 'Zakup (waluta obca)',
      purchaseRate: 'Kurs zakupu',
      purchaseAmountUAH: 'Zakup (UAH)',
      saleAmountForeign: 'Sprzedaż (waluta obca)',
      saleRate: 'Kurs sprzedaży',
      saleAmountUAH: 'Sprzedaż (UAH)',
      expenses: 'Wydatki',
      profitLoss: 'Zysk/Strata',
      taxRate: 'Stawka podatkowa',
      noTax: 'Brak podatku (strata)',
      pdfoAmount: 'Podatek',
      militaryAmount: 'Opł. wojskowa',
      totalAmount: 'Razem',
      detailsSheet: 'Szczegółowe obliczenia',
      formulasTitle: 'Formuły obliczania podatków',
      taxRatesTitle: 'Stawki podatkowe:',
      pdfoRate: 'Podatek dochodowy',
      militaryRate: 'Opłata wojskowa',
      forTrades: 'Dla transakcji',
      forDividends: 'Dla dywidend',
      forAll: 'Dla wszystkich dochodów',
      calculationMethodTitle: 'Metodyka obliczeń:',
      tradesCalculation: 'Dla transakcji (akcje, opcje, obligacje):',
      step1: 'Krok 1:',
      step2: 'Krok 2:',
      step3: 'Krok 3:',
      calculateProfit: 'Obliczenie zysku/straty',
      profitFormula: 'Zysk = Sprzedaż - Zakup - Wydatki',
      calculatePdfo: 'Obliczenie podatku dochodowego',
      pdfoTradesFormula: 'Podatek = Zysk × 18% (jeśli zysk > 0)',
      calculateMilitary: 'Obliczenie opłaty wojskowej',
      militaryTradesFormula: `Opłata wojskowa = Zysk × ${militaryTaxPercent}% (jeśli zysk > 0)`,
      dividendsCalculation: 'Dla dywidend:',
      calculatePdfoDividends: 'Obliczenie podatku (obniżona stawka)',
      pdfoDividendsFormula: 'Podatek = Dywidendy × 9%',
      calculateMilitaryDividends: 'Obliczenie opłaty wojskowej',
      militaryDividendsFormula: `Opłata wojskowa = Dywidendy × ${militaryTaxPercent}%`,
      totalCalculation: 'Łączna kwota podatków:',
      totalFormula: 'Razem = Podatek + Opłata wojskowa',
      example: 'Przykład obliczenia:',
      exampleTrade: 'Transakcja akcjami:',
      purchase: 'Zakup',
      sale: 'Sprzedaż',
      formulasSheet: 'Formuły i przykłady',
      fileName: 'Obliczenie_podatkow',
      assetTypeBreakdown: 'Podział według typu aktywów',
      positionCount: 'Liczba pozycji',
      totalPurchaseAmount: 'Kwota zakupu (UAH)',
      totalSaleAmount: 'Kwota sprzedaży (UAH)',
      totalExpensesAmount: 'Wydatki (UAH)',
      totalProfitAmount: 'Zysk (UAH)',
      breakdownSheet: 'Według typu aktywów'
    }
  }

  return translations[language] || translations['en']
}

// PIT-39 Excel Generation
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

interface PIT39FormData {
  firstName: string
  lastName: string
  pesel: string
  nip: string
  address: string
  city: string
  postalCode: string
  year: string
  additionalInfo: string
  propertySales: PropertySale[]
}

export function generatePIT39Excel(formData: PIT39FormData, language: string = 'pl') {
  // Create a new workbook
  const wb = XLSX.utils.book_new()

  // Translations
  const t = getPIT39Translations(language)

  // Calculate totals
  let totalPurchasePricePLN = 0
  let totalSalePricePLN = 0
  let totalImprovements = 0
  let totalSaleCosts = 0
  let totalIncome = 0
  let totalTax = 0

  formData.propertySales.forEach(sale => {
    const purchasePrice = parseFloat(sale.purchasePrice) || 0
    const salePrice = parseFloat(sale.salePrice) || 0
    const improvements = parseFloat(sale.improvements) || 0
    const saleCosts = parseFloat(sale.saleCosts) || 0

    const income = salePrice - purchasePrice - improvements - saleCosts
    const tax = income > 0 ? income * 0.19 : 0

    totalPurchasePricePLN += purchasePrice
    totalSalePricePLN += salePrice
    totalImprovements += improvements
    totalSaleCosts += saleCosts
    totalIncome += income > 0 ? income : 0
    totalTax += tax
  })

  // Sheet 1: Summary
  const summaryData = [
    [t.title, '', '', ''],
    ['', '', '', ''],
    [t.personalInfo, '', '', ''],
    [t.fullName, `${formData.firstName} ${formData.lastName}`, '', ''],
    [t.pesel, formData.pesel, '', ''],
    [t.nip, formData.nip, '', ''],
    [t.address, formData.address, '', ''],
    [t.city, formData.city, '', ''],
    [t.postalCode, formData.postalCode, '', ''],
    [t.year, formData.year, '', ''],
    ['', '', '', ''],
    [t.taxSummary, '', '', ''],
    [t.totalPurchasePrice, totalPurchasePricePLN.toFixed(2), t.pln, ''],
    [t.totalSalePrice, totalSalePricePLN.toFixed(2), t.pln, ''],
    [t.totalImprovements, totalImprovements.toFixed(2), t.pln, ''],
    [t.totalSaleCosts, totalSaleCosts.toFixed(2), t.pln, ''],
    [t.totalIncome, totalIncome.toFixed(2), t.pln, ''],
    [t.totalTax, totalTax.toFixed(2), t.pln, t.taxRate],
    ['', '', '', ''],
  ]

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData)

  // Set column widths for summary
  wsSummary['!cols'] = [
    { wch: 30 },
    { wch: 25 },
    { wch: 10 },
    { wch: 15 }
  ]

  XLSX.utils.book_append_sheet(wb, wsSummary, t.summarySheet)

  // Sheet 2: Detailed Calculations
  const detailsHeader = [
    [t.detailedCalculations],
    [''],
    [
      '№',
      t.propertyType,
      t.description,
      t.currency,
      t.purchaseDate,
      t.saleDate,
      t.purchasePriceForeign,
      t.purchaseRate,
      t.purchasePricePLN,
      t.salePriceForeign,
      t.saleRate,
      t.salePricePLN,
      t.improvements,
      t.saleCosts,
      t.totalCosts,
      t.income,
      t.tax
    ]
  ]

  const detailsData = formData.propertySales.map((sale, index) => {
    const purchasePrice = parseFloat(sale.purchasePrice) || 0
    const salePrice = parseFloat(sale.salePrice) || 0
    const improvements = parseFloat(sale.improvements) || 0
    const saleCosts = parseFloat(sale.saleCosts) || 0
    const purchasePriceForeign = parseFloat(sale.purchasePriceForeign) || 0
    const salePriceForeign = parseFloat(sale.salePriceForeign) || 0
    const purchaseRate = parseFloat(sale.purchaseRate) || 1
    const saleRate = parseFloat(sale.saleRate) || 1

    const totalCosts = purchasePrice + improvements + saleCosts
    const income = salePrice - totalCosts
    const tax = income > 0 ? income * 0.19 : 0

    const typeLabel = getPropertyTypeLabel(sale.type, language)

    return [
      index + 1,
      typeLabel,
      sale.description,
      sale.currency,
      sale.purchaseDate,
      sale.saleDate,
      purchasePriceForeign.toFixed(2),
      purchaseRate.toFixed(4),
      purchasePrice.toFixed(2),
      salePriceForeign.toFixed(2),
      saleRate.toFixed(4),
      salePrice.toFixed(2),
      improvements.toFixed(2),
      saleCosts.toFixed(2),
      totalCosts.toFixed(2),
      income.toFixed(2),
      tax.toFixed(2)
    ]
  })

  const allDetailsData = [...detailsHeader, ...detailsData]

  // Add totals row
  allDetailsData.push([''])
  allDetailsData.push([
    '',
    t.total,
    '',
    '',
    '',
    '',
    '',
    '',
    totalPurchasePricePLN.toFixed(2),
    '',
    '',
    totalSalePricePLN.toFixed(2),
    totalImprovements.toFixed(2),
    totalSaleCosts.toFixed(2),
    (totalPurchasePricePLN + totalImprovements + totalSaleCosts).toFixed(2),
    totalIncome.toFixed(2),
    totalTax.toFixed(2)
  ])

  const wsDetails = XLSX.utils.aoa_to_sheet(allDetailsData)

  // Set column widths for details
  wsDetails['!cols'] = [
    { wch: 5 },   // №
    { wch: 15 },  // Property Type
    { wch: 30 },  // Description
    { wch: 10 },  // Currency
    { wch: 12 },  // Purchase Date
    { wch: 12 },  // Sale Date
    { wch: 18 },  // Purchase Price Foreign
    { wch: 12 },  // Purchase Rate
    { wch: 18 },  // Purchase Price PLN
    { wch: 18 },  // Sale Price Foreign
    { wch: 12 },  // Sale Rate
    { wch: 18 },  // Sale Price PLN
    { wch: 15 },  // Improvements
    { wch: 15 },  // Sale Costs
    { wch: 15 },  // Total Costs
    { wch: 15 },  // Income
    { wch: 15 }   // Tax
  ]

  XLSX.utils.book_append_sheet(wb, wsDetails, t.detailsSheet)

  // Sheet 3: Tax Formulas and Information
  const formulasData = [
    [t.formulasTitle],
    [''],
    [t.taxInfo],
    [t.taxRateInfo, '19%'],
    [''],
    [t.calculationMethodTitle],
    [''],
    [t.step1, t.calculateIncome],
    ['', t.incomeFormula],
    [t.step2, t.calculateTax],
    ['', t.taxFormula],
    [''],
    [t.example],
    [t.purchasePrice, '300,000', t.pln],
    [t.salePrice, '500,000', t.pln],
    [t.improvements, '50,000', t.pln],
    [t.saleCosts, '10,000', t.pln],
    [t.totalCosts, '360,000', t.pln, '(300,000 + 50,000 + 10,000)'],
    [t.income, '140,000', t.pln, '(500,000 - 360,000)'],
    [t.tax, '26,600', t.pln, '(140,000 × 19%)'],
    [''],
    [t.note],
    [t.noteText]
  ]

  const wsFormulas = XLSX.utils.aoa_to_sheet(formulasData)

  // Set column widths for formulas
  wsFormulas['!cols'] = [
    { wch: 35 },
    { wch: 20 },
    { wch: 10 },
    { wch: 40 }
  ]

  XLSX.utils.book_append_sheet(wb, wsFormulas, t.formulasSheet)

  // Sheet 4: Breakdown by Property Type
  const typeBreakdown = new Map<string, {
    count: number
    totalPurchase: number
    totalSale: number
    totalImprovements: number
    totalSaleCosts: number
    totalIncome: number
    totalTax: number
  }>()

  // Calculate breakdown by property type
  formData.propertySales.forEach((sale) => {
    const typeLabel = getPropertyTypeLabel(sale.type, language)
    if (!typeBreakdown.has(typeLabel)) {
      typeBreakdown.set(typeLabel, {
        count: 0,
        totalPurchase: 0,
        totalSale: 0,
        totalImprovements: 0,
        totalSaleCosts: 0,
        totalIncome: 0,
        totalTax: 0
      })
    }

    const stats = typeBreakdown.get(typeLabel)!
    const purchasePrice = parseFloat(sale.purchasePrice) || 0
    const salePrice = parseFloat(sale.salePrice) || 0
    const improvements = parseFloat(sale.improvements) || 0
    const saleCosts = parseFloat(sale.saleCosts) || 0

    stats.count++
    stats.totalPurchase += purchasePrice
    stats.totalSale += salePrice
    stats.totalImprovements += improvements
    stats.totalSaleCosts += saleCosts

    const income = salePrice - purchasePrice - improvements - saleCosts
    if (income > 0) {
      stats.totalIncome += income
      stats.totalTax += income * 0.19
    }
  })

  const breakdownData = [
    [t.propertyTypeBreakdown],
    [''],
    [
      t.propertyType,
      t.positionCount,
      t.totalPurchasePrice,
      t.totalSalePrice,
      t.totalImprovements,
      t.totalSaleCosts,
      t.totalIncome,
      t.totalTax
    ]
  ]

  Array.from(typeBreakdown.entries()).forEach(([propertyType, stats]) => {
    breakdownData.push([
      propertyType,
      stats.count,
      stats.totalPurchase.toFixed(2),
      stats.totalSale.toFixed(2),
      stats.totalImprovements.toFixed(2),
      stats.totalSaleCosts.toFixed(2),
      stats.totalIncome.toFixed(2),
      stats.totalTax.toFixed(2)
    ])
  })

  // Add totals row
  const grandTotals = Array.from(typeBreakdown.values()).reduce((acc, stats) => ({
    count: acc.count + stats.count,
    totalPurchase: acc.totalPurchase + stats.totalPurchase,
    totalSale: acc.totalSale + stats.totalSale,
    totalImprovements: acc.totalImprovements + stats.totalImprovements,
    totalSaleCosts: acc.totalSaleCosts + stats.totalSaleCosts,
    totalIncome: acc.totalIncome + stats.totalIncome,
    totalTax: acc.totalTax + stats.totalTax
  }), {
    count: 0,
    totalPurchase: 0,
    totalSale: 0,
    totalImprovements: 0,
    totalSaleCosts: 0,
    totalIncome: 0,
    totalTax: 0
  })

  breakdownData.push([''])
  breakdownData.push([
    t.total,
    grandTotals.count,
    grandTotals.totalPurchase.toFixed(2),
    grandTotals.totalSale.toFixed(2),
    grandTotals.totalImprovements.toFixed(2),
    grandTotals.totalSaleCosts.toFixed(2),
    grandTotals.totalIncome.toFixed(2),
    grandTotals.totalTax.toFixed(2)
  ])

  const wsBreakdown = XLSX.utils.aoa_to_sheet(breakdownData)

  // Set column widths for breakdown
  wsBreakdown['!cols'] = [
    { wch: 20 },  // Property Type
    { wch: 12 },  // Count
    { wch: 18 },  // Total Purchase
    { wch: 18 },  // Total Sale
    { wch: 18 },  // Total Improvements
    { wch: 18 },  // Total Sale Costs
    { wch: 18 },  // Total Income
    { wch: 15 }   // Total Tax
  ]

  XLSX.utils.book_append_sheet(wb, wsBreakdown, t.breakdownSheet)

  // Generate and download the file
  const fileName = `PIT-39_${formData.firstName}_${formData.lastName}_${formData.year}.xlsx`
  XLSX.writeFile(wb, fileName)
}

function getPropertyTypeLabel(propertyType: string, language: string): string {
  const labels: Record<string, Record<string, string>> = {
    uk: {
      'property': 'Нерухомість',
      'stocks': 'Акції',
      'other': 'Інше'
    },
    en: {
      'property': 'Real Estate',
      'stocks': 'Stocks',
      'other': 'Other'
    },
    pl: {
      'property': 'Nieruchomość',
      'stocks': 'Akcje',
      'other': 'Inne'
    },
    fr: {
      'property': 'Immobilier',
      'stocks': 'Actions',
      'other': 'Autre'
    }
  }

  return labels[language]?.[propertyType] || labels['pl'][propertyType] || propertyType
}

function getPIT39Translations(language: string) {
  const translations: Record<string, any> = {
    uk: {
      title: 'PIT-39 - Декларація про доходи від відчуження майна',
      personalInfo: 'Особисті дані',
      fullName: 'ПІБ',
      pesel: 'PESEL',
      nip: 'NIP',
      address: 'Адреса',
      city: 'Місто',
      postalCode: 'Поштовий індекс',
      year: 'Звітний рік',
      taxSummary: 'Податковий підсумок',
      totalPurchasePrice: 'Загальна ціна придбання',
      totalSalePrice: 'Загальна ціна продажу',
      totalImprovements: 'Загальні витрати на поліпшення',
      totalSaleCosts: 'Загальні витрати на продаж',
      totalIncome: 'Загальний дохід',
      totalTax: 'Загальний податок',
      taxRate: '(19%)',
      pln: 'PLN',
      summarySheet: 'Підсумок',
      detailedCalculations: 'Детальні розрахунки по кожній позиції',
      propertyType: 'Тип майна',
      description: 'Опис',
      currency: 'Валюта',
      purchaseDate: 'Дата придбання',
      saleDate: 'Дата продажу',
      purchasePriceForeign: 'Ціна придбання (валюта)',
      purchaseRate: 'Курс NBP (придбання)',
      purchasePricePLN: 'Ціна придбання (PLN)',
      salePriceForeign: 'Ціна продажу (валюта)',
      saleRate: 'Курс NBP (продаж)',
      salePricePLN: 'Ціна продажу (PLN)',
      improvements: 'Поліпшення',
      saleCosts: 'Витрати на продаж',
      totalCosts: 'Загальні витрати',
      income: 'Дохід',
      tax: 'Податок (19%)',
      total: 'Всього',
      detailsSheet: 'Детальні розрахунки',
      formulasTitle: 'Формули розрахунку податку',
      taxInfo: 'Інформація про податок:',
      taxRateInfo: 'Ставка податку від продажу майна',
      calculationMethodTitle: 'Методика розрахунку:',
      step1: 'Крок 1:',
      step2: 'Крок 2:',
      calculateIncome: 'Розрахунок доходу',
      incomeFormula: 'Дохід = Ціна продажу - Ціна придбання - Поліпшення - Витрати на продаж',
      calculateTax: 'Розрахунок податку',
      taxFormula: 'Податок = Дохід × 19% (якщо дохід > 0)',
      example: 'Приклад розрахунку:',
      purchasePrice: 'Ціна придбання',
      salePrice: 'Ціна продажу',
      note: 'Примітка:',
      noteText: 'Податок PIT-39 сплачується тільки при додатному доході. Збитки не зменшують податкову базу.',
      formulasSheet: 'Формули',
      propertyTypeBreakdown: 'Розбивка по типах майна',
      positionCount: 'Кількість позицій',
      breakdownSheet: 'По типах майна',
      fileName: 'PIT-39'
    },
    en: {
      title: 'PIT-39 - Tax Return for Income from Property Disposal',
      personalInfo: 'Personal Information',
      fullName: 'Full Name',
      pesel: 'PESEL',
      nip: 'NIP',
      address: 'Address',
      city: 'City',
      postalCode: 'Postal Code',
      year: 'Tax Year',
      taxSummary: 'Tax Summary',
      totalPurchasePrice: 'Total Purchase Price',
      totalSalePrice: 'Total Sale Price',
      totalImprovements: 'Total Improvements',
      totalSaleCosts: 'Total Sale Costs',
      totalIncome: 'Total Income',
      totalTax: 'Total Tax',
      taxRate: '(19%)',
      pln: 'PLN',
      summarySheet: 'Summary',
      detailedCalculations: 'Detailed Calculations for Each Position',
      propertyType: 'Property Type',
      description: 'Description',
      currency: 'Currency',
      purchaseDate: 'Purchase Date',
      saleDate: 'Sale Date',
      purchasePriceForeign: 'Purchase Price (foreign)',
      purchaseRate: 'NBP Rate (purchase)',
      purchasePricePLN: 'Purchase Price (PLN)',
      salePriceForeign: 'Sale Price (foreign)',
      saleRate: 'NBP Rate (sale)',
      salePricePLN: 'Sale Price (PLN)',
      improvements: 'Improvements',
      saleCosts: 'Sale Costs',
      totalCosts: 'Total Costs',
      income: 'Income',
      tax: 'Tax (19%)',
      total: 'Total',
      detailsSheet: 'Detailed Calculations',
      formulasTitle: 'Tax Calculation Formulas',
      taxInfo: 'Tax Information:',
      taxRateInfo: 'Tax rate on property disposal',
      calculationMethodTitle: 'Calculation Method:',
      step1: 'Step 1:',
      step2: 'Step 2:',
      calculateIncome: 'Calculate Income',
      incomeFormula: 'Income = Sale Price - Purchase Price - Improvements - Sale Costs',
      calculateTax: 'Calculate Tax',
      taxFormula: 'Tax = Income × 19% (if income > 0)',
      example: 'Calculation Example:',
      purchasePrice: 'Purchase Price',
      salePrice: 'Sale Price',
      note: 'Note:',
      noteText: 'PIT-39 tax is only paid on positive income. Losses do not reduce the tax base.',
      formulasSheet: 'Formulas',
      propertyTypeBreakdown: 'Breakdown by Property Type',
      positionCount: 'Number of Positions',
      breakdownSheet: 'By Property Type',
      fileName: 'PIT-39'
    },
    pl: {
      title: 'PIT-39 - Zeznanie o dochodach z odpłatnego zbycia',
      personalInfo: 'Dane osobowe',
      fullName: 'Imię i nazwisko',
      pesel: 'PESEL',
      nip: 'NIP',
      address: 'Adres',
      city: 'Miejscowość',
      postalCode: 'Kod pocztowy',
      year: 'Rok podatkowy',
      taxSummary: 'Podsumowanie podatkowe',
      totalPurchasePrice: 'Łączna cena nabycia',
      totalSalePrice: 'Łączna cena sprzedaży',
      totalImprovements: 'Łączne wydatki na ulepszenie',
      totalSaleCosts: 'Łączne koszty sprzedaży',
      totalIncome: 'Łączny dochód',
      totalTax: 'Łączny podatek',
      taxRate: '(19%)',
      pln: 'PLN',
      summarySheet: 'Podsumowanie',
      detailedCalculations: 'Szczegółowe obliczenia dla każdej pozycji',
      propertyType: 'Rodzaj majątku',
      description: 'Opis',
      currency: 'Waluta',
      purchaseDate: 'Data nabycia',
      saleDate: 'Data sprzedaży',
      purchasePriceForeign: 'Cena nabycia (waluta)',
      purchaseRate: 'Kurs NBP (nabycie)',
      purchasePricePLN: 'Cena nabycia (PLN)',
      salePriceForeign: 'Cena sprzedaży (waluta)',
      saleRate: 'Kurs NBP (sprzedaż)',
      salePricePLN: 'Cena sprzedaży (PLN)',
      improvements: 'Ulepszenia',
      saleCosts: 'Koszty sprzedaży',
      totalCosts: 'Koszty łącznie',
      income: 'Dochód',
      tax: 'Podatek (19%)',
      total: 'Razem',
      detailsSheet: 'Szczegółowe obliczenia',
      formulasTitle: 'Formuły obliczania podatku',
      taxInfo: 'Informacje o podatku:',
      taxRateInfo: 'Stawka podatku od sprzedaży majątku',
      calculationMethodTitle: 'Metodyka obliczeń:',
      step1: 'Krok 1:',
      step2: 'Krok 2:',
      calculateIncome: 'Obliczenie dochodu',
      incomeFormula: 'Dochód = Cena sprzedaży - Cena nabycia - Ulepszenia - Koszty sprzedaży',
      calculateTax: 'Obliczenie podatku',
      taxFormula: 'Podatek = Dochód × 19% (jeśli dochód > 0)',
      example: 'Przykład obliczenia:',
      purchasePrice: 'Cena nabycia',
      salePrice: 'Cena sprzedaży',
      note: 'Uwaga:',
      noteText: 'Podatek PIT-39 płacony jest tylko od dodatniego dochodu. Straty nie pomniejszają podstawy opodatkowania.',
      formulasSheet: 'Formuły',
      propertyTypeBreakdown: 'Podział według rodzaju majątku',
      positionCount: 'Liczba pozycji',
      breakdownSheet: 'Według rodzaju majątku',
      fileName: 'PIT-39'
    },
    fr: {
      title: 'PIT-39 - Déclaration de revenus de cession de biens',
      personalInfo: 'Données personnelles',
      fullName: 'Nom complet',
      pesel: 'PESEL',
      nip: 'NIP',
      address: 'Adresse',
      city: 'Ville',
      postalCode: 'Code postal',
      year: 'Année fiscale',
      taxSummary: 'Résumé fiscal',
      totalPurchasePrice: 'Prix d\'achat total',
      totalSalePrice: 'Prix de vente total',
      totalImprovements: 'Améliorations totales',
      totalSaleCosts: 'Frais de vente totaux',
      totalIncome: 'Revenu total',
      totalTax: 'Impôt total',
      taxRate: '(19%)',
      pln: 'PLN',
      summarySheet: 'Résumé',
      detailedCalculations: 'Calculs détaillés pour chaque position',
      propertyType: 'Type de bien',
      description: 'Description',
      currency: 'Devise',
      purchaseDate: 'Date d\'achat',
      saleDate: 'Date de vente',
      purchasePriceForeign: 'Prix d\'achat (devise)',
      purchaseRate: 'Taux NBP (achat)',
      purchasePricePLN: 'Prix d\'achat (PLN)',
      salePriceForeign: 'Prix de vente (devise)',
      saleRate: 'Taux NBP (vente)',
      salePricePLN: 'Prix de vente (PLN)',
      improvements: 'Améliorations',
      saleCosts: 'Frais de vente',
      totalCosts: 'Coûts totaux',
      income: 'Revenu',
      tax: 'Impôt (19%)',
      total: 'Total',
      detailsSheet: 'Calculs détaillés',
      formulasTitle: 'Formules de calcul d\'impôt',
      taxInfo: 'Informations fiscales:',
      taxRateInfo: 'Taux d\'imposition sur la cession de biens',
      calculationMethodTitle: 'Méthode de calcul:',
      step1: 'Étape 1:',
      step2: 'Étape 2:',
      calculateIncome: 'Calculer le revenu',
      incomeFormula: 'Revenu = Prix de vente - Prix d\'achat - Améliorations - Frais de vente',
      calculateTax: 'Calculer l\'impôt',
      taxFormula: 'Impôt = Revenu × 19% (si revenu > 0)',
      example: 'Exemple de calcul:',
      purchasePrice: 'Prix d\'achat',
      salePrice: 'Prix de vente',
      note: 'Note:',
      noteText: 'L\'impôt PIT-39 n\'est payé que sur les revenus positifs. Les pertes ne réduisent pas la base imposable.',
      formulasSheet: 'Formules',
      propertyTypeBreakdown: 'Répartition par type de bien',
      positionCount: 'Nombre de positions',
      breakdownSheet: 'Par type de bien',
      fileName: 'PIT-39'
    }
  }

  return translations[language] || translations['pl']
}

