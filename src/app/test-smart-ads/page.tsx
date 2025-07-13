'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SmartArticleAd, SmartAIToolAd, SmartSharedAd, SmartContentAd } from '@/components/ads/SmartAdManager';
import Link from 'next/link';

interface Advertisement {
  id: string;
  title: string;
  content: string;
  type: string;
  position: string;
  is_active: boolean;
  view_count: number;
  click_count: number;
}

export default function TestSmartAdsPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContentType, setSelectedContentType] = useState<'article' | 'ai-tool' | 'both'>('both');

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ads:', error);
        return;
      }

      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  // تصفية الإعلانات حسب الكلمات المفتاحية
  const getSharedAds = () => {
    return ads.filter(ad => {
      const adText = `${ad.title} ${ad.content}`.toLowerCase();
      const sharedKeywords = ['ذكاء اصطناعي', 'ai', 'تقنية', 'برمجة', 'تطوير', 'دورة', 'مجتمع'];
      return sharedKeywords.some(keyword => adText.includes(keyword));
    });
  };

  const getArticleAds = () => {
    return ads.filter(ad => {
      const adText = `${ad.title} ${ad.content}`.toLowerCase();
      const articleKeywords = ['مقال', 'قراءة', 'تعلم', 'دورة'];
      return articleKeywords.some(keyword => adText.includes(keyword));
    });
  };

  const getAIToolAds = () => {
    return ads.filter(ad => {
      const adText = `${ad.title} ${ad.content}`.toLowerCase();
      const toolKeywords = ['أداة', 'tool', 'premium', 'مميز', 'ai'];
      return toolKeywords.some(keyword => adText.includes(keyword));
    });
  };

  const sharedAds = getSharedAds();
  const articleAds = getArticleAds();
  const aiToolAds = getAIToolAds();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="text-white text-xl">جاري تحميل الإعلانات الذكية...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* رأس الصفحة */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">اختبار الإعلانات الذكية المشتركة</h1>
            <p className="text-dark-text-secondary">
              اختبار الإعلانات التي تظهر في كل من صفحات المقالات وأدوات الذكاء الاصطناعي
            </p>
          </div>

          {/* إحصائيات الإعلانات */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-card rounded-xl p-4 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{ads.length}</div>
              <div className="text-gray-400 text-sm">إجمالي الإعلانات</div>
            </div>
            <div className="bg-dark-card rounded-xl p-4 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{sharedAds.length}</div>
              <div className="text-gray-400 text-sm">إعلانات مشتركة</div>
            </div>
            <div className="bg-dark-card rounded-xl p-4 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{articleAds.length}</div>
              <div className="text-gray-400 text-sm">إعلانات المقالات</div>
            </div>
            <div className="bg-dark-card rounded-xl p-4 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">{aiToolAds.length}</div>
              <div className="text-gray-400 text-sm">إعلانات الأدوات</div>
            </div>
          </div>

          {/* أدوات التحكم */}
          <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">اختبار حسب نوع المحتوى</h2>
            <div className="flex space-x-4 space-x-reverse">
              {(['both', 'article', 'ai-tool'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedContentType(type)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedContentType === type
                      ? 'bg-primary text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type === 'both' ? 'مشترك' : type === 'article' ? 'مقالات' : 'أدوات AI'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* المحتوى الرئيسي */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* إعلان الهيدر */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">إعلان الهيدر (مشترك)</h2>
                <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                  <SmartSharedAd 
                    position="header"
                    keywords={['دورة', 'تعلم', 'ذكاء اصطناعي']}
                  />
                </div>
              </section>

              {/* محتوى تجريبي للمقال */}
              {(selectedContentType === 'both' || selectedContentType === 'article') && (
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">محاكاة صفحة مقال</h2>
                  <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      مقال: مستقبل الذكاء الاصطناعي في البرمجة
                    </h3>
                    
                    {/* إعلان بداية المقال */}
                    <SmartArticleAd 
                      position="article-body-start"
                      keywords={['ذكاء اصطناعي', 'برمجة', 'تطوير']}
                    />
                    
                    <p className="text-gray-300 mb-4">
                      يشهد عالم البرمجة تطوراً مستمراً مع ظهور تقنيات الذكاء الاصطناعي الجديدة...
                    </p>

                    {/* إعلان وسط المقال */}
                    <SmartContentAd 
                      contentType="article"
                      keywords={['ذكاء اصطناعي', 'برمجة']}
                    />

                    <p className="text-gray-300 mb-4">
                      تساعد هذه التقنيات المطورين على كتابة كود أفضل وأكثر كفاءة...
                    </p>
                  </div>
                </section>
              )}

              {/* محتوى تجريبي لأداة AI */}
              {(selectedContentType === 'both' || selectedContentType === 'ai-tool') && (
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">محاكاة صفحة أداة AI</h2>
                  <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      أداة: مولد النصوص بالذكاء الاصطناعي
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <span className="text-gray-400">الفئة:</span>
                        <span className="text-white ml-2">إنتاج المحتوى</span>
                      </div>
                      <div>
                        <span className="text-gray-400">النوع:</span>
                        <span className="text-white ml-2">مجاني</span>
                      </div>
                    </div>

                    {/* إعلان بعد معلومات الأداة */}
                    <SmartAIToolAd 
                      position="in-content"
                      keywords={['أداة', 'AI', 'مولد نصوص']}
                    />

                    <p className="text-gray-300 mb-4">
                      أداة قوية لإنتاج النصوص باستخدام الذكاء الاصطناعي...
                    </p>

                    {/* إعلان وسط المحتوى */}
                    <SmartContentAd 
                      contentType="ai-tool"
                      keywords={['premium', 'متقدم', 'أداة']}
                    />
                  </div>
                </section>
              )}

              {/* إعلان الفوتر */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">إعلان الفوتر (مشترك)</h2>
                <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                  <SmartSharedAd 
                    position="footer"
                    keywords={['مجتمع', 'انضم', 'تواصل']}
                  />
                </div>
              </section>
            </div>

            {/* الشريط الجانبي */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">معلومات الإعلانات الذكية</h2>
                
                {/* إحصائيات مفصلة */}
                <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">الإعلانات المشتركة</h3>
                  <div className="space-y-2">
                    {sharedAds.slice(0, 3).map(ad => (
                      <div key={ad.id} className="bg-gray-800 rounded-lg p-3">
                        <h4 className="text-white font-medium text-sm mb-1">{ad.title}</h4>
                        <div className="text-xs text-gray-400">
                          <div>الموضع: {ad.position}</div>
                          <div>المشاهدات: {ad.view_count || 0}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* الكلمات المفتاحية */}
                <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">الكلمات المفتاحية</h3>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-1">مشتركة:</h4>
                      <div className="flex flex-wrap gap-1">
                        {['ذكاء اصطناعي', 'AI', 'تقنية', 'برمجة'].map(keyword => (
                          <span key={keyword} className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-1">مقالات:</h4>
                      <div className="flex flex-wrap gap-1">
                        {['مقال', 'قراءة', 'تعلم'].map(keyword => (
                          <span key={keyword} className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-1">أدوات:</h4>
                      <div className="flex flex-wrap gap-1">
                        {['أداة', 'tool', 'premium'].map(keyword => (
                          <span key={keyword} className="bg-purple-900 text-purple-300 px-2 py-1 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* روابط الاختبار */}
                <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">اختبار في الصفحات الحقيقية</h3>
                  <div className="space-y-2">
                    <Link
                      href="/articles"
                      target="_blank"
                      className="block text-primary hover:text-primary/80 text-sm"
                    >
                      📄 اختبار في صفحة المقالات
                    </Link>
                    <Link
                      href="/ai-tools"
                      target="_blank"
                      className="block text-primary hover:text-primary/80 text-sm"
                    >
                      🤖 اختبار في صفحة أدوات AI
                    </Link>
                    <Link
                      href="/admin/ads"
                      className="block text-primary hover:text-primary/80 text-sm"
                    >
                      ⚙️ إدارة الإعلانات
                    </Link>
                  </div>
                </div>

                {/* معلومات تقنية */}
                <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">كيف يعمل النظام الذكي</h3>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p>• يحلل الكلمات المفتاحية في المحتوى</p>
                    <p>• يختار الإعلانات المناسبة تلقائياً</p>
                    <p>• يعرض إعلانات مشتركة في كلا النوعين</p>
                    <p>• يتكيف مع نوع الصفحة والمحتوى</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="mt-12 text-center">
            <div className="space-x-4 space-x-reverse">
              <Link
                href="/admin/ads"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                إدارة الإعلانات
              </Link>
              <Link
                href="/test-ads-comprehensive"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                الاختبار الشامل
              </Link>
              <Link
                href="/test-dashboard"
                className="inline-block px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                لوحة الاختبار
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
