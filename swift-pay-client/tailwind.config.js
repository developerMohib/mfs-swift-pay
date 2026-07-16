/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        text: "rgb(var(--text-color) / <alpha-value>)",
        bg: "rgb(var(--bg-color) / <alpha-value>)",
        border: "rgb(var(--border-black) / <alpha-value>)",
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },

  plugins: [require("daisyui")],

  daisyui: {
    themes: [
      {
        light: {
          primary: "#16a34a",
          secondary: "#f97316",
          accent: "#16a34a",
          neutral: "#1f2937",

          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#e2e8f0",
          "base-content": "#0f172a",

          info: "#0ea5e9",
          success: "#16a34a",
          warning: "#f59e0b",
          error: "#dc2626",
        },
      },

      {
        dark: {
          primary: "#22c55e",
          secondary: "#fb923c",
          accent: "#22c55e",
          neutral: "#e2e8f0",

          "base-100": "#0f172a",
          "base-200": "#1e293b",
          "base-300": "#334155",
          "base-content": "#e2e8f0",

          info: "#38bdf8",
          success: "#22c55e",
          warning: "#fbbf24",
          error: "#f87171",
        },
      },
    ],
  },
};