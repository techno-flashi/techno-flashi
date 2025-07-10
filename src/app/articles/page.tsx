// صفحة جميع المقالات - محسنة مع debugging
import { supabase, fixObjectEncoding } from "@/lib/supabase";
import { ArticleCard } from "@/components/ArticleCard";
import { NewsletterSubscription } from "@/components/NewsletterSubscription";
import { Article } from "@/types";

export const revalidate = 60; // تقليل وقت التحديث للاختبار

async function getAllArticles() {
  try {
    console.log('🔄 Fetching all published articles...');

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published') // فقط المقالات المنشورة
      .order('published_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching articles:', error);
      return [];
    }

    console.log('✅ Published articles fetched:', data?.length || 0);

    if (data && data.length > 0) {
      console.log('📄 Sample article titles:', data.slice(0, 3).map(a => a.title));
    }

    // إصلاح encoding النص العربي
    const fixedData = data?.map(article => fixObjectEncoding(article)) || [];
    return fixedData as Article[];
  } catch (error) {
    console.error('❌ Exception in getAllArticles:', error);
    return [];
  }
}

export const metadata = {
  title: "جميع المقالات",
  description: "تصفح جميع المقالات التقنية في TechnoFlash",
};

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  console.log('🎯 Articles page rendering with', articles.length, 'articles');

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* رأس الصفحة */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-white mb-6">
            جميع المقالات
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-2xl mx-auto">
            اكتشف مجموعة شاملة من المقالات التقنية المتخصصة في الذكاء الاصطناعي والبرمجة
          </p>
          {/* إضافة عداد للتشخيص */}
          <div className="mt-4 text-sm text-gray-400">
            عدد المقالات المتاحة: {articles.length}
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="bg-dark-card rounded-xl p-6 mb-12 border border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse mb-4 md:mb-0">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {articles.length} مقال متاح
                </h3>
                <p className="text-dark-text-secondary text-sm">
                  محتوى تقني عالي الجودة
                </p>
              </div>
            </div>
            
            {/* فلاتر (يمكن تطويرها لاحقاً) */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <select className="bg-dark-background border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300">
                <option value="latest">الأحدث</option>
                <option value="oldest">الأقدم</option>
                <option value="popular">الأكثر شعبية</option>
              </select>
              <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* قائمة المقالات */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-dark-card rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-dark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">لا توجد مقالات بعد</h3>
            <p className="text-dark-text-secondary text-lg mb-8">
              سنقوم بنشر المقالات قريباً، ترقبوا المحتوى الجديد!
            </p>
            <a
              href="/"
              className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center"
            >
              العودة للرئيسية
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
          </div>
        )}

        {/* روابط سريعة للصفحات */}
        {articles.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">
              هل أعجبك المحتوى؟
            </h3>
            <p className="text-dark-text-secondary text-center mb-6">
              تعرف على المزيد حول TechnoFlash أو تواصل معنا
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/page/about-us"
                className="border border-gray-600 hover:border-primary text-white hover:text-primary px-6 py-3 rounded-lg font-medium transition-colors duration-300 text-center"
              >
                من نحن
              </a>

              <a
                href="/page/contact-us"
                className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 text-center"
              >
                تواصل معنا
              </a>
            </div>
          </div>
        )}

        {/* الاشتراك في النشرة البريدية */}
        {articles.length > 0 && (
          <div className="mt-12">
            <NewsletterSubscription
              variant="default"
              source="articles-page"
              title="هل تريد المزيد من المحتوى؟"
              description="اشترك في نشرتنا الأسبوعية واحصل على أحدث المقالات التقنية مباشرة في بريدك الإلكتروني"
            />
          </div>
        )}
      </div>
    </div>
  );
}
