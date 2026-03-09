'use client';

export type MaskedWordsLink = {
    word: string;
    href: string;
    external?: boolean;
};

export function MaskedWords({
    children,
    className,
    boldWords = [],
    italicsWords = [],
    links = [],
    linkClassName,
}: {
    children: string;
    className?: string;
    boldWords?: string[];
    italicsWords?: string[];
    links?: MaskedWordsLink[];
    linkClassName?: string;
}) {
    const words = children.split(' ');
    const normalize = (w: string) => w.replace(/[.,—:;]/g, '').toLowerCase();
    const isBold = (w: string) =>
        boldWords.some((b) => normalize(w) === normalize(b));
    const isItalic = (w: string) =>
        italicsWords.some((b) => normalize(w) === normalize(b));
    const getLink = (w: string) =>
        links.find((l) => normalize(l.word) === normalize(w));

    return (
        <span className={className} aria-label={children}>
            {words.map((word, i) => {
                const link = getLink(word);
                const content = isBold(word) ? (
                    <strong>{word}</strong>
                ) : isItalic(word) ? (
                    <span className="font-quote italic">{word}</span>
                ) : link ? (
                    <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className={linkClassName}
                    >
                        {word}
                    </a>
                ) : (
                    word
                );
                return (
                    <span key={i} className="inline-block [overflow:clip]" aria-hidden="true">
                        <span className="word inline-block">
                            {content}
                            {i < words.length - 1 ? '\u00A0' : ''}
                        </span>
                    </span>
                );
            })}
        </span>
    );
}
