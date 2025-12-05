/**
 * Tema: Dark Neutral
 *
 * Paleta escura neutra com acentos em azul
 */

export const colors = {
    // Backgrounds
    background: '#121212',      // Fundo principal
    surface: '#232323',         // Cards, modais, elementos elevados
    field: '#333333',           // Inputs, campos de texto

    // Brand / Accent
    primary: '#1e88e5',         // Azul - ações principais, links, destaques

    // Text
    text: '#ffffff',            // Texto principal
    textSecondary: '#9aa0a6',   // Texto secundário, descrições

    // Borders
    border: '#232323',          // Bordas padrão
    borderDashed: '#4b5563',    // Bordas tracejadas
    borderSubtle: '#333333',    // Bordas sutis

    // Tab Bar
    tabBarActive: '#ffffff',
    tabBarInactive: '#9aa0a6',
} as const;

export type Colors = typeof colors;
export type ColorName = keyof Colors;
