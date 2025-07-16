import SVGIcon from './SVGIcon';
import { AITool } from '@/types';
import { AIToolLink } from './AIToolLink';

interface RelatedAIToolsProps {
  tools: AITool[];
  currentToolId: string;
  className?: string;
}

export function RelatedAITools({ tools, currentToolId, className = '' }: RelatedAIToolsProps) {
  // فلترة الأدوات لاستبعاد الأداة الحالية
  const relatedTools = tools.filter(tool => tool.id !== currentToolId).slice(0, 6);

  if (relatedTools.length === 0) {
    return null;
  }

  return (
    <div className={`bg-dark-card rounded-xl p-8 border border-gray-800 ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-6">أدوات مشابهة</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedTools.map((tool) => (
          <AIToolLink
            key={tool.id}
            href={`/ai-tools/${tool.slug}`}
            className="bg-dark-bg/50 border border-gray-700 rounded-lg p-4 hover:border-primary transition-all duration-300 group"
          >
            <div className="flex items-center mb-3">
              <div className="relative w-12 h-12 ml-3">
                <SVGIcon
                  src={tool.logo_url || "https://placehold.co/100x100/38BDF8/FFFFFF?text=AI"}
                  alt={tool.name}
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded"
                  fallbackIcon="🤖"
                />
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <div className="flex items-center">
                  <span className="text-yellow-400 text-sm">⭐</span>
                  <span className="text-dark-text-secondary text-sm mr-1">{tool.rating}</span>
                </div>
              </div>
            </div>
            <p className="text-dark-text-secondary text-sm line-clamp-2">
              {tool.description}
            </p>
          </AIToolLink>
        ))}
      </div>
    </div>
  );
}
