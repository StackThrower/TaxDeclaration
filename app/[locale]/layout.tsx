import type React from "react"

// The project is Ukrainian-only: pre-render only the "uk-ua" locale and reject
// any other locale with a 404 instead of rendering it on demand.
export const dynamicParams = false

export function generateStaticParams() {
  return [{ locale: "uk-ua" }]
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
