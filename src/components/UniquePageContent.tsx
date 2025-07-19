// Unique Page Content Component - Reduces duplicate content across pages
// Generates unique content snippets for each page type

import { generateUniqueContentSnippet } from '@/lib/unique-meta-generator';

interface UniquePageContentProps {
  pageType: 'article' | 'ai-tool' | 'page' | 'category';
  title: string;
  category?: string;
  tags?: string[];
  className?: string;
}

export default function UniquePageContent({
  pageType,
  title,
  category,
  tags,
  className = ''
}: UniquePageContentProps) {
  const uniqueSnippet = generateUniqueContentSnippet({
    type: pageType,
    title,
    category,
    tags,
    slug: ''
  });

  // Generate unique contextual information based on page type
  const getContextualInfo = () => {
    switch (pageType) {
      case 'article':
        return {
          prefix: 'في هذا المقال',
          context: category ? `في مجال ${category}` : 'التقني',
          suffix: 'مع أمثلة عملية ونصائح مفيدة'
        };
      case 'ai-tool':
        return {
          prefix: 'تقييم شامل لأداة',
          context: category ? `المتخصصة في ${category}` : 'الذكاء الاصطناعي',
          suffix: 'مع مقارنة بالبدائل المتاحة'
        };
      case 'page':
        return {
          prefix: 'معلومات تفصيلية حول',
          context: 'منصة TechnoFlash',
          suffix: 'محتوى محدث ومفيد'
        };
      case 'category':
        return {
          prefix: 'مجموعة متنوعة من المحتوى في',
          context: 'فئة متخصصة',
          suffix: 'مقالات وأدوات مختارة بعناية'
        };
      default:
        return {
          prefix: 'محتوى متخصص حول',
          context: 'التقنية والذكاء الاصطناعي',
          suffix: 'من فريق TechnoFlash'
        };
    }
  };

  const contextInfo = getContextualInfo();

  // Generate unique tags display
  const renderTags = () => {
    if (!tags || tags.length === 0) return null;

    const displayTags = tags.slice(0, 3);
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-sm text-gray-600 font-medium">المواضيع المغطاة:</span>
        {displayTags.map((tag, index) => (
          <span
            key={index}
            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  // Generate unique reading time estimate for articles
  const getReadingTimeEstimate = () => {
    if (pageType !== 'article') return null;

    const estimates = [
      'قراءة 5 دقائق',
      'قراءة 7 دقائق',
      'قراءة 10 دقائق',
      'قراءة 12 دقائق'
    ];
    
    const randomEstimate = estimates[Math.floor(Math.random() * estimates.length)];
    
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{randomEstimate}</span>
      </div>
    );
  };

  // Generate unique value proposition for AI tools
  const getValueProposition = () => {
    if (pageType !== 'ai-tool') return null;

    const propositions = [
      'أداة مجربة ومختبرة من فريق TechnoFlash',
      'تحليل شامل مع تجربة عملية حقيقية',
      'مراجعة مفصلة مع نصائح الاستخدام الأمثل',
      'تقييم موضوعي مع مقارنة بالبدائل'
    ];

    const randomProposition = propositions[Math.floor(Math.random() * propositions.length)];

    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700 font-medium">
              {randomProposition}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`unique-page-content ${className}`}>
      {/* Unique content snippet */}
      <div className="bg-gray-50 border-r-4 border-blue-500 p-4 mb-6">
        <p className="text-gray-700 leading-relaxed">
          <span className="font-semibold text-blue-600">{contextInfo.prefix}</span>{' '}
          <span className="font-medium">{title}</span>{' '}
          <span className="text-gray-600">{contextInfo.context}</span>.{' '}
          {uniqueSnippet}{' '}
          <span className="text-gray-600">{contextInfo.suffix}</span>.
        </p>
      </div>

      {/* Reading time for articles */}
      {getReadingTimeEstimate()}

      {/* Value proposition for AI tools */}
      {getValueProposition()}

      {/* Tags display */}
      {renderTags()}

      {/* Unique footer note */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 italic">
          {pageType === 'article' && 'محتوى حصري من فريق TechnoFlash التقني'}
          {pageType === 'ai-tool' && 'مراجعة مستقلة وموضوعية من خبراء TechnoFlash'}
          {pageType === 'page' && 'معلومات محدثة من منصة TechnoFlash'}
          {pageType === 'category' && 'مجموعة مختارة من محتوى TechnoFlash المتخصص'}
        </p>
      </div>
    </div>
  );
}

// Export additional utility for generating unique page identifiers
export function generateUniquePageId(pageType: string, slug: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${pageType}-${slug}-${timestamp}-${random}`;
}

// Export function to generate unique schema markup
export function generateUniqueSchemaMarkup(
  pageType: 'article' | 'ai-tool',
  data: {
    title: string;
    description: string;
    url: string;
    author?: string;
    publishedDate?: string;
    category?: string;
  }
) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': pageType === 'article' ? 'Article' : 'SoftwareApplication',
    name: data.title,
    description: data.description,
    url: data.url,
    publisher: {
      '@type': 'Organization',
      name: 'TechnoFlash',
      url: 'https://www.tflash.site'
    }
  };

  if (pageType === 'article') {
    return {
      ...baseSchema,
      author: {
        '@type': 'Person',
        name: data.author || 'فريق TechnoFlash'
      },
      datePublished: data.publishedDate,
      articleSection: data.category,
      inLanguage: 'ar'
    };
  } else {
    return {
      ...baseSchema,
      applicationCategory: data.category || 'Artificial Intelligence',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    };
  }
}
