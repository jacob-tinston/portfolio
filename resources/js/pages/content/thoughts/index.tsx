import { Head, Link, router } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import ContentThoughtController from '@/actions/App/Http/Controllers/Content/ContentThoughtController';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { content, dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Content', href: content() },
    { title: 'Thoughts', href: ContentThoughtController.index() },
];

type ThoughtRow = {
    id: number;
    slug: string;
    title: string;
    date_display: string;
    sort_order: number;
    is_published: boolean;
    updated_at?: string | null;
};

function thoughtStatusPresentation(row: ThoughtRow): { label: string; className: string } {
    if (!row.is_published) {
        return {
            label: 'Draft',
            className:
                'bg-[#f5f5f4] text-[#1b1b18]/80 dark:bg-[#1e1e1d] dark:text-[#EDEDEC]/75',
        };
    }

    return {
        label: 'Published',
        className: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200',
    };
}

type ContentThoughtsIndexProps = {
    thoughts: ThoughtRow[];
    status?: string;
};

export default function ContentThoughtsIndex({ thoughts: thoughtRows, status }: ContentThoughtsIndexProps) {
    const [reordering, setReordering] = useState(false);

    const applyReorder = useCallback(
        (ids: number[]) => {
            setReordering(true);
            router.patch(
                ContentThoughtController.reorder.url(),
                { ids },
                {
                    preserveScroll: true,
                    onFinish: () => setReordering(false),
                },
            );
        },
        [],
    );

    const move = useCallback(
        (index: number, direction: -1 | 1) => {
            const nextIndex = index + direction;
            if (nextIndex < 0 || nextIndex >= thoughtRows.length) {
                return;
            }
            const next = [...thoughtRows];
            const [row] = next.splice(index, 1);
            next.splice(nextIndex, 0, row);
            applyReorder(next.map((r) => r.id));
        },
        [applyReorder, thoughtRows],
    );

    const destroy = useCallback((row: ThoughtRow) => {
        if (!window.confirm(`Delete “${row.title}”? This cannot be undone.`)) {
            return;
        }
        router.delete(ContentThoughtController.destroy.url({ thought: row.slug }), {
            preserveScroll: true,
        });
    }, []);

    const statusMessage =
        status === 'thought-deleted'
            ? 'Thought deleted.'
            : status === 'thought-created'
              ? 'Thought created.'
              : 'Use the arrows in each row to set the order shown on the public thoughts page.';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage thoughts" />

            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain">
                    <div className="flex w-full flex-col gap-6 p-4 pb-10 md:p-6 md:pb-12 lg:px-8">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1b1b18] dark:text-[#EDEDEC]">
                                Manage thoughts
                            </h1>
                            <Button variant="outline" asChild className="shrink-0 self-start">
                                <Link href={content()} prefetch>
                                    Back to content
                                </Link>
                            </Button>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-border/80">
                            <table className="w-full min-w-[640px] text-left text-sm">
                                <thead className="bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="w-10 px-3 py-2 font-medium">#</th>
                                        <th className="px-3 py-2 font-medium">Title</th>
                                        <th className="px-3 py-2 font-medium">Date</th>
                                        <th className="px-3 py-2 font-medium">Status</th>
                                        <th className="px-3 py-2 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {thoughtRows.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="text-muted-foreground px-3 py-8 text-center text-sm"
                                            >
                                                No thoughts yet. Create one to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        thoughtRows.map((row, index) => {
                                            const st = thoughtStatusPresentation(row);

                                            return (
                                                <tr
                                                    key={row.id}
                                                    className="border-t border-border/60 odd:bg-background even:bg-muted/20"
                                                >
                                                    <td className="text-muted-foreground px-3 py-3 align-middle tabular-nums">
                                                        {index + 1}
                                                    </td>
                                                    <td className="max-w-[280px] px-3 py-3 align-middle font-medium">
                                                        <span className="line-clamp-2">{row.title}</span>
                                                    </td>
                                                    <td className="px-3 py-3 align-middle text-muted-foreground">
                                                        {row.date_display}
                                                    </td>
                                                    <td className="px-3 py-3 align-middle">
                                                        <span
                                                            className={cn(
                                                                'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                                                                st.className,
                                                            )}
                                                        >
                                                            {st.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-3 align-middle">
                                                        <div className="flex flex-wrap items-center justify-end gap-1">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8"
                                                                disabled={index === 0 || reordering}
                                                                aria-label="Move up"
                                                                onClick={() => move(index, -1)}
                                                            >
                                                                <ChevronUp className="size-4" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8"
                                                                disabled={
                                                                    index === thoughtRows.length - 1 || reordering
                                                                }
                                                                aria-label="Move down"
                                                                onClick={() => move(index, 1)}
                                                            >
                                                                <ChevronDown className="size-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="size-8" asChild>
                                                                <Link
                                                                    href={ContentThoughtController.edit.url({
                                                                        thought: row.slug,
                                                                    })}
                                                                    prefetch
                                                                    aria-label={`Edit ${row.title}`}
                                                                >
                                                                    <Pencil className="size-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive hover:text-destructive size-8"
                                                                aria-label={`Delete ${row.title}`}
                                                                onClick={() => destroy(row)}
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div
                    className={cn(
                        'z-20 shrink-0 border-t border-border/80',
                        'bg-background/95 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.12)] backdrop-blur-md',
                        'supports-[backdrop-filter]:bg-background/80',
                        'dark:shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.45)]',
                        'px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6 lg:px-8',
                    )}
                >
                    <div className="mx-auto flex w-full max-w-none min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-muted-foreground text-sm">{statusMessage}</p>
                        <Button asChild className="sm:shrink-0">
                            <Link href={ContentThoughtController.create.url()} prefetch>
                                New thought
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
