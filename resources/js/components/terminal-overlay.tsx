'use client';

import { projects } from '@/data/projects';
import { useAppearance } from '@/hooks/use-appearance';
import { useCallback, useEffect, useRef, useState } from 'react';

type LineType = 'command' | 'output' | 'error' | 'success' | 'blank';

interface Line {
    type: LineType;
    text: string;
}

const PROMPT = 'jacob@tinston.dev ~ %';

const INITIAL_LINES: Line[] = [
    { type: 'output', text: 'Welcome. Type `help` to see available commands.' },
    { type: 'blank', text: '' },
];

const HELP_TEXT = `Available commands:

  help -        show this help text
  whoami -      who is Jacob
  about -       about & skills
  projects -    list projects
  now -         what I'm up to now
  contact -     contact details
  ls -          list site pages
  theme -       toggle dark/light mode
  clear -       clear the terminal
  exit -        close terminal`;

const WHOAMI_TEXT = `Jacob Tinston
Software & AI Engineer - Middlesbrough, UK`;

const ABOUT_TEXT = `I build digital products across the full stack. I've worked with marketing agencies, SaaS companies, large organisations and the public sector, building everything from e-commerce platforms and mobile apps to internal tools and AI-powered systems. I'm involved from the architecture through to what the end user actually sees. Most of my recent work has been in AI, building products that automate the kind of work that used to take people hours and making them accessible to people who aren't technical.

After 6 months in college, I decided that I wanted to build things rather than read about them. I started teaching myself how to code in between lessons before landing a job building websites at a local marketing agency. The first time something I built had a real impact on the businesses we worked with, I understood why I'd dropped out. Since then every move I've made has been toward harder problems and higher stakes. Websites became bespoke software, mobile apps, infrastructure and most recently AI systems - and I'm still not done pulling on that thread.

I learn by building. That's how I taught myself to code and it's still how I pick up anything new. I move fast, ship early, and improve based on what I see rather than what I assumed.

Stack I use:
  — Laravel
  — React
  - TypeScript
  - Flutter
  - Swift
  - .NET
  - Tailwind
  - MySQL
  - AWS
  - Azure
  - Git
  - CI/CD`;

const NOW_TEXT = `Building
Currently at Altlabs looking after existing clients, working on new projects and building a range of AI products. The new stuff is where most of my energy goes but improving what's already there is just as interesting when the problems are right.

Learning
Expanding my knowledge on AI architecture and systems design. Spending most of my time right now on RAG and retrieval patterns, but also working through how to build LLM-powered systems that are reliable in production.

Reading
Halfway through 'Cosmos' by Carl Sagan. I've always been fascinated by the vastness of the universe - it's interesting to think about our role in it and how we fit in.`;

const CONTACT_TEXT = `Email      → jacob@tinston.dev
X          → x.com/jacob_tinston
LinkedIn   → linkedin.com/in/jacob-tinston`;

const LS_TEXT = `/
/projects
/now
/contact`;

