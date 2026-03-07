import { PageTransition } from '@/components/page-transition';
import { SiteLayout } from '@/components/site-layout';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { initializeTheme } from '@/hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Jacob Tinston | Software & AI Engineer';

const SITE_PAGES = ['home', 'projects', 'now', 'contact'];

const pageModules = {
    ...import.meta.glob('./pages/*.tsx'),
    ...import.meta.glob('./pages/settings/**/*.tsx'),
};

createInertiaApp({
    title: (title) => (title ? `${title} | ${appName}` : appName),
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

// ── Console easter egg ──
console.log(`
    %c
      ████████████████     ████████████████████
      ████████████████     ████████████████████
      ░░░░░░████░░░░░░     ░░░░░░░░████░░░░░░░░
            ████                   ████
            ████                   ████
            ████                   ████
            ████                   ████
            ████                   ████
            ████                   ████
            ████                   ████
            ████                   ████
      ▓▓   █████                   ████
       ▓▓▓██████                   ████
        ▓██████                    ████
         ▓███▓                     ████
    
    `, 'font-family: monospace; color: #e2e8f0;');

console.log(`%c  ╔════════════════════════════════════════════════╗
  ║                                                ║
  ║ 👋 Hey, curious one. This site was built with: ║
  ║                                                ║
  ║ ⚙️ Laravel    — The engine under the hood      ║
  ║ 🔗 Inertia.js — Seamless SPA, no API needed    ║
  ║ 🎞️ GSAP       — Making things move beautifully ║
  ║                                                ║
  ║ Built with ❤️ by Jacob.                        ║
  ║                                                ║
  ╚════════════════════════════════════════════════╝`,
  'font-family: monospace; color: #94a3b8; font-size: 12px;');
