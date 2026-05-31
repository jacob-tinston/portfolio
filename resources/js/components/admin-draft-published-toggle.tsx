import { cn } from '@/lib/utils';

type AdminDraftPublishedToggleProps = {
    published: boolean;
    onPublishedChange: (published: boolean) => void;
    disabled?: boolean;
};

/**
 * Segmented control: draft (no public URL) vs published (live or hidden-from-list only).
 */
export function AdminDraftPublishedToggle({ published, onPublishedChange, disabled }: AdminDraftPublishedToggleProps) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground hidden text-[0.65rem] font-semibold uppercase tracking-widest sm:inline">
                Publication
            </span>
            <div
                className="inline-flex rounded-lg border border-border/80 bg-muted/35 p-0.5 dark:bg-muted/25"
                role="group"
                aria-label="Publication status"
            >
                <button
                    type="button"
                    disabled={disabled}
                    aria-pressed={!published}
                    onClick={() => onPublishedChange(false)}
                    className={cn(
                        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50',
                        !published
                            ? 'bg-background text-foreground shadow-sm dark:bg-[#1e1e1d]'
                            : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    Draft
                </button>
                <button
                    type="button"
                    disabled={disabled}
                    aria-pressed={published}
                    onClick={() => onPublishedChange(true)}
                    className={cn(
                        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50',
                        published
                            ? 'bg-background text-foreground shadow-sm dark:bg-[#1e1e1d]'
                            : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    Published
                </button>
            </div>
        </div>
    );
}
