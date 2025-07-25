/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: '#4b5563',
        secondary: '#f43f5e',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
