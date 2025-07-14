// مكتبة أيقونات أدوات الذكاء الاصطناعي من SVG Repo
// https://www.svgrepo.com/

export interface AIToolIcon {
  name: string;
  category: string;
  iconUrl: string;
  color: string;
  keywords: string[];
}

// مجموعة شاملة من أيقونات أدوات الذكاء الاصطناعي
export const aiToolIcons: AIToolIcon[] = [
  // أدوات الذكاء الاصطناعي العامة
  {
    name: 'AI Brain',
    category: 'عام',
    iconUrl: 'https://www.svgrepo.com/show/530438/artificial-intelligence.svg',
    color: '#FF6B6B',
    keywords: ['ai', 'artificial', 'intelligence', 'brain', 'ذكاء', 'اصطناعي']
  },
  {
    name: 'Robot',
    category: 'عام',
    iconUrl: 'https://www.svgrepo.com/show/530440/robot.svg',
    color: '#6C5CE7',
    keywords: ['robot', 'bot', 'automation', 'روبوت', 'آلي']
  },
  {
    name: 'Neural Network',
    category: 'تعلم آلي',
    iconUrl: 'https://www.svgrepo.com/show/530441/neural-network.svg',
    color: '#00B894',
    keywords: ['neural', 'network', 'machine learning', 'شبكة', 'عصبية']
  },

  // أدوات المحادثة والنصوص
  {
    name: 'Chat Bot',
    category: 'محادثة',
    iconUrl: 'https://www.svgrepo.com/show/530436/chatbot.svg',
    color: '#00B894',
    keywords: ['chat', 'bot', 'conversation', 'محادثة', 'دردشة', 'chatgpt', 'claude']
  },
  {
    name: 'Text Generation',
    category: 'إنشاء النصوص',
    iconUrl: 'https://www.svgrepo.com/show/530442/text-generation.svg',
    color: '#0984E3',
    keywords: ['text', 'writing', 'content', 'نص', 'كتابة', 'محتوى', 'jasper', 'copy.ai']
  },
  {
    name: 'Language',
    category: 'ترجمة',
    iconUrl: 'https://www.svgrepo.com/show/530444/translation.svg',
    color: '#FDCB6E',
    keywords: ['translate', 'language', 'ترجمة', 'لغة', 'deepl', 'google translate']
  },

  // أدوات الصور والفيديو
  {
    name: 'Image Generation',
    category: 'إنشاء الصور',
    iconUrl: 'https://www.svgrepo.com/show/530439/image-generation.svg',
    color: '#E17055',
    keywords: ['image', 'photo', 'generate', 'صورة', 'إنشاء', 'midjourney', 'dall-e', 'stable diffusion']
  },
  {
    name: 'Video Generation',
    category: 'إنشاء الفيديو',
    iconUrl: 'https://www.svgrepo.com/show/530443/video-generation.svg',
    color: '#FD79A8',
    keywords: ['video', 'movie', 'generate', 'فيديو', 'إنشاء', 'runway', 'synthesia']
  },
  {
    name: 'Photo Editor',
    category: 'تحرير الصور',
    iconUrl: 'https://www.svgrepo.com/show/452107/photo-editor.svg',
    color: '#A29BFE',
    keywords: ['photo', 'edit', 'image', 'تحرير', 'صورة', 'photoshop', 'canva']
  },

  // أدوات الصوت والموسيقى
  {
    name: 'Voice Recognition',
    category: 'معالجة الصوت',
    iconUrl: 'https://www.svgrepo.com/show/530445/voice-recognition.svg',
    color: '#A29BFE',
    keywords: ['voice', 'audio', 'speech', 'صوت', 'كلام', 'whisper', 'eleven labs']
  },
  {
    name: 'Music Generation',
    category: 'إنشاء الموسيقى',
    iconUrl: 'https://www.svgrepo.com/show/452108/music.svg',
    color: '#55A3FF',
    keywords: ['music', 'audio', 'sound', 'موسيقى', 'صوت', 'mubert', 'aiva']
  },

  // أدوات البرمجة والتطوير
  {
    name: 'Code Assistant',
    category: 'برمجة',
    iconUrl: 'https://www.svgrepo.com/show/452091/code.svg',
    color: '#4ECDC4',
    keywords: ['code', 'programming', 'development', 'برمجة', 'تطوير', 'github copilot', 'codewhisperer']
  },
  {
    name: 'Database AI',
    category: 'قواعد البيانات',
    iconUrl: 'https://www.svgrepo.com/show/452213/database.svg',
    color: '#45B7D1',
    keywords: ['database', 'data', 'sql', 'قاعدة بيانات', 'بيانات']
  },

  // أدوات التحليل والبيانات
  {
    name: 'Data Analysis',
    category: 'تحليل البيانات',
    iconUrl: 'https://www.svgrepo.com/show/530446/data-analysis.svg',
    color: '#55A3FF',
    keywords: ['data', 'analysis', 'analytics', 'تحليل', 'بيانات', 'tableau', 'power bi']
  },
  {
    name: 'Chart Analytics',
    category: 'تحليل البيانات',
    iconUrl: 'https://www.svgrepo.com/show/452055/analytics.svg',
    color: '#FD79A8',
    keywords: ['chart', 'graph', 'analytics', 'رسم بياني', 'تحليل']
  },

  // أدوات التسويق والأعمال
  {
    name: 'Marketing AI',
    category: 'تسويق',
    iconUrl: 'https://www.svgrepo.com/show/452109/marketing.svg',
    color: '#96CEB4',
    keywords: ['marketing', 'business', 'تسويق', 'أعمال', 'hubspot', 'mailchimp']
  },
  {
    name: 'SEO Tools',
    category: 'تحسين محركات البحث',
    iconUrl: 'https://www.svgrepo.com/show/452201/seo.svg',
    color: '#FFEAA7',
    keywords: ['seo', 'search', 'optimization', 'تحسين', 'بحث', 'semrush', 'ahrefs']
  },

  // أدوات التصميم والإبداع
  {
    name: 'Design AI',
    category: 'تصميم',
    iconUrl: 'https://www.svgrepo.com/show/452110/design.svg',
    color: '#DDA0DD',
    keywords: ['design', 'creative', 'art', 'تصميم', 'إبداع', 'figma', 'adobe']
  },
  {
    name: 'Logo Generator',
    category: 'تصميم الشعارات',
    iconUrl: 'https://www.svgrepo.com/show/452111/logo.svg',
    color: '#74B9FF',
    keywords: ['logo', 'brand', 'identity', 'شعار', 'علامة تجارية', 'looka', 'brandmark']
  },

  // أدوات الأمان والحماية
  {
    name: 'Security AI',
    category: 'أمن المعلومات',
    iconUrl: 'https://www.svgrepo.com/show/452201/security.svg',
    color: '#DDA0DD',
    keywords: ['security', 'protection', 'cyber', 'أمان', 'حماية', 'cybersecurity']
  },

  // أدوات التعليم والتدريب
  {
    name: 'Education AI',
    category: 'تعليم',
    iconUrl: 'https://www.svgrepo.com/show/452112/education.svg',
    color: '#FDCB6E',
    keywords: ['education', 'learning', 'teaching', 'تعليم', 'تعلم', 'coursera', 'khan academy']
  },

  // أدوات الصحة والطب
  {
    name: 'Health AI',
    category: 'صحة',
    iconUrl: 'https://www.svgrepo.com/show/452113/health.svg',
    color: '#00B894',
    keywords: ['health', 'medical', 'healthcare', 'صحة', 'طب', 'medical ai']
  }
];

