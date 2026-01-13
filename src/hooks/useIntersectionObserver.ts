import { useEffect, useState, useRef } from 'react';

interface UseIntersectionObserverOptions {
  rootMargin?: string;
  threshold?: number | number[];
  root?: Element | null;
  triggerOnce?: boolean;
}

export function useIntersectionObserver({
  rootMargin = '0px',
  threshold = 0.1,
  root = null,
  triggerOnce = true,
}: UseIntersectionObserverOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    // Skip if already triggered and triggerOnce is true
    if (triggerOnce && hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting;
        setIsIntersecting(isCurrentlyIntersecting);

        if (isCurrentlyIntersecting && triggerOnce) {
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, root, triggerOnce, hasTriggered]);

  const setRef = (node: HTMLDivElement | null) => {
    targetRef.current = node;
  };

  return [setRef, isIntersecting, hasTriggered] as const;
}

export default useIntersectionObserver;
