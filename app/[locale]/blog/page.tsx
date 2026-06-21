import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Newspaper, ArrowRight, ArrowLeft } from "lucide-react"
import { getBlogPosts, resolveCoverImage } from "@/lib/blog"
import { Language } from "@/lib/i18n"

// Always render on request with fresh data from the blog API (no caching).
export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}

const translations = {
  uk: {
    badge: "Блог",
    title: "Блог Taxered",
    description: "Новини, поради та аналітика про оподаткування й інвестиції",
    readMore: "Читати далі",
    noPosts: "Дописи скоро з'являться",
    working: "Ми працюємо над створенням корисного контенту для вас",
    prev: "Попередня",
    next: "Наступна",
    page: "Сторінка",
    of: "з",
  },
  en: {
    badge: "Blog",
    title: "Taxered Blog",
    description: "News, tips and insights about taxation and investing",
    readMore: "Read more",
    noPosts: "Posts coming soon",
    working: "We are working on creating useful content for you",
    prev: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
  },
}

function getTranslations(language: Language) {
  return language === "uk" ? translations.uk : translations.en
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const language = locale.split("-")[0] as Language
  const t = getTranslations(language)

  const canonicalUrl = `https://taxered.com/${locale}/blog`

  return {
    title: `${t.title} | Taxered`,
    description: t.description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": "https://taxered.com",
        "uk-UA": "/uk-ua/blog",
        "en-US": "/en-us/blog",
      },
    },
    openGraph: {
      title: `${t.title} | Taxered`,
      description: t.description,
      url: canonicalUrl,
      type: "website",
      locale,
    },
  }
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { page: pageParam } = await searchParams
  const language = locale.split("-")[0] as Language
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1)

  const { posts, meta } = await getBlogPosts(language, page)
  const t = getTranslations(language)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Newspaper className="w-4 h-4" />
            <span className="text-sm font-medium">{t.badge}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Newspaper className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">{t.noPosts}</h3>
              <p className="text-muted-foreground">{t.working}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const cover = resolveCoverImage(post.cover_image_url)
              return (
                <Link key={post.id} href={`/${locale}/blog/${post.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full overflow-hidden flex flex-col">
                    {cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover}
                        alt={post.name}
                        className="w-full h-44 object-cover"
                        loading="lazy"
                      />
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        {post.tags?.[0] ? (
                          <Badge variant="secondary">{post.tags[0].name}</Badge>
                        ) : (
                          <span />
                        )}
                        {post.published_date && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.published_date).toLocaleDateString(locale)}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {post.name}
                      </CardTitle>
                      {(post.subtitle || post.teaser) && (
                        <CardDescription className="line-clamp-2">
                          {post.subtitle || post.teaser}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        {t.readMore}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.total_pages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.has_prev}
              asChild={meta.has_prev}
            >
              {meta.has_prev ? (
                <Link href={`/${locale}/blog?page=${meta.prev_page}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t.prev}
                </Link>
              ) : (
                <span>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t.prev}
                </span>
              )}
            </Button>

            <span className="text-sm text-muted-foreground">
              {t.page} {meta.page} {t.of} {meta.total_pages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={!meta.has_next}
              asChild={meta.has_next}
            >
              {meta.has_next ? (
                <Link href={`/${locale}/blog?page=${meta.next_page}`}>
                  {t.next}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              ) : (
                <span>
                  {t.next}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              )}
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
