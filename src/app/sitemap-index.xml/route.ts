import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = 'https://www.tflash.site';
    const currentDate = new Date().toISOString().split('T')[0];

    // إنشاء مؤشر خرائط الموقع
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-tools.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-articles.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

    return new NextResponse(sitemapIndex, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    return new NextResponse('Error generating sitemap index', { status: 500 });
  }
}
