// هذا مكون واجهة مستخدم قابل لإعادة الاستخدام لعرض "بطاقة مقال"
'use client';

import { Article } from "@/types";
import Link from "next/link";
import Image from "next/image";
import SafeDateDisplay from "./SafeDateDisplay";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="block group focus-modern rounded-2xl"
      aria-label={`قراءة مقال: ${article.title}`}
    >
      <div className="modern-card overflow-hidden hover-lift smooth-transition h-full border border-gray-200 hover:border-blue-300">
        <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 rounded-t-2xl">
          {article.featured_image_url && !article.featured_image_url.includes('placehold.co') ? (
            <>
              <Image
                src={article.featured_image_url}
                alt={`صورة مقال: ${article.title}`}
                width={600}
                height={400}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                className="transition-transform duration-500 group-hover:scale-110"
                priority={false}
                quality={80}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  // إخفاء الصورة في حالة الخطأ وإظهار الأيقونة
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                  if (fallback) {
                    (fallback as HTMLElement).style.display = 'flex';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </>
          ) : null}

          {/* أيقونة احتياطية بدلاً من placeholder */}
          <div
            className={`fallback-icon absolute inset-0 flex items-center justify-center ${
              article.featured_image_url && !article.featured_image_url.includes('placehold.co') ? 'hidden' : 'flex'
            }`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-purple-700 font-medium">TechnoFlash</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600 font-medium">
              <SafeDateDisplay
                date={article.published_at}
                locale="ar-EG"
                options={{ year: 'numeric', month: 'long', day: 'numeric' }}
                fallback="تاريخ غير محدد"
              />
            </div>
            <div className="flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
              <span>اقرأ المزيد</span>
              <svg className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
