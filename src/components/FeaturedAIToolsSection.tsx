// قسم أدوات الذكاء الاصطناعي المميزة (أداة كبيرة + 4 أدوات صغيرة)
import { AITool } from "@/types";
import { FeaturedAIToolCard } from "./FeaturedAIToolCard";
import { SmallAIToolCard } from "./SmallAIToolCard";
import { AIToolCard } from "./AIToolCard";

interface FeaturedAIToolsSectionProps {
  tools: AITool[];
}

export function FeaturedAIToolsSection({ tools }: FeaturedAIToolsSectionProps) {
  if (tools.length === 0) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-dark-card rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-dark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">لا توجد أدوات ذكاء اصطناعي بعد</h3>
            <p className="text-dark-text-secondary">سنقوم بإضافة أدوات الذكاء الاصطناعي قريباً!</p>
          </div>
        </div>
      </section>
    );
  }

  // الأداة الرئيسية (الأحدث)
  const featuredTool = tools[0];
  
  // الأدوات الصغيرة (الأحدث بعد الأداة الرئيسية)
  const sideTools = tools.slice(1, 5);

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        {/* عنوان القسم */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">أدوات الذكاء الاصطناعي</h2>
            <p className="text-dark-text-secondary">اكتشف أحدث وأفضل أدوات الذكاء الاصطناعي</p>
          </div>
          <a
            href="/ai-tools"
            className="text-primary hover:text-blue-400 font-semibold transition-colors duration-300 flex items-center"
          >
            عرض الكل
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
        </div>

        {/* تخطيط الأدوات */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* الأداة الرئيسية الكبيرة */}
          <div className="lg:col-span-2">
            <FeaturedAIToolCard tool={featuredTool} />
          </div>

          {/* الأدوات الصغيرة */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {sideTools.length > 0 ? (
                sideTools.map((tool) => (
                  <SmallAIToolCard key={tool.id} tool={tool} />
                ))
              ) : (
                // إذا لم تكن هناك أدوات كافية، نعرض رسالة
                <div className="text-center py-8">
                  <p className="text-dark-text-secondary">
                    المزيد من الأدوات قريباً...
                  </p>
                </div>
              )}
              
              {/* إذا كان عدد الأدوات أقل من 4، نملأ المساحة المتبقية */}
              {sideTools.length < 4 && sideTools.length > 0 && (
                <div className="bg-dark-card/50 rounded-lg border border-gray-800 border-dashed p-6 text-center">
                  <div className="text-dark-text-secondary text-sm">
                    <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    المزيد من الأدوات قريباً
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* أدوات إضافية إذا كان هناك أكثر من 5 أدوات */}
        {tools.length > 5 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-8 border-r-4 border-primary pr-4">
              أدوات أخرى
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.slice(5).map((tool) => (
                <AIToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
