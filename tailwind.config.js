/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#6D28D9',     
        'purple-dark': '#4B2D77', 
        'lavender': '#D8B4FE',    
        'background': '#111827',  
      },
    },
  },
  plugins: [],
}
