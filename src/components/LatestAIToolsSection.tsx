'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AITool } from '@/types';
import { supabase } from '@/lib/supabase';

interface LatestAIToolsSectionProps {
  className?: string;
}

export default function LatestAIToolsSection({ className = '' }: LatestAIToolsSectionProps) {
  const [aiTools, setAiTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestAITools();
  }, []);

  const fetchLatestAITools = async () => {
    try {
      console.log('🤖 Fetching latest AI tools...');
      
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('❌ Error fetching AI tools:', error);
        return;
      }

      console.log(`✅ Fetched ${data?.length || 0} AI tools`);
      setAiTools(data || []);
    } catch (error) {
      console.error('💥 Error in fetchLatestAITools:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={`py-20 px-4 bg-gradient-to-br from-gray-50 to-white ${className}`}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">أحدث أدوات الذكاء الاصطناعي</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              اكتشف أحدث وأقوى أدوات الذكاء الاصطناعي التي تساعدك في تطوير مشاريعك
            </p>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 px-4 bg-gradient-to-br from-gray-50 to-white ${className}`}>
      <div className="container mx-auto">
        {/* عنوان القسم */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            أحدث أدوات الذكاء الاصطناعي
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اكتشف أحدث وأقوى أدوات الذكاء الاصطناعي التي تساعدك في تطوير مشاريعك وتحسين إنتاجيتك
          </p>
        </div>

        {/* شبكة الأدوات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {aiTools.map((tool, index) => (
            <div
              key={tool.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* صورة الأداة */}
              <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                {tool.logo_url ? (
                  <Image
                    src={tool.logo_url}
                    alt={tool.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* شارة الفئة */}
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur-sm text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                    {tool.category || 'AI Tool'}
                  </span>
                </div>
              </div>

              {/* محتوى البطاقة */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {tool.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {tool.description || 'أداة ذكاء اصطناعي متقدمة لتحسين الإنتاجية'}
                </p>

                {/* معلومات إضافية */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {tool.pricing === 'free' && (
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                        مجاني
                      </span>
                    )}
                    {tool.pricing === 'freemium' && (
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                        مجاني جزئياً
                      </span>
                    )}
                    {tool.pricing === 'paid' && (
                      <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                        مدفوع
                      </span>
                    )}
                  </div>
                  
                  {tool.rating && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-gray-600">{tool.rating}</span>
                    </div>
                  )}
                </div>

                {/* زر الانتقال */}
                <Link
                  href={`/ai-tools/${tool.slug || tool.id}`}
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform group-hover:scale-105"
                >
                  استكشف الأداة
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* زر عرض المزيد */}
        <div className="text-center">
          <Link
            href="/ai-tools"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>عرض جميع الأدوات</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
