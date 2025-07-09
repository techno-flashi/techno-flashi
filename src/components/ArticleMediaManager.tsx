// مكون إدارة الوسائط المتكامل للمقالات
'use client';

import { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { YouTubeInput, YouTubeEmbed } from './YouTubeEmbed';
import { CodeEditor, CodeBlock } from './CodeEditor';

interface MediaItem {
  id: string;
  type: 'image' | 'youtube' | 'code';
  data: any;
}

interface ArticleMediaManagerProps {
  onMediaChange: (media: MediaItem[]) => void;
  initialMedia?: MediaItem[];
  className?: string;
}

export function ArticleMediaManager({ onMediaChange, initialMedia = [], className = "" }: ArticleMediaManagerProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMedia);
  const [activeTab, setActiveTab] = useState<'images' | 'videos' | 'code'>('images');

  const addMediaItem = (type: MediaItem['type'], data: any) => {
    const newItem: MediaItem = {
      id: Date.now().toString(),
      type,
      data
    };
    const updatedMedia = [...mediaItems, newItem];
    setMediaItems(updatedMedia);
    onMediaChange(updatedMedia);
  };

  const removeMediaItem = (id: string) => {
    const updatedMedia = mediaItems.filter(item => item.id !== id);
    setMediaItems(updatedMedia);
    onMediaChange(updatedMedia);
  };

  const moveMediaItem = (id: string, direction: 'up' | 'down') => {
    const currentIndex = mediaItems.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= mediaItems.length) return;

    const updatedMedia = [...mediaItems];
    [updatedMedia[currentIndex], updatedMedia[newIndex]] = [updatedMedia[newIndex], updatedMedia[currentIndex]];
    
    setMediaItems(updatedMedia);
    onMediaChange(updatedMedia);
  };

  const handleImagesUploaded = (imageUrls: string[]) => {
    imageUrls.forEach(url => {
      addMediaItem('image', { url, caption: '' });
    });
  };

  const handleVideoAdded = (url: string, title?: string) => {
    addMediaItem('youtube', { url, title: title || 'فيديو YouTube' });
  };

  const handleCodeAdded = (code: string, language: string, title?: string) => {
    addMediaItem('code', { code, language, title });
  };

  const getMediaItemsByType = (type: MediaItem['type']) => {
    return mediaItems.filter(item => item.type === type);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* عنوان القسم */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">إدارة الوسائط</h2>
        <span className="text-dark-text-secondary text-sm">
          {mediaItems.length} عنصر مضاف
        </span>
      </div>

      {/* التبويبات */}
      <div className="flex space-x-4 space-x-reverse border-b border-gray-700">
        <button
          onClick={() => setActiveTab('images')}
          className={`px-4 py-2 font-medium transition-colors duration-300 border-b-2 ${
            activeTab === 'images'
              ? 'text-primary border-primary'
              : 'text-dark-text-secondary border-transparent hover:text-white'
          }`}
        >
          الصور ({getMediaItemsByType('image').length})
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-4 py-2 font-medium transition-colors duration-300 border-b-2 ${
            activeTab === 'videos'
              ? 'text-primary border-primary'
              : 'text-dark-text-secondary border-transparent hover:text-white'
          }`}
        >
          الفيديوهات ({getMediaItemsByType('youtube').length})
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 font-medium transition-colors duration-300 border-b-2 ${
            activeTab === 'code'
              ? 'text-primary border-primary'
              : 'text-dark-text-secondary border-transparent hover:text-white'
          }`}
        >
          الأكواد ({getMediaItemsByType('code').length})
        </button>
      </div>

      {/* محتوى التبويبات */}
      <div className="space-y-6">
        {activeTab === 'images' && (
          <div className="space-y-6">
            <ImageUploader 
              onImagesUploaded={handleImagesUploaded}
              maxImages={10}
            />
            
            {getMediaItemsByType('image').length > 0 && (
              <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">الصور المضافة</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {getMediaItemsByType('image').map((item, index) => (
                    <div key={item.id} className="relative group">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden bg-dark-background">
                        <img
                          src={item.data.url}
                          alt={item.data.caption || `صورة ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* أزرار التحكم */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-1 space-x-reverse">
                        <button
                          onClick={() => moveMediaItem(item.id, 'up')}
                          disabled={index === 0}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded text-xs disabled:opacity-50"
                          title="تحريك لأعلى"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveMediaItem(item.id, 'down')}
                          disabled={index === getMediaItemsByType('image').length - 1}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded text-xs disabled:opacity-50"
                          title="تحريك لأسفل"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => removeMediaItem(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-1 rounded text-xs"
                          title="حذف"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="space-y-6">
            <YouTubeInput onVideoAdded={handleVideoAdded} />
            
            {getMediaItemsByType('youtube').length > 0 && (
              <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">الفيديوهات المضافة</h3>
                <div className="space-y-6">
                  {getMediaItemsByType('youtube').map((item, index) => (
                    <div key={item.id} className="relative">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <YouTubeEmbed url={item.data.url} title={item.data.title} />
                        
                        <div className="space-y-4">
                          <h4 className="text-white font-semibold">{item.data.title}</h4>
                          <p className="text-dark-text-secondary text-sm">{item.data.url}</p>
                          
                          <div className="flex space-x-3 space-x-reverse">
                            <button
                              onClick={() => moveMediaItem(item.id, 'up')}
                              disabled={index === 0}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                            >
                              ↑ أعلى
                            </button>
                            <button
                              onClick={() => moveMediaItem(item.id, 'down')}
                              disabled={index === getMediaItemsByType('youtube').length - 1}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                            >
                              ↓ أسفل
                            </button>
                            <button
                              onClick={() => removeMediaItem(item.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
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
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-6">
            <CodeEditor onCodeAdded={handleCodeAdded} />
            
            {getMediaItemsByType('code').length > 0 && (
              <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">الأكواد المضافة</h3>
                <div className="space-y-4">
                  {getMediaItemsByType('code').map((item, index) => (
                    <div key={item.id} className="relative">
                      <CodeBlock
                        code={item.data.code}
                        language={item.data.language}
                        title={item.data.title}
                        onRemove={() => removeMediaItem(item.id)}
                      />
                      
                      <div className="flex justify-center space-x-2 space-x-reverse mt-2">
                        <button
                          onClick={() => moveMediaItem(item.id, 'up')}
                          disabled={index === 0}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                        >
                          ↑ أعلى
                        </button>
                        <button
                          onClick={() => moveMediaItem(item.id, 'down')}
                          disabled={index === getMediaItemsByType('code').length - 1}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                        >
                          ↓ أسفل
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ملخص الوسائط */}
      {mediaItems.length > 0 && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <h4 className="text-green-400 font-semibold mb-2">ملخص الوسائط المضافة:</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{getMediaItemsByType('image').length}</div>
              <div className="text-dark-text-secondary">صورة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{getMediaItemsByType('youtube').length}</div>
              <div className="text-dark-text-secondary">فيديو</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{getMediaItemsByType('code').length}</div>
              <div className="text-dark-text-secondary">كود</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
