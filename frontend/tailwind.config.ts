import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#111621", 2: "#1A2332", 3: "#222E40", 4: "#2B3A4F" },
        accent: { DEFAULT: "#AE9159", 2: "#9A7E4B", 3: "#7A6238" },
        border: { DEFAULT: "#2B3A4F", 2: "#3D4F68" },
        gold: { DEFAULT: "#AE9159", light: "#C4A86E", dark: "#8A703F" },
        light: { DEFAULT: "#D5D1C9", 2: "#E3DFD8" },
      },
      fontFamily: {
        display: ["Michroma", "system-ui", "sans-serif"],
        sans: ["Montserrat", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
