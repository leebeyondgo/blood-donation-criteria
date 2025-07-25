/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6750a4',
        secondary: '#625b71',
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
