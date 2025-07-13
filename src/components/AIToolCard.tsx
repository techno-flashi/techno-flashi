// مكون أداة الذكاء الاصطناعي العادي
'use client';

import { AITool } from "@/types";
import { AIToolLink } from "./AIToolLink";
import Image from "next/image";

interface AIToolCardProps {
  tool: AITool;
  featured?: boolean;
}

export function AIToolCard({ tool, featured = false }: AIToolCardProps) {
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
    <AIToolLink
      href={`/ai-tools/${tool.slug}`}
      className="block group focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-xl"
      aria-label={`عرض تفاصيل أداة ${tool.name}`}
    >
      <div className={`bg-dark-card rounded-lg md:rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transform hover:-translate-y-1 md:hover:-translate-y-2 active:scale-95 h-full ${featured ? 'ring-2 ring-yellow-400/50' : ''}`}>
        {/* شارة المميز */}
        {featured && (
          <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ⭐ مميز
          </div>
        )}

        {/* الشعار والتقييم - محسن للأجهزة المحمولة */}
        <div className="relative w-full h-24 sm:h-28 md:h-32 bg-gradient-to-br from-primary/10 to-blue-600/10 flex items-center justify-center">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
            <Image
              src={tool.logo_url || "https://placehold.co/200x200/38BDF8/FFFFFF?text=AI"}
              alt={`شعار ${tool.name}`}
              width={64}
              height={64}
              className="transition-transform duration-500 group-hover:scale-110 object-contain"
              priority={featured}
              quality={90}
            />
          </div>

          {/* التقييم */}
          <div className="absolute top-2 right-2">
            <div className="bg-dark-background/80 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center">
              <span className="text-yellow-400 text-xs">⭐</span>
              <span className="text-white text-xs font-medium mr-1">{tool.rating}</span>
              {tool.click_count && tool.click_count > 0 && (
                <span className="text-dark-text-secondary text-xs mr-1">
                  ({tool.click_count})
                </span>
              )}
            </div>
          </div>

          {/* نوع التسعير */}
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPricingColor(tool.pricing)}`}>
              {getPricingText(tool.pricing)}
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
            {tool.name}
          </h3>

          <p className="text-dark-text-secondary text-xs sm:text-sm mb-3 leading-relaxed line-clamp-2">
            {tool.description || 'لا يوجد وصف متاح'}
          </p>

          <div className="mb-3">
            <span className="inline-block bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-medium">
              {tool.category || 'غير مصنف'}
            </span>
          </div>

          {/* المميزات */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {(tool.features || []).slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className="bg-dark-background text-dark-text-secondary px-2 py-1 rounded text-xs"
                >
                  {feature}
                </span>
              ))}
              {(tool.features || []).length > 2 && (
                <span className="text-primary text-xs font-medium">
                  +{(tool.features || []).length - 2} المزيد
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-dark-text-secondary">
              {new Date(tool.created_at).toLocaleDateString('ar-EG', {
                month: 'short', 
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
              <span className="text-sm">عرض التفاصيل</span>
              <svg className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </AIToolLink>
  );
}
