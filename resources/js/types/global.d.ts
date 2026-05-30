import type { Project } from '@/data/projects';
import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            publicProjects: Project[];
            [key: string]: unknown;
        };
    }
}
