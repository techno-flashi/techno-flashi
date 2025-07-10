import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tflash.site'

  // الصفحات الثابتة
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ai-tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // جلب المقالات مع معالجة الأخطاء
  let articlePages: any[] = []
  try {
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, updated_at')
      .eq('status', 'published')

    articlePages = articles?.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error)
  }

  // جلب الخدمات مع معالجة الأخطاء
  let servicePages: any[] = []
  try {
    const { data: services } = await supabase
      .from('services')
      .select('id, updated_at')

    servicePages = services?.map((service) => ({
      url: `${baseUrl}/services/${service.id}`,
      lastModified: new Date(service.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || []
  } catch (error) {
    console.error('Error fetching services for sitemap:', error)
  }

  // جلب أدوات الذكاء الاصطناعي مع معالجة الأخطاء
  let aiToolPages: any[] = []
  try {
    const { data: aiTools } = await supabase
      .from('ai_tools')
      .select('slug, updated_at')

    aiToolPages = aiTools?.map((tool) => ({
      url: `${baseUrl}/ai-tools/${tool.slug}`,
      lastModified: new Date(tool.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || []
  } catch (error) {
    console.error('Error fetching AI tools for sitemap:', error)
  }

  return [...staticPages, ...articlePages, ...servicePages, ...aiToolPages]
}
