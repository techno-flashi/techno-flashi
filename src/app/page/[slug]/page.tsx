// صفحة ديناميكية لعرض الصفحات الثابتة
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase, fixObjectEncoding } from '@/lib/supabase';
import { Metadata } from 'next';

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

  return {
    title: `${pageData.title_ar} - TechnoFlash`,
    description: pageData.meta_description || pageData.title_ar,
    keywords: pageData.meta_keywords || '',
    openGraph: {
      title: `${pageData.title_ar} - TechnoFlash`,
      description: pageData.meta_description || pageData.title_ar,
      type: 'website',
      locale: 'ar_SA',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pageData.title_ar} - TechnoFlash`,
      description: pageData.meta_description || pageData.title_ar,
    }
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
    <div className="min-h-screen py-20 px-4 bg-dark-background">
      <div className="container mx-auto max-w-4xl">
        {/* العنوان الرئيسي */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {pageData.title_ar}
          </h1>
          {pageData.meta_description && (
            <p className="text-xl text-dark-text-secondary max-w-2xl mx-auto">
              {pageData.meta_description}
            </p>
          )}
        </header>

        {/* محتوى الصفحة */}
        <main className="bg-dark-card rounded-xl p-8 border border-gray-800">
          <div 
            className="prose prose-lg prose-invert max-w-none"
            style={{
              color: '#e5e7eb',
              lineHeight: '1.8'
            }}
            dangerouslySetInnerHTML={{ __html: pageData.content_ar }}
          />
        </main>

        {/* معلومات إضافية */}
        <footer className="mt-12 text-center">
          <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
            <p className="text-dark-text-secondary text-sm mb-4">
              آخر تحديث: {new Date(pageData.updated_at).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/"
                className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                العودة للرئيسية
              </Link>
              
              <Link
                href="/page/contact-us"
                className="border border-gray-600 hover:border-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                تواصل معنا
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// تحسين الأداء - ISR
export const revalidate = 3600; // إعادة التحقق كل ساعة
