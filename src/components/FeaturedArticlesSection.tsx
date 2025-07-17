// قسم المقالات المميزة (مقال كبير + 4 مقالات صغيرة)
import { Article } from "@/types";
import { FeaturedArticleCard } from "./FeaturedArticleCard";
import { SmallArticleCard } from "./SmallArticleCard";
import { ArticleCard } from "./ArticleCard";
import Image from "next/image";
import Link from "next/link";

interface FeaturedArticlesSectionProps {
  articles: Article[];
}

export function FeaturedArticlesSection({ articles }: FeaturedArticlesSectionProps) {
  if (articles.length === 0) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-dark-card rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-dark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">لا توجد مقالات بعد</h3>
            <p className="text-text-description">سنقوم بنشر المقالات قريباً، ترقبوا المحتوى الجديد!</p>
          </div>
        </div>
      </section>
    );
  }

  // المقال الرئيسي (الأحدث)
  const featuredArticle = articles[0];
  
  // المقالات الصغيرة (الأحدث بعد المقال الرئيسي)
  const sideArticles = articles.slice(1, 5);

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

        {/* تخطيط المقالات */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* المقال الرئيسي الكبير */}
          <div className="lg:col-span-2">
            <FeaturedArticleCard article={featuredArticle} />
          </div>

          {/* المقالات الصغيرة */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {sideArticles.length > 0 ? (
                sideArticles.map((article) => (
                  <SmallArticleCard key={article.id} article={article} />
                ))
              ) : (
                // إذا لم تكن هناك مقالات كافية، نعرض رسالة
                <div className="text-center py-8">
                  <p className="text-dark-text-secondary">
                    المزيد من المقالات قريباً...
                  </p>
                </div>
              )}
              
              {/* إذا كان عدد المقالات أقل من 4، نملأ المساحة المتبقية */}
              {sideArticles.length < 4 && sideArticles.length > 0 && (
                <div className="bg-dark-card/50 rounded-lg border border-gray-800 border-dashed p-6 text-center">
                  <div className="text-text-description text-sm">
                    <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    المزيد من المقالات قريباً
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* مقالات إضافية إذا كان هناك أكثر من 5 مقالات */}
        {articles.length > 5 && (
          <div className="mt-16">
            <h3 className="heading-2 mb-8 border-r-4 border-primary pr-4">
              مقالات أخرى
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.slice(5).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
