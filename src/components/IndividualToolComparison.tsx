'use client';

import { AITool } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { AIToolLink } from './AIToolLink';

// إنشاء structured data للمقارنة
const generateComparisonStructuredData = (tools: AITool[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "ComparisonTable",
    "name": `مقارنة أدوات الذكاء الاصطناعي - ${tools.map(t => t.name).join(' مقابل ')}`,
    "description": `مقارنة تفصيلية بين ${tools.map(t => t.name).join(' و ')} من حيث المميزات والتسعير والتقييمات`,
    "comparedItems": tools.map(tool => ({
      "@type": "SoftwareApplication",
      "name": tool.name,
      "description": tool.description,
      "applicationCategory": tool.category,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": tool.rating,
        "bestRating": 5
      },
      "offers": {
        "@type": "Offer",
        "price": tool.pricing === 'free' ? '0' : 'varies',
        "priceCurrency": "USD"
      },
      "url": `https://tflash.site/ai-tools/${tool.slug}`
    }))
  };
};

interface IndividualToolComparisonProps {
  currentTool: AITool;
  comparisonTools: AITool[];
  className?: string;
}

export function IndividualToolComparison({
  currentTool,
  comparisonTools,
  className = ''
}: IndividualToolComparisonProps) {
  const allTools = [currentTool, ...comparisonTools];

  // استخراج المميزات المشتركة للمقارنة
  const getFeatureComparison = () => {
    const features = [
      { key: 'pricing', label: 'التسعير', getValue: (tool: AITool) => tool.pricing },
      { key: 'rating', label: 'التقييم', getValue: (tool: AITool) => tool.rating },
      { key: 'category', label: 'الفئة', getValue: (tool: AITool) => tool.category },
      { key: 'website', label: 'الموقع الرسمي', getValue: (tool: AITool) => tool.website_url }
    ];

    return features;
  };

  // تحويل نوع التسعير إلى نص عربي
  const getPricingText = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'مجاني';
      case 'paid': return 'مدفوع';
      case 'freemium': return 'مجاني مع خطط مدفوعة';
      default: return pricing;
    }
  };

  // الحصول على لون التسعير
  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'text-green-400';
      case 'paid': return 'text-red-400';
      case 'freemium': return 'text-yellow-400';
      default: return 'text-text-description';
    }
  };

  if (comparisonTools.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
        {/* رأس المقارنة */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">مقارنة الأدوات</h3>
          <p className="text-gray-600">
            مقارنة تفصيلية بين {currentTool.name} والأدوات المحددة
          </p>
        </div>

      {/* جدول المقارنة */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* رأس الجدول - أسماء الأدوات */}
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-right p-4 text-dark-text-secondary font-medium w-32">
                المعايير
              </th>
              {allTools.map((tool, index) => (
                <th key={tool.id} className="p-4 text-center min-w-48">
                  <div className="flex flex-col items-center">
                    {/* صورة الأداة */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden mb-3">
                      {tool.logo_url ? (
                        <Image
                          src={tool.logo_url}
                          alt={tool.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <span className="text-white font-bold text-xl">
                            {tool.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* اسم الأداة */}
                    <h4 className={`font-bold text-center ${
                      index === 0 ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {tool.name}
                    </h4>
                    {index === 0 && (
                      <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full mt-1">
                        الأداة الحالية
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* محتوى الجدول */}
          <tbody>
            {/* التقييم */}
            <tr className="border-b border-gray-200">
              <td className="p-4 text-gray-600 font-medium">التقييم</td>
              {allTools.map((tool) => (
                <td key={`rating-${tool.id}`} className="p-4 text-center">
                  <div className="flex items-center justify-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-gray-900 font-semibold">{tool.rating}</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* التسعير */}
            <tr className="border-b border-gray-200">
              <td className="p-4 text-gray-600 font-medium">التسعير</td>
              {allTools.map((tool) => (
                <td key={`pricing-${tool.id}`} className="p-4 text-center">
                  <span className={`font-semibold ${getPricingColor(tool.pricing)}`}>
                    {getPricingText(tool.pricing)}
                  </span>
                </td>
              ))}
            </tr>

            {/* الفئة */}
            <tr className="border-b border-gray-200">
              <td className="p-4 text-gray-600 font-medium">الفئة</td>
              {allTools.map((tool) => (
                <td key={`category-${tool.id}`} className="p-4 text-center">
                  <span className="text-gray-900">{tool.category}</span>
                </td>
              ))}
            </tr>

            {/* الوصف */}
            <tr className="border-b border-gray-800">
              <td className="p-4 text-dark-text-secondary font-medium">الوصف</td>
              {allTools.map((tool) => (
                <td key={`description-${tool.id}`} className="p-4 text-center">
                  <p className="text-dark-text-secondary text-sm leading-relaxed max-w-xs mx-auto">
                    {(tool.description || '').length > 100
                      ? `${(tool.description || '').substring(0, 100)}...`
                      : (tool.description || 'لا يوجد وصف متاح')
                    }
                  </p>
                </td>
              ))}
            </tr>

            {/* المميزات الرئيسية */}
            <tr className="border-b border-gray-800">
              <td className="p-4 text-dark-text-secondary font-medium">المميزات</td>
              {allTools.map((tool) => (
                <td key={`features-${tool.id}`} className="p-4 text-center">
                  <div className="space-y-1">
                    {tool.features && tool.features.length > 0 ? (
                      tool.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="text-sm text-gray-900 bg-gray-100 rounded px-2 py-1">
                          {feature}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-600 text-sm">غير محدد</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* أزرار العمل */}
            <tr>
              <td className="p-4 text-dark-text-secondary font-medium">الإجراءات</td>
              {allTools.map((tool, index) => (
                <td key={`actions-${tool.id}`} className="p-4 text-center">
                  <div className="space-y-2">
                    {index === 0 ? (
                      <div className="text-primary text-sm font-medium">
                        الصفحة الحالية
                      </div>
                    ) : (
                      <AIToolLink
                        href={`/ai-tools/${tool.slug}`}
                        className="block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 text-sm"
                      >
                        عرض التفاصيل
                      </AIToolLink>
                    )}
                    <div className="block border border-gray-600 text-gray-500 py-2 px-4 rounded-lg font-medium cursor-not-allowed text-sm">
                      <div className="flex items-center justify-center gap-1">
                        <span>📋</span>
                        <span>معلومات متاحة</span>
                      </div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* ملاحظات المقارنة */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* نصائح الاختيار */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">💡 نصائح للاختيار</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• قارن التسعير مع ميزانيتك المتاحة</li>
              <li>• تحقق من التقييمات وآراء المستخدمين</li>
              <li>• اختبر النسخة المجانية إن وجدت</li>
              <li>• تأكد من توافق الأداة مع احتياجاتك</li>
            </ul>
          </div>

          {/* روابط مفيدة */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">🔗 روابط مفيدة</h4>
            <div className="space-y-2">
              <Link
                href="/ai-tools/compare"
                className="block text-blue-600 hover:text-blue-700 transition-colors text-sm"
              >
                → مقارنة شاملة لجميع الأدوات
              </Link>
              <Link
                href="/ai-tools/categories"
                className="block text-blue-600 hover:text-blue-700 transition-colors text-sm"
              >
                → تصفح الأدوات حسب الفئة
              </Link>
              <Link
                href="/ai-tools"
                className="block text-blue-600 hover:text-blue-700 transition-colors text-sm"
              >
                → عرض جميع الأدوات
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
