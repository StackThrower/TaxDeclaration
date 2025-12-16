import { MetadataRoute } from 'next'
import { getArticles } from '@/lib/articles'
import { Language } from '@/lib/i18n'
import { CountryCode } from '@/lib/countries'

const BASE_URL = 'https://monegoo.com'

// All supported locale combinations (language-country)
const locales = [
  'uk-ua',  // Ukrainian - Ukraine
  'en-us',  // English - United States
  'en-gb',  // English - United Kingdom
  'en-ca',  // English - Canada
  'fr-fr',  // French - France
  'pl-pl',  // Polish - Poland
  'es-es',  // Spanish - Spain
  'pt-pt',  // Portuguese - Portugal
  'de-de',  // German - Germany
  'sv-se',  // Swedish - Sweden (using 'sv-se' for Swedish locale)
]

// Pages to include in sitemap
interface PageConfig {
  path: string
  priority: number
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
}

const pages: PageConfig[] = [
  { path: '', priority: 0.9, changeFrequency: 'weekly' },           // Home
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },    // About
  { path: '/help', priority: 0.7, changeFrequency: 'weekly' },      // Help
  { path: '/knowledge', priority: 0.8, changeFrequency: 'daily' },  // Knowledge Base
]

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = []
  const currentDate = new Date()

  // Add home page (root)
  sitemap.push({
    url: BASE_URL,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 1.0,
  })

  // Add all locale-based pages
  locales.forEach((locale) => {
    pages.forEach((page) => {
      const url = `${BASE_URL}/${locale}${page.path}`

      sitemap.push({
        url,
        lastModified: currentDate,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      })
    })
  })

  // Add all knowledge base articles dynamically
  locales.forEach((locale) => {
    const [language, country] = locale.split('-') as [Language, CountryCode]

    try {
      const articles = getArticles(language, country)

      articles.forEach((article) => {
        const url = `${BASE_URL}/${locale}/knowledge/${article.slug}`
        const lastModified = article.updatedAt
          ? new Date(article.updatedAt)
          : new Date(article.publishedAt)

        sitemap.push({
          url,
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      })
    } catch (error) {
      console.error(`Error loading articles for ${locale}:`, error)
      // Continue with other locales even if one fails
    }
  })

  return sitemap
}

