'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface ImageItem {
  id: string;
  url: string;
  path: string;
  altText?: string;
  caption?: string;
  width?: number;
  height?: number;
  size?: number;
  createdAt: string;
}

interface ImageGalleryProps {
  articleId?: string;
  onImageSelect?: (image: ImageItem) => void;
  onImageDelete?: (image: ImageItem) => void;
  selectable?: boolean;
  deletable?: boolean;
  className?: string;
}

export function ImageGallery({
  articleId,
  onImageSelect,
  onImageDelete,
  selectable = false,
  deletable = false,
  className = ''
}: ImageGalleryProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // جلب الصور من قاعدة البيانات
  useEffect(() => {
    fetchImages();
  }, [articleId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('article_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (articleId) {
        query = query.eq('article_id', articleId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('خطأ في جلب الصور:', error);
        return;
      }

      const imageItems: ImageItem[] = data.map(item => ({
        id: item.id,
        url: item.image_url,
        path: item.image_path,
        altText: item.alt_text,
        caption: item.caption,
        width: item.width,
        height: item.height,
        size: item.file_size,
        createdAt: item.created_at
      }));

      setImages(imageItems);
    } catch (error) {
      console.error('خطأ في جلب الصور:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (image: ImageItem) => {
    if (selectable) {
      setSelectedImage(image.id);
      onImageSelect?.(image);
    }
  };

  const handleImageDelete = async (image: ImageItem) => {
    if (!deletable) return;

    if (confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      try {
        // حذف من قاعدة البيانات
        const { error: dbError } = await supabase
          .from('article_images')
          .delete()
          .eq('id', image.id);

        if (dbError) {
          console.error('خطأ في حذف الصورة من قاعدة البيانات:', dbError);
          alert('فشل في حذف الصورة');
          return;
        }

        // حذف من التخزين
        const { error: storageError } = await supabase.storage
          .from('article-images')
          .remove([image.path]);

        if (storageError) {
          console.error('خطأ في حذف الصورة من التخزين:', storageError);
        }

        // تحديث القائمة
        setImages(images.filter(img => img.id !== image.id));
        onImageDelete?.(image);

      } catch (error) {
        console.error('خطأ في حذف الصورة:', error);
        alert('حدث خطأ أثناء حذف الصورة');
      }
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'غير معروف';
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-dark-card rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-dark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">لا توجد صور</h3>
          <p className="text-dark-text-secondary">لم يتم رفع أي صور بعد</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* شريط الأدوات */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 space-x-reverse">
          <h3 className="text-lg font-medium text-white">
            معرض الصور ({images.length})
          </h3>
          
          {/* أزرار تغيير العرض */}
          <div className="flex bg-dark-card rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors duration-300 ${
                viewMode === 'grid' 
                  ? 'bg-primary text-white' 
                  : 'text-dark-text-secondary hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors duration-300 ${
                viewMode === 'list' 
                  ? 'bg-primary text-white' 
                  : 'text-dark-text-secondary hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <button
          onClick={fetchImages}
          className="text-primary hover:text-blue-400 transition-colors duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* عرض الصور */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                selectedImage === image.id 
                  ? 'border-primary shadow-lg shadow-primary/25' 
                  : 'border-transparent hover:border-gray-600'
              }`}
              onClick={() => handleImageSelect(image)}
            >
              <div className="relative w-full h-32 bg-dark-card">
                <Image
                  src={image.url}
                  alt={image.altText || 'صورة'}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* طبقة التحديد */}
                {selectable && selectedImage === image.id && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* زر الحذف */}
                {deletable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageDelete(image);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* معلومات الصورة */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xs truncate">{image.caption || 'بدون عنوان'}</p>
                <p className="text-xs text-gray-300">{formatFileSize(image.size)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {images.map((image) => (
            <div
              key={image.id}
              className={`flex items-center space-x-4 space-x-reverse p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                selectedImage === image.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-700 hover:border-gray-600 bg-dark-card'
              }`}
              onClick={() => handleImageSelect(image)}
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-dark-background flex-shrink-0">
                <Image
                  src={image.url}
                  alt={image.altText || 'صورة'}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">
                  {image.caption || 'بدون عنوان'}
                </h4>
                <p className="text-dark-text-secondary text-sm">
                  {image.width && image.height ? `${image.width} × ${image.height}` : 'أبعاد غير معروفة'} • {formatFileSize(image.size)}
                </p>
                <p className="text-dark-text-secondary text-xs">
                  {new Date(image.createdAt).toLocaleDateString('ar-EG')}
                </p>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                {selectable && selectedImage === image.id && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {deletable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageDelete(image);
                    }}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
