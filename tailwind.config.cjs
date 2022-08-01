/* eslint-env node */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        danger: "#ef4444",
        "danger-disabled": "#fecaca",
      },
    },
  },
  plugins: [],
};
