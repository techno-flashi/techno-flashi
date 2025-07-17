import { Metadata } from 'next';
import { Service } from '@/types';
import { ServicesSection } from '@/components/ServicesSection';
import AdBanner from '@/components/ads/AdBanner';
import { supabase, fixObjectEncoding } from '@/lib/supabase';

// إعادة التحقق من البيانات كل 60 ثانية
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'خدماتنا - تكنوفلاش',
  description: 'اكتشف مجموعة متنوعة من الخدمات التقنية المتطورة التي نقدمها لمساعدتك في تحقيق أهدافك الرقمية',
  keywords: 'خدمات تقنية, تطوير مواقع, ذكاء اصطناعي, حلول رقمية, تكنوفلاش',
};

async function getServices(): Promise<Service[]> {
  try {
    console.log('🔄 Services page: Fetching all active services...');

    // جلب الخدمات مباشرة من Supabase لتجنب مشاكل URL في production
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'active')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Services page: Error fetching services from database:', error);
      return [];
    }

    console.log('✅ Services page: Services fetched from database:', data?.length || 0);

    if (data && data.length > 0) {
      console.log('📄 Services page: Sample service names:', data.slice(0, 3).map(s => s.name));
    }

    // إصلاح encoding النص العربي
    const fixedData = data?.map(service => fixObjectEncoding(service)) || [];
    return fixedData as Service[];
  } catch (error) {
    console.error('❌ Services page: Exception in getServices:', error);
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  console.log('🎯 Services page rendering with', services.length, 'services');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-black py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            خدماتنا التقنية المتطورة
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            نقدم حلولاً تقنية مبتكرة ومتخصصة لمساعدتك في تحقيق أهدافك الرقمية بأفضل المعايير العالمية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#services"
              className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-background-secondary transition-colors duration-200"
            >
              استكشف خدماتنا
            </a>
            <a
              href="/page/contact-us"
              className="border-2 border-white text-black px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-primary transition-colors duration-200"
            >
              تواصل معنا
            </a>
          </div>
        </div>
      </section>

      {/* إعلان */}
      <AdBanner placement="services-top" />

      {/* قسم الخدمات */}
      <div id="services">
        <ServicesSection 
          services={services}
          title="جميع خدماتنا"
          showViewAll={false}
        />
      </div>

      {/* إعلان */}
      <AdBanner placement="services-bottom" />

      {/* قسم الفئات */}
      {services.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                فئات الخدمات
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                تصفح خدماتنا حسب الفئة للعثور على ما تحتاجه بسهولة
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from(new Set(services.map(s => s.category))).map((category) => {
                const categoryServices = services.filter(s => s.category === category);
                return (
                  <div
                    key={category}
                    className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {category}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {categoryServices.length} خدمة متاحة
                    </p>
                    <div className="text-sm text-gray-500">
                      {categoryServices.slice(0, 3).map(s => s.name).join(' • ')}
                      {categoryServices.length > 3 && ' ...'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* قسم الاتصال */}
      <section className="py-16 bg-gray-900 text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            هل تحتاج خدمة مخصصة؟
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            نحن نقدم حلولاً مخصصة تماماً لاحتياجاتك. تواصل معنا لمناقشة مشروعك
          </p>
          <a
            href="/page/contact-us"
            className="inline-block bg-primary text-black px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            تواصل معنا الآن
          </a>
        </div>
      </section>
    </div>
  );
}
