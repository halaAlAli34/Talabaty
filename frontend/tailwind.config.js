/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2fe",
          100: "#dbe3fd",
          400: "#5b7cf0",
          500: "#3860ea",
          600: "#2748d6",
          700: "#1f39ab",
        },
        navy: {
          900: "#0d1830",
          800: "#132449",
          700: "#1a2f5c",
        },
        teal: {
          300: "#6ee7c8",
          400: "#3fd6ac",
          500: "#22b992",
        },
        surface: "#eef1f7",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.08)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
