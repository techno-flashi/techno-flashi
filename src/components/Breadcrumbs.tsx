import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="hover:text-primary transition-colors">
            الرئيسية
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <ChevronRightIcon className="w-4 h-4 text-gray-500" />
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
