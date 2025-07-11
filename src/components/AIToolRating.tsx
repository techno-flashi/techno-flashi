'use client';

import { useState } from 'react';

interface AIToolRatingProps {
  toolId: string;
  currentRating: number;
  totalReviews: number;
  className?: string;
}

export function AIToolRating({ toolId, currentRating, totalReviews, className = '' }: AIToolRatingProps) {
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  const handleRating = async (rating: number) => {
    try {
      // هنا يمكن إضافة API call لحفظ التقييم
      setUserRating(rating);
      setHasRated(true);
      
      // يمكن إضافة toast notification هنا
      console.log(`تم تقييم الأداة ${toolId} بـ ${rating} نجوم`);
    } catch (error) {
      console.error('خطأ في حفظ التقييم:', error);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoveredRating || userRating || currentRating);
      stars.push(
        <button
          key={i}
          onClick={() => !hasRated && handleRating(i)}
          onMouseEnter={() => !hasRated && setHoveredRating(i)}
          onMouseLeave={() => !hasRated && setHoveredRating(0)}
          disabled={hasRated}
          className={`text-2xl transition-colors duration-200 ${
            hasRated 
              ? 'cursor-default' 
              : 'cursor-pointer hover:scale-110 transform transition-transform'
          } ${
            isFilled 
              ? 'text-yellow-400' 
              : 'text-gray-600 hover:text-yellow-300'
          }`}
        >
          ⭐
        </button>
      );
    }
    return stars;
  };

  return (
    <div className={`bg-dark-card rounded-xl p-6 border border-gray-800 ${className}`}>
      <h3 className="text-xl font-bold text-white mb-4">تقييم الأداة</h3>
      
      {/* التقييم الحالي */}
      <div className="flex items-center mb-4">
        <div className="flex items-center ml-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-xl ${
                star <= currentRating ? 'text-yellow-400' : 'text-gray-600'
              }`}
            >
              ⭐
            </span>
          ))}
        </div>
        <div className="text-white">
          <span className="text-2xl font-bold">{currentRating.toFixed(1)}</span>
          <span className="text-dark-text-secondary mr-2">
            ({totalReviews} مراجعة)
          </span>
        </div>
      </div>

      {/* تقييم المستخدم */}
      {!hasRated ? (
        <div>
          <p className="text-dark-text-secondary mb-3">قيم هذه الأداة:</p>
          <div className="flex items-center space-x-1 space-x-reverse mb-4">
            {renderStars()}
          </div>
          {hoveredRating > 0 && (
            <p className="text-sm text-primary">
              {hoveredRating === 1 && 'ضعيف جداً'}
              {hoveredRating === 2 && 'ضعيف'}
              {hoveredRating === 3 && 'متوسط'}
              {hoveredRating === 4 && 'جيد'}
              {hoveredRating === 5 && 'ممتاز'}
            </p>
          )}
        </div>
      ) : (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-green-400 text-xl ml-2">✓</span>
            <span className="text-green-400 font-medium">
              شكراً لك! تم حفظ تقييمك ({userRating} نجوم)
            </span>
          </div>
        </div>
      )}

      {/* توزيع التقييمات */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-3">توزيع التقييمات</h4>
        {[5, 4, 3, 2, 1].map((rating) => {
          // هذه البيانات يجب أن تأتي من قاعدة البيانات
          const percentage = Math.random() * 100; // مؤقت للعرض
          return (
            <div key={rating} className="flex items-center mb-2">
              <span className="text-sm text-dark-text-secondary w-8">
                {rating}⭐
              </span>
              <div className="flex-1 bg-gray-700 rounded-full h-2 mx-3">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-dark-text-secondary w-12">
                {percentage.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
