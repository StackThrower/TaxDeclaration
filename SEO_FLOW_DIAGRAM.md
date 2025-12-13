# Dynamic SEO Flow Diagram

## 🔄 Complete Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER ENTERS SITE                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Redirect to /uk-ua                            │
│            (Ukrainian language, Ukraine country)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              SERVER COMPONENT (page.tsx)                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  generateMetadata({ params: { locale: 'uk-ua' }})        │  │
│  │    ↓                                                      │  │
│  │  Parse: language='uk', country='ua'                      │  │
│  │    ↓                                                      │  │
│  │  generatePageMetadata('ua', 'uk', 'uk-ua')              │  │
│  │    ↓                                                      │  │
│  │  Returns Metadata object with:                           │  │
│  │    - title: "Податкова декларація F0100214..."          │  │
│  │    - description: "Заповніть податкову..."              │  │
│  │    - keywords: ["податкова декларація", ...]            │  │
│  │    - openGraph: { ... }                                  │  │
│  │    - twitter: { ... }                                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  HTML HEAD GENERATED                             │
│  <head>                                                          │
│    <title>Податкова декларація F0100214...</title>              │
│    <meta name="description" content="Заповніть...">             │
│    <meta name="keywords" content="податкова...">                │
│    <meta property="og:title" content="...">                     │
│    <meta property="og:description" content="...">               │
│    <meta name="twitter:title" content="...">                    │
│    ...                                                           │
│  </head>                                                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│            CLIENT COMPONENT (page-client.tsx)                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  useEffect(() => {                                        │  │
│  │    // Parse locale                                        │  │
│  │    language='uk', country='ua'                            │  │
│  │                                                           │  │
│  │    // Generate SEO metadata                               │  │
│  │    seo = generateSEOMetadata('ua', 'uk')                 │  │
│  │                                                           │  │
│  │    // Update DOM                                          │  │
│  │    document.title = seo.title                            │  │
│  │    document.querySelector('meta[name="description"]')     │  │
│  │      .setAttribute('content', seo.description)            │  │
│  │    // ... update other meta tags                         │  │
│  │  }, [locale, language])                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PAGE DISPLAYED TO USER                         │
│                                                                  │
│  Browser tab shows: "Податкова декларація F0100214..."         │
│  Meta tags ready for crawlers and social media                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
        ▼                                         ▼
┌──────────────────┐                    ┌──────────────────┐
│ USER SWITCHES    │                    │ USER SWITCHES    │
│ TO POLAND        │                    │ TO ENGLISH       │
└────────┬─────────┘                    └────────┬─────────┘
         │                                       │
         ▼                                       ▼
┌──────────────────┐                    ┌──────────────────┐
│  URL: /uk-pl     │                    │  URL: /en-ua     │
└────────┬─────────┘                    └────────┬─────────┘
         │                                       │
         ▼                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              useEffect DETECTS CHANGE                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  locale changed from 'uk-ua' to 'uk-pl' or 'en-ua'       │  │
│  │    ↓                                                      │  │
│  │  Parse new locale                                         │  │
│  │    ↓                                                      │  │
│  │  generateSEOMetadata(new_country, new_language)          │  │
│  │    ↓                                                      │  │
│  │  Update all meta tags instantly:                         │  │
│  │    - document.title                                       │  │
│  │    - meta[name="description"]                            │  │
│  │    - meta[name="keywords"]                               │  │
│  │    - meta[property="og:title"]                           │  │
│  │    - meta[property="og:description"]                     │  │
│  │    - meta[name="twitter:title"]                          │  │
│  │    - meta[name="twitter:description"]                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│            NEW METADATA DISPLAYED INSTANTLY                      │
│          (Without page reload - pure JavaScript)                │
│                                                                  │
│  Browser tab updates immediately                                │
│  Meta tags updated for crawlers                                 │
│  Social media previews will use new data                        │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Detail

### 1. SEO Metadata Generation

```
generateSEOMetadata(countryCode, language)
    │
    ├─► Get country from countries.ts
    │   └─► taxForms: [{ title, description, features }]
    │
    ├─► Access metadata[language][countryCode]
    │   └─► { title, description, keywords }
    │
    └─► Return SEOMetadata
        ├─► title: Localized with forms
        ├─► description: Localized with forms
        └─► keywords: Array of relevant terms
```

### 2. Server-Side Generation (First Load)

