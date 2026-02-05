/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#09090b", // Zinc 950
        surface: "#18181b", // Zinc 900
        border: "#27272a", // Zinc 800
        primary: "#f59e0b", // Amber 500 (Motorbike vibes)
        "primary-hover": "#ea580c", // Amber 600
        text: "#fafafa", // Zinc 50
        "text-muted": "#a1a1aa", // Zinc 400
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
