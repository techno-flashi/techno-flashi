import { Metadata } from 'next';
import { Service } from '@/types';
import { ServicesSection } from '@/components/ServicesSection';


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
      {/* Hero Section محدث */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* خلفية متدرجة */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10"></div>
        </div>

        {/* عناصر هندسية */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center">
            {/* شارة */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 rounded-full text-sm font-medium mb-6">
              🚀 خدمات متطورة
            </div>

            {/* العنوان الرئيسي */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              خدماتنا
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"> التقنية</span>
            </h1>

            {/* الوصف */}
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-10">
              نقدم حلولاً تقنية مبتكرة ومتخصصة لمساعدتك في تحقيق أهدافك الرقمية
              <br className="hidden md:block" />
              بأفضل المعايير العالمية وأحدث التقنيات
            </p>

            {/* الأزرار */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="#services"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="relative z-10">استكشف خدماتنا</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a
                href="/page/contact-us"
                className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-purple-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                تواصل معنا
                <span className="inline-block mr-2 transition-transform group-hover:translate-x-1">←</span>
              </a>
            </div>
          </div>
        </div>
      </section>



      {/* قسم الخدمات */}
      <div id="services">
        <ServicesSection 
          services={services}
          title="جميع خدماتنا"
          showViewAll={false}
        />
      </div>



      {/* قسم الفئات المحدث */}
      {services.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 rounded-full text-sm font-medium mb-6">
                📂 تصنيفات الخدمات
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                فئات
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"> الخدمات</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                تصفح خدماتنا حسب الفئة للعثور على الحل المناسب لاحتياجاتك بسهولة وسرعة
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from(new Set(services.map(s => s.category))).map((category, index) => {
                const categoryServices = services.filter(s => s.category === category);
                const gradients = [
                  'from-purple-600 to-blue-600',
                  'from-blue-600 to-indigo-600',
                  'from-indigo-600 to-purple-600'
                ];
                return (
                  <div
                    key={category}
                    className="group relative"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${gradients[index % gradients.length]} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                    <div className="relative modern-card p-8 text-center hover-lift">
                      <div className={`w-16 h-16 bg-gradient-to-r ${gradients[index % gradients.length]} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl text-white">
                          {index === 0 ? '💻' : index === 1 ? '🎨' : '🔧'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {category}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {categoryServices.length} خدمة متاحة
                      </p>
                      <div className="text-sm text-gray-500 leading-relaxed">
                        {categoryServices.slice(0, 3).map(s => s.name).join(' • ')}
                        {categoryServices.length > 3 && ' ...'}
                      </div>
                      <div className="mt-4">
                        <span className={`inline-flex items-center px-3 py-1 bg-gradient-to-r ${gradients[index % gradients.length]} text-white rounded-full text-xs font-medium`}>
                          {categoryServices.length} خدمة
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* قسم الاتصال المحدث */}
      <section className="relative py-20 overflow-hidden">
        {/* خلفية متدرجة */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5"></div>
        </div>

        {/* عناصر هندسية */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 rounded-full text-sm font-medium mb-6">
              💬 تواصل معنا
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              هل تحتاج
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"> خدمة مخصصة</span>؟
            </h2>

            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              نحن نقدم حلولاً مخصصة تماماً لاحتياجاتك الفريدة. تواصل معنا لمناقشة مشروعك
              والحصول على استشارة مجانية
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/page/contact-us"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="relative z-10">تواصل معنا الآن</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              <a
                href="/page/about-us"
                className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-purple-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                تعرف علينا أكثر
                <span className="inline-block mr-2 transition-transform group-hover:translate-x-1">←</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
