/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0faf4',
          100: '#dcf5e5',
          200: '#bbe9ce',
          300: '#87d7ae',
          400: '#4dbd87',
          500: '#29a169',
          600: '#1c8354',
          700: '#186844',
          800: '#165338',
          900: '#12442f',
          950: '#09261b',
        },
        cream: '#faf7f2',
        ink:   '#0f1f17',
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,31,23,0.06), 0 4px 16px rgba(15,31,23,0.08)',
        'card-hover': '0 4px 8px rgba(15,31,23,0.08), 0 12px 32px rgba(15,31,23,0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease both',
        'slide-up': 'slideUp 0.4s ease both',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
      },
    },
  },
  plugins: [],
}