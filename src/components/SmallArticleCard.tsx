'use client';

// مكون المقال الصغير
import { Article } from "@/types";
import Image from "next/image";
import Link from "next/link";
import SafeDateDisplay from "./SafeDateDisplay";

interface SmallArticleCardProps {
  article: Article;
}

export function SmallArticleCard({ article }: SmallArticleCardProps) {
  return (
    <Link href={`/articles/${article.slug}`} className="block group">
      <div className="bg-dark-card rounded-lg overflow-hidden border border-gray-800 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transform hover:-translate-y-1 h-full">
        <div className="flex">
          {/* الصورة الصغيرة */}
          <div className="relative w-24 h-20 flex-shrink-0 overflow-hidden">
            <Image
              src={article.featured_image_url || "https://placehold.co/200x150/0D1117/38BDF8?text=T"}
              alt={article.title}
              title={article.title}
              width={200}
              height={150}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              className="transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                console.log('Image failed to load:', article.featured_image_url);
                e.currentTarget.src = "https://placehold.co/200x150/0D1117/38BDF8?text=T";
              }}
              unoptimized
            />
          </div>
          
          {/* المحتوى */}
          <div className="flex-1 p-4">
            <h3 className="text-sm font-bold text-text-primary mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
              {article.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="text-xs text-text-description">
                <SafeDateDisplay
                  date={article.published_at}
                  locale="ar-EG"
                  options={{ month: 'short', day: 'numeric' }}
                  fallback="غير محدد"
                />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
