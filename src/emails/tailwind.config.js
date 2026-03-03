/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}", // your email components
    "./node_modules/@react-email/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#011111',
        'default': '#62636A',
        'main': '#2C8CBE',
        'secondary': '#FA1111',
        'dark-blue': '#1F2937',
      },
      fontSize: {
        // H1 sizes
        'h1-desktop': '60px',
        'h1-tablet': '45px',
        'h1-mobile': '30px',
        // H2 sizes
        'h2-desktop': '40px',
        'h2-tablet': '25px',
        'h2-mobile': '16px',
        // Paragraph
        'p-desktop': '16px',
      },
    },
  },
};