'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import SVGIcon from '@/components/SVGIcon';

interface AITool {
  id: string;
  name: string;
  logo_url: string;
  category: string;
}

export default function TestIconsPage() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTools() {
      try {
        const { data, error } = await supabase
          .from('ai_tools')
          .select('id, name, logo_url, category')
          .limit(20)
          .order('name');

        if (error) {
          console.error('Error fetching tools:', error);
        } else {
          setTools(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTools();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="text-white">جاري تحميل الأيقونات...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          اختبار أيقونات أدوات الذكاء الاصطناعي
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-dark-card rounded-xl p-4 border border-gray-800 text-center"
            >
              <div className="relative w-16 h-16 mx-auto mb-3">
                <SVGIcon
                  src={tool.logo_url}
                  alt={tool.name}
                  fill
                  className="rounded-lg"
                  fallbackIcon="🤖"
                />
              </div>
              <h3 className="text-white text-sm font-medium mb-1 line-clamp-2">
                {tool.name}
              </h3>
              <p className="text-dark-text-secondary text-xs">
                {tool.category}
              </p>
              <div className="mt-2 text-xs text-gray-500 break-all">
                {tool.logo_url}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-dark-card rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">
            اختبار أيقونات مباشرة
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <SVGIcon
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/openai.svg"
                  alt="OpenAI"
                  fill
                  fallbackIcon="🤖"
                />
              </div>
              <p className="text-white text-sm">OpenAI</p>
            </div>
            
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <SVGIcon
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/anthropic.svg"
                  alt="Anthropic"
                  fill
                  fallbackIcon="🤖"
                />
              </div>
              <p className="text-white text-sm">Anthropic</p>
            </div>
            
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <SVGIcon
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/figma.svg"
                  alt="Figma"
                  fill
                  fallbackIcon="🤖"
                />
              </div>
              <p className="text-white text-sm">Figma</p>
            </div>
            
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <SVGIcon
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/github.svg"
                  alt="GitHub"
                  fill
                  fallbackIcon="🤖"
                />
              </div>
              <p className="text-white text-sm">GitHub</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition-colors"
          >
            العودة للصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}
