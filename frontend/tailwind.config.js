/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eaf2fc',
          100: '#cde2fb',
          200: '#9ec5f4',
          300: '#6da7ec',
          400: '#3987e5',
          500: '#2a78d6',
          600: '#256abf',
          700: '#184f95',
          800: '#104281',
          900: '#0d366b',
        },
        surface: '#fcfcfb',
        page: '#f9f9f7',
        ink: {
          DEFAULT: '#0b0b0b',
          secondary: '#52514e',
          muted: '#898781',
        },
        hairline: '#e1e0d9',
        status: {
          new: '#2a78d6',
          progress: '#eda100',
          resolved: '#1baf7a',
          closed: '#898781',
        },
        priority: {
          low: '#0ca30c',
          medium: '#fab219',
          high: '#ec835a',
          critical: '#d03b3b',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,11,11,0.06), 0 1px 1px rgba(11,11,11,0.04)',
        popover: '0 8px 24px rgba(11,11,11,0.12)',
      },
      borderRadius: {
        xl: '0.875rem',
      },
    },
  },
  plugins: [],
}
