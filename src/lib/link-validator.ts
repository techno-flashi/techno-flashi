// Link Validator - Fixes internal redirects and broken links (SEO audit)
// Ensures all internal links point to final destinations

import { CANONICAL_DOMAIN } from './canonical-url-manager';

interface LinkValidationResult {
  isValid: boolean;
  finalUrl: string;
  redirectChain: string[];
  statusCode?: number;
  error?: string;
}

// Common redirect patterns to fix
const REDIRECT_PATTERNS = {
  // Old URLs that redirect to new ones
  '/blog/': '/articles/',
  '/tools/': '/ai-tools/',
  '/category/': '/articles/',
  '/tag/': '/articles/',
  '/page/': '/',
  // Remove trailing slashes
  '/articles/': '/articles',
  '/ai-tools/': '/ai-tools',
  '/about/': '/about',
  '/contact/': '/contact',
  '/services/': '/services',
  '/privacy-policy/': '/privacy-policy',
  '/terms-of-service/': '/terms-of-service'
};

// Fix internal link to point to final destination
export function fixInternalLink(url: string): string {
  try {
    // Handle relative URLs
    if (url.startsWith('/')) {
      url = `${CANONICAL_DOMAIN}${url}`;
    }
    
    const urlObj = new URL(url);
    
    // Only process internal links
    if (!urlObj.hostname.includes('tflash.site')) {
      return url;
    }
    
    let pathname = urlObj.pathname;
    
    // Apply redirect pattern fixes
    for (const [oldPattern, newPattern] of Object.entries(REDIRECT_PATTERNS)) {
      if (pathname === oldPattern) {
        pathname = newPattern;
        break;
      }
    }
    
    // Remove trailing slash except for root
    if (pathname !== '/' && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    
    // Remove common parameters that cause redirects
    const paramsToRemove = ['m', 'utm_source', 'utm_medium', 'utm_campaign', 'ref', 'source'];
    paramsToRemove.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    
    // Construct final URL
    const finalUrl = `${CANONICAL_DOMAIN}${pathname}${urlObj.search}${urlObj.hash}`;
    
    return finalUrl;
  } catch (error) {
    console.warn('Error fixing internal link:', url, error);
    return url;
  }
}

// Validate if a link causes redirects
export async function validateInternalLink(url: string): Promise<LinkValidationResult> {
  try {
    const fixedUrl = fixInternalLink(url);
    
    // If URL was changed, it was a redirect
    if (fixedUrl !== url) {
      return {
        isValid: false,
        finalUrl: fixedUrl,
        redirectChain: [url, fixedUrl],
        statusCode: 301
      };
    }
    
    return {
      isValid: true,
      finalUrl: url,
      redirectChain: [url]
    };
  } catch (error) {
    return {
      isValid: false,
      finalUrl: url,
      redirectChain: [url],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Get all internal links from a page and validate them
export function findInternalRedirects(content: string): {
  redirects: Array<{ original: string; fixed: string }>;
  count: number;
} {
  const redirects: Array<{ original: string; fixed: string }> = [];
  
  // Find all href attributes
  const hrefRegex = /href=["']([^"']+)["']/g;
  let match;
  
  while ((match = hrefRegex.exec(content)) !== null) {
    const originalUrl = match[1];
    
    // Only process internal links
    if (originalUrl.startsWith('/') || originalUrl.includes('tflash.site')) {
      const fixedUrl = fixInternalLink(originalUrl);
      
      if (fixedUrl !== originalUrl) {
        redirects.push({
          original: originalUrl,
          fixed: fixedUrl
        });
      }
    }
  }
  
  return {
    redirects,
    count: redirects.length
  };
}

// Common broken external links to fix or remove
export const BROKEN_EXTERNAL_LINKS = [
  // Add known broken external links here
  'http://example.com/broken-link',
  'https://old-domain.com/page',
  // These will be identified during audit
];

// Fix or remove broken external links
export function fixExternalLink(url: string): string | null {
  // Check if it's a known broken link
  if (BROKEN_EXTERNAL_LINKS.includes(url)) {
    return null; // Remove the link
  }
  
  // Fix common issues
  if (url.startsWith('http://')) {
    // Try HTTPS version
    return url.replace('http://', 'https://');
  }
  
  return url;
}

// Validate external link (basic check)
export function isValidExternalLink(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Must be HTTP or HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Must have valid hostname
    if (!urlObj.hostname || urlObj.hostname.length < 3) {
      return false;
    }
    
    // Check against known broken links
    if (BROKEN_EXTERNAL_LINKS.includes(url)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

// Generate report of link issues
export function generateLinkReport(content: string): {
  internalRedirects: number;
  brokenExternalLinks: string[];
  fixedLinks: Array<{ original: string; fixed: string }>;
} {
  const { redirects } = findInternalRedirects(content);
  const brokenExternalLinks: string[] = [];
  const fixedLinks: Array<{ original: string; fixed: string }> = [];
  
  // Find external links
  const hrefRegex = /href=["']([^"']+)["']/g;
  let match;
  
  while ((match = hrefRegex.exec(content)) !== null) {
    const url = match[1];
    
    // Check external links
    if (!url.startsWith('/') && !url.includes('tflash.site') && url.startsWith('http')) {
      if (!isValidExternalLink(url)) {
        brokenExternalLinks.push(url);
      }
      
      const fixedUrl = fixExternalLink(url);
      if (fixedUrl && fixedUrl !== url) {
        fixedLinks.push({ original: url, fixed: fixedUrl });
      }
    }
  }
  
  return {
    internalRedirects: redirects.length,
    brokenExternalLinks,
    fixedLinks: [...redirects, ...fixedLinks]
  };
}
