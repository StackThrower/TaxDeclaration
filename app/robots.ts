import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Allow indexing by default
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://taxered.com/sitemap.xml',
  }
}

