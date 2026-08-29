/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        legal: {
          blue: '#1E40AF',
          navy: '#0F172A',
          sky: '#0284C7',
          bg: '#F8FAFC',
          surface: '#F1F5F9',
          card: '#FFFFFF',
          border: '#E2E8F0',
          text: '#0F172A',
          muted: '#64748B',
          pass: '#16A34A',
          fail: '#DC2626',
          warn: '#D97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
