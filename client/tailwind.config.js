/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  mode: 'jit',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      'bg-dark': '#0c0c0c',
      'nav-dark': '#111111',
      'main-text-white': '#FBFBFB',
      'search-border': '#2f2f2f',
      'transparent': 'transparent',
      'search-placeholder-dark': '#CBCBCB',
      'search-placeholder-light': '#7f90aa',
      'bg-primary-btn': '#d63aee',
      'bg-primary-btn-hover': '#d94aef',
      'main-gray': '#121212',
      'main-gray-border': '#242424',
      'main-red': '#d2332f',
      'main-red-hover': '#d5413d',
      'orange': '#e39d0b',
      'side-text-gray': '#DADADA',
      'loading-gray': '#202020',
      'loading-light': '#e2e3ea',
      'footer-dark': '#0d0d0d',
      'line-gray': '#4f4f4f',
      'green-dark': '#1CCF3E',
      'green-light': '#18c147',
      'rating-green': '#15a019',
      'no-reviews-bg': '#060606a6',
      'side-text-red': '#ff4d47',
      'limited-stock-orange': '#ffb349',
      'bg-light': '#fdfdfd',
      'nav-light': '#FFFFFF',
      'side-text-light': '#757D8A',
      'main-text-black': '#404D61',
      'light-border': '#E1E3E6',
      'main-text-black-hover': '#4b5a72',
      'in-stock-green-text': '#07A287',
      'in-stock-green-text-dark': '#00D9B3'
    },
    extend: {
      boxShadow: {
        'gray-component-shadow': '0px 0px 4px black',
        'text-box-shadow': '0px 0px 5px #595959',
        'pop-up-shadow': '0px 0px 10px #040404',
        'light-component-shadow': '0px 0px 4px #e3e9f7',
        'pop-up-light-shadow': '0px 0px 14px 3px rgba(0, 0, 0, 0.10), 0px 8px 10px 0px rgba(0, 0, 0, 0.04)'
      }
    },
    screens: {
      '2xl': '1515px',
      'xl': '1215px',
      'lg': '915px',
      'md': '615px',
      'sm': '480px',
      'xs': '420px'
    }
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}