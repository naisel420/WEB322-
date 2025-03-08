/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.html", "./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx}",], 
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["dim"], 
  },
};

