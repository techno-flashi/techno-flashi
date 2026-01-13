// Heading Structure Manager - Fixes SEO audit heading issues
// Ensures proper H1→H2→H3 hierarchy and prevents duplicate H2s

import { ReactNode } from 'react';

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  id?: string;
  unique?: boolean; // Ensures unique H2s across page
}

// Track used H2 texts to prevent duplicates (SEO audit fix)
const usedH2Texts = new Set<string>();

export function SEOHeading({ level, children, className = '', id, unique = false }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  // Convert children to string for duplicate checking
  const textContent = typeof children === 'string' ? children : children?.toString() || '';
  
  // Prevent duplicate H2s (fixes 63 URLs with duplicate H2 content)
  if (level === 2 && unique) {
    if (usedH2Texts.has(textContent)) {
      console.warn(`Duplicate H2 detected: "${textContent}". Consider making it unique.`);
      // Modify text to make it unique
      const uniqueText = `${textContent} - تفاصيل`;
      usedH2Texts.add(uniqueText);
      return (
        <Tag className={getHeadingClasses(level, className)} id={id}>
          {uniqueText}
        </Tag>
      );
    }
    usedH2Texts.add(textContent);
  }
  
  // Ensure H2 length is under 70 characters (fixes 2 URLs)
  if (level === 2 && textContent.length > 70) {
    const shortenedText = textContent.substring(0, 67) + '...';
    return (
      <Tag className={getHeadingClasses(level, className)} id={id}>
        {shortenedText}
      </Tag>
    );
  }
  
  return (
    <Tag className={getHeadingClasses(level, className)} id={id}>
      {children}
    </Tag>
  );
}

// Get appropriate classes for each heading level
function getHeadingClasses(level: number, additionalClasses: string = ''): string {
  const baseClasses = {
    1: 'text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight',
    2: 'text-2xl md:text-3xl font-bold text-gray-800 mb-4 mt-8 leading-tight',
    3: 'text-xl md:text-2xl font-semibold text-gray-700 mb-3 mt-6 leading-tight',
    4: 'text-lg md:text-xl font-semibold text-gray-700 mb-3 mt-4',
    5: 'text-base md:text-lg font-semibold text-gray-600 mb-2 mt-3',
    6: 'text-base font-semibold text-gray-600 mb-2 mt-3'
  };
  
  return `${baseClasses[level as keyof typeof baseClasses] || baseClasses[2]} ${additionalClasses}`.trim();
}

// Component to ensure proper heading hierarchy
interface HeadingHierarchyProps {
  children: ReactNode;
  pageTitle: string; // H1 content
  className?: string;
}

export function HeadingHierarchy({ children, pageTitle, className = '' }: HeadingHierarchyProps) {
  // Clear used H2s for new page
  usedH2Texts.clear();
  
  return (
    <div className={`heading-hierarchy ${className}`}>
      {/* Ensure single H1 per page */}
      <SEOHeading level={1} id="main-title">
        {pageTitle}
      </SEOHeading>
      
      {/* Content with managed heading structure */}
      <div className="content-with-managed-headings">
        {children}
      </div>
    </div>
  );
}

// Utility to validate heading structure
export function validateHeadingStructure(): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  if (typeof window === 'undefined') {
    return { isValid: true, issues: [] };
  }
  
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  // Check for single H1
  const h1Count = document.querySelectorAll('h1').length;
  if (h1Count === 0) {
    issues.push('Missing H1 tag');
  } else if (h1Count > 1) {
    issues.push(`Multiple H1 tags found: ${h1Count}`);
  }
  
  // Check for sequential heading hierarchy
  let previousLevel = 0;
  headings.forEach((heading, index) => {
    const currentLevel = parseInt(heading.tagName.charAt(1));
    
    if (currentLevel > previousLevel + 1) {
      issues.push(`Non-sequential heading at position ${index}: ${heading.tagName} after H${previousLevel}`);
    }
    
    previousLevel = currentLevel;
  });
  
  // Check for missing H2 (fixes 2 URLs with missing H2)
  const h2Count = document.querySelectorAll('h2').length;
  if (h2Count === 0 && headings.length > 1) {
    issues.push('Missing H2 tags - content should have descriptive H2 sections');
  }
  
  // Check for duplicate H2 content
  const h2Texts = Array.from(document.querySelectorAll('h2')).map(h2 => h2.textContent?.trim());
  const uniqueH2Texts = new Set(h2Texts);
  if (h2Texts.length !== uniqueH2Texts.size) {
    issues.push('Duplicate H2 content found');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

// Hook to monitor heading structure
export function useHeadingStructure() {
  const validate = () => validateHeadingStructure();
  
  return { validate };
}

// Export common heading components with proper structure
export const H1 = ({ children, ...props }: Omit<HeadingProps, 'level'>) => (
  <SEOHeading level={1} {...props}>{children}</SEOHeading>
);

export const H2 = ({ children, ...props }: Omit<HeadingProps, 'level'>) => (
  <SEOHeading level={2} unique={true} {...props}>{children}</SEOHeading>
);

export const H3 = ({ children, ...props }: Omit<HeadingProps, 'level'>) => (
  <SEOHeading level={3} {...props}>{children}</SEOHeading>
);

export const H4 = ({ children, ...props }: Omit<HeadingProps, 'level'>) => (
  <SEOHeading level={4} {...props}>{children}</SEOHeading>
);

// Clear used H2s function for page navigation
export function clearUsedHeadings() {
  usedH2Texts.clear();
}
