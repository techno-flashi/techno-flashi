'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageData {
  id: string;
  image_url: string;
  alt_text?: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface ArticleImageGalleryProps {
  images: ImageData[] | string[];
  layout?: 'grid' | 'masonry' | 'carousel' | 'single-row';
  columns?: number;
  spacing?: 'tight' | 'normal' | 'loose';
  showCaptions?: boolean;
  allowFullscreen?: boolean;
  className?: string;
}

export default function ArticleImageGallery({
  images,
  layout = 'grid',
  columns = 3,
  spacing = 'normal',
  showCaptions = true,
  allowFullscreen = true,
  className = ''
}: ArticleImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  // تحويل الصور إلى تنسيق موحد
  const normalizedImages: ImageData[] = images.map((img, index) => {
    if (typeof img === 'string') {
      return {
        id: `img-${index}`,
        image_url: img,
        alt_text: `صورة ${index + 1}`,
        caption: ''
      };
    }
    return img;
  });

  const spacingClasses = {
    tight: 'gap-2',
    normal: 'gap-4',
    loose: 'gap-6'
  };

  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  const handleImageClick = (index: number) => {
    if (allowFullscreen) {
      setSelectedImage(index);
    }
  };

  const handlePrevious = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null && selectedImage < normalizedImages.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedImage(null);
    } else if (e.key === 'ArrowLeft') {
      handleNext();
    } else if (e.key === 'ArrowRight') {
      handlePrevious();
    }
  };

  // تخطيط الشبكة العادية
  const GridLayout = () => (
    <div className={`grid ${getGridCols()} ${spacingClasses[spacing]} ${className}`}>
      {normalizedImages.map((image, index) => (
        <div
          key={image.id}
          className="group relative overflow-hidden rounded-lg bg-gray-900 cursor-pointer"
          onClick={() => handleImageClick(index)}
        >
          <div className="relative aspect-video">
            <Image
              src={image.image_url}
              alt={image.alt_text || `صورة ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* تأثير التمرير */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            
            {/* أيقونة التكبير */}
            {allowFullscreen && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/70 text-white p-2 rounded-full">
                  🔍
                </div>
              </div>
            )}
          </div>
          
          {/* التسمية التوضيحية */}
          {showCaptions && image.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white text-sm">{image.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // تخطيط الصف الواحد
  const SingleRowLayout = () => (
    <div className={`flex overflow-x-auto ${spacingClasses[spacing]} pb-4 ${className}`}>
      {normalizedImages.map((image, index) => (
        <div
          key={image.id}
          className="flex-shrink-0 group relative overflow-hidden rounded-lg bg-gray-900 cursor-pointer"
          style={{ width: '300px' }}
          onClick={() => handleImageClick(index)}
        >
          <div className="relative aspect-video">
            <Image
              src={image.image_url}
              alt={image.alt_text || `صورة ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="300px"
            />
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            
            {allowFullscreen && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/70 text-white p-2 rounded-full">
                  🔍
                </div>
              </div>
            )}
          </div>
          
          {showCaptions && image.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <p className="text-white text-sm">{image.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // تخطيط الكاروسيل
  const CarouselLayout = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
      <div className={`relative ${className}`}>
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
          <Image
            src={normalizedImages[currentIndex].image_url}
            alt={normalizedImages[currentIndex].alt_text || `صورة ${currentIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
          
          {/* أزرار التنقل */}
          {normalizedImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : normalizedImages.length - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentIndex(currentIndex < normalizedImages.length - 1 ? currentIndex + 1 : 0)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-colors"
              >
                →
              </button>
            </>
          )}
          
          {/* مؤشرات الصور */}
          {normalizedImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 space-x-reverse">
              {normalizedImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* التسمية التوضيحية */}
        {showCaptions && normalizedImages[currentIndex].caption && (
          <div className="mt-4 text-center">
            <p className="text-gray-300">{normalizedImages[currentIndex].caption}</p>
          </div>
        )}
      </div>
    );
  };

  // عرض الصورة بملء الشاشة
  const FullscreenModal = () => {
    if (selectedImage === null) return null;

    const image = normalizedImages[selectedImage];

    return (
      <div
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedImage(null)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="relative max-w-full max-h-full">
          <Image
            src={image.image_url}
            alt={image.alt_text || `صورة ${selectedImage + 1}`}
            width={image.width || 1200}
            height={image.height || 800}
            className="max-w-full max-h-full object-contain"
            sizes="100vw"
          />
          
          {/* زر الإغلاق */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-colors"
          >
            ✕
          </button>
          
          {/* أزرار التنقل */}
          {normalizedImages.length > 1 && (
            <>
              {selectedImage > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-colors"
                >
                  ←
                </button>
              )}
              {selectedImage < normalizedImages.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-colors"
                >
                  →
                </button>
              )}
            </>
          )}
          
          {/* معلومات الصورة */}
          <div className="absolute bottom-4 left-4 right-4 text-center">
            {image.caption && (
              <p className="text-white mb-2">{image.caption}</p>
            )}
            <p className="text-gray-300 text-sm">
              {selectedImage + 1} من {normalizedImages.length}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {layout === 'grid' && <GridLayout />}
      {layout === 'single-row' && <SingleRowLayout />}
      {layout === 'carousel' && <CarouselLayout />}
      {layout === 'masonry' && <GridLayout />} {/* يمكن تحسينه لاحقاً */}
      
      {allowFullscreen && <FullscreenModal />}
    </>
  );
}
