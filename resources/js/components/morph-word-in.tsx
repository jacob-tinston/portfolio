'use client';

import gsap from 'gsap';
import { useEffect, useId, useRef, useState } from 'react';

const MORPH_DURATION = 2;

function setMorph(
    text1: HTMLSpanElement | null,
    text2: HTMLSpanElement | null,
    fromText: string,
    toText: string,
    fraction: number,
): void {
    if (!text1 || !text2) return;
    text1.textContent = fromText;
    text2.textContent = toText;
    text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
    const f1 = 1 - fraction;
    text1.style.filter = `blur(${Math.min(8 / f1 - 8, 100)}px)`;
    text1.style.opacity = `${Math.pow(f1, 0.4) * 100}%`;
}

type MorphWordInProps = {
    children: string;
    className?: string;
    duration?: number;
    /** Delay before morph runs (use on subpages so it plays after page transition) */
    delay?: number;
};

export function MorphWordIn({
    children,
    className,
    duration = MORPH_DURATION,
    delay: delaySec = 0,
}: MorphWordInProps) {
    const id = useId().replace(/:/g, '');
    const text1Ref = useRef<HTMLSpanElement>(null);
    const text2Ref = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLSpanElement>(null);
    const [started, setStarted] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0].isIntersecting || started) return;
                setStarted(true);
            },
            { rootMargin: '-10% 0px -20% 0px', threshold: 0 },
        );
        observer.observe(container);
        return () => observer.disconnect();
    }, [started]);

    // Keep at 0 opacity a bit longer, then reveal and allow morph to run
    useEffect(() => {
        if (!started) return;
        const t = setTimeout(() => setVisible(true));
        return () => clearTimeout(t);
    }, [started]);

    // Set initial content: first "word" is empty so we morph from nothing into the title
    useEffect(() => {
        const text1 = text1Ref.current;
        const text2 = text2Ref.current;
        if (!text1 || !text2) return;
        text1.textContent = '';
        text2.textContent = children;
        text1.style.opacity = '100%';
        text1.style.filter = '';
        text2.style.opacity = '0%';
        text2.style.filter = '';
    }, [children]);

    useEffect(() => {
        if (!visible) return;
        const text1 = text1Ref.current;
        const text2 = text2Ref.current;
        if (!text1 || !text2) return;

        const obj = { f: 0 };
        const tween = gsap.to(obj, {
            f: 1,
            duration,
            delay: delaySec,
            ease: 'power2.out',
            onUpdate: () => setMorph(text1, text2, '', children, obj.f),
        });
        return () => {
            tween.kill();
        };
    }, [children, duration, delaySec, visible]);

    return (
        <>
            <svg className="absolute size-0 overflow-hidden" aria-hidden>
                <defs>
                    <filter id={`threshold-${id}`}>
                        <feColorMatrix
                            in="SourceGraphic"
                            type="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"
                        />
                    </filter>
                </defs>
            </svg>
            <span
                ref={containerRef}
                className={`relative inline-block ${className ?? ''}`}
                style={{
                    filter: `url(#threshold-${id}) blur(0px)`,
                    opacity: visible ? 1 : 0,
                }}
                aria-label={children}
            >
                <span
                    ref={text1Ref}
                    className="absolute left-0 top-0 inline-block w-full h-full text-left select-none"
                    aria-hidden
                />
                <span
                    ref={text2Ref}
                    className="absolute left-0 top-0 inline-block w-full h-full text-left select-none"
                    aria-hidden
                />
                <span className="invisible whitespace-nowrap" aria-hidden>
                    {children}
                </span>
            </span>
        </>
    );
}
