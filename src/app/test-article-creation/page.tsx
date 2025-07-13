'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function TestArticleCreationPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [createdArticles, setCreatedArticles] = useState<any[]>([]);

  const createTestArticle = async () => {
    setIsCreating(true);

    try {
      const timestamp = Date.now();
      const testArticle = {
        title: `مقال تجريبي ${timestamp}`,
        slug: `test-article-${timestamp}`,
        excerpt: 'هذا مقال تجريبي لاختبار النظام',
        content: `# مقال تجريبي ${timestamp}

هذا محتوى تجريبي لاختبار نظام إنشاء المقالات والصور.

## مقدمة

مرحباً بكم في هذا المقال التجريبي الذي يهدف إلى اختبار جميع مميزات نظام إدارة المحتوى.

## المحتوى الرئيسي

### النقاط المهمة

- **النقطة الأولى**: اختبار التنسيق الأساسي
- **النقطة الثانية**: اختبار القوائم والروابط
- **النقطة الثالثة**: اختبار الصور والمعارض

### مثال على الكود

\`\`\`javascript
function testFunction() {
  console.log("هذا مثال على كود JavaScript");
  return "تم الاختبار بنجاح";
}
\`\`\`

### اقتباس مهم

> "النجاح هو القدرة على الانتقال من فشل إلى فشل دون فقدان الحماس" - ونستون تشرشل

## معرض الصور التجريبي

[gallery]grid,3,normal[/gallery]

## صور في صف واحد

[gallery]single-row,4,tight[/gallery]

## الخلاصة

تم إنشاء هذا المقال بنجاح في ${new Date().toLocaleString('ar-SA')}.

يحتوي هذا المقال على:
- تنسيق Markdown متقدم
- أمثلة على الكود
- اقتباسات
- معارض صور
- قوائم منسقة

**شكراً لكم على القراءة!**
`,
        featured_image_url: '',
        tags: ['تجريبي', 'اختبار'],
        language: 'ar',
        direction: 'rtl',
        featured: false,
        status: 'published',
        reading_time: 1,
        author: 'تكنوفلاش',
        meta_description: 'مقال تجريبي لاختبار النظام',
        seo_keywords: ['تجريبي', 'اختبار'],
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('إنشاء مقال تجريبي:', testArticle);

      const { data, error } = await supabase
        .from('articles')
        .insert([testArticle])
        .select()
        .single();

      if (error) {
        console.error('خطأ في إنشاء المقال:', error);
        console.error('تفاصيل الخطأ:', JSON.stringify(error, null, 2));
        
        if (error.code === '23505') {
          toast.error('المقال موجود مسبقاً (slug مكرر)');
        } else {
          toast.error(`خطأ في إنشاء المقال: ${error.message}`);
        }
        return;
      }

      console.log('تم إنشاء المقال بنجاح:', data);
      toast.success('تم إنشاء المقال التجريبي بنجاح');
      setCreatedArticles(prev => [data, ...prev]);

    } catch (error) {
      console.error('خطأ عام:', error);
      toast.error('حدث خطأ غير متوقع');
    } finally {
      setIsCreating(false);
    }
  };

  const deleteTestArticle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('خطأ في حذف المقال:', error);
        toast.error('فشل في حذف المقال');
        return;
      }

      toast.success('تم حذف المقال بنجاح');
      setCreatedArticles(prev => prev.filter(article => article.id !== id));
    } catch (error) {
      console.error('خطأ في حذف المقال:', error);
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">اختبار إنشاء المقالات</h1>
            <p className="text-dark-text-secondary">صفحة تجريبية لاختبار نظام إنشاء المقالات</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* إنشاء مقال تجريبي */}
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">إنشاء مقال تجريبي</h2>
              
              <button
                onClick={createTestArticle}
                disabled={isCreating}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCreating ? 'جاري الإنشاء...' : 'إنشاء مقال تجريبي'}
              </button>

              <div className="mt-4 text-sm text-gray-400">
                <p>سيتم إنشاء مقال تجريبي بـ:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>عنوان فريد مع timestamp</li>
                  <li>slug فريد</li>
                  <li>محتوى تجريبي</li>
                  <li>حالة منشور</li>
                </ul>
              </div>
            </div>

            {/* المقالات المنشأة */}
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">المقالات المنشأة ({createdArticles.length})</h2>
              
              {createdArticles.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  لم يتم إنشاء أي مقالات بعد
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {createdArticles.map((article) => (
                    <div key={article.id} className="border border-gray-700 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-2">{article.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">Slug: {article.slug}</p>
                      <p className="text-sm text-gray-400 mb-3">ID: {article.id}</p>
                      
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => window.open(`/articles/${article.slug}`, '_blank')}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          عرض
                        </button>
                        <button
                          onClick={() => deleteTestArticle(article.id)}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* معلومات التشخيص */}
          <div className="mt-8 bg-dark-card rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">معلومات التشخيص</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{createdArticles.length}</div>
                <div className="text-gray-400">مقالات منشأة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">✓</div>
                <div className="text-gray-400">اتصال قاعدة البيانات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">articles</div>
                <div className="text-gray-400">جدول البيانات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">⚡</div>
                <div className="text-gray-400">جاهز للاختبار</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
