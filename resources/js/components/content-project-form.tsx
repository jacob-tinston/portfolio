import { Link, useForm } from '@inertiajs/react';
import { useEffect, useId, useMemo } from 'react';

import ContentProjectController from '@/actions/App/Http/Controllers/Content/ContentProjectController';
import { AdminDraftPublishedToggle } from '@/components/admin-draft-published-toggle';
import { AdminFormSection } from '@/components/admin-form-section';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { content, dashboard } from '@/routes';
import { projects } from '@/routes/content';
import type { BreadcrumbItem } from '@/types';

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

function ContentProjectFormInner({ mode, project, status, heading }: ContentProjectFormProps) {
    const baseId = useId();

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

    const coverPreview = objectUrl ?? (mode === 'edit' && project ? project.image : null);

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
                    <div className="flex w-full flex-col gap-6 p-4 pb-10 md:gap-8 md:p-6 md:pb-12 lg:px-8">
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

                        <AdminFormSection
                            title="Basics"
                            description="Title, body copy, and tags shown on the public projects page."
                        >
                            <div className="grid min-w-0 gap-4">
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
                                <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
                                    <div className="grid min-w-0 flex-1 gap-2">
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
                                    <div className="grid w-full shrink-0 gap-2 lg:max-w-xs lg:pt-0">
                                        <Label htmlFor={`${baseId}-tags`}>Tags</Label>
                                        <p className="text-muted-foreground -mt-1 text-xs">Comma-separated</p>
                                        <Input
                                            id={`${baseId}-tags`}
                                            value={form.data.tags}
                                            onChange={(e) => form.setData('tags', e.target.value)}
                                            placeholder="AI, Laravel, Mobile"
                                        />
                                        <InputError message={form.errors.tags} />
                                    </div>
                                </div>
                            </div>
                        </AdminFormSection>

                        <AdminFormSection
                            title="Cover image"
                            description="Used as the project card thumbnail on the site."
                        >
                            <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-start md:gap-6">
                                <div className="grid min-w-0 flex-1 gap-2">
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
                                {coverPreview ? (
                                    <div className="w-full shrink-0 overflow-hidden rounded-lg border border-border/80 bg-muted/30 md:max-w-[280px]">
                                        <img
                                            src={coverPreview}
                                            alt=""
                                            className="max-h-48 w-full object-contain object-left md:max-h-56"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-muted-foreground hidden text-sm md:block md:w-[280px] md:shrink-0 md:rounded-lg md:border md:border-dashed md:border-border/60 md:p-4 md:text-center">
                                        Preview appears after you choose a file.
                                    </div>
                                )}
                            </div>
                        </AdminFormSection>

                        <AdminFormSection title="Links" description="Optional storefront and web URLs.">
                            <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                <div className="grid min-w-0 gap-2 md:col-span-2 xl:col-span-1">
                                    <Label htmlFor={`${baseId}-website`}>Website</Label>
                                    <Input
                                        id={`${baseId}-website`}
                                        type="url"
                                        value={form.data.website_url}
                                        onChange={(e) => form.setData('website_url', e.target.value)}
                                        placeholder="https://"
                                    />
                                    <InputError message={form.errors.website_url} />
                                </div>
                                <div className="grid min-w-0 gap-2">
                                    <Label htmlFor={`${baseId}-app-store`}>App Store</Label>
                                    <Input
                                        id={`${baseId}-app-store`}
                                        type="url"
                                        value={form.data.app_store_url}
                                        onChange={(e) => form.setData('app_store_url', e.target.value)}
                                        placeholder="https://apps.apple.com/…"
                                    />
                                    <InputError message={form.errors.app_store_url} />
                                </div>
                                <div className="grid min-w-0 gap-2">
                                    <Label htmlFor={`${baseId}-play-store`}>Play Store</Label>
                                    <Input
                                        id={`${baseId}-play-store`}
                                        type="url"
                                        value={form.data.play_store_url}
                                        onChange={(e) => form.setData('play_store_url', e.target.value)}
                                        placeholder="https://play.google.com/…"
                                    />
                                    <InputError message={form.errors.play_store_url} />
                                </div>
                            </div>
                        </AdminFormSection>

                        <AdminFormSection title="Visibility" description="Homepage slider; publishing is set in the bar below.">
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
                                form={CONTENT_PROJECT_FORM_ID}
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
