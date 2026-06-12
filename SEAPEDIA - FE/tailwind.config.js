/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        seapedia: {
          DEFAULT: "#1A8FA8",
          dark: "#147287",
          light: "#E6F4F7",
        },
        accent: "#F59E0B", 
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};