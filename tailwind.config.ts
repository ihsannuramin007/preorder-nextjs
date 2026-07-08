import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FFD400",
          foreground: "#111111",
          "50": "#FFFBE6",
          "100": "#FFF5BF",
          "200": "#FFEC80",
          "300": "#FFE033",
          "400": "#FFD400",
          "500": "#F0C800",
          "600": "#D4B000",
          "700": "#A88A00",
        },
        pink: {
          DEFAULT: "#FF3B6B",
          foreground: "#FFFFFF",
          "50": "#FFF0F4",
          "100": "#FFD6E0",
          "200": "#FFB3C6",
          "300": "#FF7096",
          "400": "#FF3B6B",
          "500": "#F0004A",
          "600": "#CC0040",
        },
        secondary: {
          DEFAULT: "#111111",
          foreground: "#FFFFFF",
        },
        neutral: {
          DEFAULT: "#9A9A9A",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7F7F7",
        },
        success: { DEFAULT: "#10b981", foreground: "#ffffff" },
        warning: { DEFAULT: "#f59e0b", foreground: "#111111" },
        error: { DEFAULT: "#FF3B6B", foreground: "#ffffff" },
        info: { DEFAULT: "#3b82f6", foreground: "#ffffff" },
        background: "#FFFFFF",
        card: { DEFAULT: "#FFFFFF", foreground: "#111111" },
        border: "#E5E7EB",
        "border-strong": "#0D0D0D",
        input: "#E5E7EB",
        ring: "#FFD400",
        foreground: "#111111",
        muted: { DEFAULT: "#F7F7F7", foreground: "#9A9A9A" },
        destructive: { DEFAULT: "#FF3B6B", foreground: "#FFFFFF" },
        accent: { DEFAULT: "#FF3B6B", foreground: "#FFFFFF" },
        popover: { DEFAULT: "#FFFFFF", foreground: "#111111" },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        button: "9999px",
        input: "9999px",
        card: "4px",
        chip: "9999px",
        modal: "24px",
        drawer: "24px",
        lg: "16px",
        md: "8px",
        sm: "4px",
      },
      boxShadow: {
        sticker: "3px 3px 0px #0D0D0D",
        "sticker-sm": "2px 2px 0px #0D0D0D",
        "sticker-lg": "4px 4px 0px #0D0D0D",
      },
      maxWidth: {
        landing: "1280px",
        dashboard: "1440px",
        form: "720px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.85)" },
          "60%": { transform: "scale(1.04)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.2s ease-out",
        "scale-in": "scale-in 0.15s ease-out",
        "bounce-in": "bounce-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        wiggle: "wiggle 0.3s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
