'use client';

import { useState } from 'react';

interface SpacingDebuggerProps {
  enabled?: boolean;
}

/**
 * مكون تشخيص المساحات الفارغة
 * يساعد في اكتشاف المساحات غير المرغوب فيها
 */
export default function SpacingDebugger({ enabled = process.env.NODE_ENV === 'development' }: SpacingDebuggerProps) {
  const [showDebug, setShowDebug] = useState(false);

  if (!enabled) return null;

  return (
    <>
      {/* زر التشخيص */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors ${
            showDebug 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {showDebug ? '🔍 إخفاء التشخيص' : '🔍 تشخيص المساحات'}
        </button>
      </div>

      {/* CSS للتشخيص */}
      {showDebug && (
        <style jsx global>{`
          /* تمييز جميع العناصر */
          * {
            outline: 1px solid rgba(255, 0, 0, 0.3) !important;
            background: rgba(255, 0, 0, 0.05) !important;
          }

          /* تمييز المساحات الفارغة */
          div:empty {
            background: rgba(255, 255, 0, 0.3) !important;
            min-height: 20px !important;
            outline: 2px solid yellow !important;
          }

          /* تمييز العناصر بـ margin كبير */
          *[class*="mb-8"],
          *[class*="mt-8"],
          *[class*="my-8"],
          *[class*="mb-6"],
          *[class*="mt-6"],
          *[class*="my-6"] {
            outline: 3px solid orange !important;
            background: rgba(255, 165, 0, 0.2) !important;
          }

          /* تمييز العناصر بـ padding كبير */
          *[class*="pb-8"],
          *[class*="pt-8"],
          *[class*="py-8"],
          *[class*="pb-6"],
          *[class*="pt-6"],
          *[class*="py-6"] {
            outline: 3px solid purple !important;
            background: rgba(128, 0, 128, 0.2) !important;
          }

          /* تمييز مكونات الإعلانات */
          *[class*="smart-ad"],
          *[class*="ad-"],
          *[class*="banner"] {
            outline: 4px solid lime !important;
            background: rgba(0, 255, 0, 0.3) !important;
          }

          /* تمييز المساحات الكبيرة */
          div[style*="height"],
          div[style*="min-height"] {
            outline: 3px solid cyan !important;
            background: rgba(0, 255, 255, 0.2) !important;
          }

          /* إضافة تسميات للعناصر */
          div:empty::before {
            content: "عنصر فارغ";
            color: red;
            font-size: 12px;
            font-weight: bold;
            position: absolute;
            background: yellow;
            padding: 2px 4px;
            border-radius: 3px;
            z-index: 1000;
          }

          *[class*="mb-8"]::before,
          *[class*="mt-8"]::before,
          *[class*="my-8"]::before {
            content: "margin-8";
            color: orange;
            font-size: 10px;
            font-weight: bold;
            position: absolute;
            background: rgba(255, 165, 0, 0.8);
            padding: 1px 3px;
            border-radius: 2px;
            z-index: 1000;
          }

          *[class*="smart-ad"]::before {
            content: "إعلان ذكي";
            color: white;
            font-size: 10px;
            font-weight: bold;
            position: absolute;
            background: lime;
            padding: 1px 3px;
            border-radius: 2px;
            z-index: 1000;
          }
        `}</style>
      )}

      {/* معلومات التشخيص */}
      {showDebug && (
        <div className="fixed top-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg z-50 max-w-sm">
          <h3 className="font-bold mb-2">🔍 تشخيص المساحات</h3>
          <div className="text-xs space-y-1">
            <div><span className="inline-block w-3 h-3 bg-red-500 mr-2"></span>جميع العناصر</div>
            <div><span className="inline-block w-3 h-3 bg-yellow-500 mr-2"></span>عناصر فارغة</div>
            <div><span className="inline-block w-3 h-3 bg-orange-500 mr-2"></span>margin كبير</div>
            <div><span className="inline-block w-3 h-3 bg-purple-500 mr-2"></span>padding كبير</div>
            <div><span className="inline-block w-3 h-3 bg-lime-500 mr-2"></span>مكونات إعلانات</div>
            <div><span className="inline-block w-3 h-3 bg-cyan-500 mr-2"></span>ارتفاع محدد</div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * مكون تشخيص مبسط للإعلانات فقط
 */
export function AdDebugger({ enabled = process.env.NODE_ENV === 'development' }: SpacingDebuggerProps) {
  const [showDebug, setShowDebug] = useState(false);

  if (!enabled) return null;

  return (
    <>
      <div className="fixed bottom-16 right-4 z-50">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className={`px-3 py-2 rounded-lg text-white text-sm font-semibold transition-colors ${
            showDebug 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          {showDebug ? '📢 إخفاء الإعلانات' : '📢 إظهار الإعلانات'}
        </button>
      </div>

      {showDebug && (
        <style jsx global>{`
          /* تمييز مكونات الإعلانات فقط */
          *[class*="smart-ad"],
          *[class*="ad-"],
          *[class*="banner"],
          *[class*="advertisement"] {
            outline: 3px solid lime !important;
            background: rgba(0, 255, 0, 0.2) !important;
            position: relative !important;
          }

          *[class*="smart-ad"]::before,
          *[class*="ad-"]::before,
          *[class*="banner"]::before {
            content: "📢 إعلان";
            color: white;
            font-size: 12px;
            font-weight: bold;
            position: absolute;
            background: lime;
            padding: 2px 6px;
            border-radius: 3px;
            z-index: 1000;
            top: 0;
            right: 0;
          }

          /* تمييز الإعلانات الفارغة */
          *[class*="smart-ad"]:empty,
          *[class*="ad-"]:empty {
            background: rgba(255, 0, 0, 0.3) !important;
            outline: 3px solid red !important;
            min-height: 30px !important;
          }

          *[class*="smart-ad"]:empty::before,
          *[class*="ad-"]:empty::before {
            content: "❌ إعلان فارغ";
            background: red;
          }
        `}</style>
      )}
    </>
  );
}
