import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            screens: {
                xs: '420px',
                '3xl': '1920px',
                hxs: { raw: '(min-height: 600px)' },
                hsm: { raw: '(min-height: 800px)' },
                hlg: { raw: '(min-height: 1000px)' },
                hxl: { raw: '(min-height: 1200px)' }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'magicui-spin':
                    'magicui-spin calc(var(--magicui-speed) * 2) infinite linear',
                'magicui-slide':
                    'magicui-slide var(--magicui-speed) ease-in-out infinite alternate'
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'magicui-spin': {
                    '0%': {
                        transform: 'translateZ(0) rotate(0)'
                    },
                    '15%, 35%': {
                        transform: 'translateZ(0) rotate(90deg)'
                    },
                    '65%, 85%': {
                        transform: 'translateZ(0) rotate(270deg)'
                    },
                    '100%': {
                        transform: 'translateZ(0) rotate(360deg)'
                    }
                },
                'magicui-slide': {
                    to: {
                        transform: 'translate(calc(100cqw - 100%), 0)'
                    }
                }
            },
            fontFamily: {
                sans: [
                    'var(--font-geist-sans)',
                    ...defaultTheme.fontFamily.sans
                ],
                mono: [
                    'var(--font-geist-mono)',
                    ...defaultTheme.fontFamily.mono
                ]
            }
        }
    },
    plugins: [require('tailwindcss-animate')]
};
export default config;
