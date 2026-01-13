'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface AIToolLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AIToolLink({ href, children, className, onClick }: AIToolLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
    
    // For AI tool navigation, ensure proper page transition
    if (href.startsWith('/ai-tools/') && href !== window.location.pathname) {
      e.preventDefault();
      
      // Force a clean navigation to prevent the tool switching bug
      router.push(href);
      
      // Small delay to ensure proper route change
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
