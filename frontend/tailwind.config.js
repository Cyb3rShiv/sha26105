/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#070b14',
          surface: '#0f172a',
          card: '#111c35',
          cardHover: '#162444',
          border: '#1e293b',
          borderLight: '#334155',
          cyan: '#06b6d4',
          cyanGlow: 'rgba(6, 182, 212, 0.2)',
          emerald: '#10b981',
          amber: '#f59e0b',
          crimson: '#ef4444',
          purple: '#8b5cf6',
          textMuted: '#94a3b8',
          textMain: '#f8fafc'
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
        'glow-crimson': '0 0 20px -5px rgba(239, 68, 68, 0.3)',
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'glow-purple': '0 0 20px -5px rgba(139, 92, 246, 0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
