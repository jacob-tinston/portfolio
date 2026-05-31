/**
 * Shared typography for server-rendered markdown HTML (dangerouslySetInnerHTML).
 */
export const MARKDOWN_BODY_CLASS =
    [
        'text-base leading-relaxed text-[#1b1b18] dark:text-[#EDEDEC] md:text-lg',
        '[&_a]:underline [&_a]:decoration-[#1b1b18]/30 [&_a]:underline-offset-2 [&_a]:transition-colors',
        'hover:[&_a]:decoration-[#1b1b18]/60 dark:[&_a]:decoration-[#EDEDEC]/30 dark:hover:[&_a]:decoration-[#EDEDEC]/60',
        '[&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-medium',
        '[&_blockquote]:my-6 [&_blockquote]:rounded-r-xl [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#1b1b18]/30',
        '[&_blockquote]:bg-[#f5f5f4]/70 [&_blockquote]:py-3.5 [&_blockquote]:pl-5 [&_blockquote]:pr-4',
        'dark:[&_blockquote]:border-white/20 dark:[&_blockquote]:bg-white/[0.06]',
        '[&_blockquote_p]:mb-3 [&_blockquote_p:last-child]:mb-0 [&_blockquote_p]:text-[#1b1b18]/90 dark:[&_blockquote_p]:text-[#EDEDEC]/90',
        '[&_blockquote_cite]:mt-3 [&_blockquote_cite]:block [&_blockquote_cite]:text-sm [&_blockquote_cite]:font-normal [&_blockquote_cite]:not-italic',
        '[&_blockquote_cite]:text-[#1b1b18]/55 dark:[&_blockquote_cite]:text-[#EDEDEC]/50',
    ].join(' ');
