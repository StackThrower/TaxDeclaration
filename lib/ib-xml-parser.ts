/**
 * Interactive Brokers XML Parser
 * Parses FlexQuery XML files and extracts trade data for tax forms
 */

export interface IBTrade {
  symbol: string
  description: string
  quantity: number
  tradePrice: number
  tradeDate: string
  openDateTime: string
  reportDate: string
  currency: string
  cost: number
  fifoPnlRealized: number
  assetCategory: string
  subCategory: string
}

export interface ParsedIBData {
  trades: IBTrade[]
  accountId: string
  fromDate: string
  toDate: string
  period: string
}

/**
 * Parse Interactive Brokers FlexQuery XML
 */
export function parseIBXML(xmlContent: string): ParsedIBData {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined' && typeof DOMParser !== 'undefined'

  let xmlDoc: Document

  if (isBrowser) {
    const parser = new DOMParser()
    xmlDoc = parser.parseFromString(xmlContent, "text/xml")

    // Check for parsing errors
    const parserError = xmlDoc.querySelector("parsererror")
    if (parserError) {
      throw new Error("Invalid XML format")
    }
  } else {
    // For Node.js environment, use a simple regex-based parser
    // This is a fallback for testing purposes
    return parseIBXMLRegex(xmlContent)
  }

  // Extract account info
  const flexStatement = xmlDoc.querySelector("FlexStatement")
  if (!flexStatement) {
    throw new Error("No FlexStatement found in XML")
  }

  const accountId = flexStatement.getAttribute("accountId") || ""
  const fromDate = flexStatement.getAttribute("fromDate") || ""
  const toDate = flexStatement.getAttribute("toDate") || ""
  const period = flexStatement.getAttribute("period") || ""

  // Extract trades
  const trades: IBTrade[] = []
  const lotElements = xmlDoc.querySelectorAll("Trades > Lot")

  lotElements.forEach((lot) => {
    const assetCategory = lot.getAttribute("assetCategory") || ""
    const subCategory = lot.getAttribute("subCategory") || ""

    // Only process closed lots (which have realized gains/losses)
    const openCloseIndicator = lot.getAttribute("openCloseIndicator")
    if (openCloseIndicator !== "C") return

    const trade: IBTrade = {
      symbol: lot.getAttribute("symbol") || "",
      description: lot.getAttribute("description") || "",
      quantity: parseFloat(lot.getAttribute("quantity") || "0"),
      tradePrice: parseFloat(lot.getAttribute("tradePrice") || "0"),
      tradeDate: formatDate(lot.getAttribute("tradeDate") || ""),
      openDateTime: formatDateTime(lot.getAttribute("openDateTime") || ""),
      reportDate: formatDate(lot.getAttribute("reportDate") || ""),
      currency: lot.getAttribute("currency") || "USD",
      cost: Math.abs(parseFloat(lot.getAttribute("cost") || "0")),
      fifoPnlRealized: parseFloat(lot.getAttribute("fifoPnlRealized") || "0"),
      assetCategory,
      subCategory,
    }

    trades.push(trade)
  })

  return {
    trades,
    accountId,
    fromDate: formatDate(fromDate),
    toDate: formatDate(toDate),
    period,
  }
}

/**
 * Parse IB XML using regex (fallback for Node.js)
 */
