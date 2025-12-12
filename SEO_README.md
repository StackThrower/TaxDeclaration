# 🔒 SEO Configuration - Blocked from Indexing

## Overview

This project is configured to block all search engines from indexing, similar to WordPress "Discourage search engines from indexing this site" option.

## 🚫 Indexing Prevention Layers

### 1. **robots.txt** (Public folder)
Located at `/public/robots.txt`:
```
User-agent: *
Disallow: /
```

### 2. **Dynamic robots.ts**
Next.js generates `/robots.txt` dynamically via `/app/robots.ts`

### 3. **Meta Tags** (HTML)
Every page includes:
```html
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
<meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
```

### 4. **X-Robots-Tag** (HTTP Headers)
Server-level headers via `next.config.mjs` and `middleware.ts`:
```
X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex
```

### 5. **Metadata API**
Next.js metadata configured in `app/layout.tsx`:
```typescript
robots: {
  index: false,
  follow: false,
  nocache: true,
}
```

## 📁 Files Structure

```
/app
  ├── layout.tsx           # Root layout with noindex meta
  ├── robots.ts            # Dynamic robots.txt generator
  ├── sitemap.ts           # Empty sitemap (blocked)
  └── [pages]              # All pages inherit noindex

/lib
  └── seo.ts               # SEO utilities (WordPress-like)

/public
  └── robots.txt           # Static robots.txt (backup)

/middleware.ts             # Server-level X-Robots-Tag
/next.config.mjs          # Security headers
```

## 🎯 Features (WordPress-like)

### SEO Meta Tags
- ✅ Title optimization
- ✅ Meta descriptions
- ✅ Keywords
- ✅ Canonical URLs
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Structured data (Schema.org)

### Blocking Features
- ✅ No indexing (noindex)
- ✅ No following links (nofollow)
- ✅ No caching (nocache, noarchive)
- ✅ No snippets (nosnippet)
- ✅ No image indexing (noimageindex)
- ✅ Blocks all major search engines (Google, Bing, Yandex, etc.)

### Security Headers
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection
- ✅ Strict-Transport-Security (HSTS)
- ✅ Referrer-Policy
- ✅ Permissions-Policy

## 📝 Usage Examples

### Basic Page SEO
```typescript
import { generatePageMetadata } from "@/lib/seo"

export const metadata = generatePageMetadata({
  title: "Privacy Policy",
  description: "Our privacy policy and data protection information",
  keywords: ["privacy", "data protection", "GDPR"],
  canonical: "https://monegoo.com/privacy",
})
```

### Breadcrumbs Schema
```typescript
import { generateBreadcrumbSchema } from "@/lib/seo"

const breadcrumbs = generateBreadcrumbSchema([
  { name: "Home", url: "https://monegoo.com" },
  { name: "Help", url: "https://monegoo.com/help" },
])

// Add to page:
<script type="application/ld+json">
  {JSON.stringify(breadcrumbs)}
</script>
```

### Organization Schema
```typescript
import { generateOrganizationSchema } from "@/lib/seo"

const org = generateOrganizationSchema({
  name: "Monegoo",
  url: "https://monegoo.com",
  logo: "https://monegoo.com/logo.png",
  description: "Tax declaration system",
})
```

## 🔍 Verification

### Check robots.txt
```bash
curl https://your-domain.com/robots.txt
```

Expected output:
```
User-agent: *
Disallow: /
```

### Check Meta Tags
```bash
curl -s https://your-domain.com | grep -i "robots"
```

Expected output:
```html
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
```

### Check HTTP Headers
```bash
curl -I https://your-domain.com | grep -i "x-robots"
```

Expected output:
```
X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex
```

### Test with Google Search Console
1. Add property to Google Search Console
2. Request indexing (will be rejected)
3. Check Coverage report (should show "Excluded by 'noindex' tag")

## 🔓 How to Enable Indexing (If Needed)

If you want to allow indexing in the future:

### 1. Update robots.txt
```
User-agent: *
Allow: /
```

### 2. Update app/robots.ts
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://monegoo.com/sitemap.xml',
  }
}
```

### 3. Update app/layout.tsx
```typescript
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
  },
}
```

### 4. Remove meta tags from head
Comment out or remove:
```html
<meta name="robots" content="noindex, nofollow..." />
```

### 5. Update middleware.ts
Comment out X-Robots-Tag header

### 6. Update next.config.mjs
Remove X-Robots-Tag from headers array

## 📊 SEO Best Practices (When Indexing Enabled)

- Use unique titles and descriptions for each page
- Optimize images (alt text, size, format)
- Use semantic HTML (h1, h2, etc.)
- Add structured data (Schema.org)
- Create XML sitemap
- Set canonical URLs
- Use breadcrumbs
- Optimize page speed
- Mobile-friendly design
- HTTPS enabled

## 🔗 Useful Links

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org)
- [Open Graph Protocol](https://ogp.me)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)

## 🛠️ Tools for SEO Testing

- [Google Search Console](https://search.google.com/search-console)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Meta Tags Checker](https://metatags.io)
- [Robots.txt Tester](https://www.google.com/webmasters/tools/robots-testing-tool)
- [PageSpeed Insights](https://pagespeed.web.dev)

## 📦 Dependencies

No additional dependencies required. All SEO features use:
- Next.js built-in Metadata API
- Next.js built-in routing
- Standard HTML meta tags
- HTTP headers

## 🤝 WordPress Comparison

| Feature | WordPress (Yoast) | This Project |
|---------|------------------|--------------|
| robots.txt | ✅ | ✅ |
| Meta robots | ✅ | ✅ |
| X-Robots-Tag | ✅ | ✅ |
| Sitemap | ✅ | ✅ (blocked) |
| Open Graph | ✅ | ✅ |
| Twitter Cards | ✅ | ✅ |
| Schema.org | ✅ | ✅ |
| Breadcrumbs | ✅ | ✅ |
| Canonical URLs | ✅ | ✅ |
| No-index toggle | ✅ | ✅ (forced) |

## 📄 License

Same as main project.

