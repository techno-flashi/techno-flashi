import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm text-text-description mb-6 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="hover:text-primary transition-colors">
            الرئيسية
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-text-description" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {item.href ? (
              <Link href={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-white">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Schema markup للـ breadcrumbs
export function createBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  const listItems = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "الرئيسية",
      "item": "https://tflash.site"
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 2,
      "name": item.label,
      "item": item.href ? `https://tflash.site${item.href}` : undefined
    }))
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": listItems
  };
}
