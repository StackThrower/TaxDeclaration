import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production'
  const allowIndexing = process.env.ALLOW_INDEXING === 'true'

  // If in production and indexing is allowed
  if (isProduction && allowIndexing) {
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/', '/admin/'],
        },
      ],
      sitemap: 'https://monegoo.com/sitemap.xml',
    }
  }

  // By default, block everything (development/staging)
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
    sitemap: 'https://monegoo.com/sitemap.xml',
  }
}

