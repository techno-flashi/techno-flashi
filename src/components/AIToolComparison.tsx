import { AITool } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { AIToolLink } from './AIToolLink';

interface AIToolComparisonProps {
  tools: AITool[];
  className?: string;
}

export function AIToolComparison({ tools, className = '' }: AIToolComparisonProps) {
  if (tools.length < 2) {
    return null;
  }

  const getPricingText = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'مجاني';
      case 'freemium': return 'مجاني جزئياً';
      case 'paid': return 'مدفوع';
      default: return 'غير محدد';
    }
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'text-green-400 border-green-400';
      case 'freemium': return 'text-yellow-400 border-yellow-400';
      case 'paid': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className={`bg-dark-card rounded-xl p-8 border border-gray-800 ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-6">مقارنة الأدوات</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-right py-4 px-2 text-white font-semibold">المعيار</th>
              {tools.slice(0, 3).map((tool) => (
                <th key={tool.id} className="text-center py-4 px-2 min-w-[200px]">
                  <AIToolLink href={`/ai-tools/${tool.slug}`} className="block group">
                    <div className="flex flex-col items-center">
                      <div className="relative w-12 h-12 mb-2">
                        <Image
                          src={tool.logo_url || "https://placehold.co/100x100/38BDF8/FFFFFF?text=AI"}
                          alt={tool.name}
                          fill
                          style={{ objectFit: "contain" }}
                          className="rounded"
                        />
                      </div>
                      <span className="text-white font-semibold group-hover:text-primary transition-colors">
                        {tool.name}
                      </span>
                    </div>
                  </AIToolLink>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* التقييم */}
            <tr className="border-b border-gray-700/50">
              <td className="py-4 px-2 text-dark-text-secondary font-medium">التقييم</td>
              {tools.slice(0, 3).map((tool) => (
                <td key={tool.id} className="py-4 px-2 text-center">
                  <div className="flex items-center justify-center">
                    <span className="text-yellow-400 ml-1">⭐</span>
                    <span className="text-white font-semibold">{tool.rating}</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* التسعير */}
            <tr className="border-b border-gray-700/50">
              <td className="py-4 px-2 text-dark-text-secondary font-medium">التسعير</td>
              {tools.slice(0, 3).map((tool) => (
                <td key={tool.id} className="py-4 px-2 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPricingColor(tool.pricing)}`}>
                    {getPricingText(tool.pricing)}
                  </span>
                </td>
              ))}
            </tr>

            {/* الفئة */}
            <tr className="border-b border-gray-700/50">
              <td className="py-4 px-2 text-dark-text-secondary font-medium">الفئة</td>
              {tools.slice(0, 3).map((tool) => (
                <td key={tool.id} className="py-4 px-2 text-center">
                  <span className="text-primary bg-primary/20 px-2 py-1 rounded text-sm">
                    {tool.category}
                  </span>
                </td>
              ))}
            </tr>

            {/* المميزات الرئيسية */}
            <tr className="border-b border-gray-700/50">
              <td className="py-4 px-2 text-dark-text-secondary font-medium">المميزات الرئيسية</td>
              {tools.slice(0, 3).map((tool) => (
                <td key={tool.id} className="py-4 px-2">
                  <div className="space-y-1">
                    {tool.features?.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center justify-center">
                        <span className="text-green-400 text-xs ml-1">✓</span>
                        <span className="text-dark-text-secondary text-xs text-center">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* أفضل لـ */}
            <tr>
              <td className="py-4 px-2 text-dark-text-secondary font-medium">أفضل لـ</td>
              {tools.slice(0, 3).map((tool) => (
                <td key={tool.id} className="py-4 px-2">
                  <div className="text-center">
                    <span className="text-dark-text-secondary text-sm">
                      {tool.use_cases?.[0] || (tool.description || '').slice(0, 50) + '...'}
                    </span>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* أزرار العمل */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tools.slice(0, 3).map((tool) => (
            <div key={tool.id} className="text-center">
              <AIToolLink
                href={`/ai-tools/${tool.slug}`}
                className="block bg-primary hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 mb-2"
              >
                مراجعة مفصلة
              </AIToolLink>
              <Link
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-gray-600 hover:border-primary text-white hover:text-primary py-2 px-4 rounded-lg font-medium transition-colors duration-300"
              >
                زيارة الموقع
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
