import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        lacquer: "#070706",
        ink: "#11100d",
        carbon: "#1a1814",
        gold: "#c9a765",
        champagne: "#e6d4a6",
        porcelain: "#f6f0df"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(201, 167, 101, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
