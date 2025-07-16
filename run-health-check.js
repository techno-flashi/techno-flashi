#!/usr/bin/env node

/**
 * أداة تشغيل مدقق صحة الموقع مع خيارات متقدمة
 * TechnoFlash Website Health Checker Runner
 */

const WebsiteHealthChecker = require('./website-health-checker');
const fs = require('fs').promises;
const path = require('path');

class HealthCheckRunner {
  constructor() {
    this.config = null;
    this.args = this.parseArguments();
  }

  // تحليل المعاملات
  parseArguments() {
    const args = process.argv.slice(2);
    const options = {
      quick: false,
      verbose: false,
      format: 'console',
      config: './health-checker-config.json',
      output: null,
      checks: []
    };

    for (let i = 0; i < args.length; i++) {
      switch (args[i]) {
        case '--quick':
        case '-q':
          options.quick = true;
          break;
        case '--verbose':
        case '-v':
          options.verbose = true;
          break;
        case '--format':
        case '-f':
          options.format = args[++i];
          break;
        case '--config':
        case '-c':
          options.config = args[++i];
          break;
        case '--output':
        case '-o':
          options.output = args[++i];
          break;
        case '--check':
          options.checks.push(args[++i]);
          break;
        case '--help':
        case '-h':
          this.showHelp();
          process.exit(0);
          break;
      }
    }

    return options;
  }

  // عرض المساعدة
  showHelp() {
    console.log(`
🔍 مدقق صحة الموقع الشامل - TechnoFlash

الاستخدام:
  node run-health-check.js [خيارات]

الخيارات:
  -q, --quick           فحص سريع (يتخطى بعض الفحوصات المتقدمة)
  -v, --verbose         عرض تفاصيل أكثر أثناء الفحص
  -f, --format FORMAT   تنسيق التقرير (console, json, html)
  -c, --config FILE     ملف التكوين (افتراضي: health-checker-config.json)
  -o, --output FILE     حفظ التقرير في ملف
  --check TYPE          تشغيل فحص محدد فقط (seo, performance, security, etc.)
  -h, --help            عرض هذه المساعدة

أمثلة:
  node run-health-check.js                    # فحص شامل
  node run-health-check.js --quick            # فحص سريع
  node run-health-check.js --format json      # تقرير JSON
  node run-health-check.js --check seo        # فحص SEO فقط
  node run-health-check.js -o report.json     # حفظ في ملف

فئات الفحص المتاحة:
  - seo: فحص محركات البحث
  - performance: فحص الأداء
  - security: فحص الأمان
  - accessibility: فحص إمكانية الوصول
  - content: فحص المحتوى
  - database: فحص قاعدة البيانات
  - links: فحص الروابط
  - structure: فحص بنية الموقع
`);
  }

  // تحميل التكوين
  async loadConfig() {
    try {
      const configData = await fs.readFile(this.args.config, 'utf8');
      this.config = JSON.parse(configData);
      
      if (this.args.verbose) {
        console.log(`✅ تم تحميل التكوين من: ${this.args.config}`);
      }
    } catch (error) {
      console.warn(`⚠️ لا يمكن تحميل التكوين: ${error.message}`);
      console.log('📋 استخدام التكوين الافتراضي...');
      this.config = this.getDefaultConfig();
    }
  }

  // التكوين الافتراضي
  getDefaultConfig() {
    return {
      checks: {
        seo: { enabled: true },
        performance: { enabled: true },
        security: { enabled: true },
        accessibility: { enabled: true },
        content: { enabled: true },
        externalLinks: { enabled: !this.args.quick }
      },
      scoring: {
        weights: { critical: 20, high: 10, medium: 5, low: 1, info: 0 },
        maxScore: 100
      }
    };
  }

  // تخصيص الفحوصات حسب المعاملات
  customizeChecks(checker) {
    if (this.args.checks.length > 0) {
      // تعطيل جميع الفحوصات أولاً
      Object.keys(this.config.checks).forEach(check => {
        this.config.checks[check].enabled = false;
      });
      
      // تفعيل الفحوصات المحددة فقط
      this.args.checks.forEach(checkType => {
        if (this.config.checks[checkType]) {
          this.config.checks[checkType].enabled = true;
          if (this.args.verbose) {
            console.log(`✅ تم تفعيل فحص: ${checkType}`);
          }
        } else {
          console.warn(`⚠️ نوع فحص غير معروف: ${checkType}`);
        }
      });
    }

    // الفحص السريع
    if (this.args.quick) {
      this.config.checks.externalLinks.enabled = false;
      this.config.checks.content.checkDuplicates = false;
      if (this.args.verbose) {
        console.log('⚡ تم تفعيل الوضع السريع');
      }
    }
  }

