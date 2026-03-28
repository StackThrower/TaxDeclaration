/**
 * Generator for Ukrainian Tax Authority XML format (F0121215)
 * Generates XML declaration files for investment income reporting
 */

interface FinancialPosition {
  id: string
  assetType: string
  assetDescription?: string
  symbol?: string
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

interface TaxXMLFormData {
  fullName: string
  taxNumber: string
  taxOfficeCode: string
  year: string
  positions: FinancialPosition[]
  calculations: Calculations
}

/**
 * Format number for XML (2 decimal places, no thousands separator)
 */
function formatXMLNumber(value: number): string {
  return value.toFixed(2)
}

/**
 * Get asset type code for XML
 * 4 = other assets (securities, etc.)
 */
function getAssetTypeCode(assetType: string): string {
  // According to Ukrainian tax form F1, code 4 = "Інші активи"
  // which covers stocks, bonds, options, etc.
  switch (assetType) {
    case 'stocks':
    case 'bonds':
    case 'options':
    case 'crypto':
    case 'other':
    default:
      return '4'
  }
}

/**
 * Generate description for position
 */
function generatePositionDescription(pos: FinancialPosition): string {
  const qty = pos.quantity ? parseFloat(pos.quantity) : 0
  const qtyStr = qty !== 0 ? ` (${Math.abs(qty)} ${qty === 1 ? 'шт.' : 'шт.'})` : ''

  if (pos.assetDescription) {
    return `${pos.assetDescription}${qtyStr}`
  }

  const typeLabels: Record<string, string> = {
    stocks: 'Акції',
    bonds: 'BND',
    options: 'Опціони',
    crypto: 'Крипто',
    dividends: 'Дивіденди',
    other: 'Інше',
  }

  return `${typeLabels[pos.assetType] || 'Актив'}${qtyStr}`
}

/**
 * Get current date in DDMMYYYY format
 */
function getCurrentDateFormatted(): string {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  return `${day}${month}${year}`
}

/**
 * Generate UUID for filename
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Escape special characters for XML
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Generate F0121215 XML for Ukrainian Tax Authority
 */
export function generateTaxXML(formData: TaxXMLFormData): { xml: string; filename: string } {
  const uuid = generateUUID()
  const filename = `F0121215_DodatokF1_${uuid}.xml`

  // Extract region and district codes from tax office code
  const taxOfficeCode = formData.taxOfficeCode || '0000'
  const cReg = taxOfficeCode.substring(0, 2) || '00'
  const cRaj = taxOfficeCode.substring(2, 4) || '00'

  // Calculate totals for non-dividend positions
  let totalSalePrice = 0
  let totalPurchasePrice = 0
  let totalProfit = 0

  // Filter out dividend positions for main calculations
  const tradePositions = formData.positions.filter(p => p.assetType !== 'dividends')

  tradePositions.forEach(pos => {
    const salePrice = parseFloat(pos.salePrice) || 0
    const purchasePrice = parseFloat(pos.purchasePrice) || 0
    let positionProfit = purchasePrice - salePrice

    if (pos.assetType === 'options') {

      // For options, handle similar to ib-xml-parser calculateTradeTotals:
      // - Options can have "received premium" (negative cost) which is already
      //   converted to positive salePrice by convertToFormPosition
      // - Sum profits directly to avoid rounding issues with intermediate totals
      totalProfit += positionProfit
      // Still track sale/purchase for individual row display
      totalSalePrice += salePrice
      totalPurchasePrice += purchasePrice
    } else {
      // For stocks and other assets: standard calculation
      totalSalePrice += salePrice
      totalPurchasePrice += purchasePrice
      totalProfit += positionProfit
    }
  })

  // Calculate taxes (only on positive profit)
  const reportYear = parseInt(formData.year) || 2025
  const militaryTaxRate = reportYear >= 2025 ? 0.05 : 0.015

  const pdfoFromTrades = totalProfit > 0 ? totalProfit * 0.18 : 0
  const militaryTaxFromTrades = totalProfit > 0 ? totalProfit * militaryTaxRate : 0

  // Generate position elements
  let positionElements = ''
  tradePositions.forEach((pos, index) => {
    const rowNum = index + 1
    const salePrice = parseFloat(pos.salePrice) || 0
    const purchasePrice = parseFloat(pos.purchasePrice) || 0
    const profit = salePrice - purchasePrice
    const description = escapeXML(generatePositionDescription(pos))
    const assetCode = getAssetTypeCode(pos.assetType)

    positionElements += `<T1RXXXXG2 ROWNUM="${rowNum}">${assetCode}</T1RXXXXG2>`
    positionElements += `<T1RXXXXG3S ROWNUM="${rowNum}">${description}</T1RXXXXG3S>`
    positionElements += `<T1RXXXXG4 ROWNUM="${rowNum}">${formatXMLNumber(salePrice)}</T1RXXXXG4>`
    positionElements += `<T1RXXXXG5 ROWNUM="${rowNum}">${formatXMLNumber(purchasePrice)}</T1RXXXXG5>`
    positionElements += `<T1RXXXXG6 ROWNUM="${rowNum}">${formatXMLNumber(profit)}</T1RXXXXG6>`
  })

  const xml = `<?xml version="1.0" encoding="windows-1251" standalone="no"?>
<DECLAR xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xsi:noNamespaceSchemaLocation="F0121215.xsd">
<DECLARHEAD>
<TIN>${escapeXML(formData.taxNumber)}</TIN>
<C_DOC>F01</C_DOC>
<C_DOC_SUB>212</C_DOC_SUB>
<C_DOC_VER>15</C_DOC_VER>
<C_DOC_TYPE>0</C_DOC_TYPE>
<C_DOC_CNT>1</C_DOC_CNT>
<C_REG>${cReg}</C_REG>
<C_RAJ>${cRaj}</C_RAJ>
<PERIOD_MONTH>12</PERIOD_MONTH>
<PERIOD_TYPE>5</PERIOD_TYPE>
<PERIOD_YEAR>${formData.year}</PERIOD_YEAR>
<C_STI_ORIG>${escapeXML(taxOfficeCode)}</C_STI_ORIG>
<C_DOC_STAN>1</C_DOC_STAN>
<D_FILL>${getCurrentDateFormatted()}</D_FILL>
<SOFTWARE>tax-helper</SOFTWARE>
</DECLARHEAD>
<DECLARBODY xsi:type="DECLARBODY_F1">
<HBOS>${escapeXML(formData.fullName)}</HBOS>
<HTIN>${escapeXML(formData.taxNumber)}</HTIN>
<HZ>1</HZ>
<HZY>${formData.year}</HZY>
<R001G4>${formatXMLNumber(totalSalePrice)}</R001G4>
<R001G5>${formatXMLNumber(totalPurchasePrice)}</R001G5>
<R001G6>${formatXMLNumber(totalProfit)}</R001G6>
<R003G6>${formatXMLNumber(totalProfit > 0 ? totalProfit : 0)}</R003G6>
<R004G6>${formatXMLNumber(pdfoFromTrades)}</R004G6>
<R005G6>${formatXMLNumber(militaryTaxFromTrades)}</R005G6>
<R031G6>${formatXMLNumber(totalProfit > 0 ? totalProfit : 0)}</R031G6>
<R042G6>${formatXMLNumber(pdfoFromTrades)}</R042G6>
<R052G6>${formatXMLNumber(militaryTaxFromTrades)}</R052G6>
${positionElements}
</DECLARBODY>
</DECLAR>`

  return { xml, filename }
}

/**
 * Download XML file
 */
export function downloadTaxXML(formData: TaxXMLFormData): void {
  const { xml, filename } = generateTaxXML(formData)

  // Convert to windows-1251 encoding using TextEncoder workaround
  // Since browsers don't natively support windows-1251, we'll use UTF-8
  // and indicate the encoding in the XML declaration
  const blob = new Blob([xml], { type: 'application/xml;charset=windows-1251' })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}
