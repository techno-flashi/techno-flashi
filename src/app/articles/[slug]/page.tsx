// هذه هي الصفحة الديناميكية التي تعرض مقالاً واحداً بناءً على رابطه (slug)

import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import AdBanner from "@/components/ads/AdBanner";
import { ArticleContent } from "@/components/ArticleContent";
import { EditorJSRenderer } from "@/components/EditorJSRenderer";
import JsonLd, { createArticleJsonLd } from "@/components/JsonLd";
import { Breadcrumbs, createBreadcrumbJsonLd } from "@/components/Breadcrumbs";
import { generateArticleSocialMeta, getSharingUrl, getSharingHashtags } from "@/lib/social-meta";
import SocialShare from "@/components/SocialShare";
import SocialShareCompact from "@/components/SocialShareCompact";

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
    return {
      title: "المقال غير موجود - TechnoFlash",
      description: "المقال المطلوب غير موجود أو تم حذفه"
    };
  }

  const keywords = article.seo_keywords || article.tags || [];
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : '';

  return generateArticleSocialMeta({
    title: article.title,
    excerpt: article.meta_description || article.excerpt || article.title,
    slug: article.slug,
    featured_image: article.featured_image_url,
    category: article.category || 'تقنية',
    author: article.author,
    created_at: article.created_at,
    updated_at: article.updated_at,
    tags: keywords
  });
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

  // إنشاء Schema Markup للمقال
  const articleJsonLd = createArticleJsonLd({
    title: article.title,
    description: article.meta_description || article.excerpt,
    featured_image: article.featured_image_url,
    author: article.author,
    created_at: article.published_at,
    updated_at: article.updated_at,
    slug: article.slug
  });

  // إنشاء breadcrumbs
  const breadcrumbItems = [
    { label: 'المقالات', href: '/articles' },
    { label: article.title }
  ];
  const breadcrumbJsonLd = createBreadcrumbJsonLd(breadcrumbItems);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Schema Markup للمقال والـ breadcrumbs */}
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* إعلان أعلى المقال */}
      <AdBanner placement="article_top" className="mb-6 md:mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* المحتوى الرئيسي - محسن للقراءة */}
        <article className="lg:col-span-3 max-w-none lg:max-w-[80%]">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-dark-text-secondary mb-6 md:mb-8 text-sm sm:text-base">
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
            <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
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

          <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden mb-6 md:mb-8">
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

          {/* مشاركة المقال */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6 text-center">شارك هذا المقال</h3>
            <SocialShare
              url={getSharingUrl(`/articles/${article.slug}`)}
              title={article.title}
              description={article.excerpt || article.title}
              hashtags={getSharingHashtags(article.tags || [])}
              showLabels={true}
              size="lg"
              className="justify-center"
            />
          </div>
        </article>

        {/* الشريط الجانبي - محسن للأجهزة المحمولة */}
        <aside className="lg:col-span-1 order-first lg:order-last">
          <div className="sticky top-4 lg:top-8 space-y-4 lg:space-y-6">
            {/* عناصر التنقل السريع */}
            <div className="bg-dark-card rounded-lg p-4 lg:p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">التنقل السريع</h3>
              <nav className="space-y-3">
                <a
                  href="/"
                  className="flex items-center text-dark-text-secondary hover:text-primary transition-colors duration-300 text-sm lg:text-base min-h-[44px] px-3 py-2 rounded-lg hover:bg-primary/10"
                >
                  <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  الصفحة الرئيسية
                </a>
                <a
                  href="/ai-tools"
                  className="flex items-center text-dark-text-secondary hover:text-primary transition-colors duration-300 text-sm lg:text-base min-h-[44px] px-3 py-2 rounded-lg hover:bg-primary/10"
                >
                  <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  أدوات الذكاء الاصطناعي
                </a>
                <a
                  href="/services"
                  className="flex items-center text-dark-text-secondary hover:text-primary transition-colors duration-300 text-sm lg:text-base min-h-[44px] px-3 py-2 rounded-lg hover:bg-primary/10"
                >
                  <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                  </svg>
                  الخدمات
                </a>
                <a
                  href="/articles"
                  className="flex items-center text-primary font-medium text-sm lg:text-base min-h-[44px] px-3 py-2 rounded-lg bg-primary/10"
                >
                  <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  جميع المقالات
                </a>
              </nav>
            </div>

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
              <SocialShare
                url={getSharingUrl(`/articles/${article.slug}`)}
                title={article.title}
                description={article.excerpt || article.title}
                hashtags={getSharingHashtags(article.tags || [])}
                size="sm"
                className="justify-center"
              />
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

      {/* قسم التنقل للأجهزة المحمولة */}
      <section className="lg:hidden mt-12 bg-dark-card rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">استكشف المزيد</h3>
        <div className="grid grid-cols-2 gap-4">
          <a
            href="/"
            className="flex flex-col items-center text-center p-4 rounded-lg border border-gray-700 hover:border-primary/50 transition-colors duration-300 min-h-[80px] justify-center"
          >
            <svg className="w-6 h-6 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-white text-sm font-medium">الرئيسية</span>
          </a>
          <a
            href="/ai-tools"
            className="flex flex-col items-center text-center p-4 rounded-lg border border-gray-700 hover:border-primary/50 transition-colors duration-300 min-h-[80px] justify-center"
          >
            <svg className="w-6 h-6 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-white text-sm font-medium">أدوات الذكاء</span>
          </a>
          <a
            href="/services"
            className="flex flex-col items-center text-center p-4 rounded-lg border border-gray-700 hover:border-primary/50 transition-colors duration-300 min-h-[80px] justify-center"
          >
            <svg className="w-6 h-6 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
            </svg>
            <span className="text-white text-sm font-medium">الخدمات</span>
          </a>
          <a
            href="/articles"
            className="flex flex-col items-center text-center p-4 rounded-lg border border-primary/50 bg-primary/10 transition-colors duration-300 min-h-[80px] justify-center"
          >
            <svg className="w-6 h-6 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="text-primary text-sm font-medium">جميع المقالات</span>
          </a>
        </div>
      </section>

      {/* إعلان أسفل المقال */}
      <AdBanner placement="article_bottom" className="mt-8 lg:mt-12" />
    </div>
  );
}
