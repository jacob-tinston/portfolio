import { Link, useForm } from '@inertiajs/react';
import { useEffect, useId, useMemo } from 'react';

import ContentBookController from '@/actions/App/Http/Controllers/Content/ContentBookController';
import { AdminDraftPublishedToggle } from '@/components/admin-draft-published-toggle';
import { AdminFormSection } from '@/components/admin-form-section';
import InputError from '@/components/input-error';
import { NowMarkdownEditor } from '@/components/now-markdown-editor';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { content, dashboard } from '@/routes';
import { books } from '@/routes/content';
import type { BreadcrumbItem } from '@/types';

const CONTENT_BOOK_FORM_ID = 'content-book-form';

export type ContentBookEditPayload = {
    id: number;
    slug: string;
    title: string;
    author: string;
    rating: number;
    isbn: string;
    date_finished: string;
    summary: string;
    notes: string;
    is_hidden: boolean;
    is_published: boolean;
    image: string;
    updated_at?: string | null;
};

type ContentBookFormProps = {
    mode: 'create' | 'edit';
    book: ContentBookEditPayload | null;
    status?: string;
    formKey: string;
    heading: string;
};

function ContentBookFormInner({ mode, book, status, heading }: ContentBookFormProps) {
    const baseId = useId();

    const form = useForm({
        title: book?.title ?? '',
        author: book?.author ?? '',
        rating: book?.rating ?? 0,
        isbn: book?.isbn ?? '',
        date_finished: book?.date_finished ?? '',
        summary: book?.summary ?? '',
        notes: book?.notes ?? '',
        is_hidden: book?.is_hidden ?? false,
        is_published: book?.is_published ?? true,
        image: null as File | null,
    });

    const objectUrl = useMemo(() => {
        if (form.data.image instanceof File) {
            return URL.createObjectURL(form.data.image);
        }

        return null;
    }, [form.data.image]);

    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [objectUrl]);

    const coverPreview = objectUrl ?? (mode === 'edit' && book ? book.image : null);

    const submitLabel =
        mode === 'create'
            ? form.processing
                ? 'Creating…'
                : 'Create book'
            : form.processing
              ? 'Saving…'
              : 'Save changes';

    const statusMessage =
        status === 'book-updated'
            ? 'Changes saved.'
            : status === 'book-created'
              ? 'Book created.'
              : mode === 'edit'
                ? 'Edits are stored when you save.'
                : 'Fill in the details below, then create the book.';

    return (
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
            <form
                id={CONTENT_BOOK_FORM_ID}
                className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
                onSubmit={(e) => {
                    e.preventDefault();

                    form.transform((data) => {
                        const payload: Record<string, unknown> = { ...data };
                        if (!(data.image instanceof File)) {
                            delete payload.image;
                        }
                        payload.rating = Number(data.rating);
                        if (Number.isNaN(payload.rating)) {
                            payload.rating = 0;
                        }

                        return payload as typeof data;
                    });

                    if (mode === 'create') {
                        form.post(ContentBookController.store.url(), {
                            forceFormData: true,
                            preserveScroll: true,
                        });
                    } else if (book) {
                        form.post(ContentBookController.update.form({ book: book.slug }).action, {
                            forceFormData: true,
                            preserveScroll: true,
                        });
                    }
                }}
            >
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain">
                    <div className="flex w-full flex-col gap-6 p-4 pb-10 md:gap-8 md:p-6 md:pb-12 lg:px-8">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1b1b18] dark:text-[#EDEDEC]">
                                {heading}
                            </h1>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" asChild className="shrink-0 self-start">
                                    <Link href={books()} prefetch>
                                        Back to books
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild className="shrink-0 self-start">
                                    <Link href={content()} prefetch>
                                        Content hub
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <AdminFormSection
                            title="Basics"
                            description="Cover matches the public books list size. Title, author, and ISBN share one row on larger screens."
                        >
                            <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
                                <div className="flex w-full shrink-0 flex-col gap-3 md:w-40">
                                    <div className="relative mx-auto aspect-[3/4] w-32 overflow-hidden rounded-xl bg-[#f5f5f4] dark:bg-[#1e1e1d] sm:mx-0 sm:w-36 md:mx-0 md:w-full">
                                        {coverPreview ? (
                                            <img
                                                src={coverPreview}
                                                alt=""
                                                className="size-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="text-muted-foreground flex size-full items-center justify-center p-2 text-center text-xs"
                                                aria-hidden
                                            >
                                                No cover
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid min-w-0 gap-2">
                                        <Label htmlFor={`${baseId}-image`}>
                                            {mode === 'create' ? 'Image file' : 'Replace image (optional)'}
                                        </Label>
                                        <Input
                                            id={`${baseId}-image`}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => form.setData('image', e.target.files?.[0] ?? null)}
                                            required={mode === 'create'}
                                        />
                                        <InputError message={form.errors.image} />
                                    </div>
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col gap-4">
                                    <div className="grid min-w-0 gap-4 sm:grid-cols-3">
                                        <div className="grid min-w-0 gap-2">
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
                                        <div className="grid min-w-0 gap-2">
                                            <Label htmlFor={`${baseId}-author`}>Author</Label>
                                            <Input
                                                id={`${baseId}-author`}
                                                value={form.data.author}
                                                onChange={(e) => form.setData('author', e.target.value)}
                                                required
                                                autoComplete="off"
                                            />
                                            <InputError message={form.errors.author} />
                                        </div>
                                        <div className="grid min-w-0 gap-2">
                                            <Label htmlFor={`${baseId}-isbn`}>ISBN</Label>
                                            <Input
                                                id={`${baseId}-isbn`}
                                                value={form.data.isbn}
                                                onChange={(e) => form.setData('isbn', e.target.value)}
                                                autoComplete="off"
                                                maxLength={32}
                                            />
                                            <InputError message={form.errors.isbn} />
                                        </div>
                                    </div>
                                    <div className="grid min-w-0 gap-4 sm:max-w-xl sm:grid-cols-2">
                                        <div className="grid min-w-0 gap-2">
                                            <Label htmlFor={`${baseId}-rating`}>Rating (0–10)</Label>
                                            <Input
                                                id={`${baseId}-rating`}
                                                type="number"
                                                min={0}
                                                max={10}
                                                step={1}
                                                value={form.data.rating}
                                                onChange={(e) => {
                                                    const raw = e.target.value;
                                                    if (raw === '') {
                                                        form.setData('rating', 0);

                                                        return;
                                                    }
                                                    const n = Number(raw);
                                                    if (Number.isNaN(n)) {
                                                        form.setData('rating', 0);

                                                        return;
                                                    }
                                                    form.setData('rating', Math.min(10, Math.max(0, n)));
                                                }}
                                                required
                                            />
                                            <InputError message={form.errors.rating} />
                                        </div>
                                        <div className="grid min-w-0 gap-2">
                                            <Label htmlFor={`${baseId}-date-finished`}>Finished</Label>
                                            <Input
                                                id={`${baseId}-date-finished`}
                                                type="date"
                                                value={form.data.date_finished}
                                                onChange={(e) => form.setData('date_finished', e.target.value)}
                                            />
                                            <InputError message={form.errors.date_finished} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AdminFormSection>

                        <AdminFormSection
                            title="Notes"
                            description="Summary appears on the public list; markdown notes render on the book page when present."
                        >
                            <div className="grid min-w-0 gap-2">
                                <Label htmlFor={`${baseId}-summary`}>Summary</Label>
                                <textarea
                                    id={`${baseId}-summary`}
                                    value={form.data.summary}
                                    onChange={(e) => form.setData('summary', e.target.value)}
                                    rows={5}
                                    className={cn(
                                        'border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm',
                                        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                                        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                                        'min-h-[100px] resize-y',
                                    )}
                                />
                                <InputError message={form.errors.summary} />
                            </div>
                            <div className="grid min-w-0 gap-2">
                                <Label htmlFor={`${baseId}-notes-editor`}>Notes (markdown)</Label>
                                <NowMarkdownEditor
                                    id={`${baseId}-notes-editor`}
                                    value={form.data.notes}
                                    onChange={(markdown) => form.setData('notes', markdown)}
                                    placeholder="Thoughts, quotes, takeaways…"
                                />
                                <InputError message={form.errors.notes} />
                            </div>
                        </AdminFormSection>

                        <AdminFormSection
                            title="List visibility"
                            description="Only applies when the book is published. Hidden removes it from the public list but it stays reachable by direct URL."
                        >
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id={`${baseId}-hidden`}
                                    checked={form.data.is_hidden}
                                    onCheckedChange={(v) => form.setData('is_hidden', v === true)}
                                />
                                <div className="grid gap-1">
                                    <Label htmlFor={`${baseId}-hidden`} className="cursor-pointer font-medium">
                                        Hidden from list
                                    </Label>
                                    <p className="text-muted-foreground text-sm">
                                        Omit this book from /books while keeping its page available when published.
                                    </p>
                                </div>
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
                                form={CONTENT_BOOK_FORM_ID}
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

export function ContentBookForm(props: ContentBookFormProps) {
    return <ContentBookFormInner key={props.formKey} {...props} />;
}

export function contentBookBreadcrumbsBase(): BreadcrumbItem[] {
    return [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Content', href: content() },
        { title: 'Books', href: books() },
    ];
}
