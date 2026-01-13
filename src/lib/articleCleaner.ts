import sanitizeHtml from 'sanitize-html';

/**
 * خيارات تنظيف المحتوى
 */
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  // العناصر المسموحة
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'strong', 'em', 'b', 'i',
    'a', 'img',
    'blockquote',
    'code', 'pre'
  ],
  
  // الخصائص المسموحة لكل عنصر
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
    // إزالة جميع الخصائص الأخرى مثل style, class, id
  },
  
  // البروتوكولات المسموحة للروابط
  allowedSchemes: ['http', 'https', 'mailto'],
  
  // إزالة العناصر الفارغة
  allowedSchemesByTag: {
    img: ['http', 'https', 'data']
  },
  
  // إعدادات إضافية للأمان
  allowProtocolRelative: false,
  enforceHtmlBoundary: true
};

/**
 * تنظيف وتنسيق محتوى المقال
 * @param content المحتوى الأصلي
 * @returns المحتوى المنظف
 */
export function cleanArticleContent(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  let h1Found = false;
  
  // الخطوة 1: تنظيف HTML وإزالة العناصر غير المرغوب فيها
  let cleanContent = sanitizeHtml(content, SANITIZE_OPTIONS);
  
  // الخطوة 2: تحويل H1 المتعددة إلى H2 (الاحتفاظ بأول H1 فقط)
  cleanContent = cleanContent.replace(/<h1([^>]*)>([\s\S]*?)<\/h1>/gi, (match, attributes, innerContent) => {
    if (!h1Found) {
      h1Found = true;
      return `<h1>${innerContent.trim()}</h1>`;
    } else {
      return `<h2>${innerContent.trim()}</h2>`;
    }
  });
  
  // الخطوة 3: تنظيف الفقرات الفارغة والمسافات الزائدة
  cleanContent = cleanContent
    // إزالة الفقرات الفارغة أو التي تحتوي على مسافات فقط
    .replace(/<p[^>]*>\s*<\/p>/gi, '')
    // إزالة العناصر الفارغة الأخرى
    .replace(/<(div|span)[^>]*>\s*<\/\1>/gi, '')
    // تنظيف المسافات المتعددة
    .replace(/\s+/g, ' ')
    // إزالة المسافات في بداية ونهاية الأسطر
    .replace(/^\s+|\s+$/gm, '')
    // إزالة الأسطر الفارغة المتعددة
    .replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // الخطوة 4: تحسين تنسيق الروابط
  cleanContent = cleanContent.replace(/<a([^>]*href="[^"]*"[^>]*)>/gi, (match, attributes) => {
    // إضافة target="_blank" و rel="noopener noreferrer" للروابط الخارجية
    if (attributes.includes('http') && !attributes.includes('target=')) {
      if (!attributes.includes('rel=')) {
        return `<a${attributes} target="_blank" rel="noopener noreferrer">`;
      } else {
        return `<a${attributes} target="_blank">`;
      }
    }
    return match;
  });
  
  // الخطوة 5: تحسين تنسيق الصور
  cleanContent = cleanContent.replace(/<img([^>]*)>/gi, (match, attributes) => {
    // التأكد من وجود alt text
    if (!attributes.includes('alt=')) {
      return `<img${attributes} alt="صورة">`;
    }
    return match;
  });
  
  return cleanContent.trim();
}

/**
 * تحليل المحتوى وإرجاع إحصائيات التنظيف
 * @param originalContent المحتوى الأصلي
 * @param cleanedContent المحتوى المنظف
 * @returns إحصائيات التنظيف
 */
export function getCleaningStats(originalContent: string, cleanedContent: string) {
  const originalLength = originalContent.length;
  const cleanedLength = cleanedContent.length;
  const reduction = originalLength - cleanedLength;
  const reductionPercentage = originalLength > 0 ? Math.round((reduction / originalLength) * 100) : 0;
  
  // عد العناصر المحذوفة
  const originalH1Count = (originalContent.match(/<h1[^>]*>/gi) || []).length;
  const cleanedH1Count = (cleanedContent.match(/<h1[^>]*>/gi) || []).length;
  const h1Converted = originalH1Count - cleanedH1Count;
  
  const removedScripts = (originalContent.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || []).length;
  const removedIframes = (originalContent.match(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi) || []).length;
  const removedObjects = (originalContent.match(/<object[^>]*>[\s\S]*?<\/object>/gi) || []).length;
  const removedEmbeds = (originalContent.match(/<embed[^>]*>/gi) || []).length;
  
  return {
    originalLength,
    cleanedLength,
    reduction,
    reductionPercentage,
    h1Converted,
    removedElements: {
      scripts: removedScripts,
      iframes: removedIframes,
      objects: removedObjects,
      embeds: removedEmbeds,
      total: removedScripts + removedIframes + removedObjects + removedEmbeds
    }
  };
}

/**
 * التحقق من صحة المحتوى بعد التنظيف
 * @param content المحتوى المنظف
 * @returns نتيجة التحقق
 */
export function validateCleanedContent(content: string) {
  const issues: string[] = [];
  const warnings: string[] = [];
  
  // التحقق من وجود محتوى
  if (!content || content.trim().length === 0) {
    issues.push('المحتوى فارغ بعد التنظيف');
    return { isValid: false, issues, warnings };
  }
  
  // التحقق من وجود عنوان H1
  const h1Count = (content.match(/<h1[^>]*>/gi) || []).length;
  if (h1Count === 0) {
    warnings.push('لا يوجد عنوان رئيسي (H1) في المحتوى');
  } else if (h1Count > 1) {
    issues.push(`يوجد ${h1Count} عناوين رئيسية (H1) - يجب أن يكون هناك عنوان واحد فقط`);
  }
  
  // التحقق من وجود محتوى كافي
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  if (textContent.length < 100) {
    warnings.push('المحتوى قصير جداً (أقل من 100 حرف)');
  }
  
  // التحقق من وجود صور بدون alt text
  const imagesWithoutAlt = content.match(/<img[^>]*(?!.*alt=)[^>]*>/gi);
  if (imagesWithoutAlt && imagesWithoutAlt.length > 0) {
    warnings.push(`يوجد ${imagesWithoutAlt.length} صور بدون نص بديل (alt text)`);
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    warnings
  };
}

/**
 * معاينة التغييرات قبل التطبيق
 * @param content المحتوى الأصلي
 * @returns معاينة التغييرات
 */
export function previewCleaningChanges(content: string) {
  const cleanedContent = cleanArticleContent(content);
  const stats = getCleaningStats(content, cleanedContent);
  const validation = validateCleanedContent(cleanedContent);
  
  return {
    originalContent: content,
    cleanedContent,
    stats,
    validation,
    hasChanges: content !== cleanedContent
  };
}
