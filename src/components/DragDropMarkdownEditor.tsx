'use client';

import { useState, useRef, useCallback } from 'react';
import MarkdownEditor from './MarkdownEditor';
import MarkdownPreview from './MarkdownPreview';

interface ImageData {
  id: string;
  image_url: string;
  image_path: string;
  alt_text?: string;
  caption?: string;
  display_order: number;
}

interface DragDropMarkdownEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  images: ImageData[];
  previewMode: boolean;
  onPreviewModeChange: (mode: boolean) => void;
  articleImages?: ImageData[];
}

export default function DragDropMarkdownEditor({
  content,
  onContentChange,
  images,
  previewMode,
  onPreviewModeChange,
  articleImages = []
}: DragDropMarkdownEditorProps) {
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [dropZoneActive, setDropZoneActive] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // إدراج مرجع الصورة في موضع المؤشر
  const insertImageReference = useCallback((imageIndex: number, imageData: ImageData) => {
    const reference = `[صورة:${imageIndex + 1}]`;
    const textarea = typeof textareaRef === 'object' && textareaRef?.current ? textareaRef.current : null;

    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // إضافة أسطر جديدة قبل وبعد المرجع إذا لزم الأمر
      const beforeText = content.substring(0, start);
      const afterText = content.substring(end);

      let newContent = beforeText;

      // إضافة سطر جديد قبل المرجع إذا لم يكن النص ينتهي بسطر جديد
      if (beforeText && !beforeText.endsWith('\n')) {
        newContent += '\n\n';
      } else if (beforeText && !beforeText.endsWith('\n\n')) {
        newContent += '\n';
      }

      newContent += reference;

      // إضافة سطر جديد بعد المرجع إذا لم يكن النص التالي يبدأ بسطر جديد
      if (afterText && !afterText.startsWith('\n')) {
        newContent += '\n\n';
      } else if (afterText && !afterText.startsWith('\n\n')) {
        newContent += '\n';
      }

      newContent += afterText;

      onContentChange(newContent);

      // إعادة تعيين موضع المؤشر
      setTimeout(() => {
        const addedBefore = newContent.substring(0, start).length - beforeText.length;
        const newPosition = start + addedBefore + reference.length;
        textarea.setSelectionRange(newPosition, newPosition);
        textarea.focus();
      }, 0);
    } else {
      // إذا لم يكن textarea متاحاً، أضف في النهاية
      const newContent = content + (content.endsWith('\n') ? '' : '\n\n') + reference + '\n\n';
      onContentChange(newContent);
    }
  }, [content, onContentChange, textareaRef]);

  // معالج السحب من قائمة الصور
  const handleImageDragStart = (e: React.DragEvent, index: number, imageData: ImageData) => {
    setDraggedImageIndex(index);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', `[صورة:${index + 1}]`);
    e.dataTransfer.setData('application/json', JSON.stringify({ index, imageData }));
  };

  // معالج السحب فوق المحرر
  const handleEditorDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDropZoneActive(true);
  };

  // معالج مغادرة منطقة السحب
  const handleEditorDragLeave = (e: React.DragEvent) => {
    // تحقق من أن المؤشر خرج فعلاً من المنطقة
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDropZoneActive(false);
    }
  };

  // معالج الإفلات في المحرر
  const handleEditorDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropZoneActive(false);
    setDraggedImageIndex(null);

    try {
      const imageDataStr = e.dataTransfer.getData('application/json');
      if (imageDataStr) {
        const { index, imageData } = JSON.parse(imageDataStr);

        // حساب موضع الإفلات في النص
        const target = e.target as HTMLElement;
        let textarea: HTMLTextAreaElement | null = null;

        // البحث عن textarea في العنصر أو أطفاله
        if (target.tagName === 'TEXTAREA') {
          textarea = target as HTMLTextAreaElement;
        } else {
          textarea = target.querySelector('textarea');
        }

        if (textarea) {
          const rect = textarea.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          // حساب موضع المؤشر بدقة أكبر
          const style = window.getComputedStyle(textarea);
          const lineHeight = parseInt(style.lineHeight) || 20;
          const paddingTop = parseInt(style.paddingTop) || 0;
          const paddingLeft = parseInt(style.paddingLeft) || 0;

          const adjustedY = y - paddingTop;
          const adjustedX = x - paddingLeft;

          const lines = content.split('\n');
          const lineIndex = Math.max(0, Math.floor(adjustedY / lineHeight));

          // تقدير عرض الحرف بناءً على الخط
          const charWidth = 8; // تقدير تقريبي
          const charIndex = Math.max(0, Math.floor(adjustedX / charWidth));

          let position = 0;
          for (let i = 0; i < Math.min(lineIndex, lines.length - 1); i++) {
            position += lines[i].length + 1; // +1 للسطر الجديد
          }

          if (lineIndex < lines.length) {
            position += Math.min(charIndex, lines[lineIndex]?.length || 0);
          }

          // إدراج مرجع الصورة في الموضع المحسوب
          const reference = `[صورة:${index + 1}]`;
          const beforeText = content.substring(0, position);
          const afterText = content.substring(position);

          // إضافة أسطر جديدة بذكاء
          let newContent = beforeText;
          let addedBefore = 0;

          // إضافة سطر جديد قبل المرجع إذا لزم الأمر
          if (beforeText && !beforeText.endsWith('\n')) {
            newContent += '\n\n';
            addedBefore = 2;
          } else if (beforeText && !beforeText.endsWith('\n\n')) {
            newContent += '\n';
            addedBefore = 1;
          }

          newContent += reference;

          // إضافة سطر جديد بعد المرجع إذا لزم الأمر
          let addedAfter = 0;
          if (afterText && !afterText.startsWith('\n')) {
            newContent += '\n\n';
            addedAfter = 2;
          } else if (afterText && !afterText.startsWith('\n\n')) {
            newContent += '\n';
            addedAfter = 1;
          }

          newContent += afterText;

          onContentChange(newContent);

          // تحديث موضع المؤشر بدقة
          setTimeout(() => {
            const newPosition = position + addedBefore + reference.length + (addedAfter > 0 ? 1 : 0);
            textarea.setSelectionRange(newPosition, newPosition);
            textarea.focus();
          }, 0);
        } else {
          // إذا لم نتمكن من تحديد الموضع، أضف في النهاية
          insertImageReference(index, imageData);
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
      // fallback: إضافة في النهاية
      const reference = e.dataTransfer.getData('text/plain');
      if (reference) {
        const newContent = content + '\n\n' + reference + '\n\n';
        onContentChange(newContent);
      }
    }
  };

  // تحديث موضع المؤشر
  const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    setCursorPosition(textarea.selectionStart);
  };

  // معالج تغيير النص
  const handleContentChange = (newContent: string) => {
    onContentChange(newContent);
    
    // تحديث موضع المؤشر
    setTimeout(() => {
      if (textareaRef.current) {
        setCursorPosition(textareaRef.current.selectionStart);
      }
    }, 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* قائمة الصور القابلة للسحب */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">الصور المتاحة</h3>
          <span className="text-sm text-gray-400">{images.length} صورة</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={(e) => handleImageDragStart(e, index, image)}
              className={`relative group cursor-move bg-gray-800 rounded-lg overflow-hidden border-2 transition-all ${
                draggedImageIndex === index 
                  ? 'border-purple-500 opacity-50 scale-95' 
                  : 'border-gray-700 hover:border-purple-400'
              }`}
            >
              <div className="aspect-video relative">
                <img
                  src={image.image_url}
                  alt={image.alt_text || `صورة ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-xs text-center">
                    <div className="mb-1">🖱️ اسحب للإدراج</div>
                    <div className="font-mono bg-purple-600 px-2 py-1 rounded">
                      [صورة:{index + 1}]
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <div className="text-xs text-gray-400 truncate">
                  {image.caption || image.alt_text || `صورة ${index + 1}`}
                </div>
              </div>
              
              <div className="absolute top-1 left-1 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
        
        {images.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📷</div>
            <p>لا توجد صور متاحة</p>
            <p className="text-sm">ارفع صور أولاً لتتمكن من إدراجها</p>
          </div>
        )}
      </div>

      {/* المحرر مع منطقة الإفلات */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">محرر المحتوى</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPreviewModeChange(!previewMode)}
              className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition-colors"
            >
              {previewMode ? 'تحرير' : 'معاينة'}
            </button>
          </div>
        </div>

        <div 
          className={`relative border-2 border-dashed rounded-lg transition-all ${
            dropZoneActive 
              ? 'border-purple-400 bg-purple-500/10' 
              : 'border-gray-600'
          }`}
          onDragOver={handleEditorDragOver}
          onDragLeave={handleEditorDragLeave}
          onDrop={handleEditorDrop}
        >
          {dropZoneActive && (
            <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center z-10 rounded-lg">
              <div className="text-purple-400 text-center">
                <div className="text-2xl mb-2">📎</div>
                <div className="font-semibold">أفلت هنا لإدراج مرجع الصورة</div>
              </div>
            </div>
          )}

          {previewMode ? (
            <div className="min-h-96 p-4">
              <MarkdownPreview 
                content={content} 
                articleImages={articleImages}
                className="prose prose-invert max-w-none"
              />
            </div>
          ) : (
            <MarkdownEditor
              ref={textareaRef}
              content={content}
              onChange={handleContentChange}
              onClick={handleTextareaClick}
              className="min-h-96 w-full p-4 bg-transparent text-white resize-none focus:outline-none"
              placeholder="ابدأ الكتابة هنا... يمكنك سحب الصور من القائمة اليسرى وإفلاتها هنا لإدراج مراجعها"
            />
          )}
        </div>

        {/* شريط المعلومات */}
        <div className="flex items-center justify-between text-xs text-gray-400 bg-gray-800 px-3 py-2 rounded">
          <div>
            الأحرف: {content.length} | الأسطر: {content.split('\n').length}
          </div>
          <div>
            موضع المؤشر: {cursorPosition}
          </div>
        </div>

        {/* دليل الاستخدام */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
          <h4 className="text-blue-400 font-semibold text-sm mb-2">💡 نصائح الاستخدام:</h4>
          <ul className="text-blue-300 text-xs space-y-1">
            <li>• اسحب الصور من القائمة اليسرى وأفلتها في المحرر</li>
            <li>• استخدم مراجع مثل [صورة:1] في أي مكان في النص</li>
            <li>• اضغط على "معاينة" لرؤية النتيجة النهائية</li>
            <li>• يمكن إعادة ترتيب الصور لتغيير أرقام المراجع</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
