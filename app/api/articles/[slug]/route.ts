import { NextRequest, NextResponse } from "next/server"
import { getArticle, getRelatedArticles } from "@/lib/articles"
import { Language } from "@/lib/i18n"
import { CountryCode } from "@/lib/countries"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const language = searchParams.get("language") as Language || "uk"
    const country = searchParams.get("country") as CountryCode || "ua"
    const { slug } = await context.params

    const article = getArticle(slug, language, country)

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    const related = getRelatedArticles(slug, language, country, 3)

    return NextResponse.json({ article, related })
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

