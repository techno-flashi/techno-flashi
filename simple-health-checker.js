#!/usr/bin/env node

/**
 * مدقق صحة الموقع المبسط - TechnoFlash
 * يكتشف المشاكل التقنية الأساسية بسرعة
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs').promises;

// إعدادات الموقع
const SITE_CONFIG = {
  baseUrl: 'https://www.tflash.site',
  sitemap: 'https://www.tflash.site/sitemap.xml',
  robots: 'https://www.tflash.site/robots.txt'
};

class SimpleHealthChecker {
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
    let imagesWithoutAlt = 0;
    imgMatches.forEach(img => {
      if (!img.includes('alt=')) {
        imagesWithoutAlt++;
      }
    });
    
    if (imagesWithoutAlt > 0) {
      this.addIssue('medium', 'Accessibility', `${imagesWithoutAlt} images without alt attribute`, { url, count: imagesWithoutAlt });
    }

    // استخراج الروابط الداخلية
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

  // فحص الأداء الأساسي
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

  // فحص الأمان الأساسي
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

  // فحص ملفات النظام
  async checkSystemFiles() {
    console.log('⚙️ فحص ملفات النظام...');
    
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

  // فحص الصفحات المهمة
  async checkImportantPages() {
    console.log('📋 فحص الصفحات المهمة...');
    
    const importantPages = [
      '/',
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
        this.checkPerformance(response.body, response.headers);
        this.checkSecurity(response.headers);
      }
    }
  }

  // الفحص الرئيسي
  async runHealthCheck() {
    console.log('🔍 بدء فحص صحة الموقع...\n');

    // 1. فحص الصفحة الرئيسية
    console.log('📄 فحص الصفحة الرئيسية...');
    const homeResponse = await this.checkUrl(SITE_CONFIG.baseUrl, 'Homepage');
    if (homeResponse) {
      const internalLinks = this.checkSEO(homeResponse.body, SITE_CONFIG.baseUrl);
      this.checkPerformance(homeResponse.body, homeResponse.headers);
      this.checkSecurity(homeResponse.headers);

      // فحص عينة من الروابط الداخلية
      console.log('🔗 فحص الروابط الداخلية...');
      const sampleLinks = internalLinks.slice(0, 5); // فحص أول 5 روابط
      for (const link of sampleLinks) {
        await this.checkUrl(link, 'Internal link from homepage');
      }
    }

    // 2. فحص ملفات النظام
    await this.checkSystemFiles();

    // 3. فحص الصفحات المهمة
    await this.checkImportantPages();

    // إنهاء الفحص
    const duration = Date.now() - this.startTime;
    this.addIssue('info', 'System', `Health check completed in ${Math.round(duration/1000)}s`);
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
}

// تشغيل المدقق
async function main() {
  const checker = new SimpleHealthChecker();
  
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

// تشغيل إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  main();
}

module.exports = SimpleHealthChecker;
