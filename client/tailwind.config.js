/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  mode: 'jit',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      'bg-dark': '#0e0e0e',
      'nav-dark': '#111111',
      'main-text-white': '#FBFBFB',
      'search-border': '#2f2f2f',
      'transparent': 'transparent',
      'search-placeholder-dark': '#CBCBCB',
      'search-placeholder-light': '#7f90aa',
      'bg-primary-btn': '#2081ff',
      'bg-primary-btn-hover': '#338cff',
      'side-text-blue': '#4c98ff',
      'main-gray': '#121212',
      'main-gray-border': '#242424',
      'main-red': '#d2332f',
      'main-red-hover': '#d5413d',
      'orange': '#e39d0b',
      'side-text-gray': '#DADADA',
      'loading-gray': '#202020',
      'loading-light': '#e9eaef',
      'footer-dark': '#0d0d0d',
      'line-gray': '#4f4f4f',
      'green-dark': '#1CCF3E',
      'green-light': '#18c147',
      'rating-green': '#47b62d',
      'no-reviews-bg': '#060606a6',
      'side-text-red': '#ff5c56',
      'limited-stock-orange': '#ffb349',
      'bg-light': '#fdfdfd',
      'nav-light': '#FFFFFF',
      'side-text-light': '#757D8A',
      'main-text-black': '#404D61',
      'light-border': '#E1E3E6',
      'main-text-black-hover': '#4b5a72'
    },
    extend: {
      boxShadow: {
        'gray-component-shadow': '0px 0px 4px black',
        'text-box-shadow': '0px 0px 5px #595959',
        'pop-up-shadow': '0px 0px 10px #393939',
        'light-component-shadow': '0px 0px 4px #d7dff4',
        'pop-up-light-shadow': '0px 0px 14px 3px rgba(0, 0, 0, 0.10), 0px 8px 10px 0px rgba(0, 0, 0, 0.04)'
      }
    },
    screens: {
      '2xl': '1518px',
      'xl': '1218px',
      'lg': '918px',
      'md': '618px',
      'sm': '480px',
      'xs': '420px'
    }
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}