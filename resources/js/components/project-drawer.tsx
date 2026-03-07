import type { Project } from '@/data/projects';
import { ExternalLink, X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

function AppleIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 601 772"
            className="size-5 shrink-0 fill-current"
            aria-hidden
        >
            <path d="M426 78c8-22 13-41 13-59c0-3-1-5-1-8s-1-7-2-11c-50 11-85 33-107 65c-22 31-33 68-34 111c18-2 33-5 44-8c15-5 31-15 47-30c18-18 32-40 40-60m-57 100c-30 10-51 14-62 14c-9 0-28-4-59-12c-30-9-55-14-77-14q-73.5 0-123 63C16 271 0 324 0 390c0 71 21 143 63 217c43 74 87 110 130 110c14 0 32-5 57-14c23-9 43-14 61-14s40 4 65 13c26 9 46 13 61 13c37 0 74-28 111-83c12-18 23-37 32-55c8-17 15-35 21-52c-27-8-50-27-69-55c-19-29-29-61-29-96c0-33 9-62 27-89c11-14 28-32 50-51c-7-9-15-18-22-25c-8-7-15-13-22-18c-28-18-59-28-93-28c-20 0-45 6-74 15" />
        </svg>
    );
}

function GooglePlayIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="size-5 shrink-0 fill-current"
            aria-hidden
        >
            <path d="M325.3 234.3L104.6 13l280.8 161.2zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256zm425.2 225.6l-58.9-34.1l-65.7 64.5l65.7 64.5l60.1-34.1c18-14.3 18-46.5-1.2-60.8M104.6 499l280.8-161.2l-60.1-60.1z" />
        </svg>
    );
}

export function ProjectDrawer({
    project,
    onClose,
}: {
    project: Project | null;
    onClose: () => void;
}) {
    const open = project !== null;

    // Escape to close
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    // Signal SiteLayout to stop/start Lenis, and lock native scroll
    useEffect(() => {
        if (open) {
            window.dispatchEvent(new CustomEvent('project-drawer:open'));
            document.documentElement.classList.add('overflow-hidden');
        } else {
            window.dispatchEvent(new CustomEvent('project-drawer:close'));
            document.documentElement.classList.remove('overflow-hidden');
        }
        return () => {
            window.dispatchEvent(new CustomEvent('project-drawer:close'));
            document.documentElement.classList.remove('overflow-hidden');
        };
    }, [open]);

    const hasLinks = project && (project.websiteUrl || project.appStoreUrl || project.playStoreUrl);

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                    open ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
                onClick={onClose}
                aria-hidden
            />

            {/* Drawer panel */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label={project?.title ?? 'Project details'}
                className={`fixed inset-y-0 right-0 z-[71] flex w-full max-w-[480px] flex-col border-l border-[#e3e3e0] bg-[#FDFDFC] shadow-2xl transition-transform duration-300 ease-out dark:border-white/[0.08] dark:bg-[#0a0a0a] ${
                    open ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-[#e3e3e0] px-6 py-4 dark:border-white/[0.08]">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#1b1b18]/25 dark:text-[#EDEDEC]/25">
                        Project
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/60 text-[#1b1b18] shadow-lg shadow-black/[0.04] backdrop-blur-xl transition-colors hover:text-[#1b1b18]/70 dark:border-white/10 dark:bg-white/[0.06] dark:text-[#EDEDEC] dark:shadow-black/20 dark:hover:text-[#EDEDEC]/80"
                    >
                        <X className="size-4" aria-hidden />
                    </button>
                </div>

                {/* Scrollable content */}
                <div
                    className="flex-1 overflow-y-auto px-6 py-6"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    {project && (
                        <>
                            {/* Image */}
                            <div className="mb-6 overflow-hidden rounded-2xl bg-[#f5f5f4] dark:bg-[#1e1e1d]">
                                <img
                                    src={project.image}
                                    alt=""
                                    className="aspect-video w-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>

                            {/* Tags */}
                            <div className="mb-3 flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full bg-[#f5f5f4] px-3 py-1 text-xs font-medium text-[#1b1b18]/70 dark:bg-[#1e1e1d] dark:text-[#EDEDEC]/60"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Title */}
                            <h2 className="font-title mb-4 text-2xl font-light leading-tight tracking-tight text-[#1b1b18] dark:text-[#EDEDEC] sm:text-3xl">
                                {project.title}
                            </h2>

                            {/* Description */}
                            <p className="text-sm leading-relaxed text-[#1b1b18]/70 dark:text-[#EDEDEC]/70 md:text-base">
                                {project.description}
                            </p>

                            {/* Links */}
                            {hasLinks && (
                                <div className="mt-8 border-t border-[#e3e3e0] pt-6 dark:border-white/[0.08]">
                                    <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-[#1b1b18]/25 dark:text-[#EDEDEC]/25">
                                        Links
                                    </span>
                                    <div className="flex flex-col gap-2">
                                        {project.websiteUrl && (
                                            <a
                                                href={project.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1b1b18] bg-[#1b1b18] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2d2d2a] dark:border-[#EDEDEC] dark:bg-[#EDEDEC] dark:text-[#0a0a0a] dark:hover:bg-white"
                                            >
                                                <ExternalLink className="size-4 shrink-0" aria-hidden />
                                                Visit website
                                            </a>
                                        )}
                                        {(project.appStoreUrl || project.playStoreUrl) && (
                                            <div className="flex gap-2">
                                                {project.appStoreUrl && (
                                                    <a
                                                        href={project.appStoreUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex flex-1 items-center gap-2 rounded-full border border-[#1b1b18]/15 px-4 py-2.5 text-sm font-medium text-[#1b1b18] transition-colors hover:bg-[#1b1b18]/[0.05] dark:border-[#EDEDEC]/15 dark:text-[#EDEDEC] dark:hover:bg-[#EDEDEC]/[0.06]"
                                                    >
                                                        <AppleIcon />
                                                        App Store
                                                    </a>
                                                )}
                                                {project.playStoreUrl && (
                                                    <a
                                                        href={project.playStoreUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex flex-1 items-center gap-2 rounded-full border border-[#1b1b18]/15 px-4 py-2.5 text-sm font-medium text-[#1b1b18] transition-colors hover:bg-[#1b1b18]/[0.05] dark:border-[#EDEDEC]/15 dark:text-[#EDEDEC] dark:hover:bg-[#EDEDEC]/[0.06]"
                                                    >
                                                        <GooglePlayIcon />
                                                        Google Play
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>,
        document.body,
    );
}
