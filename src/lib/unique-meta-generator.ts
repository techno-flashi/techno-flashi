// Unique Meta Generator - Fix 33% duplicate content issue
// Generates unique meta descriptions and titles for each page

interface PageData {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  author?: string;
  publishedDate?: string;
  type: 'article' | 'ai-tool' | 'page' | 'category';
  slug: string;
}

// Unique prefixes and suffixes to differentiate content
const UNIQUE_PREFIXES = {
  article: [
    'اكتشف كيف',
    'تعلم طريقة',
    'دليل شامل حول',
    'أفضل الممارسات في',
    'خطوات تفصيلية لـ',
    'نصائح خبراء حول',
    'استراتيجيات متقدمة في'
  ],
  'ai-tool': [
    'مراجعة شاملة لأداة',
    'تقييم مفصل لـ',
    'دليل استخدام',
    'مقارنة وتحليل',
    'خصائص ومميزات',
    'تجربة عملية مع',
    'كل ما تحتاج معرفته عن'
  ],
  page: [
    'معلومات مفصلة حول',
    'كل ما يخص',
    'دليل كامل عن',
    'تفاصيل شاملة حول'
  ],
  category: [
    'جميع المقالات في فئة',
    'أحدث المحتوى حول',
    'مجموعة شاملة من',
    'كل ما يتعلق بـ'
  ]
};

const UNIQUE_SUFFIXES = {
  article: [
    'مع أمثلة عملية وتطبيقات واقعية',
    'بأسلوب مبسط ومفهوم للجميع',
    'مع نصائح الخبراء والممارسين',
    'خطوة بخطوة مع الصور التوضيحية',
    'مع دراسات حالة وتجارب حقيقية',
    'بطريقة احترافية ومدروسة',
    'مع أحدث الاتجاهات والتطورات'
  ],
  'ai-tool': [
    'مع مقارنة بالبدائل المتاحة',
    'تجربة شخصية ونتائج حقيقية',
    'مع تحليل المميزات والعيوب',
    'دليل التسعير والخطط المتاحة',
    'مع أمثلة عملية للاستخدام',
    'تقييم شامل من خبراء التقنية',
    'مع نصائح للاستفادة القصوى'
  ],
  page: [
    'معلومات محدثة ودقيقة',
    'محتوى شامل ومفصل',
    'دليل كامل ومحدث',
    'معلومات موثوقة ومفيدة'
  ],
  category: [
    'محتوى متنوع ومفيد',
    'مقالات محدثة باستمرار',
    'معلومات شاملة ومتخصصة',
    'محتوى عالي الجودة'
  ]
};

// Generate unique meta description
export function generateUniqueMetaDescription(data: PageData): string {
  const { type, title, description, category, tags } = data;
  
  // Get random prefix and suffix
  const prefixes = UNIQUE_PREFIXES[type] || UNIQUE_PREFIXES.page;
  const suffixes = UNIQUE_SUFFIXES[type] || UNIQUE_SUFFIXES.page;
  
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  // Base description
  let baseDescription = description || title;
  
  // Add category context if available
  const categoryContext = category ? ` في مجال ${category}` : '';
  
  // Add tags context if available
  const tagsContext = tags && tags.length > 0 
    ? ` يغطي موضوعات: ${tags.slice(0, 3).join('، ')}`
    : '';
  
  // Construct unique description
  const uniqueDescription = `${randomPrefix} ${title}${categoryContext}. ${baseDescription} ${randomSuffix}${tagsContext}. محتوى حصري من TechnoFlash.`;
  
  // Ensure optimal length (150-155 characters) - SEO audit fix
  return uniqueDescription.length > 155
    ? uniqueDescription.substring(0, 152) + '...'
    : uniqueDescription;
}

