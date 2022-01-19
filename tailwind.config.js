module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/***/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Nunito", "sans-serif"],
    },
    container: {
      center: true,
      padding: "1rem",
    },
  },
};
