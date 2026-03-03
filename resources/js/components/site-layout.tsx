'use client';

import CursorGlyphs from '@/components/cursor-glyphs';
import { ActiveNavContext, useActiveNav } from '@/contexts/active-nav-context';
import { Link, usePage } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
    { label: 'About', href: '/', hash: 'about' },
    { label: 'Projects', href: '/projects', hash: 'projects' },
    { label: 'Now', href: '/now', hash: 'now' },
    { label: 'Contact', href: '/contact', hash: 'contact' },
];

function FooterTinston() {
    return (
        <footer className="relative z-10 w-full min-w-full overflow-x-hidden overflow-y-visible">
            <img
                src="/images/tinston-abc-whyte-inktrap-unlicensed-trial-bold.svg"
                alt=""
                className="w-full object-contain object-bottom brightness-0"
                style={{ marginBottom: '-0.35%' }}
                aria-hidden
            />
        </footer>
    );
}

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

function SiteNav({ lenisRef }: { lenisRef: React.RefObject<Lenis | null> }) {
    const { url } = usePage();
    const pathname = getPathname(url);
    const isHome = pathname === '/';
    const { activeNav } = useActiveNav();

    return (
        <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pt-4">
            <nav className="flex items-center gap-1 rounded-full border border-white/30 bg-white/60 px-2 py-1.5 shadow-lg shadow-black/[0.04] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20">
                {NAV_ITEMS.map((item) => {
                    const isHashLink = item.href.startsWith('/#');
                    const isActive = activeNav === item.hash;
                    const linkClass =
                        `relative px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${
                            isActive
                                ? 'text-[#1b1b18] dark:text-[#EDEDEC]'
                                : 'text-[#1b1b18]/50 hover:text-[#1b1b18]/80 dark:text-[#EDEDEC]/40 dark:hover:text-[#EDEDEC]/70'
                        }`;
                    const underline = (
                        <span
                            className={`absolute right-4 bottom-1 left-4 h-[2px] origin-left bg-[#1b1b18] transition-transform duration-300 ease-out dark:bg-[#EDEDEC] ${
                                isActive ? 'scale-x-100' : 'scale-x-0'
                            }`}
                        />
                    );

                    if (isHashLink && isHome) {
                        const hash = item.href.replace('/', '');
                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={(e) => {
                                    e.preventDefault();
                                    lenisRef.current?.scrollTo(hash);
                                }}
                                className={linkClass}
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
                            className={linkClass}
                        >
                            {item.label}
                            {underline}
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
    const { url } = usePage();
    const pathname = getPathname(url);
    const initialActive = getInitialActive(pathname);
    const [activeNav, setActiveNav] = useState(initialActive);
    const lenisRef = useRef<Lenis | null>(null);

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

    const setActiveNavCb = useCallback((section: string) => {
        setActiveNav(section);
    }, []);

    const contextValue = useMemo(
        () => ({ activeNav, setActiveNav: setActiveNavCb }),
        [activeNav, setActiveNavCb],
    );

    return (
        <ActiveNavContext.Provider value={contextValue}>
            <div className="relative isolate min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <CursorGlyphs />
                <div className="relative z-10 isolate">
                    <SiteNav lenisRef={lenisRef} />
                    {children}
                    <FooterTinston />
                </div>
            </div>
        </ActiveNavContext.Provider>
    );
}
