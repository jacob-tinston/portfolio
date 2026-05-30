import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig, loadEnv } from 'vite';

/**
 * Herd/Valet TLS certs are per hostname. `detectTls: true` uses `basename(cwd) + .test`,
 * which breaks dynamic imports if the project directory name ≠ APP_URL host (e.g. repo
 * `portfolio` but site `portfolio.test` vs `my-app.test`). Prefer APP_URL when it is a
 * local `.test` host so `https://{host}:5173/...` chunk loads match the secured site.
 */
function resolveDetectTls(mode: string): boolean | string {
    const env = loadEnv(mode, process.cwd(), '');
    try {
        const host = new URL(env.APP_URL ?? 'http://localhost').hostname;
        if (host && host !== 'localhost' && host.endsWith('.test')) {
            return host;
        }
    } catch {
        // fall through
    }

    return true;
}

export default defineConfig(({ mode }) => ({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
            detectTls: resolveDetectTls(mode),
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
}));
