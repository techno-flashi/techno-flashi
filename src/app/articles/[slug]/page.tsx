// هذه هي الصفحة الديناميكية التي تعرض مقالاً واحداً بناءً على رابطه (slug)

import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import AdBanner from "@/components/ads/AdBanner";
import { ArticleContent } from "@/components/ArticleContent";
import { EditorJSRenderer } from "@/components/EditorJSRenderer";

export const revalidate = 600; // إعادة بناء الصفحة كل 10 دقائق

type Props = {
  params: Promise<{ slug: string }>;
};

// جلب بيانات المقال بناءً على الـ slug
async function getArticle(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single(); // لجلب نتيجة واحدة فقط

  if (error || !data) {
    return null;
  }
  return data;
}

// جلب المقالات ذات الصلة
async function getRelatedArticles(currentSlug: string, tags: string[] = []) {
  let query = supabase
    .from('articles')
    .select('id, title, slug, excerpt, featured_image_url, created_at, tags')
    .eq('status', 'published')
    .neq('slug', currentSlug)
    .order('created_at', { ascending: false })
    .limit(3);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }

  return data || [];
}

// إعداد بيانات SEO الديناميكية للصفحة
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) {
    return { title: "المقال غير موجود" };
  }
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  // إذا لم يتم العثور على المقال، عرض صفحة 404
  if (!article) {
    notFound();
  }

  // جلب المقالات ذات الصلة
  const relatedArticles = await getRelatedArticles(slug, article.tags || []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* إعلان أعلى المقال */}
      <AdBanner placement="article_top" className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* المحتوى الرئيسي */}
        <article className="lg:col-span-3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-dark-text-secondary mb-8">
            <span>
              نُشر في: {new Date(article.published_at).toLocaleDateString('ar-EG', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
            {article.author && (
              <span>• بواسطة: {article.author}</span>
            )}
            {article.reading_time && (
              <span>• وقت القراءة: {article.reading_time} دقيقة</span>
            )}
          </div>

          {/* الكلمات المفتاحية */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src={article.featured_image_url || "https://placehold.co/1200x600/0D1117/38BDF8?text=TechnoFlash"}
              alt={article.title}
              fill
              style={{ objectFit: 'cover' }}
              priority // لتحميل الصورة الرئيسية بسرعة
            />
          </div>

          {/* محتوى المقال */}
          <ArticleContent content={article.content} />
        </article>

        {/* الشريط الجانبي */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* إعلان الشريط الجانبي */}
            <AdBanner placement="sidebar" />

            {/* معلومات إضافية */}
            <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">معلومات المقال</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-text-secondary">تاريخ النشر:</span>
                  <span className="text-white">
                    {new Date(article.published_at).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text-secondary">وقت القراءة:</span>
                  <span className="text-white">{article.reading_time || 5} دقائق</span>
                </div>
                {article.author && (
                  <div className="flex justify-between">
                    <span className="text-dark-text-secondary">الكاتب:</span>
                    <span className="text-white">{article.author}</span>
                  </div>
                )}
                {article.tags && article.tags.length > 0 && (
                  <div>
                    <span className="text-dark-text-secondary block mb-2">الكلمات المفتاحية:</span>
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="bg-primary/20 text-primary px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-dark-text-secondary text-xs">
                          +{article.tags.length - 3} أخرى
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* مشاركة المقال */}
            <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">شارك المقال</h3>
              <div className="flex space-x-3 space-x-reverse">
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
                <button className="bg-blue-800 hover:bg-blue-900 text-white p-2 rounded-lg transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* قسم المقالات ذات الصلة */}
      {relatedArticles.length > 0 && (
        <section className="mt-16 mb-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              مقالات ذات صلة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <article
                  key={relatedArticle.id}
                  className="bg-dark-card rounded-xl overflow-hidden border border-gray-700 hover:border-primary/50 transition-all duration-300 group"
                >
                  {/* صورة المقال */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/10 to-blue-600/10">
                    {relatedArticle.featured_image_url ? (
                      <Image
                        src={relatedArticle.featured_image_url}
                        alt={relatedArticle.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* محتوى المقال */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      <a href={`/articles/${relatedArticle.slug}`}>
                        {relatedArticle.title}
                      </a>
                    </h3>

                    <p className="text-dark-text-secondary mb-4 line-clamp-3">
                      {relatedArticle.excerpt}
                    </p>

                    {/* التاريخ والعلامات */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-dark-text-secondary">
                        {new Date(relatedArticle.created_at).toLocaleDateString('ar-SA')}
                      </span>

                      {relatedArticle.tags && relatedArticle.tags.length > 0 && (
                        <div className="flex gap-2">
                          {relatedArticle.tags.slice(0, 2).map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="bg-primary/20 text-primary px-2 py-1 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* رابط القراءة */}
                    <a
                      href={`/articles/${relatedArticle.slug}`}
                      className="inline-flex items-center mt-4 text-primary hover:text-blue-400 transition-colors duration-300 font-semibold"
                    >
                      اقرأ المزيد
                      <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* إعلان أسفل المقال */}
      <AdBanner placement="article_bottom" className="mt-12" />
    </div>
  );
}
