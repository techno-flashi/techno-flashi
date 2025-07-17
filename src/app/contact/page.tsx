import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'اتصل بنا - TechnoFlash',
  description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
  keywords: 'اتصل بنا, تواصل, TechnoFlash, استفسارات, خدمات تقنية, دعم',
  openGraph: {
    title: 'اتصل بنا - TechnoFlash',
    description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
    url: 'https://www.tflash.site/contact',
    siteName: 'TechnoFlash',
    images: [
      {
        url: 'https://www.tflash.site/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TechnoFlash - اتصل بنا',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'اتصل بنا - TechnoFlash',
    description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
    images: ['https://www.tflash.site/og-image.jpg'],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-black">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            اتصل بنا
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            نحن هنا لمساعدتك. تواصل معنا للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-dark-card rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-primary">أرسل لنا رسالة</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">الاسم الكامل</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black placeholder-gray-400"
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black placeholder-gray-400"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">الموضوع</label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                  required
                >
                  <option value="">اختر الموضوع</option>
                  <option value="general">استفسار عام</option>
                  <option value="services">طلب خدمة تقنية</option>
                  <option value="collaboration">تعاون أو شراكة</option>
                  <option value="feedback">ملاحظات أو اقتراحات</option>
                  <option value="technical">مشكلة تقنية</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">الرسالة</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black placeholder-gray-400 resize-none"
                  placeholder="اكتب رسالتك هنا..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/80 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                إرسال الرسالة
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="bg-dark-card rounded-xl p-8 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-primary">طرق التواصل</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">البريد الإلكتروني</h3>
                    <p className="text-gray-300">info@tflash.site</p>
                    <p className="text-sm text-gray-400">نرد خلال 24 ساعة</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">تويتر</h3>
                    <p className="text-gray-300">@TechnoFlash_AR</p>
                    <p className="text-sm text-gray-400">للتحديثات السريعة</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">يوتيوب</h3>
                    <p className="text-gray-300">TechnoFlash</p>
                    <p className="text-sm text-gray-400">فيديوهات تعليمية</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-dark-card rounded-xl p-8 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-primary">أسئلة شائعة</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">كم يستغرق الرد على الاستفسارات؟</h3>
                  <p className="text-sm text-gray-300">نحن نرد على جميع الاستفسارات خلال 24 ساعة من استلامها.</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">هل تقدمون خدمات تقنية مخصصة؟</h3>
                  <p className="text-sm text-gray-300">نعم، نقدم استشارات تقنية وخدمات تطوير مخصصة للشركات والأفراد.</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">كيف يمكنني اقتراح موضوع للمقال؟</h3>
                  <p className="text-sm text-gray-300">يمكنك إرسال اقتراحاتك عبر النموذج أعلاه أو التواصل معنا عبر وسائل التواصل الاجتماعي.</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-dark-card rounded-xl p-8 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-primary">ساعات العمل</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>الأحد - الخميس</span>
                  <span className="text-gray-300">9:00 ص - 6:00 م</span>
                </div>
                <div className="flex justify-between">
                  <span>الجمعة</span>
                  <span className="text-gray-300">2:00 م - 6:00 م</span>
                </div>
                <div className="flex justify-between">
                  <span>السبت</span>
                  <span className="text-gray-300">مغلق</span>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  * التوقيت بحسب توقيت الرياض (GMT+3)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
