import { MetadataRoute } from 'next'
import { getBlogPosts } from '@/lib/blog'
import { Language } from '@/lib/i18n'

const BASE_URL = 'https://taxered.com'

// Only English and Ukrainian locales are included in the sitemap.
const locales = [
  'uk-ua',  // Ukrainian - Ukraine
  'en-us',  // English - United States
  'en-gb',  // English - United Kingdom
  'en-ca',  // English - Canada
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
  { path: '/blog', priority: 0.8, changeFrequency: 'daily' },       // Blog
]

// Fetch up to this many blog posts per language for the sitemap.
const BLOG_SITEMAP_PAGE_SIZE = 100

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Add all blog posts dynamically. The blog API is language-based, so fetch
  // once per unique language and reuse for every locale sharing that language.
  const blogPostsByLanguage = new Map<Language, Awaited<ReturnType<typeof getBlogPosts>>['posts']>()

  for (const locale of locales) {
    const language = locale.split('-')[0] as Language

    try {
      if (!blogPostsByLanguage.has(language)) {
        const { posts } = await getBlogPosts(language, 1, BLOG_SITEMAP_PAGE_SIZE)
        blogPostsByLanguage.set(language, posts)
      }

      const posts = blogPostsByLanguage.get(language) || []

      posts.forEach((post) => {
        sitemap.push({
          url: `${BASE_URL}/${locale}/blog/${post.slug}`,
          lastModified: post.write_date
            ? new Date(post.write_date)
            : post.published_date
            ? new Date(post.published_date)
            : currentDate,
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      })
    } catch (error) {
      console.error(`Error loading blog posts for ${locale}:`, error)
      // Continue with other locales even if one fails
    }
  }

  return sitemap
}

