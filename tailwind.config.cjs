/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true,
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontSize: {
        "0.65rem": "0.65rem",
      },
      margin: {
        "300px": "300px",
      },
    },
  },
  plugins: [],
};
