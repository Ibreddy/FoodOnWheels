/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0F1115',
          surface: '#181C23',
          card: '#181C23',
          surface2: '#252A34',
          border: '#2A2F3D',
          muted: '#94A3B8'
        },
        brand: {
          orange: '#FF7A00',
          yellow: '#FFB800',
          amber: '#FF9900',
          gold: '#FFD700',
          crimson: '#A51C30',
          burgundy: '#800020',
          darkRed: '#4A0E17',
          emerald: '#2CC55E',
          purple: '#8B5CF6',
          blue: '#3B82F6'
        },
        canva: {
          yellow: '#FFB800',
          gold: '#FFD700',
          amber: '#FF9900',
          red: '#800020',
          darkRed: '#4A0E17',
          crimson: '#A51C30',
          deepRed: '#2B080C'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 25px -5px rgba(255, 107, 0, 0.4)',
        'glow-yellow': '0 0 25px -5px rgba(255, 184, 0, 0.45)',
        'glow-red': '0 0 25px -5px rgba(165, 28, 48, 0.45)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}
