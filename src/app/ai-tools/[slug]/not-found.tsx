import Link from 'next/link';

export default function AIToolNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* رقم الخطأ */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-primary/20 mb-4">404</h1>
          <div className="text-6xl mb-6">🤖</div>
        </div>

        {/* رسالة الخطأ */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            أداة غير موجودة
          </h2>
          <p className="text-dark-text-secondary text-lg leading-relaxed mb-6">
            عذراً، الأداة التي تبحث عنها غير موجودة أو تم حذفها. 
            ربما تم تغيير الرابط أو أن الأداة لم تعد متاحة.
          </p>
        </div>

        {/* اقتراحات */}
        <div className="bg-dark-card rounded-xl p-8 border border-gray-800 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">ماذا يمكنك أن تفعل؟</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
            <div className="flex items-start">
              <span className="text-primary text-lg ml-3 mt-1">🔍</span>
              <div>
                <h4 className="font-semibold text-white mb-1">تصفح جميع الأدوات</h4>
                <p className="text-dark-text-secondary text-sm">
                  اكتشف مجموعتنا الكاملة من أدوات الذكاء الاصطناعي
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-primary text-lg ml-3 mt-1">🏠</span>
              <div>
                <h4 className="font-semibold text-white mb-1">العودة للرئيسية</h4>
                <p className="text-dark-text-secondary text-sm">
                  ابدأ من جديد من الصفحة الرئيسية
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-primary text-lg ml-3 mt-1">📝</span>
              <div>
                <h4 className="font-semibold text-white mb-1">قراءة المقالات</h4>
                <p className="text-dark-text-secondary text-sm">
                  تعلم المزيد من مقالاتنا التقنية
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-primary text-lg ml-3 mt-1">💼</span>
              <div>
                <h4 className="font-semibold text-white mb-1">تصفح الخدمات</h4>
                <p className="text-dark-text-secondary text-sm">
                  اكتشف خدماتنا التقنية المتخصصة
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* أزرار العمل */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/ai-tools"
            className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 text-center"
          >
            تصفح جميع الأدوات
          </Link>
          <Link
            href="/"
            className="border border-gray-600 hover:border-primary text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 text-center"
          >
            العودة للرئيسية
          </Link>
        </div>

        {/* روابط إضافية */}
        <div className="mt-8 pt-8 border-t border-light-border">
          <p className="text-dark-text-secondary mb-4">أو تصفح أقسام أخرى:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/articles"
              className="text-primary hover:text-blue-400 transition-colors"
            >
              المقالات
            </Link>
            <span className="text-text-description">•</span>
            <Link
              href="/services"
              className="text-primary hover:text-blue-400 transition-colors"
            >
              الخدمات
            </Link>
            <span className="text-text-description">•</span>
            <Link
              href="/ai-tools"
              className="text-primary hover:text-blue-400 transition-colors"
            >
              أدوات الذكاء الاصطناعي
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
