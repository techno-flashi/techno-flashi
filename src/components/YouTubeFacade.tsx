'use client';

import { useState } from 'react';

interface YouTubeFacadeProps {
  videoId: string;
  title?: string;
  className?: string;
  autoplay?: boolean;
}

/**
 * YouTube Facade Component - Optimized for Performance
 * Reduces JavaScript load by showing thumbnail until user clicks
 * Prevents CLS with fixed dimensions
 */
export function YouTubeFacade({ 
  videoId, 
  title = "فيديو يوتيوب", 
  className = "",
  autoplay = false 
}: YouTubeFacadeProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`;

  const handlePlay = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      className={`relative w-full bg-black rounded-lg overflow-hidden ${className}`}
      style={{ 
        aspectRatio: '16/9', 
        minHeight: '315px',
        maxWidth: '100%'
      }}
    >
      {!isLoaded ? (
        // Thumbnail with play button (Facade)
        <div 
          className="absolute inset-0 cursor-pointer group bg-black flex items-center justify-center"
          onClick={handlePlay}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handlePlay();
            }
          }}
          aria-label={`تشغيل فيديو: ${title}`}
        >
          {/* Background thumbnail */}
          <img
            src={thumbnailUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              // Fallback to standard quality thumbnail
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
            loading="lazy"
            decoding="async"
          />
          
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
          
          {/* Play button */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 group-hover:scale-110 transition-all duration-300 shadow-2xl">
              <svg 
                className="w-8 h-8 text-white ml-1" 
                fill="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          
          {/* YouTube logo */}
          <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
            YouTube
          </div>
          
          {/* Video title */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-white font-semibold text-sm line-clamp-2">
              {title}
            </h3>
          </div>
        </div>
      ) : (
        // Actual YouTube iframe
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          width="560"
          height="315"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          style={{
            width: '100%',
            height: '100%'
          }}
        />
      )}
    </div>
  );
}

/**
 * Lightweight YouTube Link Component
 * For cases where we just want a link to YouTube
 */
export function YouTubeLink({ 
  videoId, 
  title = "مشاهدة على يوتيوب",
  className = ""
}: {
  videoId: string;
  title?: string;
  className?: string;
}) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
  return (
    <a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${className}`}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136C4.495 20.455 12 20.455 12 20.455s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
      {title}
    </a>
  );
}

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeId(url: string): string | null {
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
}

export default YouTubeFacade;
