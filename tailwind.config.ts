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
          "50": "#f5f3ff",
          "100": "#ede9fe",
          "200": "#ddd6fe",
          "300": "#c4b5fd",
          "400": "#a78bfa",
          "500": "#8b5cf6",
          "600": "#7c3aed",
          "700": "#6d28d9",
          "800": "#5b21b6",
          "900": "#4c1d95",
          DEFAULT: "#8b5cf6",
          foreground: "#ffffff",
        },
        success: { DEFAULT: "#10b981", foreground: "#ffffff" },
        warning: { DEFAULT: "#f59e0b", foreground: "#ffffff" },
        error: { DEFAULT: "#ef4444", foreground: "#ffffff" },
        info: { DEFAULT: "#3b82f6", foreground: "#ffffff" },
        background: "#fafafa",
        card: { DEFAULT: "#ffffff", foreground: "#111827" },
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#8b5cf6",
        foreground: "#111827",
        muted: { DEFAULT: "#f3f4f6", foreground: "#6b7280" },
        destructive: { DEFAULT: "#ef4444", foreground: "#ffffff" },
        secondary: { DEFAULT: "#f3f4f6", foreground: "#111827" },
        accent: { DEFAULT: "#f5f3ff", foreground: "#7c3aed" },
        popover: { DEFAULT: "#ffffff", foreground: "#111827" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        button: "12px",
        input: "12px",
        card: "16px",
        modal: "24px",
        drawer: "24px",
        lg: "12px",
        md: "10px",
        sm: "8px",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.2s ease-out",
        "scale-in": "scale-in 0.15s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
