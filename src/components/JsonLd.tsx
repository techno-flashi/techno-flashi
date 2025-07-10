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

// البيانات المنظمة للموقع الرئيسي
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "TechnoFlash",
  "alternateName": "تكنوفلاش",
  "url": "https://tflash.site",
  "description": "منصة ويب متكاملة تقدم مقالات تقنية حصرية، ودليل شامل لأدوات الذكاء الاصطناعي، وخدمات متخصصة في عالم البرمجة والتكنولوجيا",
  "inLanguage": "ar",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://tflash.site/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "TechnoFlash",
    "url": "https://tflash.site",
    "logo": {
      "@type": "ImageObject",
      "url": "https://tflash.site/logo.png"
    }
  }
};

// البيانات المنظمة للمنظمة
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TechnoFlash",
  "alternateName": "تكنوفلاش",
  "url": "https://tflash.site",
  "logo": "https://tflash.site/logo.png",
  "description": "منصة ويب متكاملة تقدم مقالات تقنية حصرية، ودليل شامل لأدوات الذكاء الاصطناعي، وخدمات متخصصة",
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

// دالة لإنشاء JSON-LD للمقالات
export const createArticleJsonLd = (article: any) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.featured_image,
  "author": {
    "@type": "Organization",
    "name": "TechnoFlash"
  },
  "publisher": {
    "@type": "Organization",
    "name": "TechnoFlash",
    "logo": {
      "@type": "ImageObject",
      "url": "https://tflash.site/logo.png"
    }
  },
  "datePublished": article.created_at,
  "dateModified": article.updated_at,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://tflash.site/articles/${article.slug}`
  },
  "inLanguage": "ar"
});

// دالة لإنشاء JSON-LD للخدمات
export const createServiceJsonLd = (service: any) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "provider": {
    "@type": "Organization",
    "name": "TechnoFlash"
  },
  "areaServed": "Worldwide",
  "availableLanguage": ["Arabic", "English"],
  "serviceType": "Technology Services"
});
