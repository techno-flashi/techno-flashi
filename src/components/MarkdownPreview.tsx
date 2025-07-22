'use client';

import { useMemo, useState, useEffect } from 'react';
import React from 'react';
import Image from 'next/image';
import ArticleImageGallery from './ArticleImageGallery';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
  articleImages?: Array<{
    id: string;
    image_url: string;
    alt_text?: string;
    caption?: string;
    width?: number;
    height?: number;
  }>;
}

// مكون فيديو YouTube
function YouTubeVideo({ videoId }: { videoId: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div
      className="relative w-full my-6 rounded-lg overflow-hidden bg-gray-900"
      style={{ aspectRatio: '16/9', minHeight: '315px' }}
    >
      {isClient ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title="فيديو يوتيوب"
          loading="lazy"
          width="560"
          height="315"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-800">
          <div className="text-white text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <p className="text-sm">جاري تحميل الفيديو...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// دالة استخراج معرف فيديو YouTube
const extractYouTubeId = (url: string): string | null => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // تنظيف الرابط
  const cleanUrl = url.trim();

  // أنماط مختلفة لروابط YouTube
  const patterns = [
    // https://www.youtube.com/watch?v=VIDEO_ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    // https://youtu.be/VIDEO_ID
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    // https://www.youtube.com/embed/VIDEO_ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    // مجرد معرف الفيديو
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {

      return match[1];
    }
  }


  return null;
};

export default function MarkdownPreview({ content, className = '', articleImages = [] }: MarkdownPreviewProps) {
  // تحليل المحتوى وإرجاع عناصر React
  const parseMarkdownToElements = (text: string): React.ReactNode[] => {
    if (!text) return [];

    const elements: React.ReactNode[] = [];
    const lines = text.split('\n');
    let currentParagraph = '';
    let key = 0;
    let autoImageIndex = 0; // فهرس الصورة التلقائية

    // معالجة مراجع الصور [صورة:رقم]
    const processImageReferences = (content: string): React.ReactNode[] => {
      // تقسيم المحتوى بناءً على مراجع الصور
      const parts = content.split(/(\[صورة:\d+\])/g);
      const processedParts: React.ReactNode[] = [];

      parts.forEach((part, index) => {
        const imageMatch = part.match(/\[صورة:(\d+)\]/);

        if (imageMatch) {
          const imageNumber = parseInt(imageMatch[1]) - 1; // تحويل إلى فهرس (0-based)
          const image = articleImages?.[imageNumber];

          if (image) {
            processedParts.push(
              <div key={`ref-image-${key++}`} className="my-8 w-full">
                <div className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg bg-gray-900 border border-gray-700">
                  <div className="relative w-full" style={{ aspectRatio: '16/9', minHeight: '300px', maxHeight: '500px' }}>
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || image.caption || `صورة ${imageNumber + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      className="object-cover"
                      loading="lazy"
                      quality={85}
                    />
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-white text-sm text-center font-medium">
                          {image.caption}
                        </p>
                      </div>
                    )}
                  </div>
                  {/* رقم الصورة */}
                  <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded shadow-lg">
                    صورة {imageNumber + 1}
                  </div>
                  {/* مؤشر المرجع */}
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg">
                    [صورة:{imageNumber + 1}]
                  </div>
                </div>
              </div>
            );
          } else {
            // إذا لم توجد الصورة، اعرض رسالة خطأ مفصلة
            processedParts.push(
              <div key={`missing-image-${key++}`} className="my-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center justify-center text-red-400">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="font-medium">الصورة رقم {imageNumber + 1} غير موجودة</p>
                    <p className="text-xs text-red-300 mt-1">
                      تأكد من رفع الصورة أو تحديث رقم المرجع
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        } else if (part.trim()) {
          // معالجة النص العادي مع الحفاظ على التنسيق
          const processedText = processInlineMarkdown(part);
          if (processedText) {
            processedParts.push(
              <span key={`text-${index}`} className="inline">
                {processedText}
              </span>
            );
          }
        }
      });

      return processedParts;
    };

    const flushParagraph = () => {
      if (currentParagraph.trim()) {
        // تحقق من وجود مراجع صور في الفقرة
        if (currentParagraph.includes('[صورة:')) {
          // معالجة مراجع الصور
          const processedContent = processImageReferences(currentParagraph.trim());
          elements.push(
            <div key={key++} className="mb-4">
              {processedContent}
            </div>
          );
        } else {
          // معالجة النص العادي
          const processedText = processInlineMarkdown(currentParagraph.trim());
          elements.push(
            <p key={key++} className="mb-4 text-gray-700 leading-relaxed">
              {processedText}
            </p>
          );

          // تم إيقاف الإضافة التلقائية للصور - يتم عرض الصور فقط عبر المراجع [صورة:رقم]
          // أو الروابط المباشرة التي يضعها المحرر يدوياً
        }

        currentParagraph = '';
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // معالجة مراجع الصور في السطر الحالي
      if (line.includes('[صورة:')) {
        // إضافة السطر الحالي إلى الفقرة الحالية
        currentParagraph += (currentParagraph ? '\n' : '') + line;
        // معالجة الفقرة فوراً
        flushParagraph();
        continue;
      }

      // فيديو YouTube
      const youtubeMatch = line.match(/\[youtube\]([^[]+)\[\/youtube\]/);
      if (youtubeMatch) {
        flushParagraph();
        const url = youtubeMatch[1].trim();
        const videoId = extractYouTubeId(url);



        if (videoId) {
          elements.push(<YouTubeVideo key={key++} videoId={videoId} />);
        } else {
          elements.push(
            <div key={key++} className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 my-4">
              <p className="text-red-400">رابط يوتيوب غير صحيح: {url}</p>
              <p className="text-red-300 text-sm mt-2">تأكد من أن الرابط بالشكل الصحيح مثل: https://www.youtube.com/watch?v=VIDEO_ID</p>
            </div>
          );
        }
        continue;
      }

      // معرض الصور
      const galleryMatch = line.match(/\[gallery\]([^[]*)\[\/gallery\]/);
      if (galleryMatch) {
        flushParagraph();
        const params = galleryMatch[1].trim();
        const [layout = 'grid', columns = '3', spacing = 'normal'] = params.split(',').map(p => p.trim());

        if (articleImages && articleImages.length > 0) {
          elements.push(
            <ArticleImageGallery
              key={key++}
              images={articleImages}
              layout={layout as any}
              columns={parseInt(columns) || 3}
              spacing={spacing as any}
              className="my-6"
            />
          );
        } else {
          elements.push(
            <div key={key++} className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 my-4 text-center">
              <p className="text-gray-400">لا توجد صور متاحة لعرضها في المعرض</p>
            </div>
          );
        }
        continue;
      }

      // العناوين
      if (line.startsWith('### ')) {
        flushParagraph();
        elements.push(
          <h3 key={key++} className="text-xl font-semibold text-gray-900 mb-3 mt-5 leading-tight">
            {line.substring(4)}
          </h3>
        );
        continue;
      }

      if (line.startsWith('## ')) {
        flushParagraph();
        elements.push(
          <h2 key={key++} className="text-2xl font-semibold text-gray-900 mb-4 mt-6 leading-tight">
            {line.substring(3)}
          </h2>
        );
        continue;
      }

      if (line.startsWith('# ')) {
        flushParagraph();
        elements.push(
          <h1 key={key++} className="text-3xl font-bold text-gray-900 mb-6 mt-8 leading-tight">
            {line.substring(2)}
          </h1>
        );
        continue;
      }

      // كتل الكود
      if (line.startsWith('```')) {
        flushParagraph();
        const codeLines = [];
        i++; // تخطي السطر الأول
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push(
          <pre key={key++} className="bg-gray-900 border border-gray-700 rounded-lg p-4 my-4 overflow-x-auto">
            <code className="text-gray-300 font-mono text-sm">
              {codeLines.join('\n')}
            </code>
          </pre>
        );
        continue;
      }

      // القوائم
      if (line.startsWith('- ') || line.startsWith('* ')) {
        flushParagraph();
        const listItems = [];
        while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
          listItems.push(lines[i].substring(2));
          i++;
        }
        i--; // العودة خطوة واحدة
        elements.push(
          <ul key={key++} className="list-disc list-inside mb-4 space-y-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-gray-700 leading-relaxed">
                {processInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // خط فارغ
      if (line.trim() === '') {
        flushParagraph();
        continue;
      }

      // إضافة إلى الفقرة الحالية
      if (currentParagraph) {
        currentParagraph += '\n' + line;
      } else {
        currentParagraph = line;
      }
    }

    flushParagraph();
    return elements;
  };

  // معالجة التنسيق داخل النص
  const processInlineMarkdown = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    // معالجة النص العريض
    remaining = remaining.replace(/\*\*(.*?)\*\*/g, (match, content) => {
      const placeholder = `__BOLD_${key++}__`;
      parts.push(<strong key={placeholder} className="font-semibold text-gray-900">{content}</strong>);
      return placeholder;
    });

    // معالجة النص المائل
    remaining = remaining.replace(/\*(.*?)\*/g, (match, content) => {
      const placeholder = `__ITALIC_${key++}__`;
      parts.push(<em key={placeholder} className="italic">{content}</em>);
      return placeholder;
    });

    // معالجة الكود المضمن
    remaining = remaining.replace(/`([^`]+)`/g, (match, content) => {
      const placeholder = `__CODE_${key++}__`;
      parts.push(
        <code key={placeholder} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
          {content}
        </code>
      );
      return placeholder;
    });

    // معالجة الروابط
    remaining = remaining.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      const placeholder = `__LINK_${key++}__`;
      parts.push(
        <a key={placeholder} href={url} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      );
      return placeholder;
    });

    // تجميع النتيجة النهائية
    const result: React.ReactNode[] = [];
    const tokens = remaining.split(/(__[A-Z]+_\d+__)/);

    tokens.forEach((token, index) => {
      if (token.startsWith('__') && token.endsWith('__')) {
        const part = parts.find(p => React.isValidElement(p) && p.key === token);
        if (part) {
          result.push(part);
        }
      } else if (token) {
        result.push(token);
      }
    });

    return result.length === 1 ? result[0] : result;
  };

  const elements = useMemo(() => parseMarkdownToElements(content), [content]);

  if (!content.trim()) {
    return (
      <div className={`text-gray-500 italic p-4 ${className}`}>
        لا يوجد محتوى للمعاينة...
      </div>
    );
  }

  return (
    <div className={`article-content ${className}`}>
      {elements}
    </div>
  );
}
