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

// Tax forms data for each country (researched from official tax authorities)
export const countries: Record<CountryCode, Country> = {
  ua: {
    code: "ua",
    name: "Ukraine",
    flag: "🇺🇦",
    taxForms: [
      {
        id: "f0100214",
        title: "F0100214",
        description: "Податкова декларація про майновий стан і доходи",
        features: [
          "Відомості про майно",
          "Дані про доходи",
          "Витрати та збитки",
        ],
        year: 2026,
      },
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
  pl: {
    code: "pl",
    name: "Poland",
    flag: "🇵🇱",
    taxForms: [
      {
        id: "pit-37",
        title: "PIT-37",
        description: "Zeznanie o wysokości osiągniętego dochodu",
        features: [
          "Dochody z pracy",
          "Emerytury i renty",
          "Inne źródła przychodów",
        ],
        year: 2026,
      },
      {
        id: "pit-38",
        title: "PIT-38",
        description: "Zeznanie o wysokości osiągniętego dochodu z kapitałów",
        features: [
          "Dywidendy",
          "Odsetki",
          "Przychody kapitałowe",
        ],
        year: 2026,
      },
      {
        id: "pit-39",
        title: "PIT-39",
        description: "Zeznanie o dochodach z odpłatnego zbycia",
        features: [
          "Sprzedaż nieruchomości",
          "Sprzedaż akcji",
          "Inne transakcje",
        ],
        year: 2026,
      },
    ],
  },
  fr: {
    code: "fr",
    name: "France",
    flag: "🇫🇷",
    taxForms: [
      {
        id: "2042",
        title: "2042",
        description: "Déclaration des revenus",
        features: [
          "Revenus salariaux",
          "Revenus fonciers",
          "Revenus mobiliers",
        ],
        year: 2026,
      },
      {
        id: "2042-c",
        title: "2042-C",
        description: "Déclaration complémentaire",
        features: [
          "Plus-values",
          "Revenus exceptionnels",
          "Réductions d'impôt",
        ],
        year: 2026,
      },
      {
        id: "2044",
        title: "2044",
        description: "Déclaration des revenus fonciers",
        features: [
          "Revenus locatifs",
          "Charges déductibles",
          "Amortissements",
        ],
        year: 2026,
      },
    ],
  },
  de: {
    code: "de",
    name: "Germany",
    flag: "🇩🇪",
    taxForms: [
      {
        id: "est-1a",
        title: "EST 1A",
        description: "Einkommensteuererklärung",
        features: [
          "Einkünfte aus nichtselbständiger Arbeit",
          "Kapitalerträge",
          "Sonstige Einkünfte",
        ],
        year: 2026,
      },
      {
        id: "anlage-n",
        title: "Anlage N",
        description: "Einkünfte aus nichtselbständiger Arbeit",
        features: [
          "Gehälter und Löhne",
          "Werbungskosten",
          "Versorgungsbezüge",
        ],
        year: 2026,
      },
      {
        id: "anlage-kap",
        title: "Anlage KAP",
        description: "Einkünfte aus Kapitalvermögen",
        features: [
          "Zinsen und Dividenden",
          "Veräußerungsgewinne",
          "Kapitalerträge",
        ],
        year: 2026,
      },
    ],
  },
  pt: {
    code: "pt",
    name: "Portugal",
    flag: "🇵🇹",
    taxForms: [
      {
        id: "irs-modelo-3",
        title: "IRS Modelo 3",
        description: "Declaração de rendimentos",
        features: [
          "Rendimentos do trabalho",
          "Rendimentos de capitais",
          "Rendimentos prediais",
        ],
        year: 2026,
      },
      {
        id: "anexo-a",
        title: "Anexo A",
        description: "Rendimentos do trabalho dependente",
        features: [
          "Salários",
          "Pensões",
          "Outros rendimentos",
        ],
        year: 2026,
      },
      {
        id: "anexo-e",
        title: "Anexo E",
        description: "Rendimentos de capitais",
        features: [
          "Juros",
          "Dividendos",
          "Mais-valias",
        ],
        year: 2026,
      },
    ],
  },
  es: {
    code: "es",
    name: "Spain",
    flag: "🇪🇸",
    taxForms: [
      {
        id: "modelo-100",
        title: "Modelo 100",
        description: "Declaración de la Renta",
        features: [
          "Rendimientos del trabajo",
          "Rendimientos del capital",
          "Actividades económicas",
        ],
        year: 2026,
      },
      {
        id: "modelo-d-100",
        title: "Modelo D-100",
        description: "Datos adicionales",
        features: [
          "Ganancias patrimoniales",
          "Deducciones autonómicas",
          "Imputaciones de renta",
        ],
        year: 2026,
      },
      {
        id: "modelo-720",
        title: "Modelo 720",
        description: "Declaración de bienes en el extranjero",
        features: [
          "Cuentas bancarias",
          "Valores y derechos",
          "Inmuebles",
        ],
        year: 2026,
      },
    ],
  },
  se: {
    code: "se",
    name: "Sweden",
    flag: "🇸🇪",
    taxForms: [
      {
        id: "ink1",
        title: "INK1",
        description: "Inkomstdeklaration 1",
        features: [
          "Inkomst av tjänst",
          "Inkomst av kapital",
          "Avdrag",
        ],
        year: 2026,
      },
      {
        id: "k4",
        title: "K4",
        description: "Kapitalinkomster och utgifter",
        features: [
          "Utdelningar",
          "Räntor",
          "Kapitalvinster",
        ],
        year: 2026,
      },
      {
        id: "k10",
        title: "K10",
        description: "Avyttring av värdepapper",
        features: [
          "Aktieförsäljning",
          "Fondandelar",
          "Vinst/Förlust",
        ],
        year: 2026,
      },
    ],
  },
  gb: {
    code: "gb",
    name: "United Kingdom",
    flag: "🇬🇧",
    taxForms: [
      {
        id: "sa100",
        title: "SA100",
        description: "Tax Return",
        features: [
          "Employment income",
          "Self-employment",
          "Capital gains",
        ],
        year: 2026,
      },
      {
        id: "sa108",
        title: "SA108",
        description: "Capital Gains",
        features: [
          "Property sales",
          "Shares disposal",
          "Other assets",
        ],
        year: 2026,
      },
      {
        id: "sa109",
        title: "SA109",
        description: "Residence, remittance basis",
        features: [
          "Foreign income",
          "Residence status",
          "Remittances",
        ],
        year: 2026,
      },
    ],
  },
  us: {
    code: "us",
    name: "United States",
    flag: "🇺🇸",
    taxForms: [
      {
        id: "1040",
        title: "Form 1040",
        description: "U.S. Individual Income Tax Return",
        features: [
          "Income",
          "Deductions",
          "Tax credits",
        ],
        year: 2026,
      },
      {
        id: "schedule-d",
        title: "Schedule D",
        description: "Capital Gains and Losses",
        features: [
          "Stock sales",
          "Property sales",
          "Capital losses",
        ],
        year: 2026,
      },
      {
        id: "8949",
        title: "Form 8949",
        description: "Sales and Other Dispositions of Capital Assets",
        features: [
          "Investment transactions",
          "Basis reporting",
          "Adjustments",
        ],
        year: 2026,
      },
      {
        id: "schedule-c",
        title: "Schedule C",
        description: "Profit or Loss From Business",
        features: [
          "Business income",
          "Business expenses",
          "Net profit",
        ],
        year: 2026,
      },
    ],
  },
  ca: {
    code: "ca",
    name: "Canada",
    flag: "🇨🇦",
    taxForms: [
      {
        id: "t1-general",
        title: "T1 General",
        description: "Income Tax and Benefit Return",
        features: [
          "Employment income",
          "Investment income",
          "Deductions",
        ],
        year: 2026,
      },
      {
        id: "schedule-3",
        title: "Schedule 3",
        description: "Capital Gains or Losses",
        features: [
          "Property disposition",
          "Securities",
          "Capital gains deduction",
        ],
        year: 2026,
      },
      {
        id: "t5008",
        title: "T5008",
        description: "Statement of Securities Transactions",
        features: [
          "Stock transactions",
          "Bond sales",
          "Mutual funds",
        ],
        year: 2026,
      },
    ],
  },
}

// Map language codes to country codes
export const languageToCountryMap: Record<string, CountryCode> = {
  uk: "ua",
  en: "us",
  fr: "fr",
  pl: "pl",
  es: "es",
  pt: "pt",
  de: "de",
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

