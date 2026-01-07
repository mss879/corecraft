import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/', '/private', '/private/'],
    },
    sitemap: 'https://www.corecraft.agency/sitemap.xml',
  }
}
