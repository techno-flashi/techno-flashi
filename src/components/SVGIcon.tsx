'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SVGIconProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  onError?: () => void;
  fallbackIcon?: string;
}

export default function SVGIcon({
  src,
  alt,
  className = '',
  style,
  fill = false,
  width = 64,
  height = 64,
  priority = false,
  onError,
  fallbackIcon = "🤖"
}: SVGIconProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    console.log('SVG Icon failed to load:', imageSrc);
    setHasError(true);
    
    if (onError) {
      onError();
    }
  };

  // إذا فشلت الصورة، عرض أيقونة افتراضية
  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-lg ${className}`}
        style={fill ? { width: '100%', height: '100%' } : { width, height, ...style }}
      >
        <span className="text-2xl" role="img" aria-label={alt}>
          {fallbackIcon}
        </span>
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
    unoptimized: true, // مهم جداً للـ SVG من jsDelivr
    ...(fill ? { fill: true } : { width, height })
  };

  return <Image {...imageProps} />;
}
