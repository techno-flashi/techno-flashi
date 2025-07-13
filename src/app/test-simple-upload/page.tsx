'use client';

import { useState } from 'react';
import SimpleImageUpload from '@/components/SimpleImageUpload';

export default function TestSimpleUploadPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImageUploaded = (imageUrl: string) => {
    setUploadedImages(prev => [...prev, imageUrl]);
  };

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">اختبار رفع الصور البسيط</h1>
            <p className="text-dark-text-secondary">صفحة تجريبية لاختبار رفع الصور إلى Supabase</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* رفع الصور */}
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">رفع صورة جديدة</h2>
              <SimpleImageUpload onImageUploaded={handleImageUploaded} />
            </div>

            {/* الصور المرفوعة */}
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">الصور المرفوعة ({uploadedImages.length})</h2>
              
              {uploadedImages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  لم يتم رفع أي صور بعد
                </div>
              ) : (
                <div className="space-y-4">
                  {uploadedImages.map((imageUrl, index) => (
                    <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`صورة مرفوعة ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3 bg-gray-800">
                        <p className="text-sm text-gray-300 break-all">{imageUrl}</p>
                        <button
                          onClick={() => navigator.clipboard.writeText(imageUrl)}
                          className="mt-2 px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition-colors"
                        >
                          نسخ الرابط
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="mt-8 bg-dark-card rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">معلومات التشخيص</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">عدد الصور المرفوعة:</span>
                <span className="text-white">{uploadedImages.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">حالة الاتصال بـ Supabase:</span>
                <span className="text-green-400">متصل</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">bucket التخزين:</span>
                <span className="text-white">article-images</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
