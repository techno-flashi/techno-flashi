'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { ImageGallery } from '@/components/ImageGallery';
import { ImageUploadResult } from '@/lib/imageService';

export default function TestUploadPage() {
  const [uploadResults, setUploadResults] = useState<ImageUploadResult[]>([]);
  const [refreshGallery, setRefreshGallery] = useState(0);

  const handleUploadComplete = (results: ImageUploadResult[]) => {
    console.log('Upload results:', results);
    setUploadResults(prev => [...prev, ...results]);
    setRefreshGallery(prev => prev + 1);
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-dark-background">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          اختبار نظام رفع الصور
        </h1>

        <div className="space-y-8">
          {/* رفع الصور */}
          <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-6">رفع الصور</h2>
            <ImageUploader
              onImagesUploaded={() => {}}
              onUploadResults={handleUploadComplete}
              maxImages={5}
              folder="test"

            />
          </div>

          {/* نتائج الرفع */}
          {uploadResults.length > 0 && (
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-semibold text-white mb-6">نتائج الرفع</h2>
              <div className="space-y-4">
                {uploadResults.map((result, index) => (
                  <div key={index} className="p-4 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {result.success ? '✅ تم الرفع بنجاح' : '❌ فشل الرفع'}
                        </p>
                        {result.url && (
                          <p className="text-dark-text-secondary text-sm mt-1">
                            <strong>الرابط:</strong> {result.url}
                          </p>
                        )}
                        {result.path && (
                          <p className="text-dark-text-secondary text-sm">
                            <strong>المسار:</strong> {result.path}
                          </p>
                        )}
                        {result.width && result.height && (
                          <p className="text-dark-text-secondary text-sm">
                            <strong>الأبعاد:</strong> {result.width} × {result.height}
                          </p>
                        )}
                        {result.size && (
                          <p className="text-dark-text-secondary text-sm">
                            <strong>الحجم:</strong> {Math.round(result.size / 1024)} كيلوبايت
                          </p>
                        )}
                        {result.error && (
                          <p className="text-red-400 text-sm mt-1">
                            <strong>الخطأ:</strong> {result.error}
                          </p>
                        )}
                      </div>
                      {result.url && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-dark-background ml-4">
                          <img
                            src={result.url}
                            alt="معاينة"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* معرض الصور */}
          <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-6">معرض الصور</h2>
            <ImageGallery
              key={refreshGallery}
              selectable={true}
              deletable={true}
              onImageSelect={(image) => console.log('Selected image:', image)}
              onImageDelete={(image) => {
                console.log('Deleted image:', image);
                setRefreshGallery(prev => prev + 1);
              }}
            />
          </div>

          {/* إحصائيات */}
          <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-6">الإحصائيات</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-dark-background rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">
                  {uploadResults.filter(r => r.success).length}
                </div>
                <div className="text-dark-text-secondary text-sm">صور تم رفعها بنجاح</div>
              </div>
              <div className="text-center p-4 bg-dark-background rounded-lg">
                <div className="text-2xl font-bold text-red-400 mb-2">
                  {uploadResults.filter(r => !r.success).length}
                </div>
                <div className="text-dark-text-secondary text-sm">صور فشل رفعها</div>
              </div>
              <div className="text-center p-4 bg-dark-background rounded-lg">
                <div className="text-2xl font-bold text-white mb-2">
                  {uploadResults.length}
                </div>
                <div className="text-dark-text-secondary text-sm">إجمالي المحاولات</div>
              </div>
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className="flex justify-center space-x-4 space-x-reverse">
            <button
              onClick={() => {
                setUploadResults([]);
                setRefreshGallery(prev => prev + 1);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              مسح النتائج
            </button>
            <button
              onClick={() => setRefreshGallery(prev => prev + 1)}
              className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              تحديث المعرض
            </button>
            <a
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              العودة للرئيسية
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
