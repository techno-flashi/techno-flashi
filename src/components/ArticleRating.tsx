'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ArticleRatingProps {
  articleId: string;
  articleTitle: string;
}

export default function ArticleRating({ articleId, articleTitle }: ArticleRatingProps) {
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
    checkUserRating();
  }, [articleId]);

  const fetchRatings = async () => {
    try {
      const { data, error } = await supabase
        .from('article_ratings')
        .select('rating')
        .eq('article_id', articleId);

      if (error) throw error;

      if (data && data.length > 0) {
        const total = data.length;
        const sum = data.reduce((acc, item) => acc + item.rating, 0);
        const avg = sum / total;
        
        setAverageRating(Math.round(avg * 10) / 10);
        setTotalRatings(total);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserRating = () => {
    // التحقق من localStorage لمعرفة إذا كان المستخدم قد قيم المقال مسبقاً
    const userRatings = JSON.parse(localStorage.getItem('userRatings') || '{}');
    if (userRatings[articleId]) {
      setHasRated(true);
      setRating(userRatings[articleId]);
    }
  };

  const handleRating = async (newRating: number) => {
    if (hasRated) return;

    try {
      // حفظ التقييم في قاعدة البيانات
      const { error } = await supabase
        .from('article_ratings')
        .insert([
          {
            article_id: articleId,
            rating: newRating,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      // حفظ التقييم في localStorage
      const userRatings = JSON.parse(localStorage.getItem('userRatings') || '{}');
      userRatings[articleId] = newRating;
      localStorage.setItem('userRatings', JSON.stringify(userRatings));

      setRating(newRating);
      setHasRated(true);
      
      // تحديث المتوسط
      fetchRatings();
    } catch (error) {
      console.error('Error saving rating:', error);
    }
  };

  const renderStars = (interactive = false) => {
    const stars = [];
    const displayRating = interactive ? rating : averageRating;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          onClick={() => interactive && !hasRated && handleRating(i)}
          onMouseEnter={() => interactive && !hasRated && setRating(i)}
          onMouseLeave={() => interactive && !hasRated && setRating(0)}
          disabled={hasRated}
          className={`text-2xl transition-colors duration-200 ${
            interactive && !hasRated 
              ? 'hover:scale-110 cursor-pointer' 
              : hasRated 
                ? 'cursor-not-allowed' 
                : 'cursor-default'
          } ${
            i <= displayRating 
              ? 'text-yellow-400' 
              : 'text-gray-600'
          }`}
        >
          ⭐
        </button>
      );
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-4">
        ⭐ تقييم المقال
      </h3>
      
      {/* عرض المتوسط */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex">{renderStars(false)}</div>
          <span className="text-white font-medium">
            {averageRating > 0 ? averageRating.toFixed(1) : 'لا توجد تقييمات'}
          </span>
        </div>
        <p className="text-gray-400 text-sm">
          {totalRatings > 0 
            ? `بناءً على ${totalRatings} تقييم${totalRatings > 1 ? 'ات' : ''}`
            : 'كن أول من يقيم هذا المقال'
          }
        </p>
      </div>

      {/* تقييم المستخدم */}
      {!hasRated ? (
        <div>
          <p className="text-white mb-3">قيم هذا المقال:</p>
          <div className="flex items-center gap-1">
            {renderStars(true)}
          </div>
          <p className="text-gray-400 text-sm mt-2">
            انقر على النجوم لإضافة تقييمك
          </p>
        </div>
      ) : (
        <div className="bg-green-500 bg-opacity-20 text-green-200 p-4 rounded-lg">
          <p className="font-medium">شكراً لك على التقييم! ⭐</p>
          <p className="text-sm">لقد قيمت هذا المقال بـ {rating} نجوم</p>
        </div>
      )}
    </div>
  );
}
