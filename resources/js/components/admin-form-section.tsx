import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type AdminFormSectionProps = {
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
};

/**
 * Grouped block for content admin forms (projects, books, etc.).
 */
export function AdminFormSection({ title, description, children, className }: AdminFormSectionProps) {
    return (
        <section
            className={cn(
                'rounded-xl border border-border/80 bg-card/40 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04] md:p-6',
                className,
            )}
        >
            <header className="border-b border-border/60 pb-3 dark:border-white/10">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#1b1b18] dark:text-[#EDEDEC]">
                    {title}
                </h2>
                {description ? (
                    <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{description}</p>
                ) : null}
            </header>
            <div className="mt-5 flex min-w-0 flex-col gap-4">{children}</div>
        </section>
    );
}
