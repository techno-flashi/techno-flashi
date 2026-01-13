'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { createUniqueFileName } from '@/utils/dateUtils';
import Image from 'next/image';

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

interface AdvancedImageManagerProps {
  articleId?: string;
  images: ImageData[];
  onImagesChange: (images: ImageData[]) => void;
  onImageInsert?: (imageReference: string, imageData: ImageData) => void;
  maxImages?: number;
  allowedTypes?: string[];
  content?: string;
  onContentChange?: (content: string) => void;
}

export default function AdvancedImageManager({
  articleId,
  images,
  onImagesChange,
  onImageInsert,
  maxImages = 20,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  content = '',
  onContentChange
}: AdvancedImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [draggedOverEditor, setDraggedOverEditor] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [showImageReferences, setShowImageReferences] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // إنشاء مرجع للصورة
  const generateImageReference = (index: number, imageData: ImageData) => {
    return `[صورة:${index + 1}]`;
  };

  // إدراج مرجع الصورة في النص (يدوياً فقط)
  const insertImageReference = (imageData: ImageData, index: number) => {
    const reference = generateImageReference(index, imageData);
    if (onImageInsert) {
      onImageInsert(reference, imageData);
    }

    // لا يتم إدراج تلقائي في المحتوى - يجب على المستخدم استخدام السحب والإفلات أو الأزرار
    // هذا يمنع الإضافة العشوائية للصور

    toast.success(`تم إنشاء مرجع الصورة: ${reference} - استخدم السحب والإفلات لوضعه في المكان المناسب`);
  };

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
        
        if (!allowedTypes.includes(file.type)) {
          toast.error(`نوع الملف ${file.type} غير مدعوم`);
          continue;
        }

        const fileName = createUniqueFileName(file.name);
        const filePath = `articles/${articleId || 'temp'}/${fileName}`;

        // تحديث التقدم
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        // رفع الملف
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('article-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error(`فشل رفع ${file.name}: ${uploadError.message}`);
          continue;
        }

        // الحصول على URL العام
        const { data: urlData } = supabase.storage
          .from('article-images')
          .getPublicUrl(filePath);

        // إنشاء بيانات الصورة
        const imageData: ImageData = {
          id: crypto.randomUUID(),
          image_url: urlData.publicUrl,
          image_path: filePath,
          alt_text: file.name.split('.')[0],
          caption: '',
          file_size: file.size,
          mime_type: file.type,
          display_order: images.length + newImages.length
        };

        // الحصول على أبعاد الصورة
        const img = new window.Image();
        img.onload = () => {
          imageData.width = img.width;
          imageData.height = img.height;
        };
        img.src = urlData.publicUrl;

        newImages.push(imageData);
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

        // حفظ في قاعدة البيانات إذا كان articleId متاحاً
        if (articleId) {
          const { error: dbError } = await supabase
            .from('article_images')
            .insert({
              article_id: articleId,
              image_url: urlData.publicUrl,
              image_path: filePath,
              alt_text: imageData.alt_text,
              caption: imageData.caption,
              file_size: imageData.file_size,
              mime_type: imageData.mime_type,
              width: imageData.width,
              height: imageData.height,
              display_order: imageData.display_order
            });

          if (dbError) {
            console.error('Database error:', dbError);
            toast.error(`فشل حفظ بيانات ${file.name} في قاعدة البيانات`);
          }
        }
      }

      // تحديث قائمة الصور
      const updatedImages = [...images, ...newImages];
      onImagesChange(updatedImages);
      
      toast.success(`تم رفع ${newImages.length} صورة بنجاح`);
      
    } catch (error: any) {
      console.error('Upload process error:', error);
      toast.error('حدث خطأ أثناء رفع الصور');
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  }, [images, articleId, maxImages, allowedTypes, onImagesChange]);

  // حذف صورة
  const handleDeleteImage = async (imageId: string) => {
    const imageToDelete = images.find(img => img.id === imageId);
    if (!imageToDelete) return;

    try {
      // حذف من التخزين
      const { error: storageError } = await supabase.storage
        .from('article-images')
        .remove([imageToDelete.image_path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      // حذف من قاعدة البيانات
      if (articleId) {
        const { error: dbError } = await supabase
          .from('article_images')
          .delete()
          .eq('id', imageId);

        if (dbError) {
          console.error('Database deletion error:', dbError);
        }
      }

      // تحديث قائمة الصور
      const updatedImages = images.filter(img => img.id !== imageId);
      onImagesChange(updatedImages);
      
      toast.success('تم حذف الصورة بنجاح');
      
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('فشل حذف الصورة');
    }
  };

  // إعادة ترتيب الصور
  const handleReorderImages = (fromIndex: number, toIndex: number) => {
    const reorderedImages = [...images];
    const [movedImage] = reorderedImages.splice(fromIndex, 1);
    reorderedImages.splice(toIndex, 0, movedImage);
    
    // تحديث display_order
    const updatedImages = reorderedImages.map((img, index) => ({
      ...img,
      display_order: index
    }));
    
    onImagesChange(updatedImages);
    toast.success('تم إعادة ترتيب الصور');
  };

  // معالج السحب والإفلات
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedImageIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedImageIndex !== null && draggedImageIndex !== dropIndex) {
      handleReorderImages(draggedImageIndex, dropIndex);
    }
    
    setDraggedImageIndex(null);
  };

  // تحديث تسمية الصورة
  const updateImageCaption = async (imageId: string, caption: string) => {
    const updatedImages = images.map(img => 
      img.id === imageId ? { ...img, caption } : img
    );
    onImagesChange(updatedImages);

    // تحديث في قاعدة البيانات
    if (articleId) {
      await supabase
        .from('article_images')
        .update({ caption })
        .eq('id', imageId);
    }
  };

  return (
    <div className="space-y-6">
      {/* شريط الأدوات */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || images.length >= maxImages}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? 'جاري الرفع...' : 'رفع صور'}
          </button>
          
          <span className="text-gray-400 text-sm">
            {images.length} / {maxImages} صورة
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowImageReferences(!showImageReferences)}
            className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition-colors"
          >
            {showImageReferences ? 'إخفاء المراجع' : 'عرض المراجع'}
          </button>
          
          {selectedImages.size > 0 && (
            <button
              onClick={() => {
                selectedImages.forEach(imageId => handleDeleteImage(imageId));
                setSelectedImages(new Set());
              }}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              حذف المحدد ({selectedImages.size})
            </button>
          )}
        </div>
      </div>

      {/* مدخل الملفات المخفي */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedTypes.join(',')}
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        className="hidden"
      />

      {/* قائمة الصور */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`relative group bg-gray-800 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              draggedImageIndex === index ? 'border-purple-500 opacity-50' : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            {/* رقم الصورة */}
            <div className="absolute top-2 left-2 z-10 bg-purple-600 text-white text-xs px-2 py-1 rounded">
              #{index + 1}
            </div>

            {/* خانة اختيار */}
            <div className="absolute top-2 right-2 z-10">
              <input
                type="checkbox"
                checked={selectedImages.has(image.id)}
                onChange={(e) => {
                  const newSelected = new Set(selectedImages);
                  if (e.target.checked) {
                    newSelected.add(image.id);
                  } else {
                    newSelected.delete(image.id);
                  }
                  setSelectedImages(newSelected);
                }}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
            </div>

            {/* الصورة */}
            <div className="relative aspect-video">
              <Image
                src={image.image_url}
                alt={image.alt_text || `صورة ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {/* معلومات الصورة */}
            <div className="p-3 space-y-2">
              <input
                type="text"
                value={image.caption || ''}
                onChange={(e) => updateImageCaption(image.id, e.target.value)}
                placeholder="إضافة تسمية توضيحية..."
                className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{image.file_size ? `${(image.file_size / 1024).toFixed(1)} KB` : ''}</span>
                <span>{image.width && image.height ? `${image.width}×${image.height}` : ''}</span>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => insertImageReference(image, index)}
                className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
                title={`إدراج مرجع [صورة:${index + 1}]`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                إدراج
              </button>

              <button
                onClick={() => handleDeleteImage(image.id)}
                className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                title="حذف الصورة"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                حذف
              </button>
            </div>

            {/* زر إدراج سريع */}
            <button
              onClick={() => insertImageReference(image, index)}
              className="absolute bottom-2 right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-purple-700"
              title={`إدراج [صورة:${index + 1}]`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>

            {/* مرجع الصورة */}
            {showImageReferences && (
              <div className="absolute bottom-0 left-0 right-0 bg-purple-600/90 text-white text-xs p-2 text-center">
                {generateImageReference(index, image)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* رسالة فارغة */}
      {images.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium mb-2">لا توجد صور مرفوعة</p>
          <p className="text-sm">اضغط على "رفع صور" لإضافة صور للمقال</p>
        </div>
      )}

      {/* شرح نظام المراجع */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">كيفية استخدام مراجع الصور:</h3>
        <ul className="text-blue-300 text-sm space-y-1">
          <li>• اضغط على "إدراج مرجع" لإضافة مرجع الصورة في النص</li>
          <li>• استخدم المراجع مثل [صورة:1] في أي مكان في النص</li>
          <li>• سيتم عرض الصورة المقابلة في المكان المحدد</li>
          <li>• يمكن إعادة ترتيب الصور بالسحب والإفلات</li>
        </ul>
      </div>
    </div>
  );
}
