import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        logos: {
          sage: "#749B64",
          sageDark: "#5E8450",
          forest: "#4A6541",
          forestDark: "#344B2D",
          olive: "#5A7C4F",
          cream: "#F7F1E5",
          beige: "#EAE3D2",
          cardGreen: "#6F9560",
          cardGreenLight: "#83A974",
          badgeCream: "#F4EDE0",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        figma: "0 6px 16px -2px rgba(44, 66, 36, 0.25)",
        figmaCard: "0 4px 12px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
