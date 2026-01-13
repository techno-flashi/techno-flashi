import Link from 'next/link';

export default function YouTubeSection() {
  return (
    <section className="py-12 bg-gradient-to-r from-red-600 to-red-700">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* العنوان الرئيسي */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              🎥 تابعنا على يوتيوب
            </h2>
            <p className="text-red-100 text-lg">
              شاهد شروحات مفصلة وتجارب عملية مع أحدث أدوات الذكاء الاصطناعي
            </p>
          </div>

          {/* إحصائيات القناة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-white mb-2">19K+</div>
              <div className="text-red-100">مشترك</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-white mb-2">159+</div>
              <div className="text-red-100">فيديو</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-red-100">محتوى عربي</div>
            </div>
          </div>

          {/* وصف المحتوى */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">ماذا ستجد في قناتنا؟</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-red-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎬</span>
                <span>شروحات عملية لأدوات الذكاء الاصطناعي</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔧</span>
                <span>تجارب حقيقية مع التقنيات الحديثة</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <span>نصائح وحيل للمطورين</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <span>مراجعات مفصلة للأدوات</span>
              </div>
            </div>
          </div>

          {/* أحدث الفيديوهات */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-6">أحدث الفيديوهات</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm font-medium mb-2">🎬 جديد</div>
                <div className="text-white font-semibold text-sm">
                  جربت Firebase Studio من جوجل: أخطر أداة ذكاء صناعي للمبرمجين
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm font-medium mb-2">🎨 إبداعي</div>
                <div className="text-white font-semibold text-sm">
                  افضل مواقع لعمل صور بشخصية ثابته مجانا بالذكاء الاصطناعي
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm font-medium mb-2">🎭 سينما</div>
                <div className="text-white font-semibold text-sm">
                  عمل فيلم سينمائي بالذكاء الاصطناعي 2024
                </div>
              </div>
            </div>
          </div>

          {/* أزرار العمل */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="https://www.youtube.com/@Techno_flash"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            >
              <span className="text-2xl">▶️</span>
              اشترك في القناة
            </Link>
            <Link
              href="https://www.youtube.com/channel/UCXVSIaWCZBxqZ5eCxwIqRGw"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-red-600 transition-all duration-300 flex items-center gap-3"
            >
              <span className="text-2xl">📺</span>
              تصفح الفيديوهات
            </Link>
          </div>

          {/* شهادة الأصالة */}
          <div className="mt-8 bg-green-500/20 border border-green-400/30 rounded-xl p-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-2xl">✅</span>
              <span className="font-bold text-green-200">محتوى أصلي ومتخصص</span>
            </div>
            <p className="text-green-100 text-sm">
              جميع الفيديوهات من إنتاجنا الخاص وتعكس خبرتنا العملية في مجال الذكاء الاصطناعي
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
