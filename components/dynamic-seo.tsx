"use client"

import { useEffect } from "react"
import { useI18n } from "@/lib/i18n-context"

// Metadata for different languages on the root page
const rootMetadata: Record<string, { title: string; description: string; keywords: string[] }> = {
  uk: {
    title: `Taxered - Податкова декларація онлайн ${new Date().getFullYear()} | Безкоштовно для України`,
    description: `✨ Заповніть декларацію F0100214 та F0121214 легко і швидко! Безкоштовний онлайн сервіс для громадян України 🇺🇦 | Розрахунок ПДФО та військового збору | Ваші дані залишаються тільки у вас 🔒 | Експорт в PDF за 5 хвилин`,
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
    title: `Taxered - Free Online Tax Declaration ${new Date().getFullYear()} | Easy & Fast`,
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
    title: `Taxered - Déclaration d'impôts gratuite ${new Date().getFullYear()} | Simple et rapide`,
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
    title: `Taxered - Darmowe rozliczenie PIT ${new Date().getFullYear()} | Łatwo i szybko`,
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
    title: `Taxered - Declaración de impuestos gratis ${new Date().getFullYear()} | Fácil y rápido`,
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
    title: `Taxered - Declaração de impostos grátis ${new Date().getFullYear()} | Fácil e rápido`,
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
    title: `Taxered - Kostenlose Steuererklärung ${new Date().getFullYear()} | Einfach und schnell`,
    description: `✨ Füllen Sie Ihre Steuererklärung einfach aus! 100% kostenloser Online-Service 🎁 | Ihre Daten bleiben privat 🔒 | PDF-Export in 5 Minuten | Datenschutz garantiert`,
    keywords: [
      "kostenlose Steuererklärung",
      "Steuererklärung online",
      "Einkommensteuer",
      "Steuern 2025",
      "Datenschutz garantiert",
    ],
  },
}

export function DynamicSEO({ isRootPage = false }: { isRootPage?: boolean }) {
  const { language } = useI18n()

  useEffect(() => {
    // Only update SEO on root page when language changes
    if (!isRootPage) return

    const metadata = rootMetadata[language] || rootMetadata.uk

    // Update document title
    document.title = metadata.title

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute("content", metadata.description)
    } else {
      metaDescription = document.createElement("meta")
      metaDescription.setAttribute("name", "description")
      metaDescription.setAttribute("content", metadata.description)
      document.head.appendChild(metaDescription)
    }

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute("content", metadata.keywords.join(", "))
    } else {
      metaKeywords = document.createElement("meta")
      metaKeywords.setAttribute("name", "keywords")
      metaKeywords.setAttribute("content", metadata.keywords.join(", "))
      document.head.appendChild(metaKeywords)
    }

    // Update Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute("content", metadata.title)
    } else {
      ogTitle = document.createElement("meta")
      ogTitle.setAttribute("property", "og:title")
      ogTitle.setAttribute("content", metadata.title)
      document.head.appendChild(ogTitle)
    }

    // Update Open Graph description
    let ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute("content", metadata.description)
    } else {
      ogDescription = document.createElement("meta")
      ogDescription.setAttribute("property", "og:description")
      ogDescription.setAttribute("content", metadata.description)
      document.head.appendChild(ogDescription)
    }

    // Update Twitter title
    let twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle) {
      twitterTitle.setAttribute("content", metadata.title)
    } else {
      twitterTitle = document.createElement("meta")
      twitterTitle.setAttribute("name", "twitter:title")
      twitterTitle.setAttribute("content", metadata.title)
      document.head.appendChild(twitterTitle)
    }

    // Update Twitter description
    let twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute("content", metadata.description)
    } else {
      twitterDescription = document.createElement("meta")
      twitterDescription.setAttribute("name", "twitter:description")
      twitterDescription.setAttribute("content", metadata.description)
      document.head.appendChild(twitterDescription)
    }

    // Update html lang attribute
    document.documentElement.lang = language

  }, [language, isRootPage])

  return null
}

