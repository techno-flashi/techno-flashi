import { Metadata } from 'next';

interface SocialMetaOptions {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'website' | 'article';
  siteName?: string;
  locale?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  section?: string;
}

export function generateSocialMeta({
  title,
  description,
  url,
  image = 'https://tflash.site/og-image.jpg',
  type = 'website',
  siteName = 'TechnoFlash',
  locale = 'ar_SA',
  author,
  publishedTime,
  modifiedTime,
  tags = [],
  section
}: SocialMetaOptions): Metadata {
  const baseUrl = 'https://tflash.site';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  // Clean and optimize title and description for social sharing
  const cleanTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  const cleanDescription = description.length > 160 ? `${description.substring(0, 157)}...` : description;

  const metadata: Metadata = {
    title: cleanTitle,
    description: cleanDescription,
    openGraph: {
      type,
      locale,
      url: fullUrl,
      siteName,
      title: cleanTitle,
      description: cleanDescription,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@TechnoFlash',
      creator: '@TechnoFlash',
      title: cleanTitle,
      description: cleanDescription,
      images: [fullImageUrl],
    },
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  // Add article-specific metadata
  if (type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      authors: author ? [author] : undefined,
      publishedTime,
      modifiedTime,
      section,
      tags,
    };
  }

  // For AI tools and services, use website type with additional metadata
  if (type === 'website' && (section || tags.length > 0)) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'website',
    };
  }

  return metadata;
}

// Predefined social meta for common pages
export const homepageSocialMeta = generateSocialMeta({
  title: 'TechnoFlash | بوابتك للمستقبل التقني',
  description: 'منصة ويب متكاملة تقدم مقالات تقنية حصرية، ودليل شامل لأدوات الذكاء الاصطناعي، وخدمات متخصصة في عالم البرمجة والتكنولوجيا.',
  url: '/',
  type: 'website'
});

export const aiToolsPageSocialMeta = generateSocialMeta({
  title: 'أدوات الذكاء الاصطناعي | TechnoFlash',
  description: 'اكتشف مجموعة شاملة من أفضل أدوات الذكاء الاصطناعي مع مراجعات متخصصة ومقارنات تفصيلية لمساعدتك في اختيار الأداة المناسبة.',
  url: '/ai-tools',
  type: 'website'
});

export const articlesPageSocialMeta = generateSocialMeta({
  title: 'المقالات التقنية | TechnoFlash',
  description: 'مقالات تقنية حصرية ومتخصصة في عالم البرمجة والذكاء الاصطناعي والتكنولوجيا الحديثة.',
  url: '/articles',
  type: 'website'
});

export const servicesPageSocialMeta = generateSocialMeta({
  title: 'الخدمات التقنية | TechnoFlash',
  description: 'خدمات متخصصة في تطوير المواقع والتطبيقات والحلول التقنية المبتكرة.',
  url: '/services',
  type: 'website'
});

// Helper function to generate AI tool social meta
export function generateAIToolSocialMeta(tool: {
  name: string;
  description: string;
  slug: string;
  logo_url?: string;
  category: string;
  rating: string;
  pricing: string;
}) {
  return generateSocialMeta({
    title: `${tool.name} | أدوات الذكاء الاصطناعي | TechnoFlash`,
    description: `${tool.description} - تقييم: ${tool.rating}/5 - ${tool.pricing === 'free' ? 'مجاني' : tool.pricing === 'freemium' ? 'مجاني جزئياً' : 'مدفوع'}`,
    url: `/ai-tools/${tool.slug}`,
    image: tool.logo_url || '/og-image.jpg',
    type: 'website',
    section: tool.category,
    tags: [tool.category, 'ذكاء اصطناعي', 'أدوات تقنية', tool.pricing]
  });
}

// Helper function to generate article social meta
export function generateArticleSocialMeta(article: {
  title: string;
  excerpt: string;
  slug: string;
  featured_image?: string;
  category: string;
  author?: string;
  created_at: string;
  updated_at?: string;
  tags?: string[];
}) {
  return generateSocialMeta({
    title: `${article.title} | TechnoFlash`,
    description: article.excerpt,
    url: `/articles/${article.slug}`,
    image: article.featured_image || '/og-image.jpg',
    type: 'article',
    section: article.category,
    author: article.author || 'فريق TechnoFlash',
    publishedTime: article.created_at,
    modifiedTime: article.updated_at || article.created_at,
    tags: article.tags || [article.category, 'تقنية', 'مقالات']
  });
}

// Helper function to generate service social meta
export function generateServiceSocialMeta(service: {
  title: string;
  description: string;
  slug: string;
  image_url?: string;
  category: string;
  price?: string;
}) {
  return generateSocialMeta({
    title: `${service.title} | خدمات TechnoFlash`,
    description: service.description,
    url: `/services/${service.slug}`,
    image: service.image_url || '/og-image.jpg',
    type: 'website',
    section: service.category,
    tags: [service.category, 'خدمات تقنية', 'تطوير']
  });
}

// Helper function to get sharing URL with proper encoding
export function getSharingUrl(path: string): string {
  const baseUrl = 'https://tflash.site';
  const fullUrl = path.startsWith('http') ? path : `${baseUrl}${path}`;
  return fullUrl;
}

// Helper function to get sharing hashtags
export function getSharingHashtags(tags: string[] = []): string[] {
  const defaultHashtags = ['TechnoFlash', 'تقنية', 'ذكاء_اصطناعي'];
  return [...defaultHashtags, ...tags].slice(0, 5); // Limit to 5 hashtags
}
