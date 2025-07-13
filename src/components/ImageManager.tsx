'use client';

import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { createUniqueFileName } from '@/utils/dateUtils';

interface ImageData {
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
}

interface ImageManagerProps {
  articleId?: string;
  images: ImageData[];
  onImagesChange: (images: ImageData[]) => void;
  onImageInsert?: (imageUrl: string, caption?: string) => void;
  maxImages?: number;
  allowedTypes?: string[];
}

export default function ImageManager({
  articleId,
  images,
  onImagesChange,
  onImageInsert,
  maxImages = 20,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}: ImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // رفع الصور
  const handleFileUpload = useCallback(async (files: FileList) => {
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`يمكن رفع ${maxImages} صورة كحد أقصى`);
      return;
    }

    setIsUploading(true);
    const newImages: ImageData[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // التحقق من نوع الملف
        if (!allowedTypes.includes(file.type)) {
          toast.error(`نوع الملف ${file.type} غير مدعوم`);
          continue;
        }

        // التحقق من حجم الملف (5MB كحد أقصى)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`حجم الملف ${file.name} كبير جداً (الحد الأقصى 5MB)`);
          continue;
        }

        const fileId = `${Date.now()}-${i}`;
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        try {
          setUploadProgress(prev => ({ ...prev, [fileId]: 20 }));

          // ضغط الصورة إذا لزم الأمر
          const compressedFile = await compressImage(file);
          setUploadProgress(prev => ({ ...prev, [fileId]: 40 }));

          // إنشاء اسم ملف فريد
          const fileName = createUniqueFileName(file.name, `articles/${articleId || 'temp'}`);

          console.log('Uploading file:', fileName);
          setUploadProgress(prev => ({ ...prev, [fileId]: 60 }));

          // رفع الصورة إلى Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('article-images')
            .upload(fileName, compressedFile, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            throw new Error(`فشل في رفع الصورة: ${uploadError.message}`);
          }

          console.log('Upload successful:', uploadData);
          setUploadProgress(prev => ({ ...prev, [fileId]: 80 }));

          // الحصول على URL العام
          const { data: urlData } = supabase.storage
            .from('article-images')
            .getPublicUrl(fileName);

          if (!urlData.publicUrl) {
            throw new Error('فشل في الحصول على رابط الصورة');
          }

          // الحصول على أبعاد الصورة
          const dimensions = await getImageDimensions(compressedFile);
          setUploadProgress(prev => ({ ...prev, [fileId]: 90 }));

          const imageData: ImageData = {
            id: crypto.randomUUID(),
            image_url: urlData.publicUrl,
            image_path: fileName,
            alt_text: file.name.split('.')[0].replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, ''),
            caption: '',
            file_size: compressedFile.size,
            mime_type: compressedFile.type,
            width: dimensions.width,
            height: dimensions.height,
            display_order: images.length + newImages.length
          };

          newImages.push(imageData);
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
          console.log('Image processed successfully:', imageData);

        } catch (error) {
          console.error('Error uploading image:', error);
          const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
          toast.error(`فشل في رفع الصورة ${file.name}: ${errorMessage}`);
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }
      }

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages];
        onImagesChange(updatedImages);
        toast.success(`تم رفع ${newImages.length} صورة بنجاح`);
      }

    } catch (error) {
      console.error('Error in file upload:', error);
      toast.error('حدث خطأ أثناء رفع الصور');
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  }, [images, onImagesChange, articleId, maxImages, allowedTypes]);

  // ضغط الصورة
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      // إذا كان الملف صغير، لا نحتاج لضغطه
      if (file.size < 1024 * 1024) { // أقل من 1MB
        resolve(file);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // تحديد الأبعاد الجديدة (الحد الأقصى 1920px)
          const maxWidth = 1920;
          const maxHeight = 1080;
          let { width, height } = img;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;

          // رسم الصورة المضغوطة
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
          } else {
            throw new Error('فشل في إنشاء سياق الرسم');
          }

          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              console.warn('فشل في ضغط الصورة، سيتم استخدام الملف الأصلي');
              resolve(file);
            }
          }, file.type, 0.8);
        } catch (error) {
          console.error('خطأ في ضغط الصورة:', error);
          resolve(file); // استخدام الملف الأصلي في حالة الخطأ
        }
      };

      img.onerror = () => {
        console.error('فشل في تحميل الصورة للضغط');
        resolve(file); // استخدام الملف الأصلي في حالة الخطأ
      };

      try {
        img.src = URL.createObjectURL(file);
      } catch (error) {
        console.error('فشل في إنشاء URL للصورة:', error);
        resolve(file);
      }
    });
  };

  // الحصول على أبعاد الصورة
  const getImageDimensions = async (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(img.src); // تنظيف الذاكرة
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src); // تنظيف الذاكرة
        console.error('فشل في قراءة أبعاد الصورة');
        resolve({ width: 800, height: 600 }); // قيم افتراضية
      };

      try {
        img.src = URL.createObjectURL(file);
      } catch (error) {
        console.error('فشل في إنشاء URL للصورة:', error);
        resolve({ width: 800, height: 600 }); // قيم افتراضية
      }
    });
  };

  // حذف صورة
  const handleDeleteImage = async (index: number) => {
    const image = images[index];

    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      return;
    }

    try {
      // حذف من Storage أولاً
      if (image.image_path) {
        const { error: storageError } = await supabase.storage
          .from('article-images')
          .remove([image.image_path]);

        if (storageError) {
          console.error('Storage deletion error:', storageError);
          // لا نوقف العملية، قد تكون الصورة محذوفة مسبقاً
        }
      }

      // حذف من قاعدة البيانات إذا كان لها ID وarticleId موجود
      if (articleId && image.id) {
        const { error: dbError } = await supabase
          .from('article_images')
          .delete()
          .eq('id', image.id);

        if (dbError) {
          console.error('Database deletion error:', dbError);
          // لا نوقف العملية، قد تكون الصورة غير محفوظة في قاعدة البيانات بعد
        }
      }

      // تحديث القائمة المحلية
      const updatedImages = images.filter((_, i) => i !== index);
      onImagesChange(updatedImages);
      toast.success('تم حذف الصورة بنجاح');

    } catch (error) {
      console.error('Error deleting image:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      toast.error(`فشل في حذف الصورة: ${errorMessage}`);
    }
  };

  // السحب والإفلات لإعادة الترتيب
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const updatedImages = [...images];
    const draggedImage = updatedImages[draggedIndex];
    
    // إزالة العنصر المسحوب
    updatedImages.splice(draggedIndex, 1);
    
    // إدراج في الموقع الجديد
    updatedImages.splice(dropIndex, 0, draggedImage);
    
    // تحديث ترقيم العرض
    updatedImages.forEach((img, index) => {
      img.display_order = index;
    });

    onImagesChange(updatedImages);
    setDraggedIndex(null);
  };

  // تحديث تسمية الصورة
  const handleCaptionChange = (index: number, caption: string) => {
    const updatedImages = [...images];
    updatedImages[index].caption = caption;
    onImagesChange(updatedImages);
  };

  // تحديث النص البديل
  const handleAltTextChange = (index: number, altText: string) => {
    const updatedImages = [...images];
    updatedImages[index].alt_text = altText;
    onImagesChange(updatedImages);
  };

  // إدراج صورة في المحرر
  const handleInsertImage = (image: ImageData) => {
    if (onImageInsert) {
      onImageInsert(image.image_url, image.caption);
    }
  };

  return (
    <div className="space-y-6">
      {/* منطقة رفع الصور */}
      <div
        className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors"
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('border-primary', 'bg-primary/10');
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('border-primary', 'bg-primary/10');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('border-primary', 'bg-primary/10');
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            handleFileUpload(files);
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="text-4xl text-gray-400">📸</div>
          <div>
            <h3 className="text-lg font-medium text-white mb-2">رفع الصور</h3>
            <p className="text-gray-400 text-sm mb-4">
              اسحب الصور هنا أو انقر للاختيار (الحد الأقصى {maxImages} صورة)
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || images.length >= maxImages}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? 'جاري الرفع...' : 'اختيار الصور'}
            </button>
          </div>

          <div className="text-xs text-gray-500">
            الصيغ المدعومة: JPG, PNG, WebP, GIF (الحد الأقصى 5MB لكل صورة)
          </div>
        </div>
      </div>

      {/* شريط التقدم */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>جاري الرفع...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* قائمة الصور */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">الصور المرفوعة ({images.length})</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-primary transition-colors cursor-move"
              >
                {/* معاينة الصورة */}
                <div className="relative aspect-video bg-gray-900">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || 'صورة المقال'}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* أزرار التحكم */}
                  <div className="absolute top-2 right-2 flex space-x-2 space-x-reverse">
                    <button
                      type="button"
                      onClick={() => handleInsertImage(image)}
                      className="p-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                      title="إدراج في المحرر"
                    >
                      ➕
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      title="حذف الصورة"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  {/* رقم الترتيب */}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>

                {/* معلومات الصورة */}
                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      النص البديل
                    </label>
                    <input
                      type="text"
                      value={image.alt_text || ''}
                      onChange={(e) => handleAltTextChange(index, e.target.value)}
                      className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:ring-1 focus:ring-primary focus:border-transparent"
                      placeholder="وصف الصورة"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      التسمية التوضيحية
                    </label>
                    <input
                      type="text"
                      value={image.caption || ''}
                      onChange={(e) => handleCaptionChange(index, e.target.value)}
                      className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:ring-1 focus:ring-primary focus:border-transparent"
                      placeholder="تسمية توضيحية"
                    />
                  </div>
                  
                  {/* معلومات إضافية */}
                  <div className="text-xs text-gray-400 space-y-1">
                    {image.width && image.height && (
                      <div>الأبعاد: {image.width} × {image.height}</div>
                    )}
                    {image.file_size && (
                      <div>الحجم: {(image.file_size / 1024 / 1024).toFixed(2)} MB</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
