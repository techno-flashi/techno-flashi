'use client';

import SocialShare from '@/components/SocialShare';
import SocialShareCompact from '@/components/SocialShareCompact';
import { getSharingUrl, getSharingHashtags } from '@/lib/social-meta';

export default function TestSocialPage() {
  return (
    <div className="min-h-screen bg-dark-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          اختبار مكونات المشاركة الاجتماعية
        </h1>
        
        {/* Test Regular Social Share */}
        <section className="mb-12 bg-dark-card p-8 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">مكون المشاركة العادي</h2>
          
          <div className="space-y-8">
            {/* Small Size */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">حجم صغير (sm)</h3>
              <SocialShare
                url={getSharingUrl('/test-social')}
                title="اختبار المشاركة الاجتماعية - TechnoFlash"
                description="صفحة اختبار لمكونات المشاركة الاجتماعية"
                hashtags={getSharingHashtags(['اختبار', 'مشاركة'])}
                size="sm"
                className="justify-center"
              />
            </div>
            
            {/* Medium Size */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">حجم متوسط (md)</h3>
              <SocialShare
                url={getSharingUrl('/test-social')}
                title="اختبار المشاركة الاجتماعية - TechnoFlash"
                description="صفحة اختبار لمكونات المشاركة الاجتماعية"
                hashtags={getSharingHashtags(['اختبار', 'مشاركة'])}
                size="md"
                className="justify-center"
              />
            </div>
            
            {/* Large Size with Labels */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">حجم كبير مع التسميات (lg)</h3>
              <SocialShare
                url={getSharingUrl('/test-social')}
                title="اختبار المشاركة الاجتماعية - TechnoFlash"
                description="صفحة اختبار لمكونات المشاركة الاجتماعية"
                hashtags={getSharingHashtags(['اختبار', 'مشاركة'])}
                size="lg"
                showLabels={true}
                className="justify-center"
              />
            </div>
          </div>
        </section>
        
        {/* Test Compact Social Share */}
        <section className="mb-12 bg-dark-card p-8 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">مكون المشاركة المدمج</h2>
          
          <div className="flex justify-center">
            <SocialShareCompact
              url={getSharingUrl('/test-social')}
              title="اختبار المشاركة الاجتماعية - TechnoFlash"
              description="صفحة اختبار لمكونات المشاركة الاجتماعية"
            />
          </div>
        </section>
        
        {/* Test Different Content Types */}
        <section className="mb-12 bg-dark-card p-8 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">اختبار أنواع المحتوى المختلفة</h2>
          
          <div className="space-y-8">
            {/* AI Tool Example */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">مثال أداة ذكاء اصطناعي</h3>
              <SocialShare
                url={getSharingUrl('/ai-tools/chatgpt')}
                title="ChatGPT - أداة ذكاء اصطناعي"
                description="أداة ذكاء اصطناعي متقدمة للمحادثة وإنتاج النصوص"
                hashtags={getSharingHashtags(['ChatGPT', 'ذكاء_اصطناعي', 'محادثة'])}
                showLabels={true}
                size="md"
                className="justify-center"
              />
            </div>
            
            {/* Article Example */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">مثال مقال</h3>
              <SocialShare
                url={getSharingUrl('/articles/test-article')}
                title="مقال تقني حول الذكاء الاصطناعي"
                description="مقال شامل يتناول أحدث التطورات في مجال الذكاء الاصطناعي"
                hashtags={getSharingHashtags(['مقال', 'تقنية', 'ذكاء_اصطناعي'])}
                showLabels={true}
                size="md"
                className="justify-center"
              />
            </div>
            
            {/* Service Example */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">مثال خدمة</h3>
              <SocialShare
                url={getSharingUrl('/services/web-development')}
                title="خدمة تطوير المواقع - TechnoFlash"
                description="خدمة متخصصة في تطوير المواقع والتطبيقات الحديثة"
                hashtags={getSharingHashtags(['تطوير_مواقع', 'خدمات', 'برمجة'])}
                showLabels={true}
                size="md"
                className="justify-center"
              />
            </div>
          </div>
        </section>
        
        {/* Test Arabic Content */}
        <section className="mb-12 bg-dark-card p-8 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">اختبار المحتوى العربي</h2>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">نص عربي طويل مع رموز خاصة</h3>
            <SocialShare
              url={getSharingUrl('/test-arabic')}
              title="اختبار النصوص العربية الطويلة والرموز الخاصة: ؟!@#$%^&*()"
              description="هذا نص تجريبي طويل باللغة العربية يحتوي على رموز خاصة ومسافات وأرقام 123 لاختبار التشفير الصحيح للمحتوى العربي في وسائل التواصل الاجتماعي"
              hashtags={getSharingHashtags(['عربي', 'اختبار', 'تشفير', 'نصوص'])}
              showLabels={true}
              size="lg"
              className="justify-center"
            />
          </div>
        </section>
        
        {/* Instructions */}
        <section className="bg-blue-900/20 p-8 rounded-lg border border-blue-700">
          <h2 className="text-2xl font-bold text-white mb-6">تعليمات الاختبار</h2>
          
          <div className="text-dark-text-secondary space-y-4">
            <p>• اختبر كل زر مشاركة للتأكد من فتح النافذة الصحيحة</p>
            <p>• تحقق من أن المحتوى العربي يظهر بشكل صحيح</p>
            <p>• اختبر زر نسخ الرابط والتأكد من ظهور رسالة النجاح</p>
            <p>• تحقق من أن الروابط تحتوي على المعاملات الصحيحة</p>
            <p>• اختبر المكون المدمج والتأكد من عمل القائمة المنسدلة</p>
            <p>• تحقق من الاستجابة على الأجهزة المحمولة</p>
          </div>
        </section>
      </div>
    </div>
  );
}
