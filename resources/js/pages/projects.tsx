import { MaskedWords } from '@/components/masked-words';
import { MorphWordIn } from '@/components/morph-word-in';
import { ProjectDrawer } from '@/components/project-drawer';
import {
    PROJECTS_ARCHIVE_INTRO,
    PROJECTS_INTRO,
    projects,
    type Project,
} from '@/data/projects';
import { Head } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS_PER_PAGE = 6;

export default function Projects() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const openProject = useCallback((project: Project) => setSelectedProject(project), []);
    const closeProject = useCallback(() => setSelectedProject(null), []);

    const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
    const start = (currentPage - 1) * PROJECTS_PER_PAGE;
    const paginatedProjects = projects.slice(
        start,
        start + PROJECTS_PER_PAGE,
    );

    // Hide above-fold elements before first paint so they never flash at full
    // opacity before GSAP's useEffect fires.
    useLayoutEffect(() => {
        gsap.set(['.page-title', '.page-intro'], { opacity: 0, y: 24 });
        gsap.set('.page-intro .word', { yPercent: 120 });
        gsap.set('.project-card', { opacity: 0, y: 28 });
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Use fromTo so "to" values are explicit and not captured from the
            // gsap.set state above.
            gsap.fromTo('.page-title',
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.55, delay: 0.1, ease: 'power2.out' },
            );
            gsap.fromTo('.page-intro',
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.55, delay: 0.2, ease: 'power2.out' },
            );
            gsap.fromTo('.page-intro .word',
                { yPercent: 120 },
                { yPercent: 0, stagger: 0.04, duration: 0.6, delay: 0.45, ease: 'power2.out' },
            );
            gsap.fromTo('.project-card',
                { y: 28, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, delay: 0.5, ease: 'power2.out' },
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <Head title="Projects" />
            <div ref={containerRef} className="pt-36 pb-24">
                <div className="mx-auto max-w-[700px] px-6">
                    <h1 className="page-title font-title mb-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-5xl">
                        <MorphWordIn>My projects</MorphWordIn>
                    </h1>
                    <p className="page-intro mb-16 text-lg leading-relaxed text-[#1b1b18]/70 dark:text-[#EDEDEC]/70">
                        <MaskedWords>{PROJECTS_INTRO}</MaskedWords>
                    </p>
                    <div className="grid gap-6 sm:grid-cols-2">
                        {paginatedProjects.map((project, i) => (
                            <button
                                key={`${project.title}-${start + i}`}
                                type="button"
                                onClick={() => openProject(project)}
                                className="project-card relative flex cursor-pointer flex-col justify-between rounded-2xl border border-white/30 bg-white/60 p-6 text-left shadow-lg shadow-black/[0.04] backdrop-blur-xl transition-colors hover:border-white/50 hover:bg-white/80 dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20 dark:hover:border-white/20 dark:hover:bg-white/[0.10]"
                            >
                                <div className="min-w-0">
                                    <div className="mb-4 h-36 overflow-hidden rounded-xl bg-[#f5f5f4] dark:bg-[#1e1e1d] md:h-48">
                                        <img
                                            src={project.image}
                                            alt=""
                                            className="size-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display =
                                                    'none';
                                            }}
                                        />
                                    </div>
                                    <h2 className="mb-2 text-lg font-semibold md:text-xl">
                                        {project.title}
                                    </h2>
                                    <p className="line-clamp-6 text-sm leading-relaxed text-[#1b1b18]/60 dark:text-[#EDEDEC]/50 md:text-base">
                                        <MaskedWords>
                                            {project.description}
                                        </MaskedWords>
                                    </p>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full bg-[#f5f5f4] px-3 py-1 text-xs font-medium text-[#1b1b18]/70 dark:bg-[#1e1e1d] dark:text-[#EDEDEC]/60"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <nav
                            className="mt-12 flex flex-wrap items-center justify-center gap-2"
                            aria-label="Projects pagination"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPage === 1}
                                aria-label="Previous page"
                                className="flex size-9 items-center justify-center rounded-lg border border-white/30 bg-white/60 text-[#1b1b18] transition-colors hover:bg-white/80 disabled:pointer-events-none disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-[#EDEDEC] dark:hover:bg-white/[0.12]"
                            >
                                <ChevronLeft className="size-4" aria-hidden />
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => setCurrentPage(page)}
                                        aria-label={`Page ${page}`}
                                        aria-current={
                                            page === currentPage
                                                ? 'page'
                                                : undefined
                                        }
                                        className="flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors aria-current:border-[#1b1b18] aria-current:bg-[#1b1b18] aria-current:text-white dark:aria-current:border-[#EDEDEC] dark:aria-current:bg-[#EDEDEC] dark:aria-current:text-[#0a0a0a] border-white/30 bg-white/60 text-[#1b1b18] hover:bg-white/80 dark:border-white/10 dark:bg-white/[0.06] dark:text-[#EDEDEC] dark:hover:bg-white/[0.12]"
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(totalPages, p + 1),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                aria-label="Next page"
                                className="flex size-9 items-center justify-center rounded-lg border border-white/30 bg-white/60 text-[#1b1b18] transition-colors hover:bg-white/80 disabled:pointer-events-none disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-[#EDEDEC] dark:hover:bg-white/[0.12]"
                            >
                                <ChevronRight className="size-4" aria-hidden />
                            </button>
                        </nav>
                    )}
                </div>
            </div>
            <ProjectDrawer project={selectedProject} onClose={closeProject} />
        </>
    );
}
