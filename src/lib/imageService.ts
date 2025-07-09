// خدمات إدارة الصور
import { supabase } from './supabase';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
  width?: number;
  height?: number;
  size?: number;
}

export interface ImageMetadata {
  width: number;
  height: number;
  size: number;
  type: string;
}

// ضغط الصورة قبل الرفع
export async function compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // حساب الأبعاد الجديدة مع الحفاظ على النسبة
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // رسم الصورة المضغوطة
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
}

// الحصول على معلومات الصورة
export async function getImageMetadata(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: file.size,
        type: file.type,
      });
    };
    img.onerror = () => reject(new Error('فشل في قراءة الصورة'));
    img.src = URL.createObjectURL(file);
  });
}

// رفع صورة إلى Supabase Storage
export async function uploadImage(
  file: File, 
  folder: string = 'articles',
  compress: boolean = true
): Promise<ImageUploadResult> {
  try {
    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'نوع الملف غير مدعوم. يرجى استخدام JPEG, PNG, WebP, أو GIF'
      };
    }

    // التحقق من حجم الملف (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'حجم الملف كبير جداً. الحد الأقصى 10MB'
      };
    }

    // ضغط الصورة إذا كان مطلوباً
    let processedFile = file;
    if (compress && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      processedFile = await compressImage(file);
    }

    // الحصول على معلومات الصورة
    const metadata = await getImageMetadata(processedFile);

    // إنشاء اسم فريد للملف
    const fileExt = processedFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // رفع الملف إلى Supabase Storage
    const { data, error } = await supabase.storage
      .from('article-images')
      .upload(filePath, processedFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('خطأ في رفع الصورة:', error);
      return {
        success: false,
        error: 'فشل في رفع الصورة: ' + error.message
      };
    }

    // الحصول على الرابط العام للصورة
    const { data: urlData } = supabase.storage
      .from('article-images')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath,
      width: metadata.width,
      height: metadata.height,
      size: processedFile.size
    };

  } catch (error) {
    console.error('خطأ في معالجة الصورة:', error);
    return {
      success: false,
      error: 'حدث خطأ أثناء معالجة الصورة'
    };
  }
}

// حذف صورة من Supabase Storage
export async function deleteImage(imagePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from('article-images')
      .remove([imagePath]);

    if (error) {
      console.error('خطأ في حذف الصورة:', error);
      return {
        success: false,
        error: 'فشل في حذف الصورة: ' + error.message
      };
    }

    return { success: true };
  } catch (error) {
    console.error('خطأ في حذف الصورة:', error);
    return {
      success: false,
      error: 'حدث خطأ أثناء حذف الصورة'
    };
  }
}

// رفع صور متعددة
export async function uploadMultipleImages(
  files: File[],
  folder: string = 'articles',
  onProgress?: (progress: number) => void
): Promise<ImageUploadResult[]> {
  const results: ImageUploadResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const result = await uploadImage(files[i], folder);
    results.push(result);
    
    if (onProgress) {
      onProgress(((i + 1) / files.length) * 100);
    }
  }
  
  return results;
}

// حفظ معلومات الصورة في قاعدة البيانات
export async function saveImageToDatabase(
  articleId: string,
  imageData: {
    url: string;
    path: string;
    altText?: string;
    caption?: string;
    width?: number;
    height?: number;
    size?: number;
    mimeType?: string;
    isFeatured?: boolean;
    displayOrder?: number;
  }
) {
  try {
    const { data, error } = await supabase
      .from('article_images')
      .insert({
        article_id: articleId,
        image_url: imageData.url,
        image_path: imageData.path,
        alt_text: imageData.altText,
        caption: imageData.caption,
        width: imageData.width,
        height: imageData.height,
        file_size: imageData.size,
        mime_type: imageData.mimeType,
        is_featured: imageData.isFeatured || false,
        display_order: imageData.displayOrder || 0
      })
      .select()
      .single();

    if (error) {
      console.error('خطأ في حفظ معلومات الصورة:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('خطأ في حفظ معلومات الصورة:', error);
    return { success: false, error: 'حدث خطأ أثناء حفظ معلومات الصورة' };
  }
}
