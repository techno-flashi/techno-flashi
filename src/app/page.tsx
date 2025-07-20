// هذه هي الصفحة الرئيسية للموقع

import { supabase, fixObjectEncoding } from "@/lib/supabase";
import { getLatestArticlesOptimized } from "@/lib/database";
import { FeaturedArticlesSection } from "@/components/FeaturedArticlesSection";
import { ServicesSection } from "@/components/ServicesSection";
import AdBanner from "@/components/ads/AdBanner";
import { NewsletterSubscription } from "@/components/NewsletterSubscription";
import SponsorsSection from "@/components/SponsorsSection";
import AdBannerTop from "@/components/AdBannerTop";
import { InContentAnimatedAd } from "@/components/ads/AnimatedAdRenderer";
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";
import { TechnoFlashContentBanner } from "@/components/ads/TechnoFlashBanner";

import SocialShare from "@/components/SocialShare";
import { getSharingUrl, getSharingHashtags } from "@/lib/social-meta";
import YouTubeSection from "@/components/YouTubeSection";

import { ArticleSummary, AITool, Service } from "@/types";

// Import critical CSS for faster LCP
import "@/styles/critical-homepage.css";

// Optimized ISR for faster updates while maintaining performance
export const revalidate = 300; // 5 minutes for faster updates
export const dynamic = 'force-static';
export const dynamicParams = false;

async function getLatestArticles() {
  try {
    console.log('🏠 Homepage: Fetching latest articles...');

    // استخدام الدالة المحسنة مع التخزين المؤقت
    const data = await getLatestArticlesOptimized(8);

    console.log('✅ Homepage: Articles fetched:', data?.length || 0);

    if (data && data.length > 0) {
      console.log('📄 Homepage: Latest article titles:', data.slice(0, 3).map(a => a.title));
    }

    // إصلاح encoding النص العربي
    const fixedData = data?.map(article => fixObjectEncoding(article)) || [];
    return fixedData;
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
      {/* Hero Section - Modern Design */}
      <section className="relative pt-24 pb-28 overflow-hidden bg-slate-50">
        {/* عناصر هندسية متحركة */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          {/* Tagline */}
          <div className="inline-block bg-white/50 backdrop-blur-sm text-purple-800 text-sm font-semibold px-4 py-2 rounded-full mb-5">
            ✨ بوابتك للمستقبل التقني
          </div>
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-4">
            مستقبلك التقني<br />يبدأ من هنا
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-lg text-slate-700 mb-8">
            اكتشف أحدث التقنيات، أدوات الذكاء الاصطناعي المتطورة، ومقالات تقنية متخصصة لتطوير مهاراتك ومواكبة عالم التكنولوجيا المتسارع.
          </p>



          {/* Action Buttons */}
          <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse mb-12">
            <a href="/articles" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 font-semibold">
              ابدأ الاستكشاف
            </a>
            <a href="/services" className="bg-white text-slate-700 px-8 py-3 rounded-lg shadow-md hover:bg-slate-100 transition-all font-semibold flex items-center space-x-2 rtl:space-x-reverse">
              <span>تصفح الخدمات</span>
              <span className="text-lg">←</span>
            </a>
          </div>
        </div>
      </section>





      {/* قسم المميزات المحدث بتصميم 2025 */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        {/* خلفية هندسية */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600 to-secondary-600"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800 rounded-full text-sm font-medium mb-6">
              ✨ مميزات استثنائية
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              لماذا تختار
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600"> TechnoFlash</span>؟
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              نقدم لك تجربة تقنية متكاملة تجمع بين المحتوى عالي الجودة والأدوات المتطورة والخدمات المتخصصة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* المحتوى التقني */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-neutral-100">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">محتوى تقني متميز</h3>
                <p className="text-gray-600 text-center leading-relaxed mb-6">
                  مقالات وأدلة شاملة تغطي أحدث التطورات في عالم التكنولوجيا والبرمجة والذكاء الاصطناعي
                </p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    500+ مقال
                  </span>
                </div>
              </div>
            </div>

            {/* الذكاء الاصطناعي */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">أدوات ذكية متطورة</h3>
                <p className="text-gray-600 text-center leading-relaxed mb-6">
                  مجموعة شاملة من أدوات الذكاء الاصطناعي المتقدمة لتسهيل عملك وزيادة إنتاجيتك
                </p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    50+ أداة
                  </span>
                </div>
              </div>
            </div>

            {/* الحلول التقنية */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">خدمات متخصصة</h3>
                <p className="text-gray-600 text-center leading-relaxed mb-6">
                  حلول تقنية مخصصة وخدمات تطوير واستشارات متخصصة لتحقيق أهدافك التقنية
                </p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    خدمات شاملة
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* إحصائيات إضافية */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">10K+</div>
              <div className="text-gray-600">قارئ نشط</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">95%</div>
              <div className="text-gray-600">رضا العملاء</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">دعم فني</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-blue-600 mb-2">100+</div>
              <div className="text-gray-600">مشروع مكتمل</div>
            </div>
          </div>
        </div>
      </section>

      {/* إعلان تكنوفلاش المتحرك */}
      <TechnoFlashContentBanner className="my-8" />

      {/* Performance optimized sections with lazy loading */}
      <PerformanceOptimizer
        latestArticles={latestArticles}
        latestServices={latestServices}
      />

      {/* إعلان بين الأقسام */}
      <InContentAnimatedAd currentPage="/" className="my-12" />





      {/* قسم روابط سريعة للصفحات المهمة */}
      <section className="py-16 px-4 bg-background-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">استكشف المزيد</h2>
            <p className="text-description text-lg max-w-2xl mx-auto">
              اكتشف جميع المقالات المتخصصة في مجال التكنولوجيا
            </p>
          </div>

          <div className="flex justify-center">
            <a
              href="/articles"
              className="group bg-white rounded-xl p-6 border border-light-border hover:border-primary/50 transition-all duration-300 transform hover:scale-105 max-w-sm shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="heading-3 mb-2">جميع المقالات</h3>
              <p className="text-description text-sm">اقرأ جميع المقالات التقنية المتخصصة</p>
            </a>
          </div>
        </div>
      </section>



      {/* قسم الرعاة */}
      <SponsorsSection />

      {/* قسم اليوتيوب */}
      <YouTubeSection />

      {/* قسم مشاركة الموقع */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 mb-4">شارك TechnoFlash</h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
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




    </div>
  );
}
