import { Link, useForm } from '@inertiajs/react';
import { useId } from 'react';

import ContentThoughtController from '@/actions/App/Http/Controllers/Content/ContentThoughtController';
import { AdminDraftPublishedToggle } from '@/components/admin-draft-published-toggle';
import { AdminFormSection } from '@/components/admin-form-section';
import InputError from '@/components/input-error';
import { NowMarkdownEditor } from '@/components/now-markdown-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { content, dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const CONTENT_THOUGHT_FORM_ID = 'content-thought-form';

function todayLocalIsoDate(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${y}-${m}-${day}`;
}

export type ContentThoughtEditPayload = {
    id: number;
    slug: string;
    title: string;
    thought_date: string;
    tags: string;
    body_markdown: string;
    is_published: boolean;
    updated_at?: string | null;
};

type ContentThoughtFormProps = {
    mode: 'create' | 'edit';
    thought: ContentThoughtEditPayload | null;
    status?: string;
    formKey: string;
    heading: string;
};

function ContentThoughtFormInner({ mode, thought, status, heading }: ContentThoughtFormProps) {
    const baseId = useId();

    const form = useForm({
        title: thought?.title ?? '',
        thought_date: thought?.thought_date ?? todayLocalIsoDate(),
        tags: thought?.tags ?? '',
        body_markdown: thought?.body_markdown ?? '',
        is_published: thought?.is_published ?? true,
    });

    const submitLabel =
        mode === 'create'
            ? form.processing
                ? 'Creating…'
                : 'Create thought'
            : form.processing
              ? 'Saving…'
              : 'Save changes';

    const statusMessage =
        status === 'thought-updated'
            ? 'Changes saved.'
            : status === 'thought-created'
              ? 'Thought created.'
              : mode === 'edit'
                ? 'Edits are stored when you save.'
                : 'Fill in the details below, then create the thought.';

    return (
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
            <form
                id={CONTENT_THOUGHT_FORM_ID}
                className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (mode === 'create') {
                        form.post(ContentThoughtController.store.url(), {
                            preserveScroll: true,
                        });
                    } else if (thought) {
                        form.put(ContentThoughtController.update.url(thought.slug), {
                            preserveScroll: true,
                        });
                    }
                }}
            >
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain">
                    <div className="flex w-full flex-col gap-6 p-4 pb-10 md:p-6 md:pb-12 lg:px-8">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1b1b18] dark:text-[#EDEDEC]">
                                {heading}
                            </h1>
                            <Button variant="outline" asChild className="shrink-0 self-start">
                                <Link href={ContentThoughtController.index()} prefetch>
                                    Back to thoughts
                                </Link>
                            </Button>
                        </div>

                        <AdminFormSection
                            title="Basics"
                            description="Title and date appear on the public thoughts list and post header. Pick the day you want shown (for example the first of the month)."
                        >
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor={`${baseId}-title`}>Title</Label>
                                    <Input
                                        id={`${baseId}-title`}
                                        value={form.data.title}
                                        onChange={(e) => form.setData('title', e.target.value)}
                                        required
                                        autoComplete="off"
                                    />
                                    <InputError message={form.errors.title} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor={`${baseId}-date`}>Date</Label>
                                    <Input
                                        id={`${baseId}-date`}
                                        type="date"
                                        value={form.data.thought_date}
                                        onChange={(e) => form.setData('thought_date', e.target.value)}
                                        required
                                        autoComplete="off"
                                    />
                                    <InputError message={form.errors.thought_date} />
                                </div>
                            </div>
                            <div className="mt-6 grid gap-2">
                                <Label htmlFor={`${baseId}-tags`}>Tags</Label>
                                <Input
                                    id={`${baseId}-tags`}
                                    value={form.data.tags}
                                    onChange={(e) => form.setData('tags', e.target.value)}
                                    placeholder="Comma-separated, e.g. AI, Reflections"
                                    autoComplete="off"
                                />
                                <InputError message={form.errors.tags} />
                            </div>
                        </AdminFormSection>

                        <AdminFormSection
                            title="Content"
                            description="Markdown with live preview (toolbar). Renders on the public post page."
                        >
                            <div className="grid gap-2">
                                <Label htmlFor={`${baseId}-body`}>Body</Label>
                                <NowMarkdownEditor
                                    id={`${baseId}-body`}
                                    value={form.data.body_markdown}
                                    onChange={(markdown) => form.setData('body_markdown', markdown)}
                                    placeholder="Write the post…"
                                    height={420}
                                    className="min-h-[22rem]"
                                />
                                <InputError message={form.errors.body_markdown} />
                            </div>
                        </AdminFormSection>
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
                    <div className="mx-auto flex w-full max-w-none min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-muted-foreground text-sm">{statusMessage}</p>
                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-3">
                            <AdminDraftPublishedToggle
                                published={form.data.is_published}
                                onPublishedChange={(v) => form.setData('is_published', v)}
                                disabled={form.processing}
                            />
                            <Button
                                form={CONTENT_THOUGHT_FORM_ID}
                                type="submit"
                                disabled={form.processing}
                                className="sm:shrink-0"
                            >
                                {submitLabel}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export function ContentThoughtForm(props: ContentThoughtFormProps) {
    return <ContentThoughtFormInner key={props.formKey} {...props} />;
}

export function contentThoughtBreadcrumbsBase(): BreadcrumbItem[] {
    return [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Content', href: content() },
        { title: 'Thoughts', href: ContentThoughtController.index() },
    ];
}
