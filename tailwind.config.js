/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#cce0ff',
          200: '#99c2ff',
          300: '#66a3ff',
          400: '#3385ff',
          500: '#0066cc',
          600: '#0052a3',
          700: '#003d7a',
          800: '#002952',
          900: '#001429',
        },
        secondary: {
          50: '#f0f9f0',
          100: '#d9f2d9',
          200: '#b3e5b3',
          300: '#8dd88d',
          400: '#66cb66',
          500: '#40be40',
          600: '#339933',
          700: '#267326',
          800: '#1a4d1a',
          900: '#0d260d',
        },
      },
      fontFamily: {
        sans: ['BC Sans', 'Noto Sans', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
