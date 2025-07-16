#!/usr/bin/env node

/**
 * مدقق صحة الموقع الشامل - TechnoFlash
 * يكتشف المشاكل التقنية قبل أن يكتشفها Google
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs').promises;
const { createClient } = require('@supabase/supabase-js');

// إعدادات الموقع
const SITE_CONFIG = {
  baseUrl: 'https://tflash.site',
  sitemap: 'https://tflash.site/sitemap.xml',
  robots: 'https://tflash.site/robots.txt',
  supabaseUrl: 'https://zgktrwpladrkhhemhnni.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna3Ryd3BsYWRya2hoZW1obm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMjk0NTIsImV4cCI6MjA2NzYwNTQ1Mn0.uHKisokqk484Vq5QjCbVbcdcabxArrtKUMxjdCihe04'
};

// إنشاء عميل Supabase
const supabase = createClient(SITE_CONFIG.supabaseUrl, SITE_CONFIG.supabaseKey);

class WebsiteHealthChecker {
  constructor() {
    this.results = {
      critical: [],
      high: [],
      medium: [],
      low: [],
      info: []
    };
    this.checkedUrls = new Set();
    this.startTime = Date.now();
  }

  // إضافة مشكلة إلى النتائج
  addIssue(severity, category, message, details = {}) {
    const issue = {
      severity,
      category,
      message,
      details,
      timestamp: new Date().toISOString()
    };
    
    this.results[severity].push(issue);
    console.log(`[${severity.toUpperCase()}] ${category}: ${message}`);
  }

  // طلب HTTP مع معالجة الأخطاء
  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const req = client.request(url, {
        method: options.method || 'GET',
        timeout: options.timeout || 10000,
        headers: {
          'User-Agent': 'TechnoFlash-HealthChecker/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          ...options.headers
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            url: url
          });
        });
      });

      req.on('error', reject);
      req.on('timeout', () => reject(new Error('Request timeout')));
      req.end();
    });
  }

  // فحص حالة الرابط
  async checkUrl(url, context = '') {
    if (this.checkedUrls.has(url)) return null;
    this.checkedUrls.add(url);

    try {
      const response = await this.makeRequest(url);
      
      if (response.statusCode >= 400) {
        this.addIssue('critical', 'Broken Link', `${url} returns ${response.statusCode}`, {
          context,
          statusCode: response.statusCode,
          url
        });
        return response;
      }

      if (response.statusCode >= 300 && response.statusCode < 400) {
        this.addIssue('medium', 'Redirect', `${url} redirects to ${response.headers.location}`, {
          context,
          statusCode: response.statusCode,
          location: response.headers.location,
          url
        });
      }

      return response;
    } catch (error) {
      this.addIssue('critical', 'Connection Error', `Cannot connect to ${url}: ${error.message}`, {
        context,
        error: error.message,
        url
      });
      return null;
    }
  }

  // فحص SEO الأساسي
  checkSEO(html, url) {
    const issues = [];

    // فحص العنوان
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (!titleMatch) {
      this.addIssue('critical', 'SEO', 'Missing title tag', { url });
    } else {
      const title = titleMatch[1].trim();
      if (title.length < 10) {
        this.addIssue('high', 'SEO', 'Title too short (< 10 characters)', { url, title });
      }
      if (title.length > 60) {
        this.addIssue('medium', 'SEO', 'Title too long (> 60 characters)', { url, title });
      }
    }

    // فحص الوصف
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    if (!descMatch) {
      this.addIssue('high', 'SEO', 'Missing meta description', { url });
    } else {
      const desc = descMatch[1].trim();
      if (desc.length < 50) {
        this.addIssue('medium', 'SEO', 'Meta description too short (< 50 characters)', { url, description: desc });
      }
      if (desc.length > 160) {
        this.addIssue('medium', 'SEO', 'Meta description too long (> 160 characters)', { url, description: desc });
      }
    }

    // فحص H1
    const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gi);
    if (!h1Matches) {
      this.addIssue('high', 'SEO', 'Missing H1 tag', { url });
    } else if (h1Matches.length > 1) {
      this.addIssue('low', 'SEO', `Multiple H1 tags found (${h1Matches.length})`, { url, count: h1Matches.length });
    }

    // فحص الصور بدون alt
    const imgMatches = html.match(/<img[^>]*>/gi) || [];
    imgMatches.forEach(img => {
      if (!img.includes('alt=')) {
        this.addIssue('medium', 'Accessibility', 'Image without alt attribute', { url, img });
      }
    });

    // فحص الروابط الداخلية
    const linkMatches = html.match(/<a[^>]*href=["'](.*?)["'][^>]*>/gi) || [];
    const internalLinks = linkMatches
      .map(link => {
        const hrefMatch = link.match(/href=["'](.*?)["']/i);
        return hrefMatch ? hrefMatch[1] : null;
      })
      .filter(href => href && (href.startsWith('/') || href.includes('tflash.site')))
      .map(href => href.startsWith('/') ? SITE_CONFIG.baseUrl + href : href);

    return internalLinks;
  }

  // فحص الأداء
  checkPerformance(html, headers) {
    // فحص ضغط GZIP
    if (!headers['content-encoding'] || !headers['content-encoding'].includes('gzip')) {
      this.addIssue('medium', 'Performance', 'GZIP compression not enabled', { headers });
    }

    // فحص حجم HTML
    const htmlSize = Buffer.byteLength(html, 'utf8');
    if (htmlSize > 100000) { // 100KB
      this.addIssue('medium', 'Performance', `Large HTML size: ${Math.round(htmlSize/1024)}KB`, { size: htmlSize });
    }

    // فحص Cache-Control
    if (!headers['cache-control']) {
      this.addIssue('low', 'Performance', 'Missing Cache-Control header', { headers });
    }
  }

  // فحص الأمان
  checkSecurity(headers) {
    const securityHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'strict-transport-security'
    ];

    securityHeaders.forEach(header => {
      if (!headers[header]) {
        this.addIssue('medium', 'Security', `Missing security header: ${header}`, { headers });
      }
    });

    // فحص HTTPS
    if (!headers['strict-transport-security']) {
      this.addIssue('high', 'Security', 'Missing HSTS header', { headers });
    }
  }

  // فحص قاعدة البيانات
  async checkDatabase() {
    try {
      // فحص المقالات
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('title, slug, featured_image_url, excerpt')
        .eq('status', 'published');

      if (articlesError) {
        this.addIssue('critical', 'Database', `Articles query failed: ${articlesError.message}`);
        return;
      }

      // فحص المقالات بدون صور
      const articlesWithoutImages = articles.filter(a => !a.featured_image_url || a.featured_image_url.trim() === '');
      if (articlesWithoutImages.length > 0) {
        this.addIssue('medium', 'Content', `${articlesWithoutImages.length} articles without featured images`, {
          articles: articlesWithoutImages.map(a => a.slug)
        });
      }

      // فحص المقالات بدون وصف
      const articlesWithoutExcerpt = articles.filter(a => !a.excerpt || a.excerpt.trim() === '' || a.excerpt.length < 50);
      if (articlesWithoutExcerpt.length > 0) {
        this.addIssue('medium', 'SEO', `${articlesWithoutExcerpt.length} articles with poor excerpts`, {
          articles: articlesWithoutExcerpt.map(a => a.slug)
        });
      }

      // فحص أدوات الذكاء الاصطناعي
      const { data: aiTools, error: toolsError } = await supabase
        .from('ai_tools')
        .select('name, slug, website_url')
        .eq('status', 'published');

      if (toolsError) {
        this.addIssue('critical', 'Database', `AI tools query failed: ${toolsError.message}`);
        return;
      }

      // فحص الأدوات بدون روابط
      const toolsWithoutUrls = aiTools.filter(t => !t.website_url || t.website_url.trim() === '');
      if (toolsWithoutUrls.length > 0) {
        this.addIssue('high', 'Content', `${toolsWithoutUrls.length} AI tools without website URLs`, {
          tools: toolsWithoutUrls.map(t => t.slug)
        });
      }

      this.addIssue('info', 'Database', `Database check completed: ${articles.length} articles, ${aiTools.length} AI tools`);

    } catch (error) {
      this.addIssue('critical', 'Database', `Database connection failed: ${error.message}`);
    }
  }

  // فحص ملفات النظام
  async checkSystemFiles() {
    const systemFiles = [
      { url: SITE_CONFIG.robots, name: 'robots.txt' },
      { url: SITE_CONFIG.sitemap, name: 'sitemap.xml' },
      { url: `${SITE_CONFIG.baseUrl}/ads.txt`, name: 'ads.txt' }
    ];

    for (const file of systemFiles) {
      const response = await this.checkUrl(file.url, `System file: ${file.name}`);
      if (response && response.statusCode === 200) {
        this.addIssue('info', 'System', `${file.name} is accessible`, { url: file.url });
      }
    }
  }

  // الفحص الرئيسي
  async runHealthCheck() {
    console.log('🔍 بدء فحص صحة الموقع الشامل...\n');

    // 1. فحص بنية الموقع
    await this.checkSiteStructure();

    // 2. فحص الصفحة الرئيسية
    console.log('📄 فحص الصفحة الرئيسية...');
    const homeResponse = await this.checkUrl(SITE_CONFIG.baseUrl, 'Homepage');
    if (homeResponse) {
      const internalLinks = this.checkSEO(homeResponse.body, SITE_CONFIG.baseUrl);
      this.checkPerformance(homeResponse.body, homeResponse.headers);
      this.checkSecurity(homeResponse.headers);
      this.checkAccessibility(homeResponse.body, SITE_CONFIG.baseUrl);

      // فحص عينة من الروابط الداخلية
      console.log('🔗 فحص الروابط الداخلية...');
      const sampleLinks = internalLinks.slice(0, 10); // فحص أول 10 روابط
      for (const link of sampleLinks) {
        await this.checkUrl(link, 'Internal link from homepage');
      }
    }

    // 3. فحص ملفات النظام
    console.log('⚙️ فحص ملفات النظام...');
    await this.checkSystemFiles();

    // 4. فحص قاعدة البيانات
    console.log('🗄️ فحص قاعدة البيانات...');
    await this.checkDatabase();

    // 5. فحص المحتوى المكرر
    await this.checkDuplicateContent();

    // 6. فحص الأداء المتقدم
    await this.checkAdvancedPerformance();

    // 7. فحص الروابط الخارجية
    await this.checkExternalLinks();

    // 8. فحص صفحات مهمة مع تحليل شامل
    console.log('📋 فحص الصفحات المهمة...');
    const importantPages = [
      '/articles',
      '/ai-tools',
      '/services',
      '/page/about-us',
      '/page/contact',
      '/page/privacy-policy'
    ];

    for (const page of importantPages) {
      const response = await this.checkUrl(SITE_CONFIG.baseUrl + page, `Important page: ${page}`);
      if (response && response.statusCode === 200) {
        this.checkSEO(response.body, SITE_CONFIG.baseUrl + page);
        this.checkAccessibility(response.body, SITE_CONFIG.baseUrl + page);
      }
    }

    // إنهاء الفحص
    const duration = Date.now() - this.startTime;
    this.addIssue('info', 'System', `Comprehensive health check completed in ${Math.round(duration/1000)}s`);
  }

  // إنشاء التقرير
  generateReport() {
    const totalIssues = Object.values(this.results).reduce((sum, issues) => sum + issues.length, 0);
    const criticalCount = this.results.critical.length;
    const highCount = this.results.high.length;

    const report = {
      summary: {
        totalIssues,
        critical: criticalCount,
        high: highCount,
        medium: this.results.medium.length,
        low: this.results.low.length,
        info: this.results.info.length,
        healthScore: Math.max(0, 100 - (criticalCount * 20) - (highCount * 10) - (this.results.medium.length * 5) - (this.results.low.length * 1)),
        timestamp: new Date().toISOString(),
        duration: Date.now() - this.startTime
      },
      issues: this.results
    };

    return report;
  }

  // طباعة التقرير
  printReport(report) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 تقرير صحة الموقع - TechnoFlash');
    console.log('='.repeat(60));
    
    console.log(`\n🎯 نقاط الصحة العامة: ${report.summary.healthScore}/100`);
    console.log(`⏱️ مدة الفحص: ${Math.round(report.summary.duration/1000)} ثانية`);
    console.log(`📈 إجمالي المشاكل: ${report.summary.totalIssues}`);
    
    console.log('\n📋 ملخص المشاكل:');
    console.log(`🔴 حرجة: ${report.summary.critical}`);
    console.log(`🟡 عالية: ${report.summary.high}`);
    console.log(`🟠 متوسطة: ${report.summary.medium}`);
    console.log(`🔵 منخفضة: ${report.summary.low}`);
    console.log(`ℹ️ معلومات: ${report.summary.info}`);

    // طباعة المشاكل الحرجة
    if (report.issues.critical.length > 0) {
      console.log('\n🔴 المشاكل الحرجة:');
      report.issues.critical.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.category}] ${issue.message}`);
        if (issue.details.url) console.log(`   URL: ${issue.details.url}`);
      });
    }

    // طباعة المشاكل العالية
    if (report.issues.high.length > 0) {
      console.log('\n🟡 المشاكل العالية:');
      report.issues.high.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.category}] ${issue.message}`);
        if (issue.details.url) console.log(`   URL: ${issue.details.url}`);
      });
    }

    console.log('\n' + '='.repeat(60));

    // توصيات
    if (report.summary.critical > 0) {
      console.log('⚠️ يجب إصلاح المشاكل الحرجة فوراً!');
    } else if (report.summary.high > 0) {
      console.log('⚡ يُنصح بإصلاح المشاكل العالية قريباً');
    } else {
      console.log('✅ الموقع في حالة جيدة!');
    }
  }

  // فحص متقدم للأداء
  async checkAdvancedPerformance() {
    console.log('⚡ فحص الأداء المتقدم...');

    // فحص Core Web Vitals simulation
    const startTime = Date.now();
    const response = await this.checkUrl(SITE_CONFIG.baseUrl, 'Performance test');
    const loadTime = Date.now() - startTime;

    if (loadTime > 3000) {
      this.addIssue('high', 'Performance', `Slow page load time: ${loadTime}ms`, { loadTime });
    } else if (loadTime > 1500) {
      this.addIssue('medium', 'Performance', `Moderate page load time: ${loadTime}ms`, { loadTime });
    }

    // فحص حجم الموارد
    if (response && response.body) {
      const resourceSizes = {
        html: Buffer.byteLength(response.body, 'utf8'),
        css: (response.body.match(/<link[^>]*\.css/gi) || []).length,
        js: (response.body.match(/<script[^>]*\.js/gi) || []).length,
        images: (response.body.match(/<img[^>]*>/gi) || []).length
      };

      if (resourceSizes.css > 10) {
        this.addIssue('medium', 'Performance', `Too many CSS files: ${resourceSizes.css}`, resourceSizes);
      }
      if (resourceSizes.js > 15) {
        this.addIssue('medium', 'Performance', `Too many JS files: ${resourceSizes.js}`, resourceSizes);
      }
    }
  }

  // فحص إمكانية الوصول (Accessibility)
  checkAccessibility(html, url) {
    console.log('♿ فحص إمكانية الوصول...');

    // فحص lang attribute
    if (!html.includes('lang=')) {
      this.addIssue('medium', 'Accessibility', 'Missing lang attribute in HTML tag', { url });
    }

    // فحص skip links
    if (!html.includes('skip') && !html.includes('تخطي')) {
      this.addIssue('low', 'Accessibility', 'Missing skip navigation links', { url });
    }

    // فحص form labels
    const formInputs = html.match(/<input[^>]*>/gi) || [];
    const labels = html.match(/<label[^>]*>/gi) || [];
    if (formInputs.length > labels.length) {
      this.addIssue('medium', 'Accessibility', 'Form inputs without proper labels', {
        url,
        inputs: formInputs.length,
        labels: labels.length
      });
    }

    // فحص contrast (basic check for dark backgrounds)
    if (html.includes('bg-dark') || html.includes('background: #000')) {
      if (!html.includes('text-white') && !html.includes('color: #fff')) {
        this.addIssue('medium', 'Accessibility', 'Potential contrast issues detected', { url });
      }
    }
  }
}

// تشغيل المدقق
async function main() {
  const checker = new WebsiteHealthChecker();
  
  try {
    await checker.runHealthCheck();
    const report = checker.generateReport();
    
    // طباعة التقرير
    checker.printReport(report);
    
    // حفظ التقرير
    const reportFile = `health-report-${new Date().toISOString().split('T')[0]}.json`;
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    console.log(`\n💾 تم حفظ التقرير المفصل في: ${reportFile}`);
    
    // إنهاء بكود الخروج المناسب
    process.exit(report.summary.critical > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ خطأ في تشغيل مدقق الصحة:', error.message);
    process.exit(1);
  }
}


}

// تشغيل المدقق
async function main() {
  const checker = new WebsiteHealthChecker();

  try {
    await checker.runHealthCheck();
    const report = checker.generateReport();

    // طباعة التقرير
    checker.printReport(report);

    // حفظ التقرير
    const reportFile = `health-report-${new Date().toISOString().split('T')[0]}.json`;
    await require('fs').promises.writeFile(reportFile, JSON.stringify(report, null, 2));
    console.log(`\n💾 تم حفظ التقرير المفصل في: ${reportFile}`);

    // إنهاء بكود الخروج المناسب
    process.exit(report.summary.critical > 0 ? 1 : 0);

  } catch (error) {
    console.error('❌ خطأ في تشغيل مدقق الصحة:', error.message);
    process.exit(1);
  }
}

// تشغيل إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  main();
}

module.exports = WebsiteHealthChecker;
