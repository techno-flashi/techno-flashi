import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const baseUrl = 'https://www.tflash.site';
    const currentDate = new Date().toISOString();

    // جلب المقالات المنشورة
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    // جلب أدوات AI المنشورة
    const { data: aiTools } = await supabase
      .from('ai_tools')
      .select('slug, updated_at, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    // جلب الصفحات النشطة
    const { data: pages } = await supabase
      .from('site_pages')
      .select('page_key, updated_at')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    // جلب الخدمات المنشورة
    const { data: services } = await supabase
      .from('services')
      .select('slug, updated_at')
      .eq('status', 'published');

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- الصفحة الرئيسية -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- صفحات القوائم الرئيسية -->
  <url>
    <loc>${baseUrl}/articles</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/ai-tools</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

    // إضافة المقالات
    if (articles && articles.length > 0) {
      sitemap += '\n  <!-- المقالات -->';
      articles.forEach(article => {
        const lastmod = article.updated_at || article.published_at || currentDate;
        sitemap += `
  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });
    }

    // إضافة أدوات AI
    if (aiTools && aiTools.length > 0) {
      sitemap += '\n  <!-- أدوات الذكاء الاصطناعي -->';
      aiTools.forEach(tool => {
        const lastmod = tool.updated_at || tool.created_at || currentDate;
        sitemap += `
  <url>
    <loc>${baseUrl}/ai-tools/${tool.slug}</loc>
    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });
    }

    // إضافة الخدمات
    if (services && services.length > 0) {
      sitemap += '\n  <!-- الخدمات -->';
      services.forEach(service => {
        const lastmod = service.updated_at || currentDate;
        sitemap += `
  <url>
    <loc>${baseUrl}/services/${service.slug}</loc>
    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      });
    }

    // إضافة الصفحات الثابتة
    if (pages && pages.length > 0) {
      sitemap += '\n  <!-- الصفحات الثابتة -->';
      pages.forEach(page => {
        const lastmod = page.updated_at || currentDate;
        const priority = page.page_key === 'privacy-policy' || page.page_key === 'terms-of-use' ? '0.5' : '0.6';
        sitemap += `
  <url>
    <loc>${baseUrl}/page/${page.page_key}</loc>
    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
      });
    }

    sitemap += '\n</urlset>';

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });

  } catch (error) {
    console.error('خطأ في إنشاء sitemap:', error);

    // fallback sitemap في حالة الخطأ
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.tflash.site</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.tflash.site/articles</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.tflash.site/ai-tools</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

    return new NextResponse(fallbackSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }
}
