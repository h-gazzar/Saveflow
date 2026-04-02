import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./server/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        black: "var(--black)",
        "off-white": "var(--off-white)",
        accent: "var(--accent)",
        "accent-dim": "var(--accent-dim)",
        muted: "var(--muted)",
        border: "var(--border)",
        card: "var(--card-bg)",
        tag: "var(--tag-bg)",
        "tag-color": "var(--tag-color)"
      },
      fontFamily: {
        sans: ["var(--font-syne)"],
        mono: ["var(--font-dm-mono)"],
        serif: ["var(--font-instrument-serif)"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(200,247,62,0.12), 0 24px 80px rgba(0,0,0,0.3)"
      },
      keyframes: {
        "orb-drift": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(36px,-24px,0) scale(1.08)" }
        }
      },
      animation: {
        "orb-drift": "orb-drift 12s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
