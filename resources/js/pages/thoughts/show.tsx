import { Head, Link, usePage } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useLayoutEffect, useRef } from 'react';
import ThoughtsController from '@/actions/App/Http/Controllers/ThoughtsController';
import { MorphWordIn } from '@/components/morph-word-in';
import { MARKDOWN_BODY_CLASS } from '@/lib/markdown-body-class';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

type ThoughtShowPayload = {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    body_html: string;
};

type ThoughtShowPageProps = {
    thought: ThoughtShowPayload;
};

export default function ThoughtShow() {
    const { thought } = usePage<ThoughtShowPageProps>().props;
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        gsap.set(['.page-title', '.page-meta', '.page-back'], { opacity: 0 });
        gsap.set('.thought-body', { opacity: 0, y: 14 });
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.page-back',
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, delay: 0.05, ease: 'power2.out' },
            );
            gsap.fromTo(
                '.page-title',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'power2.out' },
            );
            gsap.fromTo(
                '.page-meta',
                { y: 12, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, delay: 0.2, ease: 'power2.out' },
            );
            gsap.fromTo(
                '.thought-body',
                { y: 14, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, delay: 0.3, ease: 'power2.out' },
            );
        }, containerRef);

        return () => ctx.revert();
    }, [thought.slug]);

    return (
        <>
            <Head title={thought.title} />
            <div ref={containerRef} className="pt-36 pb-24">
                <div className="mx-auto max-w-[700px] px-6">
                    <Link
                        href={ThoughtsController.index.url()}
                        className="page-back mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#1b1b18]/40 transition-colors hover:text-[#1b1b18]/70 dark:text-[#EDEDEC]/40 dark:hover:text-[#EDEDEC]/70"
                    >
                        ← Thoughts
                    </Link>

                    <header className="mb-12">
                        <h1 className="page-title font-title mb-4 text-3xl font-light leading-tight tracking-tight text-[#1b1b18] dark:text-[#EDEDEC] sm:text-4xl md:text-5xl lg:text-5xl">
                            <MorphWordIn>{thought.title}</MorphWordIn>
                        </h1>
                        <div className="page-meta flex flex-wrap items-center gap-3">
                            <span className="font-mono text-xs uppercase tracking-widest text-[#1b1b18]/40 dark:text-[#EDEDEC]/40">
                                {thought.date}
                            </span>
                            {thought.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-[#1b1b18]/10 bg-[#1b1b18]/[0.03] px-3 py-1 font-mono text-xs text-[#1b1b18]/50 dark:border-[#EDEDEC]/10 dark:bg-[#EDEDEC]/[0.04] dark:text-[#EDEDEC]/40"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </header>

                    <div
                        className={cn(MARKDOWN_BODY_CLASS, 'thought-body')}
                        dangerouslySetInnerHTML={{ __html: thought.body_html }}
                    />
                </div>
            </div>
        </>
    );
}
