// صفحة جميع أدوات الذكاء الاصطناعي
import { supabase, fixObjectEncoding } from "@/lib/supabase";
import { AIToolCard } from "@/components/AIToolCard";
import { AITool } from "@/types";

export const revalidate = 600;

async function getAllAITools() {
  try {
    console.log('🔄 Fetching AI tools from database...');

    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .in('status', ['published', 'active']) // قبول كلا من published و active
      .order('rating', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching AI tools:', error);
      return [];
    }

    console.log('✅ AI Tools fetched from database:', data?.length || 0);

    if (data && data.length > 0) {
      console.log('📄 Sample AI tool names:', data.slice(0, 3).map(t => t.name));
    }

    // إصلاح encoding النص العربي
    const fixedData = data?.map(tool => fixObjectEncoding(tool)) || [];
    return fixedData as AITool[];
  } catch (error) {
    console.error('❌ Exception in getAllAITools:', error);
    return [];
  }
}

export const metadata = {
  title: "أدوات الذكاء الاصطناعي",
  description: "اكتشف أفضل أدوات الذكاء الاصطناعي في TechnoFlash",
};

export default async function AIToolsPage() {
  const tools = await getAllAITools();

  // تجميع الأدوات حسب الفئة
  const categories = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, AITool[]>);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* رأس الصفحة */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-white mb-6">
            أدوات الذكاء الاصطناعي
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-2xl mx-auto">
            اكتشف مجموعة شاملة من أفضل أدوات الذكاء الاصطناعي لتطوير مشاريعك وتحسين إنتاجيتك
          </p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="bg-dark-card rounded-xl p-6 mb-12 border border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse mb-4 md:mb-0">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {tools.length} أداة متاحة
                </h3>
                <p className="text-dark-text-secondary text-sm">
                  في {Object.keys(categories).length} فئة مختلفة
                </p>
              </div>
            </div>
            
            {/* فلاتر */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <select className="bg-dark-background border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300">
                <option value="all">جميع الفئات</option>
                {Object.keys(categories).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select className="bg-dark-background border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300">
                <option value="latest">الأحدث</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="name">الاسم</option>
              </select>
            </div>
          </div>
        </div>

        {/* عرض الأدوات */}
        {tools.length > 0 ? (
          <div>
            {/* عرض حسب الفئات */}
            {Object.keys(categories).length > 1 ? (
              Object.entries(categories).map(([category, categoryTools]) => (
                <div key={category} className="mb-16">
                  <h2 className="text-3xl font-bold text-white mb-8 border-r-4 border-primary pr-4">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryTools.map((tool) => (
                      <AIToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // عرض عادي إذا كانت فئة واحدة فقط
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tools.map((tool) => (
                  <AIToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-dark-card rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-dark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">لا توجد أدوات ذكاء اصطناعي بعد</h3>
            <p className="text-dark-text-secondary text-lg mb-8">
              سنقوم بإضافة أدوات الذكاء الاصطناعي قريباً!
            </p>
            <a
              href="/"
              className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center"
            >
              العودة للرئيسية
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
          </div>
        )}

        {/* روابط سريعة للصفحات */}
        {tools.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">
              هل أعجبك المحتوى؟
            </h3>
            <p className="text-dark-text-secondary text-center mb-6">
              تعرف على المزيد حول TechnoFlash أو تواصل معنا
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/page/about-us"
                className="border border-gray-600 hover:border-primary text-white hover:text-primary px-6 py-3 rounded-lg font-medium transition-colors duration-300 text-center"
              >
                من نحن
              </a>

              <a
                href="/page/contact-us"
                className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 text-center"
              >
                تواصل معنا
              </a>
            </div>
          </div>
        )}

        {/* دعوة للعمل */}
        {tools.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              هل تعرف أداة ذكاء اصطناعي رائعة؟
            </h3>
            <p className="text-dark-text-secondary mb-6">
              شاركنا اقتراحاتك لإضافة أدوات جديدة إلى مجموعتنا
            </p>
            <a
              href="/page/contact-us"
              className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center"
            >
              اقترح أداة
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
