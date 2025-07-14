import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SVGIcon from '@/components/SVGIcon';
import Link from 'next/link';
import { supabase, fixObjectEncoding } from '@/lib/supabase';
import { getAllAIToolsForSSG } from '@/lib/ssg';
import { AITool } from '@/types';
import { Breadcrumbs, createBreadcrumbJsonLd } from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import AdBanner from '@/components/ads/AdBanner';
import { HeaderAd, FooterAd, InContentAd, SidebarAdManager } from '@/components/ads/AdManager';
import { SmartAIToolAd, SmartContentAd, SmartSharedAd } from '@/components/ads/SmartAdManager';
import { TechnoFlashContentBanner } from '@/components/ads/TechnoFlashBanner';
import { AutoAIToolStartAd, AutoAIToolMidAd, AutoAIToolEndAd } from '@/components/ads/AutoAIToolAds';
import { AIToolCanonicalUrl } from '@/components/seo/CanonicalUrl';
import { AIToolPageClient } from '@/components/AIToolPageClient';
import { AIToolLink } from '@/components/AIToolLink';
import { generateAIToolSocialMeta, getSharingUrl, getSharingHashtags } from '@/lib/social-meta';
import SocialShare from '@/components/SocialShare';
import SocialShareCompact from '@/components/SocialShareCompact';
import { AIToolComparisonContainer } from '@/components/AIToolComparisonContainer';

// إعدادات ISR - إعادة بناء الصفحة كل 24 ساعة
export const revalidate = 86400; // 24 ساعة
export const dynamic = 'force-static';
export const dynamicParams = true;

type Props = {
  params: Promise<{ slug: string }>;
};

// توليد المعاملات الثابتة للـ SSG
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

// جلب بيانات الأداة بناءً على الـ slug للـ SSG
async function getAITool(slug: string): Promise<AITool | null> {
  try {
    // فك تشفير الـ slug للتعامل مع الأحرف العربية
    const decodedSlug = decodeURIComponent(slug);

    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .eq('slug', decodedSlug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return null;
    }

    if (!data) {
      console.error('No data returned for slug:', decodedSlug);
      return null;
    }

    // تحديث عداد النقرات
    try {
      await supabase
        .from('ai_tools')
        .update({ click_count: (data.click_count || 0) + 1 })
        .eq('id', data.id);
    } catch (updateError) {
      console.error('Error updating click count:', updateError);
    }

    return fixObjectEncoding(data) as AITool;
  } catch (error) {
    console.error('Exception in getAITool:', error);
    return null;
  }
}

// جلب الأدوات ذات الصلة
async function getRelatedAITools(currentSlug: string, category: string, limit: number = 3): Promise<AITool[]> {
  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .eq('status', 'published')
      .eq('category', category)
      .neq('slug', currentSlug)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching related AI tools:', error);
      return [];
    }

    return data?.map(tool => fixObjectEncoding(tool)) || [];
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
      .select('*')
      .neq('slug', currentSlug)
      .in('status', ['published', 'active'])
      .order('rating', { ascending: false })
      .order('click_count', { ascending: false });

    if (error) {
      console.error('Error fetching available AI tools:', error);
      return [];
    }

    const fixedData = data?.map(tool => fixObjectEncoding(tool)) || [];
    return fixedData as AITool[];
  } catch (error) {
    console.error('Exception in getAllAvailableTools:', error);
    return [];
  }
}

// إنشاء metadata ديناميكي
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getAITool(slug);

  if (!tool) {
    return {
      title: 'أداة غير موجودة - TechnoFlash',
      description: 'الأداة المطلوبة غير موجودة أو تم حذفها'
    };
  }

  return generateAIToolSocialMeta(tool);
}

// تم حذف الدالة المكررة

