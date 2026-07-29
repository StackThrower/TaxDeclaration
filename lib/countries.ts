// The project supports Ukraine only. The union is kept wide so the
// country-keyed SEO metadata maps continue to type-check, but the runtime
// data below only ever contains Ukraine.
export type CountryCode = "ua" | "pl" | "fr" | "de" | "pt" | "es" | "se" | "gb" | "us" | "ca"

export type Country = {
  code: CountryCode
  name: string
  flag: string
  taxForms: TaxForm[]
}

export type TaxForm = {
  id: string
  title: string
  description: string
  features: string[]
  year: number
}

// Tax forms data for Ukraine (researched from official tax authorities)
export const countries: Partial<Record<CountryCode, Country>> = {
  ua: {
    code: "ua",
    name: "Ukraine",
    flag: "🇺🇦",
    taxForms: [
      {
        id: "f0121214",
        title: "F0121214 (Ф1)",
        description: "Додаток Ф1 - Розрахунок податкових зобов'язань",
        features: [
          "ПДФО від інвестицій",
          "Військовий збір",
          "Розрахунок зобов'язань",
        ],
        year: 2026,
      },
    ],
  },
}

// Map language codes to country codes
export const languageToCountryMap: Record<string, CountryCode> = {
  uk: "ua",
}

// Get country by code
export function getCountry(code: string): Country | undefined {
  return countries[code as CountryCode]
}

// Get all country codes
export function getCountryCodes(): CountryCode[] {
  return Object.keys(countries) as CountryCode[]
}

// Get default country for language
export function getDefaultCountryForLanguage(lang: string): CountryCode {
  return languageToCountryMap[lang] || "ua"
}
