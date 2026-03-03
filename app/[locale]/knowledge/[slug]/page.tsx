import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getArticle, getRelatedArticles } from "@/lib/articles"
import { Language } from "@/lib/i18n"
import { CountryCode } from "@/lib/countries"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const language = locale.split("-")[0] as Language
  const country = locale.split("-")[1] as CountryCode

  const article = getArticle(slug, language, country)

  if (!article) {
    return {
      title: "Article not found",
    }
  }

  const canonicalUrl = `https://taxered.com/${locale}/knowledge/${slug}`

  return {
    title: `${article.title} | Taxered`,
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": "https://taxered.com",
      },
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      locale: locale,
      url: canonicalUrl,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params
  const language = locale.split("-")[0] as Language
  const country = locale.split("-")[1] as CountryCode

  // Get article
  const article = getArticle(slug, language, country)

  if (!article) {
    notFound()
  }

  // Get related articles
  const relatedArticles = getRelatedArticles(slug, language, country, 3)

  const translations = {
    uk: {
      back: "Повернутися до списку",
      category: "Категорія",
      readTime: "Час читання",
      publishedAt: "Опубліковано",
      relatedArticles: "Схожі статті",
      readMore: "Читати далі",
    },
    en: {
      back: "Back to list",
      category: "Category",
      readTime: "Read time",
      publishedAt: "Published",
      relatedArticles: "Related articles",
      readMore: "Read more",
    },
    fr: {
      back: "Retour à la liste",
      category: "Catégorie",
      readTime: "Temps de lecture",
      publishedAt: "Publié",
      relatedArticles: "Articles connexes",
      readMore: "Lire la suite",
    },
    pl: {
      back: "Powrót do listy",
      category: "Kategoria",
      readTime: "Czas czytania",
      publishedAt: "Opublikowano",
      relatedArticles: "Podobne artykuły",
      readMore: "Czytaj więcej",
    },
    es: {
      back: "Volver a la lista",
      category: "Categoría",
      readTime: "Tiempo de lectura",
      publishedAt: "Publicado",
      relatedArticles: "Artículos relacionados",
      readMore: "Leer más",
    },
    pt: {
      back: "Voltar à lista",
      category: "Categoria",
      readTime: "Tempo de leitura",
      publishedAt: "Publicado",
      relatedArticles: "Artigos relacionados",
      readMore: "Leia mais",
    },
    de: {
      back: "Zurück zur Liste",
      category: "Kategorie",
      readTime: "Lesezeit",
      publishedAt: "Veröffentlicht",
      relatedArticles: "Verwandte Artikel",
      readMore: "Mehr lesen",
    },
  }

  const t = translations[language] || translations.en

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back button */}
        <Link href={`/${locale}/knowledge`}>
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.back}
          </Button>
        </Link>

        {/* Article header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Badge variant="secondary" className="capitalize">
              {article.category}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {article.readTime}
            </span>
            <span className="text-sm text-muted-foreground">
              {new Date(article.publishedAt).toLocaleDateString(locale)}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {article.title}
          </h1>

          <p className="text-xl text-muted-foreground">
            {article.description}
          </p>
        </header>

        {/* Article content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
              p: ({ node, ...props }) => <p className="mb-4 leading-7" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
              li: ({ node, ...props }) => <li className="leading-7" {...props} />,
              a: ({ node, ...props }) => (
                <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />
              ),
              code: ({ node, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '')
                return match ? (
                  <code className={`block bg-muted p-4 rounded-lg overflow-x-auto ${className}`} {...props}>
                    {children}
                  </code>
                ) : (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props}>
                    {children}
                  </code>
                )
              },
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-6">
                  <table className="min-w-full border-collapse border border-border" {...props} />
                </div>
              ),
              thead: ({ node, ...props }) => (
                <thead className="bg-muted" {...props} />
              ),
              tbody: ({ node, ...props }) => (
                <tbody {...props} />
              ),
              tr: ({ node, ...props }) => (
                <tr className="border-b border-border" {...props} />
              ),
              th: ({ node, ...props }) => (
                <th className="px-4 py-3 text-left font-semibold border border-border bg-muted" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="px-4 py-3 border border-border" {...props} />
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">{t.relatedArticles}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link key={related.slug} href={`/${locale}/knowledge/${related.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6">
                      <Badge variant="secondary" className="capitalize mb-2">
                        {related.category}
                      </Badge>
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {related.description}
                      </p>
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

