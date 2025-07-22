import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react'; // 👈 **مهم:** استيراد cache لمنع جلب البيانات المزدوج
import SVGIcon from '@/components/SVGIcon';
import Link from 'next/link';
import Image from 'next/image';
import { supabase, fixObjectEncoding } from '@/lib/supabase';
import { getAllAIToolsForSSG } from '@/lib/ssg';
import { AITool } from '@/types';
import { Breadcrumbs, createBreadcrumbJsonLd } from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';


import { AIToolPageClient } from '@/components/AIToolPageClient';
import { AIToolLink } from '@/components/AIToolLink';
import { generateAIToolSocialMeta } from '@/lib/social-meta';
import { generateUniqueMetaDescription, generateUniquePageTitle } from '@/lib/unique-meta-generator';
import { generatePageCanonicalUrl, generateSingleCanonicalMeta } from '@/lib/canonical-url-manager';

// Import critical CSS for faster LCP
import "@/styles/critical-ai-tool.css";
import { AIToolComparisonContainer } from '@/components/AIToolComparisonContainer';

// Optimized ISR settings for faster updates and better performance
export const revalidate = 600; // 10 minutes for individual AI tools
export const dynamic = 'force-static';
export const dynamicParams = true;

type Props = {
  params: Promise<{ slug: string }>;
};

// توليد المعاملات الثابتة للـ SSG (هذا الجزء صحيح)
export async function generateStaticParams() {
  try {
    const aiTools = await getAllAIToolsForSSG();
    return aiTools.map((tool) => ({
      slug: tool.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for AI tools:', error);
    return [];
  }
}

// **مهم:** تم تغليف دالة جلب البيانات بـ `cache`
// هذا يضمن أن الدالة ستعمل مرة واحدة فقط لكل طلب، حتى لو تم استدعاؤها من generateMetadata والصفحة
const getAITool = cache(async (slug: string): Promise<AITool | null> => {
  try {
    const decodedSlug = decodeURIComponent(slug);

    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .eq('slug', decodedSlug)
      .in('status', ['published', 'active']) // السماح بعرض الأدوات النشطة أيضاً
      .single();

    if (error || !data) {
      console.error('Supabase error or no data for slug:', decodedSlug, error);
      return null;
    }

    // **مهم:** تم حذف منطق تحديث عداد النقرات من هنا.
    // يجب أن يتم تحديث العداد عبر تفاعل من المستخدم (مثل الضغط على زر "زيارة الموقع")
    // وليس أثناء عرض الصفحة من الخادم.

    return fixObjectEncoding(data) as AITool;
  } catch (error) {
    console.error('Exception in getAITool:', error);
    return null;
  }
});

// جلب الأدوات ذات الصلة
async function getRelatedAITools(currentSlug: string, category: string, limit: number = 3): Promise<AITool[]> {
  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('id, name, slug, description, logo_url, rating, category, website_url, pricing, features, status, created_at, updated_at') // جميع الحقول المطلوبة
      .eq('status', 'published')
      .eq('category', category)
      .neq('slug', currentSlug)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching related AI tools:', error);
      return [];
    }
    return data?.map(tool => ({
      ...fixObjectEncoding(tool),
      features: tool.features || [],
      status: (tool.status || 'published') as 'draft' | 'published'
    })) || [];
  } catch (error) {
    console.error('Exception in getRelatedAITools:', error);
    return [];
  }
}

// جلب جميع الأدوات المتاحة للمقارنة
async function getAllAvailableTools(currentSlug: string): Promise<AITool[]> {
  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('id, name, slug, description, category, pricing, rating, features, pros, cons') // تحديد الأعمدة لتحسين الأداء
      .neq('slug', currentSlug)
      .in('status', ['published', 'active'])
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error fetching available AI tools:', error);
      return [];
    }
    return (data?.map(tool => fixObjectEncoding(tool)) as AITool[]) || [];
  } catch (error) {
    console.error('Exception in getAllAvailableTools:', error);
    return [];
  }
}

// إنشاء metadata ديناميكي - محسن لإزالة المحتوى المكرر
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getAITool(slug);

  if (!tool) {
    return {
      title: 'أداة غير موجودة - TechnoFlash',
      description: 'الأداة المطلوبة غير موجودة أو تم حذفها'
    };
  }

  // Generate unique meta data to fix duplicate content issue (33% → <10%)
  const uniqueMetaData = {
    title: tool.name,
    description: tool.description,
    category: tool.category,
    tags: tool.features || [],
    type: 'ai-tool' as const,
    slug: tool.slug
  };

  const uniqueTitle = generateUniquePageTitle(uniqueMetaData);
  const uniqueDescription = generateUniqueMetaDescription(uniqueMetaData);
  const canonicalUrl = generatePageCanonicalUrl('ai-tool', tool.slug);
  const canonicalMeta = generateSingleCanonicalMeta(canonicalUrl);

  // إنشاء الـ metadata المحسن للـ SEO مع محتوى فريد
  const socialMeta = generateAIToolSocialMeta({
    ...tool,
    name: uniqueTitle,
    description: uniqueDescription
  });

  // SINGLE canonical URL implementation - fixes multiple canonicals issue
  return {
    ...socialMeta,
    ...canonicalMeta,
    title: uniqueTitle,
    description: uniqueDescription
  };
}