// Generate unique page title - OPTIMIZED for 60 char limit (SEO audit fix)
export function generateUniquePageTitle(data: PageData): string {
  const { type, title, category } = data;

  // Shorter title variations to fit 60 char limit
  const titleVariations = {
    article: [
      `${title} - دليل`,
      `${title} - نصائح`,
      `${title} - شرح`,
      `دليل ${title}`,
      `${title} - كيفية`
    ],
    'ai-tool': [
      `${title} - مراجعة`,
      `${title} - تقييم`,
      `${title} - دليل`,
      `${title} - تجربة`,
      `مراجعة ${title}`
    ],
    page: [
      `${title}`,
      `${title} - TechnoFlash`,
      `دليل ${title}`,
      `معلومات ${title}`
    ],
    category: [
      `${title} - مقالات`,
      `محتوى ${title}`,
      `${title} - دليل`,
      `مقالات ${title}`
    ]
  };

  const variations = titleVariations[type] || titleVariations.page;
  let selectedTitle = variations[Math.floor(Math.random() * variations.length)];

  // Add category context only if there's space
  if ((type === 'article' || type === 'ai-tool') && category && selectedTitle.length < 45) {
    selectedTitle += ` | ${category}`;
  }

  // Add TechnoFlash brand only if there's space and not already included
  if (!selectedTitle.includes('TechnoFlash') && selectedTitle.length < 45) {
    selectedTitle += ' | TechnoFlash';
  }

  // STRICT 60 character limit - SEO audit requirement
  if (selectedTitle.length > 60) {
    // Try without category first
    const withoutCategory = variations[Math.floor(Math.random() * variations.length)];
    if (withoutCategory.length <= 60) {
      selectedTitle = withoutCategory;
    } else {
      // Last resort: truncate
      selectedTitle = selectedTitle.substring(0, 57) + '...';
    }
  }

  return selectedTitle;
}

// Generate unique content snippets for pages
export function generateUniqueContentSnippet(data: PageData): string {
  const { type, title, category } = data;
  
  const snippets = {
    article: [
      `في هذا المقال الشامل، نستكشف ${title} بطريقة مفصلة ومبسطة.`,
      `دليل متكامل يغطي جميع جوانب ${title} مع أمثلة عملية.`,
      `تعرف على أفضل الممارسات والنصائح المتقدمة حول ${title}.`,
      `خطوات تفصيلية وشرح وافي لكل ما يتعلق بـ ${title}.`
    ],
    'ai-tool': [
      `مراجعة تفصيلية وتقييم شامل لأداة ${title} مع تجربة عملية.`,
      `كل ما تحتاج معرفته عن ${title} - المميزات والعيوب والتسعير.`,
      `دليل استخدام ${title} مع نصائح للاستفادة القصوى من الأداة.`,
      `تحليل متعمق لخصائص ${title} ومقارنة مع البدائل المتاحة.`
    ],
    page: [
      `معلومات شاملة ومحدثة حول ${title}.`,
      `دليل كامل ومفصل عن ${title}.`,
      `كل ما تحتاج معرفته حول ${title}.`,
      `محتوى متخصص وموثوق حول ${title}.`
    ],
    category: [
      `مجموعة متنوعة من المقالات المتخصصة في ${title}.`,
      `محتوى عالي الجودة يغطي جميع جوانب ${title}.`,
      `أحدث المقالات والدلائل في مجال ${title}.`,
      `مصدر موثوق للمعلومات حول ${title}.`
    ]
  };
  
  const categorySnippets = snippets[type] || snippets.page;
  const randomSnippet = categorySnippets[Math.floor(Math.random() * categorySnippets.length)];
  
  return randomSnippet;
}

// Generate unique breadcrumb text
export function generateUniqueBreadcrumb(data: PageData): string {
  const { type, category } = data;
  
  const breadcrumbVariations = {
    article: category ? `مقالات ${category}` : 'المقالات',
    'ai-tool': category ? `أدوات ${category}` : 'أدوات الذكاء الاصطناعي',
    page: 'الصفحات',
    category: 'التصنيفات'
  };
  
  return breadcrumbVariations[type] || 'الرئيسية';
}
