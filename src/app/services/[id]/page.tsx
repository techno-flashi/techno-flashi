import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Service } from '@/types';

import { generateServiceSocialMeta, getSharingUrl, getSharingHashtags } from '@/lib/social-meta';
import SocialShare from '@/components/SocialShare';
import SocialShareCompact from '@/components/SocialShareCompact';

interface ServicePageProps {
  params: Promise<{ id: string }>;
}

async function getService(id: string): Promise<Service | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/api/services/${id}`,
      {
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch service');
    }

    const data = await response.json();
    return data.service;
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

async function getRelatedServices(currentServiceId: string, category: string): Promise<Service[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/services?status=active&category=${category}&limit=3`,
      {
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return (data.services || []).filter((s: Service) => s.id !== currentServiceId);
  } catch (error) {
    console.error('Error fetching related services:', error);
    return [];
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    return {
      title: 'خدمة غير موجودة - تكنوفلاش',
      description: 'الخدمة المطلوبة غير موجودة',
    };
  }

  return generateServiceSocialMeta({
    title: service.name,
    description: service.short_description || service.description,
    slug: service.id,
    image_url: service.image_url,
    category: service.category,
    price: service.pricing_amount?.toString()
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    notFound();
  }

  const relatedServices = await getRelatedServices(service.id, service.category);

  const formatPrice = (amount?: number, currency?: string) => {
    if (!amount) return null;
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPricingDisplay = () => {
    switch (service.pricing_type) {
      case 'free':
        return <span className="text-green-600 font-bold text-2xl">مجاني</span>;
      case 'paid':
        return service.pricing_amount ? (
          <span className="text-primary font-bold text-2xl">
            {formatPrice(service.pricing_amount, service.pricing_currency)}
          </span>
        ) : (
          <span className="text-gray-600 text-xl">السعر غير محدد</span>
        );
      case 'custom':
      default:
        return <span className="text-gray-600 text-xl">حسب الطلب</span>;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {service.featured && (
              <div className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                خدمة مميزة
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {service.name}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {service.short_description || service.description.substring(0, 200)}
            </p>
            <div className="mb-6">
              {getPricingDisplay()}
            </div>
            {service.cta_link && (
              <Link
                href={service.cta_link}
                className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                {service.cta_text}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* محتوى الخدمة */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* المحتوى الرئيسي */}
              <div className="lg:col-span-2">
                {/* صورة الخدمة */}
                {service.image_url && (
                  <div className="relative h-64 md:h-80 w-full mb-8 rounded-xl overflow-hidden">
                    <Image
                      src={service.image_url}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* الوصف التفصيلي */}
                <div className="prose prose-lg max-w-none mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    تفاصيل الخدمة
                  </h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {service.description}
                  </div>
                </div>

                {/* المميزات */}
                {service.features && service.features.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      مميزات الخدمة
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 space-x-reverse"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* مشاركة الخدمة */}
                <div className="mt-12 pt-8 border-t border-light-border">
                  <h3 className="text-xl font-bold text-text-primary mb-6 text-center">شارك هذه الخدمة</h3>
                  <SocialShare
                    url={getSharingUrl(`/services/${service.id}`)}
                    title={`${service.name} - خدمة تقنية`}
                    description={service.short_description || service.description}
                    hashtags={getSharingHashtags([service.category, 'خدمات'])}
                    showLabels={true}
                    size="lg"
                    className="justify-center"
                  />
                </div>
              </div>

              {/* الشريط الجانبي */}
              <div className="lg:col-span-1">
                <div className="bg-background-secondary rounded-xl p-6 sticky top-8">
                  <h3 className="text-xl font-bold text-text-primary mb-4">
                    معلومات الخدمة
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-600">التصنيف:</span>
                      <span className="font-medium text-gray-900 mr-2">
                        {service.category}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-gray-600">نوع التسعير:</span>
                      <span className="font-medium text-gray-900 mr-2">
                        {service.pricing_type === 'free' ? 'مجاني' : 
                         service.pricing_type === 'paid' ? 'مدفوع' : 'حسب الطلب'}
                      </span>
                    </div>

                    {service.tags && service.tags.length > 0 && (
                      <div>
                        <span className="text-gray-600 block mb-2">العلامات:</span>
                        <div className="flex flex-wrap gap-2">
                          {service.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-primary/10 text-primary px-2 py-1 rounded text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {service.cta_link && (
                    <div className="mt-6">
                      <Link
                        href={service.cta_link}
                        className="block w-full bg-primary text-white text-center px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
                      >
                        {service.cta_text}
                      </Link>
                    </div>
                  )}

                  {/* مشاركة مدمجة */}
                  <div className="mt-6 pt-6 border-t border-light-border">
                    <h4 className="text-lg font-semibold text-text-primary mb-4">شارك الخدمة</h4>
                    <SocialShare
                      url={getSharingUrl(`/services/${service.id}`)}
                      title={`${service.name} - خدمة تقنية`}
                      description={service.short_description || service.description}
                      hashtags={getSharingHashtags([service.category, 'خدمات'])}
                      size="sm"
                      className="justify-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* خدمات ذات صلة */}
      {relatedServices.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                خدمات ذات صلة
              </h2>
              <p className="text-gray-600">
                اكتشف المزيد من خدماتنا في نفس التصنيف
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedServices.map((relatedService) => (
                <Link
                  key={relatedService.id}
                  href={`/services/${relatedService.id}`}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                      {relatedService.name}
                    </h3>
                    <p className="text-text-description mb-4">
                      {relatedService.short_description || 
                       relatedService.description.substring(0, 100) + '...'}
                    </p>
                    <span className="text-primary font-medium">
                      تعرف أكثر ←
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
