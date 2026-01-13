// مكون تشغيل فيديوهات يوتيوب - محسن للأداء
'use client';

import { useState } from 'react';
import { YouTubeFacade, extractYouTubeId } from './YouTubeFacade';

interface YouTubeEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

export function YouTubeEmbed({ url, title = "فيديو يوتيوب", className = "" }: YouTubeEmbedProps) {
  const videoId = extractYouTubeId(url);

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

  return (
    <div className={className}>
      <YouTubeFacade
        videoId={videoId}
        title={title}
        className="mb-4"
      />
      
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
