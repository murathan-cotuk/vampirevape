/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9C2CA8',
          light: '#af31bc',
          dark: '#892794',
        },
        secondary: {
          DEFAULT: '#566573',
          light: '#617282',
          dark: '#4b5864',
        },
        accent: {
          DEFAULT: '#ffd300',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

