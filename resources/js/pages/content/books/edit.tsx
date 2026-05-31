import { Head } from '@inertiajs/react';

import type { ContentBookEditPayload } from '@/components/content-book-form';
import { ContentBookForm, contentBookBreadcrumbsBase } from '@/components/content-book-form';
import AppLayout from '@/layouts/app-layout';
import { books } from '@/routes/content';
import type { BreadcrumbItem } from '@/types';

type ContentBookEditPageProps = {
    book: ContentBookEditPayload;
    status?: string;
};

export default function ContentBookEdit({ book, status }: ContentBookEditPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        ...contentBookBreadcrumbsBase(),
        { title: book.title, href: books.edit.url(book.slug) },
    ];

    const formKey = `${book.id}-${book.updated_at ?? 'initial'}`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${book.title}`} />

            <ContentBookForm
                formKey={formKey}
                mode="edit"
                book={book}
                status={status}
                heading={`Edit “${book.title}”`}
            />
        </AppLayout>
    );
}
