'use client';

export function MaskedWords({
    children,
    className,
    boldWords = [],
    italicsWords = [],
}: {
    children: string;
    className?: string;
    boldWords?: string[];
    italicsWords?: string[];
}) {
    const words = children.split(' ');
    const normalize = (w: string) => w.replace(/[.,—:;]/g, '').toLowerCase();
    const isBold = (w: string) =>
        boldWords.some((b) => normalize(w) === normalize(b));
    const isItalic = (w: string) =>
        italicsWords.some((b) => normalize(w) === normalize(b));
    return (
        <span className={className} aria-label={children}>
            {words.map((word, i) => (
                <span key={i} className="inline-flex overflow-hidden" aria-hidden="true">
                    <span className="word inline-block">
                        {isBold(word) ? (
                            <strong>{word}</strong>
                        ) : isItalic(word) ? (
                            <span className="font-quote italic">{word}</span>
                        ) : (
                            word
                        )}
                        {i < words.length - 1 ? '\u00A0' : ''}
                    </span>
                </span>
            ))}
        </span>
    );
}
