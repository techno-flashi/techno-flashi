// Canonical URL Manager - Fix duplicate content and URL canonicalization
// Ensures consistent www.tflash.site domain usage

export const CANONICAL_DOMAIN = 'https://www.tflash.site';

// Generate canonical URL for any page
export function generateCanonicalUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Remove trailing slash except for root
  const normalizedPath = cleanPath === '' ? '' : cleanPath.replace(/\/$/, '');
  
  // Remove common URL parameters that cause duplication
  const pathWithoutParams = normalizedPath.split('?')[0];
  
  return `${CANONICAL_DOMAIN}/${pathWithoutParams}`;
}

// Generate canonical URL with specific rules for different page types
export function generatePageCanonicalUrl(
  pageType: 'article' | 'ai-tool' | 'category' | 'page',
  slug: string,
  category?: string
): string {
  let path = '';
  
  switch (pageType) {
    case 'article':
      path = `articles/${slug}`;
      break;
    case 'ai-tool':
      path = `ai-tools/${slug}`;
      break;
    case 'category':
      path = category ? `${category}` : slug;
      break;
    case 'page':
      path = slug === 'home' ? '' : `page/${slug}`;
      break;
    default:
      path = slug;
  }
  
  return generateCanonicalUrl(path);
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
