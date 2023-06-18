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
      keyframes: {
        grow: {
          "0%": { height: "0px", padding: "0 12px" },
          "100%": { height: "56px", padding: "12px 12px" },
        },
        "grow-reverse": {
          "0%": { height: "56px", padding: "12px 12px" },
          "100%": { height: "0px", padding: "0 12px" },
        },
      },
      animation: {
        grow: "grow 0.5s ease-in-out 1",
      },
    },
  },
  plugins: [],
};
