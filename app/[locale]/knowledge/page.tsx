import { Metadata } from "next"
import { headers } from "next/headers"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, ArrowRight } from "lucide-react"
import { getArticles } from "@/lib/articles"
import { Language } from "@/lib/i18n"
import { CountryCode } from "@/lib/countries"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const language = locale.split("-")[0] as Language

  const titles: Record<Language, string> = {
    uk: "База знань з оподаткування | Monegoo",
    en: "Tax Knowledge Base | Monegoo",
    fr: "Base de connaissances fiscales | Monegoo",
    pl: "Baza wiedzy podatkowej | Monegoo",
    es: "Base de conocimientos fiscales | Monegoo",
    pt: "Base de conhecimento fiscal | Monegoo",
    de: "Steuerliche Wissensdatenbank | Monegoo",
  }

  const descriptions: Record<Language, string> = {
    uk: "Дізнайтеся більше про податкове законодавство, як правильно заповнювати декларації та оптимізувати податкові зобов'язання",
    en: "Learn more about tax legislation, how to properly fill out declarations and optimize tax obligations",
    fr: "En savoir plus sur la législation fiscale, comment remplir correctement les déclarations et optimiser les obligations fiscales",
    pl: "Dowiedz się więcej o przepisах podatkowych, jak prawidłowo wypełniać deklaracje i optymalizować zobowiązania podatkowe",
    es: "Aprende más sobre la legislación fiscal, cómo completar correctamente las declaraciones y optimizar las obligaciones fiscales",
    pt: "Saiba mais sobre legislação tributária, como preencher corretamente as declarações e otimizar obrigações fiscais",
    de: "Erfahren Sie mehr über Steuergesetzgebung, wie Sie Erklärungen korrekt ausfüllen und Steuerverpflichtungen optimieren",
  }

  const canonicalUrl = `https://monegoo.com/${locale}/knowledge`

  return {
    title: titles[language] || titles.en,
    description: descriptions[language] || descriptions.en,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: titles[language] || titles.en,
      description: descriptions[language] || descriptions.en,
      url: canonicalUrl,
      type: "website",
      locale: locale,
    },
  }
}

export default async function KnowledgeBasePage({ params }: Props) {
  const { locale } = await params
  const language = locale.split("-")[0] as Language
  const country = locale.split("-")[1] as CountryCode

  // Get articles on server side
  const articles = getArticles(language, country)

  const translations = {
    uk: {
      badge: "База знань",
      title: "База знань з оподаткування",
      description: "Дізнайтеся більше про податкове законодавство, як правильно заповнювати декларації та оптимізувати податкові зобов'язання",
      readMore: "Читати далі",
      noArticles: "Статті скоро з'являться",
      working: "Ми працюємо над створенням корисного контенту для вас",
    },
    en: {
      badge: "Knowledge Base",
      title: "Tax Knowledge Base",
      description: "Learn more about tax legislation, how to properly fill out declarations and optimize tax obligations",
      readMore: "Read more",
      noArticles: "Articles coming soon",
      working: "We are working on creating useful content for you",
    },
    fr: {
      badge: "Base de connaissances",
      title: "Base de connaissances fiscales",
      description: "En savoir plus sur la législation fiscale, comment remplir correctement les déclarations et optimiser les obligations fiscales",
      readMore: "Lire la suite",
      noArticles: "Articles à venir",
      working: "Nous travaillons sur la création de contenu utile pour vous",
    },
    pl: {
      badge: "Baza wiedzy",
      title: "Baza wiedzy podatkowej",
      description: "Dowiedz się więcej o przepisach podatkowych, jak prawidłowo wypełniać deklaracje i optymalizować zobowiązania podatkowe",
      readMore: "Czytaj więcej",
      noArticles: "Artykuły wkrótce",
      working: "Pracujemy nad stworzeniem przydatnych treści dla Ciebie",
    },
    es: {
      badge: "Base de conocimientos",
      title: "Base de conocimientos fiscales",
      description: "Aprende más sobre la legislación fiscal, cómo completar correctamente las declaraciones y optimizar las obligaciones fiscales",
      readMore: "Leer más",
      noArticles: "Artículos próximamente",
      working: "Estamos trabajando en crear contenido útil para ti",
    },
    pt: {
      badge: "Base de conhecimento",
      title: "Base de conhecimento fiscal",
      description: "Saiba mais sobre legislação tributária, como preencher corretamente as declarações e otimizar obrigações fiscais",
      readMore: "Leia mais",
      noArticles: "Artigos em breve",
      working: "Estamos trabalhando na criação de conteúdo útil para você",
    },
    de: {
      badge: "Wissensdatenbank",
      title: "Steuerliche Wissensdatenbank",
      description: "Erfahren Sie mehr über Steuergesetzgebung, wie Sie Erklärungen korrekt ausfüllen und Steuerverpflichtungen optimieren",
      readMore: "Mehr lesen",
      noArticles: "Artikel folgen bald",
      working: "Wir arbeiten an der Erstellung nützlicher Inhalte für Sie",
    },
  }

  const t = translations[language] || translations.en

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">{t.badge}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                {t.noArticles}
              </h3>
              <p className="text-muted-foreground">
                {t.working}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link key={article.slug} href={`/${locale}/knowledge/${article.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="secondary" className="capitalize">
                        {article.category}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {article.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" size="sm" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {t.readMore}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* SEO-friendly text section */}
        {articles.length > 0 && (
          <div className="mt-16 prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4">
              {language === "uk" ? "Про нашу базу знань" : "About our knowledge base"}
            </h2>
            <p className="text-muted-foreground">
              {language === "uk"
                ? "Наша база знань містить детальні статті про оподаткування, які допоможуть вам розібратися з податковим законодавством, навчать правильно заповнювати декларації та оптимізувати податкові зобов'язання. Всі матеріали підготовлені з урахуванням актуального законодавства та містять практичні поради."
                : "Our knowledge base contains detailed articles on taxation that will help you understand tax legislation, teach you how to properly fill out declarations and optimize tax obligations. All materials are prepared taking into account current legislation and contain practical advice."}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

