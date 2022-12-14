/* eslint-env node */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        "primary-disabled": "#c7d2fe",

        danger: "#ef4444",
        "danger-disabled": "#fecaca",

        neutral: "#f59e0b",
        "neutral-disabled": "#fde68a",
      },
    },
  },
  plugins: [],
};
