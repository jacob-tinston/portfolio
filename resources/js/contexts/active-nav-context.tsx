'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type ActiveNavContextValue = {
    activeNav: string;
    setActiveNav: (section: string) => void;
};

export const ActiveNavContext = createContext<ActiveNavContextValue | null>(null);

export function ActiveNavProvider({
    initial,
    children,
}: {
    initial: string;
    children: React.ReactNode;
}) {
    const [activeNav, setActiveNavState] = useState(initial);
    const setActiveNav = useCallback((section: string) => {
        setActiveNavState(section);
    }, []);

    const value = useMemo(
        () => ({ activeNav, setActiveNav }),
        [activeNav, setActiveNav],
    );

    return (
        <ActiveNavContext.Provider value={value}>
            {children}
        </ActiveNavContext.Provider>
    );
}

export function useActiveNav(): ActiveNavContextValue {
    const ctx = useContext(ActiveNavContext);
    if (!ctx) {
        throw new Error('useActiveNav must be used within ActiveNavProvider');
    }
    return ctx;
}
