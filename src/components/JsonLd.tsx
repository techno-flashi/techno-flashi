interface JsonLdProps {
  data: object;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// البيانات المنظمة المحسنة والمدمجة للموقع الرئيسي (تتبع أفضل الممارسات)
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "TechnoFlash",
  "alternateName": "تكنوفلاش",
  "url": "https://tflash.site",
  "description": "منصة ويب متكاملة تقدم مقالات تقنية حصرية، ودليل شامل لأدوات الذكاء الاصطناعي، وخدمات متخصصة في عالم البرمجة والتكنولوجيا.",
  "inLanguage": "ar",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://tflash.site/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "TechnoFlash",
    "alternateName": "تكنوفلاش",
    "url": "https://tflash.site",
    "logo": {
      "@type": "ImageObject",
      "url": "https://tflash.site/logo.png",
      "width": 600,
      "height": 60
    },
    "description": "منصة ويب متكاملة تقدم مقالات تقنية حصرية، ودليل شامل لأدوات الذكاء الاصطناعي، وخدمات متخصصة.",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/technoflash",
      "https://facebook.com/technoflash",
      "https://linkedin.com/company/technoflash"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Arabic", "English"]
    }
  }
};

// البيانات المنظمة للمنظمة (للاستخدام في صفحات منفصلة إذا لزم الأمر)
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TechnoFlash",
  "alternateName": "تكنوفلاش",
  "url": "https://tflash.site",
  "logo": {
    "@type": "ImageObject",
    "url": "https://tflash.site/logo.png",
    "width": 600,
    "height": 60
  },
  "description": "منصة ويب متكاملة تقدم مقالات تقنية حصرية، ودليل شامل لأدوات الذكاء الاصطناعي، وخدمات متخصصة.",
  "foundingDate": "2024",
  "sameAs": [
    "https://twitter.com/technoflash",
    "https://facebook.com/technoflash",
    "https://linkedin.com/company/technoflash"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["Arabic", "English"]
  }
};

// دالة لإنشاء JSON-LD محسنة للمقالات
export const createArticleJsonLd = (article: any) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description || article.excerpt,
  "image": {
    "@type": "ImageObject",
    "url": article.featured_image || article.featured_image_url || "https://www.tflash.site/og-image.jpg",
    "width": 1200,
    "height": 630
  },
  "author": {
    "@type": "Organization",
    "name": article.author || "TechnoFlash",
    "url": "https://www.tflash.site"
  },
  "publisher": {
    "@type": "Organization",
    "name": "TechnoFlash",
    "url": "https://www.tflash.site",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.tflash.site/logo.png",
      "width": 600,
      "height": 60
    }
  },
  "datePublished": article.published_at || article.created_at,
  "dateModified": article.updated_at || article.created_at,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://www.tflash.site/articles/${article.slug}`
  },
  "inLanguage": "ar",
  "articleSection": article.category || "Technology",
  "keywords": article.tags || article.seo_keywords || ["تقنية", "ذكاء اصطناعي", "تكنولوجيا"]
});

// دالة لإنشاء JSON-LD محسنة للخدمات
export const createServiceJsonLd = (service: any) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "provider": {
    "@type": "Organization",
    "name": "TechnoFlash",
    "url": "https://tflash.site"
  },
  "areaServed": "Worldwide",
  "availableLanguage": ["Arabic", "English"],
  "serviceType": "Technology Services",
  "url": `https://tflash.site/services/${service.id}`,
  "inLanguage": "ar"
});

// دالة لإنشاء JSON-LD لأدوات الذكاء الاصطناعي
export const createAIToolJsonLd = (tool: any) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": tool.name,
  "description": tool.description,
  "applicationCategory": "AI Tool",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": tool.pricing || "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": tool.rating ? {
    "@type": "AggregateRating",
    "ratingValue": tool.rating,
    "ratingCount": tool.rating_count || 1,
    "bestRating": 5,
    "worstRating": 1
  } : undefined,
  "url": tool.website_url,
  "image": tool.logo_url || "https://tflash.site/og-image.jpg",
  "inLanguage": "ar",
  "keywords": tool.tags || ["ذكاء اصطناعي", "أدوات AI", "تقنية"]
});
