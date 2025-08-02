// إدارة صور المقالات بدون توليد تلقائي
export function getArticleThumbnail(article: any): string {
  // أولوية للصورة المميزة
  if (article.featured_image_url && article.featured_image_url.trim()) {
    return article.featured_image_url;
  }

  // البحث عن أول صورة في المحتوى إذا كان نص markdown
  if (article.content && typeof article.content === 'string') {
    // البحث عن صور markdown ![alt](url)
    const markdownImageMatch = article.content.match(/!\[.*?\]\((.*?)\)/);
    if (markdownImageMatch && markdownImageMatch[1]) {
      return markdownImageMatch[1];
    }

    // البحث عن صور HTML <img src="url">
    const htmlImageMatch = article.content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (htmlImageMatch && htmlImageMatch[1]) {
      return htmlImageMatch[1];
    }
  }

  // الصورة الافتراضية كآخر خيار
  return '/assets/default-article-thumb.jpg';
}

// دالة للحصول على صورة OG للمشاركة
export function getArticleOGImage(article: any): string {
  const thumbnail = getArticleThumbnail(article);

  // إذا كانت الصورة الافتراضية، استخدم OG مخصص
  if (thumbnail === '/assets/default-article-thumb.jpg') {
    return '/assets/default-og-image.jpg';
  }

  return thumbnail;
}

// التحقق من صحة رابط الصورة
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  // تجنب الروابط المولدة تلقائياً
  const invalidDomains = [
    'picsum.photos',
    'placeholder.com',
    'via.placeholder.com',
    'placehold.co',
    'fakeimg.pl'
  ];

  return !invalidDomains.some(domain => url.includes(domain));
}

// دالة للتحقق من وجود الصورة الافتراضية
export function getDefaultImages() {
  return {
    thumbnail: '/assets/default-article-thumb.jpg',
    ogImage: '/assets/default-og-image.jpg'
  };
}