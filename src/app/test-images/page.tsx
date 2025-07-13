'use client';

import { useState } from 'react';
import ImageManager from '@/components/ImageManager';
import MarkdownPreview from '@/components/MarkdownPreview';

export default function TestImagesPage() {
  const [images, setImages] = useState<Array<{
    id: string;
    image_url: string;
    image_path: string;
    alt_text?: string;
    caption?: string;
    file_size?: number;
    mime_type?: string;
    width?: number;
    height?: number;
    display_order: number;
  }>>([]);

  const [content, setContent] = useState(`# اختبار نظام إدارة الصور

هذا مثال على كيفية استخدام نظام إدارة الصور الجديد.

## معرض الصور

[gallery]grid,3,normal[/gallery]

## صور في صف واحد

[gallery]single-row,3,normal[/gallery]

## كاروسيل الصور

[gallery]carousel,1,normal[/gallery]

يمكنك رفع الصور أعلاه ومشاهدتها في المعاينة أدناه.
`);

  const handleImageInsert = (imageUrl: string, caption?: string) => {
    const imageMarkdown = caption 
      ? `![${caption}](${imageUrl})\n*${caption}*\n\n`
      : `![صورة](${imageUrl})\n\n`;
    
    setContent(prev => prev + imageMarkdown);
  };

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">اختبار نظام إدارة الصور</h1>
            <p className="text-dark-text-secondary">صفحة تجريبية لاختبار رفع وإدارة الصور المتعددة</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* إدارة الصور */}
            <div className="space-y-6">
              <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4">إدارة الصور</h2>
                <ImageManager
                  images={images}
                  onImagesChange={setImages}
                  onImageInsert={handleImageInsert}
                  maxImages={10}
                />
              </div>

              {/* إحصائيات */}
              <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">الإحصائيات</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">عدد الصور:</span>
                    <span className="text-white">{images.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">الحجم الإجمالي:</span>
                    <span className="text-white">
                      {(images.reduce((total, img) => total + (img.file_size || 0), 0) / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">أنواع الملفات:</span>
                    <span className="text-white">
                      {Array.from(new Set(images.map(img => img.mime_type?.split('/')[1]))).filter(Boolean).join(', ') || 'لا يوجد'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* المعاينة */}
            <div className="space-y-6">
              <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4">معاينة المحتوى</h2>
                <div className="bg-dark-background rounded-lg p-4 border border-gray-700 max-h-[600px] overflow-y-auto">
                  <MarkdownPreview 
                    content={content}
                    articleImages={images}
                  />
                </div>
              </div>

              {/* تحكم في المحتوى */}
              <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">تحرير المحتوى</h3>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                  placeholder="اكتب المحتوى هنا..."
                />
                
                <div className="mt-4 text-sm text-gray-400">
                  <p className="mb-2">أمثلة على استخدام معرض الصور:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li><code>[gallery]grid,3,normal[/gallery]</code> - شبكة 3 أعمدة</li>
                    <li><code>[gallery]single-row,4,tight[/gallery]</code> - صف واحد مضغوط</li>
                    <li><code>[gallery]carousel,1,loose[/gallery]</code> - كاروسيل مع مسافات واسعة</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
