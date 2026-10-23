/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e5a93c',
        dark: '#090d0e',
        light: '#f4f0e7',
      },
    },
  },
  plugins: [],
}
