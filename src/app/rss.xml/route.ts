import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // جلب أحدث المقالات المنشورة
    const { data: articles, error } = await supabase
      .from('articles')
      .select('title, slug, excerpt, published_at, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching articles for RSS:', error);
      return new NextResponse('Error generating RSS feed', { status: 500 });
    }

    const baseUrl = 'https://tflash.site';
    const rssItems = articles?.map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/articles/${article.slug}</link>
      <description><![CDATA[${article.excerpt || article.title}]]></description>
      <pubDate>${new Date(article.published_at).toUTCString()}</pubDate>
      <guid>${baseUrl}/articles/${article.slug}</guid>
    </item>`).join('') || '';

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TechnoFlash - بوابتك للمستقبل التقني</title>
    <link>${baseUrl}</link>
    <description>منصة ويب متكاملة تقدم مقالات تقنية حصرية، ودليل شامل لأدوات الذكاء الاصطناعي، وخدمات متخصصة في عالم البرمجة والتكنولوجيا</description>
    <language>ar</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>info@tflash.site (TechnoFlash Team)</managingEditor>
    <webMaster>info@tflash.site (TechnoFlash Team)</webMaster>
    <category>Technology</category>
    <category>Programming</category>
    <category>Artificial Intelligence</category>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('RSS generation error:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}
