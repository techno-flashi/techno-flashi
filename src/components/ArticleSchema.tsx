interface ArticleSchemaProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    featured_image_url?: string;
    published_at: string;
    updated_at: string;
    slug: string;
  };
  author?: {
    name: string;
    email: string;
  };
}

export default function ArticleSchema({ article, author }: ArticleSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://technoflash.net';
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.featured_image_url ? [article.featured_image_url] : [],
    "datePublished": article.published_at,
    "dateModified": article.updated_at,
    "author": {
      "@type": "Person",
      "name": author?.name || "محمد أحمد",
      "email": author?.email || "i2s2mail22@gmail.com",
      "url": `${baseUrl}/page/author`
    },
    "publisher": {
      "@type": "Organization",
      "name": "TechnoFlash",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`,
        "width": 200,
        "height": 60
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/articles/${article.slug}`
    },
    "articleSection": "Technology",
    "keywords": "ذكاء اصطناعي, تقنية, برمجة, أدوات, مراجعات",
    "inLanguage": "ar",
    "isAccessibleForFree": true,
    "genre": "Technology Review",
    "audience": {
      "@type": "Audience",
      "audienceType": "Developers, Tech Enthusiasts, Arabic Speakers"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
