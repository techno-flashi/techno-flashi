// قسم المقالات المميزة (3 مقالات جنباً إلى جنب)
import { Article } from "@/types";
import { ArticleCard } from "./ArticleCard";

interface FeaturedArticlesSectionProps {
  articles: Article[];
}

export function FeaturedArticlesSection({ articles }: FeaturedArticlesSectionProps) {
  if (articles.length === 0) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مقالات بعد</h3>
            <p className="text-text-description">سنقوم بنشر المقالات قريباً، ترقبوا المحتوى الجديد!</p>
          </div>
        </div>
      </section>
    );
  }

  // أول 3 مقالات للعرض الجانبي
  const latestArticles = articles.slice(0, 3);

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        {/* عنوان القسم */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="heading-1 mb-4">أحدث المقالات</h2>
            <p className="text-text-description">اكتشف آخر ما نشرناه من محتوى تقني مفيد</p>
          </div>
          <a
            href="/articles"
            className="text-primary hover:text-blue-400 font-semibold transition-colors duration-300 flex items-center"
          >
            عرض الكل
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
        </div>

        {/* 3 مقالات صغيرة جنباً إلى جنب */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestArticles.length > 0 ? (
            latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            // إذا لم تكن هناك مقالات، نعرض رسالة
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">
                المزيد من المقالات قريباً...
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
