import type { Metadata } from "next"
import { headers } from "next/headers"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { FormsSection } from "@/components/forms-section"
import { TaxCalculator } from "@/components/tax-calculator"
import { Footer } from "@/components/footer"
import { DynamicSEO } from "@/components/dynamic-seo"
import { getCountry, type CountryCode } from "@/lib/countries"

// Generate beautiful SSR metadata for root page based on browser language
export async function generateMetadata(): Promise<Metadata> {
  // Get browser's Accept-Language header
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language') || ''

  // Parse language from Accept-Language header
  const browserLang = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase() || 'uk'

  const currentYear = new Date().getFullYear()

  // Beautiful multilingual titles and descriptions with emojis
  const metadata: Record<string, { title: string; description: string; keywords: string[] }> = {
    uk: {
      title: `Генератор декларації про майновий стан і доходи ${currentYear} Україна`,
      description: `✨ Заповніть податкову декларацію про майновий стан та доходи легко і швидко! Безкоштовний онлайн сервіс для громадян України 🇺🇦 | Розрахунок ПДФО та військового збору | Ваші дані залишаються тільки у вас 🔒 | Експорт в PDF за 5 хвилин`,
      keywords: [
        "податкова декларація україна",
        "F0100214 онлайн",
        "F0121214 безкоштовно",
        "ПДФО розрахунок",
        "військовий збір 2025",
        "декларація про доходи",
        "податки україна онлайн",
        "заповнити декларацію",
      ],
    },
    en: {
      title: `Taxered - Free Online Tax Declaration ${currentYear} | Easy & Fast`,
      description: `✨ Fill out tax declaration F0100214 & F0121214 easily and quickly! Free online service 🌍 | Calculate income tax & military duty | Your data stays private 🔒 | Export to PDF in 5 minutes | Privacy-first approach`,
      keywords: [
        "free tax declaration",
        "online tax filing",
        "F0100214 form",
        "F0121214 calculator",
        "income tax online",
        "tax return 2025",
        "privacy tax service",
      ],
    },
    fr: {
      title: `Taxered - Déclaration d'impôts gratuite ${currentYear} | Simple et rapide`,
      description: `✨ Remplissez votre déclaration d'impôts facilement! Service en ligne 100% gratuit 🎁 | Vos données restent chez vous 🔒 | Export PDF en 5 minutes | Protection de la vie privée garantie`,
      keywords: [
        "déclaration impôts gratuite",
        "déclaration en ligne",
        "service fiscal gratuit",
        "impôts 2025",
        "confidentialité garantie",
      ],
    },
    pl: {
      title: `Taxered - Darmowe rozliczenie PIT ${currentYear} | Łatwo i szybko`,
      description: `✨ Wypełnij deklarację podatkową PIT łatwo i szybko! Darmowy serwis online 🎁 | Twoje dane pozostają u Ciebie 🔒 | Export do PDF w 5 minut | Prywatność na pierwszym miejscu`,
      keywords: [
        "darmowe rozliczenie PIT",
        "PIT online",
        "deklaracja podatkowa",
        "podatki 2025",
        "bezpieczne rozliczenie",
      ],
    },
    es: {
      title: `Taxered - Declaración de impuestos gratis ${currentYear} | Fácil y rápido`,
      description: `✨ Complete su declaración de impuestos fácilmente! Servicio online 100% gratuito 🎁 | Sus datos permanecen privados 🔒 | Exportar a PDF en 5 minutos | Privacidad garantizada`,
      keywords: [
        "declaración impuestos gratis",
        "declaración online",
        "IRPF online",
        "impuestos 2025",
        "privacidad garantizada",
      ],
    },
    pt: {
      title: `Taxered - Declaração de impostos grátis ${currentYear} | Fácil e rápido`,
      description: `✨ Preencha sua declaração IRS facilmente! Serviço online 100% gratuito 🎁 | Seus dados permanecem privados 🔒 | Exportar para PDF em 5 minutos | Privacidade garantida`,
      keywords: [
        "declaração IRS grátis",
        "IRS online",
        "declaração impostos",
        "impostos 2025",
        "privacidade garantida",
      ],
    },
    de: {
      title: `Taxered - Kostenlose Steuererklärung ${currentYear} | Einfach und schnell`,
      description: `✨ Füllen Sie Ihre Steuererklärung einfach aus! 100% kostenloser Online-Service 🎁 | Ihre Daten bleiben privat 🔒 | PDF-Export in 5 Minuten | Datenschutz garantiert`,
      keywords: [
        "kostenlose Steuererklärung",
        "Steuererklärung online",
        "Einkommensteuer",
        "Steuern 2025",
        "Datenschutz garantiert",
      ],
    },
    sv: {
      title: `Taxered - Gratis skattedeklaration ${currentYear} | Enkelt och snabbt`,
      description: `✨ Fyll i din skattedeklaration enkelt! 100% gratis online-tjänst 🎁 | Dina data förblir privata 🔒 | PDF-export på 5 minuter | Integritetsskydd garanterat`,
      keywords: [
        "gratis skattedeklaration",
        "skattedeklaration online",
        "inkomstdeklaration",
        "skatt 2025",
        "integritetsskydd",
      ],
    },
  }

  const meta = metadata[browserLang] || metadata.uk
  const locale = browserLang === 'uk' ? 'uk_UA' : `${browserLang}_${browserLang.toUpperCase()}`

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      type: "website",
      locale: locale,
      url: "https://taxered.com",
      title: meta.title,
      description: meta.description,
      siteName: "Taxered Tax Declaration",
      images: [
        {
          url: "/placeholder-logo.png",
          width: 1200,
          height: 630,
          alt: "Taxered - Free Online Tax Declaration",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/placeholder-logo.png"],
      creator: "@monegoo",
    },
    alternates: {
      canonical: "https://taxered.com",
      languages: {
        "x-default": "/",
        "uk-UA": "/uk-ua",
        "en-US": "/en-us",
        "en-GB": "/en-gb",
        "en-CA": "/en-ca",
        "fr-FR": "/fr-fr",
        "pl-PL": "/pl-pl",
        "es-ES": "/es-es",
        "pt-PT": "/pt-pt",
        "de-DE": "/de-de",
        "sv-SE": "/sv-se",
      },
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    authors: [{ name: "Taxered", url: "https://taxered.com" }],
    creator: "Taxered",
    publisher: "Taxered",
    category: "Finance",
  }
}

export default function Home() {
  // Default country is always Ukraine
  const countryCode: CountryCode = "ua"
  const country = getCountry(countryCode)

  if (!country) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <DynamicSEO isRootPage={true} />
      <Header />
      <Hero />
      <FormsSection country={country} />
      <Footer />
    </main>
  )
}

