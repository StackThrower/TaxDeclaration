#!/usr/bin/env node

// Test script to verify about page translations
import { translations } from './lib/i18n.js'

const languages = ['uk', 'en', 'fr', 'pl', 'es', 'pt', 'de']
const requiredKeys = [
  'about.title',
  'about.subtitle',
  'about.intro',
  'about.mission.title',
  'about.mission.description',
  'about.features.title',
  'about.features.privacy',
  'about.features.free',
  'about.features.opensource',
  'about.features.multilang',
  'about.features.calculator',
  'about.features.forms',
  'about.technology.title',
  'about.technology.description',
  'about.contact.title',
  'about.contact.description',
]

console.log('Testing about page translations...\n')

let allPassed = true

for (const lang of languages) {
  console.log(`Testing ${lang.toUpperCase()}:`)
  const langTranslations = translations[lang]

  for (const key of requiredKeys) {
    if (langTranslations[key]) {
      console.log(`  ✓ ${key}`)
    } else {
      console.log(`  ✗ ${key} - MISSING`)
      allPassed = false
    }
  }
  console.log()
}

if (allPassed) {
  console.log('✓ All translations present!')
  process.exit(0)
} else {
  console.log('✗ Some translations are missing!')
  process.exit(1)
}

