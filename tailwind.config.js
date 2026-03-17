/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A2F23', // Dark Forest Green
          light: '#2A4D39',
        },
        accent: {
          DEFAULT: '#D4E95E', // Lime Green/Citron
          hover: '#C1D84B',
        },
        surface: {
          DEFAULT: '#F8FAF7', // Creamy White
          dark: '#E2E8E0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
