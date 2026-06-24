/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#1e1040',
          950: '#0f0a2e',
        },
        accent: {
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
        },
        surface: {
          DEFAULT: '#0f0a2e',
          card:    '#1a1040',
          muted:   '#251558',
          subtle:  '#1e1248',
        },
        ink: {
          DEFAULT: '#f0eeff',
          muted:   '#a78bfa',
          subtle:  '#7c6db5',
        },
        success: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50:  '#fefce8',
          100: '#fef9c3',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        },
        danger: {
          50:  '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card:   '0 1px 3px rgba(139,92,246,.15)',
        float:  '0 10px 40px rgba(139,92,246,.30)',
        glow:   '0 0 20px rgba(139,92,246,.40)',
        soft:   '0 2px 8px rgba(139,92,246,.20)',
        purple: '0 4px 20px rgba(139,92,246,.35)',
      },
      borderRadius: {
        'xl':  '0.875rem',
        '2xl': '1.125rem',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':    'shimmer 2s linear infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(10px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float:   { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
}