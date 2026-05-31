import { Head, Link, usePage } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useLayoutEffect, useRef } from 'react';

import PublicBooks from '@/actions/App/Http/Controllers/BooksController';
import { MaskedWords } from '@/components/masked-words';
import { MorphWordIn } from '@/components/morph-word-in';

gsap.registerPlugin(ScrollTrigger);

export const BOOKS_INTRO =
    'My bookshelf - where I share my thoughts and notes on the books I have read or am reading.';

export type PublicBookListItem = {
    id: number;
    slug: string;
    title: string;
    author: string;
    rating: number;
    date_finished: string | null;
    summary: string;
    image: string;
};

function hasDateFinished(date: string | null | undefined): boolean {
    return date != null && date !== '';
}

type BooksPageProps = {
    books?: PublicBookListItem[];
};

export default function Books() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { books: bookRows = [] } = usePage<BooksPageProps>().props;

    useLayoutEffect(() => {
        gsap.set(['.page-title', '.page-intro'], { opacity: 0, y: 24 });
        gsap.set('.page-intro .word', { yPercent: 120 });
        gsap.set('.book-row', { opacity: 0, y: 22 });
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
                '.book-row',
                { y: 22, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.07, duration: 0.55, delay: 0.5, ease: 'power2.out' },
            );
        }, containerRef);

        return () => ctx.revert();
    }, [bookRows.length]);

    return (
        <>
            <Head title="Books" />
            <div ref={containerRef} className="pt-36 pb-24">
                <div className="mx-auto max-w-[700px] px-6">
                    <h1 className="page-title font-title mb-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-5xl">
                        <MorphWordIn>Books</MorphWordIn>
                    </h1>
                    <p className="page-intro mb-12 text-lg leading-relaxed text-[#1b1b18]/70 dark:text-[#EDEDEC]/70">
                        <MaskedWords>{BOOKS_INTRO}</MaskedWords>
                    </p>

                    {bookRows.length === 0 ? (
                        <p className="text-[#1b1b18]/50 dark:text-[#EDEDEC]/50">
                            Nothing listed here yet. Check back later.
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-5">
                            {bookRows.map((book) => {
                                const finished = hasDateFinished(book.date_finished);

                                return (
                                    <li key={book.slug}>
                                        <Link
                                            href={PublicBooks.show.url(book.slug)}
                                            className="book-row flex flex-col gap-4 rounded-2xl border border-white/30 bg-white/50 p-4 text-left shadow-md shadow-black/[0.03] backdrop-blur-xl transition-colors hover:border-white/45 hover:bg-white/75 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-black/20 dark:hover:border-white/18 dark:hover:bg-white/[0.09] sm:flex-row sm:items-stretch sm:gap-6 sm:p-5"
                                        >
                                            <div className="relative aspect-[3/4] w-32 shrink-0 self-start overflow-hidden rounded-xl bg-[#f5f5f4] dark:bg-[#1e1e1d] sm:w-36 md:w-40">
                                                {book.image ? (
                                                    <img
                                                        src={book.image}
                                                        alt=""
                                                        className="size-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                ) : null}
                                            </div>
                                            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                                                <h2 className="text-lg font-semibold leading-snug text-[#1b1b18] dark:text-[#EDEDEC] md:text-xl">
                                                    {book.title} - By {book.author}
                                                </h2>
                                                {finished ? (
                                                    <>
                                                        <p className="text-sm tabular-nums text-[#1b1b18]/65 dark:text-[#EDEDEC]/60 md:text-base">
                                                            Rating: {book.rating} / 10
                                                        </p>
                                                        <p className="text-sm text-[#1b1b18]/65 dark:text-[#EDEDEC]/60 md:text-base">
                                                            <span className="font-medium text-[#1b1b18]/80 dark:text-[#EDEDEC]/75">
                                                                Finished:{' '}
                                                            </span>
                                                            {book.date_finished}
                                                        </p>
                                                    </>
                                                ) : book.rating > 0 ? (
                                                    <p className="text-sm tabular-nums text-[#1b1b18]/65 dark:text-[#EDEDEC]/60 md:text-base">
                                                        Rating: {book.rating} / 10
                                                    </p>
                                                ) : (
                                                    <p>
                                                        <span className="inline-flex rounded-full bg-[#f5f5f4] px-3 py-1 text-xs font-medium text-[#1b1b18]/70 dark:bg-[#1e1e1d] dark:text-[#EDEDEC]/60">
                                                            Currently reading
                                                        </span>
                                                    </p>
                                                )}
                                                {book.summary ? (
                                                    <p className="line-clamp-4 text-sm leading-relaxed text-[#1b1b18]/60 dark:text-[#EDEDEC]/55 md:text-base">
                                                        {book.summary}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}
