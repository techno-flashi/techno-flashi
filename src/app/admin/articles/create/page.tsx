'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import MarkdownEditor from '@/components/MarkdownEditor';
import MarkdownPreview from '@/components/MarkdownPreview';
import ImageManager from '@/components/ImageManager';

export default function CreateArticlePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [articleImages, setArticleImages] = useState<Array<{
    id: string;
    image_url: string;
    image_path: string;
    alt_text?: string;
    caption?: string;
    file_size?: number;
    mime_type?: string;
    width?: number;
    height?: number;
    display_order: number;
  }>>([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    category: '',
    tags: '',
    language: 'ar' as 'ar' | 'en',
    direction: 'rtl' as 'rtl' | 'ltr',
    featured: false,
    status: 'draft' as 'draft' | 'published',
    author: '',
    meta_description: '',
    seo_keywords: ''
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const baseSlug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      // إضافة timestamp لضمان الفرادة
      const timestamp = Date.now();
      const uniqueSlug = `${baseSlug}-${timestamp}`;

      setFormData(prev => ({ ...prev, slug: uniqueSlug }));
    }
  }, [formData.title, formData.slug]);

  // Calculate reading time
  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  // دالة لإدراج صورة في المحرر
  const handleImageInsert = (imageUrl: string, caption?: string) => {
    const imageMarkdown = caption
      ? `![${caption}](${imageUrl})\n*${caption}*\n\n`
      : `![صورة](${imageUrl})\n\n`;

    setFormData(prev => ({
      ...prev,
      content: prev.content + imageMarkdown
    }));
  };

  // التحقق من فرادة الـ slug
  const checkSlugUniqueness = async (slug: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', slug)
        .limit(1);

      if (error) {
        console.error('Error checking slug uniqueness:', error);
        return false;
      }

      return data.length === 0;
    } catch (error) {
      console.error('Error checking slug uniqueness:', error);
      return false;
    }
  };

  // توليد slug فريد
  const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
    let slug = baseSlug;
    let counter = 1;

    while (!(await checkSlugUniqueness(slug))) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('العنوان والمحتوى مطلوبان');
      return;
    }

    setIsSubmitting(true);

    try {
      // التأكد من فرادة الـ slug
      const finalSlug = await generateUniqueSlug(formData.slug.trim());
      if (finalSlug !== formData.slug.trim()) {
        setFormData(prev => ({ ...prev, slug: finalSlug }));
        toast('تم تعديل الـ slug لضمان الفرادة.', { icon: 'ℹ️' });
      }

      const readingTime = calculateReadingTime(formData.content);
      const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
      const seoKeywordsArray = formData.seo_keywords ? formData.seo_keywords.split(',').map(keyword => keyword.trim()) : [];

      const articleData = {
        title: formData.title.trim(),
        slug: finalSlug,
        excerpt: formData.excerpt.trim(),
        content: formData.content,
        featured_image_url: formData.featured_image_url.trim(),
        tags: tagsArray,
        language: formData.language,
        direction: formData.direction,
        featured: formData.featured,
        status: formData.status,
        reading_time: readingTime,
        author: formData.author.trim() || 'تكنوفلاش',
        meta_description: formData.meta_description.trim() || formData.excerpt.trim(),
        seo_keywords: seoKeywordsArray,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('articles')
        .insert([articleData])
        .select()
        .single();

      if (error) {
        console.error('Error creating article:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));

        // معالجة أخطاء محددة
        if (error.code === '23505') {
          toast.error('العنوان أو الـ slug مستخدم مسبقاً. يرجى تغيير العنوان أو الـ slug');
        } else if (error.message?.includes('duplicate')) {
          toast.error('هناك مقال بنفس العنوان أو الـ slug موجود مسبقاً');
        } else {
          toast.error(`حدث خطأ في إنشاء المقال: ${error.message || 'خطأ غير معروف'}`);
        }
        return;
      }

      // حفظ الصور المرتبطة بالمقال
      if (articleImages.length > 0 && data) {
        const imageRecords = articleImages.map(img => ({
          article_id: data.id,
          image_url: img.image_url,
          image_path: img.image_path,
          alt_text: img.alt_text,
          caption: img.caption,
          file_size: img.file_size,
          mime_type: img.mime_type,
          width: img.width,
          height: img.height,
          display_order: img.display_order
        }));

        const { error: imageError } = await supabase
          .from('article_images')
          .insert(imageRecords);

        if (imageError) {
          console.error('Error saving article images:', imageError);
          toast.error('تم إنشاء المقال لكن حدث خطأ في حفظ الصور');
        }
      }

      toast.success('تم إنشاء المقال بنجاح');
      router.push('/admin/articles');
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ غير متوقع');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">إنشاء مقال جديد</h1>
            <p className="text-dark-text-secondary">أنشئ مقالاً جديداً باستخدام محرر Markdown المتقدم</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">المعلومات الأساسية</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    العنوان *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="أدخل عنوان المقال"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    الرابط (Slug)
                  </label>
                  <div className="flex space-x-2 space-x-reverse">
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="flex-1 px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="article-slug"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (formData.title) {
                          const baseSlug = formData.title
                            .toLowerCase()
                            .replace(/[^\w\s-]/g, '')
                            .replace(/\s+/g, '-')
                            .trim();
                          const uniqueSlug = await generateUniqueSlug(baseSlug);
                          setFormData(prev => ({ ...prev, slug: uniqueSlug }));
                          toast.success('تم توليد slug جديد');
                        } else {
                          toast.error('يرجى إدخال العنوان أولاً');
                        }
                      }}
                      className="px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors whitespace-nowrap"
                    >
                      توليد جديد
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    الوصف المختصر
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="وصف مختصر للمقال"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    الفئة
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="فئة المقال"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    العلامات (مفصولة بفواصل)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="علامة1, علامة2, علامة3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    رابط الصورة المميزة
                  </label>
                  <input
                    type="url"
                    value={formData.featured_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                    className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    الكاتب
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="اسم الكاتب"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    اللغة
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => {
                      const language = e.target.value as 'ar' | 'en';
                      setFormData(prev => ({
                        ...prev,
                        language,
                        direction: language === 'ar' ? 'rtl' : 'ltr'
                      }));
                    }}
                    className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    وصف SEO
                  </label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="وصف مختصر للمقال لمحركات البحث (160 حرف كحد أقصى)"
                    maxLength={160}
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    {formData.meta_description.length}/160 حرف
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    كلمات مفتاحية لـ SEO (مفصولة بفواصل)
                  </label>
                  <input
                    type="text"
                    value={formData.seo_keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
                    className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="كلمة مفتاحية1, كلمة مفتاحية2, كلمة مفتاحية3"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 space-x-reverse mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-dark-background border-gray-700 rounded focus:ring-primary"
                  />
                  <span className="mr-2 text-dark-text">مقال مميز</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={formData.status === 'draft'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                    className="w-4 h-4 text-primary bg-dark-background border-gray-700 focus:ring-primary"
                  />
                  <span className="mr-2 text-dark-text">مسودة</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={formData.status === 'published'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                    className="w-4 h-4 text-primary bg-dark-background border-gray-700 focus:ring-primary"
                  />
                  <span className="mr-2 text-dark-text">منشور</span>
                </label>
              </div>
            </div>

            {/* إدارة الصور */}
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">إدارة صور المقال</h2>
              <ImageManager
                images={articleImages}
                onImagesChange={setArticleImages}
                onImageInsert={handleImageInsert}
                maxImages={20}
              />
            </div>

            {/* Content Editor */}
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">المحتوى</h2>
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(false)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      !previewMode
                        ? 'bg-primary text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    تحرير
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(true)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      previewMode
                        ? 'bg-primary text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    معاينة
                  </button>
                </div>
              </div>

              {previewMode ? (
                <div className="min-h-[400px] p-4 bg-dark-background rounded-lg border border-gray-700">
                  <MarkdownPreview
                    content={formData.content}
                    articleImages={articleImages}
                  />
                </div>
              ) : (
                <MarkdownEditor
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  placeholder="اكتب محتوى المقال هنا باستخدام Markdown..."
                />
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 space-x-reverse">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ المقال'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
