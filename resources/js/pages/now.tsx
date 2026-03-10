import { MaskedWords } from '@/components/masked-words';
import { MorphWordIn } from '@/components/morph-word-in';
import { Head } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useLayoutEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const nowItems = [
    { title: 'Building', description: 'Currently at Altlabs looking after existing clients, working on new projects and building a range of AI products. The new stuff is where most of my energy goes but improving what\'s already there is just as interesting when the problems are right.' },
    { title: 'Learning', description: 'Expanding my knowledge on AI architecture and systems design. Spending most of my time right now on RAG and retrieval patterns, but also working through how to build LLM-powered systems that are reliable in production.' },
    { title: 'Reading', description: 'Halfway through \'Cosmos\' by Carl Sagan. I\'ve always been fascinated by the vastness of the universe - it\'s interesting to think about our role in it and how we fit in.' },
];

export default function Now() {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        gsap.set(['.page-title', '.page-subtext'], { opacity: 0 });
        gsap.set('.page-subtext .word', { yPercent: 120 });
        gsap.set('.now-item', { opacity: 0, y: 14 });
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.page-title',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'power2.out' },
            );
            gsap.fromTo('.page-subtext',
                { y: 12, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, delay: 0.2, ease: 'power2.out' },
            );
            gsap.fromTo('.page-subtext .word',
                { yPercent: 120 },
                { yPercent: 0, stagger: 0.03, duration: 0.5, delay: 0.35, ease: 'power2.out' },
            );
            gsap.fromTo('.now-item',
                { y: 14, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, delay: 0.38, ease: 'power2.out' },
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <Head title="Now" />
            <div ref={containerRef} className="pt-36 pb-24">
                <div className="mx-auto max-w-[700px] px-6">
                    <header className="mb-12">
                        <h1 className="page-title font-title mb-4 text-3xl font-light leading-tight tracking-tight text-[#1b1b18] dark:text-[#EDEDEC] sm:text-4xl md:text-5xl lg:text-5xl">
                            <MorphWordIn>Now</MorphWordIn>
                        </h1>
                        <p className="page-subtext text-lg leading-relaxed text-[#1b1b18]/70 dark:text-[#EDEDEC]/70">
                            <MaskedWords
                                links={[
                                    {
                                        word: '/now',
                                        href: 'https://nownownow.com/about',
                                        external: true,
                                    },
                                ]}
                                linkClassName="underline decoration-[#1b1b18]/30 underline-offset-2 transition-colors hover:decoration-[#1b1b18]/60 dark:decoration-[#EDEDEC]/30 dark:hover:decoration-[#EDEDEC]/60"
                            >
                                This is my /now page. It's where I keep track of what I'm currently working on, learning and thinking about, as of March 2026.
                            </MaskedWords>
                        </p>
                    </header>

                    <dl className="space-y-8">
                        {nowItems.map((item, i) => (
                            <div key={i} className="now-item">
                                <dt className="mb-1.5 font-mono text-xs uppercase tracking-widest text-[#1b1b18]/40 dark:text-[#EDEDEC]/40">
                                    {item.title}
                                </dt>
                                <dd className="text-base leading-relaxed text-[#1b1b18] dark:text-[#EDEDEC] md:text-lg">
                                    {item.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </>
    );
}