```
User requests /uk-ua
    │
    ├─► Next.js calls generateMetadata()
    │   │
    │   ├─► Parse locale: 'uk-ua' → ['uk', 'ua']
    │   │
    │   ├─► Call generatePageMetadata('ua', 'uk', 'uk-ua')
    │   │   │
    │   │   ├─► Call generateSEOMetadata('ua', 'uk')
    │   │   │
    │   │   └─► Return Metadata object
    │   │       ├─► title
    │   │       ├─► description
    │   │       ├─► keywords
    │   │       ├─► openGraph {...}
    │   │       ├─► twitter {...}
    │   │       └─► alternates {...}
    │   │
    │   └─► Next.js injects into <head>
    │
    └─► HTML sent to browser with SEO meta tags
```

### 3. Client-Side Updates (Switching)

```
User clicks country/language switcher
    │
    ├─► useRouter().replace('/new-locale')
    │
    ├─► URL changes (e.g., /uk-ua → /pl-pl)
    │
    ├─► useEffect detects locale change
    │   │
    │   ├─► Parse new locale
    │   │
    │   ├─► Validate country & language
    │   │
    │   ├─► Call generateSEOMetadata(new_country, new_lang)
    │   │
    │   └─► Update DOM:
    │       ├─► document.title = seo.title
    │       ├─► querySelector('meta[name="description"]')
    │       ├─► querySelector('meta[name="keywords"]')
    │       ├─► querySelector('meta[property="og:title"]')
    │       ├─► querySelector('meta[property="og:description"]')
    │       ├─► querySelector('meta[name="twitter:title"]')
    │       └─► querySelector('meta[name="twitter:description"]')
    │
    └─► Browser displays new metadata instantly
```

## 🎯 Key Components

### seo-metadata.ts
```
┌─────────────────────────┐
│  SEO Metadata Storage   │
│                         │
│  metadata: {            │
│    uk: {                │
│      ua: {...},         │
│      pl: {...},         │
│      ...                │
│    },                   │
│    en: {                │
│      ua: {...},         │
│      us: {...},         │
│      ...                │
│    },                   │
│    ...                  │
│  }                      │
│                         │
│  70 combinations total  │
│  (10 countries × 7 langs)│
└─────────────────────────┘
```

### generateMetadata() Function
```
Server Component
    ↓
  async generateMetadata({ params })
    ↓
  Parse locale → [language, country]
    ↓
  generatePageMetadata(country, language, locale)
    ↓
  Return Metadata object
    ↓
  Next.js renders <head> with meta tags
```

### useEffect() Hook
```
Client Component
    ↓
  useEffect(() => {
    ↓
    Parse locale
    ↓
    Generate SEO metadata
    ↓
    Update document.title
    ↓
    Update all meta tags
  }, [locale, language])
```

## 🌍 Example Transformations

### Ukraine → Poland
```
Before (Ukraine):
URL: /uk-ua
Title: "Податкова декларація F0100214 та F0121214 - Україна 2025"
Keywords: ["податкова декларація", "F0100214", "F0121214", ...]

        ↓ User switches country to Poland ↓

After (Poland):
URL: /uk-pl
Title: "Розliczenie podatkowe PIT PIT-37, PIT-38, PIT-39 - Polska 2025"
Keywords: ["PIT", "zeznanie podatkowe", "PIT-37", ...]
```

### Ukrainian → English
```
Before (Ukrainian):
URL: /uk-ua
Title: "Податкова декларація F0100214 та F0121214 - Україна 2025"
Description: "Заповніть податкову декларацію онлайн..."

        ↓ User switches language to English ↓

After (English):
URL: /en-ua
Title: "Tax Declaration F0100214 & F0121214 - Ukraine 2025"
Description: "File your tax declaration online..."
```

## ⚡ Performance

```
Server-Side (First Load):
  ├─► Metadata generation: <1ms
  ├─► HTML rendering: ~50-100ms
  └─► Total: Fast (built-in Next.js)

Client-Side (Updates):
  ├─► Metadata generation: <1ms
  ├─► DOM updates: <5ms
  ├─► Visual update: Instant
  └─► Total: Imperceptible to user
```

## 🔍 SEO Crawler View

```
Google Bot visits /uk-ua:
  1. Fetches HTML
  2. Reads <head>:
     - <title>Податкова декларація F0100214...</title>
     - <meta name="description" content="Заповніть...">
     - <meta name="keywords" content="податкова...">
  3. Indexes page with Ukrainian content
  4. Associates with Ukraine searches

User shares /en-us on Facebook:
  1. Facebook scraper visits URL
  2. Reads Open Graph tags:
     - og:title: "Tax Return Form 1040..."
     - og:description: "File your tax return..."
     - og:image: "/placeholder-logo.png"
  3. Generates rich preview card
  4. Shows to user's friends
```

