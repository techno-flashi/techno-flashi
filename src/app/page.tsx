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
    const data = await getLatestArticlesOptimized(8);
    console.log('✅ Homepage: Articles fetched:', data?.length || 0);
    if (data && data.length > 0) {
      console.log('📄 Homepage: Latest article titles:', data.slice(0, 3).map(a => a.title));
    }
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
      <PerformanceOptimizer latestArticles={latestArticles} />

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

      {/* إعلان في أعلى الصفحة الرئيسية */}
      <div className="my-12">
        <PromoAd type="hostinger" />
      </div>

      {/* المقالات المميزة */}
      <FeaturedArticlesSection articles={latestArticles.slice(0, 3)} />

      {/* إعلان في الوسط */}
      <div className="my-12">
        <PromoAd type="easysite" />
      </div>

      {/* أدوات الذكاء الاصطناعي الجديدة */}
      <LatestAIToolsSection />

      {/* النشرة البريدية */}
      <NewsletterSubscription />

      {/* إعلان في النهاية */}
      <div className="my-12">
        <PromoAd type="hostinger" />
      </div>

      {/* مشاركة اجتماعية */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">شارك معنا على وسائل التواصل</h3>
          <SocialShare 
            url={getSharingUrl('/')} 
            title="TechnoFlash - منصتك التقنية الشاملة"
            description="اكتشف أحدث المقالات التقنية وأدوات الذكاء الاصطناعي"
            hashtags={getSharingHashtags(['تقنية', 'ذكاء_اصطناعي', 'برمجة'])}
          />
        </div>
      </div>
    </div>
  )
}