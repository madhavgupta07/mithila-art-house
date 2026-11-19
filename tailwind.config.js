/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#201B17',
        charcoal: '#3A322B',
        ivory: '#FBF7EF',
        paper: '#F4EBD9',
        sand: '#E9DCC4',
        linen: '#E2D3B8',
        indigoDeep: '#162A45',
        indigo: '#284A70',
        vermilion: '#C13A24',
        terracotta: '#B45C36',
        mustard: '#D6A32C',
        forest: '#2E5B47',
        rose: '#B2606C',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.22em',
        wide2: '0.14em',
      },
      boxShadow: {
        soft: '0 18px 50px -22px rgba(32, 27, 23, 0.35)',
        card: '0 12px 34px -18px rgba(22, 42, 69, 0.45)',
      },
      backgroundImage: {
        'paper-grain': "url('/images/paper-grain.svg')",
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
