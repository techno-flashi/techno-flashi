// مكون تشغيل فيديوهات يوتيوب
'use client';

import { useState } from 'react';

interface YouTubeEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

export function YouTubeEmbed({ url, title = "فيديو يوتيوب", className = "" }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // استخراج معرف الفيديو من رابط يوتيوب
  const getVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const videoId = getVideoId(url);

  if (!videoId) {
    return (
      <div className={`bg-red-900/20 border border-red-500/30 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <div className="text-red-400 text-xl mr-3">⚠️</div>
          <div>
            <h4 className="text-red-400 font-semibold mb-1">رابط يوتيوب غير صحيح</h4>
            <p className="text-dark-text-secondary text-sm">
              تأكد من أن الرابط من يوتيوب وبالصيغة الصحيحة
            </p>
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden bg-dark-card">
        {!isLoaded ? (
          // صورة مصغرة مع زر التشغيل
          <div 
            className="absolute inset-0 cursor-pointer group"
            onClick={() => setIsLoaded(true)}
          >
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // في حالة فشل تحميل الصورة المصغرة، استخدم صورة افتراضية
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            
            {/* طبقة تراكب مع زر التشغيل */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors duration-300">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-all duration-300 transform group-hover:scale-110">
                <svg className="w-8 h-8 text-white mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            
            {/* شعار يوتيوب */}
            <div className="absolute bottom-4 right-4">
              <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                YouTube
              </div>
            </div>
            
            {/* عنوان الفيديو */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 className="text-white font-semibold text-sm line-clamp-2">
                {title}
              </h3>
            </div>
          </div>
        ) : (
          // مشغل الفيديو الفعلي
          <iframe
            src={`${embedUrl}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      
      {/* معلومات إضافية */}
      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="flex items-center text-dark-text-secondary">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          فيديو من يوتيوب
        </div>
        
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-blue-400 transition-colors duration-300 flex items-center"
        >
          مشاهدة على يوتيوب
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}

// مكون مساعد لإدراج فيديو يوتيوب من رابط
interface YouTubeInputProps {
  onVideoAdded: (url: string, title?: string) => void;
  className?: string;
}

export function YouTubeInput({ onVideoAdded, className = "" }: YouTubeInputProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);

  const validateUrl = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];

    return patterns.some(pattern => pattern.test(url));
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setIsValidUrl(validateUrl(newUrl));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidUrl) {
      onVideoAdded(url, title || 'فيديو يوتيوب');
      setUrl('');
      setTitle('');
      setIsValidUrl(false);
    }
  };

  return (
    <div className={`bg-dark-card rounded-lg p-6 border border-gray-700 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        إضافة فيديو يوتيوب
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            رابط الفيديو *
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className={`w-full px-3 py-2 bg-dark-background border rounded-md text-white focus:outline-none focus:ring-2 transition-colors duration-300 ${
              url && !isValidUrl 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-600 focus:ring-primary'
            }`}
          />
          {url && !isValidUrl && (
            <p className="text-red-400 text-xs mt-1">رابط يوتيوب غير صحيح</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            عنوان الفيديو (اختياري)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان وصفي للفيديو"
            className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
          />
        </div>
        
        <button
          type="submit"
          disabled={!isValidUrl}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          إضافة الفيديو
        </button>
      </form>
    </div>
  );
}
