import { createThemes } from 'tw-colors';

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {

        fontSize: {
            'sm': '12px',
            'base': '14px',
            'xl': '16px',
            '2xl': '20px',
            '3xl': '28px',
            '4xl': '38px',
            '5xl': '50px',
        },

        extend: {
            fontFamily: {
                inter: ["'Inter'", "sans-serif"],
                gelasio: ["'Gelasio'", "serif"],
                sourcecodepro: ['Source Code Pro', 'monospace']
            },
            fontSize: {
                '9xl': '112px',
            }
        },
    },
    plugins: [
        createThemes({
            light: {
                'white': '#FFFFFF',
                'black': '#242424',
                'grey': '#F3F3F3',
                'dark-grey': '#6B6B6B',
                'red': '#E53935',
                'transparent': 'transparent',
                'twitter': '#1DA1F2',
                'purple': '#916bc2'
            },
            dark: {
                'white': '#242424',
                'black': '#F3F3F3',
                'grey': '#2A2A2A',
                'dark-grey': '#E7E7E7',
                'red': '#E53935',
                'transparent': 'transparent',
                'twitter': '#0E71A8',
                'purple': 'hsl(266, 42%, 53%)'
            },
        })
    ],
};