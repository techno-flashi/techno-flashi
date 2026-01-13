// مكتبة تنظيف وتعقيم البيانات
export function sanitizeHtml(html: string): string {
  // قائمة العناصر المسموحة
  const allowedTags = [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre'
  ];
  
  const allowedAttributes = {
    'a': ['href', 'title', 'target'],
    'img': ['src', 'alt', 'width', 'height'],
    'blockquote': ['cite']
  };

  // إزالة العناصر الخطيرة
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '') // إزالة event handlers
    .replace(/javascript:/gi, '') // إزالة javascript: URLs
    .replace(/data:/gi, ''); // إزالة data: URLs

  return sanitized;
}

export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // إزالة أقواس HTML
    .replace(/['"]/g, '') // إزالة علامات الاقتباس
    .trim();
}

export function validateInput(input: any, type: 'email' | 'text' | 'html'): boolean {
  if (!input || typeof input !== 'string') return false;
  
  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(input);
    
    case 'text':
      return input.length > 0 && input.length <= 1000;
    
    case 'html':
      return input.length > 0 && input.length <= 50000;
    
    default:
      return false;
  }
}
