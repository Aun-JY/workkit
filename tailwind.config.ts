import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        border: 'var(--border)',
        border2: 'var(--border2)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        muted2: 'var(--muted2)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        'accent-border': 'var(--accent-border)',
        green: 'var(--green)',
        'green-soft': 'var(--green-soft)',
        'green-border': 'var(--green-border)',
        blue: 'var(--blue)',
        'blue-soft': 'var(--blue-soft)',
        'blue-border': 'var(--blue-border)',
        star: 'var(--star)',
        'star-soft': 'var(--star-soft)',
        'star-border': 'var(--star-border)',
      },
      fontFamily: {
        display: ['Nunito', 'sans-serif'],
        body: ['Nunito Sans', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        'card-lg': '24px',
        pill: '999px',
        input: '14px',
        icon: '10px',
        'icon-lg': '14px',
      },
      boxShadow: {
        card: '0 12px 28px rgba(255,107,43,0.10)',
      },
      transitionProperty: {
        all: 'all',
      },
      transitionTimingFunction: {
        ease: 'ease',
      },
      transitionDuration: {
        200: '200ms',
      },
    },
  },
  plugins: [],
};

export default config;
