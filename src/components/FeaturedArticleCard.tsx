'use client';

// مكون المقال الرئيسي الكبير
import { Article } from "@/types";
import Image from "next/image";
import Link from "next/link";
import SafeDateDisplay from "./SafeDateDisplay";
import { getArticleThumbnail } from "@/lib/imageUtils";

interface FeaturedArticleCardProps {
  article: Article;
}

export function FeaturedArticleCard({ article }: FeaturedArticleCardProps) {
  return (
    <Link href={`/articles/${article.slug}`} className="block group">
      <div className="bg-dark-card rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transform hover:-translate-y-1 h-full">
        <div className="relative w-full h-64 md:h-80 overflow-hidden">
          <Image
            src={getArticleThumbnail(article)}
            alt={article.title}
            title={article.title}
            width={800}
            height={600}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            className="transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              console.log('Image failed to load:', getArticleThumbnail(article));
              e.currentTarget.src = "/assets/default-article-thumb.jpg";
            }}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-background/80 via-dark-background/20 to-transparent"></div>
          
          {/* شارة "مقال رئيسي" */}
          <div className="absolute top-4 right-4">
            <span className="bg-primary text-black px-3 py-1 rounded-full text-sm font-semibold">
              مقال رئيسي
            </span>
          </div>
          
          {/* المحتوى المتراكب */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-black">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
              {article.title}
            </h2>
            <p className="text-black text-base md:text-lg mb-4 leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="text-sm text-black">
                <SafeDateDisplay
                  date={article.published_at}
                  locale="ar-EG"
                  options={{ year: 'numeric', month: 'long', day: 'numeric' }}
                  fallback="تاريخ غير محدد"
                />
              </div>
              <div className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                اقرأ المقال كاملاً
                <svg className="w-5 h-5 mr-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
