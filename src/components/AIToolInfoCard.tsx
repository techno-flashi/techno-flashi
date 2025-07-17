import { AITool } from '@/types';

interface AIToolInfoCardProps {
  tool: AITool;
  className?: string;
}

/**
 * مكون عرض معلومات الأداة بدلاً من الرابط الخارجي
 * يعرض معلومات مفيدة للمستخدم بدون توجيهه خارج الموقع
 */
export function AIToolInfoCard({ tool, className = '' }: AIToolInfoCardProps) {
  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 ${className}`}>
      <div className="text-center">
        {/* أيقونة الأداة */}
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">🤖</span>
        </div>
        
        {/* عنوان */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          معلومات شاملة عن {tool.name}
        </h3>
        
        {/* معلومات الأداة */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between bg-white/70 rounded-lg p-3">
            <span className="text-gray-600">التقييم:</span>
            <div className="flex items-center">
              <span className="text-yellow-500">⭐</span>
              <span className="font-semibold text-gray-900 mr-1">{tool.rating}/5</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-white/70 rounded-lg p-3">
            <span className="text-gray-600">التسعير:</span>
            <span className="font-semibold text-gray-900">
              {tool.pricing === 'free' ? '🆓 مجاني' : 
               tool.pricing === 'freemium' ? '🔄 مجاني جزئياً' : 
               tool.pricing === 'paid' ? '💰 مدفوع' : tool.pricing}
            </span>
          </div>
          
          <div className="flex items-center justify-between bg-white/70 rounded-lg p-3">
            <span className="text-gray-600">الفئة:</span>
            <span className="font-semibold text-gray-900">{tool.category}</span>
          </div>
          
          {tool.features && tool.features.length > 0 && (
            <div className="bg-white/70 rounded-lg p-3">
              <div className="text-gray-600 mb-2">المميزات الرئيسية:</div>
              <div className="flex flex-wrap gap-1">
                {tool.features.slice(0, 3).map((feature, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
                {tool.features.length > 3 && (
                  <span className="text-blue-600 text-xs font-medium">
                    +{tool.features.length - 3} المزيد
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* رسالة تشجيعية */}
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-blue-800 text-sm font-medium">
            📚 جميع المعلومات والتفاصيل متاحة في هذه الصفحة
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * مكون مبسط لعرض حالة الأداة
 */
export function AIToolStatusCard({ 
  tool, 
  className = '',
  variant = 'default' 
}: { 
  tool: AITool; 
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
}) {
  if (variant === 'compact') {
    return (
      <div className={`bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg text-center ${className}`}>
        <div className="flex items-center justify-center gap-2">
          <span>📋</span>
          <span className="font-medium">معلومات شاملة متاحة</span>
        </div>
      </div>
    );
  }
  
  if (variant === 'minimal') {
    return (
      <div className={`bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-center cursor-not-allowed ${className}`}>
        <div className="flex items-center justify-center gap-2">
          <span>🔍</span>
          <span>تفاصيل متاحة أعلاه</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 text-center ${className}`}>
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-lg">🤖</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{tool.name}</h4>
          <div className="flex items-center justify-center">
            <span className="text-yellow-500 text-sm">⭐</span>
            <span className="text-gray-600 text-sm mr-1">{tool.rating}/5</span>
          </div>
        </div>
      </div>
      
      <p className="text-blue-800 text-sm font-medium">
        📚 معلومات مفصلة متاحة في هذه الصفحة
      </p>
    </div>
  );
}

/**
 * مكون بديل لأزرار الروابط الخارجية
 */
export function AIToolActionButton({ 
  tool, 
  className = '',
  text = "معلومات الأداة"
}: { 
  tool: AITool; 
  className?: string;
  text?: string;
}) {
  return (
    <div className={`bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-center cursor-default ${className}`}>
      <div className="flex items-center justify-center gap-2">
        <span>📋</span>
        <span>{text}</span>
      </div>
      <div className="text-blue-100 text-xs mt-1">
        جميع التفاصيل متاحة في هذه الصفحة
      </div>
    </div>
  );
}

export default AIToolInfoCard;
