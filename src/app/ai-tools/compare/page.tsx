import { Metadata } from 'next';
import { Suspense } from 'react';
import { supabase, fixObjectEncoding } from '@/lib/supabase';
import { AITool } from '@/types';
import { AIToolComparison } from '@/components/AIToolComparison';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import AdBanner from '@/components/ads/AdBanner';
import JsonLd from '@/components/JsonLd';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'مقارنة أدوات الذكاء الاصطناعي - اختر الأداة المناسبة لك | TechnoFlash',
  description: 'قارن بين أفضل أدوات الذكاء الاصطناعي المتاحة واختر الأداة المناسبة لاحتياجاتك. مقارنة شاملة للمميزات والأسعار والتقييمات.',
  keywords: 'مقارنة أدوات ذكاء اصطناعي, AI tools comparison, ChatGPT vs Claude, أفضل أدوات AI, مقارنة تقنيات ذكية',
  openGraph: {
    title: 'مقارنة أدوات الذكاء الاصطناعي - اختر الأداة المناسبة لك',
    description: 'قارن بين أفضل أدوات الذكاء الاصطناعي واختر الأداة المناسبة لاحتياجاتك',
    type: 'website',
    locale: 'ar_SA',
    url: 'https://tflash.site/ai-tools/compare',
    siteName: 'TechnoFlash',
  },
  alternates: {
    canonical: 'https://tflash.site/ai-tools/compare',
  },
};

async function getTopAITools() {
  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .in('status', ['published', 'active'])
      .order('rating', { ascending: false })
      .order('click_count', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error fetching AI tools for comparison:', error);
      return [];
    }

    const fixedData = data?.map(tool => fixObjectEncoding(tool)) || [];
    return fixedData as AITool[];
  } catch (error) {
    console.error('Exception in getTopAITools:', error);
    return [];
  }
}

export default async function AIToolsComparePage() {
  const tools = await getTopAITools();

  const breadcrumbItems = [
    { label: 'أدوات الذكاء الاصطناعي', href: '/ai-tools' },
    { label: 'مقارنة الأدوات' }
  ];

  const comparisonJsonLd = {
    "@context": "https://schema.org",
    "@type": "ComparisonPage",
    "name": "مقارنة أدوات الذكاء الاصطناعي",
    "description": "مقارنة شاملة بين أفضل أدوات الذكاء الاصطناعي المتاحة",
    "url": "https://tflash.site/ai-tools/compare",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": tools.length,
      "itemListElement": tools.map((tool, index) => ({
        "@type": "SoftwareApplication",
        "position": index + 1,
        "name": tool.name,
        "description": tool.description,
        "url": `https://tflash.site/ai-tools/${tool.slug}`,
        "applicationCategory": "AI Tool",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": tool.rating,
          "ratingCount": tool.click_count || 1
        }
      }))
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      {/* Schema Markup */}
      <JsonLd data={comparisonJsonLd} />

      {/* إعلان أعلى الصفحة */}
      <AdBanner placement="ai_tools_compare_top" className="mb-8" />

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />

        {/* رأس الصفحة */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-primary text-sm font-medium">⚖️ مقارنة شاملة</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            مقارنة أدوات الذكاء الاصطناعي
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto leading-relaxed">
            قارن بين أفضل أدوات الذكاء الاصطناعي المتاحة واختر الأداة المناسبة لاحتياجاتك. 
            مقارنة شاملة للمميزات والأسعار والتقييمات لمساعدتك في اتخاذ القرار الصحيح.
          </p>
        </div>

        {/* المقارنة الرئيسية */}
        {tools.length >= 2 ? (
          <AIToolComparison tools={tools} className="mb-12" />
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-6xl">⚖️</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">لا توجد أدوات كافية للمقارنة</h3>
            <p className="text-gray-600 text-lg mb-8">
              نحتاج إلى أداتين على الأقل لإجراء المقارنة. سنقوم بإضافة المزيد من الأدوات قريباً!
            </p>
          </div>
        )}

        {/* إعلان وسط المحتوى */}
        <AdBanner placement="ai_tools_compare_middle" className="mb-12" />

        {/* نصائح للاختيار */}
        <div className="bg-dark-card rounded-xl p-8 border border-gray-800 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">نصائح لاختيار الأداة المناسبة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-dark-bg/50 rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary text-xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">حدد احتياجاتك</h3>
              <p className="text-dark-text-secondary text-sm">
                فكر في نوع المهام التي تريد إنجازها والمميزات التي تحتاجها قبل الاختيار.
              </p>
            </div>

            <div className="bg-dark-bg/50 rounded-lg p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-green-400 text-xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">قارن الأسعار</h3>
              <p className="text-dark-text-secondary text-sm">
                تأكد من أن السعر يتناسب مع ميزانيتك وأن الخطة تلبي احتياجاتك.
              </p>
            </div>

            <div className="bg-dark-bg/50 rounded-lg p-6">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-yellow-400 text-xl">⭐</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">اقرأ التقييمات</h3>
              <p className="text-dark-text-secondary text-sm">
                استفد من تجارب المستخدمين الآخرين وتقييماتهم للأدوات المختلفة.
              </p>
            </div>
          </div>
        </div>

        {/* دعوة للعمل */}
        <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            هل تحتاج مساعدة في الاختيار؟
          </h3>
          <p className="text-dark-text-secondary mb-6">
            تواصل معنا للحصول على استشارة مجانية لاختيار الأداة المناسبة لاحتياجاتك
          </p>
          <a
            href="/page/contact-us"
            className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center"
          >
            احصل على استشارة
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </a>
        </div>
      </div>

      {/* إعلان أسفل الصفحة */}
      <AdBanner placement="ai_tools_compare_bottom" className="mt-8" />
    </div>
  );
}
