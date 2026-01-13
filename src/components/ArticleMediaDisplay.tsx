// مكون عرض الوسائط المحفوظة في قاعدة البيانات
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { YouTubeEmbed } from './YouTubeEmbed';
import { CodeBlock } from './CodeEditor';
import Image from 'next/image';

interface MediaItem {
  id: string;
  media_type: 'image' | 'youtube' | 'code' | 'gallery';
  media_data: any;
  display_order: number;
}

interface ArticleMediaDisplayProps {
  articleId: string;
  className?: string;
}

export function ArticleMediaDisplay({ articleId, className = "" }: ArticleMediaDisplayProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMediaItems();
  }, [articleId]);

  const fetchMediaItems = async () => {
    try {
      const { data, error } = await supabase
        .from('article_media')
        .select('*')
        .eq('article_id', articleId)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching media:', error);
        return;
      }

      setMediaItems(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-dark-card rounded-lg p-6 border border-gray-700 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return null;
  }

  const renderMediaItem = (item: MediaItem) => {
    switch (item.media_type) {
      case 'image':
        return (
          <div key={item.id} className="mb-8">
            <div className="relative w-full rounded-lg overflow-hidden bg-dark-card">
              <Image
                src={item.media_data.url || "https://placehold.co/800x400/38BDF8/FFFFFF?text=صورة"}
                alt={item.media_data.caption || 'صورة المقال'}
                width={800}
                height={400}
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
            </div>
            {item.media_data.caption && (
              <p className="text-center text-dark-text-secondary text-sm mt-2 italic">
                {item.media_data.caption}
              </p>
            )}
          </div>
        );

      case 'gallery':
        return (
          <div key={item.id} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {item.media_data.images?.map((image: any, imgIndex: number) => (
                <figure key={imgIndex} className="group">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-dark-card">
                    <Image
                      src={image.url || "https://placehold.co/400x300/38BDF8/FFFFFF?text=صورة"}
                      alt={image.caption || `صورة ${imgIndex + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  {image.caption && (
                    <figcaption className="text-center text-dark-text-secondary text-xs mt-1">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
            {item.media_data.caption && (
              <p className="text-center text-dark-text-secondary text-sm mt-4 italic">
                {item.media_data.caption}
              </p>
            )}
          </div>
        );

      case 'youtube':
        return (
          <div key={item.id} className="mb-8">
            <YouTubeEmbed 
              url={item.media_data.url} 
              title={item.media_data.title || 'فيديو يوتيوب'}
            />
            {item.media_data.caption && (
              <p className="text-center text-dark-text-secondary text-sm mt-2 italic">
                {item.media_data.caption}
              </p>
            )}
          </div>
        );

      case 'code':
        return (
          <div key={item.id} className="mb-8">
            <CodeBlock
              code={item.media_data.code}
              language={item.media_data.language}
              title={item.media_data.title}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          الوسائط المرفقة ({mediaItems.length})
        </h3>
        
        <div className="space-y-6">
          {mediaItems.map(renderMediaItem)}
        </div>
      </div>
    </div>
  );
}

// مكون مبسط لعرض إحصائيات الوسائط
interface MediaStatsProps {
  articleId: string;
}

export function MediaStats({ articleId }: MediaStatsProps) {
  const [stats, setStats] = useState({
    images: 0,
    videos: 0,
    codes: 0,
    total: 0
  });

  useEffect(() => {
    fetchStats();
  }, [articleId]);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('article_media')
        .select('media_type')
        .eq('article_id', articleId);

      if (error) {
        console.error('Error fetching media stats:', error);
        return;
      }

      const mediaTypes = data || [];
      const newStats = {
        images: mediaTypes.filter(item => item.media_type === 'image' || item.media_type === 'gallery').length,
        videos: mediaTypes.filter(item => item.media_type === 'youtube').length,
        codes: mediaTypes.filter(item => item.media_type === 'code').length,
        total: mediaTypes.length
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching media stats:', error);
    }
  };

  if (stats.total === 0) {
    return null;
  }

  return (
    <div className="bg-dark-card rounded-lg p-4 border border-gray-700">
      <h4 className="text-white font-semibold mb-3 text-sm">إحصائيات الوسائط:</h4>
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">{stats.images}</div>
          <div className="text-dark-text-secondary">صور</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-400">{stats.videos}</div>
          <div className="text-dark-text-secondary">فيديو</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{stats.codes}</div>
          <div className="text-dark-text-secondary">كود</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-primary">{stats.total}</div>
          <div className="text-dark-text-secondary">المجموع</div>
        </div>
      </div>
    </div>
  );
}
