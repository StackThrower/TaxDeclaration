import type { Metadata } from "next"
import LocalePageClient from "./page-client"
import { getCountry, type CountryCode } from "@/lib/countries"
import { type Language } from "@/lib/i18n"
import { generatePageMetadata } from "@/lib/seo-metadata"
import { generateWebsiteSchema, generateOrganizationSchema } from "@/lib/seo"

type Props = {
  params: Promise<{ locale: string }>
}

// Generate dynamic metadata based on locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  if (!locale) {
    return {
      title: "Monegoo - Tax Declaration",
      description: "Online system for filing tax declarations",
    }
  }

  // Parse locale (e.g., "en-us" -> ["en", "us"])
  const parts = locale.toLowerCase().split("-")

  if (parts.length !== 2) {
    return {
      title: "Monegoo - Tax Declaration",
      description: "Online system for filing tax declarations",
    }
  }

  const [langCode, countryCode] = parts

  // Validate country code
  const country = getCountry(countryCode)
  if (!country) {
    return {
      title: "Monegoo - Tax Declaration",
      description: "Online system for filing tax declarations",
    }
  }

  // Generate SEO-friendly metadata
  return generatePageMetadata(countryCode as CountryCode, langCode as Language, locale)
}


export default async function LocalePage({ params }: Props) {
  const { locale } = await params

  // Parse locale
  const parts = locale?.toLowerCase().split("-") || []
  const [langCode, countryCode] = parts
  const country = getCountry(countryCode)

  // Translate strings based on language
  const getTranslation = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      uk: {
        appName: "Monegoo - Податкові декларації",
        appDescription: "Безкоштовна онлайн система для заповнення податкових декларацій F0100214 та F0121214. Всі дані обробляються локально в вашому браузері.",
        feature1: "Заповнення декларації F0100214 онлайн",
        feature2: "Розрахунок податків F0121214 (Ф1)",
        feature3: "Експорт в PDF",
        feature4: "Всі дані залишаються у вас",
      },
      en: {
        appName: "Monegoo - Tax Declarations",
        appDescription: "Free online system for filling tax declarations F0100214 and F0121214. All data processed locally in your browser.",
        feature1: "Fill F0100214 declaration online",
        feature2: "Calculate taxes F0121214 (F1)",
        feature3: "Export to PDF",
        feature4: "All data stays with you",
      },
      fr: {
        appName: "Monegoo - Déclarations fiscales",
        appDescription: "Système en ligne gratuit pour remplir les déclarations fiscales. Toutes les données sont traitées localement dans votre navigateur.",
        feature1: "Remplir les déclarations en ligne",
        feature2: "Calculer les impôts",
        feature3: "Exporter en PDF",
        feature4: "Vos données restent chez vous",
      },
      pl: {
        appName: "Monegoo - Deklaracje podatkowe",
        appDescription: "Bezpłatny system online do wypełniania deklaracji podatkowych. Wszystkie dane przetwarzane są lokalnie w przeglądarce.",
        feature1: "Wypełnij deklaracje online",
        feature2: "Oblicz podatki",
        feature3: "Eksport do PDF",
        feature4: "Twoje dane pozostają u Ciebie",
      },
      es: {
        appName: "Monegoo - Declaraciones fiscales",
        appDescription: "Sistema en línea gratuito para completar declaraciones fiscales. Todos los datos se procesan localmente en su navegador.",
        feature1: "Completar declaraciones en línea",
        feature2: "Calcular impuestos",
        feature3: "Exportar a PDF",
        feature4: "Sus datos permanecen con usted",
      },
      pt: {
        appName: "Monegoo - Declarações fiscais",
        appDescription: "Sistema online gratuito para preencher declarações fiscais. Todos os dados são processados localmente no seu navegador.",
        feature1: "Preencher declarações online",
        feature2: "Calcular impostos",
        feature3: "Exportar para PDF",
        feature4: "Seus dados permanecem com você",
      },
      de: {
        appName: "Monegoo - Steuererklärungen",
        appDescription: "Kostenloses Online-System zum Ausfüllen von Steuererklärungen. Alle Daten werden lokal in Ihrem Browser verarbeitet.",
        feature1: "Steuererklärungen online ausfüllen",
        feature2: "Steuern berechnen",
        feature3: "Als PDF exportieren",
        feature4: "Ihre Daten bleiben bei Ihnen",
      },
    }
    return translations[langCode]?.[key] || translations.en[key]
  }

  // Generate schema.org structured data
  const websiteSchema = generateWebsiteSchema({
    name: "Monegoo Tax Declaration",
    url: "https://monegoo.com",
    description: "Online system for filing tax declarations on property status, income, and investment transactions",
  })

  const organizationSchema = generateOrganizationSchema({
    name: "Monegoo",
    url: "https://monegoo.com",
    logo: "https://monegoo.com/placeholder-logo.png",
    description: "Free and open tax declaration system for everyone",
  })

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": getTranslation("appName"),
    "description": getTranslation("appDescription"),
    "url": `https://monegoo.com/${locale}`,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      getTranslation("feature1"),
      getTranslation("feature2"),
      getTranslation("feature3"),
      getTranslation("feature4"),
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "1",
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `https://monegoo.com/${locale}`,
      },
    ],
  }

  return (
    <>
      {/* Schema.org JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <LocalePageClient locale={locale} />
    </>
  )
}

