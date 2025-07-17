'use client';

import { useMemo } from 'react';
import React from 'react';
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
  return (
    <div
      className="relative w-full my-6 rounded-lg overflow-hidden bg-gray-900"
      style={{ aspectRatio: '16/9', minHeight: '315px' }}
    >
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
      console.log('Pattern matched:', pattern, 'Video ID:', match[1]);
      return match[1];
    }
  }

  console.log('No pattern matched for URL:', cleanUrl);
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

    const flushParagraph = () => {
      if (currentParagraph.trim()) {
        // معالجة النص داخل الفقرة
        const processedText = processInlineMarkdown(currentParagraph.trim());
        elements.push(
          <p key={key++} className="mb-4 text-dark-text-secondary leading-relaxed">
            {processedText}
          </p>
        );
        currentParagraph = '';
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // فيديو YouTube
      const youtubeMatch = line.match(/\[youtube\]([^[]+)\[\/youtube\]/);
      if (youtubeMatch) {
        flushParagraph();
        const url = youtubeMatch[1].trim();
        const videoId = extractYouTubeId(url);

        console.log('YouTube URL found:', url);
        console.log('Extracted Video ID:', videoId);

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
          <h3 key={key++} className="text-lg font-semibold text-white mb-3 mt-6">
            {line.substring(4)}
          </h3>
        );
        continue;
      }

      if (line.startsWith('## ')) {
        flushParagraph();
        elements.push(
          <h2 key={key++} className="text-xl font-semibold text-white mb-4 mt-8">
            {line.substring(3)}
          </h2>
        );
        continue;
      }

      if (line.startsWith('# ')) {
        flushParagraph();
        elements.push(
          <h1 key={key++} className="text-2xl font-bold text-white mb-6 mt-10">
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
          <ul key={key++} className="list-disc list-inside space-y-2 my-4 text-dark-text-secondary">
            {listItems.map((item, idx) => (
              <li key={idx} className="ml-6 mb-2">
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
      parts.push(<strong key={placeholder} className="font-semibold text-white">{content}</strong>);
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
        <code key={placeholder} className="bg-gray-800 text-primary px-2 py-1 rounded text-sm font-mono">
          {content}
        </code>
      );
      return placeholder;
    });

    // معالجة الروابط
    remaining = remaining.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      const placeholder = `__LINK_${key++}__`;
      parts.push(
        <a key={placeholder} href={url} className="text-primary hover:text-primary/80 underline" target="_blank" rel="noopener noreferrer">
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
    <div className={`prose max-w-none ${className}`}>
      {elements}
    </div>
  );
}
