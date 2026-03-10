import { MaskedWords } from '@/components/masked-words';
import { MorphWordIn } from '@/components/morph-word-in';
import { THOUGHTS_INTRO, thoughts } from '@/data/thoughts';
import { Head, Link } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useLayoutEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export default function Thoughts() {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        gsap.set(['.page-title', '.page-intro', '.thoughts-card'], { opacity: 0, y: 24 });
        gsap.set('.page-intro .word', { yPercent: 120 });
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.page-title',
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.55, delay: 0.1, ease: 'power2.out' },
            );
            gsap.fromTo(
                '.page-intro',
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.55, delay: 0.2, ease: 'power2.out' },
            );
            gsap.fromTo(
                '.page-intro .word',
                { yPercent: 120 },
                { yPercent: 0, stagger: 0.04, duration: 0.6, delay: 0.45, ease: 'power2.out' },
            );
            gsap.fromTo(
                '.thoughts-card',
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, delay: 0.5, ease: 'power2.out' },
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <Head title="Thoughts" />
            <div ref={containerRef} className="pt-36 pb-24">
                <div className="mx-auto max-w-[700px] px-6">
                    <h1 className="page-title font-title mb-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-5xl">
                        <MorphWordIn>Thoughts</MorphWordIn>
                    </h1>
                    <p className="page-intro mb-16 text-lg leading-relaxed text-[#1b1b18]/70 dark:text-[#EDEDEC]/70">
                        <MaskedWords>{THOUGHTS_INTRO}</MaskedWords>
                    </p>

                    {thoughts.length === 0 ? (
                        <p className="thoughts-card text-sm text-[#1b1b18]/30 dark:text-[#EDEDEC]/30">
                            Nothing here yet.
                        </p>
                    ) : (
                        <div className="thoughts-card divide-y divide-[#1b1b18]/[0.06] dark:divide-[#EDEDEC]/[0.06]">
                            {thoughts.map((thought) => (
                                <Link
                                    key={thought.slug}
                                    href={`/thoughts/${thought.slug}`}
                                    className="group flex items-center justify-between gap-4 py-5 first:pt-0 last:pb-0"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC] md:text-base">
                                            {thought.title}
                                        </p>
                                        <p className="mt-0.5 font-mono text-xs uppercase tracking-widest text-[#1b1b18]/30 dark:text-[#EDEDEC]/30">
                                            {thought.date}
                                        </p>
                                    </div>
                                    <span
                                        className="shrink-0 text-[#1b1b18]/30 transition-transform group-hover:translate-x-0.5 dark:text-[#EDEDEC]/30"
                                        aria-hidden
                                    >
                                        →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
