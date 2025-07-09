'use client';

// صفحة تعديل المقال
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SimpleEditor } from '@/components/SimpleEditor';
import { getArticleById, updateArticle } from '@/lib/database';
import { Article, ArticleFormData } from '@/types';

interface EditArticleFormProps {
  params: Promise<{ id: string }>;
}

function EditArticleForm({ params }: EditArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [article, setArticle] = useState<Article | null>(null);
  const [articleId, setArticleId] = useState<string>('');

  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: {
      time: Date.now(),
      blocks: [],
      version: '2.28.2',
    },
    featured_image_url: '',
    status: 'draft',
  });

  // جلب معرف المقال
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setArticleId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  // جلب بيانات المقال عند تحميل الصفحة
  useEffect(() => {
    if (articleId) {
      loadArticle();
    }
  }, [articleId]);

  const loadArticle = async () => {
    try {
      setPageLoading(true);
      const data = await getArticleById(articleId);
      setArticle(data);
      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featured_image_url: data.featured_image_url,
        status: data.status,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPageLoading(false);
    }
  };

  // توليد slug تلقائياً من العنوان
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        status,
      };

      await updateArticle(articleId, dataToSubmit);
      router.push('/admin/articles');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#38BDF8] mb-4"></div>
          <p className="text-gray-400">جاري تحميل المقال...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">المقال غير موجود</h2>
          <Link
            href="/admin/articles"
            className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white px-6 py-3 rounded-lg transition-colors duration-300"
          >
            العودة للمقالات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] p-6">
      <div className="max-w-4xl mx-auto">
        {/* هيدر الصفحة */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">تعديل المقال</h1>
            <p className="text-gray-400 mt-2">تعديل: {article.title}</p>
          </div>
          <Link
            href="/admin/articles"
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            ← العودة للمقالات
          </Link>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* نموذج المقال */}
        <form className="space-y-6">
          <div className="bg-[#161B22] rounded-lg border border-gray-700 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* العنوان */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  عنوان المقال *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent"
                  placeholder="أدخل عنوان المقال"
                  required
                />
              </div>

              {/* الرابط */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  رابط المقال (Slug)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent"
                  placeholder="article-slug"
                />
              </div>

              {/* صورة المقال */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  رابط صورة المقال
                </label>
                <input
                  type="url"
                  value={formData.featured_image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* الملخص */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ملخص المقال
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent resize-none"
                  placeholder="ملخص قصير عن المقال"
                />
              </div>
            </div>
          </div>

          {/* محرر المحتوى */}
          <div className="bg-[#161B22] rounded-lg border border-gray-700 p-6">
            <SimpleEditor
              value={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
            />
          </div>

          {/* أزرار الحفظ */}
          <div className="flex justify-end space-x-4 space-x-reverse">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={loading || !formData.title.trim()}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ كمسودة'}
            </button>
            
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'published')}
              disabled={loading || !formData.title.trim()}
              className="px-6 py-3 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري النشر...' : 'نشر المقال'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditArticlePage({ params }: EditArticleFormProps) {
  return (
    <ProtectedRoute>
      <EditArticleForm params={params} />
    </ProtectedRoute>
  );
}
