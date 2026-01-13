// صفحة إدارة الوسائط في لوحة التحكم
'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { YouTubeInput, YouTubeEmbed } from '@/components/YouTubeEmbed';

export default function MediaManagementPage() {
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ الرابط!');
  };

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">إدارة الوسائط</h1>
          <p className="text-dark-text-secondary mt-1">
            رفع الصور وإدارة فيديوهات يوتيوب للمقالات
          </p>
        </div>
      </div>

      {/* التبويبات */}
      <div className="flex space-x-4 space-x-reverse border-b border-gray-700">
        <button
          onClick={() => setActiveTab('images')}
          className={`px-6 py-3 font-medium transition-colors duration-300 border-b-2 ${
            activeTab === 'images'
              ? 'text-primary border-primary'
              : 'text-dark-text-secondary border-transparent hover:text-white'
          }`}
        >
          الصور
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-6 py-3 font-medium transition-colors duration-300 border-b-2 ${
            activeTab === 'videos'
              ? 'text-primary border-primary'
              : 'text-dark-text-secondary border-transparent hover:text-white'
          }`}
        >
          فيديوهات يوتيوب
        </button>
      </div>

      {/* محتوى التبويبات */}
      <div className="mt-6">
        {activeTab === 'images' && (
          <div className="space-y-8">
            {/* رفع الصور */}
            <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">رفع صور جديدة</h2>
              <ImageUploader 
                onImagesUploaded={handleImagesUploaded}
                maxImages={20}
              />
            </div>

            {/* مكتبة الصور */}
            {uploadedImages.length > 0 && (
              <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-6">مكتبة الصور</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedImages.map((imageUrl, index) => (
                    <div key={index} className="group relative">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden bg-dark-background">
                        <img
                          src={imageUrl}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* أزرار الإجراءات */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => copyToClipboard(imageUrl)}
                          className="bg-primary hover:bg-blue-600 text-white p-2 rounded-lg text-xs transition-colors duration-300"
                          title="نسخ الرابط"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => window.open(imageUrl, '_blank')}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg text-xs transition-colors duration-300"
                          title="عرض"
                        >
                          👁️
                        </button>
                      </div>
                      
                      <p className="text-xs text-dark-text-secondary mt-2 text-center">
                        صورة {index + 1}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* نصائح للصور */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-blue-400 font-semibold mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                نصائح لرفع الصور
              </h3>
              <ul className="space-y-2 text-dark-text text-sm">
                <li>• استخدم صور عالية الجودة (1200x800 بكسل أو أكثر)</li>
                <li>• تأكد من أن حجم الصورة أقل من 5MB</li>
                <li>• استخدم أسماء وصفية للصور</li>
                <li>• فضل صيغ PNG للصور مع خلفية شفافة</li>
                <li>• استخدم JPG للصور الفوتوغرافية</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="space-y-8">
            {/* إضافة فيديو يوتيوب */}
            <YouTubeInput onVideoAdded={handleVideoAdded} />

            {/* مكتبة الفيديوهات */}
            {youtubeVideos.length > 0 && (
              <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-6">مكتبة الفيديوهات</h2>
                <div className="space-y-6">
                  {youtubeVideos.map((video, index) => (
                    <div key={index} className="relative">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <YouTubeEmbed url={video.url} title={video.title} />
                        
                        <div className="space-y-4">
                          <h3 className="text-white font-semibold">{video.title}</h3>
                          <p className="text-dark-text-secondary text-sm">{video.url}</p>
                          
                          <div className="flex space-x-3 space-x-reverse">
                            <button
                              onClick={() => copyToClipboard(video.url)}
                              className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300"
                            >
                              نسخ الرابط
                            </button>
                            <button
                              onClick={() => removeVideo(index)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* نصائح للفيديوهات */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-red-400 font-semibold mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                نصائح لفيديوهات يوتيوب
              </h3>
              <ul className="space-y-2 text-dark-text text-sm">
                <li>• تأكد من أن الفيديو متاح للعرض العام</li>
                <li>• استخدم عناوين وصفية للفيديوهات</li>
                <li>• تجنب الفيديوهات الطويلة جداً (أكثر من 30 دقيقة)</li>
                <li>• تأكد من جودة الصوت والصورة</li>
                <li>• أضف وصف مناسب للفيديو</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
