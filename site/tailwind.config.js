/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: '#161311',
        surface_container: '#221f1d',
        surface_container_low: '#1c1917',
        surface_container_lowest: '#100e0c',
        surface_container_high: '#2d2927',
        surface_container_highest: '#383431',
        primary: '#ffb86c',
        primary_container: '#c8863a',
        primary_fixed_dim: '#ffb86c',
        secondary_container: '#3d3935',
        tertiary: '#93d2d1',
        on_surface: '#e9e1dd',
        outline_variant: '#524438',
      },
      fontFamily: {
        newsreader: ['Newsreader', 'serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'headline-lg': ['2rem', { lineHeight: '1.25', letterSpacing: '0' }],
        'headline-md': ['1.75rem', { lineHeight: '1.3', letterSpacing: '0' }],
        'headline-sm': ['1.5rem', { lineHeight: '1.35', letterSpacing: '0' }],
        'title-lg': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'title-md': ['1.125rem', { lineHeight: '1.45', letterSpacing: '0.01em' }],
        'title-sm': ['1rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-md': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'label-lg': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.05em' }],
        'label-md': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.05em' }],
        'label-sm': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.05em' }],
      },
      spacing: {
        '1.5': '0.5rem',
        '16': '5.5rem',
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1.5rem',
      },
      backdropBlur: {
        '24': '24px',
      },
      transitionDuration: {
        '300': '300ms',
      },
      transitionTimingFunction: {
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
