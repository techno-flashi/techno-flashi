// هذه هي الصفحة الرئيسية للموقع

import { supabase, fixObjectEncoding } from "@/lib/supabase";
import { getLatestArticlesOptimized } from "@/lib/database";
import { FeaturedArticlesSection } from "@/components/FeaturedArticlesSection";

import { NewsletterSubscription } from "@/components/NewsletterSubscription";


import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";

import LatestAIToolsSection from "@/components/LatestAIToolsSection";
import PromoAd from "@/components/PromoAd";



import SocialShare from "@/components/SocialShare";
import { getSharingUrl, getSharingHashtags } from "@/lib/social-meta";

import Link from "next/link";

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





export default async function HomePage() {
  const latestArticles = await getLatestArticles();

  return (
    <div>



      {/* Hero Section - مبسط */}
      <section className="hero-interactive gradient-bg-interactive relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-purple-50 to-pink-50 gpu-accelerated">
        {/* المحتوى الرئيسي */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="glow-text text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight gpu-accelerated">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                TechnoFlash
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              منصتك الشاملة لأحدث التقنيات وأدوات الذكاء الاصطناعي
            </p>
          </div>

          {/* الأزرار */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/articles"
              className="interactive-button group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 gpu-accelerated"
            >
              <span>استكشف المقالات</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <Link
              href="/ai-tools"
              className="interactive-button group border-2 border-purple-400 text-purple-400 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-400 hover:text-white transition-all duration-300 flex items-center gap-3 gpu-accelerated"
            >
              <span>أدوات الذكاء الاصطناعي</span>
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </Link>
          </div>

          {/* الإحصائيات */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="stat-item text-center interactive-shadow gpu-accelerated">
              <div className="stat-number text-3xl md:text-4xl font-bold text-gray-900 mb-2">100+</div>
              <div className="text-gray-600">مقال تقني</div>
            </div>
            <div className="stat-item text-center interactive-shadow gpu-accelerated">
              <div className="stat-number text-3xl md:text-4xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">أداة ذكاء اصطناعي</div>
            </div>
            <div className="stat-item text-center interactive-shadow gpu-accelerated">
              <div className="stat-number text-3xl md:text-4xl font-bold text-gray-900 mb-2">1000+</div>
              <div className="text-gray-600">قارئ نشط</div>
            </div>
          </div>
        </div>

        {/* مؤشر التمرير */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <div className="w-8 h-8 border-2 border-gray-400/60 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
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



      {/* Performance optimized sections with lazy loading */}
      <PerformanceOptimizer
        latestArticles={latestArticles}
      />



      {/* قسم أحدث أدوات الذكاء الاصطناعي */}
      <LatestAIToolsSection />

      {/* إعلان Hostinger بعد أدوات الذكاء الاصطناعي */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="container mx-auto">
          <PromoAd type="hostinger" variant="default" />
        </div>
      </section>

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

      {/* إعلان EasySite قبل النشرة البريدية */}
      <section className="py-8 px-4 bg-white">
        <div className="container mx-auto">
          <PromoAd type="easysite" variant="default" />
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
