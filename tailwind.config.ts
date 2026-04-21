import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        raptorPurple: "#2d114f",
        raptorBlack: "#08080b",
        raptorRed: "#c6283f",
        raptorSilver: "#c6c8cf",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(198, 40, 63, 0.35), 0 16px 60px rgba(45, 17, 79, 0.38)",
      },
      animation: {
        "gradient-shift": "gradientShift 10s ease-in-out infinite",
        "fade-up": "fadeUp 0.7s ease-out both",
      },
      keyframes: {
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
