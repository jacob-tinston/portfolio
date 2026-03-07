'use client';

import CursorGlyphs from '@/components/cursor-glyphs';
import { TerminalOverlay } from '@/components/terminal-overlay';
import { ActiveNavContext, useActiveNav } from '@/contexts/active-nav-context';
import { useAppearance } from '@/hooks/use-appearance';
import { Link, usePage } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Menu, Moon, Sun, Terminal, X } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

function TerminalToggle({ active, onClick }: { active: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={active ? 'Close terminal' : 'Open terminal'}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/60 text-[#1b1b18] shadow-lg shadow-black/[0.04] backdrop-blur-xl transition-colors hover:text-[#1b1b18]/80 dark:border-white/10 dark:bg-white/[0.06] dark:text-[#EDEDEC] dark:shadow-black/20 dark:hover:text-[#EDEDEC]/90"
        >
            <Terminal className="size-4" aria-hidden />
        </button>
    );
}

function ThemeToggle() {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const cycle = useCallback(() => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    }, [resolvedAppearance, updateAppearance]);

    const Icon = resolvedAppearance === 'dark' ? Moon : Sun;

    return (
        <button
            type="button"
            onClick={cycle}
            aria-label={`Theme: ${resolvedAppearance}. Switch to ${resolvedAppearance === 'dark' ? 'light' : 'dark'}.`}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/60 text-[#1b1b18] shadow-lg shadow-black/[0.04] backdrop-blur-xl transition-colors hover:text-[#1b1b18]/80 dark:border-white/10 dark:bg-white/[0.06] dark:text-[#EDEDEC] dark:shadow-black/20 dark:hover:text-[#EDEDEC]/90"
        >
            <Icon className="size-4" aria-hidden />
        </button>
    );
}

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
    { label: 'About', href: '/', hash: 'about' },
    { label: 'Projects', href: '/projects', hash: 'projects' },
    { label: 'Now', href: '/now', hash: 'now' },
    { label: 'Contact', href: '/contact', hash: 'contact' },
];

const FooterTinston = forwardRef<HTMLElement>(function FooterTinston(_, ref) {
    return (
        <footer
            ref={ref}
            className="footer-tinston relative z-10 w-full min-w-full overflow-x-hidden overflow-y-visible"
        >
            <img
                src="/images/tinston-abc-whyte-inktrap-unlicensed-trial-bold.svg"
                alt=""
                className="w-full object-contain object-bottom brightness-0 dark:invert"
                style={{ marginBottom: '-0.35%' }}
                aria-hidden
            />
        </footer>
    );
});

function getPathname(url: string): string {
    try {
        return new URL(url, 'http://x').pathname;
    } catch {
        return '/';
    }
}

function getInitialActive(pathname: string): string {
    if (pathname === '/') return 'about';
    return pathname.slice(1) || 'about';
}

function NavLinks({
    lenisRef,
    variant,
    onNavigate,
}: {
    lenisRef: React.RefObject<Lenis | null>;
    variant: 'desktop' | 'mobile';
    onNavigate?: () => void;
}) {
    const { url } = usePage();
    const pathname = getPathname(url);
    const isHome = pathname === '/';
    const { activeNav } = useActiveNav();

    const linkClass =
        variant === 'desktop'
            ? `relative px-4 py-1.5 text-sm font-medium transition-colors duration-300`
            : 'block py-3 text-base font-medium transition-colors';
    const activeClass =
        'text-[#1b1b18] dark:text-[#EDEDEC]';
    const inactiveClass =
        'text-[#1b1b18]/50 hover:text-[#1b1b18]/80 dark:text-[#EDEDEC]/40 dark:hover:text-[#EDEDEC]/70';

    return (
        <>
            {NAV_ITEMS.map((item) => {
                const isHashLink = item.href.startsWith('/#');
                const isActive = activeNav === item.hash;
                const baseClass = `${linkClass} ${isActive ? activeClass : inactiveClass}`;
                const underline =
                    variant === 'desktop' ? (
                        <span
                            className={`absolute right-4 bottom-1 left-4 h-[2px] origin-left bg-[#1b1b18] transition-transform duration-300 ease-out dark:bg-[#EDEDEC] ${
                                isActive ? 'scale-x-100' : 'scale-x-0'
                            }`}
                        />
                    ) : null;

                const handleClick = () => {
                    onNavigate?.();
                };

                if (isHashLink && isHome) {
                    const hash = item.href.replace('/', '');
                    return (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={(e) => {
                                e.preventDefault();
                                lenisRef.current?.scrollTo(hash);
                                handleClick();
                            }}
                            className={baseClass}
                        >
                            {item.label}
                            {underline}
                        </a>
                    );
                }

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={baseClass}
                        onClick={handleClick}
                    >
                        {item.label}
                        {underline}
                    </Link>
                );
            })}
        </>
    );
}

