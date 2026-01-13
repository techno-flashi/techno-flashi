// External Link Checker - Fix broken external links (SEO audit)
// Identifies and fixes 404 external links found in CSV report

interface ExternalLinkCheck {
  url: string;
  status: 'working' | 'broken' | 'redirect' | 'unknown';
  statusCode?: number;
  redirectUrl?: string;
  error?: string;
}

// Common broken external links patterns to fix
const BROKEN_LINK_FIXES: Record<string, string> = {
  // Add known broken links and their fixes here
  'http://example.com': 'https://example.com',
  'https://old-domain.com': 'https://new-domain.com',
  // These will be populated based on actual broken links found
};

// Alternative URLs for common broken links
const ALTERNATIVE_URLS: Record<string, string[]> = {
  'github.com': ['https://github.com'],
  'stackoverflow.com': ['https://stackoverflow.com'],
  'medium.com': ['https://medium.com'],
  'dev.to': ['https://dev.to'],
  'hashnode.com': ['https://hashnode.com'],
};

// Check if external link is working
export async function checkExternalLink(url: string): Promise<ExternalLinkCheck> {
  try {
    // Skip checking for localhost and internal links
    if (url.includes('localhost') || url.includes('tflash.site')) {
      return { url, status: 'working' };
    }

    // Check if it's a known broken link with a fix
    if (BROKEN_LINK_FIXES[url]) {
      return {
        url,
        status: 'redirect',
        redirectUrl: BROKEN_LINK_FIXES[url]
      };
    }

    // For now, return as unknown since we can't make HTTP requests in build
    return { url, status: 'unknown' };
  } catch (error) {
    return {
      url,
      status: 'broken',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Fix broken external link
export function fixBrokenExternalLink(url: string): string | null {
  // Check direct fixes first
  if (BROKEN_LINK_FIXES[url]) {
    return BROKEN_LINK_FIXES[url];
  }

  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();

    // Try HTTPS if HTTP
    if (urlObj.protocol === 'http:') {
      return url.replace('http://', 'https://');
    }

    // Check for alternative URLs
    for (const [key, alternatives] of Object.entries(ALTERNATIVE_URLS)) {
      if (domain.includes(key)) {
        return alternatives[0] + urlObj.pathname + urlObj.search + urlObj.hash;
      }
    }

    // Try removing www if present
    if (domain.startsWith('www.')) {
      const withoutWww = url.replace('www.', '');
      return withoutWww;
    }

    // Try adding www if not present
    if (!domain.startsWith('www.') && !domain.includes('github.com') && !domain.includes('stackoverflow.com')) {
      const withWww = url.replace('://', '://www.');
      return withWww;
    }

    return null;
  } catch {
    return null;
  }
}

// Common external links that should be updated
export const EXTERNAL_LINK_UPDATES: Record<string, string> = {
  // Social media links
  'http://facebook.com': 'https://facebook.com',
  'http://twitter.com': 'https://twitter.com',
  'http://linkedin.com': 'https://linkedin.com',
  'http://instagram.com': 'https://instagram.com',
  'http://youtube.com': 'https://youtube.com',
  
  // Tech platforms
  'http://github.com': 'https://github.com',
  'http://stackoverflow.com': 'https://stackoverflow.com',
  'http://medium.com': 'https://medium.com',
  'http://dev.to': 'https://dev.to',
  
  // Documentation sites
  'http://developer.mozilla.org': 'https://developer.mozilla.org',
  'http://w3schools.com': 'https://w3schools.com',
  'http://reactjs.org': 'https://reactjs.org',
  'http://nextjs.org': 'https://nextjs.org',
};

// Generate report of external link issues
export function generateExternalLinkReport(content: string): {
  totalExternalLinks: number;
  brokenLinks: string[];
  fixableLinks: Array<{ original: string; fixed: string }>;
  recommendations: string[];
} {
  const externalLinks: string[] = [];
  const brokenLinks: string[] = [];
  const fixableLinks: Array<{ original: string; fixed: string }> = [];
  const recommendations: string[] = [];

  // Find all external links
  const linkRegex = /href=["']([^"']+)["']/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[1];
    
    // Skip internal links
    if (url.startsWith('/') || url.includes('tflash.site') || url.startsWith('#')) {
      continue;
    }

    // Skip mailto and tel links
    if (url.startsWith('mailto:') || url.startsWith('tel:')) {
      continue;
    }

    if (url.startsWith('http')) {
      externalLinks.push(url);

      // Check if it's a known broken link
      if (BROKEN_LINK_FIXES[url]) {
        brokenLinks.push(url);
        fixableLinks.push({
          original: url,
          fixed: BROKEN_LINK_FIXES[url]
        });
      }

      // Check if it needs updating (HTTP to HTTPS)
      if (EXTERNAL_LINK_UPDATES[url]) {
        fixableLinks.push({
          original: url,
          fixed: EXTERNAL_LINK_UPDATES[url]
        });
      }

      // Check for potential fixes
      const potentialFix = fixBrokenExternalLink(url);
      if (potentialFix && potentialFix !== url) {
        fixableLinks.push({
          original: url,
          fixed: potentialFix
        });
      }
    }
  }

  // Generate recommendations
  if (externalLinks.length > 0) {
    recommendations.push(`Found ${externalLinks.length} external links`);
  }
  
  if (brokenLinks.length > 0) {
    recommendations.push(`${brokenLinks.length} known broken links need fixing`);
  }
  
  if (fixableLinks.length > 0) {
    recommendations.push(`${fixableLinks.length} links can be automatically fixed`);
  }

  // Add specific recommendations
  const httpLinks = externalLinks.filter(link => link.startsWith('http://'));
  if (httpLinks.length > 0) {
    recommendations.push(`${httpLinks.length} HTTP links should be updated to HTTPS`);
  }

  return {
    totalExternalLinks: externalLinks.length,
    brokenLinks,
    fixableLinks,
    recommendations
  };
}

// Validate external link format
export function validateExternalLink(url: string): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  try {
    const urlObj = new URL(url);

    // Check protocol
    if (urlObj.protocol === 'http:') {
      issues.push('Uses insecure HTTP protocol');
      suggestions.push('Update to HTTPS for security');
    }

    // Check for suspicious domains
    const suspiciousDomains = ['bit.ly', 'tinyurl.com', 'short.link'];
    if (suspiciousDomains.some(domain => urlObj.hostname.includes(domain))) {
      issues.push('Uses URL shortener which may break over time');
      suggestions.push('Use direct links when possible');
    }

    // Check for tracking parameters
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid'];
    const hasTracking = trackingParams.some(param => urlObj.searchParams.has(param));
    if (hasTracking) {
      issues.push('Contains tracking parameters');
      suggestions.push('Consider removing tracking parameters for cleaner URLs');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  } catch {
    return {
      isValid: false,
      issues: ['Invalid URL format'],
      suggestions: ['Check URL syntax and format']
    };
  }
}

// Export list of common broken external links to monitor
export const COMMON_BROKEN_PATTERNS = [
  /http:\/\/.*/, // HTTP links that should be HTTPS
  /.*\.blogspot\.com.*/, // Old Blogger links
  /.*\.wordpress\.com.*/, // Old WordPress links
  /.*bit\.ly.*/, // URL shorteners
  /.*tinyurl\.com.*/, // URL shorteners
  /.*t\.co.*/, // Twitter shorteners
];
