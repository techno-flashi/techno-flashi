import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://www.tflash.site'
    : 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/articles/',
          '/ai-tools/',
          '/services/',
          '/about',
          '/contact',
          '/privacy-policy',
          '/terms-of-use',
          '/seo-diagnosis',
          '/youtube',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/setup-admin',
          '/login',
          '/_next/',
          '/test-icons',
          '/*?utm_*',
          '/*?ref=*',
          '/*?source=*',
          '/*?fbclid=*',
          '/*?gclid=*',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/articles/',
          '/ai-tools/',
          '/services/',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/setup-admin',
          '/login',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/articles/',
          '/ai-tools/',
          '/services/',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/setup-admin',
          '/login',
        ],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}