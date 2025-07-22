// صفحة جميع أدوات الذكاء الاصطناعي
import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { supabase, fixObjectEncoding } from "@/lib/supabase";
import { getAllAIToolsForSSG, getCategoriesForSSG } from "@/lib/ssg";
import { AIToolCard } from "@/components/AIToolCard";
import { AITool } from "@/types";

import JsonLd from '@/components/JsonLd';
import { AIToolsClient } from '@/components/AIToolsClient';
import LazyAIToolsGrid from '@/components/ai-tools/LazyAIToolsGrid';
import AIToolsSearch from '@/components/ai-tools/AIToolsSearch';

// Optimized ISR settings for faster updates
export const revalidate = 300; // 5 minutes for AI tools listing
export const dynamic = 'force-static';

// تحميل عدد محدود من الأدوات للصفحة الأولى للـ SSG
async function getInitialAITools(limit = 12) {
  try {
    console.log('🔄 Fetching initial AI tools...');

    // محاولة استخدام SSG function أولاً
    try {
      const allTools = await getAllAIToolsForSSG();

      if (allTools && allTools.length > 0) {
        console.log(`✅ Found ${allTools.length} AI tools from SSG`);
        const limitedTools = allTools.slice(0, limit);
        return limitedTools.map(tool => fixObjectEncoding(tool)) as AITool[];
      } else {
        console.log('⚠️ No AI tools found from SSG, trying runtime fetch...');
      }
    } catch (ssgError) {
      console.error('❌ SSG fetch failed, falling back to runtime:', ssgError);
    }

    // fallback للـ runtime إذا فشل SSG
    console.log('🔄 Using runtime fetch...');
    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .in('status', ['published', 'active'])
      .order('rating', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Error fetching AI tools from runtime:', error);
      return [];
    }

    console.log(`✅ Runtime AI Tools fetched: ${data?.length || 0}`);

    // إصلاح encoding النص العربي
    const fixedData = data?.map(tool => fixObjectEncoding(tool)) || [];
    return fixedData as AITool[];
  } catch (error) {
    console.error('💥 Exception in getInitialAITools:', error);
    return [];
  }
}

// الحصول على الفئات المتاحة
async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('category')
      .in('status', ['published', 'active']);

    if (error) {
      console.error('❌ Error fetching categories:', error);
      return [];
    }

    // استخراج الفئات الفريدة
    const uniqueCategories = Array.from(new Set(data?.map(tool => tool.category).filter(Boolean)));
    return uniqueCategories;
  } catch (error) {
    console.error('❌ Exception in getCategories:', error);
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
  const initialTools = await getInitialAITools(12);
  const categories = await getCategories();
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
      "numberOfItems": stats.total,
      "itemListElement": initialTools.slice(0, 10).map((tool, index) => ({
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



      <div className="max-w-7xl mx-auto">
        {/* رأس الصفحة */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-primary text-sm font-medium">🤖 دليل شامل</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            أدوات الذكاء الاصطناعي
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            اكتشف مجموعة شاملة من أفضل أدوات الذكاء الاصطناعي مع مراجعات متخصصة ومقارنات تفصيلية
            لمساعدتك في اختيار الأداة المناسبة لاحتياجاتك التقنية والإبداعية
          </p>


        </div>

        {/* إعلان وسط الصفحة - معطل */}
        {/* <InContentAd className="my-12" /> */}

        {/* المحتوى التفاعلي مع البحث والفلترة */}
        <div className="mb-12">
          <AIToolsSearch
            initialTools={initialTools}
            categories={categories}
          />
        </div>

        {/* إعلان وسط المحتوى - معطل */}
        {/* <AdBanner placement="ai_tools_middle" className="mb-12" /> */}


        {/* معلومات إضافية */}
        <div className="mt-16 bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            لماذا تختار أدوات الذكاء الاصطناعي من TechnoFlash؟
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">🔍</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">مراجعات شاملة</h4>
              <p className="text-gray-600 text-sm">
                نقدم مراجعات مفصلة وتقييمات موضوعية لكل أداة
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">⚡</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">تحديث مستمر</h4>
              <p className="text-gray-600 text-sm">
                نحدث قائمة الأدوات باستمرار لنضمن لك أحدث التقنيات
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl">🎯</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">اختيار مدروس</h4>
              <p className="text-gray-600 text-sm">
                نختار الأدوات بعناية لضمان الجودة والفائدة العملية
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
