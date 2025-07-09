'use client';

import Link from 'next/link';
import { Service } from '@/types';
import { ServiceCard } from './ServiceCard';

interface ServicesSectionProps {
  services: Service[];
  title?: string;
  showViewAll?: boolean;
  variant?: 'default' | 'featured' | 'compact';
  maxItems?: number;
}

export function ServicesSection({ 
  services, 
  title = "خدماتنا", 
  showViewAll = true,
  variant = 'default',
  maxItems 
}: ServicesSectionProps) {
  // تحديد عدد الخدمات المعروضة
  const displayServices = maxItems ? services.slice(0, maxItems) : services;

  if (!services || services.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-gray-600 mb-8">لا توجد خدمات متاحة حالياً</p>
            <Link
              href="/admin/services/new"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
            >
              إضافة خدمة جديدة
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* عنوان القسم */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            نقدم مجموعة متنوعة من الخدمات التقنية المتطورة لمساعدتك في تحقيق أهدافك الرقمية
          </p>
        </div>

        {/* شبكة الخدمات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              variant={service.featured ? 'featured' : variant}
            />
          ))}
        </div>

        {/* زر عرض المزيد */}
        {showViewAll && services.length > (maxItems || 0) && (
          <div className="text-center">
            <Link
              href="/services"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
            >
              عرض جميع الخدمات
            </Link>
          </div>
        )}

        {/* إحصائيات سريعة */}
        {services.length > 0 && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {services.length}
              </div>
              <div className="text-gray-600">خدمة متاحة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {services.filter(s => s.featured).length}
              </div>
              <div className="text-gray-600">خدمة مميزة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {services.filter(s => s.pricing_type === 'free').length}
              </div>
              <div className="text-gray-600">خدمة مجانية</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