function parseIBXMLRegex(xmlContent: string): ParsedIBData {
  // Extract FlexStatement attributes
  const flexStatementMatch = xmlContent.match(/<FlexStatement[^>]*accountId="([^"]*)"[^>]*fromDate="([^"]*)"[^>]*toDate="([^"]*)"[^>]*period="([^"]*)"/)

  const accountId = flexStatementMatch?.[1] || ""
  const fromDate = formatDate(flexStatementMatch?.[2] || "")
  const toDate = formatDate(flexStatementMatch?.[3] || "")
  const period = flexStatementMatch?.[4] || ""

  // Extract all Lot elements
  const lotRegex = /<Lot[^>]*>/g
  const lots = xmlContent.match(lotRegex) || []

  const trades: IBTrade[] = []

  lots.forEach((lotTag) => {
    // Check if it's a closed lot
    const openCloseMatch = lotTag.match(/openCloseIndicator="([^"]*)"/)
    if (openCloseMatch?.[1] !== "C") return

    const getAttribute = (name: string): string => {
      const match = lotTag.match(new RegExp(`${name}="([^"]*)"`, 'i'))
      return match?.[1] || ""
    }

    const trade: IBTrade = {
      symbol: getAttribute("symbol"),
      description: getAttribute("description"),
      quantity: parseFloat(getAttribute("quantity") || "0"),
      tradePrice: parseFloat(getAttribute("tradePrice") || "0"),
      tradeDate: formatDate(getAttribute("tradeDate")),
      openDateTime: formatDateTime(getAttribute("openDateTime")),
      reportDate: formatDate(getAttribute("reportDate")),
      currency: getAttribute("currency") || "USD",
      cost: Math.abs(parseFloat(getAttribute("cost") || "0")),
      fifoPnlRealized: parseFloat(getAttribute("fifoPnlRealized") || "0"),
      assetCategory: getAttribute("assetCategory"),
      subCategory: getAttribute("subCategory"),
    }

    trades.push(trade)
  })

  return {
    trades,
    accountId,
    fromDate,
    toDate,
    period,
  }
}

/**
 * Format date from YYYYMMDD to YYYY-MM-DD
 */
function formatDate(dateStr: string): string {
  if (!dateStr || dateStr.length !== 8) return ""

  const year = dateStr.substring(0, 4)
  const month = dateStr.substring(4, 6)
  const day = dateStr.substring(6, 8)

  return `${year}-${month}-${day}`
}

/**
 * Format datetime from YYYYMMDD;HHMMSS to YYYY-MM-DD
 */
function formatDateTime(dateTimeStr: string): string {
  if (!dateTimeStr) return ""

  const datePart = dateTimeStr.split(";")[0]
  return formatDate(datePart)
}

/**
 * Group trades by symbol for easier processing
 */
export function groupTradesBySymbol(trades: IBTrade[]): Map<string, IBTrade[]> {
  const grouped = new Map<string, IBTrade[]>()

  trades.forEach((trade) => {
    const existing = grouped.get(trade.symbol) || []
    existing.push(trade)
    grouped.set(trade.symbol, existing)
  })

  return grouped
}

/**
 * Calculate totals from trades
 */
export function calculateTradeTotals(trades: IBTrade[]) {
  let totalCost = 0
  let totalRevenue = 0
  let totalProfit = 0

  trades.forEach((trade) => {
    const quantity = Math.abs(trade.quantity)
    const revenue = quantity * trade.tradePrice

    totalCost += trade.cost
    totalRevenue += revenue
    totalProfit += trade.fifoPnlRealized
  })

  return {
    totalCost,
    totalRevenue,
    totalProfit,
  }
}

/**
 * Convert IB trade to form position format
 */
export function convertToFormPosition(trade: IBTrade) {
  const quantity = Math.abs(trade.quantity)
  const salePrice = quantity * trade.tradePrice

  return {
    id: Date.now().toString() + Math.random().toString(36).substring(7),
    assetType: `${trade.symbol} - ${trade.description} (${trade.assetCategory}${trade.subCategory ? `/${trade.subCategory}` : ""})`,
    currency: trade.currency,
    purchaseDate: trade.openDateTime,
    saleDate: trade.tradeDate,
    purchasePriceForeign: trade.cost.toFixed(2),
    salePriceForeign: salePrice.toFixed(2),
    purchaseRate: "",
    saleRate: "",
    purchasePrice: "",
    salePrice: "",
    expenses: "0",
  }
}

/**
 * Read file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string)
      } else {
        reject(new Error("Failed to read file"))
      }
    }

    reader.onerror = () => {
      reject(new Error("Error reading file"))
    }

    reader.readAsText(file)
  })
}

