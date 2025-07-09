// مكون رفع الصور من الجهاز
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadImage, ImageUploadResult } from '@/lib/imageService';

interface ImageUploaderProps {
  onImagesUploaded: (imageUrls: string[]) => void;
  onUploadResults?: (results: ImageUploadResult[]) => void;
  maxImages?: number;
  className?: string;
  folder?: string;
  compress?: boolean;
}

export function ImageUploader({
  onImagesUploaded,
  onUploadResults,
  maxImages = 10,
  className = "",
  folder = "articles",
  compress = true
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadResults, setUploadResults] = useState<ImageUploadResult[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    const imageUrls: string[] = [];
    const results: ImageUploadResult[] = [];

    try {
      const filesToProcess = Math.min(files.length, maxImages - uploadedImages.length);

      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i];

        // التحقق من نوع الملف
        if (!file.type.startsWith('image/')) {
          alert(`الملف ${file.name} ليس صورة صالحة`);
          continue;
        }

        // رفع الصورة إلى Supabase Storage
        const result = await uploadImage(file, folder, compress);
        results.push(result);

        if (result.success && result.url) {
          imageUrls.push(result.url);
        } else {
          alert(`فشل في رفع الصورة ${file.name}: ${result.error}`);
        }

        // تحديث شريط التقدم
        setUploadProgress(((i + 1) / filesToProcess) * 100);
      }

      const newImages = [...uploadedImages, ...imageUrls];
      const newResults = [...uploadResults, ...results];

      setUploadedImages(newImages);
      setUploadResults(newResults);
      onImagesUploaded(newImages);
      onUploadResults?.(results);

    } catch (error) {
      console.error('خطأ في رفع الصور:', error);
      alert('حدث خطأ أثناء رفع الصور. يرجى المحاولة مرة أخرى.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // إعادة تعيين input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newResults = uploadResults.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setUploadResults(newResults);
    onImagesUploaded(newImages);
    onUploadResults?.(newResults);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* منطقة رفع الصور */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
          dragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-600 hover:border-primary/50 hover:bg-primary/5'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <div>
            <p className="text-white font-medium mb-2">
              {uploading ? 'جاري رفع الصور...' : 'اسحب الصور هنا أو اضغط للاختيار'}
            </p>
            <p className="text-dark-text-secondary text-sm">
              يمكنك رفع حتى {maxImages} صور (PNG, JPG, WebP, GIF - حد أقصى 10MB لكل صورة)
            </p>
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* عرض الصور المرفوعة */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-white font-semibold">الصور المرفوعة ({uploadedImages.length})</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-dark-card">
                  <Image
                    src={imageUrl}
                    alt={`صورة ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                {/* زر الحذف */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors duration-300 opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
                
                {/* معلومات الصورة */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  صورة {index + 1}
                </div>
              </div>
            ))}
          </div>
          
          {/* أزرار الإجراءات */}
          <div className="flex space-x-3 space-x-reverse">
            <button
              onClick={openFileDialog}
              disabled={uploadedImages.length >= maxImages}
              className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              إضافة المزيد
            </button>
            
            <button
              onClick={() => {
                setUploadedImages([]);
                setUploadResults([]);
                onImagesUploaded([]);
                onUploadResults?.([]);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
            >
              حذف الكل
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
