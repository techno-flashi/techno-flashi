import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TechnoFlash - بوابتك للمستقبل التقني',
    short_name: 'TechnoFlash',
    description: 'منصة ويب متكاملة تقدم مقالات تقنية حصرية، ودليل شامل لأدوات الذكاء الاصطناعي، وخدمات متخصصة',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#38bdf8',
    orientation: 'portrait',
    scope: '/',
    lang: 'ar',
    dir: 'rtl',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['technology', 'education', 'productivity'],
    shortcuts: [
      {
        name: 'المقالات',
        short_name: 'مقالات',
        description: 'تصفح أحدث المقالات التقنية',
        url: '/articles',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'أدوات الذكاء الاصطناعي',
        short_name: 'أدوات AI',
        description: 'اكتشف أدوات الذكاء الاصطناعي',
        url: '/ai-tools',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'الخدمات',
        short_name: 'خدمات',
        description: 'تصفح خدماتنا التقنية',
        url: '/services',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
    ],
  }
}
