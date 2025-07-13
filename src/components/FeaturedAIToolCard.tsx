// مكون أداة الذكاء الاصطناعي الرئيسية الكبيرة
import { AITool } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface FeaturedAIToolCardProps {
  tool: AITool;
}

export function FeaturedAIToolCard({ tool }: FeaturedAIToolCardProps) {
  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'text-green-400';
      case 'freemium': return 'text-blue-400';
      case 'paid': return 'text-orange-400';
      default: return 'text-gray-400';
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
    <Link href={`/ai-tools/${tool.slug}`} className="block group">
      <div className="bg-dark-card rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transform hover:-translate-y-1 h-full">
        <div className="relative w-full h-64 md:h-80 overflow-hidden bg-gradient-to-br from-primary/10 to-blue-600/10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <Image
                src={tool.logo_url || "https://placehold.co/200x200/38BDF8/FFFFFF?text=AI"}
                alt={tool.name}
                fill
                style={{ objectFit: "contain" }}
                className="transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>
          
          {/* شارة "أداة مميزة" */}
          <div className="absolute top-4 right-4">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
              أداة مميزة
            </span>
          </div>
          
          {/* التقييم */}
          <div className="absolute top-4 left-4">
            <div className="bg-dark-background/80 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center">
              <span className="text-yellow-400 text-sm">⭐</span>
              <span className="text-white text-sm font-medium mr-1">{tool.rating}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors duration-300">
              {tool.name}
            </h2>
            <span className={`text-sm font-medium ${getPricingColor(tool.pricing)}`}>
              {getPricingText(tool.pricing)}
            </span>
          </div>
          
          <p className="text-dark-text-secondary text-base md:text-lg mb-4 leading-relaxed line-clamp-3">
            {tool.description}
          </p>
          
          <div className="mb-4">
            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {tool.category}
            </span>
          </div>
          
          {/* المميزات */}
          <div className="mb-4">
            <h4 className="text-white font-semibold mb-2 text-sm">المميزات الرئيسية:</h4>
            <div className="flex flex-wrap gap-2">
              {(tool.features || []).slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-dark-background text-dark-text-secondary px-2 py-1 rounded text-xs"
                >
                  {feature}
                </span>
              ))}
              {(tool.features || []).length > 3 && (
                <span className="text-primary text-xs font-medium">
                  +{(tool.features || []).length - 3} المزيد
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-dark-text-secondary">
              أُضيفت في: {new Date(tool.created_at).toLocaleDateString('ar-EG', {
                month: 'short', 
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              زيارة الأداة
              <svg className="w-5 h-5 mr-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
