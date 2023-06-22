/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        mainBg: "url('../src/assets/bg.jpg')",
      },
    },
  },

  plugins: [],
};
