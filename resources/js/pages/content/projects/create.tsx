import {
    ContentProjectForm,
    contentProjectBreadcrumbsBase,
} from '@/components/content-project-form';
import AppLayout from '@/layouts/app-layout';
import { projects } from '@/routes/content';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    ...contentProjectBreadcrumbsBase(),
    { title: 'New project', href: projects.create.url() },
];

type ContentProjectCreateProps = {
    status?: string;
};

export default function ContentProjectCreate({ status }: ContentProjectCreateProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New project" />

            <ContentProjectForm
                formKey="create"
                mode="create"
                project={null}
                status={status}
                heading="New project"
            />
        </AppLayout>
    );
}
