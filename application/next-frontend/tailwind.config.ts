import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            fontFamily: {
                spaceGrotesk: ['"Space Grotesk"', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
                workSans: ['"Work Sans"', 'sans-serif'],
                queensMedium: ['"Queens Condensed Trial Medium"', 'sans-serif'],
                queensRegular: ['"Queens Condensed Trial Regular"', 'sans-serif'],
            },
        },
        plugins: [],
    },
}

export default config
