// صفحة جميع المقالات - محسنة مع debugging
import { supabase, fixObjectEncoding } from "@/lib/supabase";
import { getAllArticlesForSSG, getStatsForSSG } from "@/lib/ssg";
import { ArticleCard } from "@/components/ArticleCard";
import { NewsletterSubscription } from "@/components/NewsletterSubscription";
import { HeaderAd, FooterAd, InContentAd } from "@/components/ads/AdManager";
import { Article } from "@/types";



async function getAllArticles() {
  try {
    console.log('🔄 Fetching all published articles...');

    // محاولة استخدام SSG function أولاً
    try {
      console.log('🔄 Attempting SSG fetch...');
      const articles = await getAllArticlesForSSG();

      if (articles && articles.length > 0) {
        console.log(`✅ Found ${articles.length} articles from SSG`);
        console.log('📄 Sample SSG articles:', articles.slice(0, 3).map(a => ({ title: a.title, slug: a.slug })));
        const fixedData = articles.map(article => {
          const fixed = fixObjectEncoding(article) as any;
          return {
            ...fixed,
            featured_image_url: fixed.featured_image || fixed.featured_image_url || '',
            published_at: fixed.published_at || fixed.created_at
          };
        });
        return fixedData as Article[];
      } else {
        console.log('⚠️ No articles found from SSG (returned empty array), trying runtime fetch...');
      }
    } catch (ssgError) {
      console.error('❌ SSG fetch failed, falling back to runtime:', {
        message: (ssgError as Error).message,
        name: (ssgError as Error).name,
        stack: (ssgError as Error).stack
      });
    }

    // fallback للـ runtime إذا فشل SSG
    console.log('🔄 Using runtime fetch...');
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching articles from runtime:', error);
      return [];
    }

    console.log(`✅ Runtime articles fetched: ${data?.length || 0}`);

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

// تحسين استهلاك الموارد - ISR محسن
export const revalidate = 86400; // 24 ساعة لتوفير ISR writes
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

        {/* إعلان أعلى قائمة المقالات */}
        <HeaderAd className="mb-8" />

        {/* قائمة المقالات */}
        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <div key={`article-${article.id}-${index}`} className="contents">
                  <ArticleCard article={article} />
                  {/* إعلان بين المقالات كل 6 مقالات */}
                  {(index + 1) % 6 === 0 && (
                    <div className="col-span-full">
                      <InContentAd className="my-8" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>

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

        {/* إعلان الفوتر */}
        <FooterAd className="mt-12" />
      </div>
    </div>
  );
}
