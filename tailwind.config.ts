import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paddy: {
          50: "#f2f8ec",
          100: "#e1eed0",
          200: "#c5dea7",
          300: "#a2c974",
          400: "#82b34c",
          500: "#659732",
          600: "#4d7726",
          700: "#3c5c20",
          800: "#324a1f",
          900: "#2b3f1d",
        },
        water: {
          400: "#5fb3d9",
          500: "#3a8fc0",
          600: "#28709e",
        },
        mud: {
          500: "#8a6a4b",
          600: "#6f5439",
          700: "#573f2a",
        },
      },
    },
  },
  plugins: [],
};
export default config;
