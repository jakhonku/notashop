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
        '2xl': '1320px',
      },
    },
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'system-ui',
          'sans-serif',
        ],
        serif: [
          '"Instrument Serif"',
          '"Cormorant Garamond"',
          'Georgia',
          'serif',
        ],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#1f3a5f',
          hover: '#284a78',
          dark: '#162a45',
        },
        ink: {
          DEFAULT: '#1a1612',
          subtle: '#8a847a',
          muted: '#5e574e',
        },
        surface: {
          DEFAULT: '#ffffff',
          base: '#f5f0e6',
          alt: '#ebe4d3',
          deep: '#0f0d0a',
        },
        gold: {
          DEFAULT: '#b88746',
          soft: '#d9b380',
          deep: '#7d5a2b',
        },
        terracotta: {
          DEFAULT: '#a8624b',
          soft: '#c98a73',
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(26,22,18,0.06)',
        card: '0 6px 24px rgba(26,22,18,0.08)',
        lift: '0 24px 60px rgba(26,22,18,0.14)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'staff-scroll': {
          from: { backgroundPositionX: '0px' },
          to: { backgroundPositionX: '120px' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'staff-scroll': 'staff-scroll 30s linear infinite',
      },
      backgroundImage: {
        'staff-lines':
          'repeating-linear-gradient(0deg, rgba(26,22,18,0.07) 0, rgba(26,22,18,0.07) 1px, transparent 1px, transparent 8px)',
        'paper-grain':
          'radial-gradient(circle at 25% 25%, rgba(184,135,70,0.06) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(31,58,95,0.05) 0%, transparent 50%)',
      },
    },
  },
  plugins: [animate],
}

export default config
