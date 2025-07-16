import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/cdn-cgi/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/cdn-cgi/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/cdn-cgi/'],
      },
    ],
    sitemap: [
      'https://tflash.site/sitemap.xml',
      'https://tflash.site/rss.xml',
    ],
  }
}
