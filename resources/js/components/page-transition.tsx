'use client';

import gsap from 'gsap';
import { useEffect, useRef } from 'react';

const DEFAULT_DURATION = 0.5;
const DEFAULT_EASE = 'power2.out';

type PageTransitionProps = {
    children: React.ReactNode;
    className?: string;
    /** Optional: custom duration in seconds */
    duration?: number;
    /** Optional: 'fade' | 'slideUp' | 'scale' | 'curtain' */
    variant?: 'fade' | 'slideUp' | 'scale' | 'curtain';
};

export function PageTransition({
    children,
    className,
    duration = DEFAULT_DURATION,
    variant = 'slideUp',
}: PageTransitionProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        const fromProps =
            variant === 'fade'
                ? { opacity: 0 }
                : variant === 'slideUp'
                  ? { opacity: 0, y: 24 }
                  : variant === 'scale'
                    ? { opacity: 0, scale: 0.98 }
                    : { opacity: 0, clipPath: 'inset(0 100% 0 0)' };

        const tween = gsap.fromTo(
            el,
            fromProps,
            {
                opacity: 1,
                y: 0,
                scale: 1,
                clipPath: 'inset(0 0% 0 0)',
                duration,
                ease: DEFAULT_EASE,
                overwrite: 'auto',
                onComplete: () => {
                    // Clear transform so position:fixed (e.g. ScrollTrigger pin) is relative to viewport, not this wrapper
                    gsap.set(el, { clearProps: 'transform' });
                },
            },
        );
        return () => tween.kill();
    }, [duration, variant]);

    return (
        <div ref={wrapperRef} className={className}>
            {children}
        </div>
    );
}
