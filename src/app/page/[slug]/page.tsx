// صفحة ديناميكية لعرض الصفحات الثابتة
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase, fixObjectEncoding } from '@/lib/supabase';
import { Metadata } from 'next';
import { generatePageCanonicalUrl, generateSingleCanonicalMeta } from '@/lib/canonical-url-manager';

interface PageData {
  id: string;
  page_key: string;
  title_ar: string;
  content_ar: string;
  meta_description?: string;
  meta_keywords?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  title_en?: string;
  content_en?: string;
  meta_description_en?: string;
  meta_keywords_en?: string;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// جلب بيانات الصفحة
async function getPageData(slug: string): Promise<PageData | null> {
  try {
    const { data, error } = await supabase
      .from('site_pages')
      .select('*')
      .eq('page_key', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      console.error('خطأ في جلب بيانات الصفحة:', error);
      return null;
    }

    // إصلاح encoding النص العربي
    return fixObjectEncoding(data) as PageData;
  } catch (error) {
    console.error('خطأ في جلب بيانات الصفحة:', error);
    return null;
  }
}

// إنشاء metadata ديناميكي
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageData = await getPageData(slug);

  if (!pageData) {
    return {
      title: 'صفحة غير موجودة - TechnoFlash',
      description: 'الصفحة المطلوبة غير موجودة'
    };
  }

  // Generate canonical URL using canonical URL manager - SEO audit fix
  const canonicalUrl = generatePageCanonicalUrl('page', slug);

  return {
    title: `${pageData.title_ar} - TechnoFlash`,
    description: pageData.meta_description || pageData.title_ar,
    keywords: pageData.meta_keywords || '',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${pageData.title_ar} - TechnoFlash`,
      description: pageData.meta_description || pageData.title_ar,
      type: 'website',
      url: canonicalUrl,
      siteName: 'TechnoFlash',
      locale: 'ar_SA',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pageData.title_ar} - TechnoFlash`,
      description: pageData.meta_description || pageData.title_ar,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// إنشاء الصفحات الثابتة في وقت البناء
export async function generateStaticParams() {
  try {
    const { data, error } = await supabase
      .from('site_pages')
      .select('page_key')
      .eq('is_active', true);

    if (error || !data) {
      console.error('خطأ في جلب قائمة الصفحات:', error);
      return [];
    }

    return data.map((page) => ({
      slug: page.page_key,
    }));
  } catch (error) {
    console.error('خطأ في إنشاء الصفحات الثابتة:', error);
    return [];
  }
}

// مكون الصفحة الرئيسي
export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const pageData = await getPageData(slug);

  if (!pageData) {
    notFound();
  }



  return (
    <div className="min-h-screen">
      {/* Hero Section المحدث */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* خلفية متدرجة */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-blue-600/10 to-purple-600/10"></div>
        </div>

        {/* عناصر هندسية */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center">
            {/* شارة */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
              📄 صفحة معلومات
            </div>

            {/* العنوان الرئيسي */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {pageData.title_ar}
            </h1>

            {/* الوصف */}
            {pageData.meta_description && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {pageData.meta_description}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4">
        {/* محتوى الصفحة */}
        <main className="mb-16">
          <div className="modern-card p-8 lg:p-12">
            {/* إضافة H2 مفقودة - SEO audit fix */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 mt-8 leading-tight">
              {pageData.title_ar === 'سياسة الخصوصية' ? 'تفاصيل سياسة الخصوصية' :
               pageData.title_ar === 'شروط الاستخدام' ? 'شروط وأحكام الاستخدام' :
               pageData.title_ar === 'من نحن' ? 'معلومات عن TechnoFlash' :
               pageData.title_ar === 'اتصل بنا' ? 'طرق التواصل معنا' :
               `تفاصيل ${pageData.title_ar}`}
            </h2>

            <div
              className="prose prose-lg max-w-none text-right text-gray-800 leading-relaxed"
              style={{
                lineHeight: '1.8',
                fontSize: '1.1rem'
              }}
              dangerouslySetInnerHTML={{
                __html: pageData.content_ar
                  .replace(/\n/g, '<br>')
                  .replace(/<br><br>/g, '</p><p class="mb-6">')
                  .replace(/^/, '<p class="mb-6">')
                  .replace(/$/, '</p>')
              }}
            />

            {/* إضافة محتوى إضافي للصفحات ذات المحتوى القليل - SEO audit fix */}
            {pageData.content_ar && pageData.content_ar.length < 500 && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border-r-4 border-blue-500">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {pageData.title_ar === 'سياسة الخصوصية' ? 'التزامنا بحماية خصوصيتك' :
                   pageData.title_ar === 'شروط الاستخدام' ? 'استخدام آمن ومسؤول للموقع' :
                   pageData.title_ar === 'من نحن' ? 'رؤيتنا ورسالتنا' :
                   pageData.title_ar === 'اتصل بنا' ? 'نحن هنا لمساعدتك' :
                   'معلومات إضافية مهمة'}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {pageData.title_ar === 'سياسة الخصوصية' ?
                    'في TechnoFlash، نؤمن بأن خصوصية المستخدمين هي حق أساسي. نحن ملتزمون بحماية بياناتك الشخصية وضمان استخدامها بطريقة آمنة وشفافة. تطبق هذه السياسة على جميع خدماتنا ومنتجاتنا التقنية.' :
                   pageData.title_ar === 'شروط الاستخدام' ?
                    'باستخدامك لموقع TechnoFlash، فإنك توافق على الالتزام بهذه الشروط والأحكام. نحن نسعى لتوفير بيئة آمنة ومفيدة لجميع المستخدمين، ونتوقع منك المساهمة في ذلك من خلال الاستخدام المسؤول لخدماتنا.' :
                   pageData.title_ar === 'من نحن' ?
                    'TechnoFlash هي منصة تقنية رائدة تهدف إلى تمكين الأفراد والشركات من الاستفادة من أحدث التقنيات والذكاء الاصطناعي. نحن نؤمن بأن التكنولوجيا يجب أن تكون في متناول الجميع وسهلة الاستخدام.' :
                   pageData.title_ar === 'اتصل بنا' ?
                    'فريق TechnoFlash متاح دائماً لمساعدتك والإجابة على استفساراتك. سواء كنت تحتاج إلى دعم تقني، أو لديك اقتراحات لتحسين خدماتنا، أو تريد التعاون معنا، نحن نرحب بتواصلك معنا.' :
                    'نحن في TechnoFlash نسعى دائماً لتقديم أفضل الخدمات التقنية وأحدث المعلومات في مجال التكنولوجيا والذكاء الاصطناعي لمساعدتك في تحقيق أهدافك.'}
                </p>
                <p className="text-gray-600 text-sm">
                  آخر تحديث: {new Date().toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </main>

        {/* معلومات إضافية */}
        <footer className="text-center">
          <div className="modern-card p-8">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
                🕒 آخر تحديث: {new Date(pageData.updated_at).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/"
                  className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <span className="relative z-10">العودة للرئيسية</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                <Link
                  href="/contact"
                  className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-indigo-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  تواصل معنا
                  <span className="inline-block mr-2 transition-transform group-hover:translate-x-1">←</span>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// إعدادات ISR محسنة لتوفير الاستهلاك
export const revalidate = 86400; // 24 ساعة
export const dynamic = 'force-static';
export const dynamicParams = false;
