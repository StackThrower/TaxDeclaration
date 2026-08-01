import { NextRequest, NextResponse } from "next/server"
import { getArticles, isLanguage, isCountryCode } from "@/lib/articles"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const languageParam = searchParams.get("language") ?? "uk"
    const countryParam = searchParams.get("country") ?? "ua"

    if (!isLanguage(languageParam) || !isCountryCode(countryParam)) {
      return NextResponse.json(
        { error: "Invalid language or country" },
        { status: 400 }
      )
    }

    const articles = getArticles(languageParam, countryParam)

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("Error in /api/articles:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

