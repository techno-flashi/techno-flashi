'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { createUniqueFileName } from '@/utils/dateUtils';

interface SimpleImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
}

export default function SimpleImageUpload({ onImageUploaded }: SimpleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    console.log('معلومات الملف:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });

    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(`نوع الملف غير مدعوم: ${file.type}. يرجى اختيار صورة JPG, PNG, WebP أو GIF`);
      return;
    }

    // التحقق من حجم الملف (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الملف كبير جداً. الحد الأقصى 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // إنشاء اسم ملف فريد
      const fileName = createUniqueFileName(file.name, 'test-uploads');

      console.log('بدء رفع الملف:', fileName);
      console.log('نوع MIME:', file.type);
      setUploadProgress(25);

      // التأكد من أن الملف صالح
      if (file.size === 0) {
        throw new Error('الملف فارغ');
      }

      // رفع الصورة إلى Supabase Storage
      console.log('محاولة الرفع إلى Supabase...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('خطأ في الرفع:', uploadError);
        console.error('تفاصيل الخطأ:', JSON.stringify(uploadError, null, 2));
        throw new Error(`فشل في رفع الصورة: ${uploadError.message}`);
      }

      console.log('تم الرفع بنجاح:', uploadData);
      setUploadProgress(75);

      // الحصول على URL العام
      const { data: urlData } = supabase.storage
        .from('article-images')
        .getPublicUrl(fileName);

      if (!urlData.publicUrl) {
        throw new Error('فشل في الحصول على رابط الصورة');
      }

      console.log('رابط الصورة:', urlData.publicUrl);
      setUploadProgress(100);

      toast.success('تم رفع الصورة بنجاح');
      onImageUploaded(urlData.publicUrl);

    } catch (error) {
      console.error('خطأ في رفع الصورة:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      toast.error(`فشل في رفع الصورة: ${errorMessage}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileUpload(file);
            }
          }}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="text-4xl text-gray-400">📸</div>
          <div>
            <h3 className="text-lg font-medium text-white mb-2">رفع صورة تجريبية</h3>
            <p className="text-gray-400 text-sm mb-4">
              انقر لاختيار صورة للاختبار
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? 'جاري الرفع...' : 'اختيار صورة'}
            </button>
          </div>
          
          <div className="text-xs text-gray-500">
            الصيغ المدعومة: JPG, PNG, WebP, GIF (الحد الأقصى 5MB)
          </div>
        </div>
      </div>

      {/* شريط التقدم */}
      {isUploading && (
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>جاري الرفع...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
