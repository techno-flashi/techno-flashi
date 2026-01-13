import { Metadata } from 'next';
import Link from 'next/link';
import YouTubeSection from '@/components/YouTubeSection';

export const metadata: Metadata = {
  title: 'قناة تكنو فلاش على يوتيوب - شروحات الذكاء الاصطناعي',
  description: 'تابع قناة تكنو فلاش على يوتيوب للحصول على شروحات مفصلة وتجارب عملية مع أحدث أدوات الذكاء الاصطناعي. 19K+ مشترك و 159+ فيديو تعليمي.',
  keywords: 'تكنو فلاش, يوتيوب, ذكاء اصطناعي, شروحات, فيديوهات تقنية, أدوات AI',
  openGraph: {
    title: 'قناة تكنو فلاش على يوتيوب',
    description: 'شروحات مفصلة وتجارب عملية مع أحدث أدوات الذكاء الاصطناعي',
    url: 'https://technoflash.net/youtube',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'قناة تكنو فلاش على يوتيوب',
    description: 'شروحات مفصلة وتجارب عملية مع أحدث أدوات الذكاء الاصطناعي',
  }
};

export default function YouTubePage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              🎥 قناة تكنو فلاش
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-8">
              رحلتك التعليمية في عالم الذكاء الاصطناعي تبدأ هنا
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="https://www.youtube.com/@Techno_flash"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
              >
                <span className="text-2xl">▶️</span>
                اشترك الآن
              </Link>
              <Link
                href="https://www.youtube.com/channel/UCXVSIaWCZBxqZ5eCxwIqRGw"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-red-600 transition-all duration-300"
              >
                تصفح الفيديوهات
              </Link>
            </div>

            {/* إحصائيات مفصلة */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">19K+</div>
                <div className="text-red-100 text-sm">مشترك</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">159+</div>
                <div className="text-red-100 text-sm">فيديو</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-red-100 text-sm">عربي</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">AI</div>
                <div className="text-red-100 text-sm">متخصص</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* محتوى القناة */}
      <section className="py-16 bg-dark-card">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              ماذا ستتعلم في قناتنا؟
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* فئات المحتوى */}
              <div className="bg-dark-bg rounded-xl p-6 border border-gray-800">
                <div className="text-4xl mb-4">🎬</div>
                <h3 className="text-xl font-bold text-white mb-3">شروحات عملية</h3>
                <p className="text-gray-400">
                  تعلم كيفية استخدام أحدث أدوات الذكاء الاصطناعي خطوة بخطوة مع أمثلة حقيقية
                </p>
              </div>

              <div className="bg-dark-bg rounded-xl p-6 border border-gray-800">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-xl font-bold text-white mb-3">تجارب حية</h3>
                <p className="text-gray-400">
                  شاهد تجاربي المباشرة مع الأدوات الجديدة واكتشف إمكانياتها الحقيقية
                </p>
              </div>

              <div className="bg-dark-bg rounded-xl p-6 border border-gray-800">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-xl font-bold text-white mb-3">نصائح متقدمة</h3>
                <p className="text-gray-400">
                  احصل على نصائح وحيل من خبرتي العملية لتحقيق أقصى استفادة من الأدوات
                </p>
              </div>

              <div className="bg-dark-bg rounded-xl p-6 border border-gray-800">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-white mb-3">مراجعات مفصلة</h3>
                <p className="text-gray-400">
                  تقييمات صادقة وشاملة للأدوات مع المقارنات والتوصيات
                </p>
              </div>

              <div className="bg-dark-bg rounded-xl p-6 border border-gray-800">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-white mb-3">مشاريع كاملة</h3>
                <p className="text-gray-400">
                  تابع إنشاء مشاريع كاملة باستخدام الذكاء الاصطناعي من البداية للنهاية
                </p>
              </div>

              <div className="bg-dark-bg rounded-xl p-6 border border-gray-800">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-white mb-3">حلول عملية</h3>
                <p className="text-gray-400">
                  تعلم كيفية حل المشاكل الحقيقية باستخدام أدوات الذكاء الاصطناعي
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* أحدث الفيديوهات */}
      <section className="py-16 bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              أحدث الفيديوهات
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  🔥 جديد
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  جربت Firebase Studio من جوجل: أخطر أداة ذكاء صناعي للمبرمجين
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  تجربة شاملة لأحدث أداة من جوجل للمطورين مع أمثلة عملية
                </p>
                <Link
                  href="https://www.youtube.com/watch?v=MkBbbam3hvs"
                  target="_blank"
                  className="text-red-400 hover:text-red-300 font-medium"
                >
                  مشاهدة الفيديو →
                </Link>
              </div>

              <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  🎨 إبداعي
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  افضل مواقع لعمل صور بشخصية ثابته مجانا بالذكاء الاصطناعي
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  دليل شامل لأفضل المواقع المجانية لإنشاء صور بشخصيات ثابتة
                </p>
                <Link
                  href="https://www.youtube.com/watch?v=sMeHM_pYno0"
                  target="_blank"
                  className="text-red-400 hover:text-red-300 font-medium"
                >
                  مشاهدة الفيديو →
                </Link>
              </div>

              <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  🎭 سينما
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  عمل فيلم سينمائي بالذكاء الاصطناعي 2024
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  تعلم كيفية إنتاج فيلم كامل باستخدام أدوات الذكاء الاصطناعي
                </p>
                <Link
                  href="https://www.youtube.com/watch?v=eHDHr4KN8Hc"
                  target="_blank"
                  className="text-red-400 hover:text-red-300 font-medium"
                >
                  مشاهدة الفيديو →
                </Link>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                href="https://www.youtube.com/channel/UCXVSIaWCZBxqZ5eCxwIqRGw/videos"
                target="_blank"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200"
              >
                عرض جميع الفيديوهات
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* دعوة للاشتراك */}
      <YouTubeSection />
    </div>
  );
}
