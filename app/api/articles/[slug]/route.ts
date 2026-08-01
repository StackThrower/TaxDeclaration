import { NextRequest, NextResponse } from "next/server"
import { getArticle, getRelatedArticles, isLanguage, isCountryCode } from "@/lib/articles"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const languageParam = searchParams.get("language") ?? "uk"
    const countryParam = searchParams.get("country") ?? "ua"
    const { slug } = await context.params

    if (!isLanguage(languageParam) || !isCountryCode(countryParam)) {
      return NextResponse.json(
        { error: "Invalid language or country" },
        { status: 400 }
      )
    }

    const article = getArticle(slug, languageParam, countryParam)

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    const related = getRelatedArticles(slug, languageParam, countryParam, 3)

    return NextResponse.json({ article, related })
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

