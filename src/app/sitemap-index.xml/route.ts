import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://www.tflash.site';
  const currentDate = new Date().toISOString();
  
  // إنشاء مؤشر خرائط الموقع
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <!-- خريطة الموقع الرئيسية -->
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  
  <!-- خريطة موقع الأدوات -->
  <sitemap>
    <loc>${baseUrl}/sitemap-tools.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  
  <!-- خريطة موقع المقالات -->
  <sitemap>
    <loc>${baseUrl}/sitemap-articles.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  
  <!-- خريطة موقع RSS -->
  <sitemap>
    <loc>${baseUrl}/rss.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  
</sitemapindex>`;

  return new NextResponse(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
