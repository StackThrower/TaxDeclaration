import type { Metadata } from "next"
import { Language } from "@/lib/i18n"
import { CountryCode } from "@/lib/countries"

export function generateKnowledgeMetadata(
  language: Language,
  country: CountryCode,
  article?: { title: string; description: string; keywords: string[] }
): Metadata {
  const currentYear = new Date().getFullYear()

  const baseMetadata = {
    uk: {
      title: `База знань з оподаткування ${currentYear} | Monegoo`,
      description: "Корисні статті про податки, декларації та оптимізацію податкових зобов'язань. Актуальна інформація для України та інших країн.",
    },
    en: {
      title: `Tax Knowledge Base ${currentYear} | Monegoo`,
      description: "Useful articles about taxes, declarations and tax optimization. Current information for multiple countries.",
    },
    fr: {
      title: `Base de connaissances fiscales ${currentYear} | Monegoo`,
      description: "Articles utiles sur les impôts, les déclarations et l'optimisation fiscale. Informations actuelles pour plusieurs pays.",
    },
    pl: {
      title: `Baza wiedzy podatkowej ${currentYear} | Monegoo`,
      description: "Przydatne artykuły o podatkach, deklaracjach i optymalizacji podatkowej. Aktualne informacje dla wielu krajów.",
    },
    es: {
      title: `Base de conocimientos fiscales ${currentYear} | Monegoo`,
      description: "Artículos útiles sobre impuestos, declaraciones y optimización fiscal. Información actual para varios países.",
    },
    pt: {
      title: `Base de conhecimento fiscal ${currentYear} | Monegoo`,
      description: "Artigos úteis sobre impostos, declarações e otimização fiscal. Informações atuais para vários países.",
    },
    de: {
      title: `Steuerliche Wissensdatenbank ${currentYear} | Monegoo`,
      description: "Nützliche Artikel über Steuern, Erklärungen und Steueroptimierung. Aktuelle Informationen für mehrere Länder.",
    },
  }

  if (article) {
    return {
      title: `${article.title} | Monegoo`,
      description: article.description,
      keywords: article.keywords,
      openGraph: {
        title: article.title,
        description: article.description,
        type: "article",
        locale: language,
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.description,
      },
    }
  }

  const meta = baseMetadata[language] || baseMetadata.en

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  }
}

