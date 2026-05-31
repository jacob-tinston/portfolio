import { Head } from '@inertiajs/react';

import ContentThoughtController from '@/actions/App/Http/Controllers/Content/ContentThoughtController';
import { ContentThoughtForm, contentThoughtBreadcrumbsBase } from '@/components/content-thought-form';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    ...contentThoughtBreadcrumbsBase(),
    { title: 'New thought', href: ContentThoughtController.create() },
];

type ContentThoughtCreateProps = {
    status?: string;
};

export default function ContentThoughtCreate({ status }: ContentThoughtCreateProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New thought" />

            <ContentThoughtForm
                formKey="create"
                mode="create"
                thought={null}
                status={status}
                heading="New thought"
            />
        </AppLayout>
    );
}
