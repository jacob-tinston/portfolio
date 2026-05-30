import NowPageController from '@/actions/App/Http/Controllers/Content/NowPageController';
import InputError from '@/components/input-error';
import { NowMarkdownEditor } from '@/components/now-markdown-editor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { content, dashboard } from '@/routes';
import { now } from '@/routes/content';
import type { BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';
import { Head, Link, useForm } from '@inertiajs/react';
import { useCallback, useId, type ReactNode } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Content', href: content() },
    { title: 'Now', href: now() },
];

type NowSectionKey = 'building' | 'learning' | 'reading';

type SectionFormState = {
    key: NowSectionKey;
    bodyMarkdown: string;
};

const SECTION_DEFAULTS: { key: NowSectionKey; label: string }[] = [
    { key: 'building', label: 'Building' },
    { key: 'learning', label: 'Learning' },
    { key: 'reading', label: 'Reading' },
];

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

const NOW_FORM_ID = 'content-now-form';

type ManageNowFormProps = {
    buildingMarkdown: string;
    learningMarkdown: string;
    readingMarkdown: string;
    status?: string;
};

/**
 * Mounted with key={updatedAt} so useForm re-initialises from server props after save.
 * Avoids setDefaults/reset in an effect, which could clear the UI with stale values on redirect.
 */
function ManageNowForm({
    buildingMarkdown,
    learningMarkdown,
    readingMarkdown,
    status,
}: ManageNowFormProps) {
    const baseId = useId();

    const form = useForm({
        building_markdown: buildingMarkdown,
        learning_markdown: learningMarkdown,
        reading_markdown: readingMarkdown,
    });

    const updateSectionBody = useCallback(
        (key: NowSectionKey, bodyMarkdown: string) => {
            const field =
                key === 'building'
                    ? 'building_markdown'
                    : key === 'learning'
                      ? 'learning_markdown'
                      : 'reading_markdown';
            form.setData(field, bodyMarkdown);
        },
        [form],
    );

    const sections: SectionFormState[] = SECTION_DEFAULTS.map(({ key }) => ({
        key,
        bodyMarkdown:
            key === 'building'
                ? form.data.building_markdown
                : key === 'learning'
                  ? form.data.learning_markdown
                  : form.data.reading_markdown,
    }));

    return (
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
            <form
                id={NOW_FORM_ID}
                className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.put(NowPageController.update.url(), { preserveScroll: true });
                }}
            >
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain">
                    <div className="flex w-full flex-col gap-8 p-4 pb-10 md:p-6 md:pb-12 lg:px-8">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1b1b18] dark:text-[#EDEDEC]">
                                Manage /now
                            </h1>
                            <Button variant="outline" asChild className="shrink-0 self-start">
                                <Link href={content()} prefetch>
                                    Back to content
                                </Link>
                            </Button>
                        </div>

                        {SECTION_DEFAULTS.map(({ key, label }) => {
                            const section = sections.find((s) => s.key === key);
                            if (!section) {
                                return null;
                            }

                            const field =
                                key === 'building'
                                    ? 'building_markdown'
                                    : key === 'learning'
                                      ? 'learning_markdown'
                                      : 'reading_markdown';

                            return (
                                <section key={key} className="flex flex-col gap-3">
                                    <FieldGroupTitle>{label}</FieldGroupTitle>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`${baseId}-${key}-body`}>Body</Label>
                                        <NowMarkdownEditor
                                            id={`${baseId}-${key}-body`}
                                            value={section.bodyMarkdown}
                                            onChange={(md) => updateSectionBody(key, md)}
                                            placeholder="Section body…"
                                        />
                                        <InputError message={form.errors[field]} />
                                    </div>
                                </section>
                            );
                        })}
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
                        <p className="text-muted-foreground text-sm">
                            {status === 'now-updated'
                                ? 'Changes saved.'
                                : 'Edits are stored when you save.'}
                        </p>
                        <Button
                            form={NOW_FORM_ID}
                            type="submit"
                            disabled={form.processing}
                            className="sm:shrink-0"
                        >
                            {form.processing ? 'Saving…' : 'Save changes'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

type ContentNowProps = {
    buildingMarkdown: string;
    learningMarkdown: string;
    readingMarkdown: string;
    updatedAt?: string | null;
    status?: string;
};

export default function ContentNow({
    buildingMarkdown,
    learningMarkdown,
    readingMarkdown,
    updatedAt,
    status,
}: ContentNowProps) {
    const formKey = updatedAt ?? 'initial';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage now" />

            <ManageNowForm
                key={formKey}
                buildingMarkdown={buildingMarkdown}
                learningMarkdown={learningMarkdown}
                readingMarkdown={readingMarkdown}
                status={status}
            />
        </AppLayout>
    );
}
