// مكون محرر الأكواد البرمجية مع تمييز الألوان
'use client';

import { useState } from 'react';

interface CodeEditorProps {
  onCodeAdded: (code: string, language: string, title?: string) => void;
  className?: string;
}

const PROGRAMMING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'bash', label: 'Bash' },
  { value: 'powershell', label: 'PowerShell' },
  { value: 'docker', label: 'Dockerfile' },
  { value: 'nginx', label: 'Nginx' },
  { value: 'apache', label: 'Apache' },
];

export function CodeEditor({ onCodeAdded, className = "" }: CodeEditorProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [title, setTitle] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onCodeAdded(code, language, title || undefined);
      setCode('');
      setTitle('');
      setIsPreview(false);
    }
  };

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      javascript: 'text-yellow-400',
      typescript: 'text-blue-400',
      python: 'text-green-400',
      java: 'text-orange-400',
      cpp: 'text-blue-300',
      c: 'text-blue-300',
      csharp: 'text-purple-400',
      php: 'text-indigo-400',
      ruby: 'text-red-400',
      go: 'text-cyan-400',
      rust: 'text-orange-300',
      swift: 'text-orange-500',
      kotlin: 'text-purple-300',
      html: 'text-orange-400',
      css: 'text-blue-400',
      scss: 'text-pink-400',
      sql: 'text-blue-300',
      json: 'text-yellow-300',
      xml: 'text-green-300',
      yaml: 'text-red-300',
      markdown: 'text-gray-300',
      bash: 'text-green-300',
      powershell: 'text-blue-300',
      docker: 'text-blue-400',
      nginx: 'text-green-400',
      apache: 'text-red-400',
    };
    return colors[lang] || 'text-gray-300';
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert('تم نسخ الكود!');
  };

  return (
    <div className={`bg-dark-card rounded-lg p-6 border border-gray-700 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        محرر الأكواد البرمجية
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* اختيار اللغة والعنوان */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              لغة البرمجة *
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {PROGRAMMING_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              عنوان الكود (اختياري)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: دالة حساب المجموع"
              className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* محرر الكود */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-white">
              الكود البرمجي *
            </label>
            <div className="flex space-x-2 space-x-reverse">
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded transition-colors duration-300"
              >
                {isPreview ? 'تحرير' : 'معاينة'}
              </button>
              {code && (
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="text-xs bg-primary hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors duration-300"
                >
                  نسخ
                </button>
              )}
            </div>
          </div>

          {!isPreview ? (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="اكتب الكود هنا..."
              rows={12}
              className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm leading-relaxed"
              style={{ tabSize: 2 }}
            />
          ) : (
            <div className="bg-dark-background rounded-md border border-gray-600 overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
                <span className={`text-sm font-medium ${getLanguageColor(language)}`}>
                  {PROGRAMMING_LANGUAGES.find(l => l.value === language)?.label || language}
                </span>
                {title && (
                  <span className="text-sm text-dark-text-secondary">{title}</span>
                )}
              </div>
              <pre className="p-4 overflow-x-auto max-h-64">
                <code className={`text-sm font-mono ${getLanguageColor(language)}`}>
                  {code}
                </code>
              </pre>
            </div>
          )}
        </div>

        {/* معلومات إضافية */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
          <p className="text-blue-400 text-sm">
            💡 نصيحة: استخدم Tab للمسافات البادئة، وتأكد من صحة الكود قبل الإضافة
          </p>
        </div>

        {/* أزرار الإجراء */}
        <div className="flex justify-end space-x-3 space-x-reverse">
          <button
            type="button"
            onClick={() => {
              setCode('');
              setTitle('');
              setIsPreview(false);
            }}
            className="px-4 py-2 border border-gray-600 text-dark-text-secondary rounded-lg hover:text-white hover:border-gray-500 transition-all duration-300"
          >
            مسح
          </button>
          <button
            type="submit"
            disabled={!code.trim()}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            إضافة الكود
          </button>
        </div>
      </form>
    </div>
  );
}

// مكون عرض الكود المضاف
interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  onRemove?: () => void;
  className?: string;
}

export function CodeBlock({ code, language, title, onRemove, className = "" }: CodeBlockProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert('تم نسخ الكود!');
  };

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      javascript: 'text-yellow-400',
      typescript: 'text-blue-400',
      python: 'text-green-400',
      java: 'text-orange-400',
      html: 'text-orange-400',
      css: 'text-blue-400',
      php: 'text-indigo-400',
      ruby: 'text-red-400',
      go: 'text-cyan-400',
      rust: 'text-orange-300',
    };
    return colors[lang] || 'text-gray-300';
  };

  return (
    <div className={`relative group ${className}`}>
      <div className="bg-dark-background rounded-lg border border-gray-700 overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-3 space-x-reverse">
            <span className={`text-sm font-medium ${getLanguageColor(language)}`}>
              {language.toUpperCase()}
            </span>
            {title && (
              <span className="text-sm text-white">{title}</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={copyToClipboard}
              className="text-xs bg-primary hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors duration-300"
            >
              نسخ
            </button>
            {onRemove && (
              <button
                onClick={onRemove}
                className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors duration-300 opacity-0 group-hover:opacity-100"
              >
                حذف
              </button>
            )}
          </div>
        </div>
        
        <pre className="p-4 overflow-x-auto max-h-64">
          <code className={`text-sm font-mono ${getLanguageColor(language)}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
