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

  // جلب المقالات
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('status', 'published')

  const articlePages = articles?.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []

  // جلب الخدمات
  const { data: services } = await supabase
    .from('services')
    .select('id, updated_at')

  const servicePages = services?.map((service) => ({
    url: `${baseUrl}/services/${service.id}`,
    lastModified: new Date(service.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })) || []

  // جلب أدوات الذكاء الاصطناعي
  const { data: aiTools } = await supabase
    .from('ai_tools')
    .select('slug, updated_at')

  const aiToolPages = aiTools?.map((tool) => ({
    url: `${baseUrl}/ai-tools/${tool.slug}`,
    lastModified: new Date(tool.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })) || []

  return [...staticPages, ...articlePages, ...servicePages, ...aiToolPages]
}