// دالة للبحث عن أيقونة مناسبة بناءً على اسم الأداة أو الوصف
export function findBestIcon(toolName: string, description: string = '', category: string = ''): AIToolIcon {
  const searchText = `${toolName} ${description} ${category}`.toLowerCase();
  
  // البحث عن تطابق مباشر في الكلمات المفتاحية
  let bestMatch = aiToolIcons.find(icon => 
    icon.keywords.some(keyword => searchText.includes(keyword.toLowerCase()))
  );
  
  // إذا لم نجد تطابق مباشر، ابحث في الفئة
  if (!bestMatch) {
    bestMatch = aiToolIcons.find(icon => 
      icon.category === category || searchText.includes(icon.category.toLowerCase())
    );
  }
  
  // إذا لم نجد أي تطابق، استخدم الأيقونة الافتراضية
  if (!bestMatch) {
    bestMatch = aiToolIcons[0]; // AI Brain كأيقونة افتراضية
  }
  
  return bestMatch;
}

// دالة للحصول على أيقونة عشوائية من فئة معينة
export function getRandomIconByCategory(category: string): AIToolIcon {
  const categoryIcons = aiToolIcons.filter(icon => 
    icon.category === category || 
    icon.keywords.some(keyword => keyword.includes(category.toLowerCase()))
  );
  
  if (categoryIcons.length > 0) {
    return categoryIcons[Math.floor(Math.random() * categoryIcons.length)];
  }
  
  // إذا لم توجد أيقونة للفئة، اختر أيقونة عشوائية
  return aiToolIcons[Math.floor(Math.random() * aiToolIcons.length)];
}

// دالة لتحديث أداة بأيقونة مناسبة
export function updateToolWithIcon(tool: any): any {
  const bestIcon = findBestIcon(tool.name, tool.description, tool.category);
  
  return {
    ...tool,
    logo_url: bestIcon.iconUrl,
    icon_color: bestIcon.color
  };
}
