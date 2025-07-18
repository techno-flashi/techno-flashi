// مكون لتحويل محتوى EditorJS إلى HTML وعرضه
import React from 'react';

interface EditorJSBlock {
  type: string;
  data: any;
}

interface EditorJSContent {
  blocks: EditorJSBlock[];
  time?: number;
  version?: string;
}

interface EditorJSRendererProps {
  content: EditorJSContent | any;
  className?: string;
}

export function EditorJSRenderer({ content, className = '' }: EditorJSRendererProps) {
  // التحقق من صحة المحتوى
  if (!content || typeof content !== 'object') {
    return (
      <div className={`text-gray-400 italic ${className}`}>
        لا يوجد محتوى للعرض
      </div>
    );
  }

  // إذا لم يكن المحتوى بتنسيق EditorJS، محاولة عرضه كما هو
  if (!content.blocks || !Array.isArray(content.blocks)) {
    return (
      <div className={`text-gray-300 ${className}`}>
        <pre className="whitespace-pre-wrap font-sans">
          {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
        </pre>
      </div>
    );
  }

  const renderBlock = (block: EditorJSBlock, index: number) => {
    const { type, data } = block;

    switch (type) {
      case 'paragraph':
        return (
          <p key={index} className="mb-4 text-gray-300 leading-relaxed">
            {data.text || ''}
          </p>
        );

      case 'header':
        const level = data.level || 1;
        const HeaderTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
        const headerClasses = {
          1: 'text-4xl font-bold mb-6 text-white',
          2: 'text-3xl font-bold mb-5 text-white',
          3: 'text-2xl font-bold mb-4 text-white',
          4: 'text-xl font-bold mb-3 text-white',
          5: 'text-lg font-bold mb-3 text-white',
          6: 'text-base font-bold mb-2 text-white',
        };

        return (
          <HeaderTag key={index} className={headerClasses[level as keyof typeof headerClasses] || headerClasses[1]}>
            {data.text || ''}
          </HeaderTag>
        );

      case 'list':
        const ListTag = data.style === 'ordered' ? 'ol' : 'ul';
        const listClass = data.style === 'ordered' 
          ? 'list-decimal list-inside mb-4 text-gray-300 space-y-2' 
          : 'list-disc list-inside mb-4 text-gray-300 space-y-2';

        return (
          <ListTag key={index} className={listClass}>
            {data.items?.map((item: string, itemIndex: number) => (
              <li key={itemIndex} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ListTag>
        );

      case 'quote':
        return (
          <blockquote key={index} className="border-r-4 border-[#38BDF8] pr-4 mb-4 italic text-gray-300 bg-[#161B22] p-4 rounded-md">
            <p className="mb-2">{data.text || ''}</p>
            {data.caption && (
              <cite className="text-sm text-gray-400">— {data.caption}</cite>
            )}
          </blockquote>
        );

      case 'code':
        return (
          <pre key={index} className="bg-[#0D1117] border border-gray-600 rounded-md p-4 mb-4 overflow-x-auto">
            <code className="text-green-400 text-sm font-mono">
              {data.code || ''}
            </code>
          </pre>
        );

      case 'delimiter':
        return (
          <div key={index} className="text-center my-8">
            <div className="inline-flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        );

      case 'image':
        return (
          <figure key={index} className="mb-6">
            <div className="relative w-full min-h-[300px] bg-gray-100 rounded-md overflow-hidden">
              <img
                src={data.file?.url || data.url || ''}
                alt={data.caption || ''}
                className="w-full h-auto rounded-md"
                loading="lazy"
                width={800}
                height={400}
                style={{ aspectRatio: '16/9', objectFit: 'cover' }}
              />
            </div>
            {data.caption && (
              <figcaption className="text-center text-sm text-gray-400 mt-2">
                {data.caption}
              </figcaption>
            )}
          </figure>
        );

      case 'table':
        return (
          <div key={index} className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-600 rounded-md">
              <tbody>
                {data.content?.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex} className="border-b border-gray-600">
                    {row.map((cell: string, cellIndex: number) => (
                      <td key={cellIndex} className="px-4 py-2 text-gray-300 border-l border-gray-600">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'warning':
        return (
          <div key={index} className="bg-yellow-900/20 border border-yellow-600 rounded-md p-4 mb-4">
            <div className="flex items-start">
              <div className="text-yellow-500 ml-3 mt-1">⚠️</div>
              <div>
                {data.title && (
                  <h4 className="font-bold text-yellow-300 mb-2">{data.title}</h4>
                )}
                <p className="text-yellow-200">{data.message || ''}</p>
              </div>
            </div>
          </div>
        );

      case 'embed':
        return (
          <div key={index} className="mb-6">
            <div className="aspect-video">
              <iframe
                src={data.embed || data.source || ''}
                title={data.caption || 'Embedded content'}
                className="w-full h-full rounded-md"
                allowFullScreen
              />
            </div>
            {data.caption && (
              <p className="text-center text-sm text-gray-400 mt-2">
                {data.caption}
              </p>
            )}
          </div>
        );

      default:
        // للأنواع غير المدعومة، عرض البيانات الخام
        return (
          <div key={index} className="bg-gray-800 border border-gray-600 rounded-md p-4 mb-4">
            <p className="text-gray-400 text-sm mb-2">نوع غير مدعوم: {type}</p>
            <pre className="text-xs text-gray-500 overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className={`prose prose-invert max-w-none ${className}`} style={{ direction: 'rtl' }}>
      {content.blocks.map((block: EditorJSBlock, index: number) => renderBlock(block, index))}
    </div>
  );
}