function SiteNav({
    lenisRef,
    terminalOpen,
    onTerminalToggle,
}: {
    lenisRef: React.RefObject<Lenis | null>;
    terminalOpen: boolean;
    onTerminalToggle: () => void;
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-4 left-0 right-0 z-50 pt-4">
            <div className="mx-auto flex max-w-[700px] px-6 items-center justify-between gap-4">
                {/* Left: terminal toggle (desktop) / terminal + theme (mobile) */}
                <div className="flex flex-1 items-center justify-start gap-2">
                    <span className="hidden sm:inline-flex">
                        <TerminalToggle active={terminalOpen} onClick={onTerminalToggle} />
                    </span>
                    <span className="flex items-center gap-2 sm:hidden">
                        <TerminalToggle active={terminalOpen} onClick={onTerminalToggle} />
                        <ThemeToggle />
                    </span>
                </div>
                <nav
                    className="hidden items-center gap-1 rounded-full border border-white/30 bg-white/60 px-2 py-1.5 shadow-lg shadow-black/[0.04] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20 sm:flex"
                    aria-label="Main navigation"
                >
                    <NavLinks lenisRef={lenisRef} variant="desktop" />
                </nav>
                <div className="flex flex-1 items-center justify-end">
                    <span className="hidden sm:inline-flex">
                        <ThemeToggle />
                    </span>
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((o) => !o)}
                        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileMenuOpen}
                        className="flex size-9 items-center justify-center rounded-full border border-white/30 bg-white/60 text-[#1b1b18] shadow-lg shadow-black/[0.04] backdrop-blur-xl transition-colors hover:text-[#1b1b18]/80 dark:border-white/10 dark:bg-white/[0.06] dark:text-[#EDEDEC] dark:shadow-black/20 dark:hover:text-[#EDEDEC]/90 sm:hidden"
                    >
                        {mobileMenuOpen ? (
                            <X className="size-4" aria-hidden />
                        ) : (
                            <Menu className="size-4" aria-hidden />
                        )}
                    </button>
                </div>
            </div>
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 top-[72px] z-40 sm:hidden"
                    aria-hidden={!mobileMenuOpen}
                >
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="absolute inset-0"
                        aria-label="Close menu"
                    />
                    <div className="absolute left-6 right-6 top-0 rounded-2xl border border-white/30 bg-white/60 p-4 shadow-lg shadow-black/[0.04] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20">
                        <NavLinks
                            lenisRef={lenisRef}
                            variant="mobile"
                            onNavigate={() => setMobileMenuOpen(false)}
                        />
                    </div>
                </div>
            )}
        </header>
    );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
    const { url } = usePage();
    const pathname = getPathname(url);
    const initialActive = getInitialActive(pathname);
    const [activeNav, setActiveNav] = useState(initialActive);
    const [terminalOpen, setTerminalOpen] = useState(false);
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        if (terminalOpen) {
            lenisRef.current?.stop();
            document.documentElement.classList.add('overflow-hidden');
        } else {
            lenisRef.current?.start();
            document.documentElement.classList.remove('overflow-hidden');
        }
        return () => {
            lenisRef.current?.start();
            document.documentElement.classList.remove('overflow-hidden');
        };
    }, [terminalOpen]);
    const footerRef = useRef<HTMLElement | null>(null);
    const footerTweenRef = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        if (pathname !== '/') {
            setActiveNav(pathname.slice(1) || 'about');
        }
    }, [pathname]);

    // When navigating to home with a hash (e.g. /#contact), scroll to section once Lenis is ready
    useEffect(() => {
        if (pathname !== '/' || typeof window === 'undefined') return;
        const hash = window.location.hash;
        if (!hash) return;
        const timer = setTimeout(() => {
            lenisRef.current?.scrollTo(hash);
        }, 150);
        return () => clearTimeout(timer);
    }, [pathname, url]);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        lenisRef.current = lenis;

        lenis.on('scroll', ScrollTrigger.update);
        const raf = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(raf);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    useEffect(() => {
        const onDrawerOpen = () => lenisRef.current?.stop();
        const onDrawerClose = () => lenisRef.current?.start();
        window.addEventListener('project-drawer:open', onDrawerOpen);
        window.addEventListener('project-drawer:close', onDrawerClose);
        return () => {
            window.removeEventListener('project-drawer:open', onDrawerOpen);
            window.removeEventListener('project-drawer:close', onDrawerClose);
        };
    }, []);

    useEffect(() => {
        const id = requestAnimationFrame(() => {
            const footer = footerRef.current;
            if (!footer) return;
            ScrollTrigger.refresh();
            footerTweenRef.current = gsap.fromTo(
                footer,
                { y: 28, opacity: 0, scale: 0.98 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: footer,
                        start: 'top bottom',
                        once: true,
                    },
                },
            );
            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
                const rect = footer.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.95) {
                    footerTweenRef.current?.play(0);
                }
            });
        });
        return () => {
            cancelAnimationFrame(id);
            footerTweenRef.current?.kill();
            footerTweenRef.current = null;
        };
    }, []);

    const setActiveNavCb = useCallback((section: string) => {
        setActiveNav(section);
    }, []);

    const contextValue = useMemo(
        () => ({ activeNav, setActiveNav: setActiveNavCb }),
        [activeNav, setActiveNavCb],
    );

    return (
        <ActiveNavContext.Provider value={contextValue}>
            <div className="relative isolate flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <CursorGlyphs />
                <div className="relative z-10 isolate flex flex-1 flex-col">
                    <SiteNav
                        lenisRef={lenisRef}
                        terminalOpen={terminalOpen}
                        onTerminalToggle={() => setTerminalOpen((o) => !o)}
                    />
                    <main className="flex-1">{children}</main>
                    <FooterTinston ref={footerRef} />
                </div>
            </div>
            <TerminalOverlay open={terminalOpen} onClose={() => setTerminalOpen(false)} />
        </ActiveNavContext.Provider>
    );
}
