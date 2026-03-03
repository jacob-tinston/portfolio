import { MorphWordIn } from '@/components/morph-word-in';
import { Head } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const nowItems = [
    { title: 'Building', description: 'Working on my portfolio and exploring new interaction patterns.' },
    { title: 'Learning', description: 'Diving deeper into animation, creative coding, and design systems.' },
    { title: 'Reading', description: 'Currently reading about typography and visual storytelling.' },
    { title: 'Exploring', description: 'Experimenting with generative art and physics simulations.' },
];

export default function Now() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.now-card', {
                y: 32,
                opacity: 0,
                stagger: 0.08,
                duration: 0.55,
                delay: 0.15,
                ease: 'power2.out',
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <Head title="Now" />
            <div ref={containerRef} className="min-h-screen pt-36 pb-24">
                <div className="mx-auto max-w-[700px] px-6">
                    <h1 className="page-title font-title mb-16 text-center text-3xl font-light leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-5xl">
                        <MorphWordIn>Now</MorphWordIn>
                    </h1>
                    <div className="grid gap-6 md:grid-cols-2">
                        {nowItems.map((item, i) => (
                            <div
                                key={i}
                                className="now-card relative z-10 rounded-2xl border border-white/30 bg-white/60 p-6 shadow-lg shadow-black/[0.04] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20"
                            >
                                <h2 className="mb-2 text-lg font-semibold">{item.title}</h2>
                                <p className="text-sm leading-relaxed text-[#1b1b18]/60 dark:text-[#EDEDEC]/50">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
