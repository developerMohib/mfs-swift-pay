/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        "primary" : "#22c55e",
        "secondary" : "#f97316",
        "tarnary" : "#0f172a",
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

