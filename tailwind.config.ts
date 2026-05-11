import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        accent: {
          DEFAULT: '#0071e3',
          hover: '#0077ed',
          dark: '#0058b8',
        },
        ink: {
          DEFAULT: '#1d1d1f',
          subtle: '#86868b',
          muted: '#6e6e73',
        },
        surface: {
          DEFAULT: '#ffffff',
          base: '#fafafa',
          alt: '#f5f5f7',
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.04)',
        card: '0 4px 16px rgba(0,0,0,0.06)',
        lift: '0 16px 40px rgba(0,0,0,0.08)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
      },
    },
  },
  plugins: [animate],
}

export default config
