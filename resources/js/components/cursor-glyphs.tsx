'use client';

import { useEffect, useRef } from 'react';

const GRID = 8;

const CONFIG = {
    spawnRadius: 60,
    fadeRadius: 300,
    spawnRate: 14,
    particleLife: 150,
    particleLifeVariance: 20,
    fontSize: 8,
    maxOpacity: 0.45,
    maxParticles: 800,
    font: '"Courier New", Consolas, monospace',
};

// Glyph-like mix: original ASCII + symbols that feel like inscriptions
const CHARS = '0123456789/\\|+-=<>{}[]()#@&%*~^_.,:;!?$◉◎◆◇†‡§¶·▪▫●○■□'.split('');

function getColor(progress: number, isDark: boolean): string {
    let v: number;
    if (progress < 0.2) {
        v = 26 + (progress / 0.2) * 42;
    } else if (progress < 0.5) {
        v = 68 + ((progress - 0.2) / 0.3) * 68;
    } else if (progress < 0.8) {
        v = 136 + ((progress - 0.5) / 0.3) * 51;
    } else {
        v = 187 + ((progress - 0.8) / 0.2) * 34;
    }
    v = Math.round(v);
    if (isDark) {
        v = 255 - v;
    }
    return `rgb(${v},${v},${v})`;
}

function gridKey(gx: number, gy: number): string {
    return `${gx},${gy}`;
}

interface Particle {
    x: number;
    y: number;
    key: string;
    char: string;
    age: number;
    maxAge: number;
}

export default function CursorGlyphs() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const occupiedRef = useRef<Record<string, boolean>>({});
    const mouseRef = useRef({ x: -200, y: -200 });
    const lastSpawnTimeRef = useRef(0);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            return;
        }

        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const canvas = document.createElement('canvas');
        canvas.style.cssText =
            'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
        wrapper.appendChild(canvas);
        canvasRef.current = canvas;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const context = ctx;

        const particles = particlesRef.current;
        const occupied = occupiedRef.current;

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            // Setting canvas dimensions resets the context transform, so always use
            // setTransform (not scale) to avoid accumulation across multiple resize calls.
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            // Re-apply invariant context state after reset
            context.font = `${CONFIG.fontSize}px ${CONFIG.font}`;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
        }

        resize();
        window.addEventListener('resize', resize);

        function spawnParticle() {
            if (particles.length >= CONFIG.maxParticles) return;

            const { x: mouseX, y: mouseY } = mouseRef.current;
            const ox = (Math.random() - 0.5) * CONFIG.spawnRadius * 2;
            const oy = (Math.random() - 0.5) * CONFIG.spawnRadius * 2;

            if (ox * ox + oy * oy > CONFIG.spawnRadius * CONFIG.spawnRadius) return;

            const gx = Math.round((mouseX + ox) / GRID) * GRID;
            const gy = Math.round((mouseY + oy) / GRID) * GRID;
            const key = gridKey(gx, gy);

            if (occupied[key]) return;
            occupied[key] = true;

            const life =
                CONFIG.particleLife +
                (Math.random() - 0.5) * CONFIG.particleLifeVariance * 2;

            particles.push({
                x: gx,
                y: gy,
                key,
                char: CHARS[Math.floor(Math.random() * CHARS.length)] ?? '·',
                age: 0,
                maxAge: life,
            });
        }

        function animate() {
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);

            // Read isDark once per frame rather than once per particle
            const isDark = document.documentElement.classList.contains('dark');
            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.age += 1;

                if (p.age >= p.maxAge) {
                    delete occupied[p.key];
                    particles.splice(i, 1);
                    continue;
                }

                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const distFactor = Math.max(0, 1 - dist / CONFIG.fadeRadius);

                if (distFactor < 0.01) {
                    delete occupied[p.key];
                    particles.splice(i, 1);
                    continue;
                }

                const progress = p.age / p.maxAge;
                const alpha =
                    (1 - progress * progress) * CONFIG.maxOpacity * distFactor;

                context.fillStyle = getColor(progress, isDark);
                context.globalAlpha = alpha;
                context.fillText(p.char, p.x, p.y);
            }

            context.globalAlpha = 1;

            if (particles.length > 0) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                rafRef.current = null;
            }
        }

        function startLoop() {
            if (rafRef.current === null && particlesRef.current.length > 0) {
                rafRef.current = requestAnimationFrame(animate);
            }
        }

        function onMouseMove(e: MouseEvent) {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;

            const now = performance.now();
            if (now - lastSpawnTimeRef.current < 20) return;
            lastSpawnTimeRef.current = now;

            for (let i = 0; i < CONFIG.spawnRate; i++) {
                spawnParticle();
            }

            startLoop();
        }

        document.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('resize', resize);
            document.removeEventListener('mousemove', onMouseMove);
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
            }
            if (canvas.parentNode === wrapper) {
                wrapper.removeChild(canvas);
            }
            canvasRef.current = null;
            particlesRef.current = [];
            occupiedRef.current = {};
        };
    }, []);

    return (
        <div
            ref={wrapperRef}
            className="pointer-events-none fixed inset-0 z-[-1]"
            aria-hidden="true"
        />
    );
}
