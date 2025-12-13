import { generateSEOMetadata } from './lib/seo-metadata'

// Test different country-language combinations
console.log('\n=== Ukraine (Ukrainian) ===')
const ukUa = generateSEOMetadata('ua', 'uk')
console.log('Title:', ukUa.title)
console.log('Description:', ukUa.description)
console.log('Keywords:', ukUa.keywords.slice(0, 5).join(', '), '...')

console.log('\n=== United States (English) ===')
const enUs = generateSEOMetadata('us', 'en')
console.log('Title:', enUs.title)
console.log('Description:', enUs.description)
console.log('Keywords:', enUs.keywords.slice(0, 5).join(', '), '...')

console.log('\n=== Poland (Polish) ===')
const plPl = generateSEOMetadata('pl', 'pl')
console.log('Title:', plPl.title)
console.log('Description:', plPl.description)
console.log('Keywords:', plPl.keywords.slice(0, 5).join(', '), '...')

console.log('\n=== France (French) ===')
const frFr = generateSEOMetadata('fr', 'fr')
console.log('Title:', frFr.title)
console.log('Description:', frFr.description)
console.log('Keywords:', frFr.keywords.slice(0, 5).join(', '), '...')

console.log('\n=== Germany (German) ===')
const deDe = generateSEOMetadata('de', 'de')
console.log('Title:', deDe.title)
console.log('Description:', deDe.description)
console.log('Keywords:', deDe.keywords.slice(0, 5).join(', '), '...')

console.log('\n=== Ukraine (English) ===')
const enUa = generateSEOMetadata('ua', 'en')
console.log('Title:', enUa.title)
console.log('Description:', enUa.description)
console.log('Keywords:', enUa.keywords.slice(0, 5).join(', '), '...')

