'use client';

// مكون أداة الذكاء الاصطناعي الصغيرة
import { AITool } from "@/types";
import SVGIcon from "./SVGIcon";
import Link from "next/link";

interface SmallAIToolCardProps {
  tool: AITool;
}

export function SmallAIToolCard({ tool }: SmallAIToolCardProps) {
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
      <div className="bg-dark-card rounded-lg overflow-hidden border border-gray-800 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transform hover:-translate-y-1 h-full">
        <div className="flex">
          {/* الشعار */}
          <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-gradient-to-br from-primary/10 to-blue-600/10 flex items-center justify-center">
            <div className="relative w-12 h-12">
              <SVGIcon
                src={tool.logo_url || "https://placehold.co/100x100/38BDF8/FFFFFF?text=AI"}
                alt={tool.name}
                fill
                style={{ objectFit: "contain" }}
                className="transition-transform duration-300 group-hover:scale-110"
                fallbackIcon="🤖"
              />
            </div>
          </div>
          
          {/* المحتوى */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors duration-300 line-clamp-1 leading-tight">
                {tool.name}
              </h3>
              <div className="flex items-center mr-2">
                <span className="text-yellow-400 text-xs">⭐</span>
                <span className="text-white text-xs font-medium mr-1">{tool.rating}</span>
              </div>
            </div>
            
            <p className="text-dark-text-secondary text-xs mb-2 line-clamp-2 leading-relaxed">
              {tool.description || 'لا يوجد وصف متاح'}
            </p>
            
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${getPricingColor(tool.pricing)}`}>
                {getPricingText(tool.pricing)}
              </span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
