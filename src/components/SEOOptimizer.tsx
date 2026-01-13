import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  siteName?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noIndex?: boolean;
  noFollow?: boolean;
  canonical?: string;
}

export function SEOOptimizer({
  title,
  description,
  keywords = [],
  image = '/og-image.jpg',
  url = 'https://tflash.site',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  locale = 'ar_SA',
  siteName = 'TechnoFlash - بوابتك للمستقبل التقني',
  twitterCard = 'summary_large_image',
  noIndex = false,
  noFollow = false,
  canonical
}: SEOProps) {
  const fullTitle = title.includes('TechnoFlash') ? title : `${title} | TechnoFlash`;
  const fullImageUrl = image.startsWith('http') ? image : `${url}${image}`;
  const fullUrl = url.startsWith('http') ? url : `https://tflash.site${url}`;

  // Generate structured data for articles
  const generateArticleStructuredData = () => {
    if (type !== 'article') return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description,
      image: fullImageUrl,
      url: fullUrl,
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      author: {
        '@type': 'Person',
        name: author || 'فريق TechnoFlash'
      },
      publisher: {
        '@type': 'Organization',
        name: 'TechnoFlash',
        logo: {
          '@type': 'ImageObject',
          url: `${url}/logo.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': fullUrl
      },
      articleSection: section,
      keywords: [...keywords, ...tags].join(', '),
      inLanguage: 'ar'
    };
  };

  // Generate structured data for website
  const generateWebsiteStructuredData = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      description: description,
      url: url,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      },
      inLanguage: 'ar'
    };
  };

  const structuredData = type === 'article' 
    ? generateArticleStructuredData() 
    : generateWebsiteStructuredData();

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={author || 'فريق TechnoFlash'} />
      <meta name="language" content="Arabic" />
      <meta name="robots" content={`${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Article specific Open Graph tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@TechnoFlash" />
      <meta name="twitter:creator" content="@TechnoFlash" />
      
      {/* Additional Meta Tags for Arabic content */}
      <meta httpEquiv="Content-Language" content="ar" />
      <meta name="geo.region" content="SA" />
      <meta name="geo.country" content="Saudi Arabia" />
      
      {/* Mobile and Responsive */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Performance and Caching */}
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
      <meta name="theme-color" content="#38BDF8" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://zgktrwpladrkhhemhnni.supabase.co" />
      
      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Alternative languages */}
      <link rel="alternate" hrefLang="ar" href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />
    </Head>
  );
}

// Hook لإدارة SEO ديناميكياً
export function useSEO({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website'
}: Partial<SEOProps>) {
  // يمكن استخدام هذا Hook لتحديث SEO بناءً على حالة المكون
  return {
    updateSEO: (newSEOData: Partial<SEOProps>) => {
      // تحديث meta tags ديناميكياً
      if (newSEOData.title) {
        document.title = newSEOData.title.includes('TechnoFlash') 
          ? newSEOData.title 
          : `${newSEOData.title} | TechnoFlash`;
      }
      
      if (newSEOData.description) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', newSEOData.description);
        }
      }
    }
  };
}

// مكون SEO مبسط للاستخدام السريع
export function QuickSEO({
  title,
  description,
  image,
  type = 'website'
}: {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
}) {
  return (
    <SEOOptimizer
      title={title}
      description={description}
      image={image}
      type={type}
      keywords={['تكنولوجيا', 'ذكاء اصطناعي', 'برمجة', 'تطوير', 'تقنية']}
    />
  );
}
