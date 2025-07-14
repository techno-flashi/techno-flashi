'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  style?: React.CSSProperties;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  onError?: () => void;
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc,
  className = '',
  style,
  fill = false,
  width,
  height,
  priority = false,
  onError
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    console.log('Image failed to load:', imageSrc);
    setHasError(true);
    
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
    
    if (onError) {
      onError();
    }
  };

  // إذا فشلت الصورة ولا يوجد fallback، عرض placeholder
  if (hasError && (!fallbackSrc || imageSrc === fallbackSrc)) {
    return (
      <div 
        className={`bg-gray-800 flex items-center justify-center ${className}`}
        style={style}
      >
        <div className="text-gray-400 text-center">
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-xs">فشل تحميل الصورة</div>
        </div>
      </div>
    );
  }

  const imageProps = {
    src: imageSrc,
    alt,
    className,
    style,
    onError: handleError,
    priority,
    unoptimized: true, // تجنب مشاكل التحسين مع الصور الخارجية
    ...(fill ? { fill: true } : { width, height })
  };

  return <Image {...imageProps} />;
}
