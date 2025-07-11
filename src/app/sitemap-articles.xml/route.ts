import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // جلب جميع المقالات المنشورة
    const { data: articles, error } = await supabase
      .from('articles')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles for sitemap:', error);
      return new NextResponse('Error generating sitemap', { status: 500 });
    }

    const baseUrl = 'https://www.tflash.site';
    
    // إنشاء XML لخريطة الموقع
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <!-- صفحة المقالات الرئيسية -->
  <url>
    <loc>${baseUrl}/articles</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- صفحات المقالات الفردية -->
${articles?.map(article => {
  const lastmod = article.updated_at || article.published_at || new Date().toISOString();
  const publishedDate = new Date(article.published_at || new Date());
  const isRecent = (Date.now() - publishedDate.getTime()) < (7 * 24 * 60 * 60 * 1000); // آخر 7 أيام
  
  return `  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>
    <changefreq>${isRecent ? 'daily' : 'weekly'}</changefreq>
    <priority>${isRecent ? '0.9' : '0.8'}</priority>${isRecent ? `
    <news:news>
      <news:publication>
        <news:name>TechnoFlash</news:name>
        <news:language>ar</news:language>
      </news:publication>
      <news:publication_date>${publishedDate.toISOString()}</news:publication_date>
    </news:news>` : ''}
  </url>`;
}).join('\n') || ''}
  
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800', // 30 دقيقة للمقالات
      },
    });

  } catch (error) {
    console.error('Error generating articles sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
