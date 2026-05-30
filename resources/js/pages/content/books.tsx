import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { content, dashboard } from '@/routes';
import { books } from '@/routes/content';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Content', href: content() },
    { title: 'Books', href: books() },
];

export default function ContentBooks() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage books" />

            <div className="flex flex-col gap-4 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Books</h1>
                    <p className="mt-1 text-muted-foreground text-sm">
                        Reading lists and book notes will live here as you connect them.
                    </p>
                </div>
                <Button variant="outline" asChild className="w-fit">
                    <Link href={content()} prefetch>
                        Back to content
                    </Link>
                </Button>
            </div>
        </AppLayout>
    );
}
