// API route لإدارة ads.txt تلقائياً عبر Ezoic
// يوجه الطلبات إلى خدمة Ezoic لإدارة ads.txt

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // الحصول على domain من الطلب
    const host = request.headers.get('host') || 'technoflash.com';
    const domain = host.replace('www.', ''); // إزالة www إذا وجدت
    
    // رابط خدمة Ezoic لإدارة ads.txt
    const ezoicAdsUrl = `https://srv.adstxtmanager.com/19390/${domain}`;
    
    // جلب محتوى ads.txt من Ezoic
    const response = await fetch(ezoicAdsUrl, {
      headers: {
        'User-Agent': 'TechnoFlash-Bot/1.0',
      },
      // تخزين مؤقت لمدة ساعة
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      // في حالة فشل الاتصال مع Ezoic، استخدم المحتوى الاحتياطي
      const fallbackContent = `# ads.txt for ${domain}
# Managed by Ezoic
ezoic.com, 19390, DIRECT
google.com, pub-1234567890123456, RESELLER, f08c47fec0942fa0
google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0

# Contact: i2s2mail22@gmail.com
# Last updated: ${new Date().toISOString().split('T')[0]}`;

      return new NextResponse(fallbackContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=3600', // تخزين مؤقت لساعة
        },
      });
    }

    const content = await response.text();
    
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600', // تخزين مؤقت لساعة
        'X-Ads-Txt-Source': 'ezoic-managed',
      },
    });

  } catch (error) {
    console.error('Error fetching ads.txt:', error);
    
    // محتوى احتياطي في حالة الخطأ
    const fallbackContent = `# ads.txt for technoflash.com
# Emergency fallback content
ezoic.com, 19390, DIRECT
google.com, pub-1234567890123456, RESELLER, f08c47fec0942fa0

# Contact: i2s2mail22@gmail.com`;

    return new NextResponse(fallbackContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=300', // تخزين مؤقت لـ 5 دقائق فقط في حالة الخطأ
      },
    });
  }
}
