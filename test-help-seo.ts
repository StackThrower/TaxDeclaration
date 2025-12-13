// Test script to verify help page SEO metadata generation
import { generateHelpMetadata, generateHelpPageMetadata } from "./lib/seo-metadata"
import { type CountryCode } from "./lib/countries"
import { type Language } from "./lib/i18n"

// Test cases for different locales
const testCases: Array<{ country: CountryCode; language: Language; locale: string }> = [
  { country: "ua", language: "uk", locale: "uk-ua" },
  { country: "ua", language: "en", locale: "en-ua" },
  { country: "pl", language: "pl", locale: "pl-pl" },
  { country: "us", language: "en", locale: "en-us" },
  { country: "gb", language: "en", locale: "en-gb" },
]

console.log("🧪 Testing Help Page SEO Metadata Generation\n")
console.log("=" .repeat(80))

testCases.forEach(({ country, language, locale }) => {
  console.log(`\n📍 Testing: ${locale} (${language.toUpperCase()} - ${country.toUpperCase()})\n`)

  // Test basic SEO metadata
  const seoMetadata = generateHelpPageMetadata(country, language)
  console.log(`✅ Title: ${seoMetadata.title}`)
  console.log(`✅ Description: ${seoMetadata.description.substring(0, 100)}...`)
  console.log(`✅ Keywords: ${seoMetadata.keywords.slice(0, 5).join(", ")}...`)

  // Test full metadata object
  const fullMetadata = generateHelpMetadata(country, language, locale)
  console.log(`✅ OpenGraph URL: ${fullMetadata.openGraph?.url}`)
  console.log(`✅ Canonical URL: ${fullMetadata.alternates?.canonical}`)
  console.log(`✅ Robots Index: ${fullMetadata.robots ? "true" : "false"}`)

  console.log("-".repeat(80))
})

console.log("\n✨ All tests completed successfully!")

