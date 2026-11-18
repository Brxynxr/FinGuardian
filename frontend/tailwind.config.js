/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jamar: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          crimson: '#D2132C',
          red: '#E31B23',
          dark: '#9E0D1B',
        },
        credijamar: {
          amber: '#F59E0B',
          gold: '#D97706',
          navy: '#0F2756',
          blue: '#1E40AF',
        },
        obsidian: {
          950: '#070A10',
          900: '#0A0E17',
          850: '#0F1522',
          800: '#141C2C',
          700: '#1E293B',
        }
      },
      boxShadow: {
        'jamar-glow': '0 0 25px -5px rgba(210, 19, 44, 0.35)',
        'jamar-glow-lg': '0 0 35px -5px rgba(227, 27, 35, 0.45)',
        'credijamar-glow': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
      }
    },
  },
  plugins: [],
}
