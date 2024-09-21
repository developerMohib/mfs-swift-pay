/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        "primary" : "#10b981",
        "secondary" : "#22c55e"
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

