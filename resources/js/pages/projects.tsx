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
            gsap.from('.page-intro', {
                y: 24,
                opacity: 0,
                duration: 0.5,
                delay: 0.1,
                ease: 'power2.out',
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <Head title="Projects" />
            <div ref={containerRef} className="min-h-screen pt-36 pb-24">
                <div className="mx-auto max-w-[700px] px-6">
                    <h1 className="page-title font-title mb-16 text-center text-3xl font-light leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-5xl">
                        <MorphWordIn>Projects</MorphWordIn>
                    </h1>
                    <p className="page-intro text-lg leading-relaxed text-[#1b1b18]/70 dark:text-[#EDEDEC]/70">
                        Full projects archive and case studies. More coming soon.
                    </p>
                </div>
            </div>
        </>
    );
}
