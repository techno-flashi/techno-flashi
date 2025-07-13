'use client';

import Link from 'next/link';

export default function TestDashboardPage() {
  const testPages = [
    {
      title: 'اختبار رفع الصور البسيط',
      description: 'اختبار رفع صورة واحدة إلى Supabase Storage',
      url: '/test-simple-upload',
      status: 'جاهز',
      color: 'bg-green-600'
    },
    {
      title: 'اختبار نظام إدارة الصور',
      description: 'اختبار رفع صور متعددة مع معارض وتخطيطات مختلفة',
      url: '/test-images',
      status: 'جاهز',
      color: 'bg-green-600'
    },
    {
      title: 'اختبار إنشاء المقالات',
      description: 'إنشاء مقالات تجريبية لاختبار النظام',
      url: '/test-article-creation',
      status: 'جاهز',
      color: 'bg-green-600'
    },
    {
      title: 'عرض المقالات المنشورة',
      description: 'عرض وإدارة جميع المقالات الموجودة',
      url: '/test-articles',
      status: 'جاهز',
      color: 'bg-green-600'
    },
    {
      title: 'إنشاء مقال جديد (الإدارة)',
      description: 'صفحة إنشاء المقالات الرسمية مع نظام الصور المتقدم',
      url: '/admin/articles/create',
      status: 'محدث',
      color: 'bg-blue-600'
    },
    {
      title: 'اختبار صفحة التعديل',
      description: 'اختبار صفحة تعديل المقالات مع نظام الصور',
      url: '/test-edit',
      status: 'جديد',
      color: 'bg-orange-600'
    },
    {
      title: 'اختبار تحديث المقالات',
      description: 'تشخيص مشاكل تحديث المقالات في قاعدة البيانات',
      url: '/test-update',
      status: 'تشخيص',
      color: 'bg-red-600'
    },
    {
      title: 'اختبار نظام الإعلانات',
      description: 'اختبار AdSense والإعلانات المخصصة والمتحركة',
      url: '/test-ads',
      status: 'جديد',
      color: 'bg-green-600'
    },
    {
      title: 'اختبار إعلانات قاعدة البيانات',
      description: 'عرض الإعلانات المحفوظة في قاعدة البيانات',
      url: '/test-database-ads',
      status: 'جديد',
      color: 'bg-purple-600'
    },
    {
      title: 'اختبار تكامل الإعلانات',
      description: 'اختبار عرض الإعلانات في جميع صفحات الموقع',
      url: '/test-ads-integration',
      status: 'جديد',
      color: 'bg-indigo-600'
    },
    {
      title: 'اختبار الإعلانات الشامل',
      description: 'اختبار متقدم للإعلانات مع التجاوب والأداء',
      url: '/test-ads-comprehensive',
      status: 'جديد',
      color: 'bg-pink-600'
    },
    {
      title: 'الإعلانات الذكية المشتركة',
      description: 'إعلانات مربوطة بين المقالات وأدوات الذكاء الاصطناعي',
      url: '/test-smart-ads',
      status: 'جديد',
      color: 'bg-indigo-600'
    },
    {
      title: 'الإعلان المتحرك الحصري',
      description: 'اختبار الإعلان المتحرك من تكنوفلاش في جميع أنحاء الموقع',
      url: '/test-techno-banner',
      status: 'جديد',
      color: 'bg-yellow-600'
    },
    {
      title: 'تشخيص المساحات والإعلانات',
      description: 'أداة تشخيص شاملة لاكتشاف المساحات الفارغة ومشاكل الإعلانات',
      url: '/debug-spacing',
      status: 'أداة تشخيص',
      color: 'bg-red-600'
    },
    {
      title: 'اختبار التحديثات الجديدة',
      description: 'اختبار شامل للميزات الجديدة: إصلاح المساحات، إيقاف الإعلانات، التحميل التدريجي',
      url: '/test-updates',
      status: 'تحديث جديد',
      color: 'bg-green-600'
    },
    {
      title: 'اختبار زر إيقاف الإعلانات',
      description: 'صفحة اختبار مخصصة لتشخيص وإصلاح مشكلة زر الإيقاف مع تشخيص مفصل',
      url: '/test-pause-ads',
      status: 'إصلاح',
      color: 'bg-orange-600'
    },
    {
      title: 'إصلاح إعلانات TechnoFlash',
      description: 'اختبار وإصلاح مشكلة جلب إعلانات TechnoFlash المتحركة مع معالجة الأخطاء',
      url: '/test-techno-banner-fix',
      status: 'إصلاح جديد',
      color: 'bg-cyan-600'
    },
    {
      title: 'اختبار الموبايل',
      description: 'صفحة مخصصة لاختبار الموقع على الأجهزة المحمولة مع معلومات الاتصال والتجاوب',
      url: '/mobile-test',
      status: 'موبايل',
      color: 'bg-pink-600'
    },
    {
      title: 'تشخيص مشاكل SEO',
      description: 'تحليل وحل مشاكل Google Search Console مع canonical URLs و robots.txt',
      url: '/seo-diagnosis',
      status: 'SEO',
      color: 'bg-emerald-600'
    },
    {
      title: 'اختبار Static Site Generation',
      description: 'اختبار وتحليل أداء SSG مع ISR وقياس مقاييس الأداء والتحميل',
      url: '/test-ssg',
      status: 'SSG',
      color: 'bg-indigo-600'
    },
    {
      title: 'تشخيص مشاكل SSG',
      description: 'تشخيص وإصلاح مشاكل Static Site Generation مع اختبار الاتصال والبيئة',
      url: '/debug-ssg',
      status: 'تشخيص',
      color: 'bg-red-600'
    },
    {
      title: 'اختبار SSG مبسط',
      description: 'اختبار مباشر ومقارنة بين SSG و Runtime مع تشخيص مفصل للمشاكل',
      url: '/test-simple-ssg',
      status: 'اختبار',
      color: 'bg-teal-600'
    },
    {
      title: 'الصفحة الرئيسية',
      description: 'الصفحة الرئيسية للموقع',
      url: '/',
      status: 'جاهز',
      color: 'bg-purple-600'
    }
  ];

  const features = [
    {
      title: '📝 نظام إدارة المقالات',
      items: [
        'إنشاء مقالات بـ Markdown',
        'معاينة فورية',
        'نظام slug فريد',
        'معالجة أخطاء محسنة',
        'حفظ تلقائي للبيانات'
      ]
    },
    {
      title: '🖼️ نظام إدارة الصور',
      items: [
        'رفع صور متعددة',
        'ضغط تلقائي للصور',
        'ترتيب بالسحب والإفلات',
        'تسميات توضيحية',
        'معارض صور متنوعة'
      ]
    },
    {
      title: '🎨 تخطيطات المعارض',
      items: [
        'شبكة (Grid)',
        'صف واحد (Single Row)',
        'كاروسيل (Carousel)',
        'عرض ملء الشاشة',
        'تحكم في المسافات'
      ]
    },
    {
      title: '⚡ الأداء والتحسين',
      items: [
        'تحميل lazy للصور',
        'ضغط تلقائي',
        'تصميم متجاوب',
        'تحسين SEO',
        'سرعة تحميل عالية'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* العنوان الرئيسي */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              🧪 لوحة اختبار TechnoFlash
            </h1>
            <p className="text-xl text-dark-text-secondary max-w-2xl mx-auto">
              مركز شامل لاختبار جميع مميزات نظام إدارة المحتوى والصور
            </p>
          </div>

          {/* صفحات الاختبار */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">صفحات الاختبار</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testPages.map((page, index) => (
                <Link
                  key={index}
                  href={page.url}
                  className="block bg-dark-card rounded-xl p-6 border border-gray-800 hover:border-primary transition-colors group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                      {page.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs text-white rounded ${page.color}`}>
                      {page.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {page.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* المميزات المتاحة */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">المميزات المتاحة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-dark-card rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {feature.title}
                  </h3>
                  <ul className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-gray-300 text-sm">
                        <span className="text-green-400 mr-2">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* إحصائيات النظام */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">إحصائيات النظام</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-dark-card rounded-xl p-6 border border-gray-800 text-center">
                <div className="text-3xl font-bold text-primary mb-2">12</div>
                <div className="text-gray-400 text-sm">صفحات اختبار</div>
              </div>
              <div className="bg-dark-card rounded-xl p-6 border border-gray-800 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
                <div className="text-gray-400 text-sm">نسبة الاكتمال</div>
              </div>
              <div className="bg-dark-card rounded-xl p-6 border border-gray-800 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">15+</div>
                <div className="text-gray-400 text-sm">مميزة متاحة</div>
              </div>
              <div className="bg-dark-card rounded-xl p-6 border border-gray-800 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">⚡</div>
                <div className="text-gray-400 text-sm">جاهز للاستخدام</div>
              </div>
            </div>
          </div>

          {/* تعليمات الاستخدام */}
          <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">تعليمات الاستخدام</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-semibold text-white mb-2">1. اختبار رفع الصور:</h3>
                <p className="text-sm">ابدأ بصفحة "اختبار رفع الصور البسيط" لاختبار رفع صورة واحدة، ثم انتقل إلى "نظام إدارة الصور" للاختبار المتقدم.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">2. إنشاء المقالات:</h3>
                <p className="text-sm">استخدم "اختبار إنشاء المقالات" لإنشاء مقالات تجريبية، أو "إنشاء مقال جديد" للاستخدام الفعلي.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">3. عرض النتائج:</h3>
                <p className="text-sm">راجع "عرض المقالات المنشورة" لرؤية جميع المقالات وإدارتها.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">4. معارض الصور:</h3>
                <p className="text-sm">استخدم الأكواد التالية في محرر Markdown:</p>
                <ul className="list-disc list-inside mt-2 text-xs space-y-1 ml-4">
                  <li><code className="bg-gray-800 px-2 py-1 rounded">[gallery]grid,3,normal[/gallery]</code> - شبكة 3 أعمدة</li>
                  <li><code className="bg-gray-800 px-2 py-1 rounded">[gallery]single-row,4,tight[/gallery]</code> - صف واحد مضغوط</li>
                  <li><code className="bg-gray-800 px-2 py-1 rounded">[gallery]carousel,1,loose[/gallery]</code> - كاروسيل مع مسافات</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
