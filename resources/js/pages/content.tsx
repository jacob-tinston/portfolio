import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, CalendarClock, FolderKanban, MessageSquare } from 'lucide-react';
import ContentThoughtController from '@/actions/App/Http/Controllers/Content/ContentThoughtController';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { content, dashboard } from '@/routes';
import { books, now, projects } from '@/routes/content';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Content',
        href: content(),
    },
];

const ctas = [
    {
        title: 'Projects',
        description:
            'Curate featured work, archive entries, and keep project copy in sync with the public site.',
        href: projects(),
        icon: FolderKanban,
    },
    {
        title: 'Books',
        description:
            'Track reading lists, notes, and anything you surface on the books section of your portfolio.',
        href: books(),
        icon: BookOpen,
    },
    {
        title: 'Thoughts',
        description:
            'Write posts with dates and tags, manage drafts, and keep the thoughts section in sync with the site.',
        href: ContentThoughtController.index(),
        icon: MessageSquare,
    },
    {
        title: 'Now',
        description:
            'Update what you are focused on lately-priorities, experiments, and life context for visitors.',
        href: now(),
        icon: CalendarClock,
    },
] as const;

export default function Content() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Content" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Content</h1>
                    <p className="mt-1 text-muted-foreground text-sm">
                        Choose an area to manage. Each space opens its own tools while
                        you build out the portfolio experience.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {ctas.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Card
                                key={item.title}
                                className="border-sidebar-border/70 transition-shadow hover:shadow-md dark:border-sidebar-border"
                            >
                                <CardHeader>
                                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
                                        <Icon
                                            className="size-5 text-muted-foreground"
                                            aria-hidden
                                        />
                                    </div>
                                    <CardTitle>{item.title}</CardTitle>
                                    <CardDescription>{item.description}</CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <Button asChild className="w-full gap-2">
                                        <Link href={item.href} prefetch>
                                            Manage {item.title.toLowerCase()}
                                            <ArrowRight className="size-4" aria-hidden />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
