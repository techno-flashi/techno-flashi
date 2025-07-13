import { Metadata } from 'next';

interface CanonicalUrlProps {
  url: string;
  alternates?: {
    mobile?: string;
    desktop?: string;
    languages?: { [key: string]: string };
  };
}

/**
 * مكون لإدارة Canonical URLs وحل مشكلة النسخ المكررة
 */
export function CanonicalUrl({ url, alternates }: CanonicalUrlProps) {
  // تنظيف URL من المعاملات غير المرغوبة
  const cleanUrl = (inputUrl: string) => {
    try {
      const urlObj = new URL(inputUrl);
      
      // إزالة المعاملات غير المرغوبة
      const paramsToRemove = ['m', 'utm_source', 'utm_medium', 'utm_campaign', 'ref', 'source', 'fbclid', 'gclid'];
      paramsToRemove.forEach(param => {
        urlObj.searchParams.delete(param);
      });
      
      // إزالة trailing slash إذا لم يكن الصفحة الرئيسية
      if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) {
        urlObj.pathname = urlObj.pathname.slice(0, -1);
      }
      
      return urlObj.toString();
    } catch (error) {
      console.error('Error cleaning URL:', error);
      return inputUrl;
    }
  };

  const canonicalUrl = cleanUrl(url);

  return (
    <>
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate URLs للموبايل والديسكتوب */}
      {alternates?.mobile && (
        <link rel="alternate" media="only screen and (max-width: 640px)" href={alternates.mobile} />
      )}
      
      {alternates?.desktop && (
        <link rel="alternate" media="only screen and (min-width: 641px)" href={alternates.desktop} />
      )}
      
      {/* Alternate URLs للغات مختلفة */}
      {alternates?.languages && Object.entries(alternates.languages).map(([lang, langUrl]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={langUrl} />
      ))}
      
      {/* Self-referencing hreflang */}
      <link rel="alternate" hrefLang="ar" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
    </>
  );
}

/**
 * دالة مساعدة لإنشاء metadata مع canonical URL
 */
export function createCanonicalMetadata(
  baseMetadata: Metadata,
  canonicalUrl: string,
  alternates?: CanonicalUrlProps['alternates']
): Metadata {
  return {
    ...baseMetadata,
    alternates: {
      canonical: canonicalUrl,
      ...alternates,
    },
    other: {
      ...(baseMetadata.other || {}),
      'og:url': canonicalUrl,
    }
  };
}

/**
 * دالة لإنشاء canonical URL من slug
 */
export function generateCanonicalUrl(type: 'article' | 'ai-tool' | 'page', slug?: string): string {
  const baseUrl = 'https://www.tflash.site';
  
  switch (type) {
    case 'article':
      return slug ? `${baseUrl}/articles/${slug}` : `${baseUrl}/articles`;
    case 'ai-tool':
      return slug ? `${baseUrl}/ai-tools/${slug}` : `${baseUrl}/ai-tools`;
    case 'page':
      return slug ? `${baseUrl}/${slug}` : baseUrl;
    default:
      return baseUrl;
  }
}

/**
 * مكون لحل مشكلة النسخ المكررة في المقالات
 */
export function ArticleCanonicalUrl({ slug }: { slug: string }) {
  const canonicalUrl = generateCanonicalUrl('article', slug);
  
  return (
    <CanonicalUrl
      url={canonicalUrl}
      alternates={{
        mobile: `${canonicalUrl}?mobile=1`,
        languages: {
          'ar': canonicalUrl,
          'en': canonicalUrl.replace('/ar/', '/en/'),
        }
      }}
    />
  );
}

/**
 * مكون لحل مشكلة النسخ المكررة في أدوات AI
 */
export function AIToolCanonicalUrl({ slug }: { slug: string }) {
  const canonicalUrl = generateCanonicalUrl('ai-tool', slug);
  
  return (
    <CanonicalUrl
      url={canonicalUrl}
      alternates={{
        mobile: `${canonicalUrl}?mobile=1`,
        languages: {
          'ar': canonicalUrl,
          'en': canonicalUrl.replace('/ar/', '/en/'),
        }
      }}
    />
  );
}

/**
 * Hook لاستخدام canonical URL في المكونات
 */
export function useCanonicalUrl(type: 'article' | 'ai-tool' | 'page', slug?: string) {
  const canonicalUrl = generateCanonicalUrl(type, slug);
  
  return {
    canonicalUrl,
    cleanUrl: (url: string) => {
      try {
        const urlObj = new URL(url);
        const paramsToRemove = ['m', 'utm_source', 'utm_medium', 'utm_campaign', 'ref', 'source'];
        paramsToRemove.forEach(param => {
          urlObj.searchParams.delete(param);
        });
        return urlObj.toString();
      } catch {
        return url;
      }
    }
  };
}
