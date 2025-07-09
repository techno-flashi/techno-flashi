// صفحة اختبار الصور
import { supabase } from "@/lib/supabase";
import { Article } from "@/types";
import Image from "next/image";

export const revalidate = 0; // لا نريد cache للاختبار

async function getArticlesForTest() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
  return data as Article[];
}

export default async function TestImagesPage() {
  const articles = await getArticlesForTest();

  return (
    <div className="min-h-screen py-20 px-4 bg-dark-background">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          اختبار عرض صور المقالات
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="bg-dark-card rounded-xl overflow-hidden border border-gray-800">
              {/* اختبار الصورة */}
              <div className="relative w-full h-48">
                <Image
                  src={article.featured_image_url || "https://placehold.co/600x400/0D1117/38BDF8?text=No+Image"}
                  alt={article.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              
              {/* معلومات المقال */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2">
                  {article.title}
                </h3>
                <p className="text-dark-text-secondary text-sm mb-3">
                  {article.excerpt}
                </p>
                <div className="text-xs text-gray-400">
                  <strong>رابط الصورة:</strong>
                  <br />
                  <span className="break-all">{article.featured_image_url}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-white mb-2">لا توجد مقالات</h3>
            <p className="text-dark-text-secondary">لم يتم العثور على أي مقالات منشورة</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href="/"
            className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            العودة للرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}
