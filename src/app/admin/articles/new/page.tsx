// صفحة إنشاء مقال جديد متكاملة
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArticleMediaManager } from '@/components/ArticleMediaManager';
import { ArticleContent } from '@/components/ArticleContent';
import { ImageUploader } from '@/components/ImageUploader';
import { ImageGallery } from '@/components/ImageGallery';
import { ImageUploadResult, saveImageToDatabase } from '@/lib/imageService';
import Link from 'next/link';

interface MediaItem {
  id: string;
  type: 'image' | 'youtube' | 'code';
  data: any;
}

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'images' | 'media' | 'preview'>('edit');
  
  // بيانات المقال الأساسية
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    status: 'draft' as 'draft' | 'published',
    tags: [] as string[],
    author: 'TechnoFlash',
    meta_description: ''
  });

  // الوسائط المضافة
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  // الصور المرفوعة
  const [uploadedImages, setUploadedImages] = useState<ImageUploadResult[]>([]);
  const [featuredImageUploading, setFeaturedImageUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // إنشاء slug تلقائي من العنوان
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  // معالجة رفع الصورة المميزة
  const handleFeaturedImageUpload = async (results: ImageUploadResult[]) => {
    if (results.length > 0 && results[0].success && results[0].url) {
      setFormData(prev => ({
        ...prev,
        featured_image_url: results[0].url || ''
      }));
    }
  };

  // معالجة رفع الصور الإضافية
  const handleAdditionalImagesUpload = async (results: ImageUploadResult[]) => {
    const successfulUploads = results.filter(result => result.success);
    setUploadedImages(prev => [...prev, ...successfulUploads]);

    // إضافة الصور إلى قائمة الوسائط
    successfulUploads.forEach(result => {
      if (result.url) {
        const mediaItem: MediaItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          type: 'image',
          data: {
            url: result.url,
            caption: '',
            width: result.width,
            height: result.height
          }
        };
        setMediaItems(prev => [...prev, mediaItem]);
      }
    });
  };

  const generateArticleContent = () => {
    const blocks: any[] = [];

    // إضافة محتوى النص الأساسي
    if (formData.content) {
      const paragraphs = formData.content.split('\n\n');
      paragraphs.forEach(paragraph => {
        if (paragraph.trim()) {
          blocks.push({
            type: 'paragraph',
            data: { text: paragraph.trim() }
          });
        }
      });
    }

    // إضافة الوسائط
    mediaItems.forEach(item => {
      switch (item.type) {
        case 'image':
          blocks.push({
            type: 'image',
            data: {
              url: item.data.url,
              caption: item.data.caption || ''
            }
          });
          break;
        
        case 'youtube':
          blocks.push({
            type: 'youtube',
            data: {
              url: item.data.url,
              caption: item.data.title || 'فيديو يوتيوب'
            }
          });
          break;
        
        case 'code':
          blocks.push({
            type: 'code',
            data: {
              code: item.data.code,
              language: item.data.language,
              title: item.data.title
            }
          });
          break;
      }
    });

    return {
      blocks,
      version: '2.28.0',
      time: Date.now()
    };
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!formData.title.trim()) {
      alert('يرجى إدخال عنوان المقال');
      return;
    }

    setLoading(true);

    try {
      const articleContent = generateArticleContent();
      
      // حساب وقت القراءة التلقائي
      const wordCount = formData.content.split(' ').filter(word => word.length > 0).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));

      const articleData = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        excerpt: formData.excerpt,
        content: articleContent,
        featured_image_url: formData.featured_image_url,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: formData.tags,
        reading_time: readingTime,
        author: formData.author,
        meta_description: formData.meta_description || formData.excerpt
      };

      const { data: insertedArticle, error } = await supabase
        .from('articles')
        .insert([articleData])
        .select()
        .single();

      if (error) {
        console.error('Error creating article:', error);
        alert('حدث خطأ أثناء حفظ المقال');
        return;
      }

      // حفظ الصور في جدول article_images
      if (uploadedImages.length > 0 && insertedArticle) {
        for (let i = 0; i < uploadedImages.length; i++) {
          const image = uploadedImages[i];
          if (image.success && image.url && image.path) {
            await saveImageToDatabase(insertedArticle.id, {
              url: image.url,
              path: image.path,
              width: image.width,
              height: image.height,
              size: image.size,
              mimeType: 'image/jpeg', // يمكن تحسين هذا لاحقاً
              isFeatured: image.url === formData.featured_image_url,
              displayOrder: i
            });
          }
        }
      }

      // حفظ الوسائط في جدول منفصل
      if (mediaItems.length > 0 && insertedArticle) {
        const mediaData = mediaItems.map((item, index) => ({
          article_id: insertedArticle.id,
          media_type: item.type,
          media_data: item.data,
          display_order: index
        }));

        const { error: mediaError } = await supabase
          .from('article_media')
          .insert(mediaData);

        if (mediaError) {
          console.error('Error saving media:', mediaError);
          // لا نوقف العملية، فقط نسجل الخطأ
        }
      }

      alert(status === 'published' ? 'تم نشر المقال بنجاح!' : 'تم حفظ المقال كمسودة!');
      router.push('/admin/articles');
    } catch (error) {
      console.error('Error creating article:', error);
      alert('حدث خطأ أثناء حفظ المقال');
    } finally {
      setLoading(false);
    }
  };

  const previewContent = generateArticleContent();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">إنشاء مقال جديد</h1>
          <p className="text-dark-text-secondary mt-1">
            أنشئ مقال جديد مع الصور والفيديوهات والأكواد البرمجية
          </p>
        </div>
        <Link
          href="/admin/articles"
          className="text-dark-text-secondary hover:text-white transition-colors duration-300"
        >
          ← العودة للمقالات
        </Link>
      </div>

      {/* التبويبات الرئيسية */}
      <div className="flex space-x-4 space-x-reverse border-b border-gray-700">
        <button
          onClick={() => setActiveTab('edit')}
          className={`px-6 py-3 font-medium transition-colors duration-300 border-b-2 ${
            activeTab === 'edit'
              ? 'text-primary border-primary'
              : 'text-dark-text-secondary border-transparent hover:text-white'
          }`}
        >
          تحرير المقال
        </button>
        <button
          onClick={() => setActiveTab('images')}
          className={`px-6 py-3 font-medium transition-colors duration-300 border-b-2 ${
            activeTab === 'images'
              ? 'text-primary border-primary'
              : 'text-dark-text-secondary border-transparent hover:text-white'
          }`}
        >
          الصور ({uploadedImages.length})
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`px-6 py-3 font-medium transition-colors duration-300 border-b-2 ${
            activeTab === 'media'
              ? 'text-primary border-primary'
              : 'text-dark-text-secondary border-transparent hover:text-white'
          }`}
        >
          الوسائط ({mediaItems.length})
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-6 py-3 font-medium transition-colors duration-300 border-b-2 ${
            activeTab === 'preview'
              ? 'text-primary border-primary'
              : 'text-dark-text-secondary border-transparent hover:text-white'
          }`}
        >
          معاينة
        </button>
      </div>

      {/* محتوى التبويبات */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* المحتوى الرئيسي */}
        <div className="lg:col-span-3">
          {activeTab === 'edit' && (
            <div className="space-y-6">
              {/* معلومات المقال الأساسية */}
              <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-6">معلومات المقال</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      عنوان المقال *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="أدخل عنوان المقال"
                      className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      الرابط (Slug)
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="article-slug"
                      className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-dark-text-secondary mt-1">
                      سيتم إنشاؤه تلقائياً من العنوان
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      الملخص
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="ملخص مختصر عن المقال"
                      className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      الصورة المميزة
                    </label>
                    {formData.featured_image_url ? (
                      <div className="space-y-3">
                        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-dark-background">
                          <img
                            src={formData.featured_image_url}
                            alt="الصورة المميزة"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, featured_image_url: '' }))}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-300"
                          >
                            ×
                          </button>
                        </div>
                        <input
                          type="url"
                          name="featured_image_url"
                          value={formData.featured_image_url}
                          onChange={handleInputChange}
                          placeholder="أو أدخل رابط الصورة يدوياً"
                          className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <ImageUploader
                          onImagesUploaded={(urls) => {
                            if (urls.length > 0) {
                              setFormData(prev => ({ ...prev, featured_image_url: urls[0] }));
                            }
                          }}
                          onUploadResults={handleFeaturedImageUpload}
                          maxImages={1}
                          folder="featured"
                          className="border border-gray-600 rounded-lg"
                        />
                        <div className="text-center text-dark-text-secondary text-sm">أو</div>
                        <input
                          type="url"
                          name="featured_image_url"
                          value={formData.featured_image_url}
                          onChange={handleInputChange}
                          placeholder="أدخل رابط الصورة يدوياً"
                          className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        الكاتب
                      </label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        placeholder="اسم الكاتب"
                        className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        الكلمات المفتاحية (مفصولة بفواصل)
                      </label>
                      <input
                        type="text"
                        value={formData.tags.join(', ')}
                        onChange={(e) => {
                          const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                          setFormData(prev => ({ ...prev, tags }));
                        }}
                        placeholder="الذكاء الاصطناعي, برمجة, تقنية"
                        className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      وصف SEO (اختياري)
                    </label>
                    <textarea
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="وصف مختصر للمقال لمحركات البحث (160 حرف كحد أقصى)"
                      maxLength={160}
                      className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-dark-text-secondary mt-1">
                      {formData.meta_description.length}/160 حرف
                    </p>
                  </div>
                </div>
              </div>

              {/* محتوى المقال */}
              <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-6">محتوى المقال</h2>
                
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={15}
                  placeholder="اكتب محتوى المقال هنا... يمكنك إضافة الصور والفيديوهات والأكواد من تبويب الوسائط"
                  className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                />
                
                <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-400 text-sm">
                    💡 نصيحة: اكتب النص الأساسي هنا، ثم أضف الصور والفيديوهات والأكواد من تبويب "الوسائط"
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-6">
              {/* رفع الصور */}
              <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-6">رفع الصور</h2>
                <ImageUploader
                  onImagesUploaded={() => {}}
                  onUploadResults={handleAdditionalImagesUpload}
                  maxImages={10}
                  folder="articles"
                  className=""
                />
              </div>

              {/* معرض الصور المرفوعة */}
              {uploadedImages.length > 0 && (
                <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold text-white mb-6">الصور المرفوعة</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-dark-background">
                          {image.url && (
                            <img
                              src={image.url}
                              alt={`صورة ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          )}

                          {/* معلومات الصورة */}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-xs">
                              {image.width && image.height ? `${image.width} × ${image.height}` : 'أبعاد غير معروفة'}
                            </p>
                            <p className="text-xs">
                              {image.size ? `${Math.round(image.size / 1024)} كيلوبايت` : 'حجم غير معروف'}
                            </p>
                          </div>

                          {/* زر تعيين كصورة مميزة */}
                          <button
                            onClick={() => {
                              if (image.url) {
                                setFormData(prev => ({ ...prev, featured_image_url: image.url! }));
                              }
                            }}
                            className="absolute top-2 left-2 px-2 py-1 bg-primary hover:bg-blue-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            صورة مميزة
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <ArticleMediaManager
              onMediaChange={setMediaItems}
              initialMedia={mediaItems}
            />
          )}

          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-6">معاينة المقال</h2>
                
                {formData.title && (
                  <h1 className="text-3xl font-bold text-white mb-4">{formData.title}</h1>
                )}
                
                {formData.excerpt && (
                  <p className="text-dark-text-secondary mb-6 text-lg">{formData.excerpt}</p>
                )}
                
                {formData.featured_image_url && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
                    <img
                      src={formData.featured_image_url}
                      alt={formData.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <ArticleContent content={previewContent} />
              </div>
            </div>
          )}
        </div>

        {/* الشريط الجانبي */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* إعدادات النشر */}
            <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">إعدادات النشر</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    حالة المقال
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="draft">مسودة</option>
                    <option value="published">منشور</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleSubmit('draft')}
                    disabled={loading}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50"
                  >
                    {loading ? 'جاري الحفظ...' : 'حفظ كمسودة'}
                  </button>

                  <button
                    onClick={() => handleSubmit('published')}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50"
                  >
                    {loading ? 'جاري النشر...' : 'نشر المقال'}
                  </button>
                </div>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">إحصائيات</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-text-secondary">عدد الكلمات:</span>
                  <span className="text-white">{formData.content.split(' ').filter(word => word.length > 0).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text-secondary">عدد الأحرف:</span>
                  <span className="text-white">{formData.content.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text-secondary">الوسائط:</span>
                  <span className="text-white">{mediaItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text-secondary">وقت القراءة:</span>
                  <span className="text-white">{Math.max(1, Math.ceil(formData.content.split(' ').length / 200))} دقيقة</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text-secondary">الكلمات المفتاحية:</span>
                  <span className="text-white">{formData.tags.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text-secondary">الكاتب:</span>
                  <span className="text-white">{formData.author}</span>
                </div>
              </div>
            </div>

            {/* نصائح */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-400 font-semibold mb-2">نصائح للكتابة:</h4>
              <ul className="text-yellow-200 text-xs space-y-1">
                <li>• استخدم عناوين واضحة ومفيدة</li>
                <li>• أضف صور توضيحية للمحتوى</li>
                <li>• استخدم أكواد برمجية عند الحاجة</li>
                <li>• اكتب ملخص جذاب للمقال</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
