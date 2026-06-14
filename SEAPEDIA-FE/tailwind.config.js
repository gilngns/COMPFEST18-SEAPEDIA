/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        seapedia: {
          DEFAULT: "#006B7A",
          dark: "#005a67",
          light: "#E6F4F7",
        },
        accent: "#FF8C00", 
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};