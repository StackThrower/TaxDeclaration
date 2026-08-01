import { Language } from "./i18n"
import { CountryCode } from "./countries"
import fs from "fs"
import path from "path"
// @ts-ignore - gray-matter doesn't have proper types
import matter from "gray-matter"

export type Article = {
  slug: string
  title: string
  description: string
  language: Language
  country: CountryCode
  category: string
  readTime: string
  publishedAt: string
  updatedAt?: string
  keywords: string[]
  content: string
}

export type ArticleMetadata = Omit<Article, "content">

// Get the articles directory path
const articlesDirectory = path.resolve(process.cwd(), "articles")

// Whitelists for the values that get interpolated into article filenames.
// Anything outside these sets is rejected before touching the filesystem.
const LANGUAGES: readonly Language[] = ["uk", "en", "fr", "pl", "es", "pt", "de"]
const COUNTRIES: readonly CountryCode[] = ["ua", "pl", "fr", "de", "pt", "es", "se", "gb", "us", "ca"]

// Slugs are lowercase, dash-separated words — no dots, no slashes.
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isLanguage(value: string | null | undefined): value is Language {
  return !!value && (LANGUAGES as readonly string[]).includes(value)
}

export function isCountryCode(value: string | null | undefined): value is CountryCode {
  return !!value && (COUNTRIES as readonly string[]).includes(value)
}

/**
 * Resolve an article filename to an absolute path, returning null when the
 * inputs are not well-formed or when the result would escape the articles
 * directory. Both checks matter: the whitelists stop traversal at the source,
 * the containment check is the backstop.
 */
function resolveArticlePath(
  slug: string,
  language: Language,
  country: CountryCode
): string | null {
  if (!isLanguage(language) || !isCountryCode(country)) return null
  if (typeof slug !== "string" || !SLUG_PATTERN.test(slug)) return null

  const filePath = path.resolve(articlesDirectory, `${language}-${country}-${slug}.md`)

  if (filePath !== articlesDirectory && !filePath.startsWith(articlesDirectory + path.sep)) {
    return null
  }

  return filePath
}

/**
 * Get all articles for a specific language and country
 */
export function getArticles(language: Language, country: CountryCode): ArticleMetadata[] {
  if (!isLanguage(language) || !isCountryCode(country)) {
    return []
  }

  try {
    const files = fs.readdirSync(articlesDirectory)
    console.log("Found files:", files.length)

    const articles: ArticleMetadata[] = []

    for (const filename of files) {
      if (!filename.endsWith(".md")) continue

      // Parse filename: {language}-{country}-{slug}.md
      const match = filename.match(/^([a-z]{2})-([a-z]{2})-(.+)\.md$/)
      if (!match) {
        console.log("Filename doesn't match pattern:", filename)
        continue
      }

      const [, fileLang, fileCountry, slug] = match

      // Filter by language and country
      if (fileLang === language && fileCountry === country) {
        console.log("Processing matching file:", filename)
        const filePath = path.join(articlesDirectory, filename)
        const fileContents = fs.readFileSync(filePath, "utf8")
        const { data } = matter(fileContents)

        articles.push({
          slug,
          title: data.title || slug,
          description: data.description || "",
          language: language,
          country: country,
          category: data.category || "general",
          readTime: data.readTime || "5 хв",
          publishedAt: data.publishedAt || new Date().toISOString(),
          updatedAt: data.updatedAt,
          keywords: data.keywords || [],
        })
      }
    }

    console.log("Returning articles:", articles.length)

    return articles.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  } catch (error) {
    console.error("Error reading articles:", error)
    return []
  }
}

/**
 * Get a single article by slug, language, and country
 */
export function getArticle(
  slug: string,
  language: Language,
  country: CountryCode
): Article | null {
  try {
    const filePath = resolveArticlePath(slug, language, country)

    if (!filePath || !fs.existsSync(filePath)) {
      return null
    }

    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      language,
      country,
      category: data.category || "general",
      readTime: data.readTime || "5 хв",
      publishedAt: data.publishedAt || new Date().toISOString(),
      updatedAt: data.updatedAt,
      keywords: data.keywords || [],
      content,
    }
  } catch (error) {
    console.error("Error reading article:", error)
    return null
  }
}

/**
 * Get all available article slugs for static generation
 */
export function getAllArticleSlugs(): Array<{
  slug: string
  language: Language
  country: CountryCode
}> {
  try {
    const files = fs.readdirSync(articlesDirectory)
    const slugs: Array<{
      slug: string
      language: Language
      country: CountryCode
    }> = []

    for (const filename of files) {
      if (!filename.endsWith(".md")) continue

      const match = filename.match(/^([a-z]{2})-([a-z]{2})-(.+)\.md$/)
      if (match) {
        const [, language, country, slug] = match
        slugs.push({
          slug,
          language: language as Language,
          country: country as CountryCode,
        })
      }
    }

    return slugs
  } catch (error) {
    console.error("Error reading article slugs:", error)
    return []
  }
}

/**
 * Get related articles (same country, different topic)
 */
export function getRelatedArticles(
  currentSlug: string,
  language: Language,
  country: CountryCode,
  limit: number = 3
): ArticleMetadata[] {
  const allArticles = getArticles(language, country)
  return allArticles
    .filter((article) => article.slug !== currentSlug)
    .slice(0, limit)
}

