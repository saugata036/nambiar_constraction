/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#D4E6B5',
          100: '#D4E6B5',
          200: '#BDD49A',
          300: '#A6C27F',
          400: '#8FB064',
          500: '#8FB064',
          600: '#789E49',
          700: '#678a3f',
          800: '#567635',
          900: '#45622b',
        },
        secondary: {
          50: '#D4E6B5',
          100: '#BDD49A',
          200: '#A6C27F',
          300: '#8FB064',
          400: '#789E49',
          500: '#789E49',
          600: '#678a3f',
          700: '#567635',
          800: '#45622b',
          900: '#3a5224',
        },
        background: '#F3F4F6',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
