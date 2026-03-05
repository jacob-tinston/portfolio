import { MaskedWords } from '@/components/masked-words';
import { MorphWordIn } from '@/components/morph-word-in';
import { Head } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.page-title', {
                y: 24,
                opacity: 0,
                duration: 0.55,
                delay: 0.1,
                ease: 'power2.out',
            });
            gsap.from('.page-intro', {
                y: 24,
                opacity: 0,
                duration: 0.55,
                delay: 0.2,
                ease: 'power2.out',
            });
            gsap.from('.page-intro .word', {
                yPercent: 120,
                stagger: 0.04,
                duration: 0.6,
                delay: 0.45,
                ease: 'power2.out',
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <Head title="Projects" />
            <div ref={containerRef} className="pt-36 pb-24">
                <div className="mx-auto max-w-[700px] px-6">
                    <h1 className="page-title font-title mb-16 text-3xl font-light leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-5xl">
                        <MorphWordIn>Projects</MorphWordIn>
                    </h1>
                    <p className="page-intro text-lg leading-relaxed text-[#1b1b18]/70 dark:text-[#EDEDEC]/70">
                        <MaskedWords>Full projects archive and case studies. More coming soon.</MaskedWords>
                    </p>
                </div>
            </div>
        </>
    );
}
