'use client';

import { MaskedWords } from '@/components/masked-words';
import { MorphWordIn } from '@/components/morph-word-in';
import { Check, Copy } from 'lucide-react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

const CONTACT_EMAIL = 'jacob@tinston.dev';

const socialLinks = [
    { label: 'X', href: 'https://x.com/jacob_tinston', ariaLabel: 'X (Twitter)' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/jacob-tinston', ariaLabel: 'LinkedIn' },
];

function XLogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function LinkedInLogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

export function ContactSection({
    id,
    title = 'Contact',
    showNewsletter = true,
    standalone = false,
}: {
    id?: string;
    title?: string;
    showNewsletter?: boolean;
    /** When true, use same top/bottom padding as other site pages (pt-36 pb-24) */
    standalone?: boolean;
}) {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [copied, setCopied] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!standalone || !sectionRef.current) return;
        const el = sectionRef.current;
        const fromProps = { y: 24, opacity: 0 };
        const toProps = { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' as const };
        const pageRevealDelay = 0.5;

        gsap.fromTo(el.querySelector('.contact-intro'), fromProps, { ...toProps, delay: pageRevealDelay + 0.2 });
        gsap.fromTo(el.querySelector('.contact-newsletter'), {
            y: 28,
            opacity: 0,
            scale: 0.98,
        }, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            delay: pageRevealDelay + 0.3,
            ease: 'power2.out',
        });
        gsap.fromTo(el.querySelector('.contact-socials'), {
            y: 28,
            opacity: 0,
            scale: 0.98,
        }, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            delay: pageRevealDelay + 0.4,
            ease: 'power2.out',
        });
        gsap.fromTo(
            el.querySelectorAll('.contact-intro .word'),
            { yPercent: 120 },
            { yPercent: 0, stagger: 0.04, duration: 0.6, delay: pageRevealDelay + 0.55, ease: 'power2.out' },
        );
    }, [standalone]);

    const copyEmail = () => {
        void navigator.clipboard.writeText(CONTACT_EMAIL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section
            ref={sectionRef}
            id={id}
            className={standalone ? 'pt-36 pb-24' : 'py-32'}
        >
            <div className="mx-auto max-w-[700px] px-6">
                <h2 className="font-title mb-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-5xl">
                    <MorphWordIn>{title}</MorphWordIn>
                </h2>
                <p className="contact-intro mb-12 text-lg leading-relaxed text-[#1b1b18]/70 dark:text-[#EDEDEC]/70">
                    <MaskedWords>
                        {`I'm always happy to hear from people, whether it's about something I've built, something you're working on, or just to chat. Best way to reach me is to drop me an email.`}
                    </MaskedWords>
                </p>

                {showNewsletter && (
                    <div className="contact-newsletter relative z-10 mb-16 rounded-2xl border border-white/30 bg-white/60 p-6 shadow-lg shadow-black/[0.04] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20 md:p-8">
                        <h3 className="mb-2 font-mono text-xs uppercase tracking-widest text-[#1b1b18]/40 dark:text-[#EDEDEC]/40">
                            Get updates from me
                        </h3>
                        <p className="mb-4 text-sm leading-relaxed text-[#1b1b18]/70 dark:text-[#EDEDEC]/70">
                            I occasionally write about the things I&apos;m building, stuff I&apos;m learning, or just
                            general thoughts. I don&apos;t have a schedule, I just write when I have something to say.
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                className="min-w-0 flex-1 rounded-lg border border-[#e3e3e0] bg-[#fafaf9] px-4 py-2.5 text-[#1b1b18] placeholder:text-[#1b1b18]/40 focus:border-[#1b1b18]/30 focus:outline-none focus:ring-2 focus:ring-[#1b1b18]/10 dark:border-[#2a2a28] dark:bg-[#0a0a0a] dark:text-[#EDEDEC] dark:placeholder:text-[#EDEDEC]/40 dark:focus:border-[#EDEDEC]/30 dark:focus:ring-[#EDEDEC]/10"
                                aria-label="Email for newsletter"
                            />
                            <button
                                type="button"
                                className="shrink-0 rounded-full border border-[#1b1b18] bg-[#1b1b18] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2d2d2a] dark:border-[#EDEDEC] dark:bg-[#EDEDEC] dark:text-[#0a0a0a] dark:hover:bg-white"
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                )}

                <div className="contact-socials grid grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-8">
                    <a
                        href={socialLinks[0].href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={socialLinks[0].ariaLabel}
                        className="flex size-10 items-center justify-center justify-self-end text-[#1b1b18]/70 transition-colors hover:text-[#1b1b18] dark:text-[#EDEDEC]/70 dark:hover:text-[#EDEDEC]"
                    >
                        <XLogo className="size-5" />
                    </a>
                    <button
                        type="button"
                        onClick={copyEmail}
                        aria-label={copied ? 'Copied to clipboard' : 'Copy email address'}
                        className="flex cursor-pointer items-center gap-2 text-[#1b1b18] transition-colors hover:text-[#1b1b18]/80 dark:text-[#EDEDEC] dark:hover:text-[#EDEDEC]/90"
                    >
                        <span className="text-base font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                            {CONTACT_EMAIL}
                        </span>
                        <span className="relative flex size-5 shrink-0 items-center justify-center text-[#1b1b18] dark:text-[#EDEDEC]">
                            <Copy
                                className={`size-4 transition-all duration-200 ${
                                    copied ? 'absolute scale-0 opacity-0' : 'scale-100 opacity-100'
                                }`}
                                aria-hidden
                            />
                            <Check
                                className={`size-4 transition-all duration-200 ${
                                    copied ? 'scale-100 opacity-100' : 'absolute scale-0 opacity-0'
                                }`}
                                aria-hidden
                            />
                        </span>
                    </button>
                    <a
                        href={socialLinks[1].href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={socialLinks[1].ariaLabel}
                        className="flex size-10 items-center justify-center justify-self-start text-[#1b1b18]/70 transition-colors hover:text-[#1b1b18] dark:text-[#EDEDEC]/70 dark:hover:text-[#EDEDEC]"
                    >
                        <LinkedInLogo className="size-5" />
                    </a>
                </div>
            </div>
        </section>
    );
}
