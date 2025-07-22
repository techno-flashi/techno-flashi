// Canonical URL Manager - Fix duplicate content and URL canonicalization
// Ensures consistent www.tflash.site domain usage

export const CANONICAL_DOMAIN = 'https://www.tflash.site';

// Generate canonical URL for any page - ENHANCED to prevent canonicalised URLs
export function generateCanonicalUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Remove trailing slash except for root
  const normalizedPath = cleanPath === '' ? '' : cleanPath.replace(/\/$/, '');

  // Remove common URL parameters that cause duplication
  const pathWithoutParams = normalizedPath.split('?')[0];

  // Ensure we don't create canonicalised URLs by using the actual current path
  const finalPath = pathWithoutParams || '';

  return `${CANONICAL_DOMAIN}/${finalPath}`;
}

// Check if current URL matches its canonical (prevents canonicalised URLs)
export function shouldUseCurrentUrlAsCanonical(currentPath: string, suggestedCanonical: string): boolean {
  try {
    const currentUrl = `${CANONICAL_DOMAIN}/${currentPath.startsWith('/') ? currentPath.slice(1) : currentPath}`;
    const canonicalUrl = new URL(suggestedCanonical);
    const currentUrlObj = new URL(currentUrl);

    // If paths are the same, use current URL as canonical
    return currentUrlObj.pathname === canonicalUrl.pathname;
  } catch {
    return true; // Default to current URL if there's an error
  }
}

// Generate canonical URL with specific rules for different page types
export function generatePageCanonicalUrl(
  pageType: 'article' | 'ai-tool' | 'category' | 'page',
  slug: string,
  category?: string
): string {
  // Validate slug exists and is not empty
  if (!slug || slug.trim() === '') {
    console.warn(`Invalid slug for ${pageType}:`, slug);
    return CANONICAL_DOMAIN; // Fallback to homepage
  }

  // For articles and ai-tools, use the original slug to preserve exact URLs
  // Only sanitize for categories and pages where we need clean URLs
  let finalSlug = slug;

  if (pageType === 'category' || pageType === 'page') {
    finalSlug = sanitizeSlug(slug);
  }

  let path = '';

  switch (pageType) {
    case 'article':
      path = `articles/${finalSlug}`;
      break;
    case 'ai-tool':
      path = `ai-tools/${finalSlug}`;
      break;
    case 'category':
      path = category ? sanitizeSlug(category) : finalSlug;
      break;
    case 'page':
      path = finalSlug === 'home' ? '' : `page/${finalSlug}`;
      break;
    default:
      path = finalSlug;
  }

  const canonicalUrl = generateCanonicalUrl(path);

  // Validate the generated URL is indexable
  if (!isIndexableUrl(canonicalUrl)) {
    console.warn(`Generated non-indexable canonical URL: ${canonicalUrl}`);
    return CANONICAL_DOMAIN; // Fallback to homepage
  }

  return canonicalUrl;
}

// Sanitize slug for URL safety - fixes URL structure issues (SEO audit)
export function sanitizeSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') {
    return '';
  }

  return slug
    .toLowerCase()
    .trim()
    // Replace Arabic/Unicode characters with transliteration
    .replace(/[أإآا]/g, 'a')
    .replace(/[ة]/g, 'h')
    .replace(/[ي]/g, 'y')
    .replace(/[و]/g, 'w')
    .replace(/[ر]/g, 'r')
    .replace(/[ت]/g, 't')
    .replace(/[ن]/g, 'n')
    .replace(/[م]/g, 'm')
    .replace(/[ل]/g, 'l')
    .replace(/[ك]/g, 'k')
    .replace(/[ج]/g, 'j')
    .replace(/[ح]/g, 'h')
    .replace(/[خ]/g, 'kh')
    .replace(/[د]/g, 'd')
    .replace(/[ذ]/g, 'th')
    .replace(/[س]/g, 's')
    .replace(/[ش]/g, 'sh')
    .replace(/[ص]/g, 's')
    .replace(/[ض]/g, 'd')
    .replace(/[ط]/g, 't')
    .replace(/[ظ]/g, 'th')
    .replace(/[ع]/g, 'a')
    .replace(/[غ]/g, 'gh')
    .replace(/[ف]/g, 'f')
    .replace(/[ق]/g, 'q')
    .replace(/[ه]/g, 'h')
    .replace(/[ز]/g, 'z')
    .replace(/[ب]/g, 'b')
    .replace(/[ء]/g, '')
    // Replace spaces with hyphens (fixes 8 URLs with spaces - 4%)
    .replace(/\s+/g, '-')
    // Replace underscores with hyphens (fixes 1 URL with underscores - 0.5%)
    .replace(/_/g, '-')
    // Remove remaining non-ASCII characters (fixes 10 URLs with non-ASCII - 5%)
    .replace(/[^\x00-\x7F]/g, '')
    // Remove special characters except hyphens and alphanumeric
    .replace(/[^a-z0-9-]/g, '')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Ensure minimum length
    || 'page';
}

