export default function HomePage() {

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-24 pb-28 overflow-hidden bg-slate-50">
        {/* عناصر هندسية متحركة */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-block bg-white/50 backdrop-blur-sm text-purple-800 text-sm font-semibold px-4 py-2 rounded-full mb-5">
            ✨ بوابتك للمستقبل التقني
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-4">
            مستقبلك التقني<br />يبدأ من هنا
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-700 mb-8">
            اكتشف أحدث التقنيات، أدوات الذكاء الاصطناعي المتطورة، ومقالات تقنية متخصصة لتطوير مهاراتك ومواكبة عالم التكنولوجيا المتسارع.
          </p>
          <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse mb-12">
            <a href="/articles" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 font-semibold">
              ابدأ الاستكشاف
            </a>
            <a href="/services" className="bg-white text-slate-700 px-8 py-3 rounded-lg shadow-md hover:bg-slate-100 transition-all font-semibold flex items-center space-x-2 rtl:space-x-reverse">
              <span>تصفح الخدمات</span>
              <span className="text-lg">←</span>
            </a>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-20 bg-slate-100/70 -mt-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">أحدث المقالات والأخبار</h2>
            <p className="text-lg text-slate-600">كن أول من يقرأ تحليلاتنا وأخبارنا التقنية.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Featured Article */}
            <a href="/articles" className="block lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="overflow-hidden h-80">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                  مقال مميز
                </div>
              </div>
              <div className="p-8">
                <span className="text-sm bg-purple-100 text-purple-800 font-semibold px-3 py-1 rounded-full">الذكاء الاصطناعي</span>
                <h3 className="mt-4 text-2xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">كيف سيغير نموذج GPT-5 عالم البرمجة؟</h3>
                <p className="mt-3 text-slate-600">نظرة عميقة على الإمكانيات المتوقعة للجيل القادم من نماذج اللغة وتأثيرها المباشر على مستقبل المطورين والشركات التقنية.</p>
              </div>
            </a>
            {/* Other Articles */}
            <div className="lg:col-span-1 grid gap-8">
              <a href="/articles" className="block bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center">
                  <div className="w-1/3 overflow-hidden h-40">
                    <div className="w-full h-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-white font-bold">
                      أمان
                    </div>
                  </div>
                  <div className="w-2/3 p-5">
                    <span className="text-xs bg-pink-100 text-pink-800 font-semibold px-2 py-1 rounded-full">الأمن السيبراني</span>
                    <h3 className="mt-3 text-lg font-bold text-slate-800 group-hover:text-purple-600 transition-colors">5 خطوات عملية لحماية بياناتك</h3>
                  </div>
                </div>
              </a>
              <a href="/articles" className="block bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center">
                  <div className="w-1/3 overflow-hidden h-40">
                    <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold">
                      تطوير
                    </div>
                  </div>
                  <div className="w-2/3 p-5">
                    <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2 py-1 rounded-full">تطوير الويب</span>
                    <h3 className="mt-3 text-lg font-bold text-slate-800 group-hover:text-purple-600 transition-colors">مقارنة بين React و Vue في 2025</h3>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="text-center mt-12">
            <a href="/articles" className="bg-white text-purple-600 px-8 py-3 rounded-lg shadow-md hover:bg-slate-100 transition-all font-semibold border border-purple-200 hover:border-purple-400">
              تصفح جميع المقالات
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">تجربة تقنية متكاملة</h2>
            <p className="text-lg text-slate-600">كل ما تحتاجه في مكان واحد.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:shadow-xl hover:border-purple-200 transition-all duration-300">
              <div className="inline-block bg-purple-100 text-purple-600 p-4 rounded-full mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">محتوى تقني متميز</h3>
              <p className="text-slate-600">مقالات وأدلة شاملة تغطي أحدث التطورات في عالم التكنولوجيا والبرمجة والذكاء الاصطناعي.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:shadow-xl hover:border-pink-200 transition-all duration-300">
              <div className="inline-block bg-pink-100 text-pink-600 p-4 rounded-full mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">أدوات ذكية متطورة</h3>
              <p className="text-slate-600">مجموعة شاملة من أدوات الذكاء الاصطناعي المتقدمة لتسهيل عملك وزيادة إنتاجيتك.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:shadow-xl hover:border-teal-200 transition-all duration-300">
              <div className="inline-block bg-teal-100 text-teal-600 p-4 rounded-full mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">خدمات متخصصة</h3>
              <p className="text-slate-600">حلول تقنية مخصصة وخدمات تطوير واستشارات متخصصة لتحقيق أهدافك التقنية.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-slate-100/70">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 text-white rounded-2xl p-8 md:p-12 shadow-2xl shadow-purple-200">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-3">انضم إلى النخبة التقنية</h2>
                <p className="opacity-80 mb-6">احصل على نشرتنا الأسبوعية المليئة بأحدث المقالات، أدوات الذكاء الاصطناعي المبتكرة، ونصائح البرمجة العملية مباشرة في بريدك.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-lg">
                <form className="flex flex-col sm:flex-row gap-3">
                  <input type="email" placeholder="بريدك الإلكتروني" className="w-full px-4 py-3 rounded-md text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-400" required />
                  <button type="submit" className="bg-white text-purple-600 font-bold px-6 py-3 rounded-md hover:bg-slate-100 transition-colors flex-shrink-0">اشترك الآن</button>
                </form>
                <p className="text-xs opacity-70 mt-3 text-center sm:text-right">نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
