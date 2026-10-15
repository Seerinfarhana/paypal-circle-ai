/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#001C64',
        brand: { DEFAULT: '#0070E0', dark: '#0058B3' },
        sky: '#009CDE',
        mist: '#F4F8FF',
        page: '#F7F9FC',
        ink: '#0B1736',
        muted: '#52627F',
        ok: { DEFAULT: '#047857', soft: '#E6F6EF' },
        warn: { DEFAULT: '#B45309', soft: '#FEF3E2' },
        bad: { DEFAULT: '#B91C1C', soft: '#FDECEC' },
      },
      fontFamily: { sans: ['"Geist Variable"', 'Inter', 'system-ui', 'sans-serif'] },
      borderRadius: { card: '20px', xl2: '24px' },
      boxShadow: {
        card: '0 1px 2px rgba(0,28,100,.04), 0 10px 28px -14px rgba(0,28,100,.12)',
        float: '0 24px 60px -24px rgba(0,28,100,.35)',
      },
      keyframes: {
        dot: { '0%,80%,100%': { opacity: '.25', transform: 'translateY(0)' }, '40%': { opacity: '1', transform: 'translateY(-3px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        ring: { '0%': { boxShadow: '0 0 0 0 rgba(0,112,224,.45)' }, '100%': { boxShadow: '0 0 0 10px rgba(0,112,224,0)' } },
      },
      animation: {
        dot: 'dot 1.1s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
        ring: 'ring 1.8s ease-out infinite',
      },
    },
  },
  plugins: [],
}
