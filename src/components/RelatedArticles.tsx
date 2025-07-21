import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url?: string;
  published_at: string;
}

interface RelatedArticlesProps {
  currentArticleId: string;
  currentArticleTitle: string;
  limit?: number;
}

async function getRelatedArticles(currentArticleId: string, currentTitle: string, limit = 4) {
  try {
    // البحث عن مقالات مشابهة بناءً على الكلمات المفتاحية في العنوان
    const keywords = currentTitle.split(' ').filter(word => word.length > 3);
    
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, excerpt, featured_image_url, published_at')
      .eq('status', 'published')
      .neq('id', currentArticleId)
      .order('published_at', { ascending: false })
      .limit(limit * 2); // جلب عدد أكبر للفلترة

    if (error) throw error;

    // فلترة المقالات بناءً على التشابه في الكلمات المفتاحية
    const relatedArticles = data?.filter(article => {
      const articleKeywords = article.title.toLowerCase();
      return keywords.some(keyword => 
        articleKeywords.includes(keyword.toLowerCase())
      );
    }).slice(0, limit);

    // إذا لم نجد مقالات مشابهة، نعرض أحدث المقالات
    if (!relatedArticles || relatedArticles.length === 0) {
      return data?.slice(0, limit) || [];
    }

    return relatedArticles;
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

export default async function RelatedArticles({ 
  currentArticleId, 
  currentArticleTitle, 
  limit = 4 
}: RelatedArticlesProps) {
  const relatedArticles = await getRelatedArticles(currentArticleId, currentArticleTitle, limit);

  if (!relatedArticles || relatedArticles.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-dark-card rounded-xl p-8 border border-gray-800">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        🔗 مقالات ذات صلة
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedArticles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group block bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-300 hover:scale-105"
          >
            {article.featured_image_url && (
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={article.featured_image_url}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}
            
            <div className="p-4">
              <h4 className="font-semibold text-white group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2">
                {article.title}
              </h4>
              
              <p className="text-text-description text-sm line-clamp-2 mb-3">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-xs text-text-description">
                <span>{formatDate(article.published_at)}</span>
                <span className="text-primary group-hover:text-blue-400 transition-colors duration-200">
                  اقرأ المزيد ←
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-primary hover:text-blue-400 transition-colors duration-200 font-medium"
        >
          عرض جميع المقالات
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
