import { Head } from '@inertiajs/react';

import { ContentBookForm, contentBookBreadcrumbsBase } from '@/components/content-book-form';
import AppLayout from '@/layouts/app-layout';
import { books } from '@/routes/content';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    ...contentBookBreadcrumbsBase(),
    { title: 'New book', href: books.create.url() },
];

type ContentBookCreateProps = {
    status?: string;
};

export default function ContentBookCreate({ status }: ContentBookCreateProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New book" />

            <ContentBookForm
                formKey="create"
                mode="create"
                book={null}
                status={status}
                heading="New book"
            />
        </AppLayout>
    );
}
