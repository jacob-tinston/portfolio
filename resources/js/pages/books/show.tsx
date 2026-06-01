import { Head, Link, usePage } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useLayoutEffect, useRef } from 'react';

import PublicBooks from '@/actions/App/Http/Controllers/BooksController';
import { MARKDOWN_BODY_CLASS } from '@/lib/markdown-body-class';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

function hasDateFinished(date: string | null | undefined): boolean {
    return date != null && date !== '';
}

export type PublicBookShow = {
    id: number;
    slug: string;
    title: string;
    author: string;
    rating: number;
    isbn: string | null;
    date_finished: string | null;
    summary: string;
    notes_html: string;
    image: string;
    is_hidden: boolean;
};

type BookShowPageProps = {
    book: PublicBookShow;
};

export default function BookShow() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { book } = usePage<BookShowPageProps>().props;
    const finished = hasDateFinished(book.date_finished);
    const hasRatedWhileReading = !finished && book.rating > 0;

    useLayoutEffect(() => {
        gsap.set(['.page-back', '.book-show-hero', '.book-show-block'], { opacity: 0 });
        gsap.set('.page-back', { y: 10 });
        gsap.set('.book-show-hero', { y: 18 });
        gsap.set('.book-show-block', { y: 14 });
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.page-back',
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, delay: 0.05, ease: 'power2.out' },
            );
            gsap.fromTo(
                '.book-show-hero',
                { y: 18, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.55, delay: 0.12, ease: 'power2.out' },
            );
            gsap.fromTo(
                '.book-show-block',
                { y: 14, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, delay: 0.35, ease: 'power2.out' },
            );
        }, containerRef);

        return () => ctx.revert();
    }, [book.slug, finished, book.rating]);

    return (
        <>
            <Head title={book.title} />
            <div ref={containerRef} className="pt-36 pb-24">
                <div className="mx-auto max-w-[700px] px-6">
                    <Link
                        href={PublicBooks.index.url()}
                        className="page-back mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#1b1b18]/40 transition-colors hover:text-[#1b1b18]/70 dark:text-[#EDEDEC]/40 dark:hover:text-[#EDEDEC]/70"
                    >
                        ← Books
                    </Link>

                    {book.is_hidden ? (
                        <p className="book-show-block mb-6 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-950 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
                            This book is hidden from the public.
                        </p>
                    ) : null}

                    <div className="book-show-hero flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
                        <div className="w-full max-w-[220px] shrink-0 self-start overflow-hidden rounded-2xl border border-white/30 bg-[#f5f5f4] shadow-lg shadow-black/[0.04] dark:border-white/10 dark:bg-[#1e1e1d] dark:shadow-black/20 sm:max-w-[260px] md:w-[42%] md:max-w-none">
                            {book.image ? (
                                <img
                                    src={book.image}
                                    alt=""
                                    className="aspect-[3/4] size-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="aspect-[3/4] w-full bg-muted/40" aria-hidden />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <h1 className="font-title mb-4 leading-snug tracking-tight text-[#1b1b18] dark:text-[#EDEDEC]">
                                <span className="block text-2xl font-light sm:text-3xl md:text-4xl">
                                    {book.title}
                                </span>
                                <span className="mt-2 block text-base font-light text-[#1b1b18]/70 dark:text-[#EDEDEC]/65 sm:text-lg md:text-xl">
                                    by {book.author}
                                </span>
                            </h1>
                            <dl className="book-show-block text-sm text-[#1b1b18]/70 dark:text-[#EDEDEC]/65 md:text-base">
                                {finished ? (
                                    <div
                                        className={cn(
                                            'grid gap-x-3 gap-y-3 md:flex md:flex-col md:gap-5',
                                            book.isbn ? 'grid-cols-3' : 'grid-cols-2',
                                        )}
                                    >
                                        <div className="min-w-0">
                                            <dt className="font-mono text-xs uppercase tracking-widest text-[#1b1b18]/45 dark:text-[#EDEDEC]/45">
                                                Rating
                                            </dt>
                                            <dd className="tabular-nums">Rating: {book.rating} / 10</dd>
                                        </div>
                                        <div className="min-w-0">
                                            <dt className="font-mono text-xs uppercase tracking-widest text-[#1b1b18]/45 dark:text-[#EDEDEC]/45">
                                                Finished
                                            </dt>
                                            <dd>{book.date_finished}</dd>
                                        </div>
                                        {book.isbn ? (
                                            <div className="min-w-0">
                                                <dt className="font-mono text-xs uppercase tracking-widest text-[#1b1b18]/45 dark:text-[#EDEDEC]/45">
                                                    ISBN
                                                </dt>
                                                <dd className="break-all">{book.isbn}</dd>
                                            </div>
                                        ) : null}
                                    </div>
                                ) : hasRatedWhileReading ? (
                                    book.isbn ? (
                                        <div className="grid grid-cols-2 gap-x-3 gap-y-3 md:flex md:flex-col md:gap-5">
                                            <div className="min-w-0">
                                                <dt className="font-mono text-xs uppercase tracking-widest text-[#1b1b18]/45 dark:text-[#EDEDEC]/45">
                                                    Rating
                                                </dt>
                                                <dd className="tabular-nums">Rating: {book.rating} / 10</dd>
                                            </div>
                                            <div className="min-w-0">
                                                <dt className="font-mono text-xs uppercase tracking-widest text-[#1b1b18]/45 dark:text-[#EDEDEC]/45">
                                                    ISBN
                                                </dt>
                                                <dd className="break-all">{book.isbn}</dd>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <dt className="font-mono text-xs uppercase tracking-widest text-[#1b1b18]/45 dark:text-[#EDEDEC]/45">
                                                Rating
                                            </dt>
                                            <dd className="tabular-nums">Rating: {book.rating} / 10</dd>
                                        </div>
                                    )
                                ) : book.isbn ? (
                                    <div className="grid grid-cols-2 gap-x-3 gap-y-3 md:flex md:flex-col md:gap-5">
                                        <div className="min-w-0">
                                            <dt className="font-mono text-xs uppercase tracking-widest text-[#1b1b18]/45 dark:text-[#EDEDEC]/45">
                                                Status
                                            </dt>
                                            <dd>
                                                <span className="inline-flex rounded-full bg-[#f5f5f4] px-3 py-1 text-xs font-medium text-[#1b1b18]/70 dark:bg-[#1e1e1d] dark:text-[#EDEDEC]/60">
                                                    Currently reading
                                                </span>
                                            </dd>
                                        </div>
                                        <div className="min-w-0">
                                            <dt className="font-mono text-xs uppercase tracking-widest text-[#1b1b18]/45 dark:text-[#EDEDEC]/45">
                                                ISBN
                                            </dt>
                                            <dd className="break-all">{book.isbn}</dd>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <dt className="font-mono text-xs uppercase tracking-widest text-[#1b1b18]/45 dark:text-[#EDEDEC]/45">
                                            Status
                                        </dt>
                                        <dd>
                                            <span className="inline-flex rounded-full bg-[#f5f5f4] px-3 py-1 text-xs font-medium text-[#1b1b18]/70 dark:bg-[#1e1e1d] dark:text-[#EDEDEC]/60">
                                                Currently reading
                                            </span>
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>

                    {book.summary ? (
                        <section className="book-show-block mt-10">
                            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-[#1b1b18]/45 dark:text-[#EDEDEC]/45">
                                Summary
                            </h2>
                            <p className="whitespace-pre-line text-base leading-relaxed text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 md:text-lg">
                                {book.summary}
                            </p>
                        </section>
                    ) : null}

                    {book.notes_html.trim().length > 0 ? (
                        <section className="book-show-block mt-10">
                            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-[#1b1b18]/45 dark:text-[#EDEDEC]/45">
                                Notes
                            </h2>
                            <div
                                className={MARKDOWN_BODY_CLASS}
                                dangerouslySetInnerHTML={{ __html: book.notes_html }}
                            />
                        </section>
                    ) : null}
                </div>
            </div>
        </>
    );
}
