// هذا مكون واجهة مستخدم قابل لإعادة الاستخدام لعرض "بطاقة مقال"
'use client';

import { Article } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="block group focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-xl"
      aria-label={`قراءة مقال: ${article.title}`}
    >
      <div className="bg-dark-card rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transform hover:-translate-y-2 active:scale-95 h-full">
        <div className="relative w-full h-48 overflow-hidden bg-background-secondary">
          <Image
            src={article.featured_image_url || "https://placehold.co/600x400/0D1117/38BDF8?text=TechnoFlash"}
            alt={`صورة مقال: ${article.title}`}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-500 group-hover:scale-110"
            priority={false}
            quality={80}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-dark-text-secondary text-sm mb-4 leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-xs text-dark-text-secondary">
              {new Date(article.published_at).toLocaleDateString('ar-EG', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </div>
            <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
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
