// مكون أداة الذكاء الاصطناعي العادي
import { AITool } from "@/types";
import Image from "next/image";
import { AIToolLink } from "./AIToolLink";

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
    <AIToolLink href={`/ai-tools/${tool.slug}`} className="block group">
      <div className={`bg-dark-card rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transform hover:-translate-y-2 h-full ${featured ? 'ring-2 ring-yellow-400/50' : ''}`}>
        {/* شارة المميز */}
        {featured && (
          <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold">
            ⭐ مميز
          </div>
        )}

        {/* الشعار والتقييم */}
        <div className="relative w-full h-48 bg-gradient-to-br from-primary/10 to-blue-600/10 flex items-center justify-center">
          <div className="relative w-20 h-20">
            <Image
              src={tool.logo_url || "https://placehold.co/200x200/38BDF8/FFFFFF?text=AI"}
              alt={tool.name}
              fill
              style={{ objectFit: "contain" }}
              className="transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* التقييم */}
          <div className="absolute top-4 right-4">
            <div className="bg-dark-background/80 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center">
              <span className="text-yellow-400 text-sm">⭐</span>
              <span className="text-white text-sm font-medium mr-1">{tool.rating}</span>
              {tool.click_count && tool.click_count > 0 && (
                <span className="text-dark-text-secondary text-xs mr-2">
                  ({tool.click_count})
                </span>
              )}
            </div>
          </div>

          {/* نوع التسعير */}
          <div className="absolute top-4 left-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPricingColor(tool.pricing)}`}>
              {getPricingText(tool.pricing)}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {tool.name}
          </h3>
          
          <p className="text-dark-text-secondary text-sm mb-4 leading-relaxed line-clamp-3">
            {tool.description}
          </p>
          
          <div className="mb-4">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {tool.category}
            </span>
          </div>
          
          {/* المميزات */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {tool.features.slice(0, 2).map((feature, index) => (
                <span 
                  key={index}
                  className="bg-dark-background text-dark-text-secondary px-2 py-1 rounded text-xs"
                >
                  {feature}
                </span>
              ))}
              {tool.features.length > 2 && (
                <span className="text-primary text-xs font-medium">
                  +{tool.features.length - 2} المزيد
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
            <div className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              زيارة الأداة
              <svg className="w-4 h-4 mr-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </AIToolLink>
  );
}
