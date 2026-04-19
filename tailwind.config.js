/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        portal: {
          glow: '#97ce4c',
          dark: '#0a0e18',
          abyss: '#050608', // not "void" — some builds drop that token name
          card: '#12161f',
          border: '#2a3142',
          slime: '#b5e48c',
          plasma: '#9d4edd',
        },
      },
      boxShadow: {
        portal: '0 0 28px rgba(151, 206, 76, 0.22), 0 0 1px rgba(151, 206, 76, 0.4)',
        card: '0 4px 24px rgba(0, 0, 0, 0.35)',
      },
      animation: {
        'portal-pulse': 'portal-pulse 5s ease-in-out infinite',
        'portal-spin': 'portal-spin 22s linear infinite',
        'portal-spin-rev': 'portal-spin 30s linear infinite reverse',
        'float-slow': 'float 8s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out both',
      },
      keyframes: {
        'portal-pulse': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.85' },
        },
        'portal-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
