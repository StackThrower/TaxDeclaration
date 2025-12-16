import { NextRequest, NextResponse } from "next/server"
import { getArticles } from "@/lib/articles"
import { Language } from "@/lib/i18n"
import { CountryCode } from "@/lib/countries"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const language = searchParams.get("language") as Language || "uk"
    const country = searchParams.get("country") as CountryCode || "ua"

    console.log("API /api/articles called with:", { language, country })

    const articles = getArticles(language, country)

    console.log("API /api/articles returning:", articles.length, "articles")

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("Error in /api/articles:", error)
    return NextResponse.json({ articles: [], error: String(error) }, { status: 500 })
  }
}

