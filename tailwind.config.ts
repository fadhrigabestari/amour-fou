import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        serif: ["var(--font-playfair)"],
        script: ["var(--font-dancing)"],
        vibes: ["var(--font-great-vibes)"],
        pacifico: ["var(--font-pacifico)"],
        lobster: ["var(--font-lobster)"],
      },
    },
  },
  plugins: [],
  darkMode: "class",
} satisfies Config;