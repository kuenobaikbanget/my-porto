import { useEffect, useRef, useState } from 'react';

interface UseRevealOnScrollOptions {
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
}

interface RevealOnScrollResult<T extends HTMLElement> {
    ref: React.RefObject<T | null>;
    isVisible: boolean;
}

export function useRevealOnScroll<T extends HTMLElement = HTMLElement>(options: UseRevealOnScrollOptions = {}): RevealOnScrollResult<T> {
    const { threshold = 0.2, rootMargin = '0px', once = true } = options;
    const ref = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) {
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) {
                        observer.unobserve(entry.target);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            });
        }, { threshold, rootMargin });

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin, once]);

    return { ref, isVisible };
}
