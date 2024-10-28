/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        primary: 'var(--logo-primary-color)', // green
        secondary: 'var(--logo-secondary-color)', // orange
        tarnary : 'var(--text-black)', //
        text: "rgba(var(--text-color))",
        bg: "rgba(var(--bg-color))",
        border : "rgba(var(--border-black)",
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

