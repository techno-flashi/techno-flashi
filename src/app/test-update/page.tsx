'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { getCurrentISOString } from '@/utils/dateUtils';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
}

export default function TestUpdatePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, content, status')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching articles:', error);
        toast.error('فشل في تحميل المقالات');
        return;
      }

      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('حدث خطأ أثناء تحميل المقالات');
    } finally {
      setLoading(false);
    }
  };

  const testUpdate = async (article: Article) => {
    setUpdating(true);
    setSelectedArticle(article);

    try {
      console.log('Testing update for article:', article.id);

      // بيانات تحديث بسيطة
      const updateData = {
        title: article.title + ' (محدث)',
        updated_at: getCurrentISOString()
      };

      console.log('Update data:', updateData);

      const { data, error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', article.id)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        toast.error(`فشل التحديث: ${error.message}`);
        return;
      }

      console.log('Update successful:', data);
      toast.success('تم التحديث بنجاح');
      
      // تحديث القائمة
      setArticles(prev => prev.map(a => 
        a.id === article.id ? { ...a, title: data.title } : a
      ));

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('حدث خطأ غير متوقع');
    } finally {
      setUpdating(false);
      setSelectedArticle(null);
    }
  };

  const testComplexUpdate = async (article: Article) => {
    setUpdating(true);
    setSelectedArticle(article);

    try {
      console.log('Testing complex update for article:', article.id);

      // بيانات تحديث معقدة (مثل التي تسبب المشكلة)
      const updateData = {
        title: article.title + ' (تحديث معقد)',
        slug: article.slug + '-updated',
        excerpt: 'ملخص محدث للمقال',
        content: article.content + '\n\n## تحديث جديد\n\nتم إضافة هذا المحتوى أثناء التحديث.',
        featured_image_url: null,
        category: 'تجريبي',
        tags: ['تحديث', 'اختبار'],
        status: article.status,
        reading_time: 5,
        seo_title: article.title + ' (محدث)',
        seo_description: 'وصف SEO محدث',
        seo_keywords: ['تحديث', 'اختبار', 'مقال'],
        updated_at: getCurrentISOString()
      };

      console.log('Complex update data:', updateData);

      const { data, error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', article.id)
        .select()
        .single();

      if (error) {
        console.error('Complex update error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        toast.error(`فشل التحديث المعقد: ${error.message}`);
        return;
      }

      console.log('Complex update successful:', data);
      toast.success('تم التحديث المعقد بنجاح');
      
      // تحديث القائمة
      setArticles(prev => prev.map(a => 
        a.id === article.id ? { ...a, title: data.title, slug: data.slug } : a
      ));

    } catch (error) {
      console.error('Unexpected error in complex update:', error);
      toast.error('حدث خطأ غير متوقع في التحديث المعقد');
    } finally {
      setUpdating(false);
      setSelectedArticle(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="text-white text-xl">جاري تحميل المقالات...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">اختبار تحديث المقالات</h1>
            <p className="text-dark-text-secondary">اختبار عمليات التحديث لتشخيص المشاكل</p>
          </div>

          {articles.length === 0 ? (
            <div className="bg-dark-card rounded-xl p-8 border border-gray-800 text-center">
              <div className="text-gray-400 text-lg mb-4">لا توجد مقالات للاختبار</div>
              <button
                onClick={fetchArticles}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                إعادة تحميل
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div key={article.id} className="bg-dark-card rounded-xl p-6 border border-gray-800">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {article.title}
                      </h3>
                      
                      <div className="text-sm text-gray-400 space-y-1">
                        <div>ID: <span className="font-mono">{article.id}</span></div>
                        <div>Slug: <span className="font-mono">{article.slug}</span></div>
                        <div>الحالة: <span className="text-primary">{article.status}</span></div>
                        <div>طول المحتوى: {article.content?.length || 0} حرف</div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => testUpdate(article)}
                        disabled={updating}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {updating && selectedArticle?.id === article.id ? 'جاري التحديث...' : 'تحديث بسيط'}
                      </button>
                      
                      <button
                        onClick={() => testComplexUpdate(article)}
                        disabled={updating}
                        className="px-4 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 disabled:opacity-50 transition-colors"
                      >
                        {updating && selectedArticle?.id === article.id ? 'جاري التحديث...' : 'تحديث معقد'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* معلومات التشخيص */}
          <div className="mt-8 bg-dark-card rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">معلومات التشخيص</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>• <strong>تحديث بسيط:</strong> يحدث العنوان فقط</p>
              <p>• <strong>تحديث معقد:</strong> يحدث جميع الحقول (مثل صفحة التعديل)</p>
              <p>• راقب console للحصول على تفاصيل الأخطاء</p>
              <p>• إذا فشل التحديث المعقد، فالمشكلة في البيانات المرسلة</p>
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="mt-6 flex justify-center space-x-4 space-x-reverse">
            <button
              onClick={fetchArticles}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              إعادة تحميل
            </button>
            <a
              href="/test-edit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              اختبار التعديل
            </a>
            <a
              href="/test-dashboard"
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              لوحة الاختبار
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