// Clean URL parameters (fixes 10 URLs with parameters - 5%)
export function cleanUrlParameters(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove common tracking parameters
    const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid', 'ref', 'source', 'm'];

    paramsToRemove.forEach(param => {
      urlObj.searchParams.delete(param);
    });

    // Return clean URL
    return urlObj.toString();
  } catch {
    return url;
  }
}

// Check if URL is indexable (returns 200, not noindex, not redirect)
export function isIndexableUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);

    // Must be HTTPS
    if (urlObj.protocol !== 'https:') return false;

    // Must use www subdomain
    if (!urlObj.hostname.startsWith('www.')) return false;

    // Must be tflash.site domain
    if (!urlObj.hostname.endsWith('tflash.site')) return false;

    // No trailing slash except root
    if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) return false;

    // No URL parameters for canonical URLs
    if (urlObj.search) return false;

    // No fragments
    if (urlObj.hash) return false;

    return true;
  } catch {
    return false;
  }
}

// Check if URL needs canonicalization
export function needsCanonicalization(currentUrl: string): boolean {
  // Check for non-www domain
  if (currentUrl.includes('://tflash.site') && !currentUrl.includes('://www.tflash.site')) {
    return true;
  }
  
  // Check for HTTP instead of HTTPS
  if (currentUrl.startsWith('http://')) {
    return true;
  }
  
  // Check for trailing slash on non-root pages
  if (currentUrl.endsWith('/') && currentUrl !== CANONICAL_DOMAIN + '/') {
    return true;
  }
  
  // Check for common duplicate parameters
  const duplicateParams = ['?m=1', '?utm_', '?ref=', '?source=', '?fbclid=', '?gclid='];
  return duplicateParams.some(param => currentUrl.includes(param));
}

// Generate redirect rules for Vercel
export function generateVercelRedirectRules() {
  return [
    // Force WWW
    {
      source: 'https://tflash.site/:path*',
      destination: 'https://www.tflash.site/:path*',
      permanent: true
    },
    // Force HTTPS
    {
      source: 'http://www.tflash.site/:path*',
      destination: 'https://www.tflash.site/:path*',
      permanent: true
    },
    {
      source: 'http://tflash.site/:path*',
      destination: 'https://www.tflash.site/:path*',
      permanent: true
    },
    // Remove trailing slashes
    {
      source: '/:path+/',
      destination: '/:path+',
      permanent: true
    },
    // Remove duplicate parameters
    {
      source: '/:path*',
      has: [
        {
          type: 'query',
          key: 'm',
          value: '1'
        }
      ],
      destination: '/:path*',
      permanent: true
    }
  ];
}

// Generate sitemap URLs with canonical domain
export function generateSitemapUrl(path: string, lastModified?: string): {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
} {
  const canonicalUrl = generateCanonicalUrl(path);
  
  // Determine change frequency and priority based on path
  let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly';
  let priority = 0.5;
  
  if (path === '' || path === '/') {
    changeFrequency = 'daily';
    priority = 1.0;
  } else if (path.startsWith('articles/')) {
    changeFrequency = 'monthly';
    priority = 0.8;
  } else if (path.startsWith('ai-tools/')) {
    changeFrequency = 'weekly';
    priority = 0.9;
  } else if (path.includes('category') || path.includes('tag')) {
    changeFrequency = 'weekly';
    priority = 0.6;
  }
  
  return {
    url: canonicalUrl,
    lastModified: lastModified || new Date().toISOString(),
    changeFrequency,
    priority
  };
}

// Validate canonical URL format
export function validateCanonicalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Must be HTTPS
    if (urlObj.protocol !== 'https:') return false;
    
    // Must use www subdomain
    if (!urlObj.hostname.startsWith('www.')) return false;
    
    // Must be tflash.site domain
    if (!urlObj.hostname.endsWith('tflash.site')) return false;
    
    // No trailing slash except root
    if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) return false;
    
    return true;
  } catch {
    return false;
  }
}

// Generate meta tags for canonical URL (without canonical to avoid duplication)
export function generateCanonicalMetaTags(canonicalUrl: string) {
  return {
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
    other: {
      'og:url': canonicalUrl,
      'twitter:url': canonicalUrl
    }
  };
}

// Generate ONLY canonical URL for Next.js metadata
export function generateSingleCanonicalMeta(canonicalUrl: string) {
  return {
    alternates: {
      canonical: canonicalUrl
    }
  };
}
