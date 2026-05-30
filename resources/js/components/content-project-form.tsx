import ContentProjectController from '@/actions/App/Http/Controllers/Content/ContentProjectController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { content, dashboard } from '@/routes';
import { projects } from '@/routes/content';
import type { BreadcrumbItem } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { useEffect, useId, useState, type ReactNode } from 'react';

const CONTENT_PROJECT_FORM_ID = 'content-project-form';

export type ContentProjectEditPayload = {
    id: number;
    title: string;
    description: string;
    tags: string;
    website_url: string;
    app_store_url: string;
    play_store_url: string;
    is_published: boolean;
    is_featured: boolean;
    featured_order: number | null;
    image: string;
    updated_at?: string | null;
};

type ContentProjectFormProps = {
    mode: 'create' | 'edit';
    project: ContentProjectEditPayload | null;
    status?: string;
    formKey: string;
    heading: string;
};

function FieldGroupTitle({ children }: { children: ReactNode }) {
    return (
        <h2
            className={cn(
                'rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-widest',
                'bg-neutral-200 text-[#1b1b18]',
                'dark:bg-[#141414] dark:text-[#EDEDEC]',
            )}
        >
            {children}
        </h2>
    );
}

function ContentProjectFormInner({ mode, project, status, heading }: ContentProjectFormProps) {
    const baseId = useId();
    const [coverPreview, setCoverPreview] = useState<string | null>(
        mode === 'edit' && project ? project.image : null,
    );

    const form = useForm({
        title: project?.title ?? '',
        description: project?.description ?? '',
        tags: project?.tags ?? '',
        website_url: project?.website_url ?? '',
        app_store_url: project?.app_store_url ?? '',
        play_store_url: project?.play_store_url ?? '',
        is_published: project?.is_published ?? false,
        is_featured: project?.is_featured ?? false,
        featured_order:
            project?.featured_order !== null && project?.featured_order !== undefined
                ? String(project.featured_order)
                : '',
        image: null as File | null,
    });

    useEffect(() => {
        if (form.data.image instanceof File) {
            const url = URL.createObjectURL(form.data.image);
            setCoverPreview(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        }

        if (mode === 'edit' && project) {
            setCoverPreview(project.image);
        } else {
            setCoverPreview(null);
        }
    }, [form.data.image, mode, project]);

    const submitLabel =
        mode === 'create'
            ? form.processing
                ? 'Creating…'
                : 'Create project'
            : form.processing
              ? 'Saving…'
              : 'Save changes';

    const statusMessage =
        status === 'project-updated'
            ? 'Changes saved.'
            : status === 'project-created'
              ? 'Project created.'
              : mode === 'edit'
                ? 'Edits are stored when you save.'
                : 'Fill in the details below, then create the project.';

    return (
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
            <form
                id={CONTENT_PROJECT_FORM_ID}
                className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
                onSubmit={(e) => {
                    e.preventDefault();

                    form.transform((data) => {
                        const payload: Record<string, unknown> = { ...data };
                        if (!(data.image instanceof File)) {
                            delete payload.image;
                        }
                        if (data.featured_order === '') {
                            payload.featured_order = '';
                        }

                        return payload as typeof data;
                    });

                    if (mode === 'create') {
                        form.post(ContentProjectController.store.url(), {
                            forceFormData: true,
                            preserveScroll: true,
                        });
                    } else if (project) {
                        form.post(ContentProjectController.update.form({ project: project.id }).action, {
                            forceFormData: true,
                            preserveScroll: true,
                        });
                    }
                }}
            >
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain">
                    <div className="flex w-full flex-col gap-8 p-4 pb-10 md:p-6 md:pb-12 lg:px-8">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1b1b18] dark:text-[#EDEDEC]">
                                {heading}
                            </h1>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" asChild className="shrink-0 self-start">
                                    <Link href={projects()} prefetch>
                                        Back to projects
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild className="shrink-0 self-start">
                                    <Link href={content()} prefetch>
                                        Content hub
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <section className="flex flex-col gap-3">
                            <FieldGroupTitle>Basics</FieldGroupTitle>
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
                                <Label htmlFor={`${baseId}-description`}>Description</Label>
                                <textarea
                                    id={`${baseId}-description`}
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    required
                                    rows={8}
                                    className={cn(
                                        'border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm',
                                        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                                        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                                        'min-h-[160px] resize-y',
                                    )}
                                />
                                <InputError message={form.errors.description} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`${baseId}-tags`}>Tags (comma-separated)</Label>
                                <Input
                                    id={`${baseId}-tags`}
                                    value={form.data.tags}
                                    onChange={(e) => form.setData('tags', e.target.value)}
                                    placeholder="AI, Laravel, Mobile"
                                />
                                <InputError message={form.errors.tags} />
                            </div>
                        </section>

                        <section className="flex flex-col gap-3">
                            <FieldGroupTitle>Cover image</FieldGroupTitle>
                            <div className="grid gap-2">
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
                                {coverPreview ? (
                                    <div className="mt-2 overflow-hidden rounded-lg border border-border/80 bg-muted/30">
                                        <img
                                            src={coverPreview}
                                            alt=""
                                            className="max-h-48 w-full object-contain object-left"
                                        />
                                    </div>
                                ) : null}
                            </div>
                        </section>

                        <section className="flex flex-col gap-3">
                            <FieldGroupTitle>Links</FieldGroupTitle>
                            <div className="grid gap-2">
                                <Label htmlFor={`${baseId}-website`}>Website URL</Label>
                                <Input
                                    id={`${baseId}-website`}
                                    type="url"
                                    value={form.data.website_url}
                                    onChange={(e) => form.setData('website_url', e.target.value)}
                                    placeholder="https://"
                                />
                                <InputError message={form.errors.website_url} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`${baseId}-app-store`}>App Store URL</Label>
                                <Input
                                    id={`${baseId}-app-store`}
                                    type="url"
                                    value={form.data.app_store_url}
                                    onChange={(e) => form.setData('app_store_url', e.target.value)}
                                    placeholder="https://apps.apple.com/…"
                                />
                                <InputError message={form.errors.app_store_url} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`${baseId}-play-store`}>Play Store URL</Label>
                                <Input
                                    id={`${baseId}-play-store`}
                                    type="url"
                                    value={form.data.play_store_url}
                                    onChange={(e) => form.setData('play_store_url', e.target.value)}
                                    placeholder="https://play.google.com/…"
                                />
                                <InputError message={form.errors.play_store_url} />
                            </div>
                        </section>

                        <section className="flex flex-col gap-3">
                            <FieldGroupTitle>Visibility</FieldGroupTitle>
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id={`${baseId}-published`}
                                    checked={form.data.is_published}
                                    onCheckedChange={(v) => form.setData('is_published', v === true)}
                                />
                                <div className="grid gap-1">
                                    <Label htmlFor={`${baseId}-published`} className="cursor-pointer font-medium">
                                        Published
                                    </Label>
                                    <p className="text-muted-foreground text-sm">
                                        When off, the project stays a draft and is hidden from the public projects page.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id={`${baseId}-featured-toggle`}
                                    checked={form.data.is_featured}
                                    onCheckedChange={(v) => {
                                        const on = v === true;
                                        form.setData('is_featured', on);
                                        if (!on) {
                                            form.setData('featured_order', '');
                                        } else if (form.data.featured_order === '') {
                                            form.setData('featured_order', '1');
                                        }
                                    }}
                                />
                                <div className="grid min-w-0 flex-1 gap-1">
                                    <Label htmlFor={`${baseId}-featured-toggle`} className="cursor-pointer font-medium">
                                        Featured on home page
                                    </Label>
                                    <p className="text-muted-foreground text-sm">
                                        When on, this project can appear in the homepage project slider. Turn it off to
                                        hide it from the slider while keeping sort order for the projects archive.
                                    </p>
                                </div>
                            </div>
                            {form.data.is_featured ? (
                                <div className="grid gap-2 pl-7 sm:pl-9">
                                    <Label htmlFor={`${baseId}-featured`}>Slider position</Label>
                                    <Input
                                        id={`${baseId}-featured`}
                                        type="number"
                                        min={1}
                                        max={20}
                                        value={form.data.featured_order}
                                        onChange={(e) => form.setData('featured_order', e.target.value)}
                                        required
                                    />
                                    <p className="text-muted-foreground text-sm">
                                        Lower numbers appear first in the homepage slider (1–20).
                                    </p>
                                    <InputError message={form.errors.featured_order} />
                                </div>
                            ) : null}
                        </section>
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
                        <Button
                            form={CONTENT_PROJECT_FORM_ID}
                            type="submit"
                            disabled={form.processing}
                            className="sm:shrink-0"
                        >
                            {submitLabel}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export function ContentProjectForm(props: ContentProjectFormProps) {
    return <ContentProjectFormInner key={props.formKey} {...props} />;
}

export function contentProjectBreadcrumbsBase(): BreadcrumbItem[] {
    return [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Content', href: content() },
        { title: 'Projects', href: projects() },
    ];
}
