/**
 * Definição dos temas disponíveis
 */

export const themes = {
    darkBlue: {
        name: 'Dark Blue',
        // Backgrounds
        background: '#15191e',
        surface: '#232931',
        field: '#2d343d',

        // Brand / Accent
        primary: '#1e88e5',

        // Text
        text: '#ffffff',
        textSecondary: '#9aa0a6',

        // Borders
        border: '#232931',
        borderDashed: '#4b5563',
        borderSubtle: '#1f2937',

        // Tab Bar
        tabBarActive: '#ffffff',
        tabBarInactive: '#9aa0a6',
    },
    darkNeutral: {
        name: 'Dark Neutral',
        // Backgrounds
        background: '#121212',
        surface: '#232323',
        field: '#333333',

        // Brand / Accent
        primary: '#1e88e5',

        // Text
        text: '#ffffff',
        textSecondary: '#9aa0a6',

        // Borders
        border: '#232323',
        borderDashed: '#4b5563',
        borderSubtle: '#333333',

        // Tab Bar
        tabBarActive: '#ffffff',
        tabBarInactive: '#9aa0a6',
    },
} as const;

export type ThemeName = keyof typeof themes;
export type Theme = typeof themes[ThemeName];
