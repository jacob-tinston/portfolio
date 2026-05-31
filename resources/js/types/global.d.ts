import type { PublicThoughtListItem } from '@/data/thoughts';
import type { Project } from '@/data/projects';
import type { PublicBookTerminal } from '@/data/public-books';
import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            publicProjects: Project[];
            publicBooks: PublicBookTerminal[];
            latestThoughts: PublicThoughtListItem[];
            [key: string]: unknown;
        };
    }
}
