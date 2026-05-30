import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type NowMarkdownEditorProps = {
    id: string;
    value: string;
    onChange: (markdown: string) => void;
    placeholder?: string;
    className?: string;
};

function useDocumentColorMode(): 'light' | 'dark' {
    const [mode, setMode] = useState<'light' | 'dark'>(() =>
        typeof document !== 'undefined' &&
        document.documentElement.classList.contains('dark')
            ? 'dark'
            : 'light',
    );

    useEffect(() => {
        const el = document.documentElement;
        const sync = (): void => {
            setMode(el.classList.contains('dark') ? 'dark' : 'light');
        };
        sync();
        const observer = new MutationObserver(sync);
        observer.observe(el, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    return mode;
}

export function NowMarkdownEditor({
    id,
    value,
    onChange,
    placeholder = 'Write something…',
    className,
}: NowMarkdownEditorProps) {
    const [mounted, setMounted] = useState(false);
    const colorMode = useDocumentColorMode();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div
                className={cn(
                    'min-h-[15rem] w-full min-w-0 rounded-md border border-input bg-muted/30 animate-pulse',
                    className,
                )}
                aria-hidden
            />
        );
    }

    return (
        <div className={cn('w-full min-w-0 overflow-hidden', className)}>
            <MDEditor
                value={value}
                onChange={(v) => onChange(v ?? '')}
                preview="live"
                visibleDragbar
                height={280}
                minHeight={200}
                data-color-mode={colorMode}
                textareaProps={{
                    id,
                    name: id,
                    placeholder,
                    spellCheck: true,
                }}
                className="w-full min-w-0 border border-input rounded-md shadow-xs"
            />
        </div>
    );
}
