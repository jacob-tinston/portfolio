import { Head } from '@inertiajs/react';

import ContentThoughtController from '@/actions/App/Http/Controllers/Content/ContentThoughtController';
import {
    ContentThoughtForm,
    contentThoughtBreadcrumbsBase
    
} from '@/components/content-thought-form';
import type {ContentThoughtEditPayload} from '@/components/content-thought-form';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type ContentThoughtEditProps = {
    thought: ContentThoughtEditPayload;
    status?: string;
};

export default function ContentThoughtEdit({ thought, status }: ContentThoughtEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        ...contentThoughtBreadcrumbsBase(),
        { title: thought.title, href: ContentThoughtController.edit({ thought: thought.slug }) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${thought.title}`} />

            <ContentThoughtForm
                formKey={thought.slug}
                mode="edit"
                thought={thought}
                status={status}
                heading="Edit thought"
            />
        </AppLayout>
    );
}
