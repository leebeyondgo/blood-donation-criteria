/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
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
