import ContentProjectController from '@/actions/App/Http/Controllers/Content/ContentProjectController';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { content, dashboard } from '@/routes';
import { projects } from '@/routes/content';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Content', href: content() },
    { title: 'Projects', href: projects() },
];

type ProjectRow = {
    id: number;
    title: string;
    sort_order: number;
    is_published: boolean;
    is_featured: boolean;
    featured_order: number | null;
    image: string;
    updated_at?: string | null;
};

type ContentProjectsIndexProps = {
    projects: ProjectRow[];
    status?: string;
};

export default function ContentProjectsIndex({ projects: projectRows, status }: ContentProjectsIndexProps) {
    const [reordering, setReordering] = useState(false);

    const applyReorder = useCallback((ids: number[]) => {
        setReordering(true);
        router.patch(
            projects.reorder.url(),
            { ids },
            {
                preserveScroll: true,
                onFinish: () => setReordering(false),
            },
        );
    }, []);

    const move = useCallback(
        (index: number, direction: -1 | 1) => {
            const nextIndex = index + direction;
            if (nextIndex < 0 || nextIndex >= projectRows.length) {
                return;
            }
            const next = [...projectRows];
            const [row] = next.splice(index, 1);
            next.splice(nextIndex, 0, row);
            applyReorder(next.map((r) => r.id));
        },
        [applyReorder, projectRows],
    );

    const destroy = useCallback((row: ProjectRow) => {
        if (!window.confirm(`Delete “${row.title}”? This cannot be undone.`)) {
            return;
        }
        router.delete(ContentProjectController.destroy.url({ project: row.id }), {
            preserveScroll: true,
        });
    }, []);

    const statusMessage =
        status === 'project-deleted'
            ? 'Project deleted.'
            : status === 'project-created'
              ? 'Project created.'
              : 'Use the arrows in each row to set the order shown on the public projects page.';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage projects" />

            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain">
                    <div className="flex w-full flex-col gap-6 p-4 pb-10 md:p-6 md:pb-12 lg:px-8">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1b1b18] dark:text-[#EDEDEC]">
                                Manage projects
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
                                        <th className="w-16 px-2 py-2 font-medium" aria-hidden />
                                        <th className="px-3 py-2 font-medium">Title</th>
                                        <th className="px-3 py-2 font-medium">Status</th>
                                        <th className="px-3 py-2 font-medium">Home slider</th>
                                        <th className="px-3 py-2 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projectRows.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="text-muted-foreground px-3 py-8 text-center text-sm"
                                            >
                                                No projects yet. Create one to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        projectRows.map((row, index) => (
                                            <tr
                                                key={row.id}
                                                className="border-t border-border/60 odd:bg-background even:bg-muted/20"
                                            >
                                                <td className="text-muted-foreground px-3 py-3 align-middle tabular-nums">
                                                    {index + 1}
                                                </td>
                                                <td className="px-2 py-3 align-middle">
                                                    {row.image ? (
                                                        <img
                                                            src={row.image}
                                                            alt=""
                                                            className="size-10 rounded-md border border-border/60 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="size-10 rounded-md border border-dashed border-border/80 bg-muted/40" />
                                                    )}
                                                </td>
                                                <td className="max-w-[220px] px-3 py-3 align-middle font-medium">
                                                    <span className="line-clamp-2">{row.title}</span>
                                                </td>
                                                <td className="px-3 py-3 align-middle">
                                                    <span
                                                        className={cn(
                                                            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                                                            row.is_published
                                                                ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200'
                                                                : 'bg-amber-500/15 text-amber-900 dark:text-amber-100',
                                                        )}
                                                    >
                                                        {row.is_published ? 'Published' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3 align-middle">
                                                    {row.is_featured ? (
                                                        <span className="inline-flex rounded-full bg-sky-500/15 px-2.5 py-0.5 text-xs font-medium text-sky-900 tabular-nums dark:text-sky-100">
                                                            On · #{row.featured_order}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">Off</span>
                                                    )}
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
                                                            disabled={index === projectRows.length - 1 || reordering}
                                                            aria-label="Move down"
                                                            onClick={() => move(index, 1)}
                                                        >
                                                            <ChevronDown className="size-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="size-8" asChild>
                                                            <Link
                                                                href={projects.edit.url(row.id)}
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
                                        ))
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
                            <Link href={projects.create.url()} prefetch>
                                New project
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
