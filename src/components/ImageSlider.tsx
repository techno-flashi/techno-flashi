// مكون Slider للصور مع تصميم بسيط ونظيف
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ImageSliderProps {
  images: Array<{
    url: string;
    caption?: string;
    alt?: string;
  }>;
  className?: string;
}

export function ImageSlider({ images, className = "" }: ImageSliderProps) {
  if (!images || images.length === 0) {
    return null;
  }

  // إذا كانت صورة واحدة فقط، عرضها بدون slider
  if (images.length === 1) {
    return (
      <figure className={`mb-8 ${className}`}>
        <div className="relative w-4/5 mx-auto rounded-lg overflow-hidden shadow-lg bg-dark-card">
          <Image
            src={images[0].url}
            alt={images[0].alt || images[0].caption || 'صورة المقال'}
            width={800}
            height={450}
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
        {images[0].caption && (
          <figcaption className="text-center text-dark-text-secondary text-sm mt-3 italic">
            {images[0].caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className={`mb-8 ${className}`}>
      <div className="relative w-4/5 mx-auto">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={images.length > 1}
          className="rounded-lg shadow-lg overflow-hidden bg-dark-card"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-96 md:h-[450px]">
                <Image
                  src={image.url}
                  alt={image.alt || image.caption || `صورة ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300"
                  loading="lazy"
                />
                
                {/* عرض التسمية التوضيحية على الصورة */}
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm text-center">
                      {image.caption}
                    </p>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
          
          {/* أزرار التنقل المخصصة */}
          <div className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 group">
            <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          
          <div className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 group">
            <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Swiper>
        
        {/* عداد الصور */}
        <div className="absolute top-4 right-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {images.length} صور
        </div>
      </div>
      
      {/* التسمية التوضيحية العامة */}
      {images.length > 1 && (
        <figcaption className="text-center text-dark-text-secondary text-sm mt-3 italic">
          معرض صور ({images.length} صور)
        </figcaption>
      )}
    </figure>
  );
}

// مكون مبسط للصور المفردة مع نفس التصميم
interface SingleImageProps {
  url: string;
  caption?: string;
  alt?: string;
  className?: string;
}

export function SingleImage({ url, caption, alt, className = "" }: SingleImageProps) {
  return (
    <figure className={`mb-8 ${className}`}>
      <div className="relative w-4/5 mx-auto rounded-lg overflow-hidden shadow-lg bg-dark-card">
        <Image
          src={url}
          alt={alt || caption || 'صورة المقال'}
          width={800}
          height={450}
          className="w-full h-auto"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="text-center text-dark-text-secondary text-sm mt-3 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
