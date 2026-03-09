import { ContactSection } from '@/components/contact-section';
import { ProjectDrawer } from '@/components/project-drawer';
import { PROJECTS_ARCHIVE_INTRO, PROJECTS_INTRO, featuredProjects, type Project } from '@/data/projects';
import { MaskedWords } from '@/components/masked-words';
import { MorphWordIn } from '@/components/morph-word-in';
import { useActiveNav } from '@/contexts/active-nav-context';
import { Head, Link } from '@inertiajs/react';


import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCallback, useEffect, useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

const SECTION_IDS = ['about', 'projects', 'contact'];

function SplitChars({ children, className }: { children: string; className?: string }) {
    return (
        <span className={className} aria-label={children}>
            {children.split('').map((char, i) => (
                <span key={i} className="char inline-block overflow-hidden" aria-hidden="true">
                    <span className="char-inner inline-block">{char === ' ' ? '\u00A0' : char}</span>
                </span>
            ))}
        </span>
    );
}

const HERO_WORDS = ['software.', 'mobile apps.', 'tools.', 'automations.', 'AI agents.', 'for the web.'];

const MORPH_TIME = 2;
const COOLDOWN_TIME = 3;

function MorphWord() {
    const text1Ref = useRef<HTMLSpanElement>(null);
    const text2Ref = useRef<HTMLSpanElement>(null);
    const textIndexRef = useRef(0);
    const morphRef = useRef(0);
    const cooldownRef = useRef(COOLDOWN_TIME);
    const timeRef = useRef(performance.now());
    const rafRef = useRef<number>(0);
    const [, forceUpdate] = useState(0);

    function setMorph(fraction: number) {
        const text1 = text1Ref.current;
        const text2 = text2Ref.current;
        if (!text1 || !text2) return;
        const i = textIndexRef.current;
        const n = HERO_WORDS.length;
        text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
        fraction = 1 - fraction;
        text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
        text1.textContent = HERO_WORDS[i % n];
        text2.textContent = HERO_WORDS[(i + 1) % n];
    }

    function doCooldown() {
        morphRef.current = 0;
        const text1 = text1Ref.current;
        const text2 = text2Ref.current;
        if (text2) {
            text2.style.filter = '';
            text2.style.opacity = '100%';
        }
        if (text1) {
            text1.style.filter = '';
            text1.style.opacity = '0%';
        }
    }

    useEffect(() => {
        const text1 = text1Ref.current;
        const text2 = text2Ref.current;
        if (!text1 || !text2) return;
        text1.textContent = HERO_WORDS[0];
        text2.textContent = HERO_WORDS[1];
        text1.style.opacity = '100%';
        text1.style.filter = '';
        text2.style.opacity = '0%';
        text2.style.filter = '';

        function animate() {
            rafRef.current = requestAnimationFrame(animate);
            const now = performance.now();
            const dt = (now - timeRef.current) / 1000;
            timeRef.current = now;
            const cooldown = cooldownRef.current;
            const shouldIncrementIndex = cooldown > 0;
            cooldownRef.current = cooldown - dt;

            if (cooldownRef.current <= 0) {
                if (shouldIncrementIndex) {
                    textIndexRef.current = (textIndexRef.current + 1) % HERO_WORDS.length;
                    forceUpdate((x) => x + 1);
                }
                morphRef.current -= cooldownRef.current;
                cooldownRef.current = 0;
                let fraction = morphRef.current / MORPH_TIME;
                if (fraction > 1) {
                    cooldownRef.current = COOLDOWN_TIME;
                    fraction = 1;
                }
                setMorph(fraction);
            } else {
                doCooldown();
            }
        }
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    const i = textIndexRef.current;
    const n = HERO_WORDS.length;
    const currentWord = HERO_WORDS[i % n];

    return (
        <>
            <svg className="absolute size-0 overflow-hidden" aria-hidden>
                <defs>
                    <filter id="threshold">
                        <feColorMatrix
                            in="SourceGraphic"
                            type="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"
                        />
                    </filter>
                </defs>
            </svg>
            <span className="morph-container" aria-label={currentWord}>
                <span
                    ref={text1Ref}
                    className="morph-text"
                    aria-hidden
                >
                    {HERO_WORDS[0]}
                </span>
                <span
                    ref={text2Ref}
                    className="morph-text"
                    aria-hidden
                >
                    {HERO_WORDS[1]}
                </span>
                <span className="invisible whitespace-nowrap" aria-hidden>
                    {currentWord}
                </span>
            </span>
        </>
    );
}

export default function Home() {
    const { setActiveNav } = useActiveNav();
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const openProject = useCallback((project: Project) => setSelectedProject(project), []);
    const closeProject = useCallback(() => setSelectedProject(null), []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length > 0) {
                    setActiveNav(visible[0].target.id);
                }
            },
            { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
        );

        SECTION_IDS.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [setActiveNav]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // ── About: words slide up from behind mask (play once when section enters viewport or on load if visible) ──
            gsap.from('#about .word', {
                yPercent: 120,
                stagger: 0.06,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#about',
                    start: 'top 85%',
                    once: true,
                },
            });

            gsap.from('#about .about-block', {
                y: 40,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#about',
                    start: 'top 85%',
                    once: true,
                },
            });

            // ── Hero: box, staggered text, morph line, image ──
            gsap.from('.hero-card', {
                y: 28,
                opacity: 0,
                scale: 0.98,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.hero-card',
                    start: 'top 90%',
                    once: true,
                },
            });

            gsap.from('.hero-headshot', {
                scale: 0.85,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out',
                delay: 0.25,
                scrollTrigger: {
                    trigger: '.hero-card',
                    start: 'top 90%',
                    once: true,
                },
            });

            // ── Projects: intro subtext (masked words entrance when section is in view / pinned) ──
            gsap.from('#projects .projects-intro .word', {
                yPercent: 120,
                stagger: 0.04,
                duration: 0.65,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#projects',
                    start: 'top top',
                    once: true,
                },
            });

            // ── Projects: horizontal scroll (longer pin so it doesn't snap early; scroll distance = track travel × multiplier) ──
            const track = document.querySelector<HTMLElement>('.projects-track');
            if (track) {
                const getEndPadding = () => (window.innerWidth < 768 ? 180 : 320);
                const getScrollAmount = () => {
                    if (window.innerWidth < 768) {
                        const container =
                            track.querySelector<HTMLElement>('.projects-cards-container');
                        const seeMore =
                            track.querySelector<HTMLElement>('.projects-see-more');
                        if (container && seeMore) {
                            const trackX = Number(gsap.getProperty(track, 'x')) || 0;
                            const trackLeftAtRest =
                                track.getBoundingClientRect().left - trackX;
                            const seeMoreCenterFromTrack =
                                container.offsetLeft +
                                seeMore.offsetLeft +
                                seeMore.offsetWidth / 2;
                            return Math.max(
                                0,
                                trackLeftAtRest +
                                    seeMoreCenterFromTrack -
                                    window.innerWidth / 2,
                            );
                        }
                    }
                    return Math.max(
                        0,
                        track.scrollWidth - window.innerWidth + getEndPadding(),
                    );
                };
                const scrollMultiplier = 2.4;

                const horizontalTween = gsap.to(track, {
                    x: () => -getScrollAmount(),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '#projects',
                        start: 'top top',
                        end: () => `+=${Math.round(getScrollAmount() * scrollMultiplier)}`,
                        pin: true,
                        scrub: 1,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                });

            }

            // ── Projects: cards container entrance (when section comes into view) ──
            gsap.from('.projects-cards-container', {
                y: 28,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#projects',
                    start: 'top 70%',
                    once: true,
                },
            });

            // Section titles use MorphWordIn component (same morph as hero MorphWord)

            // ── Craft (What/Why/How) ──
            gsap.from('.craft-what', {
                x: -32,
                opacity: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: { trigger: '.craft-what', start: 'top 85%', once: true },
            });
            gsap.from('.craft-why', {
                x: 32,
                opacity: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: { trigger: '.craft-why', start: 'top 85%', once: true },
            });
            gsap.from('.craft-how', {
                y: 40,
                opacity: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: { trigger: '.craft-how', start: 'top 85%', once: true },
            });
            gsap.from('.craft-tech-badge', {
                scale: 0.85,
                opacity: 0,
                stagger: 0.04,
                duration: 0.4,
                ease: 'power2.out',
                scrollTrigger: { trigger: '.craft-how', start: 'top 80%', once: true },
            });

            // ── Blog ──
            gsap.from('.blog-header', {
                y: 24,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: { trigger: '.blog-header', start: 'top 85%', once: true },
            });

            // ── Contact: intro, newsletter, socials + word reveal ──
            gsap.from('#contact .contact-intro', {
                y: 24,
                opacity: 0,
                duration: 0.55,
                ease: 'power2.out',
                scrollTrigger: { trigger: '#contact', start: 'top 85%', once: true },
            });
            gsap.from('#contact .contact-newsletter', {
                y: 28,
                opacity: 0,
                scale: 0.98,
                duration: 0.7,
                delay: 0.08,
                ease: 'power2.out',
                scrollTrigger: { trigger: '#contact', start: 'top 85%', once: true },
            });
            gsap.from('#contact .contact-socials', {
                y: 28,
                opacity: 0,
                scale: 0.98,
                duration: 0.7,
                delay: 0.18,
                ease: 'power2.out',
                scrollTrigger: { trigger: '#contact', start: 'top 85%', once: true },
            });
            gsap.from('#contact .word', {
                yPercent: 120,
                stagger: 0.04,
                duration: 0.6,
                delay: 0.25,
                ease: 'power2.out',
                scrollTrigger: { trigger: '#contact', start: 'top 85%', once: true },
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <Head />
            <div ref={containerRef}>
                {/* ── Hero (above About) ── */}
                <section className="px-6 pt-28 pb-4 sm:pt-36">
                    <div className="mx-auto max-w-[700px]">
                        <div className="hero-card relative z-10 flex flex-col gap-8 overflow-hidden rounded-2xl border border-white/30 bg-white/60 p-8 shadow-lg shadow-black/[0.04] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20 sm:flex-row sm:items-center sm:gap-10 sm:p-10">
                            <div className="hero-card-content flex flex-1 flex-col justify-center">
                                <blockquote className="hero-quote font-quote text-lg italic leading-snug text-[#1b1b18]/80 dark:text-[#EDEDEC]/80 sm:text-xl">
                                    Hello, I&apos;m Jacob
                                </blockquote>
                                <div className="flex flex-col font-title">
                                    <span className="text-3xl font-light leading-tight tracking-tight text-[#1b1b18] dark:text-[#EDEDEC] sm:text-4xl md:text-5xl lg:text-5xl">
                                        I like to build
                                    </span>
                                    <span className="text-3xl font-light leading-tight tracking-tight text-[#1b1b18] dark:text-[#EDEDEC] sm:text-4xl md:text-5xl lg:text-5xl whitespace-nowrap">
                                        <MorphWord />
                                    </span>
                                </div>
                            </div>
                            <div className="hero-headshot shrink-0 sm:order-last">
                                <div className="aspect-square w-32 overflow-hidden rounded-lg bg-[#f5f5f4] dark:bg-[#1e1e1d] sm:w-40 md:w-48">
                                    <img
                                        src="/images/headshot.png"
                                        alt="Jacob"
                                        className="h-full w-full object-cover"
                                        fetchPriority="high"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── About ── */}
                <section id="about" className="pt-16 pb-24">
                    <div className="about-section mx-auto max-w-[700px] px-6 text-center">
                        <p className="about-block font-light leading-[1.5] text-[#1b1b18] dark:text-[#EDEDEC] text-[clamp(20px,3vw,32px)]">
                            <MaskedWords
                                boldWords={['tsuyoku', 'naritai', 'self', 'taught', 'engineer', 'experience', 'show', 'up', 'work', 'hard', 'be', 'better']}
                            >
                                Tsuyoku naritai. Loosely translated, means "I want to become stronger". It's the standard I live by. I'm a self taught engineer focused on building thoughtful, end-to-end products. Everything I know, i've learned through experience. Beyond the screen, I enjoy boxing, climbing things, and getting outdoors. Same principle throughout - show up, work hard, be better.
                            </MaskedWords>
                        </p>
                    </div>
                </section>

                {/* ── Projects (Horizontal Scroll) ── */}
                <section
                    id="projects"
                    className="relative w-full max-w-[100vw] overflow-x-hidden"
                >
                    <div className="projects-track flex h-screen min-h-[500px] items-center gap-5 pl-5 pr-5 md:min-h-[600px] md:gap-10 md:pl-[max(1.5rem,50vw-350px)] md:pr-12">
                        <div className="projects-title-column flex h-full w-[62vw] min-w-[12rem] max-w-[20rem] shrink-0 flex-col justify-center pr-4 md:w-auto md:min-w-[280px] md:max-w-[380px] md:pr-4">
                            <h2 className="font-title mb-2 text-3xl font-light leading-tight tracking-tight md:mb-4 sm:text-4xl md:text-5xl lg:text-5xl">
                                <MorphWordIn>My projects</MorphWordIn>
                            </h2>
                            <p className="projects-intro text-sm leading-relaxed text-[#1b1b18]/60 dark:text-[#EDEDEC]/50 md:text-base">
                                <MaskedWords>{PROJECTS_INTRO}</MaskedWords>
                            </p>
                        </div>

                        <div className="projects-cards-container flex gap-5 md:gap-10 shrink-0">
                        {featuredProjects.map((project, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => openProject(project)}
                                className="project-card group relative z-10 flex h-[58vh] min-h-[400px] w-[calc((100vw-10rem)/1.25)] min-w-[280px] shrink-0 cursor-pointer flex-col justify-between rounded-2xl border border-white/30 bg-white/60 p-6 text-left shadow-lg shadow-black/[0.04] backdrop-blur-xl transition-colors hover:border-white/50 hover:bg-white/80 md:h-[70vh] md:min-h-[520px] md:min-w-0 md:w-[340px] md:p-8 lg:w-[400px] dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20 dark:hover:border-white/20 dark:hover:bg-white/[0.10]"
                            >
                                <div className="min-w-0">
                                    <div className="mb-4 h-36 overflow-hidden rounded-xl bg-[#f5f5f4] dark:bg-[#1e1e1d] md:mb-6 md:h-48 lg:h-56">
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
                                    <h3 className="mb-2 truncate text-lg font-semibold md:text-xl">
                                        {project.title}
                                    </h3>
                                    <p className="line-clamp-6 text-sm leading-relaxed text-[#1b1b18]/60 dark:text-[#EDEDEC]/50 md:line-clamp-none md:text-base">
                                        <MaskedWords>{project.description}</MaskedWords>
                                    </p>
                                </div>
                                <div className="flex gap-2">
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

                        <div className="projects-see-more relative z-10 flex w-[calc((100vw-10rem)/1.25)] min-w-[280px] shrink-0 flex-col justify-center self-center rounded-2xl border border-white/30 bg-white/60 px-8 py-12 shadow-lg shadow-black/[0.06] backdrop-blur-xl md:w-[340px] md:min-w-[340px] dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/30 lg:w-[400px]">
                            <p className="mb-4 text-lg font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                See more
                            </p>
                            <p className="mb-6 text-sm leading-relaxed text-[#1b1b18]/60 dark:text-[#EDEDEC]/50">
                                <MaskedWords>{PROJECTS_ARCHIVE_INTRO}</MaskedWords>
                            </p>
                            <Link
                                href="/projects"
                                className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1b1b18] bg-[#1b1b18] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2d2d2a] dark:border-[#EDEDEC] dark:bg-[#EDEDEC] dark:text-[#0a0a0a] dark:hover:bg-white"
                            >
                                All projects
                                <span aria-hidden>→</span>
                            </Link>
                        </div>
                        </div>

                        <div className="w-8 shrink-0 md:w-24" />
                    </div>
                </section>

                {/* ── What / Why / How ── */}
                <section id="craft" className="overflow-x-hidden px-6 py-28">
                    <div className="mx-auto max-w-[700px]">
                        <div className="space-y-20">
                            {/* WHAT */}
                            <div className="craft-what relative">
                                <span
                                    className="pointer-events-none absolute -top-6 -left-2 select-none font-title text-[96px] font-bold leading-none tracking-tighter text-[#1b1b18]/[0.03] dark:text-[#EDEDEC]/[0.04] sm:text-[128px]"
                                    aria-hidden
                                >
                                    WHAT
                                </span>
                                <div className="relative z-10">
                                    <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-[#1b1b18]/30 dark:text-[#EDEDEC]/30">
                                        01 — what
                                    </span>
                                    <h3 className="font-title mb-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                                        What I do
                                    </h3>
                                    <p className="text-sm leading-relaxed text-[#1b1b18]/70 dark:text-[#EDEDEC]/70 md:text-base">
                                        I build digital products across the full stack. I've worked with marketing agencies, SaaS companies, large organisations and the public sector, building everything from e-commerce platforms and mobile apps to internal tools and AI-powered systems. I'm involved from the architecture through to what the end user actually sees. Most of my recent work has been in AI, building products that automate the kind of work that used to take people hours and making them accessible to people who aren't technical.
                                    </p>
                                </div>
                            </div> 

                            {/* WHY */}
                            <div className="craft-why relative">
                                <span
                                    className="pointer-events-none absolute -top-6 -right-2 select-none font-title text-[96px] font-bold leading-none tracking-tighter text-[#1b1b18]/[0.03] dark:text-[#EDEDEC]/[0.04] sm:text-[128px]"
                                    aria-hidden
                                >
                                    WHY
                                </span>
                                <div className="relative z-10 text-right">
                                    <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-[#1b1b18]/30 dark:text-[#EDEDEC]/30">
                                        02 — why
                                    </span>
                                    <h3 className="font-title mb-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                                        Why I do it
                                    </h3>
                                    <p className="text-sm leading-relaxed text-[#1b1b18]/70 dark:text-[#EDEDEC]/70 md:text-base">
                                        After 6 months in college, I decided that I wanted to build things rather than read about them. I started teaching myself how to code in between lessons before landing a job building websites at a local marketing agency. The first time something I built had a real impact on the businesses we worked with, I understood why I'd dropped out. Since then every move I've made has been toward harder problems and higher stakes. Websites became bespoke software, mobile apps, infrastructure and most recently AI systems - and I'm still not done pulling on that thread.
                                    </p>
                                </div>
                            </div>

                            {/* HOW */}
                            <div className="craft-how relative">
                                <span
                                    className="pointer-events-none absolute -top-6 -left-2 select-none font-title text-[96px] font-bold leading-none tracking-tighter text-[#1b1b18]/[0.03] dark:text-[#EDEDEC]/[0.04] sm:text-[128px]"
                                    aria-hidden
                                >
                                    HOW
                                </span>
                                <div className="relative z-10">
                                    <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-[#1b1b18]/30 dark:text-[#EDEDEC]/30">
                                        03 — how
                                    </span>
                                    <h3 className="font-title mb-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                                        How I do it
                                    </h3>
                                    <p className="mb-8 text-sm leading-relaxed text-[#1b1b18]/70 dark:text-[#EDEDEC]/70 md:text-base">
                                        I learn by building. That's how I taught myself to code and it's still how I pick up anything new. I move fast, ship early, and improve based on what I see rather than what I assumed.
                                    </p>

                                    <div className="space-y-6">
                                        {[
                                            {
                                                label: 'Languages',
                                                items: ['Laravel', 'React', 'TypeScript', 'Flutter', 'Swift', '.NET', 'Tailwind'],
                                            },
                                            {
                                                label: 'Infra & tooling',
                                                items: ['MySQL', 'AWS', 'Azure', 'Git', 'CI/CD'],
                                            },
                                        ].map(({ label, items }) => (
                                            <div key={label}>
                                                <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-[#1b1b18]/25 dark:text-[#EDEDEC]/25">
                                                    {label}
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    {items.map((item) => (
                                                        <span
                                                            key={item}
                                                            className="craft-tech-badge rounded-full border border-[#1b1b18]/10 bg-[#1b1b18]/[0.03] px-3 py-1 font-mono text-xs text-[#1b1b18]/60 dark:border-[#EDEDEC]/10 dark:bg-[#EDEDEC]/[0.04] dark:text-[#EDEDEC]/50"
                                                        >
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Blog ── */}
                <section id="thoughts" className="px-6 py-14">
                    <div className="mx-auto max-w-[700px]">
                        <div className="blog-header relative z-10 overflow-hidden rounded-2xl border border-white/30 bg-white/60 p-8 shadow-lg shadow-black/[0.04] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20 md:p-10">
                            <div className="mb-3 flex items-center justify-between gap-6">
                                <h2 className="font-title text-3xl font-light leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-5xl">
                                    <MorphWordIn>Thoughts</MorphWordIn>
                                </h2>
                                <div className="hidden">
                                    <Link
                                        href="/thoughts"
                                        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#1b1b18] bg-[#1b1b18] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2d2d2a] dark:border-[#EDEDEC] dark:bg-[#EDEDEC] dark:text-[#0a0a0a] dark:hover:bg-white"
                                    >
                                        All posts
                                        <span aria-hidden>→</span>
                                    </Link>
                                </div>
                            </div>
                            <p className="mb-8 text-lg leading-relaxed text-[#1b1b18]/70 dark:text-[#EDEDEC]/70">
                                <MaskedWords>Sometimes I write about things I'm thinking about. Some are quick thoughts, some turn into longer posts.</MaskedWords>
                            </p>

                            <p className="text-sm leading-relaxed text-[#1b1b18]/30 dark:text-[#EDEDEC]/30">
                                Nothing here yet.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── Contact ── */}
                <ContactSection id="contact" title="Say hello" showNewsletter />
            </div>
            <ProjectDrawer project={selectedProject} onClose={closeProject} />
        </>
    );
}
