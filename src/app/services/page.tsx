import { Metadata } from 'next';
import { Service } from '@/types';
import { ServicesSection } from '@/components/ServicesSection';
import { AdBanner } from '@/components/AdBanner';

export const metadata: Metadata = {
  title: 'خدماتنا - تكنوفلاش',
  description: 'اكتشف مجموعة متنوعة من الخدمات التقنية المتطورة التي نقدمها لمساعدتك في تحقيق أهدافك الرقمية',
  keywords: 'خدمات تقنية, تطوير مواقع, ذكاء اصطناعي, حلول رقمية, تكنوفلاش',
};

async function getServices(): Promise<Service[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/api/services?status=active`,
      {
        cache: 'no-store' // للحصول على أحدث البيانات
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch services:', response.status);
      return [];
    }

    const data = await response.json();
    console.log('Services page - Services fetched:', data.services?.length || 0);
    return data.services || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white py-20">
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
              className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              استكشف خدماتنا
            </a>
            <a
              href="/page/contact-us"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-primary transition-colors duration-200"
            >
              تواصل معنا
            </a>
          </div>
        </div>
      </section>

      {/* إعلان */}
      <AdBanner position="services-top" />

      {/* قسم الخدمات */}
      <div id="services">
        <ServicesSection 
          services={services}
          title="جميع خدماتنا"
          showViewAll={false}
        />
      </div>

      {/* إعلان */}
      <AdBanner position="services-bottom" />

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
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            هل تحتاج خدمة مخصصة؟
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            نحن نقدم حلولاً مخصصة تماماً لاحتياجاتك. تواصل معنا لمناقشة مشروعك
          </p>
          <a
            href="/page/contact-us"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            تواصل معنا الآن
          </a>
        </div>
      </section>
    </div>
  );
}
