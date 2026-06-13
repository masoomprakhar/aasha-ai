const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', ...defaultTheme.fontFamily.sans],
        display: ['Geist', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        ink: '#111827',
        body: '#374151',
        muted: '#6B7280',
        faint: '#9CA3AF',
        canvas: '#FFFFFF',
        subtle: '#FFFFFF',
        border: '#E5E7EB',
        brand: {
          DEFAULT: '#DB2777',
          dark: '#BE185D',
          light: '#F472B6',
          wash: '#F9FAFB',
          ring: '#E5E7EB',
          magenta: '#C026D3',
        },
        success: '#10B981',
        warning: '#F59E0B',
        critical: '#EF4444',
        phone: '#111827',
        paper: '#FFFFFF',
        panel: '#FFFFFF',
        line: '#E5E7EB',
        teal: { DEFAULT: '#DB2777', 2: '#BE185D' },
        ink_legacy: '#111827',
      },
      borderRadius: {
        card: '12px',
        button: '8px',
        pill: '999px',
        phone: '2.75rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
        card: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(17,24,39,0.06)',
        lift: '0 8px 30px rgba(17,24,39,0.08)',
        phone: '0 25px 50px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
        glow: '0 4px 24px rgba(17,24,39,0.06)',
      },
      fontSize: {
        display: ['clamp(2.25rem, 4.5vw, 3.5rem)', { lineHeight: '1.08', letterSpacing: '-0.035em', fontWeight: '600' }],
        headline: ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.12', letterSpacing: '-0.03em', fontWeight: '600' }],
        lead: ['1.125rem', { lineHeight: '1.65', fontWeight: '400', letterSpacing: '-0.01em' }],
        body: ['0.9375rem', { lineHeight: '1.6', letterSpacing: '-0.006em' }],
        caption: ['0.8125rem', { lineHeight: '1.5', letterSpacing: '-0.004em' }],
      },
      transitionTimingFunction: {
        saas: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'phone-float': 'phone-float 5s ease-in-out infinite',
        wave: 'wave 1.2s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        blob: 'blob 8s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 2.4s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
      },
      keyframes: {
        'phone-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(12px, -18px) scale(1.04)' },
          '66%': { transform: 'translate(-10px, 10px) scale(0.98)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
