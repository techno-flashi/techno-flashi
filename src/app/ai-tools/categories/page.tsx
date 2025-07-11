import { Metadata } from 'next';
import Link from 'next/link';
import { supabase, fixObjectEncoding } from '@/lib/supabase';
import { AITool } from '@/types';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import AdBanner from '@/components/ads/AdBanner';
import JsonLd from '@/components/JsonLd';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'فئات أدوات الذكاء الاصطناعي - تصفح حسب التخصص | TechnoFlash',
  description: 'استكشف أدوات الذكاء الاصطناعي مصنفة حسب التخصص: محادثة، إنشاء صور، كتابة، برمجة، تحليل بيانات وأكثر.',
  keywords: 'فئات أدوات ذكاء اصطناعي, AI tools categories, أدوات محادثة, أدوات إنشاء صور, أدوات كتابة, أدوات برمجة',
  openGraph: {
    title: 'فئات أدوات الذكاء الاصطناعي - تصفح حسب التخصص',
    description: 'استكشف أدوات الذكاء الاصطناعي مصنفة حسب التخصص والاستخدام',
    type: 'website',
    locale: 'ar_SA',
    url: 'https://tflash.site/ai-tools/categories',
    siteName: 'TechnoFlash',
  },
  alternates: {
    canonical: 'https://tflash.site/ai-tools/categories',
  },
};

async function getAIToolsCategories() {
  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('category')
      .in('status', ['published', 'active']);

    if (error) {
      console.error('Error fetching AI tools categories:', error);
      return [];
    }

    // حساب عدد الأدوات في كل فئة
    const categoryCounts = data?.reduce((acc, tool) => {
      const category = tool.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return Object.entries(categoryCounts).map(([category, count]) => ({
      name: category,
      count,
      slug: category.toLowerCase().replace(/\s+/g, '-')
    }));
  } catch (error) {
    console.error('Exception in getAIToolsCategories:', error);
    return [];
  }
}

// أيقونات الفئات
const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    'محادثة وكتابة': '💬',
    'إنشاء الصور': '🎨',
    'البرمجة': '💻',
    'تحليل البيانات': '📊',
    'الصوت والموسيقى': '🎵',
    'الفيديو': '🎬',
    'التسويق': '📈',
    'التعليم': '📚',
    'الأعمال': '💼',
    'التصميم': '🎨',
    'الترجمة': '🌐',
    'البحث': '🔍'
  };
  return icons[category] || '🤖';
};

// وصف الفئات
const getCategoryDescription = (category: string) => {
  const descriptions: Record<string, string> = {
    'محادثة وكتابة': 'أدوات للمحادثة الذكية وكتابة المحتوى والمقالات',
    'إنشاء الصور': 'أدوات لإنشاء وتعديل الصور باستخدام الذكاء الاصطناعي',
    'البرمجة': 'أدوات مساعدة في كتابة وتطوير البرمجيات',
    'تحليل البيانات': 'أدوات لتحليل البيانات واستخراج الرؤى',
    'الصوت والموسيقى': 'أدوات لإنشاء وتحرير الصوت والموسيقى',
    'الفيديو': 'أدوات لإنشاء وتحرير مقاطع الفيديو',
    'التسويق': 'أدوات للتسويق الرقمي وإدارة الحملات',
    'التعليم': 'أدوات تعليمية ومساعدة في التعلم',
    'الأعمال': 'أدوات لإدارة الأعمال والإنتاجية',
    'التصميم': 'أدوات للتصميم الجرافيكي وتجربة المستخدم',
    'الترجمة': 'أدوات للترجمة بين اللغات المختلفة',
    'البحث': 'أدوات للبحث والاستكشاف الذكي'
  };
  return descriptions[category] || 'أدوات ذكاء اصطناعي متخصصة';
};

export default async function AIToolsCategoriesPage() {
  const categories = await getAIToolsCategories();

  const breadcrumbItems = [
    { name: 'أدوات الذكاء الاصطناعي', href: '/ai-tools' },
    { name: 'الفئات' }
  ];

  const categoriesJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "فئات أدوات الذكاء الاصطناعي",
    "description": "تصفح أدوات الذكاء الاصطناعي مصنفة حسب التخصص والاستخدام",
    "url": "https://tflash.site/ai-tools/categories",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": categories.length,
      "itemListElement": categories.map((category, index) => ({
        "@type": "Thing",
        "position": index + 1,
        "name": category.name,
        "description": getCategoryDescription(category.name),
        "url": `https://tflash.site/ai-tools?category=${encodeURIComponent(category.name)}`
      }))
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      {/* Schema Markup */}
      <JsonLd data={categoriesJsonLd} />

      {/* إعلان أعلى الصفحة */}
      <AdBanner placement="ai_tools_categories_top" className="mb-8" />

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />

        {/* رأس الصفحة */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-primary text-sm font-medium">📂 تصنيف شامل</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            فئات أدوات الذكاء الاصطناعي
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto leading-relaxed">
            استكشف أدوات الذكاء الاصطناعي مصنفة حسب التخصص والاستخدام. 
            اعثر على الأداة المناسبة لمجال عملك أو اهتمامك بسهولة.
          </p>
        </div>

        {/* عرض الفئات */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/ai-tools?category=${encodeURIComponent(category.name)}`}
                className="bg-dark-card rounded-xl p-8 border border-gray-800 hover:border-primary transition-all duration-300 group"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {getCategoryIcon(category.name)}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-dark-text-secondary text-sm mb-4 leading-relaxed">
                    {getCategoryDescription(category.name)}
                  </p>
                  <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium inline-block">
                    {category.count} أداة
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-dark-card rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-6xl">📂</span>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">لا توجد فئات متاحة</h3>
            <p className="text-dark-text-secondary text-lg mb-8">
              سنقوم بإضافة فئات الأدوات قريباً!
            </p>
          </div>
        )}

        {/* إعلان وسط المحتوى */}
        <AdBanner placement="ai_tools_categories_middle" className="mb-12" />

        {/* معلومات إضافية */}
        <div className="bg-dark-card rounded-xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            كيفية اختيار الفئة المناسبة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">حدد هدفك</h3>
              <p className="text-dark-text-secondary text-sm">
                فكر في نوع المهمة التي تريد إنجازها
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-400 text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">استكشف الفئة</h3>
              <p className="text-dark-text-secondary text-sm">
                تصفح الأدوات المتاحة في الفئة المناسبة
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-yellow-400 text-2xl">⚖️</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">قارن الأدوات</h3>
              <p className="text-dark-text-secondary text-sm">
                قارن بين الأدوات المختلفة في نفس الفئة
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-400 text-2xl">✨</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">جرب الأداة</h3>
              <p className="text-dark-text-secondary text-sm">
                ابدأ باستخدام الأداة التي تناسب احتياجاتك
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* إعلان أسفل الصفحة */}
      <AdBanner placement="ai_tools_categories_bottom" className="mt-8" />
    </div>
  );
}
