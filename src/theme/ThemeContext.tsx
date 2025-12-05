import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { themes, ThemeName, Theme } from './themes';

interface ThemeContextType {
    theme: Theme;
    themeName: ThemeName;
    toggleTheme: () => void;
    setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: ThemeName;
}

export const ThemeProvider = ({ children, defaultTheme = 'darkNeutral' }: ThemeProviderProps) => {
    const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);

    const theme = useMemo(() => themes[themeName], [themeName]);

    const toggleTheme = useCallback(() => {
        setThemeName(current => current === 'darkNeutral' ? 'darkBlue' : 'darkNeutral');
    }, []);

    const setTheme = useCallback((name: ThemeName) => {
        setThemeName(name);
    }, []);

    const value = useMemo(() => ({
        theme,
        themeName,
        toggleTheme,
        setTheme,
    }), [theme, themeName, toggleTheme, setTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
