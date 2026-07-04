/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf2f3",
          100: "#fce8ea",
          200: "#f9d0d6",
          300: "#f4a9b4",
          400: "#ee7890",
          500: "#e34f72",
          600: "#cb2f55",
          700: "#ad2447",
          800: "#91213f",
          900: "#7a2039"
        }
      },
      boxShadow: {
        soft: "0 12px 40px -20px rgba(10, 15, 30, 0.35)"
      }
    }
  },
  plugins: []
};
