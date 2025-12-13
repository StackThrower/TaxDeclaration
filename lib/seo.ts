import type { Metadata } from "next"

/**
 * SEO utilities for WordPress-like functionality
 * All pages are blocked from indexing by default
 */

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  openGraph?: {
    title?: string
    description?: string
    image?: string
    type?: string
  }
  twitter?: {
    title?: string
    description?: string
    image?: string
  }
  noindex?: boolean // Always true, but kept for consistency
}

/**
 * Generate metadata for a page (WordPress-like)
 */
export function generatePageMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    openGraph,
    twitter,
  } = config

  return {
    title,
    description,
    keywords: keywords.join(", "),

    // Always block from indexing
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },

    // Canonical URL
    alternates: canonical ? {
      canonical,
    } : undefined,

    // Open Graph
    openGraph: {
      title: openGraph?.title || title,
      description: openGraph?.description || description,
      type: (openGraph?.type as any) || "website",
      images: openGraph?.image ? [openGraph.image] : undefined,
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: twitter?.title || title,
      description: twitter?.description || description,
      images: twitter?.image ? [twitter.image] : undefined,
    },
  }
}

/**
 * Generate breadcrumb schema (like Yoast SEO)
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  }
}

/**
 * Generate organization schema
 */
export function generateOrganizationSchema(data: {
  name: string
  url: string
  logo?: string
  description?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": data.name,
    "url": data.url,
    "logo": data.logo,
    "description": data.description,
  }
}

/**
 * Generate website schema
 */
export function generateWebsiteSchema(data: {
  name: string
  url: string
  description?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": data.name,
    "url": data.url,
    "description": data.description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${data.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

/**
 * Sanitize text for SEO (remove HTML, trim, etc.)
 */
export function sanitizeForSEO(text: string, maxLength: number = 160): string {
  return text
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim()
    .substring(0, maxLength)
}

/**
 * Generate slug from text (like WordPress)
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim()
}

/**
 * Generate SoftwareApplication schema (for tax calculator tools)
 */
export function generateSoftwareApplicationSchema(data: {
  name: string
  description: string
  url: string
  applicationCategory: string
  operatingSystem?: string
  offers?: {
    price: string
    priceCurrency?: string
  }
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": data.name,
    "description": data.description,
    "url": data.url,
    "applicationCategory": data.applicationCategory,
    "operatingSystem": data.operatingSystem || "Any",
    "offers": data.offers ? {
      "@type": "Offer",
      "price": data.offers.price,
      "priceCurrency": data.offers.priceCurrency || "USD",
    } : {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
  }
}

/**
 * Generate FAQPage schema
 */
export function generateFAQPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  }
}

/**
 * Generate WebPage schema
 */
export function generateWebPageSchema(data: {
  name: string
  description: string
  url: string
  inLanguage?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": data.name,
    "description": data.description,
    "url": data.url,
    "inLanguage": data.inLanguage || "en",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Monegoo Tax Declaration",
      "url": "https://monegoo.com",
    },
  }
}

