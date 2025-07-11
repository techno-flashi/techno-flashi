// صفحة جميع أدوات الذكاء الاصطناعي
import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { supabase, fixObjectEncoding } from "@/lib/supabase";
import { AIToolCard } from "@/components/AIToolCard";
import { AITool } from "@/types";
import AdBanner from '@/components/ads/AdBanner';
import JsonLd from '@/components/JsonLd';
import { AIToolsClient } from '@/components/AIToolsClient';

export const revalidate = 60; // تحديث كل دقيقة للتزامن مع باقي الصفحات

async function getAllAITools() {
  try {
    console.log('🔄 Fetching AI tools from database...');

    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .in('status', ['published', 'active']) // قبول كلا من published و active
      .order('rating', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching AI tools:', error);
      return [];
    }

    console.log('✅ AI Tools fetched from database:', data?.length || 0);

    if (data && data.length > 0) {
      console.log('📄 Sample AI tool names:', data.slice(0, 3).map(t => t.name));
    }

    // إصلاح encoding النص العربي
    const fixedData = data?.map(tool => fixObjectEncoding(tool)) || [];
    return fixedData as AITool[];
  } catch (error) {
    console.error('❌ Exception in getAllAITools:', error);
    return [];
  }
}

export const metadata: Metadata = {
  title: 'أدوات الذكاء الاصطناعي - دليل شامل ومراجعات متخصصة | TechnoFlash',
  description: 'اكتشف أفضل أدوات الذكاء الاصطناعي المتاحة حالياً مع مراجعات شاملة ومقارنات تفصيلية. دليلك الموثوق لاختيار الأداة المناسبة لاحتياجاتك التقنية والإبداعية.',
  keywords: 'أدوات ذكاء اصطناعي, AI tools, تقنيات ذكية, مراجعات أدوات, ChatGPT, Midjourney, تكنوفلاش, أدوات إبداعية, تقنيات متقدمة',
  authors: [{ name: 'TechnoFlash' }],
  openGraph: {
    title: 'أدوات الذكاء الاصطناعي - دليل شامل ومراجعات متخصصة',
    description: 'اكتشف أفضل أدوات الذكاء الاصطناعي مع مراجعات شاملة ومقارنات تفصيلية',
    type: 'website',
    locale: 'ar_SA',
    url: 'https://tflash.site/ai-tools',
    siteName: 'TechnoFlash',
    images: [
      {
        url: 'https://tflash.site/og-ai-tools.jpg',
        width: 1200,
        height: 630,
        alt: 'أدوات الذكاء الاصطناعي - TechnoFlash',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أدوات الذكاء الاصطناعي - دليل شامل ومراجعات متخصصة',
    description: 'اكتشف أفضل أدوات الذكاء الاصطناعي مع مراجعات شاملة ومقارنات تفصيلية',
    images: ['https://tflash.site/og-ai-tools.jpg'],
  },
  alternates: {
    canonical: 'https://tflash.site/ai-tools',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// إحصائيات الأدوات
async function getAIToolsStats() {
  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('category, pricing, rating')
      .in('status', ['published', 'active']);

    if (error || !data) return { total: 0, categories: 0, avgRating: 0, freeTools: 0 };

    const categories = new Set(data.map(tool => tool.category)).size;
    const avgRating = data.reduce((sum, tool) => sum + parseFloat(tool.rating || '0'), 0) / data.length;
    const freeTools = data.filter(tool => tool.pricing === 'free').length;

    return {
      total: data.length,
      categories,
      avgRating: avgRating.toFixed(1),
      freeTools
    };
  } catch (error) {
    console.error('Error fetching AI tools stats:', error);
    return { total: 0, categories: 0, avgRating: '0', freeTools: 0 };
  }
}

export default async function AIToolsPage() {
  const tools = await getAllAITools();
  const stats = await getAIToolsStats();

  // إنشاء Schema markup للصفحة
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "أدوات الذكاء الاصطناعي",
    "description": "مجموعة شاملة من أفضل أدوات الذكاء الاصطناعي مع مراجعات ومقارنات تفصيلية",
    "url": "https://tflash.site/ai-tools",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": tools.length,
      "itemListElement": tools.slice(0, 10).map((tool, index) => ({
        "@type": "SoftwareApplication",
        "position": index + 1,
        "name": tool.name,
        "description": tool.description,
        "url": `https://tflash.site/ai-tools/${tool.slug}`,
        "applicationCategory": "AI Tool",
        "operatingSystem": "Web"
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "الرئيسية",
          "item": "https://tflash.site"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "أدوات الذكاء الاصطناعي",
          "item": "https://tflash.site/ai-tools"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      {/* Schema Markup */}
      <JsonLd data={websiteJsonLd} />

      {/* إعلان أعلى الصفحة */}
      <AdBanner placement="ai_tools_top" className="mb-8" />

      <div className="max-w-7xl mx-auto">
        {/* رأس الصفحة */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-primary text-sm font-medium">🤖 دليل شامل</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            أدوات الذكاء الاصطناعي
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto leading-relaxed">
            اكتشف مجموعة شاملة من أفضل أدوات الذكاء الاصطناعي مع مراجعات متخصصة ومقارنات تفصيلية
            لمساعدتك في اختيار الأداة المناسبة لاحتياجاتك التقنية والإبداعية
          </p>

          {/* أزرار التنقل السريع */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/ai-tools/categories"
              className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
            >
              <span className="ml-2">📂</span>
              تصفح حسب الفئات
            </Link>
            <Link
              href="/ai-tools/compare"
              className="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
            >
              <span className="ml-2">⚖️</span>
              مقارنة الأدوات
            </Link>
          </div>
        </div>

        {/* المحتوى التفاعلي */}
        <AIToolsClient initialTools={tools} stats={stats} />

        {/* إعلان وسط المحتوى */}
        <AdBanner placement="ai_tools_middle" className="mb-12" />


        {/* معلومات إضافية */}
        <div className="mt-16 bg-dark-card rounded-xl p-8 border border-gray-800">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            لماذا تختار أدوات الذكاء الاصطناعي من TechnoFlash؟
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl">🔍</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">مراجعات شاملة</h4>
              <p className="text-dark-text-secondary text-sm">
                نقدم مراجعات مفصلة وتقييمات موضوعية لكل أداة
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-400 text-2xl">⚡</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">تحديث مستمر</h4>
              <p className="text-dark-text-secondary text-sm">
                نحدث قائمة الأدوات باستمرار لنضمن لك أحدث التقنيات
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-400 text-2xl">🎯</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">اختيار مدروس</h4>
              <p className="text-dark-text-secondary text-sm">
                نختار الأدوات بعناية لضمان الجودة والفائدة العملية
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* إعلان أسفل الصفحة */}
      <AdBanner placement="ai_tools_bottom" className="mt-8" />
    </div>
  );
}
