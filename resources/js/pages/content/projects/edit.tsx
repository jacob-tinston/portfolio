import {
    ContentProjectForm,
    contentProjectBreadcrumbsBase,
    type ContentProjectEditPayload,
} from '@/components/content-project-form';
import AppLayout from '@/layouts/app-layout';
import { projects } from '@/routes/content';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

type ContentProjectEditPageProps = {
    project: ContentProjectEditPayload;
    status?: string;
};

export default function ContentProjectEdit({ project, status }: ContentProjectEditPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        ...contentProjectBreadcrumbsBase(),
        { title: project.title, href: projects.edit.url(project.id) },
    ];

    const formKey = `${project.id}-${project.updated_at ?? 'initial'}`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${project.title}`} />

            <ContentProjectForm
                formKey={formKey}
                mode="edit"
                project={project}
                status={status}
                heading={`Edit “${project.title}”`}
            />
        </AppLayout>
    );
}