export default async function AIToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = await getAITool(slug);

  if (!tool) {
    notFound();
  }

  const relatedTools = await getRelatedAITools(slug, tool.category);
  const availableTools = await getAllAvailableTools(slug);

  // إنشاء breadcrumbs
  const breadcrumbItems = [
    { label: 'أدوات الذكاء الاصطناعي', href: '/ai-tools' },
    { label: tool.name }
  ];
  const breadcrumbJsonLd = createBreadcrumbJsonLd(breadcrumbItems);

  // إنشاء Schema markup للأداة
  const softwareApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.description,
    "url": tool.website_url,
    "applicationCategory": "AI Tool",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": tool.pricing === 'free' ? "0" : "varies",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": tool.rating,
      "ratingCount": tool.click_count || 1,
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "TechnoFlash"
    },
    "datePublished": tool.created_at,
    "dateModified": tool.updated_at,
    "inLanguage": "ar"
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'freemium': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'paid': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
        {/* Schema Markup */}
        <JsonLd data={softwareApplicationJsonLd} />
        <JsonLd data={breadcrumbJsonLd} />

        {/* Canonical URL لحل مشكلة النسخ المكررة */}
        <AIToolCanonicalUrl slug={tool.slug} />

      <div className="max-w-7xl mx-auto pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* المحتوى الرئيسي */}
          <article className="lg:col-span-3">
            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} />

            {/* إعلان تلقائي بداية الصفحة */}
            <AutoAIToolStartAd
              toolName={tool.name}
              toolSlug={tool.slug}
              toolCategory={tool.category}
              className="mb-6"
            />

            {/* رأس الأداة */}
            <div className="bg-dark-card rounded-xl p-8 border border-gray-800 mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* الشعار */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <SVGIcon
                    src={tool.logo_url || "https://placehold.co/200x200/38BDF8/FFFFFF?text=AI"}
                    alt={tool.name}
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded-lg"
                    fallbackIcon="🤖"
                  />
                </div>

                {/* معلومات الأداة */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                      {tool.name}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPricingColor(tool.pricing)}`}>
                      {getPricingText(tool.pricing)}
                    </span>
                  </div>

                  <p className="text-dark-text-secondary text-lg mb-4 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    {/* التقييم */}
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-lg">⭐</span>
                      <span className="text-white font-medium mr-2">{tool.rating}</span>
                      <span className="text-dark-text-secondary text-sm">
                        ({tool.click_count || 0} مراجعة)
                      </span>
                    </div>

                    {/* الفئة */}
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {tool.category}
                    </span>

                    {/* تاريخ الإضافة */}
                    <span className="text-dark-text-secondary text-sm">
                      أُضيفت في: {new Date(tool.created_at).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* أزرار العمل */}
                <div className="flex flex-col gap-3">
                  <Link
                    href={tool.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-center"
                  >
                    زيارة الأداة
                  </Link>

                  {/* مشاركة على وسائل التواصل */}
                  <div className="border border-gray-600 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3 text-center">مشاركة الأداة</h4>
                    <SocialShare
                      url={getSharingUrl(`/ai-tools/${tool.slug}`)}
                      title={`${tool.name} - أداة ذكاء اصطناعي`}
                      description={tool.description}
                      hashtags={getSharingHashtags([tool.category, tool.pricing])}
                      size="sm"
                      className="justify-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* إعلان ذكي بعد معلومات الأداة - معطل */}
            {/* <SmartAIToolAd
              position="in-content"
              className="my-8"
              keywords={[tool.name, tool.category, 'أداة', 'AI']}
            /> */}

            {/* الوصف التفصيلي */}
            {tool.detailed_description && (
              <div className="bg-dark-card rounded-xl p-8 border border-gray-800 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">نظرة عامة شاملة</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-dark-text-secondary leading-relaxed whitespace-pre-line">
                    {tool.detailed_description}
                  </p>
                </div>
              </div>
            )}

            {/* المميزات الرئيسية */}
            {tool.features && tool.features.length > 0 && (
              <div className="bg-dark-card rounded-xl p-8 border border-gray-800 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">المميزات الرئيسية</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tool.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-primary text-lg ml-3 mt-1">✓</span>
                      <span className="text-dark-text-secondary">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* حالات الاستخدام */}
            {tool.use_cases && tool.use_cases.length > 0 && (
              <div className="bg-dark-card rounded-xl p-8 border border-gray-800 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">حالات الاستخدام العملية</h2>
                <div className="space-y-4">
                  {tool.use_cases.map((useCase, index) => (
                    <div key={index} className="bg-dark-bg/50 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-start">
                        <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm font-medium ml-3 mt-1">
                          {index + 1}
                        </span>
                        <p className="text-dark-text-secondary leading-relaxed">{useCase}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* إعلان ذكي وسط المحتوى - معطل */}
            {/* <SmartContentAd
              contentType="ai-tool"
              className=""
              keywords={[tool.name, tool.category, 'premium', 'متقدم']}
            /> */}

            {/* إعلان تكنوفلاش المتحرك - معطل */}
            {/* <TechnoFlashContentBanner className="my-6" /> */}

            {/* إعلان تلقائي وسط الصفحة */}
            <AutoAIToolMidAd
              toolName={tool.name}
              toolSlug={tool.slug}
              toolCategory={tool.category}
              className="my-8"
            />

            {/* دليل الاستخدام */}
            {tool.tutorial_steps && tool.tutorial_steps.length > 0 && (
              <div className="bg-dark-card rounded-xl p-8 border border-gray-800 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">دليل الاستخدام خطوة بخطوة</h2>
                <div className="space-y-6">
                  {tool.tutorial_steps.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm ml-4 mt-1 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-dark-text-secondary leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* المزايا والعيوب */}
            {((tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0)) && (
              <div className="bg-dark-card rounded-xl p-8 border border-gray-800 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">تقييم شامل</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* المزايا */}
                  {tool.pros && tool.pros.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center">
                        <span className="ml-2">👍</span>
                        المزايا
                      </h3>
                      <div className="space-y-3">
                        {tool.pros.map((pro, index) => (
                          <div key={index} className="flex items-start">
                            <span className="text-green-400 text-lg ml-3 mt-1">+</span>
                            <span className="text-dark-text-secondary">{pro}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* العيوب */}
                  {tool.cons && tool.cons.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center">
                        <span className="ml-2">👎</span>
                        العيوب
                      </h3>
                      <div className="space-y-3">
                        {tool.cons.map((con, index) => (
                          <div key={index} className="flex items-start">
                            <span className="text-red-400 text-lg ml-3 mt-1">-</span>
                            <span className="text-dark-text-secondary">{con}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* معلومات الأسعار */}
            {tool.pricing_details && (
              <div className="bg-dark-card rounded-xl p-8 border border-gray-800 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">خطط الأسعار</h2>

                {/* الخطة المجانية */}
                {tool.pricing_details.free_plan && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold text-green-400 mb-3">الخطة المجانية</h3>
                    <p className="text-dark-text-secondary">{tool.pricing_details.free_plan}</p>
                  </div>
                )}

                {/* الخطط المدفوعة */}
                {tool.pricing_details.paid_plans && tool.pricing_details.paid_plans.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tool.pricing_details.paid_plans.map((plan, index) => (
                      <div key={index} className="bg-dark-bg/50 border border-gray-700 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                        <div className="text-2xl font-bold text-primary mb-4">{plan.price}</div>
                        <ul className="space-y-2">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <span className="text-primary text-sm ml-2 mt-1">✓</span>
                              <span className="text-dark-text-secondary text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* الأسئلة الشائعة */}
            {tool.faq && tool.faq.length > 0 && (
              <div className="bg-dark-card rounded-xl p-8 border border-gray-800 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">الأسئلة الشائعة</h2>
                <div className="space-y-6">
                  {tool.faq.map((item, index) => (
                    <div key={index} className="border-b border-gray-700 pb-6 last:border-b-0 last:pb-0">
                      <h3 className="text-lg font-semibold text-white mb-3">{item.question}</h3>
                      <p className="text-dark-text-secondary leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* الكلمات المفتاحية */}
            {tool.tags && tool.tags.length > 0 && (
              <div className="bg-dark-card rounded-xl p-8 border border-gray-800 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">الكلمات المفتاحية</h2>
                <div className="flex flex-wrap gap-3">
                  {tool.tags.map((tag, index) => (
                    <span key={index} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* إعلان وسط المحتوى */}
            <AdBanner placement="ai_tool_middle" className="mb-8" />

            {/* الأدوات ذات الصلة */}
            {relatedTools.length > 0 && (
              <div className="bg-dark-card rounded-xl p-8 border border-gray-800 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">أدوات مشابهة</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedTools.map((relatedTool) => (
                    <AIToolLink
                      key={relatedTool.id}
                      href={`/ai-tools/${relatedTool.slug}`}
                      className="bg-dark-bg/50 border border-gray-700 rounded-lg p-4 hover:border-primary transition-all duration-300 group"
                    >
                      <div className="flex items-center mb-3">
                        <div className="relative w-12 h-12 ml-3">
                          <SVGIcon
                            src={relatedTool.logo_url || "https://placehold.co/100x100/38BDF8/FFFFFF?text=AI"}
                            alt={relatedTool.name}
                            fill
                            style={{ objectFit: "contain" }}
                            className="rounded"
                            fallbackIcon="🤖"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                            {relatedTool.name}
                          </h3>
                          <div className="flex items-center">
                            <span className="text-yellow-400 text-sm">⭐</span>
                            <span className="text-dark-text-secondary text-sm mr-1">{relatedTool.rating}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-dark-text-secondary text-sm line-clamp-2">
                        {relatedTool.description}
                      </p>
                    </AIToolLink>
                  ))}
                </div>
              </div>
            )}

            {/* قسم المقارنة */}
            <AIToolComparisonContainer
              currentTool={tool}
              availableTools={availableTools}
              className="mb-8"
            />

            {/* إعلان تلقائي نهاية الصفحة */}
            <AutoAIToolEndAd
              toolName={tool.name}
              toolSlug={tool.slug}
              toolCategory={tool.category}
              className="mb-8"
            />
          </article>

          {/* الشريط الجانبي */}
          <aside className="lg:col-span-1">
            {/* معلومات سريعة */}
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-4">معلومات سريعة</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-dark-text-secondary text-sm">الفئة:</span>
                  <span className="text-white font-medium block">{tool.category}</span>
                </div>
                <div>
                  <span className="text-dark-text-secondary text-sm">نوع التسعير:</span>
                  <span className="text-white font-medium block">{getPricingText(tool.pricing)}</span>
                </div>
                <div>
                  <span className="text-dark-text-secondary text-sm">التقييم:</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-white font-medium mr-2">{tool.rating}</span>
                  </div>
                </div>
                <div>
                  <span className="text-dark-text-secondary text-sm">عدد المراجعات:</span>
                  <span className="text-white font-medium block">{tool.click_count || 0}</span>
                </div>
                <div>
                  <span className="text-dark-text-secondary text-sm">تاريخ الإضافة:</span>
                  <span className="text-white font-medium block">
                    {new Date(tool.created_at).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
                <Link
                  href={tool.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 text-center block"
                >
                  زيارة الأداة
                </Link>

                {/* مشاركة مدمجة */}
                <SocialShareCompact
                  url={getSharingUrl(`/ai-tools/${tool.slug}`)}
                  title={`${tool.name} - أداة ذكاء اصطناعي`}
                  description={tool.description}
                  className="w-full"
                />
              </div>
            </div>

            {/* إعلانات الشريط الجانبي - معطل */}
            {/* <SidebarAdManager /> */}
          </aside>
        </div>
      </div>

      {/* إعلان ذكي أسفل الصفحة - معطل */}
      {/* <SmartSharedAd
        position="footer"
        className="mt-8"
        keywords={['مجتمع', 'انضم', 'تواصل']}
      /> */}
    </div>
    </AIToolPageClient>
  );
}
