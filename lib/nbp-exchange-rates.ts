/**
 * NBP (Narodowy Bank Polski) Exchange Rates API
 * Documentation: https://api.nbp.pl/
 */

export interface NBPExchangeRate {
  no: string // Table number
  effectiveDate: string // Date
  mid: number // Average exchange rate
}

export interface NBPRateTable {
  table: string // Table type (A, B, or C)
  currency: string // Currency name
  code: string // Currency code (ISO 4217)
  rates: NBPExchangeRate[]
}

export const SUPPORTED_CURRENCIES_PLN = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
]

/**
 * Fetch exchange rate from NBP for a specific date and currency
 * @param date - Date in YYYY-MM-DD format
 * @param currencyCode - ISO 4217 currency code (e.g., USD, EUR)
 * @returns Exchange rate or null if not found
 */
export async function fetchNBPExchangeRate(
  date: string,
  currencyCode: string
): Promise<number | null> {
  if (!date || !currencyCode || currencyCode === "PLN") {
    return 1 // PLN to PLN rate is 1
  }

  try {
    // Format date as YYYY-MM-DD for NBP API
    const formattedDate = date

    // NBP API endpoint - using table A for most currencies
    const url = `https://api.nbp.pl/api/exchangerates/rates/a/${currencyCode}/${formattedDate}/?format=json`

    const response = await fetch(url)

    if (!response.ok) {
      // Try table B for less common currencies
      const urlB = `https://api.nbp.pl/api/exchangerates/rates/b/${currencyCode}/${formattedDate}/?format=json`
      const responseB = await fetch(urlB)

      if (!responseB.ok) {
        console.error(`NBP API error: ${response.status} ${response.statusText}`)
        return null
      }

      const dataB: NBPRateTable = await responseB.json()
      if (dataB && dataB.rates && dataB.rates.length > 0) {
        return dataB.rates[0].mid
      }

      return null
    }

    const data: NBPRateTable = await response.json()

    if (data && data.rates && data.rates.length > 0) {
      return data.rates[0].mid
    }

    return null
  } catch (error) {
    console.error("Error fetching NBP exchange rate:", error)
    return null
  }
}

/**
 * Convert amount from foreign currency to PLN
 * @param amount - Amount in foreign currency
 * @param exchangeRate - NBP exchange rate
 * @returns Amount in PLN
 */
export function convertToPLN(amount: number, exchangeRate: number): number {
  return amount * exchangeRate
}

/**
 * Format exchange rate display
 * @param rate - Exchange rate
 * @param currencyCode - Currency code
 * @returns Formatted string
 */
export function formatExchangeRatePLN(rate: number | null, currencyCode: string): string {
  if (rate === null) {
    return "—"
  }
  if (currencyCode === "PLN") {
    return "1.00"
  }
  return rate.toFixed(4)
}

/**
 * Get currency symbol by code
 * @param code - Currency code
 * @returns Currency symbol
 */
export function getCurrencySymbolPLN(code: string): string {
  const currency = SUPPORTED_CURRENCIES_PLN.find((c) => c.code === code)
  return currency?.symbol || code
}

