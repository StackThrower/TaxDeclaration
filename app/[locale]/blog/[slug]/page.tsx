import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Eye, User } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getBlogPost, getBlogPosts, resolveCoverImage } from "@/lib/blog"
import { Language } from "@/lib/i18n"

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

const translations = {
  uk: {
    back: "Повернутися до блогу",
    relatedPosts: "Інші дописи",
    readMore: "Читати далі",
    views: "переглядів",
  },
  en: {
    back: "Back to blog",
    relatedPosts: "More posts",
    readMore: "Read more",
    views: "views",
  },
}

function getTranslations(language: Language) {
  return language === "uk" ? translations.uk : translations.en
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const language = locale.split("-")[0] as Language
  const post = await getBlogPost(slug, language)

  if (!post) {
    return { title: "Post not found" }
  }

  const description = post.subtitle || post.teaser || ""
  const canonicalUrl = `https://taxered.com/${locale}/blog/${slug}`
  const cover = resolveCoverImage(post.cover_image_url)

  return {
    title: `${post.name} | Taxered`,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: { "x-default": "https://taxered.com" },
    },
    openGraph: {
      title: post.name,
      description,
      type: "article",
      locale,
      url: canonicalUrl,
      publishedTime: post.published_date || undefined,
      modifiedTime: post.write_date || post.published_date || undefined,
      authors: post.author ? [post.author.name] : undefined,
      images: cover ? [{ url: cover }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.name,
      description,
      images: cover ? [cover] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  const language = locale.split("-")[0] as Language

  const post = await getBlogPost(slug, language)

  if (!post) {
    notFound()
  }

  const t = getTranslations(language)
  const cover = resolveCoverImage(post.cover_image_url)
  const description = post.subtitle || post.teaser || ""

  // Fetch a few other posts to show as related (exclude the current one).
  const { posts: otherPosts } = await getBlogPosts(language, 1, 4)
  const relatedPosts = otherPosts.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back button */}
        <Link href={`/${locale}/blog`}>
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.back}
          </Button>
        </Link>

        {/* Post header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {post.tags?.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
            {post.published_date && (
              <span className="text-sm text-muted-foreground">
                {new Date(post.published_date).toLocaleDateString(locale)}
              </span>
            )}
            {post.author && (
              <span className="flex items-center text-sm text-muted-foreground">
                <User className="w-3.5 h-3.5 mr-1" />
                {post.author.name}
              </span>
            )}
            {typeof post.visits === "number" && post.visits > 0 && (
              <span className="flex items-center text-sm text-muted-foreground">
                <Eye className="w-3.5 h-3.5 mr-1" />
                {post.visits} {t.views}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.name}</h1>

          {description && (
            <p className="text-xl text-muted-foreground">{description}</p>
          )}
        </header>

        {/* Cover image */}
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={post.name}
            className="w-full rounded-xl mb-10 object-cover max-h-[480px]"
          />
        )}

        {/* Post content */}
        <div
          className="blog-content max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content_html || "" }}
        />

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">{t.relatedPosts}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/${locale}/blog/${related.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6">
                      {related.tags?.[0] && (
                        <Badge variant="secondary" className="mb-2">
                          {related.tags[0].name}
                        </Badge>
                      )}
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {related.name}
                      </h3>
                      {(related.subtitle || related.teaser) && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {related.subtitle || related.teaser}
                        </p>
                      )}
                      <Button variant="ghost" size="sm" className="w-full">
                        {t.readMore}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <Footer />
    </main>
  )
}