  // إنشاء تقرير HTML
  generateHtmlReport(report) {
    const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تقرير صحة الموقع - TechnoFlash</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 2px solid #007acc; padding-bottom: 20px; margin-bottom: 30px; }
        .score { font-size: 3em; font-weight: bold; color: ${report.summary.healthScore >= 80 ? '#28a745' : report.summary.healthScore >= 60 ? '#ffc107' : '#dc3545'}; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; }
        .issues { margin-top: 30px; }
        .issue-category { margin-bottom: 20px; }
        .issue-header { background: #007acc; color: white; padding: 10px; border-radius: 5px 5px 0 0; }
        .issue-list { background: white; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
        .issue-item { padding: 10px; border-bottom: 1px solid #eee; }
        .issue-item:last-child { border-bottom: none; }
        .critical { border-left: 4px solid #dc3545; }
        .high { border-left: 4px solid #fd7e14; }
        .medium { border-left: 4px solid #ffc107; }
        .low { border-left: 4px solid #17a2b8; }
        .timestamp { color: #666; font-size: 0.9em; margin-top: 20px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>تقرير صحة الموقع</h1>
            <h2>TechnoFlash</h2>
            <div class="score">${report.summary.healthScore}/100</div>
            <p>تم الفحص في ${Math.round(report.summary.duration/1000)} ثانية</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>إجمالي المشاكل</h3>
                <div style="font-size: 2em; font-weight: bold;">${report.summary.totalIssues}</div>
            </div>
            <div class="summary-card">
                <h3>حرجة</h3>
                <div style="font-size: 2em; font-weight: bold; color: #dc3545;">${report.summary.critical}</div>
            </div>
            <div class="summary-card">
                <h3>عالية</h3>
                <div style="font-size: 2em; font-weight: bold; color: #fd7e14;">${report.summary.high}</div>
            </div>
            <div class="summary-card">
                <h3>متوسطة</h3>
                <div style="font-size: 2em; font-weight: bold; color: #ffc107;">${report.summary.medium}</div>
            </div>
            <div class="summary-card">
                <h3>منخفضة</h3>
                <div style="font-size: 2em; font-weight: bold; color: #17a2b8;">${report.summary.low}</div>
            </div>
        </div>
        
        <div class="issues">
            ${Object.entries(report.issues).map(([severity, issues]) => {
              if (issues.length === 0 || severity === 'info') return '';
              return `
                <div class="issue-category">
                    <div class="issue-header">
                        <h3>مشاكل ${severity === 'critical' ? 'حرجة' : severity === 'high' ? 'عالية' : severity === 'medium' ? 'متوسطة' : 'منخفضة'} (${issues.length})</h3>
                    </div>
                    <div class="issue-list">
                        ${issues.map(issue => `
                            <div class="issue-item ${severity}">
                                <strong>[${issue.category}]</strong> ${issue.message}
                                ${issue.details.url ? `<br><small>الرابط: ${issue.details.url}</small>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
              `;
            }).join('')}
        </div>
        
        <div class="timestamp">
            تم إنشاء التقرير في: ${new Date(report.summary.timestamp).toLocaleString('ar-SA')}
        </div>
    </div>
</body>
</html>`;
    return html;
  }

  // حفظ التقرير
  async saveReport(report, format) {
    const timestamp = new Date().toISOString().split('T')[0];
    let filename, content;

    switch (format) {
      case 'json':
        filename = this.args.output || `health-report-${timestamp}.json`;
        content = JSON.stringify(report, null, 2);
        break;
      case 'html':
        filename = this.args.output || `health-report-${timestamp}.html`;
        content = this.generateHtmlReport(report);
        break;
      default:
        return; // لا حفظ للتقرير النصي
    }

    try {
      await fs.writeFile(filename, content, 'utf8');
      console.log(`\n💾 تم حفظ التقرير في: ${filename}`);
    } catch (error) {
      console.error(`❌ خطأ في حفظ التقرير: ${error.message}`);
    }
  }

  // تشغيل الفحص
  async run() {
    console.log('🚀 بدء تشغيل مدقق صحة الموقع...\n');

    try {
      // تحميل التكوين
      await this.loadConfig();

      // إنشاء المدقق
      const checker = new WebsiteHealthChecker();
      
      // تخصيص الفحوصات
      this.customizeChecks(checker);

      // تشغيل الفحص
      await checker.runHealthCheck();

      // إنشاء التقرير
      const report = checker.generateReport();

      // عرض التقرير
      if (this.args.format === 'console' || this.args.verbose) {
        checker.printReport(report);
      }

      // حفظ التقرير
      if (this.args.format !== 'console') {
        await this.saveReport(report, this.args.format);
      }

      // إنهاء بكود الخروج المناسب
      const exitCode = report.summary.critical > 0 ? 1 : 0;
      
      if (exitCode === 0) {
        console.log('\n✅ الفحص مكتمل بنجاح!');
      } else {
        console.log('\n⚠️ تم العثور على مشاكل حرجة تحتاج إصلاح فوري!');
      }

      process.exit(exitCode);

    } catch (error) {
      console.error(`❌ خطأ في تشغيل مدقق الصحة: ${error.message}`);
      if (this.args.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }
}

// تشغيل إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  const runner = new HealthCheckRunner();
  runner.run();
}

module.exports = HealthCheckRunner;
