import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

// Define a type for our sitemap entries for better type safety
type SitemapEntry = {
  url: string;
  lastModified?: Date; // ✅ التغيير الأول: تم تحديث النوع
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tflash.site'

  // Step 1: Run all database queries in parallel
  const [articlesResult, servicesResult, aiToolsResult, sitePagesResult] = 
    await Promise.allSettled([
      supabase.from('articles').select('slug, updated_at').eq('status', 'published'),
      supabase.from('services').select('id, updated_at'),
      supabase.from('ai_tools').select('slug, updated_at'),
      supabase.from('site_pages').select('page_key, updated_at').eq('is_active', true)
    ]);

  // Helper function to process results and handle errors
  const processResults = <T extends { slug?: string; id?: string; page_key?: string; updated_at: string }>(
    result: PromiseSettledResult<{ data: T[] | null }>,
    basePath: string
  ): SitemapEntry[] => {
    if (result.status === 'fulfilled' && result.value.data) {
      return result.value.data.map(item => ({
        url: `${baseUrl}/${basePath}/${item.slug || item.id || item.page_key}`,
        lastModified: new Date(item.updated_at),
        priority: 0.7,
        changeFrequency: 'weekly',
      }));
    }
    if (result.status === 'rejected') {
      console.error(`Error fetching for sitemap path "${basePath}":`, result.reason);
    }
    return [];
  };

  // Step 2: Map the results from parallel queries
  const articlePages = processResults(articlesResult, 'articles');
  const servicePages = processResults(servicesResult, 'services');
  const aiToolPages = processResults(aiToolsResult, 'ai-tools');
  const sitePages = processResults(sitePagesResult, 'page'); // ✅ التغيير الثاني: تم تصحيح اسم المتغير
  
  // Step 3: Find the latest modification date for dynamic pages to use for their parent static pages
  const latestArticleDate = articlePages.reduce((max, p) => p.lastModified! > max ? p.lastModified! : max, new Date(0));
  const latestAiToolDate = aiToolPages.reduce((max, p) => p.lastModified! > max ? p.lastModified! : max, new Date(0));

  // Step 4: Define static pages with more accurate lastModified dates
  const staticPages: SitemapEntry[] = [
    {
      url: baseUrl,
      lastModified: latestArticleDate, // Homepage is as fresh as the latest article
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: latestArticleDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(), // Or find the latest service date
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ai-tools`,
      lastModified: latestAiToolDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Step 5: Combine all pages
  return [...staticPages, ...articlePages, ...servicePages, ...aiToolPages, ...sitePages];
}