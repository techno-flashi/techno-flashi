// صفحة جميع المقالات - محسنة مع debugging
import { supabase, fixObjectEncoding } from "@/lib/supabase";
import { getAllArticlesForSSG, getStatsForSSG } from "@/lib/ssg";
import { ArticleCard } from "@/components/ArticleCard";
import { NewsletterSubscription } from "@/components/NewsletterSubscription";

import { Article } from "@/types";



async function getAllArticles() {
  try {
    console.log('🔄 Fetching all published articles...');

    // استخدام استعلام محسن مباشرة بدلاً من الجلب المزدوج
    const { data, error } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image_url,
        published_at,
        created_at,
        reading_time,
        author,
        tags,
        featured,
        category
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50); // تحديد عدد المقالات لتحسين الأداء

    if (error) {
      console.error('❌ Error fetching articles:', error);
      return [];
    }

    console.log(`✅ Articles fetched: ${data?.length || 0}`);

    if (data && data.length > 0) {
      console.log('📄 Sample article titles:', data.slice(0, 3).map(a => a.title));
    }

    // إصلاح encoding النص العربي وتحويل البيانات
    const fixedData = data?.map(article => {
      const fixed = fixObjectEncoding(article) as any;
      return {
        ...fixed,
        featured_image_url: fixed.featured_image || fixed.featured_image_url || '',
        published_at: fixed.published_at || fixed.created_at
      };
    }) || [];
    return fixedData as Article[];
  } catch (error: any) {
    console.error('💥 Exception in getAllArticles:');
    console.error('Error message:', error?.message || 'Unknown error');
    console.error('Error stack:', error?.stack || 'No stack trace');
    console.error('Full error object:', JSON.stringify(error, null, 2));
    return [];
  }
}

// Optimized ISR for faster content updates
export const revalidate = 300; // 5 minutes for faster updates
export const dynamic = 'force-static';
export const dynamicParams = false;

export const metadata = {
  title: "جميع المقالات",
  description: "تصفح جميع المقالات التقنية في TechnoFlash",
};

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  console.log('🎯 Articles page rendering with', articles.length, 'articles');

  // طباعة معلومات الصور للتشخيص
  articles.forEach((article, index) => {
    if (index < 3) { // أول 3 مقالات فقط
      console.log(`📷 Article ${index + 1} (${article.title}):`, {
        id: article.id,
        hasImage: !!article.featured_image_url,
        imageUrl: article.featured_image_url
      });
    }
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section للمقالات */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* خلفية متدرجة */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
        </div>

        {/* عناصر هندسية */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            {/* شارة */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              📚 مكتبة المقالات
            </div>

            {/* العنوان الرئيسي */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              جميع
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> المقالات</span>
            </h1>

            {/* الوصف */}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              اكتشف مجموعة شاملة من المقالات التقنية المتخصصة في الذكاء الاصطناعي، البرمجة، والتقنيات الحديثة
            </p>

            {/* إحصائيات */}
            <div className="inline-flex items-center px-6 py-3 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mr-2">
                {articles.length}
              </span>
              <span className="text-gray-700 font-medium">مقال متاح</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* شريط الفلاتر والبحث */}
        <div className="mb-12">
          <div className="modern-card p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* معلومات المجموعة */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 modern-gradient-blue rounded-xl flex items-center justify-center shadow-colored">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {articles.length} مقال متاح
                  </h3>
                  <p className="text-gray-600 text-sm">
                    محتوى تقني عالي الجودة ومحدث
                  </p>
                </div>
              </div>

              {/* أدوات الفلترة */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <select className="glass-effect border border-gray-200 text-gray-700 px-4 py-2 rounded-xl focus-modern smooth-transition">
                  <option value="latest">الأحدث</option>
                  <option value="oldest">الأقدم</option>
                  <option value="popular">الأكثر شعبية</option>
                </select>
                <button className="modern-button text-white px-4 py-2 hover-lift focus-modern">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>



        {/* قائمة المقالات */}
        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <div key={`article-${article.id}-${index}`} className="contents">
                  <ArticleCard article={article} />

                </div>
              ))}
            </div>
          </>

        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 glass-effect rounded-full flex items-center justify-center mx-auto mb-8 shadow-modern">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">لا توجد مقالات بعد</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              سنقوم بنشر المقالات قريباً، ترقبوا المحتوى الجديد والمفيد!
            </p>
            <a
              href="/"
              className="modern-button text-white px-8 py-3 hover-lift focus-modern inline-flex items-center"
            >
              العودة للرئيسية
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
          </div>
        )}

        {/* قسم الدعوة للعمل */}
        {articles.length > 0 && (
          <div className="mt-16">
            <div className="modern-card p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  هل أعجبك المحتوى؟
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  تعرف على المزيد حول TechnoFlash، مهمتنا، وكيف يمكننا مساعدتك في رحلتك التقنية
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/page/about-us"
                    className="glass-effect border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 px-6 py-3 rounded-xl font-medium smooth-transition text-center hover-lift"
                  >
                    من نحن
                  </a>

                  <a
                    href="/page/contact-us"
                    className="modern-button text-white px-6 py-3 hover-lift focus-modern text-center"
                  >
                    تواصل معنا
                  </a>
                </div>
              </div>
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
