// مكون عرض محتوى المقالات بتحويل Editor.js إلى HTML
'use client';

import { YouTubeEmbed } from './YouTubeEmbed';
import { ImageSlider, SingleImage } from './ImageSlider';
import Image from 'next/image';

interface EditorBlock {
  type: string;
  data: any;
}

interface EditorContent {
  blocks: EditorBlock[];
  version?: string;
  time?: number;
}

interface ArticleContentProps {
  content: EditorContent | any;
}

export function ArticleContent({ content }: ArticleContentProps) {
  // التحقق من صحة المحتوى
  if (!content || !content.blocks || !Array.isArray(content.blocks)) {
    return (
      <div className="prose prose-invert prose-lg max-w-none">
        <p className="text-dark-text-secondary">لا يوجد محتوى متاح لهذا المقال.</p>
      </div>
    );
  }

  // استخراج العناوين لجدول المحتويات
  const headers = content.blocks
    .filter((block: EditorBlock) => block.type === 'header')
    .map((block: EditorBlock, index: number) => ({
      id: `header-${index}`,
      text: block.data.text,
      level: block.data.level || 2
    }));

  // إنشاء جدول المحتويات
  const TableOfContents = () => {
    if (headers.length === 0) return null;

    return (
      <div className="bg-dark-card rounded-lg p-6 border border-gray-700 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          جدول المحتويات
        </h3>
        <ul className="space-y-2">
          {headers.map((header: any, index: number) => (
            <li key={index}>
              <a
                href={`#${header.id}`}
                className={`text-dark-text-secondary hover:text-primary transition-colors duration-300 block ${
                  header.level > 2 ? 'mr-4' : ''
                }`}
              >
                {header.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderBlock = (block: EditorBlock, index: number) => {
    switch (block.type) {
      case 'paragraph':
        // تحويل النص لدعم الروابط والتنسيق
        const formatText = (text: string) => {
          // تحويل الروابط
          const linkRegex = /(https?:\/\/[^\s]+)/g;
          return text.split(linkRegex).map((part, i) => {
            if (linkRegex.test(part)) {
              return (
                <a
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-blue-400 underline transition-colors duration-300"
                >
                  {part}
                </a>
              );
            }
            return part;
          });
        };

        return (
          <p key={index} className="text-dark-text leading-relaxed mb-4 sm:mb-6 text-base sm:text-lg">
            {formatText(block.data.text)}
          </p>
        );

      case 'header':
        const HeaderTag = `h${block.data.level || 2}` as keyof JSX.IntrinsicElements;
        const headerClasses = {
          1: 'text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 md:mb-8 mt-6 sm:mt-8 md:mt-12',
          2: 'text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 md:mb-6 mt-5 sm:mt-6 md:mt-10',
          3: 'text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4 mt-4 sm:mt-5 md:mt-8',
          4: 'text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3 md:mb-4 mt-3 sm:mt-4 md:mt-6',
          5: 'text-sm sm:text-base md:text-lg font-semibold text-white mb-2 sm:mb-3 mt-3 sm:mt-4',
          6: 'text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3 mt-3 sm:mt-4'
        };

        // العثور على فهرس العنوان في قائمة العناوين
        const headerIndex = headers.findIndex((h: any) => h.text === block.data.text);
        const headerId = headerIndex >= 0 ? headers[headerIndex].id : `header-${index}`;

        return (
          <HeaderTag
            key={index}
            id={headerId}
            className={headerClasses[block.data.level as keyof typeof headerClasses] || headerClasses[2]}
          >
            {block.data.text}
          </HeaderTag>
        );

      case 'list':
        const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
        const listClasses = block.data.style === 'ordered' 
          ? 'list-decimal list-inside space-y-2 mb-6 text-dark-text' 
          : 'list-disc list-inside space-y-2 mb-6 text-dark-text';

        return (
          <ListTag key={index} className={listClasses}>
            {block.data.items.map((item: string, itemIndex: number) => (
              <li key={itemIndex} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ListTag>
        );

      case 'quote':
        return (
          <blockquote key={index} className="border-r-4 border-primary bg-dark-card p-6 rounded-lg mb-6 italic">
            <p className="text-lg text-white mb-2">"{block.data.text}"</p>
            {block.data.caption && (
              <cite className="text-dark-text-secondary text-sm">— {block.data.caption}</cite>
            )}
          </blockquote>
        );

      case 'code':
        return (
          <div key={index} className="mb-6">
            <div className="bg-dark-background rounded-lg border border-gray-700 overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className="text-sm font-medium text-primary">
                    {block.data.language?.toUpperCase() || 'CODE'}
                  </span>
                  {block.data.title && (
                    <span className="text-sm text-white">{block.data.title}</span>
                  )}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(block.data.code)}
                  className="text-xs bg-primary hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors duration-300 flex items-center"
                >
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  نسخ
                </button>
              </div>
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm text-green-400 font-mono">
                  {block.data.code}
                </code>
              </pre>
            </div>
          </div>
        );

      case 'image':
        return (
          <SingleImage
            key={index}
            url={block.data.file?.url || block.data.url || "https://placehold.co/800x400/38BDF8/FFFFFF?text=صورة"}
            caption={block.data.caption}
            alt={block.data.caption || 'صورة المقال'}
          />
        );

      case 'gallery':
        // معرض الصور المتعددة باستخدام Slider
        const galleryImages = block.data.images?.map((image: any) => ({
          url: image.url || "https://placehold.co/400x300/38BDF8/FFFFFF?text=صورة",
          caption: image.caption,
          alt: image.caption || 'صورة من المعرض'
        })) || [];

        return (
          <div key={index}>
            <ImageSlider images={galleryImages} />
            {block.data.caption && (
              <p className="text-center text-dark-text-secondary text-sm mt-2 italic">
                {block.data.caption}
              </p>
            )}
          </div>
        );

      case 'youtube':
      case 'video':
        // فيديو يوتيوب
        const videoUrl = block.data.url || block.data.service?.url;
        if (videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'))) {
          return (
            <div key={index} className="mb-8">
              <YouTubeEmbed
                url={videoUrl}
                title={block.data.caption || block.data.title || 'فيديو يوتيوب'}
              />
              {block.data.caption && (
                <p className="text-center text-dark-text-secondary text-sm mt-2 italic">
                  {block.data.caption}
                </p>
              )}
            </div>
          );
        }
        return null;

      case 'delimiter':
        return (
          <div key={index} className="flex justify-center my-8">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
          </div>
        );

      case 'warning':
        return (
          <div key={index} className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="text-yellow-400 text-xl mr-3">⚠️</div>
              <div>
                {block.data.title && (
                  <h4 className="text-yellow-400 font-semibold mb-2">{block.data.title}</h4>
                )}
                <p className="text-dark-text">{block.data.message}</p>
              </div>
            </div>
          </div>
        );

      case 'checklist':
        return (
          <div key={index} className="space-y-3 mb-6">
            {block.data.items.map((item: any, itemIndex: number) => (
              <div key={itemIndex} className="flex items-start">
                <div className={`w-5 h-5 rounded border-2 mr-3 mt-0.5 flex items-center justify-center ${
                  item.checked 
                    ? 'bg-primary border-primary' 
                    : 'border-gray-600'
                }`}>
                  {item.checked && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`text-dark-text leading-relaxed ${
                  item.checked ? 'line-through opacity-75' : ''
                }`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        );

      case 'table':
        return (
          <div key={index} className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-gray-700 rounded-lg overflow-hidden">
              <tbody>
                {block.data.content.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex} className={rowIndex === 0 ? 'bg-dark-card' : 'hover:bg-dark-card/50'}>
                    {row.map((cell: string, cellIndex: number) => {
                      const CellTag = rowIndex === 0 ? 'th' : 'td';
                      return (
                        <CellTag 
                          key={cellIndex}
                          className={`border border-gray-700 px-4 py-2 text-right ${
                            rowIndex === 0 ? 'font-semibold text-white' : 'text-dark-text'
                          }`}
                        >
                          {cell}
                        </CellTag>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        // للأنواع غير المدعومة، نعرض النص الخام إن وجد
        if (block.data.text) {
          return (
            <div key={index} className="bg-dark-card p-4 rounded-lg mb-4 border border-gray-700">
              <p className="text-dark-text-secondary text-sm mb-2">
                نوع غير مدعوم: {block.type}
              </p>
              <p className="text-dark-text">{block.data.text}</p>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className="prose prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none">
      {/* جدول المحتويات */}
      <TableOfContents />

      {/* محتوى المقال - محسن للقراءة */}
      <div className="space-y-3 sm:space-y-4 leading-relaxed">
        {content.blocks.map((block: EditorBlock, index: number) => renderBlock(block, index))}
      </div>
    </div>
  );
}
