const { colors } = require('./src/theme/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                background: colors.background,
                surface: colors.surface,
                field: colors.field,
                primary: colors.primary,
                text: colors.text,
                textSecondary: colors.textSecondary,
                border: colors.border,
                borderDashed: colors.borderDashed,
                borderSubtle: colors.borderSubtle,
            },
        },
    },
    plugins: [],
}