export default async function AIToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = await getAITool(slug);

  if (!tool) {
    notFound();
  }

  const relatedTools = await getRelatedAITools(slug, tool.category);
  const availableTools = await getAllAvailableTools(slug);

  const breadcrumbItems = [
    { label: 'أدوات الذكاء الاصطناعي', href: '/ai-tools' },
    { label: tool.name }
  ];
  const breadcrumbJsonLd = createBreadcrumbJsonLd(breadcrumbItems);

  const softwareApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.description,
    "url": `https://tflash.site/ai-tools/${tool.slug}`,
    "applicationCategory": "AI Tool",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": tool.pricing === 'free' ? "0" : "varies",
      "priceCurrency": "USD",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": tool.rating,
      "ratingCount": tool.click_count || 1,
    },
    "author": { "@type": "Organization", "name": "TechnoFlash" },
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'bg-green-100 text-green-700 border-green-300';
      case 'freemium': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'paid': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPricingText = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'مجاني';
      case 'freemium': return 'مجاني جزئياً';
      case 'paid': return 'مدفوع';
      default: return 'غير محدد';
    }
  };

  return (
    <AIToolPageClient tool={tool}>
      <div className="min-h-screen px-4">
        <JsonLd data={softwareApplicationJsonLd} />
        <JsonLd data={breadcrumbJsonLd} />


        <div className="max-w-7xl mx-auto pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <article className="lg:col-span-3">
              <Breadcrumbs items={breadcrumbItems} />




              
              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="relative w-24 h-24 min-h-[96px] flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center">
                    <SVGIcon
                      src={tool.logo_url || "https://placehold.co/200x200/38BDF8/FFFFFF?text=AI"}
                      alt={tool.name}
                      className="w-24 h-24 rounded-lg object-contain"
                      fallbackIcon="🤖"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{tool.name}</h1>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPricingColor(tool.pricing)}`}>
                        {getPricingText(tool.pricing)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-lg mb-4 leading-relaxed">{tool.description}</p>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center">
                        <span className="text-yellow-500 text-lg">⭐</span>
                        <span className="text-gray-900 font-medium mr-2">{tool.rating}</span>
                        <span className="text-gray-600 text-sm">({tool.click_count || 0} مراجعة)</span>
                      </div>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{tool.category}</span>
                      <span className="text-gray-600 text-sm">
                        أُضيفت في: {new Date(tool.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {tool.detailed_description && (
                <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">نظرة عامة شاملة</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{tool.detailed_description}</p>
                  </div>
                </div>
              )}

              {Array.isArray(tool.features) && tool.features.length > 0 && (
                <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">المميزات الرئيسية</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-green-600 text-lg ml-3 mt-1">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}





              {((Array.isArray(tool.pros) && tool.pros.length > 0) || (Array.isArray(tool.cons) && tool.cons.length > 0)) && (
                <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">تقييم شامل</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {Array.isArray(tool.pros) && tool.pros.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center"><span className="ml-2">👍</span>المزايا</h3>
                        <div className="space-y-3">
                          {tool.pros.map((pro, index) => (
                            <div key={index} className="flex items-start">
                              <span className="text-green-600 text-lg ml-3 mt-1">+</span>
                              <span className="text-gray-700">{pro}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {Array.isArray(tool.cons) && tool.cons.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center"><span className="ml-2">👎</span>العيوب</h3>
                        <div className="space-y-3">
                          {tool.cons.map((con, index) => (
                            <div key={index} className="flex items-start">
                              <span className="text-orange-600 text-lg ml-3 mt-1">-</span>
                              <span className="text-gray-700">{con}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {relatedTools.length > 0 && (
                <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">أدوات مشابهة</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedTools.map((relatedTool) => (
                      <AIToolLink key={relatedTool.id} href={`/ai-tools/${relatedTool.slug}`} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all duration-300 group min-h-[120px]">
                        <div className="flex items-center mb-3">
                          <div className="relative w-12 h-12 min-h-[48px] ml-3 bg-white rounded flex items-center justify-center">
                            <SVGIcon src={relatedTool.logo_url || "https://placehold.co/100x100/38BDF8/FFFFFF?text=AI"} alt={relatedTool.name} className="w-12 h-12 rounded object-contain" fallbackIcon="🤖" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{relatedTool.name}</h3>
                            <div className="flex items-center">
                              <span className="text-yellow-500 text-sm">⭐</span>
                              <span className="text-gray-600 text-sm mr-1">{relatedTool.rating}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{relatedTool.description}</p>
                      </AIToolLink>
                    ))}
                  </div>
                </div>
              )}

              <AIToolComparisonContainer currentTool={tool} availableTools={availableTools} className="mb-8" />

            </article>

            <aside className="lg:col-span-1">


              <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6 sticky top-24 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">معلومات سريعة</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-600 text-sm">الفئة:</span>
                    <span className="text-gray-900 font-medium block">{tool.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">نوع التسعير:</span>
                    <span className="text-gray-900 font-medium block">{getPricingText(tool.pricing)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">التقييم:</span>
                    <div className="flex items-center">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-gray-900 font-medium mr-2">{tool.rating}</span>
                    </div>
                  </div>
                   <div>
                    <span className="text-gray-600 text-sm">عدد المراجعات:</span>
                    <span className="text-gray-900 font-medium block">{tool.click_count || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">تاريخ الإضافة:</span>
                    <span className="text-gray-900 font-medium block">
                      {new Date(tool.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <AIToolLink href={tool.website_url || '#'} className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors">
                    زيارة الموقع الرسمي
                  </AIToolLink>
                  <AIToolLink href={`/ai-tools/${tool.slug}`} className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-center py-3 px-4 rounded-lg font-medium transition-colors">
                    عرض التفاصيل الكاملة
                  </AIToolLink>
                </div>
              </div>
            </aside>
          </div>
        </div>


      </div>
    </AIToolPageClient>
  );
}