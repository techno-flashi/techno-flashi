'use client';

import { useState, useRef, useEffect } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "اكتب محتواك هنا...",
  className = ""
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;

    const newValue =
      value.substring(0, start) +
      before + textToInsert + after +
      value.substring(end);

    onChange(newValue);

    // Set cursor position
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const toolbarButtons = [
    {
      label: 'نص عريض',
      action: () => insertText('**', '**', 'نص عريض'),
      icon: 'B'
    },
    {
      label: 'نص مائل',
      action: () => insertText('*', '*', 'نص مائل'),
      icon: 'I'
    },
    {
      label: 'رابط',
      action: () => insertText('[', '](https://example.com)', 'نص الرابط'),
      icon: '🔗'
    },
    {
      label: 'صورة',
      action: () => insertText('![', '](https://example.com/image.jpg)', 'وصف الصورة'),
      icon: '🖼️'
    },
    {
      label: 'قائمة',
      action: () => insertText('- ', '', 'عنصر القائمة'),
      icon: '•'
    },
    {
      label: 'كود',
      action: () => insertText('`', '`', 'كود'),
      icon: '</>'
    },
    {
      label: 'عنوان',
      action: () => insertText('## ', '', 'العنوان'),
      icon: 'H'
    },
    {
      label: 'فيديو يوتيوب',
      action: () => insertText('[youtube]', '[/youtube]', 'https://www.youtube.com/watch?v=VIDEO_ID'),
      icon: '📹'
    },
    {
      label: 'معرض صور',
      action: () => insertText('[gallery]', '[/gallery]', 'grid,3,normal'),
      icon: '🖼️'
    }
  ];

  return (
    <div className={`border border-gray-700 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center space-x-2 space-x-reverse">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button.action}
              className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              title={button.label}
            >
              {button.icon}
            </button>
          ))}
        </div>
        
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          مساعدة Markdown
        </button>
      </div>

      {/* Help Panel */}
      {showHelp && (
        <div className="p-4 bg-gray-800/30 border-b border-gray-700 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-white mb-2">التنسيق الأساسي:</h4>
              <ul className="space-y-1 text-gray-300">
                <li><code>**نص عريض**</code> → <strong>نص عريض</strong></li>
                <li><code>*نص مائل*</code> → <em>نص مائل</em></li>
                <li><code>`كود`</code> → <code>كود</code></li>
                <li><code>~~نص مشطوب~~</code> → <del>نص مشطوب</del></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">العناوين والروابط:</h4>
              <ul className="space-y-1 text-gray-300">
                <li><code># عنوان رئيسي</code></li>
                <li><code>## عنوان فرعي</code></li>
                <li><code>[نص الرابط](URL)</code></li>
                <li><code>![وصف الصورة](URL)</code></li>
                <li><code>[youtube]رابط_يوتيوب[/youtube]</code></li>
                <li><code>[gallery]grid,3,normal[/gallery]</code></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[400px] p-4 bg-white text-gray-900 resize-none focus:outline-none font-mono border-0 focus:ring-2 focus:ring-blue-500"
        style={{ minHeight: '400px' }}
      />

      {/* Footer */}
      <div className="flex justify-between items-center p-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
        <span>عدد الكلمات: {value.trim().split(/\s+/).filter(word => word.length > 0).length}</span>
        <span>عدد الأحرف: {value.length}</span>
      </div>
    </div>
  );
}
