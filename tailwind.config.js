/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'mobile': { 'max': '480px' },
      'non-mobile': { 'min': '481px' }
    },
    colors: {
      'linen': '#FEF0E5',
      'safety-orange': '#FF690D',
      'sea-buckthorn': '#F2994A',
      'heavy-gray': '#8F8F8F',
    }
  },
  plugins: [],
}
