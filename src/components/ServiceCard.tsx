'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
  variant?: 'default' | 'featured' | 'compact';
}

export function ServiceCard({ service, variant = 'default' }: ServiceCardProps) {
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
        return <span className="text-green-600 font-bold">مجاني</span>;
      case 'paid':
        return service.pricing_amount ? (
          <span className="text-primary font-bold">
            {formatPrice(service.pricing_amount, service.pricing_currency)}
          </span>
        ) : (
          <span className="text-text-description">السعر غير محدد</span>
        );
      case 'custom':
      default:
        return <span className="text-text-description">حسب الطلب</span>;
    }
  };

  const cardClasses = {
    default: "bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-light-border",
    featured: "bg-gradient-to-br from-primary/5 to-blue-50 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-primary/20",
    compact: "bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
  };

  return (
    <div className={cardClasses[variant]}>
      {/* صورة الخدمة */}
      {service.image_url && (
        <div className="relative h-48 w-full">
          <Image
            src={service.image_url}
            alt={service.name}
            fill
            className="object-cover"
          />
          {service.featured && (
            <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
              مميز
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* أيقونة الخدمة */}
        {service.icon_url && !service.image_url && (
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 relative">
              <Image
                src={service.icon_url}
                alt={service.name}
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* اسم الخدمة */}
        <h3 className="text-xl font-bold text-text-primary mb-3 text-center">
          {service.name}
        </h3>

        {/* الوصف المختصر */}
        <p className="text-text-description text-center mb-4 leading-relaxed">
          {service.short_description || service.description.substring(0, 120) + '...'}
        </p>

        {/* التصنيف */}
        <div className="flex justify-center mb-4">
          <span className="bg-background-secondary text-text-secondary px-3 py-1 rounded-full text-sm">
            {service.category}
          </span>
        </div>

        {/* المميزات */}
        {service.features && service.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {service.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                >
                  {feature}
                </span>
              ))}
              {service.features.length > 3 && (
                <span className="text-text-description text-xs">
                  +{service.features.length - 3} أكثر
                </span>
              )}
            </div>
          </div>
        )}

        {/* السعر */}
        <div className="text-center mb-4">
          {getPricingDisplay()}
        </div>

        {/* زر العمل */}
        <div className="text-center">
          {service.cta_link ? (
            <Link
              href={service.cta_link}
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px] shadow-lg hover:shadow-primary/25"
              aria-label={`${service.cta_text} - ${service.name}`}
            >
              {service.cta_text}
            </Link>
          ) : (
            <Link
              href={`/services/${service.id}`}
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px] shadow-lg hover:shadow-primary/25"
              aria-label={`${service.cta_text} - ${service.name}`}
            >
              {service.cta_text}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
