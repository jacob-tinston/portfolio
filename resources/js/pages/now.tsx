import { MaskedWords } from '@/components/masked-words';
import { MorphWordIn } from '@/components/morph-word-in';
import { Head } from '@inertiajs/react';
import gsap from 'gsap';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

type NowProps = {
    buildingHtml: string;
    learningHtml: string;
    readingHtml: string;
};

const markdownBodyClass =
    'text-base leading-relaxed text-[#1b1b18] dark:text-[#EDEDEC] md:text-lg [&_a]:underline [&_a]:decoration-[#1b1b18]/30 [&_a]:underline-offset-2 [&_a]:transition-colors hover:[&_a]:decoration-[#1b1b18]/60 dark:[&_a]:decoration-[#EDEDEC]/30 dark:hover:[&_a]:decoration-[#EDEDEC]/60 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-medium';

export default function Now({ buildingHtml, learningHtml, readingHtml }: NowProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const sections = useMemo(
        () =>
            [
                { title: 'Building', html: buildingHtml },
                { title: 'Learning', html: learningHtml },
                { title: 'Reading', html: readingHtml },
            ].filter((s) => s.html.trim().length > 0),
        [buildingHtml, learningHtml, readingHtml],
    );

    useLayoutEffect(() => {
        gsap.set(['.page-title', '.page-subtext'], { opacity: 0 });
        gsap.set('.page-subtext .word', { yPercent: 120 });
        gsap.set('.now-item', { opacity: 0, y: 14 });
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.page-title',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'power2.out' },
            );
            gsap.fromTo(
                '.page-subtext',
                { y: 12, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, delay: 0.2, ease: 'power2.out' },
            );
            gsap.fromTo(
                '.page-subtext .word',
                { yPercent: 120 },
                { yPercent: 0, stagger: 0.03, duration: 0.5, delay: 0.35, ease: 'power2.out' },
            );
            if (sections.length > 0) {
                gsap.fromTo(
                    '.now-item',
                    { y: 14, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.06,
                        duration: 0.5,
                        delay: 0.55,
                        ease: 'power2.out',
                    },
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, [sections.length]);

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
                                {`This is my /now page. It's where I keep track of what I'm currently working on, learning and thinking about, as of March 2026.`}
                            </MaskedWords>
                        </p>
                    </header>

                    {sections.length > 0 ? (
                        <dl className="space-y-8">
                            {sections.map((item) => (
                                <div key={item.title} className="now-item">
                                    <dt className="mb-1.5 font-mono text-xs uppercase tracking-widest text-[#1b1b18]/40 dark:text-[#EDEDEC]/40">
                                        {item.title}
                                    </dt>
                                    <dd
                                        className={markdownBodyClass}
                                        // eslint-disable-next-line react/no-danger -- server-sanitised Markdown via CommonMark (html_input: strip)
                                        dangerouslySetInnerHTML={{ __html: item.html }}
                                    />
                                </div>
                            ))}
                        </dl>
                    ) : null}
                </div>
            </div>
        </>
    );
}
