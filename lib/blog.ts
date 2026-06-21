import { Language } from "./i18n"

/**
 * Blog integration with the StackThrow ERP blog API.
 *
 * List:    GET /api/v1/blogs/{blogId}/posts?page=1&page_size=5&lang=uk_UA
 * By slug: GET /api/v1/posts/by-slug/{slug}?lang=uk_UA
 *
 * The API exposes content in two languages (uk_UA and en_US). Site languages
 * that have no blog translation fall back to the English version.
 */

const BLOG_API_ORIGIN =
  process.env.NEXT_PUBLIC_BLOG_API_ORIGIN || "https://erp.stackthrow.com"
const BLOG_ID = process.env.NEXT_PUBLIC_BLOG_ID || "5"

// Map the site's UI language to the blog API's supported locales.
const LANG_MAP: Record<Language, string> = {
  uk: "uk_UA",
  en: "en_US",
  fr: "en_US",
  pl: "en_US",
  es: "en_US",
  pt: "en_US",
  de: "en_US",
}

export function toApiLang(language: Language): string {
  return LANG_MAP[language] || "en_US"
}

/**
 * Normalize a slug to its decoded form. Next.js passes route params already
 * URL-encoded; decoding here means callers can safely re-encode exactly once.
 * Falls back to the original string if it isn't valid percent-encoding.
 */
function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug)
  } catch {
    return slug
  }
}

export type BlogAuthor = {
  id: number
  name: string
}

export type BlogTag = {
  id: number
  name: string
}

export type BlogPostSummary = {
  id: number
  slug: string
  name: string
  subtitle: string
  teaser: string
  blog_id: number
  blog_slug: string
  blog_name: string
  author: BlogAuthor | null
  tags: BlogTag[]
  lang: string
  published: boolean
  published_date: string | null
  create_date: string
  write_date: string
  visits: number
  cover_image_url: string | null
  url: string
}

export type BlogPost = BlogPostSummary & {
  content_html: string
  content_text: string
}

export type BlogListMeta = {
  page: number
  page_size: number
  total: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
  next_page: number | null
  prev_page: number | null
  lang: string
  blog?: { id: number; name: string }
}

export type BlogList = {
  posts: BlogPostSummary[]
  meta: BlogListMeta | null
}

/**
 * Resolve a (possibly relative) image path returned by the API into an
 * absolute URL pointing at the ERP origin.
 */
export function resolveCoverImage(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return `${BLOG_API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`
}

/**
 * Fetch a paginated list of published blog posts for a language.
 */
export async function getBlogPosts(
  language: Language,
  page: number = 1,
  pageSize: number = 9
): Promise<BlogList> {
  const lang = toApiLang(language)
  const url =
    `${BLOG_API_ORIGIN}/api/v1/blogs/${BLOG_ID}/posts` +
    `?page=${page}&page_size=${pageSize}&lang=${lang}`

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    })

    if (!res.ok) {
      console.error("Blog list request failed:", res.status, url)
      return { posts: [], meta: null }
    }

    const json = await res.json()
    return {
      posts: Array.isArray(json?.data) ? json.data : [],
      meta: json?.meta ?? null,
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return { posts: [], meta: null }
  }
}

/**
 * Fetch a single blog post by slug, including its rendered HTML content.
 */
export async function getBlogPost(
  slug: string,
  language: Language
): Promise<BlogPost | null> {
  const lang = toApiLang(language)
  // Next.js delivers `params.slug` already URL-encoded. Decode first so we don't
  // double-encode non-ASCII (e.g. Cyrillic) slugs when building the request URL.
  const url =
    `${BLOG_API_ORIGIN}/api/v1/posts/by-slug/${encodeURIComponent(decodeSlug(slug))}` +
    `?lang=${lang}`

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    })

    if (!res.ok) {
      if (res.status !== 404) {
        console.error("Blog post request failed:", res.status, url)
      }
      return null
    }

    const json = await res.json()
    return json?.data ?? null
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}
