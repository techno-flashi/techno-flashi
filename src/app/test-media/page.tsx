// صفحة تجريبية لاختبار رفع الصور وفيديوهات يوتيوب
'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { YouTubeInput, YouTubeEmbed } from '@/components/YouTubeEmbed';

export default function TestMediaPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<Array<{url: string, title: string}>>([]);

  const handleImagesUploaded = (imageUrls: string[]) => {
    setUploadedImages(imageUrls);
  };

  const handleVideoAdded = (url: string, title: string = 'فيديو يوتيوب') => {
    setYoutubeVideos(prev => [...prev, { url, title }]);
  };

  const removeVideo = (index: number) => {
    setYoutubeVideos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* رأس الصفحة */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            اختبار رفع الوسائط
          </h1>
          <p className="text-xl text-dark-text-secondary">
            اختبر رفع الصور وإضافة فيديوهات يوتيوب
          </p>
        </div>

        <div className="space-y-12">
          {/* قسم رفع الصور */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 border-r-4 border-primary pr-4">
              رفع الصور من الجهاز
            </h2>
            
            <ImageUploader 
              onImagesUploaded={handleImagesUploaded}
              maxImages={10}
            />
            
            {/* عرض الصور في معرض */}
            {uploadedImages.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">معاينة المعرض:</h3>
                <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uploadedImages.map((imageUrl, index) => (
                      <figure key={index} className="group">
                        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-dark-background">
                          <img
                            src={imageUrl}
                            alt={`صورة ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <figcaption className="text-center text-dark-text-secondary text-sm mt-2">
                          صورة {index + 1}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* قسم فيديوهات يوتيوب */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 border-r-4 border-primary pr-4">
              فيديوهات يوتيوب
            </h2>
            
            <YouTubeInput onVideoAdded={handleVideoAdded} />
            
            {/* عرض الفيديوهات المضافة */}
            {youtubeVideos.length > 0 && (
              <div className="mt-8 space-y-8">
                <h3 className="text-lg font-semibold text-white">الفيديوهات المضافة:</h3>
                
                {youtubeVideos.map((video, index) => (
                  <div key={index} className="relative">
                    <YouTubeEmbed url={video.url} title={video.title} />
                    
                    {/* زر الحذف */}
                    <button
                      onClick={() => removeVideo(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm transition-colors duration-300 z-10"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* قسم الأمثلة */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 border-r-4 border-primary pr-4">
              أمثلة جاهزة
            </h2>
            
            <div className="space-y-8">
              {/* مثال فيديو يوتيوب */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">مثال: فيديو تقني</h3>
                <YouTubeEmbed 
                  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                  title="مثال على فيديو تقني"
                />
              </div>
              
              {/* مثال معرض صور */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">مثال: معرض صور</h3>
                <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <figure key={num} className="group">
                        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-blue-600/20">
                          <img
                            src={`https://placehold.co/400x300/38BDF8/FFFFFF?text=صورة+${num}`}
                            alt={`صورة تجريبية ${num}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <figcaption className="text-center text-dark-text-secondary text-sm mt-2">
                          صورة تجريبية {num}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                  <p className="text-center text-dark-text-secondary text-sm mt-4 italic">
                    مثال على معرض صور متعددة
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* معلومات تقنية */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 border-r-4 border-primary pr-4">
              معلومات تقنية
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">رفع الصور</h3>
                <ul className="space-y-2 text-dark-text-secondary text-sm">
                  <li>• أنواع مدعومة: PNG, JPG, GIF, WebP</li>
                  <li>• حد أقصى: 5MB لكل صورة</li>
                  <li>• عدد الصور: حتى 10 صور</li>
                  <li>• السحب والإفلات مدعوم</li>
                  <li>• معاينة فورية</li>
                </ul>
              </div>
              
              <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">فيديوهات يوتيوب</h3>
                <ul className="space-y-2 text-dark-text-secondary text-sm">
                  <li>• دعم جميع روابط يوتيوب</li>
                  <li>• تشغيل مدمج في الصفحة</li>
                  <li>• صورة مصغرة تلقائية</li>
                  <li>• تحكم كامل في التشغيل</li>
                  <li>• رابط للمشاهدة على يوتيوب</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
