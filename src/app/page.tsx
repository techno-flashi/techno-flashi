// هذه هي الصفحة الرئيسية للموقع

import { supabase, fixObjectEncoding } from "@/lib/supabase";
import { FeaturedArticlesSection } from "@/components/FeaturedArticlesSection";
import { ServicesSection } from "@/components/ServicesSection";
import AdBanner from "@/components/ads/AdBanner";
import { NewsletterSubscription } from "@/components/NewsletterSubscription";
import SponsorsSection from "@/components/SponsorsSection";
import AdBannerTop from "@/components/AdBannerTop";
import { HeaderAd, FooterAd, InContentAd } from "@/components/ads/AdManager";
import { TechnoFlashContentBanner } from "@/components/ads/TechnoFlashBanner";
import SocialShare from "@/components/SocialShare";
import { getSharingUrl, getSharingHashtags } from "@/lib/social-meta";
import YouTubeSection from "@/components/YouTubeSection";

import { Article, AITool, Service } from "@/types";

// تحسين استهلاك الموارد - ISR محسن لتوفير Vercel ISR writes
export const revalidate = 86400; // 24 ساعة بدلاً من دقيقة واحدة
export const dynamic = 'force-static';
export const dynamicParams = false;

async function getLatestArticles() {
  try {
    console.log('🏠 Homepage: Fetching latest articles...');

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published') // فقط المقالات المنشورة
      .order('published_at', { ascending: false })
      .limit(8); // جلب آخر 8 مقالات (1 رئيسي + 4 صغيرة + 3 إضافية)

    if (error) {
      console.error('❌ Homepage: Error fetching articles:', error);
      return [];
    }

    console.log('✅ Homepage: Articles fetched:', data?.length || 0);

    if (data && data.length > 0) {
      console.log('📄 Homepage: Latest article titles:', data.slice(0, 3).map(a => a.title));
    }

    // إصلاح encoding النص العربي
    const fixedData = data?.map(article => fixObjectEncoding(article)) || [];
    return fixedData as Article[];
  } catch (error) {
    console.error('❌ Homepage: Exception in getLatestArticles:', error);
    return [];
  }
}



async function getLatestServices() {
  try {
    // جلب الخدمات مباشرة من Supabase بدلاً من API
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'active')
      // إزالة فلتر featured مؤقتاً لعرض جميع الخدمات النشطة
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching services from database:', error);
      return [];
    }

    console.log('Services fetched from database:', data?.length || 0);

    // إصلاح encoding النص العربي
    const fixedData = data?.map(service => fixObjectEncoding(service)) || [];
    return fixedData as Service[];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export default async function HomePage() {
  const latestArticles = await getLatestArticles();
  const latestServices = await getLatestServices();

  return (
    <div>
      {/* بانر الإعلان العلوي */}
      <AdBannerTop />

      {/* القسم الرئيسي (Hero Section) */}
      <section className="relative bg-gradient-to-br from-dark-background via-dark-card to-dark-background py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              مستقبلك التقني يبدأ من هنا مع{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                TechnoFlash
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              اكتشف أحدث المقالات والأدوات في عالم الذكاء الاصطناعي والبرمجة، واحصل على خدمات تقنية متخصصة لتطوير مشاريعك.
            </p>
            <div className="flex justify-center">
              <a
                href="/articles"
                className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/25 transform hover:-translate-y-1"
              >
                استكشف المقالات
              </a>
            </div>
          </div>
        </div>

        {/* عناصر تزيينية */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* قسم المميزات */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">لماذا TechnoFlash؟</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              نقدم لك كل ما تحتاجه لتطوير مهاراتك التقنية ومشاريعك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-white border border-gray-200 hover:border-primary/50 transition-all duration-300 group shadow-sm hover:shadow-md">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">المحتوى التقني</h3>
              <p className="text-gray-600">محتوى تقني عالي الجودة يغطي أحدث التطورات في عالم التكنولوجيا</p>
            </div>

            <div className="text-center p-8 rounded-xl bg-white border border-gray-200 hover:border-primary/50 transition-all duration-300 group shadow-sm hover:shadow-md">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">الذكاء الاصطناعي</h3>
              <p className="text-gray-600">دليل شامل لأفضل أدوات الذكاء الاصطناعي مع تقييمات ومراجعات مفصلة</p>
            </div>

            <div className="text-center p-8 rounded-xl bg-white border border-gray-200 hover:border-primary/50 transition-all duration-300 group shadow-sm hover:shadow-md">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">الحلول التقنية</h3>
              <p className="text-gray-600">خدمات تطوير وتصميم واستشارات تقنية لمساعدتك في تحقيق أهدافك</p>
            </div>
          </div>
        </div>
      </section>

      {/* إعلان تكنوفلاش المتحرك */}
      <TechnoFlashContentBanner className="my-8" />

      {/* إعلان الهيدر */}
      <HeaderAd className="mb-8" />

      {/* قسم أحدث المقالات مع التصميم الجديد */}
      <FeaturedArticlesSection articles={latestArticles} />

      {/* إعلان بين الأقسام */}
      <InContentAd className="my-12" />



      {/* قسم روابط سريعة للصفحات المهمة */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">استكشف المزيد</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              اكتشف جميع المقالات المتخصصة في مجال التكنولوجيا
            </p>
          </div>

          <div className="flex justify-center">
            <a
              href="/articles"
              className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 max-w-sm shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">جميع المقالات</h3>
              <p className="text-gray-600 text-sm">اقرأ جميع المقالات التقنية المتخصصة</p>
            </a>
          </div>
        </div>
      </section>

      {/* قسم الخدمات المميزة */}
      <ServicesSection
        services={latestServices}
        title="خدماتنا المميزة"
        maxItems={3}
      />

      {/* قسم الرعاة */}
      <SponsorsSection />

      {/* قسم اليوتيوب */}
      <YouTubeSection />

      {/* قسم مشاركة الموقع */}
      <section className="py-20 px-4 bg-dark-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">شارك TechnoFlash</h2>
            <p className="text-dark-text-secondary text-lg max-w-2xl mx-auto">
              ساعد في نشر المعرفة التقنية وشارك موقعنا مع أصدقائك ومتابعيك
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <SocialShare
              url={getSharingUrl('/')}
              title="TechnoFlash - بوابتك للمستقبل التقني"
              description="منصة ويب متكاملة تقدم مقالات تقنية حصرية، ودليل شامل لأدوات الذكاء الاصطناعي، وخدمات متخصصة في عالم البرمجة والتكنولوجيا"
              hashtags={getSharingHashtags(['تقنية', 'برمجة', 'تطوير'])}
              showLabels={true}
              size="lg"
              className="justify-center"
            />
          </div>
        </div>
      </section>

      {/* قسم الاشتراك في النشرة البريدية */}
      <NewsletterSubscription
        variant="featured"
        source="homepage"
        showName={false}
      />

      {/* إعلان الفوتر */}
      <FooterAd className="mt-12" />
    </div>
  );
}
