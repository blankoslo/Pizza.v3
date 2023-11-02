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
            colors: {
                'light': '#F1EFE9',
                'fuger': '#C1C1C1',
                'dark': '#303030',
                'green': {
                    'secondary': '#5FE09D',
                    'primary': '#05793C',
                    'tertiary': '#003F1E',
                    'quaternary': '#004B24',
                    'light': '#EDFFF6',
                },
                'yellow': '#FFF8C1',
                'shade': '#6A5412',
                'neutral': '#4E5445',
                'red': {
                    highlight: '#FF9494',
                    light: '#FFB9B9',
                    DEFAULT: '#CB4A4A'
                }
              },
        },
        plugins: [],
    },
}

export default config
