'use client';

// محرر نصوص بسيط لحين إضافة EditorJS
import { useState, useEffect } from 'react';

interface SimpleEditorProps {
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
}

export function SimpleEditor({ value, onChange, placeholder = "اكتب محتوى المقال هنا..." }: SimpleEditorProps) {
  const [content, setContent] = useState('');

  useEffect(() => {
    // تحويل JSON إلى نص للتعديل
    if (value && typeof value === 'object') {
      if (value.blocks && Array.isArray(value.blocks)) {
        // إذا كان EditorJS format
        const text = value.blocks
          .map((block: any) => {
            if (block.type === 'paragraph') {
              return block.data.text || '';
            }
            if (block.type === 'header') {
              return `${'#'.repeat(block.data.level || 1)} ${block.data.text || ''}`;
            }
            return block.data.text || '';
          })
          .join('\n\n');
        setContent(text);
      } else {
        setContent(JSON.stringify(value, null, 2));
      }
    } else if (typeof value === 'string') {
      setContent(value);
    }
  }, [value]);

  const handleChange = (newContent: string) => {
    setContent(newContent);
    
    // تحويل النص إلى EditorJS format بسيط
    const paragraphs = newContent.split('\n\n').filter(p => p.trim());
    const blocks = paragraphs.map(paragraph => {
      const trimmed = paragraph.trim();
      
      // التحقق من العناوين
      if (trimmed.startsWith('#')) {
        const level = trimmed.match(/^#+/)?.[0].length || 1;
        const text = trimmed.replace(/^#+\s*/, '');
        return {
          type: 'header',
          data: {
            text,
            level: Math.min(level, 6),
          },
        };
      }
      
      // فقرة عادية
      return {
        type: 'paragraph',
        data: {
          text: trimmed,
        },
      };
    });

    const editorJSFormat = {
      time: Date.now(),
      blocks,
      version: '2.28.2',
    };

    onChange(editorJSFormat);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        محتوى المقال
      </label>
      <div className="border border-gray-600 rounded-md overflow-hidden">
        <div className="bg-[#0D1117] px-3 py-2 border-b border-gray-600">
          <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-400">
            <span>💡 نصائح:</span>
            <span>استخدم # للعناوين</span>
            <span>|</span>
            <span>اترك سطر فارغ بين الفقرات</span>
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          rows={15}
          className="w-full px-3 py-2 bg-[#161B22] text-white placeholder-gray-400 border-0 focus:outline-none focus:ring-0 resize-none font-mono text-sm leading-relaxed"
          style={{ direction: 'rtl' }}
        />
      </div>
      <div className="text-xs text-gray-500">
        سيتم تحويل النص تلقائياً إلى تنسيق EditorJS عند الحفظ
      </div>
    </div>
  );
}
