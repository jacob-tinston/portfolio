import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 px-6 py-24 md:py-32">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="space-y-2 text-center">
                            <h1 className="font-title text-xl font-medium tracking-tight">{title}</h1>
                            <p className="text-center text-sm text-[#1b1b18]/65 dark:text-[#EDEDEC]/60">
                                {description}
                            </p>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/30 bg-white/60 p-6 shadow-lg shadow-black/[0.04] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