export function TerminalOverlay({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [lines, setLines] = useState<Line[]>(INITIAL_LINES);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const inputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);

    // Focus input when opened
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [open]);

    // Reset all state after close animation
    useEffect(() => {
        if (!open) {
            const timer = setTimeout(() => {
                setLines(INITIAL_LINES);
                setInput('');
                setHistory([]);
                setHistoryIndex(-1);
                setIsFullscreen(false);
            }, 350);
            return () => clearTimeout(timer);
        }
    }, [open]);

    // Escape to close
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    const scrollToBottom = useCallback(() => {
        requestAnimationFrame(() => {
            if (outputRef.current) {
                outputRef.current.scrollTop = outputRef.current.scrollHeight;
            }
        });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [lines, scrollToBottom]);

    const addLines = useCallback((...newLines: Line[]) => {
        setLines((prev) => [...prev, ...newLines]);
    }, []);

    const processCommand = useCallback(
        (raw: string) => {
            const cmd = raw.trim().toLowerCase();
            addLines({ type: 'command', text: `${PROMPT} ${raw}` });

            if (!cmd) {
                addLines({ type: 'blank', text: '' });
                return;
            }

            setHistory((h) => [raw, ...h]);
            setHistoryIndex(-1);

            switch (cmd) {
                case 'help':
                    HELP_TEXT.split('\n').forEach((line) =>
                        addLines({ type: 'output', text: line }),
                    );
                    break;
                case 'whoami':
                    WHOAMI_TEXT.split('\n').forEach((line) =>
                        addLines({ type: 'output', text: line }),
                    );
                    break;
                case 'about':
                    ABOUT_TEXT.split('\n').forEach((line) =>
                        addLines({ type: 'output', text: line }),
                    );
                    break;
                case 'projects':
                    addLines({ type: 'output', text: 'Projects:' });
                    addLines({ type: 'blank', text: '' });
                    projects.forEach((p, i) => {
                        addLines({ type: 'output', text: `  ${i + 1}. ${p.title}` });
                        addLines({ type: 'output', text: `     ${p.description}` });
                        addLines({ type: 'output', text: `     [${p.tags.join(', ')}]` });
                        if (i < projects.length - 1) addLines({ type: 'blank', text: '' });
                    });
                    break;
                case 'now':
                    NOW_TEXT.split('\n').forEach((line) =>
                        addLines({ type: 'output', text: line }),
                    );
                    break;
                case 'contact':
                    CONTACT_TEXT.split('\n').forEach((line) =>
                        addLines({ type: 'output', text: line }),
                    );
                    break;
                case 'ls':
                    LS_TEXT.split('\n').forEach((line) =>
                        addLines({ type: 'output', text: line }),
                    );
                    break;
                case 'clear':
                    setLines([]);
                    return;
                case 'theme':
                    updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
                    addLines({
                        type: 'success',
                        text: `Switched to ${resolvedAppearance === 'dark' ? 'light' : 'dark'} mode.`,
                    });
                    break;
                case 'exit':
                case 'quit':
                    onClose();
                    return;
                default:
                    addLines({
                        type: 'error',
                        text: `command not found: ${cmd}. Type 'help' for available commands.`,
                    });
            }

            addLines({ type: 'blank', text: '' });
        },
        [addLines, onClose, resolvedAppearance, updateAppearance],
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            processCommand(input);
            setInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHistoryIndex((i) => {
                const next = Math.min(i + 1, history.length - 1);
                setInput(history[next] ?? '');
                return next;
            });
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHistoryIndex((i) => {
                const next = Math.max(i - 1, -1);
                setInput(next === -1 ? '' : (history[next] ?? ''));
                return next;
            });
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
                    open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Terminal window */}
            <div
                className={`fixed z-[60] flex flex-col bg-[#0d0d0b] overflow-hidden transition-all duration-300 ease-out
                    ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-[0.98] pointer-events-none'}
                    ${isFullscreen
                        ? 'inset-0 rounded-none border-0'
                        : 'top-20 bottom-4 left-4 right-4 rounded-2xl border border-white/10 shadow-2xl sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:right-auto sm:w-[700px] sm:h-[560px] sm:-translate-x-1/2 sm:-translate-y-1/2'
                    }`}
                onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.focus();
                }}
            >
                {/* Title bar */}
                <div className="flex shrink-0 items-center gap-2 border-b border-white/[0.08] px-4 py-3">
                    <div className="flex gap-1.5">
                        {/* Red — close */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close terminal"
                            className="size-3 rounded-full bg-[#ff5f57] transition-opacity hover:opacity-80"
                        />
                        {/* Yellow — restore to normal */}
                        <button
                            type="button"
                            onClick={() => setIsFullscreen(false)}
                            aria-label="Restore terminal"
                            className="size-3 rounded-full bg-[#febc2e] transition-opacity hover:opacity-80"
                        />
                        {/* Green — fullscreen */}
                        <button
                            type="button"
                            onClick={() => setIsFullscreen(true)}
                            aria-label="Fullscreen terminal"
                            className="size-3 rounded-full bg-[#28c840] transition-opacity hover:opacity-80"
                        />
                    </div>
                    <span className="flex-1 text-center font-mono text-xs text-[#EDEDEC]/30">
                        jacob@tinston.dev — terminal
                    </span>
                </div>

                {/* Output — scrollable */}
                <div
                    ref={outputRef}
                    className="flex-1 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed sm:px-5 sm:py-4 sm:text-sm"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    {lines.map((line, i) => (
                        <div
                            key={i}
                            className={
                                line.type === 'command'
                                    ? 'text-[#EDEDEC]'
                                    : line.type === 'error'
                                      ? 'text-red-400'
                                      : line.type === 'success'
                                        ? 'text-green-400'
                                        : line.type === 'blank'
                                          ? 'h-3'
                                          : 'text-[#EDEDEC]/55'
                            }
                        >
                            {line.text || '\u00A0'}
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="flex shrink-0 items-center gap-2 border-t border-white/[0.08] px-4 py-2.5 sm:gap-3 sm:px-5 sm:py-3">
                    <span className="shrink-0 font-mono text-xs text-[#EDEDEC]/35 sm:text-sm">
                        {PROMPT}
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent font-mono text-xs text-[#EDEDEC] caret-[#EDEDEC] outline-none placeholder:text-[#EDEDEC]/20 sm:text-sm"
                        placeholder="type a command..."
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        aria-label="Terminal input"
                    />
                </div>
            </div>
        </>
    );
}
