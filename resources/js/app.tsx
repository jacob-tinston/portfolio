import { PageTransition } from '@/components/page-transition';
import { SiteLayout } from '@/components/site-layout';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { initializeTheme } from '@/hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Jacob Tinston';

const SITE_PAGES = ['home', 'projects', 'now', 'contact'];

const pageModules = {
    ...import.meta.glob('./pages/*.tsx'),
    ...import.meta.glob('./pages/settings/**/*.tsx'),
};

createInertiaApp({
    title: (title) => (title ? `${title}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            pageModules,
        ).then((module) => {
            const Page = (module as { default: React.ComponentType<object> }).default;
            if (SITE_PAGES.includes(name)) {
                return (props: object) => (
                    <SiteLayout>
                        <PageTransition variant="slideUp" duration={0.45}>
                            <Page {...props} />
                        </PageTransition>
                    </SiteLayout>
                );
            }
            return Page;
        }),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
